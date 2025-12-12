// src/app/network/NetworkClient.js
"use client";

import React, { useState } from 'react';
import { followUser } from '../actions'; 
import { 
  FiSearch, FiUser, FiBriefcase, FiMapPin, 
  FiUserPlus, FiCheckCircle, FiTool, FiCheck 
} from 'react-icons/fi';
import Link from 'next/link';

export default function NetworkClient({ currentUser, initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); 

  // Takip edilenleri yerel state'te tutalım ki butona basınca anında değişsin
  // (Başlangıçta veritabanından gelen veriyi kontrol ediyoruz)
  const [followingList, setFollowingList] = useState(
      currentUser?.following?.map(f => f.followingId) || []
  );

  const handleFollow = async (targetUserId) => {
      // 1. Optimistic Update (Hemen arayüzü güncelle)
      setFollowingList([...followingList, targetUserId]);

      // 2. Server Action'ı çağır
      const formData = new FormData();
      formData.append("followerId", currentUser.id);
      formData.append("followingId", targetUserId);
      await followUser(formData);
  };

  const filteredUsers = users.filter(user => {
      if (user.id === currentUser?.id) return false;

      const matchSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.profession?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchFilter = true;
      if (activeFilter === 'COMPANY') matchFilter = user.role === 'COMPANY';
      if (activeFilter === 'PROFESSIONAL') matchFilter = user.role === 'PROFESSIONAL';
      if (activeFilter === 'MAVI_YAKA') matchFilter = user.profession?.toLowerCase().match(/usta|kalfa|işçi|operatör/);
      
      return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* SEARCH HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                      <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg"/>
                      <input 
                        type="text" 
                        placeholder="İsim, meslek veya firma ara..." 
                        className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-sm outline-none transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  {/* Filtre Butonları */}
<div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
    <button 
        onClick={() => setActiveFilter('ALL')} 
        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex-shrink-0 ${activeFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
    >
        Tümü
    </button>
    
    <button 
        onClick={() => setActiveFilter('COMPANY')} 
        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${activeFilter === 'COMPANY' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
    >
        <FiBriefcase/> Firmalar
    </button>
    
    <button 
        onClick={() => setActiveFilter('PROFESSIONAL')} 
        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${activeFilter === 'PROFESSIONAL' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
    >
        <FiUser/> Profesyoneller
    </button>
    
    <button 
        onClick={() => setActiveFilter('MAVI_YAKA')} 
        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${activeFilter === 'MAVI_YAKA' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
    >
        <FiTool/> Ustalar & Saha
    </button>
</div>
              </div>
          </div>
      </div>

      <style jsx>{`
        .filter-btn { @apply px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap flex items-center gap-2 bg-white text-gray-600 border-gray-200 hover:bg-gray-50; }
        .filter-btn.active { @apply bg-slate-900 text-white border-slate-900; }
      `}</style>

      {/* SONUÇLAR */}
      <div className="max-w-7xl mx-auto px-4 py-8">
          
          <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-slate-900 text-lg">{searchTerm ? `"${searchTerm}" sonuçları` : 'Önerilen Bağlantılar'}</h2>
              <span className="text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-full border border-gray-200">{filteredUsers.length} Kişi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => {
                  const isFollowing = followingList.includes(user.id);

                  return (
                    <div key={user.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
                        <div className={`h-20 ${user.role === 'COMPANY' ? 'bg-gradient-to-r from-blue-900 to-slate-900' : 'bg-gradient-to-r from-slate-100 to-gray-200'}`}></div>
                        
                        <div className="px-6 relative">
                            <div className="w-20 h-20 bg-white rounded-xl p-1 -mt-10 relative z-10 shadow-md">
                                <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-2xl border border-slate-200">
                                    {user.name?.[0]}
                                </div>
                                
                                {/* --- 1. MAVİ TİK (VERIFIED) --- */}
                                {(user.isVerified || user.role === 'COMPANY') && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm z-20" title="Onaylı Hesap">
                                        <FiCheckCircle size={12}/>
                                    </div>
                                )}

                                {/* --- 2. MÜSAİTLİK IŞIĞI (Sadece Profesyonellerde) --- */}
                                {user.role === 'PROFESSIONAL' && (
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white z-20 shadow-sm ${user.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} title={user.isAvailable ? "Müsait / İş Arıyor" : "Meşgul / Projede"}></div>
                                )}
                            </div>
                            
                            {/* Bilgiler (Aynı kalıyor) */}
                            <div className="mt-4 mb-6">
                                <Link href={`/profile/${user.id}`} className="font-bold text-lg text-slate-900 hover:text-blue-600 hover:underline transition-colors block truncate">
                                    {user.name}
                                </Link>
                                <div className="text-sm text-gray-600 font-medium truncate mb-1">
                                    {user.profession || (user.role === 'COMPANY' ? 'İnşaat Firması' : 'Ünvan Yok')}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <FiMapPin size={10}/> {user.city || "Türkiye"}
                                </div>
                                
                                {/* Müsaitlik Metni */}
                                {user.role === 'PROFESSIONAL' && user.isAvailable && (
                                    <div className="mt-2 inline-block bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">
                                        🟢 İş Arıyor
                                    </div>
                                )}
                            </div>

                            {/* Butonlar (Aynı kalıyor) */}
                            <div className="flex gap-3 pb-6 border-t border-gray-100 pt-4">
                                {/* ... Takip Et ve Profil Butonları ... */}
                            </div>
                        </div>
                    </div>

                  );
              })}
          </div>
      </div>
    </div>
  );
}