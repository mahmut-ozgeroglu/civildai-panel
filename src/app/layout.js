// src/app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'; // Oluşturduğumuz Header'ı çağır
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Civildai | İnşaatın Dijital Ekosistemi',
  description: 'İnşaat sektörü için profesyonel iş ve proje yönetim platformu.',
}

// Kullanıcı oturumunu kontrol eden yardımcı fonksiyon
async function getUser() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    const secret = new TextEncoder().encode("civildai");
    const { payload } = await jwtVerify(session, secret);
    return await prisma.user.findUnique({ where: { email: payload.email } });
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const user = await getUser(); // Kullanıcıyı sunucuda çek

  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Header'ı buraya koyuyoruz. user varsa gösterir, yoksa (login sayfası) gizler */}
        <Header user={user} /> 
        
        {/* Sayfa içerikleri buraya gelir */}
        {children}
      </body>
    </html>
  )
}