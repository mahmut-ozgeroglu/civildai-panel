// src/components/Header.js
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '../app/actions'; // Logout fonksiyonunu buradan çağıracağız
import { 
  FiSearch, FiLogOut, FiUser, FiHome, FiTool, FiTrendingUp, 
  FiUsers, FiBriefcase, FiMessageSquare 
} from 'react-icons/fi';

export default function Header({ user }) {
  const pathname = usePathname();

  // Eğer giriş yapılmamışsa veya Login/Register sayfasındaysak menüyü gösterme
  if (!user || pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  // Rol ve Meslek Kontrolü
  const isBlueCollar = user.profession?.toLowerCase().match(/usta|kalfa|çırak|işçi|operatör|boyacı|tesisatçı/);
  const isWhiteCollar = user.profession?.toLowerCase().match(/mimar|mühendis|şef|tekniker|yönetici|uzman/);
  
  const showJobOpportunities = isBlueCollar || user.role === 'INDIVIDUAL'; 
  const showCareer = isWhiteCollar || user.role === 'COMPANY';

  // Link stilleri
  const getLinkClass = (path) => {
    const isActive = pathname.startsWith(path);
    return `flex flex-col items-center justify-center h-full px-2 md:px-3 transition-colors cursor-pointer shrink-0 
      ${isActive ? 'text-slate-900 border-b-2 border-slate-900' : 'text-gray-500 hover:text-slate-900'}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm px-4 h-16">
         <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">C</div>
               <div className="relative w-64 hidden lg:block">
                  <span className="absolute left-3 top-2.5 text-gray-500"><FiSearch /></span>
                  <input type="text" placeholder="Arama yap..." className="w-full bg-blue-50 border-none rounded-md py-2 pl-10 pr-4 text-sm outline-none" />
               </div>
            </div>

            {/* Menü */}
            <nav className="flex items-center gap-1 md:gap-4 h-full overflow-x-auto no-scrollbar">
                <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                    <FiHome size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Ana Sayfa</span>
                </Link>
                
                {showJobOpportunities && (
                    <Link href="/jobs" className={getLinkClass('/jobs')}>
                        <FiTool size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">İş Fırsatları</span>
                    </Link>
                )}
                
                {showCareer && (
                    <Link href="/jobs" className={getLinkClass('/jobs')}>
                        <FiTrendingUp size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Kariyer</span>
                    </Link>
                )}
                
                <Link href="/network" className={getLinkClass('/network')}>
                    <FiUsers size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Ağım</span>
                </Link>
                <Link href="/projects" className={getLinkClass('/projects')}>
                    <FiBriefcase size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Projelerim</span>
                </Link>
                <Link href="/messages" className={getLinkClass('/messages')}>
                    <FiMessageSquare size={22} /><span className="hidden md:block text-[10px] font-bold mt-1">Mesajlar</span>
                </Link>
            </nav>

            {/* Profil */}
            <div className="flex items-center gap-3 border-l pl-4 md:pl-6 border-gray-200 h-10">
                <Link href="/profile" className="flex items-center gap-2 group">
                     <div className="text-right hidden md:block">
                         <span className="text-xs font-bold text-slate-900 block">{user.role === 'COMPANY' ? 'KURUMSAL' : 'HESABIM'}</span>
                         <span className="text-[10px] text-gray-500 max-w-[100px] truncate">{user.profession || "Kullanıcı"}</span>
                     </div>
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 border border-gray-300 group-hover:border-slate-900 transition-colors">
                        {user.name?.[0] || <FiUser />}
                    </div>
                </Link>
                <button onClick={() => logout()} className="text-gray-400 hover:text-red-600 ml-2"><FiLogOut size={20} /></button>
            </div>
         </div>
    </div>
  );
}