"use server";
import { prisma } from "./lib/prisma"; // Veya "../lib/prisma" (Sende hangisi çalışıyorsa o kalsın)
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // Sadece 1 kere yazılmalı
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// ... kodlar buradan devam etsin ...

// 1. İlanları Getir
export async function getJobs() {
  try {
    return await prisma.job.findMany({
      where: { status: { not: 'DELETED' } },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } }
      }
    });
  } catch (error) {
    return [];
  }
}

// 2. Başvuruları Getir
export async function getApplications() {
  try {
    return await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { title: true } },
        candidate: { select: { name: true, email: true, cvUrl: true } }
      }
    });
  } catch (error) {
    return [];
  }
}

// 3. İlanı Sil (Pasife Al)
export async function deleteJob(formData) {
  const jobId = formData.get("id");
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'DELETED' }
    });
    revalidatePath('/dashboard'); // Sayfayı yenile
  } catch (error) {
    console.error("Silme hatası:", error);
  }
}

// 4. TEST İÇİN VERİ OLUŞTUR (Veritabanı boşsa bunu kullanacağız)
export async function createDemoData() {
  // Örnek Kullanıcılar
  const company = await prisma.user.create({
    data: { email: `firma-${Date.now()}@civildai.com`, name: 'Civildai İnşaat A.Ş.', role: 'COMPANY' }
  });
  
  const candidate = await prisma.user.create({
    data: { email: `aday-${Date.now()}@mail.com`, name: 'Yüksek Mimar Sinan', role: 'CANDIDATE', cvUrl: 'https://example.com/cv.pdf' }
  });

  // Örnek İlan
  const job = await prisma.job.create({
    data: { title: 'Şantiye Şefi', description: 'Tecrübeli şef aranıyor', companyId: company.id }
  });

  // Örnek Başvuru
  await prisma.application.create({
    data: { 
      jobId: job.id, 
      candidateId: candidate.id, 
      coverLetter: 'Merhaba, projenizde yer almak istiyorum. 10 yıllık tecrübem var.' 
    }
  });
  
  revalidatePath('/dashboard');
}
// 5. YENİ İLAN EKLE (Formdan gelen veriyle)

export async function createJob(formData) {
  // Formdan verileri alalım
  const title = formData.get("title");
  const location = formData.get("location");
  const description = formData.get("description");

  // Geçici Çözüm: Henüz giriş sistemi yapmadığımız için,
  // ilanı veritabanındaki ilk "Firma" kullanıcısına zimmetleyeceğiz.
  let company = await prisma.user.findFirst({ where: { role: 'COMPANY' } });

  // Eğer hiç firma yoksa, hata vermesin diye bir tane oluşturalım
  if (!company) {
    company = await prisma.user.create({
      data: { email: 'demo@firma.com', name: 'Demo İnşaat', role: 'COMPANY' }
    });
  }

  // İlanı oluştur
  await prisma.job.create({
    data: {
      title,
      location,
      description,
      companyId: company.id,
      status: 'ACTIVE'
    }
  });

  // İşlem bitince kullanıcıyı dashboard'a geri gönder
  redirect('/dashboard');
}
// 6. İLANA BAŞVUR (Aday Formu)
export async function applyToJob(formData) {
  const jobId = formData.get("jobId");
  const name = formData.get("name");
  const email = formData.get("email");
  const cvUrl = formData.get("cvUrl");
  const coverLetter = formData.get("coverLetter");

  // 1. Önce bu email ile kayıtlı aday var mı bakalım
  let candidate = await prisma.user.findUnique({ where: { email } });

  // 2. Yoksa yeni bir aday oluşturalım (Otomatik Kayıt)
  if (!candidate) {
    candidate = await prisma.user.create({
      data: {
        name,
        email,
        role: 'CANDIDATE',
        cvUrl // CV linkini profiline de ekleyelim
      }
    });
  }

  // 3. Başvuruyu oluşturalım
  await prisma.application.create({
    data: {
      coverLetter,
      jobId,
      candidateId: candidate.id
    }
  });

  // 4. İşlem bitince tekrar ana sayfaya dönelim
  redirect('/');
}


// 7. GİRİŞ YAP (LOGIN)
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 1. Kullanıcıyı bul
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    // Güvenlik gereği "Kullanıcı yok" demeyiz, genel hata veririz
    throw new Error("Email veya şifre hatalı!");
  }

  // 2. Şifreyi kontrol et (Bcrypt ile)
  // user.password veritabanındaki şifreli hali, password ise formdan gelen
  const isPasswordValid = await compare(password, user.password || "");

  if (!isPasswordValid) {
    throw new Error("Email veya şifre hatalı!");
  }

  // 3. Giriş Bileti (Token) Oluştur
  const secret = new TextEncoder().encode("civildai");
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Oturum 2 saat sürsün
    .sign(secret);

  // 4. Bileti Tarayıcıya Yapıştır (Cookie)
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 2, // 2 saat
    path: "/",
  });

  // 5. Panele gönder
  redirect("/dashboard");
}

// 8. ÇIKIŞ YAP (LOGOUT)
export async function logout() {
(await cookies()).delete("session");  redirect("/login");
}