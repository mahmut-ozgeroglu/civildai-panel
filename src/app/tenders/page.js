// src/app/tenders/page.js
import { getTenders, createTender } from "../actions";
import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { FiPlus, FiBriefcase, FiDollarSign, FiClock, FiFileText } from "react-icons/fi";

export default async function TendersPage() {
  const session = (await cookies()).get("session")?.value;
  let user = null;
  
  if (session) {
    const secret = new TextEncoder().encode("civildai");
    const { payload } = await jwtVerify(session, secret);
    user = await prisma.user.findUnique({ where: { email: payload.email } });
  }

  const tenders = await getTenders();

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 p-4 shadow-sm">
         <div className="max-w-5xl mx-auto flex justify-between items-center">
             <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 <FiFileText /> İhale & Teklifler
             </h1>
             {/* Sadece Firmalar İhale Açabilir */}
             {user?.role === 'COMPANY' && (
                 <form action={createTender} className="flex gap-2">
                     <input type="hidden" name="companyId" value={user.id} />
                     <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800">
                        <FiPlus /> Yeni İhale Aç (Demo)
                     </button>
                     {/* Not: Gerçekte buraya Modal açardık, hızlı olsun diye demo buton yaptım */}
                 </form>
             )}
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* İHALE LİSTESİ */}
        <div className="grid gap-4">
            {tenders.map(tender => (
                <div key={tender.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">AÇIK İHALE</span>
                                <span className="text-xs text-gray-400">{new Date(tender.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{tender.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{tender.description}</p>
                        </div>
                        <div className="text-right">
                             <div className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1">
                                 <FiDollarSign className="text-green-600"/> {tender.budget || "Belirtilmedi"}
                             </div>
                             <div className="text-xs text-gray-400 mt-1">{tender.proposals.length} Teklif Verildi</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs">
                                {tender.company.name?.[0]}
                            </div>
                            <span className="text-xs font-bold text-gray-600">{tender.company.name}</span>
                        </div>
                        
                        {user?.role === 'PROFESSIONAL' ? (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-colors">
                                Teklif Ver
                            </button>
                        ) : (
                            <button className="text-gray-400 text-sm cursor-not-allowed font-medium">Firma Görünümü</button>
                        )}
                    </div>
                </div>
            ))}

            {tenders.length === 0 && (
                <div className="text-center py-20 text-gray-400">Henüz açık ihale yok.</div>
            )}
        </div>
      </div>
    </div>
  );
}