// src/app/dashboard/page.js
import { getJobs, getApplications, deleteJob, createDemoData, logout } from "../actions"; // <-- logout eklendi
import { FiLogOut } from "react-icons/fi"; // <-- İkon eklendi
import { FiEdit, FiTrash2, FiEye, FiDownload, FiUser, FiBriefcase } from 'react-icons/fi';
import Link from "next/link";

export default async function DashboardPage() {
  const jobs = await getJobs();
  const applications = await getApplications();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Üst Başlık */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Civildai Panel</h1>
            <p className="text-gray-500 mt-1">Hoş geldin, ilanlarını ve başvurularını buradan yönet.</p>
          </div>
          
          <div className="flex gap-3">
            {/* Yeni İlan Ekle Butonu */}
            <Link href="/dashboard/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2">
              + Yeni İlan
            </Link>
            <form action={logout}>
              <button className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2">
                <FiLogOut /> Çıkış
              </button>
            </form>

             {/* Test Verisi Butonu (Sadece boşsa görünsün) */}
             {jobs.length === 0 && (
                <form action={createDemoData}>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow font-medium">
                    Demo Yükle
                  </button>
                </form>
             )}
          </div>
        </div>
          {/* Sadece veritabanı boşsa bu butonu göster */}
          {jobs.length === 0 && (
            <form action={createDemoData}>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow transition-colors font-medium">
                Test Verisi Yükle 🚀
              </button>
            </form>
          )}
        </div>

        {/* --- İLANLAR BÖLÜMÜ --- */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           📋 Aktif İlanlarım
        </h2>
        <div className="grid gap-4 mb-12">
          {jobs.length === 0 ? (
            <div className="text-gray-400 italic bg-white p-6 rounded-xl border border-dashed border-gray-300">Henüz ilan bulunmuyor.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>{new Date(job.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-2 rounded">Yayında</span>
                  </div>
                  <p className="text-indigo-600 text-sm font-bold mt-3 bg-indigo-50 inline-block px-3 py-1 rounded-md">
                    {job._count.applications} Başvuru
                  </p>
                </div>
                <form action={deleteJob}>
                  <input type="hidden" name="id" value={job.id} />
                  <button className="p-3 text-red-500 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Sil">
                    <FiTrash2 size={20} />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        {/* --- BAŞVURULAR BÖLÜMÜ --- */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           📬 Gelen Başvurular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length === 0 ? (
            <div className="col-span-3 text-gray-400 italic bg-white p-6 rounded-xl border border-dashed border-gray-300">Henüz başvuru gelmemiş.</div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl uppercase">
                      {app.candidate?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{app.candidate?.name || 'Gizli Aday'}</h4>
                      <p className="text-xs text-gray-500">{app.job?.title}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
                    <p className="text-sm text-gray-600 italic line-clamp-3">"{app.coverLetter}"</p>
                  </div>

                  <a 
                    href={app.candidate?.cvUrl || '#'} 
                    target="_blank" 
                    className="flex w-full items-center justify-center gap-2 bg-white border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors font-medium"
                  >
                    <FiDownload /> CV İncele
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
  );
}