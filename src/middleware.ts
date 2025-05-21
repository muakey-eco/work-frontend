import { NextRequest, NextResponse } from 'next/server'
import { isLoggedIn } from './libs/auth'
import { getMe } from './libs/data'
import { getSession } from './libs/session'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthenticated = await isLoggedIn()

  if (path.includes('admin')) {
    var user = await getMe()
  }

  const session = await getSession()
  const today = new Date().getDate()

  const isAdmin = user?.role === 'Admin'

  if (isAdmin && path === '/admin') {
    return NextResponse.redirect(new URL('/admin/accounts', request.url))
  }

  if (today !== session.firstLoginDate) {
    session.isCheckedIn = false
    await session.save()
  }

  if (!isAuthenticated && path !== '/login' && path !== '/login/') {
    return NextResponse.redirect(new URL('/login', request.url))
  } else if (
    isAuthenticated &&
    (['/login', '/signup', '/'].includes(path) ||
      (!isAdmin && path.includes('admin')))
  ) {
    return NextResponse.redirect(new URL('/workflows', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
