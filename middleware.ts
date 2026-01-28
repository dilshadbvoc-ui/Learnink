import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow access to login page
                if (req.nextUrl.pathname.startsWith("/admin/login")) {
                    return true;
                }
                // Require token for all other admin pages
                return !!token;
            },
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
