// src/app/jobs/JobsClient.js
"use client";

import React, { useState } from 'react';
import { createProfessionalJob, applyToJob, logout } from '../actions';
import { 
  FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiClock, 
  FiPlus, FiUser, FiCheckCircle, FiX, FiLogOut, FiHome, FiTool, FiTrendingUp, FiUsers, FiMessageSquare, FiShoppingBag
} from 'react-icons/fi';
import Link from 'next/link';

export default function JobsClient({ user, initialJobs, companyListings }) {
  // --- STATE YÖNETİMİ ---
  const [activeTab, setActiveTab] = useState(user?.role === 'COMPANY' ? 'manage' : 'browse');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Filtreler
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL"); 

  // Menü Görünürlük Mantığı (Dashboard ile aynı)
  const isBlueCollar = (title) => title?.toLowerCase().match(/usta|kalfa|çırak|işçi|operatör|boyacı|tesisatçı/);
  const isWhiteCollar = (title) => title?.toLowerCase().match(/mimar|mühendis|şef|tekniker|yönetici|uzman/);
  
  const showJobOpportunities = isBlueCollar(user?.profession) || user?.role === 'INDIVIDUAL'; 
  const showCareer = isWhiteCollar(user?.profession) || user?.role === 'COMPANY';

  // Varsayılan filtre ayarı
  React.useEffect(() => {
      if (user?.profession) {
          const isBlue = user.profession.toLowerCase().match(/usta|kalfa|işçi|operatör/);
          setFilterType(isBlue ? 'MAVI_YAKA' : 'BEYAZ_YAKA');
      }
  }, [user]);

  const filteredJobs = initialJobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterType === 'ALL' || job.category === filterType;
      return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">

      <style jsx>{`
        .nav-item { @apply flex flex-col items-center justify-center text-gray-500 hover:text-slate-900 h-full px-2 md:px-3 transition-colors cursor-pointer shrink-0; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* İlan Ver Butonu (Mobil ve Desktop için görünür yer) */}
        {user?.role === 'COMPANY' && activeTab === 'manage' && (
            <div className="flex justify-end mb-4">
                 <button onClick={() => setIsPostModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg">
                  <FiPlus size={18}/> Yeni İlan Oluştur
              </button>
            </div>
        )}

        {/* --- MOD 1: İLAN YÖNETİMİ (FİRMA GİRİŞİ) --- */}
        {activeTab === 'manage' && user?.role === 'COMPANY' && (
            <div className="space-y-6">
                
                {companyListings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500"><FiBriefcase size={24}/></div>
                        <h3 className="font-bold text-slate-900">Henüz ilan açmadınız.</h3>
                        <p className="text-gray-500 text-sm mt-1">En iyi yetenekleri bulmak için hemen bir ilan oluşturun.</p>
                        <button onClick={() => setIsPostModalOpen(true)} className="mt-4 text-blue-600 font-bold hover:underline">İlk İlanı Oluştur</button>
                    </div>
                )}

                <div className="grid gap-6">
                    {companyListings.map(job => (
                        <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                        <span className="flex items-center gap-1"><FiMapPin/> {job.location}</span>
                                        <span className="flex items-center gap-1"><FiClock/> {new Date(job.createdAt).toLocaleDateString()}</span>
                                        <span className={`px-2 py-0.5 rounded font-bold ${job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.status === 'ACTIVE' ? 'Yayında' : 'Kapalı'}</span>
                                        <span className={`px-2 py-0.5 rounded font-bold ${job.category === 'MAVI_YAKA' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{job.category === 'MAVI_YAKA' ? 'Mavi Yaka' : 'Beyaz Yaka'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{job.applications.length}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">Başvuru</div>
                                </div>
                            </div>
                            
                            {/* Başvuranlar Listesi */}
                            <div className="bg-gray-50 p-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-2">Adaylar</h4>
                                {job.applications.length === 0 && <div className="text-xs text-gray-400 italic ml-2">Henüz başvuru yok.</div>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {job.applications.map(app => (
                                        <div key={app.id} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-sm border">{app.candidate?.name?.[0]}</div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900">{app.candidate?.name || "İsimsiz Aday"}</div>
                                                    <div className="text-xs text-gray-500">{app.candidate?.profession || "Meslek Yok"}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {app.resumeUrl && <a href={app.resumeUrl} target="_blank" className="text-[10px] border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 font-bold">CV</a>}
                                                {/* PROFİL LİNKİ GÜNCELLENDİ: [id] sayfasına gidiyor */}
                                                <Link href={`/profile/${app.candidate?.id}`} className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded font-bold hover:bg-slate-800">Profil</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- MOD 2: İŞ ARAMA (USTA, BEYAZ YAKA ve HERKES) --- */}
        {activeTab === 'browse' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
                
                {/* SOL: Filtreler ve Liste (Scrollable) */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    {/* Arama ve Filtre */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                placeholder="Pozisyon, firma veya yetenek ara..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 p-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            <button onClick={() => setFilterType('ALL')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterType === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Tümü</button>
                            <button onClick={() => setFilterType('BEYAZ_YAKA')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterType === 'BEYAZ_YAKA' ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Beyaz Yaka (Ofis/Yönetim)</button>
                            <button onClick={() => setFilterType('MAVI_YAKA')} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterType === 'MAVI_YAKA' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>Mavi Yaka (Saha/Usta)</button>
                        </div>
                    </div>

                    {/* İlan Listesi */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {filteredJobs.length === 0 && <div className="text-center py-10 text-gray-400">İlan bulunamadı.</div>}
                        {filteredJobs.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => setSelectedJob(job)}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg group ${selectedJob?.id === job.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-200'}`}
                            >
                                <div className="flex gap-4">
                                    {/* Firma Logosu */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 border border-slate-700">
                                        {job.company.name?.[0]}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h4>
                                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        <div className="text-xs font-bold text-gray-500 mt-1">{job.company.name}</div>
                                        
                                        {/* Bilgi Etiketleri */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold border border-gray-200">
                                                <FiMapPin size={10}/> {job.location}
                                            </span>
                                            {job.type && (
                                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-100">
                                                    <FiClock size={10}/> {job.type}
                                                </span>
                                            )}
                                            {job.salary && (
                                                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold border border-green-100">
                                                    <FiDollarSign size={10}/> {job.salary}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SAĞ: İlan Detayı (Sticky) */}
                <div className="lg:col-span-7 h-full hidden lg:block">
                    {selectedJob ? (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col overflow-hidden">
                            {/* Detay Header */}
                            <div className="p-8 border-b border-gray-100 relative">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-slate-100 to-white z-0"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-3xl font-bold text-slate-800 mb-4">
                                        {selectedJob.company.name?.[0]}
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{selectedJob.title}</h2>
                                    <div className="text-sm text-gray-500 font-medium mb-6">{selectedJob.company.name} • {selectedJob.location} • {new Date(selectedJob.createdAt).toLocaleDateString()}</div>
                                    
                                    <div className="flex gap-3 mb-6">
                                        {selectedJob.type && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">{selectedJob.type}</span>}
                                        {selectedJob.workModel && <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">{selectedJob.workModel}</span>}
                                        {selectedJob.experience && <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">{selectedJob.experience}</span>}
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${selectedJob.category === 'MAVI_YAKA' ? 'bg-indigo-50 text-indigo-700' : 'bg-pink-50 text-pink-700'}`}>
                                            {selectedJob.category === 'MAVI_YAKA' ? 'Mavi Yaka' : 'Beyaz Yaka'}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        {user?.role === 'COMPANY' ? (
                                            <button className="bg-gray-100 text-gray-400 px-8 py-3 rounded-xl font-bold text-sm cursor-not-allowed">Firma Başvuramaz</button>
                                        ) : (
                                            <button onClick={() => setIsApplyModalOpen(true)} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center gap-2">
                                                <FiCheckCircle/> Hemen Başvur
                                            </button>
                                        )}
                                        <button className="border border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-bold text-sm hover:bg-gray-50">Kaydet</button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Detay İçerik */}
                            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                                <h3 className="font-bold text-lg text-slate-900 mb-4">İş Tanımı</h3>
                                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedJob.description}
                                </div>
                                
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="font-bold text-slate-900 mb-4">Firma Hakkında</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500">
                                        Bu ilan <strong>{selectedJob.company.name}</strong> tarafından yayınlanmıştır. Civildai onaylı kurumsal firmadır.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center p-8 border-dashed shadow-sm">
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300"><FiBriefcase size={48}/></div>
                            <h3 className="text-xl font-bold text-slate-800">Bir ilan seçin</h3>
                            <p className="text-gray-500 mt-2 max-w-xs">Sol taraftaki listeden detaylarını görmek istediğiniz ilana tıklayın.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>

      {/* --- MODAL: İLAN YAYINLA (FİRMA) --- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-2xl animate-in zoom-in shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-2xl text-slate-900">Yeni İş İlanı</h3>
                    <button onClick={() => setIsPostModalOpen(false)} className="text-gray-400 hover:text-red-500"><FiX size={24}/></button>
                </div>
                <form action={async (formData) => { await createProfessionalJob(formData); setIsPostModalOpen(false); }}>
                    <input type="hidden" name="companyId" value={user.id} />
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        
                        {/* --- KATEGORİ SEÇİMİ (ZORUNLU) --- */}
                        <div className="col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                            <label className="text-xs font-bold text-blue-800 uppercase mb-2 block">Pozisyon Türü (Zorunlu)</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm w-1/2 justify-center hover:border-blue-500 transition-all">
                                    <input type="radio" name="category" value="BEYAZ_YAKA" required className="accent-blue-600" />
                                    <span className="text-sm font-bold text-slate-700">Beyaz Yaka (Ofis/Yönetim)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm w-1/2 justify-center hover:border-blue-500 transition-all">
                                    <input type="radio" name="category" value="MAVI_YAKA" required className="accent-blue-600" />
                                    <span className="text-sm font-bold text-slate-700">Mavi Yaka (Saha/Usta)</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İlan Başlığı</label>
                            <input name="title" required placeholder="Örn: Şantiye Şefi, Seramik Ustası" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Konum</label>
                            <input name="location" required placeholder="İstanbul, Kadıköy" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Maaş Aralığı (Opsiyonel)</label>
                            <input name="salary" placeholder="Örn: 40.000 - 50.000 TL" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Çalışma Şekli</label>
                            <select name="type" className="w-full border p-3.5 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-900">
                                <option>Tam Zamanlı</option><option>Yarı Zamanlı</option><option>Proje Bazlı</option><option>Günlük (Yevmiye)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Çalışma Modeli</label>
                            <select name="workModel" className="w-full border p-3.5 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-900">
                                <option>Şantiyede</option><option>Ofiste</option><option>Hibrit</option><option>Uzaktan</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tecrübe</label>
                            <input name="experience" placeholder="Örn: En az 5 yıl tecrübeli" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İş Tanımı ve Nitelikler</label>
                            <textarea name="description" required placeholder="Aradığınız özellikler, işin detayları..." className="w-full border p-3.5 rounded-xl text-sm h-40 resize-none outline-none focus:ring-2 focus:ring-blue-900"></textarea>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">İptal</button>
                        <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all">İlanı Yayınla</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL: BAŞVUR (ADAY) --- */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg animate-in zoom-in shadow-2xl">
                <h3 className="font-bold text-xl mb-1 text-slate-900">Başvurunu Tamamla</h3>
                <p className="text-sm text-gray-500 mb-6">{selectedJob.title} pozisyonu için başvuruyorsun.</p>
                
                <form action={async (formData) => { await applyToJob(formData); setIsApplyModalOpen(false); }}>
                    <input type="hidden" name="jobId" value={selectedJob.id} />
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Ad Soyad</label>
                            <input name="name" required defaultValue={user?.name} className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">E-Posta</label>
                            <input name="email" required type="email" defaultValue={user?.email} className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CV / Özgeçmiş Linki</label>
                            <input name="cvUrl" required defaultValue={user?.cvUrl} placeholder="LinkedIn, Drive veya Website linki" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Ön Yazı (Opsiyonel)</label>
                            <textarea name="coverLetter" placeholder="Kendinden kısaca bahset..." className="w-full border p-3.5 rounded-xl text-sm h-24 resize-none outline-none focus:ring-2 focus:ring-blue-600"></textarea>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg">Başvuruyu Gönder</button>
                    </div>
                </form>
                <button onClick={() => setIsApplyModalOpen(false)} className="w-full mt-4 text-sm text-gray-500 hover:text-slate-900">Vazgeç</button>
            </div>
        </div>
      )}

    </div>
  );
}