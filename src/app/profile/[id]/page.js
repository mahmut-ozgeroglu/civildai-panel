// src/app/profile/[id]/page.js

// 1. Prisma'yı çağırmak için (3 nokta yukarı çıkıp lib'e giriyoruz):
import { prisma } from "../../../lib/prisma"; 

// 2. Actions dosyasını çağırmak için (2 nokta yukarı çıkıp app klasöründeki actions'ı alıyoruz):
import { getUserProjects } from "../../actions"; 

import PublicProfileClient from "./PublicProfileClient"; 
import { notFound } from "next/navigation";

export default async function PublicProfilePage({ params }) {
  // Next.js 15+ uyumluluğu için await
  const { id } = await params;

  // 1. Hedef Kullanıcıyı Bul
  const targetUser = await prisma.user.findUnique({
    where: { id },
    include: {
        projects: true,
    }
  });

  if (!targetUser) {
      return notFound();
  }

  // 2. Kullanıcının Projelerini Getir
  const projects = await getUserProjects(targetUser.id);

  return <PublicProfileClient user={targetUser} projects={projects} />;
}