// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 브라우저가 보낸 쿠키에서 accessToken 꺼내기
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // 💡 무한 루프 방지: 만약 가려는 주소가 이미 로그인 페이지(/admin/login)라면 검사를 패스합니다.
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // 토큰이 없는데 관리자 페이지 구역으로 들어오려고 하면 로그인 페이지로 즉시 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

// 어떤 주소에서 이 미들웨어를 켤지 결정하는 매처
export const config = {
  // /admin으로 시작하는 모든 경로에서 이 미들웨어가 작동합니다.
  matcher: ['/admin/:path*']
}