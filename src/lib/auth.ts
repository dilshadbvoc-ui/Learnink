import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();

                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await User.findOne({ username: credentials.username });

                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.username,
                    role: user.role
                };
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-expect-error role is not defined in default session
                session.user.role = token.role;
                // @ts-expect-error id is not defined in default session
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role?: string }).role;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
