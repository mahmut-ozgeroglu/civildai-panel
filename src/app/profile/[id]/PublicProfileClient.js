// src/app/profile/[id]/PublicProfileClient.js
"use client";

import React from 'react';
import { FiMapPin, FiMail, FiBriefcase, FiUser, FiCheckCircle, FiDownload, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';

export default function PublicProfileClient({ user, projects }) {
  
  // Meslek Grubu Belirleme
  const isBlueCollar = user.profession?.toLowerCase().match(/usta|kalfa|işçi|operatör/);
  
  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* --- KART 1: KİMLİK KARTI --- */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 relative">
            {/* Kapak Fotoğrafı */}
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                    {user.role === 'COMPANY' ? 'KURUMSAL ÜYE' : isBlueCollar ? 'MAVİ YAKA UZMAN' : 'PROFESYONEL ÜYE'}
                </div>
            </div>
            
            <div className="px-8 pb-8 relative">
                {/* Profil Resmi */}
                <div className="w-32 h-32 bg-white rounded-full p-1.5 -mt-16 relative z-10 shadow-lg">
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-4xl border border-slate-200">
                        {user.name?.[0]}
                    </div>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                            {user.name} 
                            {user.role === 'COMPANY' && <FiCheckCircle className="text-blue-500" size={20} title="Onaylı Firma"/>}
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">{user.profession || "Ünvan Belirtilmemiş"}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-1"><FiMapPin/> Türkiye</span>
                            <span className="flex items-center gap-1"><FiMail/> {user.email}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* --- İŞTE BURAYA EKLENDİ --- */}
                        <Link 
                          href={`/messages?userId=${user.id}`} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                        >
                          <FiMessageSquare /> Mesaj Gönder
                        </Link>

                        {user.cvUrl && (
                            <a href={user.cvUrl} target="_blank" className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                                <FiDownload/> CV İndir
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- KART 2: HAKKINDA & YETENEKLER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Hakkında</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {user.about || "Kullanıcı henüz bir açıklama girmemiş."}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Uzmanlık Alanı</h3>
                <div className="flex flex-wrap gap-2">
                    {user.profession ? (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">{user.profession}</span>
                    ) : (
                        <span className="text-gray-400 text-xs italic">Belirtilmemiş</span>
                    )}
                </div>
            </div>
        </div>

        {/* --- KART 3: PORTFOLYO (PROJELER) --- */}
        <h3 className="font-bold text-xl text-slate-900 mb-4 flex items-center gap-2"><FiBriefcase/> Portfolyo ve Geçmiş İşler</h3>
        
        {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed text-gray-400">
                Bu kullanıcı henüz proje eklememiş.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(project => (
                    <div key={project.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 hover:shadow-md transition-all">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                            {project.imageUrl ? <img src={project.imageUrl} className="w-full h-full object-cover" alt={project.title}/> : <FiBriefcase size={24}/>}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{project.title}</h4>
                            <div className="text-xs text-gray-500 mt-1 mb-2 line-clamp-2">{project.description}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
}