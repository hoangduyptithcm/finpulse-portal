import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isLoggedIn) {
            const host =
              request.headers.get("x-forwarded-host") ||
              request.headers.get("host") ||
              nextUrl.host;
            const proto =
              request.headers.get("x-forwarded-proto") ||
              (nextUrl.protocol ? nextUrl.protocol.replace(":", "") : "https");
            return Response.redirect(new URL("/admin", `${proto}://${host}`));
          }
          return true;
        }
        if (isLoggedIn) return true;
        return false; // Redirects to login
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: unknown; id?: unknown }).role = token.role;
        (session.user as { role?: unknown; id?: unknown }).id = token.id;
      }
      return session;
    },
  },
  providers: [],
};
