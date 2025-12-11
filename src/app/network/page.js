// src/app/network/page.js
import { getProfessionals } from "../actions";
import { prisma } from "../lib/prisma";
import { FiSearch, FiUser, FiBriefcase, FiMapPin, FiArrowLeft, FiExternalLink, FiMail } from "react-icons/fi";
import Link from "next/link";

// Bu sayfa hem veriyi çeker hem gösterir
export default async function NetworkPage({ searchParams }) {
  // 1. Tüm profesyonelleri çek
  const professionals = await getProfessionals();
  
  // 2. Arama filtresi (URL'den gelen ?q=... parametresine göre)
  // Next.js 15+ için searchParams await edilir
  const { q } = await searchParams || {};
  const searchTerm = q?.toLowerCase() || "";

  // 3. Filtreleme işlemi
  const filteredPros = professionals.filter(user => 
    user.name?.toLowerCase().includes(searchTerm) || 
    user.profession?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-slate-900 hover:text-white transition-all">
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-none">Profesyonel Ağı</h1>
                    <p className="text-xs text-slate-500 mt-1">Usta, Mimar ve Mühendisleri Keşfet</p>
                </div>
              </div>

              {/* Arama Kutusu (Basit Form) */}
              <form className="hidden md:block relative w-96">
                  <span className="absolute left-3 top-3.5 text-gray-400"><FiSearch /></span>
                  <input 
                    name="q" 
                    defaultValue={searchTerm} // Aranan kelime kutuda kalsın
                    placeholder="Meslek veya İsim Ara (Örn: Boyacı)" 
                    className="w-full pl-10 p-3 bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 border rounded-xl outline-none transition-all text-sm font-medium" 
                  />
              </form>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Mobil Arama (Sadece mobilde görünür) */}
        <form className="md:hidden mb-6 relative">
            <span className="absolute left-3 top-3.5 text-gray-400"><FiSearch /></span>
            <input 
              name="q" 
              defaultValue={searchTerm}
              placeholder="Usta veya Mühendis Ara..." 
              className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-xl outline-none shadow-sm" 
            />
        </form>

        {/* --- LİSTE --- */}
        {filteredPros.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
                <span className="text-5xl block mb-4">👷</span>
                <h3 className="font-bold text-slate-800 text-xl">Kimse Bulunamadı.</h3>
                <p className="text-gray-500 mt-2">Aradığınız kriterde bir profesyonel yok.</p>
                {searchTerm && <Link href="/network" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Aramayı Temizle</Link>}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPros.map((user) => (
                    <div key={user.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center text-center relative overflow-hidden">
                        
                        {/* Arka Plan Süsü */}
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-slate-100 to-gray-50 z-0"></div>

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md z-10 relative mt-4">
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white uppercase">
                                {user.name?.[0] || "U"}
                            </div>
                        </div>

                        {/* Bilgiler */}
                        <div className="mt-4 z-10 relative">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">{user.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                                    {user.profession || "Meslek Belirtilmemiş"}
                                </span>
                            </div>
                        </div>

                        {/* İletişim Butonları */}
                        <div className="flex gap-2 mt-6 w-full z-10 relative">
                             <a href={`mailto:${user.email}`} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                <FiMail /> Mesaj At
                             </a>
                             {user.cvUrl && (
                                 <a href={user.cvUrl} target="_blank" className="bg-gray-100 hover:bg-gray-200 text-slate-700 p-2.5 rounded-xl transition-colors" title="Profili/CV'yi Gör">
                                    <FiExternalLink size={20} />
                                 </a>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
}