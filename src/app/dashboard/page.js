// src/app/dashboard/page.js
import { getJobs } from "../actions";
import { prisma } from "../lib/prisma";
import DashboardClient from "./DashboardClient"; // Az önce yaptığımız tasarım dosyası
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function DashboardPage() {
  // 1. Veritabanından ilanları çek
  const jobs = await getJobs();

  // 2. Giriş yapan kullanıcının rolünü bul (Firma mı Aday mı?)
  // Bu kısım "İlan Ver" butonunu kime göstereceğimizi belirler.
  let userRole = "CANDIDATE"; // Varsayılan
  let userId = null;

  try {
    const session = (await cookies()).get("session")?.value;
    if (session) {
       const secret = new TextEncoder().encode("BURAYA_COK_GIZLI_BIR_KELIME_YAZ");
       const { payload } = await jwtVerify(session, secret);
       userRole = payload.role;
       
       // Veritabanından ID'yi bulalım
       const user = await prisma.user.findUnique({ where: { email: payload.email } });
       userId = user?.id;
    }
  } catch (e) {
    // Hata olursa varsayılan kalır
  }

  // 3. Tasarımı çalıştır ve verileri içine at
  return (
    <DashboardClient 
       initialJobs={jobs} 
       userRole={userRole} 
       userId={userId} 
    />
  );
}