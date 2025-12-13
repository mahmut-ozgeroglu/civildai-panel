// src/app/dashboard/page.js
import { getJobs, getNotifications, getSupplierOrders } from "../actions"; // getSupplierOrders eklendi
import { prisma } from "../lib/prisma"; 
import DashboardClient from "./DashboardClient";
import SupplierDashboardClient from "./SupplierDashboardClient"; // <-- YENİ: Tedarikçi Paneli çağırıldı
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Oturum Kontrolü
  const session = (await cookies()).get("session")?.value;
  
  if (!session) {
      redirect("/login");
  }

  let user = null;

  try {
    const secret = new TextEncoder().encode("civildai");
    const { payload } = await jwtVerify(session, secret);
    
    // Kullanıcıyı bul
    user = await prisma.user.findUnique({ 
        where: { email: payload.email } 
    });

  } catch (e) {
    // Token geçersizse login'e at
    redirect("/login");
  }

  if (!user) redirect("/login");

  // --- SENARYO 1: EĞER KULLANICI TEDARİKÇİ İSE ---
  if (user.role === 'SUPPLIER') {
      // Sadece bu tedarikçiye gelen siparişleri çek
      const orders = await getSupplierOrders(user.id);
      
      // Tedarikçi Panelini Göster
      return <SupplierDashboardClient user={user} initialOrders={orders} />;
  }

  // --- SENARYO 2: DİĞER KULLANICILAR (Mimar, Usta, Firma) ---
  // Standart verileri çek (İş ilanları vb.)
  const jobs = await getJobs();

  return (
    <DashboardClient 
       initialJobs={jobs} 
       userRole={user.role} 
       userProfession={user.profession}
       userId={user.id} 
       user={user} // <-- ÖNEMLİ: DashboardClient'a tüm user objesini gönderiyoruz (Mavi tik ve Müsaitlik için)
    />
  );
}