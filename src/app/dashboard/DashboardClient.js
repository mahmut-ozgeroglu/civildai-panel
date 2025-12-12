// src/app/dashboard/DashboardClient.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { logout, getNotifications, markNotificationsAsRead, toggleAvailability, requestVerification } from '../actions';
import { 
  FiSearch, FiLogOut, FiUser, FiBriefcase, 
  FiHome, FiTool, FiTrendingUp, FiUsers,
  FiMessageSquare, FiBell, FiGlobe, FiActivity, FiCamera, FiShoppingBag,
  FiSettings, FiShield 
} from 'react-icons/fi';

export default function DashboardClient({ userRole, userId, userProfession, user }) {
  const [feedTab, setFeedTab] = useState('global');
  
  // --- STATE'LER ---
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  
  // YENİ: Doğrulama durumu için yerel state (Anında tepki için)
  const [verificationStatus, setVerificationStatus] = useState(user?.verificationStatus || 'NONE');
  
  const fileInputRef = useRef(null);

  // Bildirim State'leri
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
      if(userId) {
          getNotifications(userId).then(data => setNotifications(data));
      }
  }, [userId]);

  // Kullanıcı verisi sunucudan güncellenirse state'leri senkronize et
  useEffect(() => {
      setIsAvailable(user?.isAvailable || false);
      setVerificationStatus(user?.verificationStatus || 'NONE');
  }, [user]);

  const toggleNotifications = async () => {
      setIsNotifOpen(!isNotifOpen);
      if (!isNotifOpen && unreadCount > 0) {
          await markNotificationsAsRead(userId);
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
  };

  // --- MÜSAİTLİK DEĞİŞTİRME ---
  const handleAvailabilityToggle = async () => {
      const newState = !isAvailable;
      setIsAvailable(newState); // Hemen rengi değiştir
      await toggleAvailability(userId, newState);
  };

  // --- BELGE YÜKLEME ---
  const handleFileClick = () => {
      fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
          // 1. ÖNCE ARAYÜZÜ GÜNCELLE (Kullanıcı beklesin istemiyoruz)
          setVerificationStatus("PENDING"); 

          // 2. SONRA SUNUCUYA GÖNDER
          const formData = new FormData();
          formData.append("userId", userId);
          formData.append("file", file);
          await requestVerification(formData);
      }
  };

  // Menü Görünürlük Mantığı
  const isBlueCollar = (title) => title?.toLowerCase().match(/usta|kalfa|çırak|işçi|operatör|boyacı|tesisatçı/);
  const isWhiteCollar = (title) => title?.toLowerCase().match(/mimar|mühendis|şef|tekniker|yönetici|uzman/);
  
  const showJobOpportunities = isBlueCollar(userProfession) || userRole === 'INDIVIDUAL'; 
  const showCareer = isWhiteCollar(userProfession) || userRole === 'COMPANY';

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* İÇERİK */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* SOL: Profil ve Durum Kartı */}
        <div className="hidden md:block md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden pb-4">
                {/* Kapak & Avatar */}
                <div className="h-16 bg-gradient-to-r from-slate-700 to-slate-900"></div>
                <div className="w-16 h-16 bg-white rounded-full p-1 mx-auto -mt-8 relative z-10 shadow-sm">
                    <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xl overflow-hidden">
                        {userProfession?.[0] || <FiUser/>}
                    </div>
                    {/* Müsaitlik Işığı */}
                    {userRole === 'PROFESSIONAL' && (
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 ${isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div> 
                    )}
                </div>
                
                <div className="mt-3 px-4 text-center">
                    <h3 className="font-bold text-slate-900 flex items-center justify-center gap-1">
                        Hoşgeldin
                        {user?.isVerified && <span className="text-blue-600 ml-1" title="Onaylı Hesap">✓</span>}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{userProfession || "Kullanıcı"}</p>
                </div>

                {/* --- KONTROL PANELİ --- */}
                <div className="mt-4 px-4 space-y-3">
                    
                    {/* 1. Müsaitlik Anahtarı */}
                    {userRole === 'PROFESSIONAL' && (
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border border-gray-100">
                            <span className="text-xs font-bold text-gray-600">İş Arıyorum</span>
                            <button 
                                onClick={handleAvailabilityToggle}
                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${isAvailable ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    )}

                    {/* 2. Doğrulama Durumu (BURASI DÜZELTİLDİ) */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-800 font-bold text-xs mb-1"><FiShield/> Hesap Onayı</div>
                        
                        {user?.isVerified ? (
                            <div className="text-[10px] text-green-600 font-bold bg-white border border-green-200 py-1 rounded-full flex items-center justify-center gap-1">
                                <span className="text-xs">✓</span> Hesabınız Onaylı
                            </div>
                        ) : verificationStatus === 'PENDING' ? (
                            <div className="text-[10px] text-orange-600 font-bold bg-white border border-orange-200 py-1 rounded-full flex items-center justify-center gap-1 animate-pulse">
                                ● İnceleme Bekliyor
                            </div>
                        ) : (
                            <>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                                <button 
                                    onClick={handleFileClick}
                                    className="text-[10px] bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors"
                                >
                                    Belge Yükle
                                </button>
                                <p className="text-[9px] text-blue-400 mt-1">Henüz doğrulanmadı</p>
                            </>
                        )}
                    </div>

                </div>

                <a href="/profile" className="block w-full py-3 mt-4 text-xs font-bold text-slate-900 hover:bg-gray-50 border-t border-gray-200 text-center">Profilime Git</a>
            </div>
        </div>

        {/* ORTA: SOSYAL AKIŞ */}
        <div className="col-span-1 md:col-span-6 space-y-4">
            
            {/* Paylaşım Kutusu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0 text-slate-600"><FiUser /></div>
                <button className="flex-1 text-left bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-medium py-3 px-4 rounded-full transition-colors border border-gray-200">
                    Ağındaki kişilerle bir şeyler paylaş...
                </button>
            </div>

            {/* SEKMELER */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button 
                    onClick={() => setFeedTab('global')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${feedTab === 'global' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <FiGlobe /> Dünya
                </button>
                <button 
                    onClick={() => setFeedTab('following')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${feedTab === 'following' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <FiActivity /> Takip Ettiklerim
                </button>
            </div>

            {/* AKIŞ İÇERİĞİ */}
            <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <FiCamera size={32} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Akışın Şimdilik Sessiz</h3>
                <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
                    Takip ettiğin projelerden, şantiyelerden ve ağındaki kişilerden gelen güncellemeler burada görünecek.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <a href="/network" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Kişileri Keşfet</a>
                    <a href="/jobs" className="bg-white border border-gray-300 text-slate-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">İlanlara Bak</a>
                </div>
            </div>
        </div>

        {/* SAĞ: Gündem */}
        <div className="hidden md:block md:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm text-slate-900">Gündem</h3><FiTrendingUp className="text-gray-400" /></div>
                <ul className="space-y-4">
                    {['kentseldönüşüm', 'şantiyegüvenliği', 'mimari', 'inşaatteknolojileri'].map(tag => (
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

    </div>
  );
}