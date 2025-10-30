import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    pages: { signIn: "/signin" },
    callbacks: {
      authorized: ({ token, req }) => {
        const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
        if (!isDashboard) return true;
        const role = (token as any)?.role;
        return role === "administrator" || role === "staff";
      },
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };


