// src/app/projects/[id]/page.js
import { prisma } from "../../../lib/prisma";
import { 
  getProjectById, 
  getProjectOrders, 
  getSuppliers, 
  getProjectAttendance, // <-- YENİ: Puantaj verisi
  getProjectWorkers     // <-- YENİ: İşçi listesi
} from "../../actions"; 
import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  
  // 1. Proje Detayı
  const project = await getProjectById(id);
  if (!project) return notFound();

  // 2. Kullanıcı Bilgisi (Oturum açan kişi kim?)
  const session = (await cookies()).get("session")?.value;
  let currentUser = null;
  
  if(session) {
      try {
          const secret = new TextEncoder().encode("civildai");
          const { payload } = await jwtVerify(session, secret);
          currentUser = await prisma.user.findUnique({ where: { email: payload.email } });
      } catch(e) {
          // Token hatası varsa null kalır, sorun yok
      }
  }

  // 3. VERİLERİ ÇEK
  // a) Sipariş Modülü için:
  const orders = await getProjectOrders(id);
  const suppliers = await getSuppliers();

  // b) Saha Ekibi (Puantaj) Modülü için (YENİ EKLENENLER):
  const todaysAttendance = await getProjectAttendance(id);
  const potentialWorkers = await getProjectWorkers(id);

  return (
    <ProjectDetailClient 
       project={project} 
       currentUser={currentUser} 
       initialOrders={orders} 
       suppliers={suppliers}
       todaysAttendance={todaysAttendance} // Client'a gönderiyoruz
       potentialWorkers={potentialWorkers} // Client'a gönderiyoruz
    />
  );
}