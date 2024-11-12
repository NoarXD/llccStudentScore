import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });

  const isSignInPage = req.nextUrl.pathname === '/admin';

  if (!token || token.user !== "llccxmiller") {
    if (!isSignInPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};