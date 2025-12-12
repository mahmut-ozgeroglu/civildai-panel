"use server";
import { prisma } from "./lib/prisma"; // Veya "../lib/prisma" (Sende hangisi çalışıyorsa o kalsın)
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // Sadece 1 kere yazılmalı
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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
// src/app/actions.js içindeki applyToJob fonksiyonu:

export async function applyToJob(formData) {
  const jobId = formData.get("jobId");
  const name = formData.get("name");
  const email = formData.get("email");
  const cvUrl = formData.get("cvUrl");
  const coverLetter = formData.get("coverLetter");

  let candidateId = null;

  // Oturum açmış kullanıcının ID'sini bulmaya çalış
  const session = (await cookies()).get("session")?.value;
  if (session) {
      try {
          const secret = new TextEncoder().encode("civildai");
          const { payload } = await jwtVerify(session, secret);
          // prisma nesnesinin import edildiğinden emin ol (genelde en üsttedir)
          const user = await prisma.user.findUnique({ where: { email: payload.email } });
          if (user) candidateId = user.id;
      } catch (e) {}
  }

  await prisma.application.create({
    data: {
      name,
      email,
      resumeUrl: cvUrl,
      coverLetter,
      jobId,
      candidateId // <-- Artık ID'yi de kaydediyoruz, böylece profile gidebilirsin
    }
  });

  revalidatePath("/jobs");
  
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

// 9. PROFİL GÜNCELLE
export async function updateProfile(formData) {
  const userId = formData.get("userId");
  const name = formData.get("name");
  const email = formData.get("email");
  const profession = formData.get("profession");
  const cvUrl = formData.get("cvUrl");

  // Veritabanını güncelle
  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profession, // Eğer şirketse burası null kalabilir, sorun yok
      cvUrl
    }
  });

  // Profil sayfasını yenile ki yeni bilgiler görünsün
  revalidatePath("/profile");
  revalidatePath("/dashboard"); // Dashboard'daki isim de değişsin
}
// 10. PROFESYONELLERİ GETİR (NETWORK İÇİN)
export async function getProfessionals() {
  try {
    const professionals = await prisma.user.findMany({
      where: {
        role: 'PROFESSIONAL' // Sadece ustalar ve mimarlar
      },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        cvUrl: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return professionals;
  } catch (error) {
    return [];
  }
}
// 11. YENİ PROJE EKLE
export async function createProject(formData) {
  const userId = formData.get("userId"); // Bunu formdan gizli alacağız
  const title = formData.get("title");
  const description = formData.get("description");
  const location = formData.get("location");
  const status = formData.get("status");
  const imageUrl = formData.get("imageUrl"); // Şimdilik link olarak alalım

  await prisma.project.create({
    data: {
      title,
      description,
      location,
      status,
      imageUrl,
      ownerId: userId
    }
  });

  revalidatePath("/projects");
}

// 12. PROJELERİ GETİR (Kullanıcıya Özel)
export async function getUserProjects(userId) {
  try {
    return await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Sahibi olduklarım
          { members: { some: { userId: userId } } } // Üyesi olduklarım
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}
// 13. İHALE OLUŞTUR
export async function createTender(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const budget = formData.get("budget");
  const companyId = formData.get("companyId");

  await prisma.tender.create({
    data: { title, description, budget, companyId }
  });
  revalidatePath("/tenders");
}

// 14. İHALELERİ GETİR
export async function getTenders() {
  return await prisma.tender.findMany({
    include: { company: true, proposals: true },
    orderBy: { createdAt: 'desc' }
  });
}
// 15. PROJE DETAYLARINI GETİR

export async function getProjectDetails(projectId) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        documents: { include: { uploader: true } },
        tasks: { orderBy: { createdAt: 'desc' } },
        siteLogs: { include: { user: true }, orderBy: { createdAt: 'desc' } },
        tenders: { include: { proposals: true }, orderBy: { createdAt: 'desc' } },
        messages: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        // --- BU SATIRI MUTLAKA EKLE ---
        members: { include: { user: true } } 
        
      }
    });
    return project;
  } catch (error) {
    return null;
  }
}

// 16. PROJEYE GÖREV/İHALE EKLEME ACTIONS
export async function addTask(formData) {
    const projectId = formData.get("projectId");
    const title = formData.get("title");
    await prisma.task.create({ data: { title, projectId } });
    revalidatePath(`/projects/${projectId}`);
}

export async function addProjectMessage(formData) {
    const projectId = formData.get("projectId");
    const userId = formData.get("userId");
    const content = formData.get("content");
    await prisma.projectMessage.create({ data: { content, projectId, userId } });
    revalidatePath(`/projects/${projectId}`);
}

export async function createProjectTender(formData) {
    const projectId = formData.get("projectId");
    const companyId = formData.get("companyId");
    const title = formData.get("title");
    const description = formData.get("description");
    const budget = formData.get("budget");
    
    await prisma.tender.create({
        data: { title, description, budget, projectId, companyId }
    });
    revalidatePath(`/projects/${projectId}`);
}
// ... Mevcut kodların en altına ekle ...

// 17. ŞANTİYE GÜNLÜĞÜNE EKLE
export async function createSiteLog(formData) {
  const content = formData.get("content");
  const projectId = formData.get("projectId");
  const userId = formData.get("userId");

  await prisma.siteLog.create({
    data: { content, projectId, userId }
  });
  revalidatePath(`/projects/${projectId}`);
}

// 18. GÖREV DURUMUNU DEĞİŞTİR (Yapıldı/Yapılmadı)
export async function toggleTaskStatus(taskId, projectId, currentStatus) {
  const newStatus = currentStatus === 'TODO' ? 'DONE' : 'TODO';
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  });
  revalidatePath(`/projects/${projectId}`);
}
// ... Mevcut kodların en altı ...

// 19. PROJEYE EKİP ÜYESİ EKLE
export async function addTeamMember(formData) {
  const email = formData.get("email");
  const projectId = formData.get("projectId");
  const roleTitle = formData.get("roleTitle");
  const canManageTenders = formData.get("canManageTenders") === 'on'; // Checkbox kontrolü

  // 1. Kullanıcıyı bul
  const userToAdd = await prisma.user.findUnique({ where: { email } });
  
  if (!userToAdd) {
    // Gerçek hayatta hata mesajı döneriz ama şimdilik sessiz geçelim
    return;
  }

  // 2. Projeye ekle
  try {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        roleTitle,
        canManageTenders
      }
    });
    revalidatePath(`/projects/${projectId}`);
  } catch (e) {
    console.log("Zaten ekli olabilir");
  }
}
// ... Mevcut kodlar ...

// 21. BELGE EKLE
export async function uploadDocument(formData) {
  const projectId = formData.get("projectId");
  const uploaderId = formData.get("uploaderId");
  const name = formData.get("name");
  const type = formData.get("type"); // PDF, DWG...
  // Gerçekte burada Vercel Blob'a yükleyip URL alırız. Şimdilik simüle ediyoruz:
  const url = "https://placehold.co/600x400.png?text=Dosya+Onizleme"; 

  await prisma.projectDocument.create({
    data: { name, type, url, projectId, uploaderId }
  });
  revalidatePath(`/projects/${projectId}`);
}

// 22. MEDYALI PAYLAŞIM (SiteLog Güncellemesi)
// (Eski createSiteLog yerine bunu kullanacağız veya güncelleyeceğiz)
export async function createSiteLogWithMedia(formData) {
  const content = formData.get("content");
  const projectId = formData.get("projectId");
  const userId = formData.get("userId");
  const mediaUrl = formData.get("mediaUrl"); // Formdan gelen URL

  await prisma.siteLog.create({
    data: { content, projectId, userId, mediaUrl }
  });
  
  // BİLDİRİM GÖNDER (Proje sahibine)
  // Not: Gerçek uygulamada tüm ekibe döngüyle gönderilir.
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (project && project.ownerId !== userId) {
      await prisma.notification.create({
          data: {
              userId: project.ownerId,
              content: `Projende yeni bir şantiye paylaşımı yapıldı.`,
              link: `/projects/${projectId}`
          }
      });
  }

  revalidatePath(`/projects/${projectId}`);
}

// 23. BİLDİRİMLERİ GETİR
export async function getNotifications(userId) {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
}
// 24. PROJE SİL
export async function deleteProject(formData) {
  const projectId = formData.get("projectId");
  // Önce bağlı kayıtları silmek gerekebilir (Cascade ayarı yoksa)
  // Prisma şemasında Cascade varsa direkt silinir. Biz güvenli yolu seçelim:
  await prisma.project.delete({ where: { id: projectId } });
  redirect("/projects");
}

// 25. EKİPTEN ÜYE ÇIKAR
export async function removeTeamMember(formData) {
  const memberId = formData.get("memberId");
  const projectId = formData.get("projectId");
  
  await prisma.projectMember.delete({ where: { id: memberId } });
  revalidatePath(`/projects/${projectId}`);
}

// 26. BİLDİRİMLERİ OKUNDU İŞARETLE
export async function markNotificationsAsRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  revalidatePath("/dashboard");
}
// ... Mevcut importlar ...

// 27. GELİŞMİŞ İŞ İLANI OLUŞTUR (Firma İçin)
// src/app/actions.js dosyasındaki createProfessionalJob fonksiyonunun YENİ HALİ:

// 27. GELİŞMİŞ İŞ İLANI OLUŞTUR (Firma İçin)
export async function createProfessionalJob(formData) {
  const companyId = formData.get("companyId");
  const title = formData.get("title");
  const description = formData.get("description");
  const location = formData.get("location");
  const type = formData.get("type");
  const salary = formData.get("salary");
  const experience = formData.get("experience");
  const workModel = formData.get("workModel");
  
  
  const category = formData.get("category"); 

  await prisma.job.create({
    data: { 
        title, 
        description, 
        location, 
        type, 
        salary, 
        experience, 
        workModel, 
        category, // <-- Buraya formdan gelen veriyi koyuyoruz
        companyId 
    }
  });
  
  revalidatePath("/jobs");
}
// 28. İLANLARI GETİR (Filtreli)
export async function getProfessionalJobs(filters = {}) {
  const { category, search } = filters;
  
  const whereClause = { status: 'ACTIVE' };
  
  // Eğer kategori seçildiyse filtrele (Usta sadece ustayı görsün istersek)
  if (category && category !== 'ALL') {
      whereClause.category = category;
  }

  // Arama metni varsa
  if (search) {
      whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { company: { name: { contains: search, mode: 'insensitive' } } }
      ];
  }

  return await prisma.job.findMany({
    where: whereClause,
    include: { company: true, applications: true }, // Başvuru sayısını görmek için
    orderBy: { createdAt: 'desc' }
  });
}

// 29. FİRMANIN KENDİ İLANLARINI VE BAŞVURULARI GETİR
export async function getCompanyJobsWithApplicants(companyId) {
    return await prisma.job.findMany({
        where: { companyId },
        include: { 
            applications: { 
                include: { candidate: true }, // Başvuranın profilini gör
                orderBy: { createdAt: 'desc' }
            } 
        },
        orderBy: { createdAt: 'desc' }
    });
}
// ... Mevcut kodların altı ...

// 30. MESAJ GÖNDER (DM)
export async function sendMessage(formData) {
  const senderId = formData.get("senderId");
  const receiverId = formData.get("receiverId");
  const content = formData.get("content");

  await prisma.message.create({
    data: { content, senderId, receiverId }
  });
  
  revalidatePath("/messages");
}

// 31. İKİ KİŞİ ARASINDAKİ MESAJLARI GETİR
export async function getConversation(userId, otherUserId) {
  // Önce okunmamışları okundu yap
  await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: userId, isRead: false },
      data: { isRead: true }
  });

  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });
}

// 32. KONUŞTUĞUM KİŞİLERİ (SON MESAJLA) GETİR
export async function getMyConversations(userId) {
  // Tüm mesajlarımı al (Benim attıklarım ve bana gelenler)
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: 'desc' },
    include: { sender: true, receiver: true }
  });

  // Kişileri tekilleştir (Unique Users)
  const conversations = [];
  const processedUsers = new Set();

  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    
    if (!processedUsers.has(otherUser.id)) {
      processedUsers.add(otherUser.id);
      conversations.push({
        user: otherUser,
        lastMessage: msg.content,
        date: msg.createdAt,
        isRead: msg.senderId === userId ? true : msg.isRead // Ben attıysam okundu say
      });
    }
  }
  
  return conversations;
}
// ... en alta ekle ...

// 33. ID ile KULLANICI BİLGİSİNİ GETİR (Mesajlaşma Başlatmak İçin)
export async function getUserById(userId) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, profession: true, role: true } 
    });
  } catch (error) {
    return null;
  }
}
// ... En alta ekle ...

// 34. AĞIM - KULLANICI ARAMA (Network Search)
export async function searchUsers(filters = {}) {
  const { search, type } = filters; // type: 'ALL', 'COMPANY', 'PROFESSIONAL', 'MAVI_YAKA', 'BEYAZ_YAKA'

  const whereClause = {};

  // 1. Arama Metni (İsim veya Meslek içinde ara)
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { profession: { contains: search, mode: 'insensitive' } }
    ];
  }

  // 2. Tip Filtresi
  if (type === 'COMPANY') {
    whereClause.role = 'COMPANY';
  } else if (type === 'PROFESSIONAL') {
    whereClause.role = 'PROFESSIONAL';
  } else if (type === 'MAVI_YAKA') {
    // Mavi Yaka Regex Mantığı (Basitçe)
    whereClause.role = 'PROFESSIONAL';
    whereClause.profession = { contains: 'usta', mode: 'insensitive' }; // İleride daha detaylı regex yapılabilir
  } else if (type === 'BEYAZ_YAKA') {
    // Beyaz Yaka (Mimar, Mühendis vb.)
    whereClause.role = 'PROFESSIONAL';
    whereClause.NOT = { profession: { contains: 'usta', mode: 'insensitive' } };
  }

  // Kendini getirmesin (Opsiyonel ama client tarafında filtrelemek daha kolay)
  
  try {
    return await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true, name: true, role: true, profession: true, cvUrl: true, createdAt: true,
        // İleride buraya 'followers' sayısı eklenebilir
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Sayfa şişmesin diye limit
    });
  } catch (error) {
    return [];
  }
}
// ... En alta ekle ...

// 35. KULLANICIYI TAKİP ET (AĞINA EKLE)
export async function followUser(formData) {
  const followerId = formData.get("followerId");   // Ben
  const followingId = formData.get("followingId"); // Eklediğim Kişi

  try {
    await prisma.follows.create({
      data: {
        followerId,
        followingId
      }
    });
    // Sayfayı yenile ki buton "Takip Ediliyor"a dönsün
    revalidatePath("/network");
    revalidatePath("/dashboard"); 
  } catch (error) {
    // Zaten takip ediyorsa hata verebilir, sessizce geçelim
    console.log("Zaten takip ediliyor");
  }
}
// ... En alta ...

// 36. MÜSAİTLİK DURUMUNU DEĞİŞTİR (Yeşil/Kırmızı Işık)
export async function toggleAvailability(userId, currentStatus) {
  await prisma.user.update({
    where: { id: userId },
    data: { isAvailable: !currentStatus }
  });
  revalidatePath("/dashboard");
  revalidatePath("/network");
  revalidatePath(`/profile/${userId}`);
}

// 37. DOĞRULAMA BELGESİ YÜKLE (Başvuru Yap)
// src/app/actions.js içindeki requestVerification fonksiyonu:

// 37. DOĞRULAMA BELGESİ YÜKLE
export async function requestVerification(formData) {
  const userId = formData.get("userId");
  const file = formData.get("file"); // Dosya verisi (Simülasyon için)

  // Burada normalde dosyayı S3 veya Blob'a yükleriz.
  // Şimdilik yüklenmiş gibi yapıp durumu güncelliyoruz.
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      verificationDoc: "https://placehold.co/600x800.png?text=Yuklenen+Belge", // Demo link
      verificationStatus: "PENDING" // Durumu 'İncelemede' yap
    }
  });
  revalidatePath("/dashboard");
}

// 38. ADMİN ONAYI (Bu fonksiyonu sadece admin kullanmalı)
export async function approveUser(targetUserId) {
  await prisma.user.update({
    where: { id: targetUserId },
    data: { 
      isVerified: true,
      verificationStatus: "APPROVED"
    }
  });
  revalidatePath("/network");
}