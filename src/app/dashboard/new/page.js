// src/app/dashboard/new/page.js
import { createJob } from "@/app/actions";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100">
        
        {/* Başlık ve Geri Dön Butonu */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <FiArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Yeni İlan Oluştur</h1>
        </div>

        {/* Form Başlangıcı */}
        {/* action={createJob} diyerek Server Action'ı bağlıyoruz */}
        <form action={createJob} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İlan Başlığı</label>
            <input 
              name="title" 
              type="text" 
              placeholder="Örn: Şantiye Şefi" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konum / Şehir</label>
            <input 
              name="location" 
              type="text" 
              placeholder="Örn: İstanbul, Avrupa Yakası" 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İş Tanımı & Detaylar</label>
            <textarea 
              name="description" 
              rows="5" 
              placeholder="Aranan nitelikler, iş tanımı vb..." 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <FiSave size={20} />
            İlanı Yayınla
          </button>

        </form>
      </div>
    </div>
  );
}