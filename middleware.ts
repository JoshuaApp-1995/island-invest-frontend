import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/dashboard", "/publish"]
const SESSION_COOKIE_NAME = "islandinvest_session"

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)
  const isProtectedRoute = PROTECTED_ROUTES.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !session) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/publish"],
}
