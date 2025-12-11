// src/app/dashboard/page.js
import { getJobs } from "../actions";
import { prisma } from "../lib/prisma"; 
import DashboardClient from "./DashboardClient";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function DashboardPage() {
  const jobs = await getJobs();
  
  let userRole = "INDIVIDUAL";
  let userProfession = ""; 
  let userId = null;

  try {
    const session = (await cookies()).get("session")?.value;
    if (session) {
       // Gizli kelime artık herkesle aynı: "civildai"
       const secret = new TextEncoder().encode("civildai");
       const { payload } = await jwtVerify(session, secret);
       
       const user = await prisma.user.findUnique({ where: { email: payload.email } });
       
       if (user) {
         userRole = user.role;
         userId = user.id;
         userProfession = user.profession;
       }
    }
  } catch (e) {
    // Hata olursa sessizce devam et
  }

  return (
    <DashboardClient 
       initialJobs={jobs} 
       userRole={userRole} 
       userProfession={userProfession}
       userId={userId} 
    />
  );
}