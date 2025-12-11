// src/app/page.js
import { getJobs } from "./actions";
import Link from "next/link";
import { FiBriefcase, FiMapPin, FiArrowRight, FiLayout } from "react-icons/fi";

export default async function HomePage() {
  // Veritabanındaki aktif ilanları çek
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HEADER / ÜST MENÜ --- */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Civildai</span>
          </div>
          
          <div className="flex gap-4">
             {/* Firmalar için panele giriş butonu */}
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              <FiLayout /> Kurumsal Giriş
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO / KARŞILAMA ALANI --- */}
      <div className="bg-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Hayalindeki Projeyi Bul</h1>
        <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
          Civildai ile inşaat ve mimarlık sektöründeki en güncel iş fırsatlarına ulaş.
        </p>
      </div>

      {/* --- İLAN LİSTESİ --- */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Açık Pozisyonlar</h2>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            {jobs.length} İlan
          </span>
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">Şu an aktif iş ilanı bulunmuyor.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Sol Taraf: İlan Bilgisi */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiBriefcase className="text-gray-400" />
                      <span>{job.company?.name || 'Civildai Üyesi'}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-1">
                         <FiMapPin className="text-gray-400" />
                         <span>{job.location}</span>
                      </div>
                    )}
                    <span className="text-gray-400">•</span>
                    <span>{new Date(job.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>

                {/* Sağ Taraf: Başvuru Butonu */}
                <div>
                   {/*  buton */}
                  <Link href={`/job/${job.id}`} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-2">
                      İlanı İncele <FiArrowRight />
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
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

  // 4. İşlem bitince tekrar ana sayfaya dönelim (veya teşekkür sayfasına)
  redirect('/');
}