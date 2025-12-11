// src/app/job/[id]/page.js
import { prisma } from "../../lib/prisma";
import { applyToJob } from "../../actions";
import Link from "next/link";
import { FiArrowLeft, FiMapPin, FiCalendar, FiSend } from "react-icons/fi";

export default async function JobDetailPage({ params }) {
  const { id } = await params; 
  const job = await prisma.job.findUnique({
    where: { id: id },
    include: { company: true }
  });

  if (!job) return <div className="p-10 text-center">İlan bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Geri Dön */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <FiArrowLeft className="mr-2" /> Tüm İlanlara Dön
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SOL TARAF: İlan Detayları */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{job.company.name}</span>
                {job.location && <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>}
                <span className="flex items-center gap-1"><FiCalendar /> {new Date(job.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              
              <hr className="border-gray-100 mb-6" />
              
              <h3 className="text-lg font-bold text-gray-800 mb-3">İş Tanımı</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description || "Bu ilan için açıklama girilmemiş."}
              </p>
            </div>
          </div>

          {/* SAĞ TARAF: Başvuru Formu */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiSend className="text-indigo-600" /> Başvuru Yap
              </h3>
              
              <form action={applyToJob} className="space-y-4">
                <input type="hidden" name="jobId" value={job.id} />

                <div>
                  <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input name="name" type="text" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Örn: Ali Veli" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta</label>
                  <input name="email" type="email" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ali@mail.com" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">CV Linki</label>
                  <input name="cvUrl" type="url" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Ön Yazı</label>
                  <textarea name="coverLetter" rows="3" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                  Başvuruyu Gönder
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}