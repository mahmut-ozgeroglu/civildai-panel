// src/app/projects/ProjectsClient.js
"use client";

import React, { useState } from 'react';
import { createProject } from '../actions';
import { FiPlus, FiMapPin, FiCheckCircle, FiClock, FiImage, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link'; // <-- YENİ EKLENDİ

export default function ProjectsClient({ user, initialProjects }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rolüne göre başlık değişsin
  const getPageTitle = () => {
    if (user.role === 'COMPANY') return "Şantiyelerimiz & Projelerimiz";
    if (user.role === 'PROFESSIONAL') return "Portfolyom & İşlerim";
    return "Projelerim & Tadilatlarım";
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-slate-900 font-bold transition-colors">
                  <FiArrowLeft /> Panele Dön
              </a>
              <div className="font-bold text-slate-900 text-lg hidden md:block">{getPageTitle()}</div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                  <FiPlus /> Yeni Proje Ekle
              </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* BOŞ DURUM */}
        {initialProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <FiImage size={32} />
                </div>
                <h3 className="font-bold text-slate-800 text-xl">Henüz Proje Eklenmemiş</h3>
                <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                    {user.role === 'PROFESSIONAL' 
                        ? 'Yaptığın işleri buraya ekleyerek firmaların dikkatini çekebilirsin.' 
                        : 'Devam eden veya tamamlanan projelerini burada sergile.'}
                </p>
                <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline">
                    İlk Projeni Oluştur
                </button>
            </div>
        ) : (
            /* PROJE LİSTESİ (GRID) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProjects.map((project) => (
                    // --- DÜZELTME BURADA: Tıklanabilir Link Eklendi ---
                    <Link key={project.id} href={`/projects/${project.id}`} className="block h-full">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full cursor-pointer">
                            
                            {/* Proje Resmi */}
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {project.imageUrl ? (
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <FiImage size={40} />
                                    </div>
                                )}
                                
                                {/* Durum Etiketi */}
                                <div className="absolute top-3 right-3">
                                    {project.status === 'COMPLETED' ? (
                                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <FiCheckCircle /> Tamamlandı
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <FiClock /> Devam Ediyor
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                    <FiMapPin /> {project.location || "Konum Belirtilmedi"}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                                    {project.description}
                                </p>
                                
                                <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
                                    {new Date(project.createdAt).toLocaleDateString('tr-TR')} tarihinde eklendi
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}

      </div>

      {/* --- MODAL AYNI KALDI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500"><FiPlus className="rotate-45" size={24}/></button>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Proje Detayları</h2>
              
              <form action={async (formData) => {
                  await createProject(formData);
                  setIsModalOpen(false);
              }}>
                  <input type="hidden" name="userId" value={user.id} />
                  
                  <div className="space-y-4">
                      <input name="title" required type="text" placeholder="Proje Adı (Örn: Çamlıca Villaları)" className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none bg-gray-50 text-sm" />
                      
                      <div className="grid grid-cols-2 gap-4">
                          <input name="location" type="text" placeholder="Konum (İstanbul, Kadıköy)" className="w-full border border-gray-200 p-4 rounded-xl outline-none bg-gray-50 text-sm" />
                          <select name="status" className="w-full border border-gray-200 p-4 rounded-xl outline-none bg-gray-50 text-sm">
                              <option value="ONGOING">⏳ Devam Ediyor</option>
                              <option value="COMPLETED">✅ Tamamlandı</option>
                          </select>
                      </div>

                      <input name="imageUrl" type="url" placeholder="Kapak Fotoğrafı Linki (Opsiyonel)" className="w-full border border-gray-200 p-4 rounded-xl outline-none bg-gray-50 text-sm" />
                      
                      <textarea name="description" required placeholder="Proje hakkında detaylar..." className="w-full border border-gray-200 p-4 rounded-xl h-32 resize-none focus:ring-2 focus:ring-slate-900 outline-none bg-gray-50 text-sm"></textarea>
                      
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20">
                        Projeyi Kaydet
                      </button>
                  </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}