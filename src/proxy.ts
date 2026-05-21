// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/callback')) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}