// src/app/projects/[id]/page.js
import { getProjectDetails } from "../../actions";
import { prisma } from "../../lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient"; // Birazdan yapacağız

export default async function ProjectDetailPage({ params }) {
  // 1. Proje ID'sini al (await params yapılmalı Next.js 15+ için)
  const { id } = await params;

  // 2. Oturum Kontrolü
  const session = (await cookies()).get("session")?.value;
  if (!session) redirect("/login");

  let currentUser = null;
  try {
     const secret = new TextEncoder().encode("civildai");
     const { payload } = await jwtVerify(session, secret);
     currentUser = await prisma.user.findUnique({ where: { email: payload.email } });
  } catch(e) { redirect("/login"); }

  // 3. Proje Verilerini Çek
  const project = await getProjectDetails(id);

  if (!project) {
      return <div>Proje bulunamadı.</div>;
  }

  return <ProjectDetailClient project={project} currentUser={currentUser} />;
}