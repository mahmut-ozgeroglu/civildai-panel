// src/app/page.js
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiBriefcase, FiUser, FiHome, FiMenu } from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">C</div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Civildai</span>
            </div>

            {/* Menü (Desktop) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <a href="#nasil-calisir" className="hover:text-blue-600 transition-colors">Nasıl Çalışır?</a>
                <a href="#ozellikler" className="hover:text-blue-600 transition-colors">Özellikler</a>
                <a href="#network" className="hover:text-blue-600 transition-colors">Profesyoneller</a>
            </div>

            {/* Butonlar */}
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors">
                    Giriş Yap
                </Link>
                <Link href="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5">
                    Hemen Başla
                </Link>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION (GİRİŞ) --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
         {/* Arka Plan Süsü */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-50 -z-10"></div>

         <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                İnşaat Dünyasının Yeni Nesil Ağı
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Projeler <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Burada Başlar</span>,<br className="hidden md:block"/>
                Kariyerler Burada Yükselir.
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Mimar, Mühendis, Usta ve İnşaat Firmalarını tek bir çatı altında buluşturan; 
                Türkiye'nin en kapsamlı inşaat kariyer ve proje platformu.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <Link href="/login" className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-900/30 flex items-center justify-center gap-2 group">
                    Ücretsiz Katıl
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform"/>
                </Link>
                <Link href="/network" className="w-full sm:w-auto bg-white text-slate-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    Ustaları Keşfet
                </Link>
            </div>

            {/* İstatistikler */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 pt-8">
                {[
                    { label: "Profesyonel Üye", val: "10,000+" },
                    { label: "Tamamlanan Proje", val: "500+" },
                    { label: "Aktif Firma", val: "1,200+" },
                    { label: "Şehir", val: "81" },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl font-extrabold text-slate-900">{stat.val}</div>
                        <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* --- KİMLER İÇİN? (ROLLER) --- */}
      <section id="ozellikler" className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Herkes İçin Bir Yer Var</h2>
                  <p className="text-gray-500 mt-4 text-lg">İster iş arayın, ister proje verin, ister usta bulun.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* KART 1: PROFESYONELLER */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl mb-6 group-hover:scale-110 transition-transform">
                          <FiUser />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Ustalar & Mühendisler</h3>
                      <p className="text-gray-500 mb-6 leading-relaxed">
                          Profilinizi oluşturun, portfolyonuzu sergileyin ve büyük firmaların projelerinde yer alma şansı yakalayın.
                      </p>
                      <ul className="space-y-3 mb-8">
                          {['Profesyonel Profil', 'İş İlanlarına Başvuru', 'Network Ağı'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                  <FiCheckCircle className="text-green-500 shrink-0"/> {item}
                              </li>
                          ))}
                      </ul>
                      <Link href="/login" className="block w-full py-3 rounded-xl border border-blue-100 text-blue-600 font-bold text-center hover:bg-blue-50 transition-colors">
                          Profil Oluştur →
                      </Link>
                  </div>

                  {/* KART 2: FİRMALAR */}
                  <div className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                      
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400 text-3xl mb-6 group-hover:scale-110 transition-transform">
                          <FiBriefcase />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">İnşaat Firmaları</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                          Projeleriniz için en doğru ekipleri kurun. İlan verin, başvuruları yönetin ve en iyi yeteneklere ulaşın.
                      </p>
                      <ul className="space-y-3 mb-8">
                          {['Sınırsız İlan Verme', 'Aday Filtreleme', 'Şirket Profili'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                  <FiCheckCircle className="text-yellow-400 shrink-0"/> {item}
                              </li>
                          ))}
                      </ul>
                      <Link href="/login" className="block w-full py-3 rounded-xl bg-yellow-500 text-slate-900 font-bold text-center hover:bg-yellow-400 transition-colors">
                          Firma Hesabı Aç →
                      </Link>
                  </div>

                  {/* KART 3: BİREYSEL */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-3xl mb-6 group-hover:scale-110 transition-transform">
                          <FiHome />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Ev Sahipleri</h3>
                      <p className="text-gray-500 mb-6 leading-relaxed">
                          Evinizdeki tadilat için güvenilir bir usta mı arıyorsunuz? Bölgenizdeki en iyi profesyonellere ulaşın.
                      </p>
                      <ul className="space-y-3 mb-8">
                          {['Usta Arama Motoru', 'Puan ve Yorumlar', 'Güvenilir Hizmet'].map(item => (
                              <li key={item} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                  <FiCheckCircle className="text-green-500 shrink-0"/> {item}
                              </li>
                          ))}
                      </ul>
                      <Link href="/network" className="block w-full py-3 rounded-xl border border-green-100 text-green-600 font-bold text-center hover:bg-green-50 transition-colors">
                          Usta Bul →
                      </Link>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA (ALT ÇAĞRI) --- */}
      <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              {/* Süsler */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mb-20"></div>

              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">Civildai Ailesine Katılın</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 relative z-10">
                  Binlerce profesyonel ve yüzlerce firma şimdiden burada. Kariyerinizi bir üst seviyeye taşımak için beklemeyin.
              </p>
              <Link href="/login" className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-white/20 relative z-10">
                  Ücretsiz Hesap Oluştur
              </Link>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                   <span className="font-bold text-white text-lg">Civildai</span>
              </div>
              <div className="text-sm">
                  &copy; {new Date().getFullYear()} Civildai Inc. Tüm hakları saklıdır.
              </div>
              <div className="flex gap-6 text-sm font-medium">
                  <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
                  <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
                  <a href="#" className="hover:text-white transition-colors">İletişim</a>
              </div>
          </div>
      </footer>

    </div>
  );
}