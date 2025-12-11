// src/app/dashboard/page.js
import { getJobs } from "../actions";
import { prisma } from "../lib/prisma";
import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function DashboardPage() {
  const jobs = await getJobs();
  
  let userRole = "INDIVIDUAL";
  let userProfession = ""; // Meslek bilgisini de tutalım
  let userId = null;

  try {
    const session = (await cookies()).get("session")?.value;
    if (session) {
       const secret = new TextEncoder().encode("BURAYA_COK_GIZLI_BIR_KELIME_YAZ");
       const { payload } = await jwtVerify(session, secret);
       
       // Veritabanından en güncel bilgiyi çek
       const user = await prisma.user.findUnique({ where: { email: payload.email } });
       if (user) {
         userRole = user.role;
         userId = user.id;
         userProfession = user.profession; // Mesleği al
       }
    }
  } catch (e) {}

  return (
    <DashboardClient 
       initialJobs={jobs} 
       userRole={userRole} 
       userProfession={userProfession} // Tasarıma gönder
       userId={userId} 
    />
  );
}