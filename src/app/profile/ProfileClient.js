// src/app/profile/ProfileClient.js
"use client";

import React, { useState } from 'react';
import { updateProfile } from '../actions';
import { FiUser, FiMail, FiBriefcase, FiMapPin, FiSave, FiEdit3, FiGlobe, FiBriefcase as FiWork, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function ProfileClient({ user }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'activity', 'settings'

  // Rol isimlendirmesi
  const roleLabels = {
    'COMPANY': 'Kurumsal Firma',
    'PROFESSIONAL': 'Profesyonel',
    'INDIVIDUAL': 'Bireysel Üye'
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- ÜST HEADER (GERİ DÖN) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-slate-900 font-bold transition-colors">
                  <FiArrowLeft /> Panele Dön
              </a>
              <div className="font-bold text-slate-900">Profil Yönetimi</div>
          </div>
      </div>

      {/* --- KAPAK FOTOĞRAFI --- */}
      <div className="h-48 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 relative">
          <div className="absolute bottom-4 right-4 bg-black/30 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
             Kapak Fotoğrafı
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        
        {/* --- PROFİL KARTI --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md shrink-0">
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-500 uppercase border-4 border-white">
                        {user.name?.[0] || "U"}
                    </div>
                </div>

                {/* İsim ve Başlık */}
                <div className="flex-1 mb-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{user.name || "İsimsiz Kullanıcı"}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                        <span className="flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-xs uppercase tracking-wide border border-blue-100">
                            {roleLabels[user.role]}
                        </span>
                        {user.profession && (
                            <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                                <FiBriefcase /> {user.profession}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                            <FiMapPin /> Türkiye
                        </span>
                    </div>
                </div>

                {/* Düzenle Butonu */}
                <div className="mb-2 hidden md:block">
                     <button onClick={() => setActiveTab('settings')} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 shadow-md transition-transform active:scale-95 text-sm flex items-center gap-2">
                        <FiEdit3 /> Profili Düzenle
                     </button>
                </div>
            </div>

            {/* --- SEKMELER (TABS) --- */}
            <div className="mt-10 flex border-b border-gray-200 overflow-x-auto">
                <button onClick={() => setActiveTab('about')} className={`pb-4 px-6 font-bold text-sm transition-colors whitespace-nowrap relative ${activeTab === 'about' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Hakkında
                    {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setActiveTab('activity')} className={`pb-4 px-6 font-bold text-sm transition-colors whitespace-nowrap relative ${activeTab === 'activity' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Hareketler ({user.jobs.length + user.applications.length})
                    {activeTab === 'activity' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setActiveTab('settings')} className={`pb-4 px-6 font-bold text-sm transition-colors whitespace-nowrap relative ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Ayarlar
                    {activeTab === 'settings' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
            </div>
        </div>

        {/* --- İÇERİK ALANI --- */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SOL KOLON (İletişim & Özet) */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <FiGlobe className="text-gray-400"/> İletişim
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><FiMail/></div>
                            <span className="break-all font-medium">{user.email}</span>
                        </li>
                        {user.cvUrl && (
                             <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0"><FiCheckCircle/></div>
                                <a href={user.cvUrl} target="_blank" className="text-blue-600 hover:underline truncate font-bold">CV / Portfolyo Linki</a>
                            </li>
                        )}
                    </ul>
                </div>

                {/* İstatistik Kutusu */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-4 opacity-90">Panel Özeti</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <span className="block text-2xl font-bold">{user.jobs.length}</span>
                            <span className="text-xs opacity-70">Yayınlanan İlan</span>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <span className="block text-2xl font-bold">{user.applications.length}</span>
                            <span className="text-xs opacity-70">Yapılan Başvuru</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ KOLON (Değişen İçerik) */}
            <div className="lg:col-span-2">
                
                {/* 1. HAKKINDA TABI */}
                {activeTab === 'about' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in zoom-in duration-300">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Profil Detayları</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Merhaba, ben <strong>{user.name}</strong>. Civildai platformunda <strong>{roleLabels[user.role]}</strong> olarak yer alıyorum.
                            {user.profession ? ` Uzmanlık alanım ${user.profession}.` : ''} 
                            <br/><br/>
                            Bu platform üzerinden {user.role === 'COMPANY' ? 'projelerimiz için en yetenekli profesyonelleri arıyoruz.' : 'kariyer hedeflerim doğrultusunda yeni fırsatları değerlendiriyorum.'}
                        </p>
                    </div>
                )}

                {/* 2. HAREKETLER TABI */}
                {activeTab === 'activity' && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                        {/* İlanlar */}
                        {user.jobs.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FiBriefcase/> Yayınladığım İlanlar</h3>
                                <div className="space-y-3">
                                    {user.jobs.map(job => (
                                        <div key={job.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="font-bold text-slate-800">{job.title}</div>
                                                <div className="text-xs text-gray-500">{job.location} • {new Date(job.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Yayında</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Başvurular */}
                        {user.applications.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FiCheckCircle/> Başvurularım</h3>
                                <div className="space-y-3">
                                    {user.applications.map(app => (
                                        <div key={app.id} className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-blue-900">{app.job?.title || "Silinmiş İlan"}</div>
                                                <div className="text-xs text-blue-700">Başvuru Tarihi: {new Date(app.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <span className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded border border-blue-200">İletildi</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user.jobs.length === 0 && user.applications.length === 0 && (
                            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-200 border-dashed">
                                <span className="text-4xl block mb-2">📭</span>
                                Henüz bir hareket yok.
                            </div>
                        )}
                    </div>
                )}

                {/* 3. AYARLAR TABI (DÜZENLEME FORMU) */}
                {activeTab === 'settings' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in zoom-in duration-300">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Bilgileri Güncelle</h3>
                        
                        <form action={updateProfile}>
                            <input type="hidden" name="userId" value={user.id} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad / Firma Adı</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400"><FiUser/></span>
                                        <input name="name" defaultValue={user.name} type="text" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresi</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400"><FiMail/></span>
                                        <input name="email" defaultValue={user.email} type="email" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            {/* Sadece Profesyoneller için Meslek Alanı */}
                            {user.role === 'PROFESSIONAL' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Meslek / Unvan</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400"><FiWork/></span>
                                        <input name="profession" defaultValue={user.profession} placeholder="Örn: Seramik Ustası, Mimar..." type="text" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                    </div>
                                </div>
                            )}

                             <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">CV / Website Linki</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-gray-400"><FiGlobe/></span>
                                    <input name="cvUrl" defaultValue={user.cvUrl} placeholder="https://..." type="url" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-green-200 transition-all flex items-center gap-2">
                                    <FiSave /> Değişiklikleri Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
}