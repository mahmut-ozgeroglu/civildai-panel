// src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const session = request.cookies.get('session')?.value;
  const { pathname, host } = request.nextUrl;

  // --- 1. DOMAIN YÖNLENDİRMESİ (YENİ) ---
  // Eğer kullanıcı 'civildai-panel.vercel.app' adresinden giriyorsa,
  // onu zorla 'civildai.com' adresine gönder.
  if (host.includes('vercel.app')) {
     return NextResponse.redirect(`https://civildai.com${pathname}`, 301);
  }

  // --- 2. GÜVENLİK KONTROLLERİ (ESKİ) ---
  const protectedRoutes = ['/dashboard', '/profile', '/network', '/jobs', '/projects', '/messages'];
  const authRoutes = ['/login', '/register'];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Giriş yapmamışsa ve korumalı alana girmeye çalışıyorsa -> Login'e at
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Zaten giriş yapmışsa ve Login/Register'a girmeye çalışıyorsa -> Dashboard'a at
  if (isAuthRoute && session) {
    try {
        const secret = new TextEncoder().encode("civildai");
        await jwtVerify(session, secret);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
        // Token bozuksa devam etsin
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};