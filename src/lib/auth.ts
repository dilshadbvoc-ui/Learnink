import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const adminUser = process.env.ADMIN_USER || "admin";
                const adminPass = process.env.ADMIN_PASS || "admin123";

                if (credentials?.username === adminUser && credentials?.password === adminPass) {
                    return { id: "1", name: "Administrator", role: "admin" };
                }
                return null;
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
