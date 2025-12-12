// src/app/network/page.js
import { searchUsers } from "../actions";
import { prisma } from "../../lib/prisma"; // @/lib/prisma çalışmıyorsa ../../ kullan
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import NetworkClient from "./NetworkClient"; 

export default async function NetworkPage() {
  const session = (await cookies()).get("session")?.value;
  let user = null;
  let initialUsers = [];

  if (session) {
    try {
        const secret = new TextEncoder().encode("civildai");
        const { payload } = await jwtVerify(session, secret);
        user = await prisma.user.findUnique({ 
            where: { email: payload.email },
            include: { following: true } // <-- Takip ettiklerini de getir
        });
    } catch(e) {}
  }

  // Başlangıçta herkesi getir (Veya boş getirip arama bekleyebilirsin, biz herkesi getirelim dolu gözüksün)
  initialUsers = await searchUsers({ type: 'ALL' });

  return <NetworkClient currentUser={user} initialUsers={initialUsers} />;
}