// src/app/dashboard/DashboardClient.js
"use client";

import React, { useState } from 'react';
import { createJob, applyToJob, logout } from '../actions';
import { 
  FiSearch, FiX, FiLogOut, FiUser, FiBriefcase, 
  FiMapPin, FiClock, FiMoreHorizontal, FiHeart, 
  FiShare2, FiHome, FiTool, FiShoppingBag, FiUsers, FiTrendingUp,
  FiMessageSquare, FiGlobe, FiActivity
} from 'react-icons/fi';

export default function DashboardClient({ initialJobs, userRole, userId, userProfession }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [feedTab, setFeedTab] = useState('global'); // 'following' veya 'global'
  const [filters, setFilters] = useState({ search: '', type: 'Tümü', location: 'Tümü' });
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Sabitler
  const jobTypes = ['Tümü', 'Tam Zamanlı', 'Yarı Zamanlı', 'Proje Bazlı', 'Staj'];
  const locations = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'];

  // Menü Görünürlük Mantığı
  const isBlueCollar = (title) => title?.toLowerCase().match(/usta|kalfa|çırak|işçi|operatör|boyacı|tesisatçı/);
  const isWhiteCollar = (title) => title?.toLowerCase().match(/mimar|mühendis|şef|tekniker|yönetici|uzman/);
  
  const showJobOpportunities = isBlueCollar(userProfession) || userRole === 'INDIVIDUAL'; 
  const showCareer = isWhiteCollar(userProfession) || userRole === 'COMPANY';
  const canPostJob = userRole === 'COMPANY' || userRole === 'PROFESSIONAL';

  // FİLTRELEME MANTIĞI
  // Not: Gerçekte 'following' için backend'den ayrı veri çekilmeli. Şimdilik simüle ediyoruz.
  const filteredJobs = jobs.filter(job => {
    // Arama ve Filtreler
    const matchSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                        job.company?.name?.toLowerCase().includes(filters.search.toLowerCase());
    const matchType = filters.type === 'Tümü' || job.type === filters.type;
    const matchLoc = filters.location === 'Tümü' || job.location === filters.location;
    
    // Sekme Mantığı (Takip Ettiklerim vs Dünya)
    // Şimdilik 'following' seçilirse rastgele bazılarını gösteriyoruz (Demo amaçlı)
    const matchTab = feedTab === 'global' ? true : (job.id.charCodeAt(0) % 2 === 0); 

    return matchSearch && matchType && matchLoc && matchTab;
  });

  const timeAgo = (date) => { /* ... (öncekiyle aynı zaman fonksiyonu) ... */ return "Az önce"; };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* HEADER (NAVBAR) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm px-4 h-16">
         <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">C</div>
               <div className="relative w-64 hidden lg:block">
                  <span className="absolute left-3 top-2.5 text-gray-500"><FiSearch /></span>
                  <input type="text" placeholder="Arama yap..." className="w-full bg-blue-50 border-none rounded-md py-2 pl-10 pr-4 text-sm outline-none"
                    value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
               </div>
            </div>

            {/* Orta Menü */}
            <nav className="flex items-center gap-1 md:gap-4 h-full overflow-x-auto no-scrollbar">
                <a href="/dashboard" className="nav-item active border-b-2 border-slate-900"><FiHome size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Ana Sayfa</span></a>
                {showJobOpportunities && <a href="#" className="nav-item"><FiTool size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">İş Fırsatları</span></a>}
                {showCareer && <a href="#" className="nav-item"><FiTrendingUp size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Kariyer</span></a>}
                <a href="/network" className="nav-item"><FiUsers size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Ağım</span></a>
                <a href="/projects" className="nav-item"><FiBriefcase size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Projelerim</span></a>
                <a href="/messages" className="nav-item"><FiMessageSquare size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Mesajlar</span></a>
            </nav>

            {/* Profil */}
            <div className="flex items-center gap-3 border-l pl-4 md:pl-6 border-gray-200 h-10">
                <a href="/profile" className="flex items-center gap-2 group">
                     <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                         {userRole === 'COMPANY' ? 'KURUMSAL' : userRole === 'PROFESSIONAL' ? 'PROFESYONEL' : 'BİREYSEL'}
                    </span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><FiUser /></div>
                </a>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-600 ml-2"><FiLogOut size={20} /></button>
            </div>
         </div>
      </div>

      {/* ANA İÇERİK */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* SOL: Profil Kartı */}
        <div className="hidden md:block md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center pb-4">
                <div className="h-16 bg-gradient-to-r from-slate-700 to-slate-900"></div>
                <div className="w-16 h-16 bg-white rounded-full p-1 mx-auto -mt-8 relative z-10 shadow-sm">
                    <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold"><FiUser size={24} /></div>
                </div>
                <div className="mt-3 px-4">
                    <h3 className="font-bold text-slate-900">Hoşgeldin</h3>
                    <p className="text-xs text-gray-500 mt-1">{userProfession || "Kullanıcı"}</p>
                </div>
                <a href="/profile" className="block w-full py-3 mt-4 text-xs font-bold text-slate-900 hover:bg-gray-50 border-t border-gray-200">Profilime Git</a>
            </div>
        </div>

        {/* ORTA: AKIŞ (FEED) */}
        <div className="col-span-1 md:col-span-6 space-y-4">
            
            {/* Paylaşım Kutusu */}
            {canPostJob && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 items-center">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0 text-slate-600"><FiUser /></div>
                    <button onClick={() => setIsPostJobModalOpen(true)} className="flex-1 text-left bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-medium py-3 px-4 rounded-full transition-colors border border-gray-200">
                        {userRole === 'COMPANY' ? 'Yeni bir pozisyon veya proje paylaş...' : 'Ekip arkadaşı ara...'}
                    </button>
                </div>
            )}

            {/* --- SEKMELER: TAKİP ETTİKLERİM vs DÜNYA --- */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button 
                    onClick={() => setFeedTab('following')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${feedTab === 'following' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <FiActivity /> Takip Ettiklerim
                </button>
                <button 
                    onClick={() => setFeedTab('global')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${feedTab === 'global' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <FiGlobe /> Dünya (Keşfet)
                </button>
            </div>

            {/* Akış Listesi */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                    <span className="text-4xl block mb-2">📭</span>
                    <h3 className="font-bold text-slate-900">Burada henüz bir şey yok.</h3>
                    <p className="text-sm text-gray-500 mt-1">{feedTab === 'following' ? 'Henüz kimseyi takip etmiyorsunuz veya paylaşım yok.' : 'Kriterlere uygun ilan bulunamadı.'}</p>
                </div>
            ) : (
                filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center text-lg font-bold text-slate-600 uppercase">
                                    {job.company?.name?.[0] || "C"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 cursor-pointer hover:underline">{job.company?.name || "Gizli Firma"}</h3>
                                    <p className="text-xs text-gray-500">{job.location || "Konum Yok"}</p>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><FiClock size={10}/> Az önce • <FiBriefcase size={10}/> {job.type || "Tam Zamanlı"}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-slate-900"><FiMoreHorizontal /></button>
                        </div>
                        <div className="px-4 pb-2">
                            <h4 className="font-bold text-lg text-slate-900 mb-2">{job.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{job.description}</p>
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between mt-2">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm font-medium"><FiHeart /> Kaydet</button>
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm font-medium"><FiShare2 /> Paylaş</button>
                            </div>
                            <button onClick={() => { setSelectedJobId(job.id); setIsApplyModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-full font-bold text-sm shadow-sm">Başvur</button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* SAĞ: Gündem */}
        <div className="hidden md:block md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm text-slate-900">Gündem</h3><FiTrendingUp className="text-gray-400" /></div>
                <ul className="space-y-4">
                    {['kentseldönüşüm', 'şantiyegüvenliği', 'mimari'].map(tag => (
                        <li key={tag} className="flex flex-col gap-1 cursor-pointer group">
                            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600">#{tag}</span>
                            <span className="text-[10px] text-gray-400">Gündemde</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                 <h4 className="text-blue-800 font-bold text-sm mb-1">Market Yakında!</h4>
                 <p className="text-xs text-blue-600 mb-2">İnşaat malzemelerini buradan alıp satabileceksin.</p>
                 <FiShoppingBag className="mx-auto text-blue-400" size={24}/>
            </div>
        </div>
      </div>

      {/* --- MODALLAR AYNI KALDI --- */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsPostJobModalOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiBriefcase/> İlan Oluştur</h2>
              
              <form action={createJob}>
                  <div className="space-y-4">
                      <input name="title" required type="text" placeholder="Pozisyon Başlığı" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm" />
                      <div className="grid grid-cols-2 gap-4">
                          <select name="location" className="border border-gray-200 p-3 rounded-lg outline-none text-sm bg-white">
                              {locations.filter(l => l!=='Tümü').map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <select name="type" className="border border-gray-200 p-3 rounded-lg outline-none text-sm bg-white">
                              {jobTypes.filter(t => t!=='Tümü').map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                      </div>
                      <textarea name="description" required placeholder="İş detaylarını buraya yazın..." className="w-full border border-gray-200 p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-slate-900 outline-none text-sm"></textarea>
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-all text-sm">Paylaş</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsApplyModalOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Başvurunu Gönder</h2>
              <p className="text-gray-500 mb-6 text-sm">İlan sahibine bilgilerin iletilecek.</p>
              
              <form action={applyToJob}>
                  <input type="hidden" name="jobId" value={selectedJobId} />
                  <div className="space-y-3">
                      <input name="name" required type="text" placeholder="Adın Soyadın" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                      <input name="email" required type="email" placeholder="E-posta Adresin" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                      <input name="cvUrl" required type="url" placeholder="CV Linki (PDF/Drive)" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                      <textarea name="coverLetter" placeholder="Kısa bir ön yazı (Opsiyonel)" className="w-full border border-gray-200 p-3 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-600 outline-none text-sm"></textarea>
                      
                      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all text-sm">
                        Gönder
                      </button>
                  </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}