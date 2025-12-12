// src/app/profile/page.js
import { prisma } from "../../lib/prisma"; // DÜZELDİ: (2 üst klasöre çık: src/app -> src -> lib)
import { getUserProjects } from "../actions"; // DÜZELDİ: (1 üst klasöre çık: src/app -> actions)
import PublicProfileClient from "./[id]/PublicProfileClient"; // Mevcut tasarımı kullanabiliriz
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // 1. Oturum Açmış Kullanıcıyı Bul
  const session = (await cookies()).get("session")?.value;
  
  if (!session) {
      redirect("/login");
  }

  let user = null;
  try {
      const secret = new TextEncoder().encode("civildai");
      const { payload } = await jwtVerify(session, secret);
      user = await prisma.user.findUnique({ 
          where: { email: payload.email },
          include: { projects: true } // Projeleriyle birlikte al
      });
  } catch(e) {
      redirect("/login");
  }

  if (!user) redirect("/login");

  // 2. Projelerini Getir
  const projects = await getUserProjects(user.id);

  // 3. Kendi profilimizi, sanki başkası bakıyormuş gibi aynı tasarımla gösterelim
  // Not: PublicProfileClient dosyasının yolu "./[id]/PublicProfileClient" olmalı çünkü [id] klasörünün içinde.
  return <PublicProfileClient user={user} projects={projects} />;
}