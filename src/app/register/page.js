// src/app/register/page.js
"use client";

import { register } from "../actions";
import { useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiBriefcase, FiTool } from "react-icons/fi";

export default function RegisterPage() {
  // Seçilen rolü takip etmek için state (Meslek listesini buna göre değiştireceğiz)
  const [role, setRole] = useState("");

  // Rol bazlı meslek listeleri
  const professionMap = {
    INDIVIDUAL: [
      "Arsa Sahibi",
      "Ev Sahibi",
      "Gayrimenkul Yatırımcısı",
      "Bireysel Kullanıcı"
    ],
    PROFESSIONAL: [
      "Mimar",
      "İnşaat Mühendisi",
      "Şantiye Şefi",
      "Elektrik Mühendisi",
      "Makine Mühendisi",
      "Harita Mühendisi",
      "İç Mimar",
      "Peyzaj Mimarı",
      "İş Güvenliği Uzmanı",
      "Usta (Genel)",
      "Kalıp Ustası",
      "Demir Ustası",
      "Sıvacı / Boyacı",
      "Elektrik Ustası",
      "Su Tesisatçısı",
      "Fayans / Seramik Ustası",
      "Kepçe Operatörü",
      "Vinç Operatörü"
    ],
    COMPANY: [
      "Müteahhitlik Firması",
      "Mimarlık Ofisi",
      "Mühendislik Bürosu",
      "Yapı Denetim Firması",
      "Taşeron Firma"
    ],
    SUPPLIER: [
      "Yapı Market / Nalbur",
      "Hazır Beton Firması",
      "Demir Çelik Tedarikçisi",
      "Boya Bayii",
      "Seramik & Vitrifiye",
      "İzolasyon Malzemecisi",
      "Hırdavatçı",
      "İskele & Kalıp Sistemleri",
      "Elektrik Malzemecisi"
    ]
  };

  const currentProfessions = professionMap[role] || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Logo & Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">civildai</h1>
          <p className="text-gray-500 text-sm mt-2">İnşaat dünyasının dijital üssüne katıl.</p>
        </div>

        <form action={register} className="space-y-4">
          
          {/* Ad Soyad */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiUser />
            </div>
            <input
              name="name"
              type="text"
              placeholder="Ad Soyad / Firma Adı"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiMail />
            </div>
            <input
              name="email"
              type="email"
              placeholder="E-posta Adresi"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Şifre */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiLock />
            </div>
            <input
              name="password"
              type="password"
              placeholder="Şifre"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Rol Seçimi */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiBriefcase />
            </div>
            <select
              name="role"
              required
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm appearance-none bg-white text-gray-700"
            >
              <option value="" disabled selected>Hesap Türü Seçin</option>
              <option value="INDIVIDUAL">Bireysel (Arsa/Ev Sahibi)</option>
              <option value="PROFESSIONAL">Profesyonel (Mimar, Mühendis, Usta)</option>
              <option value="COMPANY">Kurumsal (İnşaat Firması)</option>
              <option value="SUPPLIER">Tedarikçi (Nalbur, Malzeme, Beton)</option> {/* YENİ */}
            </select>
          </div>

          {/* Meslek Seçimi (Dinamik) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiTool />
            </div>
            <select
              name="profession"
              required
              disabled={!role} // Rol seçilmeden açılmasın
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm appearance-none bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="" disabled selected>
                {role ? "Meslek / Faaliyet Alanı Seçin" : "Önce Hesap Türü Seçin"}
              </option>
              {currentProfessions.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}