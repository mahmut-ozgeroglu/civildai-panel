// src/app/dashboard/DashboardClient.js
"use client";

import React, { useState } from 'react';
import { createJob, applyToJob, logout } from '../actions'; // <-- logout eklendi
import { FiSearch, FiX, FiLogOut, FiUser, FiBriefcase } from 'react-icons/fi'; // İkonlar eklendi

export default function DashboardClient({ initialJobs, userRole, userId }) {
  // STATE'LER
  const [jobs, setJobs] = useState(initialJobs);
  const [filters, setFilters] = useState({ search: '', type: 'Tümü', location: 'Tümü' });
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Sabitler
  const jobTypes = ['Tümü', 'Tam Zamanlı', 'Yarı Zamanlı', 'Proje Bazlı', 'Staj'];
  const locations = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];

  // FİLTRELEME MANTIĞI
  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                        job.company?.name?.toLowerCase().includes(filters.search.toLowerCase());
    const matchType = filters.type === 'Tümü' || job.type === filters.type;
    const matchLoc = filters.location === 'Tümü' || job.location === filters.location;
    return matchSearch && matchType && matchLoc;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- GÜNCELLENEN HEADER (Üst Kısım) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo ve Başlık */}
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
               <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">Civildai Panel</h1>
                  <p className="text-xs text-slate-500">Kariyer Yönetimi</p>
               </div>
            </div>

            {/* Sağ Taraf: Profil ve Butonlar */}
            <div className="flex items-center gap-3">
                {/* Kullanıcı Bilgisi (Kim girdi?) */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                        <FiUser />
                    </div>
                    <span className="text-xs font-bold text-gray-600 uppercase">{userRole === 'COMPANY' ? 'Firma Hesabı' : 'Aday Hesabı'}</span>
                </div>

                {/* Çıkış Butonu */}
                <button onClick={() => logout()} className="text-gray-500 hover:text-red-600 p-2 transition-colors" title="Çıkış Yap">
                    <FiLogOut size={20} />
                </button>

                {/* İlan Ver Butonu (Sadece Firmaysa) */}
                <button onClick={() => setIsPostJobModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 text-sm transition-transform active:scale-95">
                    <FiBriefcase /> İlan Ver
                </button>
            </div>
         </div>
      </div>
      {/* ------------------------------------------- */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- BAŞLIK ALANI --- */}
        <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Kariyer Fırsatları</h2>
            <p className="text-slate-500 mt-1">Sektörün öncü firmalarında yerinizi alın.</p>
        </div>

        {/* --- FİLTRELER --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] relative">
                <input type="text" placeholder="Pozisyon veya Şirket Ara..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
                <span className="absolute left-3 top-3.5 text-gray-400"><FiSearch /></span>
            </div>
            <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100"
                value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
                {locations.map(l => <option key={l}>{l}</option>)}
            </select>
        </div>

        {/* --- İLAN LİSTESİ --- */}
        {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <span className="text-5xl block mb-4">📭</span>
                <h3 className="font-bold text-slate-800 text-xl">İlan bulunamadı.</h3>
                <p className="text-gray-500 mt-2">Filtreleri değiştirmeyi deneyin.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden">
                        {/* Üst Kısım */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-slate-600 uppercase shrink-0">
                                {job.company?.name?.[0] || "C"}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-1">{job.title}</h3>
                                <p className="text-sm text-gray-500 font-medium">{job.company?.name || "Gizli Firma"}</p>
                            </div>
                        </div>

                        {/* Etiketler */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Tam Zamanlı</span>
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">📍 {job.location || 'Konum Yok'}</span>
                        </div>

                        {/* Açıklama */}
                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">{job.description}</p>

                        {/* Alt Kısım */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">{new Date(job.createdAt).toLocaleDateString("tr-TR")}</span>
                            
                            <button 
                                onClick={() => { setSelectedJobId(job.id); setIsApplyModalOpen(true); }}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md"
                            >
                                Başvur
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- MODAL 1: İLAN VERME --- */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsPostJobModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Yeni İş İlanı Oluştur</h2>
              
              <form action={createJob}>
                  <div className="space-y-4">
                      <input name="title" required type="text" placeholder="Pozisyon Adı (Örn: İnşaat Mühendisi)" className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50" />
                      <div className="grid grid-cols-2 gap-4">
                          <select name="location" className="border border-gray-200 p-4 rounded-xl bg-gray-50 outline-none">
                              {locations.filter(l => l!=='Tümü').map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <select name="type" className="border border-gray-200 p-4 rounded-xl bg-gray-50 outline-none">
                              {jobTypes.filter(t => t!=='Tümü').map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                      </div>
                      <textarea name="description" required placeholder="İş Tanımı..." className="w-full border border-gray-200 p-4 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50"></textarea>
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all">İlanı Yayınla</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* --- MODAL 2: BAŞVURU YAP --- */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsApplyModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Başvuru Yap</h2>
              <p className="text-gray-500 mb-6 text-sm">Formu doldurarak başvurunuzu iletin.</p>
              
              <form action={applyToJob}>
                  <input type="hidden" name="jobId" value={selectedJobId} />
                  <div className="space-y-4">
                      <input name="name" required type="text" placeholder="Adınız Soyadınız" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50" />
                      <input name="email" required type="email" placeholder="E-posta Adresiniz" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50" />
                      <input name="cvUrl" required type="url" placeholder="CV Linki (Google Drive, LinkedIn vb.)" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50" />
                      <textarea name="coverLetter" placeholder="Ön Yazı (Opsiyonel)" className="w-full border border-gray-200 p-3 rounded-xl h-24 resize-none focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50"></textarea>
                      
                      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all">
                        Başvuruyu Gönder ✨
                      </button>
                  </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}