// src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Korunan rotalar (Giriş yapmadan girilemeyecek yerler)
  const protectedRoutes = ['/dashboard', '/profile', '/network', '/jobs', '/projects', '/messages'];
  
  // Giriş yapmış kullanıcının girmesine gerek olmayan rotalar
  const authRoutes = ['/login', '/register'];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. Eğer sayfaya koruma lazımsa ve oturum yoksa -> Login'e at
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Eğer zaten giriş yapmışsa ve Login/Register'a girmeye çalışıyorsa -> Dashboard'a at
  if (isAuthRoute && session) {
    try {
        const secret = new TextEncoder().encode("civildai");
        await jwtVerify(session, secret);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
        // Token bozuksa devam etsin (Login sayfasına düşer)
    }
  }

  return NextResponse.next();
}

// Hangi yollarda çalışacağını belirtiyoruz
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};