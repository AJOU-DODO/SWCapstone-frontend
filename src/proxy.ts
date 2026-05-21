// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/callback')) {
    return NextResponse.next()
  }

  if (accessToken) {
    return NextResponse.next()
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // 액세스 토큰 없고 리프레시 토큰 있으면 갱신 시도
  if (!accessToken && refreshToken) {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_SERVER_IP || 'http://localhost:8080'
      const res = await fetch(`${BASE_URL}/api/v1/auth/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (res.ok) {
        const data = await res.json()
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data

        // 새 토큰을 쿠키에 심어서 원래 페이지로 이동
        const response = NextResponse.next()
        response.cookies.set('accessToken', newAccessToken, {
          path: '/',
          maxAge: 60 * 30,
          sameSite: 'lax',
          secure: true,
        })
        response.cookies.set('refreshToken', newRefreshToken, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: true,
        })
        return response
      } else {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch {
      // 갱신 실패 시 로그인 페이지로
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}