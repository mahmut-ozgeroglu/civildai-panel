// src/app/login/page.js
import { login } from "../actions";
import { FiLock, FiMail } from "react-icons/fi";

// DİKKAT: Fonksiyonu 'async' yaptık
export default async function LoginPage({ searchParams }) {
  
  // DİKKAT: searchParams verisini önce 'await' ile bekliyoruz (Yeni Next.js kuralı)
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
            C
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Yönetim Paneli</h1>
          <p className="text-gray-500 text-sm">Devam etmek için giriş yapın</p>
        </div>

        {/* Hata Mesajı Gösterme Alanı */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
             Giriş başarısız. Bilgileri kontrol edin.
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><FiMail /></span>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="admin@civildai.com"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><FiLock /></span>
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="******"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
            Giriş Yap
          </button>
        </form>

      </div>
    </div>
  );
}