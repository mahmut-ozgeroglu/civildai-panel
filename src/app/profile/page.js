import { prisma } from "../lib/prisma"; // veya "../../lib/prisma"
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient"; // Birazdan yapacağız

export default async function ProfilePage() {
  // 1. Oturumu Kontrol Et
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  let user = null;

  try {
    const secret = new TextEncoder().encode("civildai");
    const { payload } = await jwtVerify(session, secret);
    
    // 2. Kullanıcının TÜM verilerini çek (İlanları ve Başvurularıyla beraber)
    user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: {
        jobs: true,          // Verdiği ilanlar
        applications: {      // Yaptığı başvurular ve o işin detayları
            include: { job: true }
        } 
      }
    });

  } catch (error) {
    redirect("/login");
  }

  if (!user) redirect("/login");

  // 3. Tasarıma Gönder
  return <ProfileClient user={user} />;
}