// src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  // 1. Gidilmek istenen sayfayı al
  const path = request.nextUrl.pathname;

  // 2. Eğer kullanıcı Dashboard'a girmeye çalışıyorsa
  if (path.startsWith("/dashboard")) {
    
    // 3. Çerezlerdeki "session" biletini al
    const session = request.cookies.get("session")?.value;

    // 4. Bilet yoksa veya geçersizse -> Login sayfasına at
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Bileti doğrula (Sahte mi gerçek mi?)
      const secret = new TextEncoder().encode("civildai");
      await jwtVerify(session, secret);
      // Her şey yolundaysa geçmesine izin ver
      return NextResponse.next();
    } catch (error) {
      // Bilet sahteyse -> Login sayfasına at
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Hangi sayfalarda çalışsın?
export const config = {
  matcher: ["/dashboard/:path*"], // Dashboard ve altındaki her şeyi koru
};