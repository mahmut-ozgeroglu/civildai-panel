// src/app/projects/[id]/ProjectDetailClient.js
"use client";

import React, { useState } from 'react';
import { addTask, addProjectMessage, createProjectTender, createSiteLog, toggleTaskStatus } from '../../actions';
import { 
  FiArrowLeft, FiCheckSquare, FiCamera, FiMessageSquare, FiFileText, 
  FiPlus, FiClock, FiCheckCircle, FiSend, FiMapPin, FiMoreVertical, FiUser, FiExternalLink, FiHeart, FiMessageCircle 
} from 'react-icons/fi';
import Link from 'next/link';

export default function ProjectDetailClient({ project, currentUser }) {
  const [activeTab, setActiveTab] = useState('feed'); // Varsayılan: 'feed' (Akış)
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);

  // Görev İlerleme Oranı Hesapla
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleTaskToggle = async (taskId, currentStatus) => {
     await toggleTaskStatus(taskId, project.id, currentStatus);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* --- HEADER: PROJE BİLGİLERİ VE İLERLEME --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4">
              {/* Üst Satır */}
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                      <Link href="/projects" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-colors">
                          <FiArrowLeft size={20}/>
                      </Link>
                      <div>
                          <h1 className="font-bold text-slate-900 text-xl leading-none">{project.title}</h1>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FiMapPin size={10}/> {project.location || "Konum Yok"}
                          </p>
                      </div>
                  </div>
                  <div className="text-right">
                       <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${project.status === 'ONGOING' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                           {project.status === 'ONGOING' ? 'Aktif Şantiye' : 'Tamamlandı'}
                       </span>
                  </div>
              </div>

              {/* İlerleme Çubuğu */}
              <div className="bg-gray-100 rounded-full h-4 w-full relative overflow-hidden mb-2">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Başlangıç</span>
                  <span>%{progressPercentage} Tamamlandı</span>
                  <span>Bitiş</span>
              </div>
          </div>
          
          {/* --- SEKMELER (TABS) --- */}
          <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto no-scrollbar mt-2">
              <button onClick={() => setActiveTab('feed')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'feed' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiCamera size={18} /> Proje Akışı
              </button>
              <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'chat' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiMessageSquare size={18} /> Ekip Sohbeti
              </button>
              <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'tasks' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiCheckSquare size={18} /> İş Takibi
              </button>
              <button onClick={() => setActiveTab('tenders')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'tenders' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiFileText size={18} /> İhale & Teklifler
              </button>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* 1. PROJE AKIŞI (FEED - Ana Sayfa Gibi) */}
        {activeTab === 'feed' && (
             <div className="max-w-2xl mx-auto space-y-6">
                 {/* Paylaşım Alanı */}
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                             {currentUser.name?.[0]}
                         </div>
                         <form action={createSiteLog} className="flex-1">
                             <input type="hidden" name="projectId" value={project.id} />
                             <input type="hidden" name="userId" value={currentUser.id} />
                             <textarea name="content" required placeholder="Şantiyeden bir fotoğraf veya durum paylaş..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 h-20 resize-none mb-3"></textarea>
                             <div className="flex justify-between items-center">
                                 <button type="button" className="text-gray-400 hover:text-slate-900 flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-100"><FiCamera size={16}/> Fotoğraf/Video</button>
                                 <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Paylaş</button>
                             </div>
                         </form>
                     </div>
                 </div>

                 {/* Akış Listesi */}
                 {project.siteLogs.length === 0 && <div className="text-center text-gray-400 py-10">Henüz paylaşım yok.</div>}
                 {project.siteLogs.map(log => (
                     <div key={log.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                         <div className="p-4 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                 {log.user.name?.[0]}
                             </div>
                             <div>
                                 <div className="font-bold text-slate-900 text-sm">{log.user.name}</div>
                                 <div className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleDateString()} • {project.title}</div>
                             </div>
                             <button className="ml-auto text-gray-400"><FiMoreVertical/></button>
                         </div>
                         <div className="px-4 pb-2">
                             <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>
                         </div>
                         {/* Varsa Resim */}
                         {log.imageUrl && (
                            <div className="w-full h-64 bg-gray-100 mt-2">
                                {/* Gerçekte <img src={log.imageUrl} /> olacak */}
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><FiCamera size={40}/></div>
                            </div>
                         )}
                         <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6">
                             <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-bold"><FiHeart/> Beğen</button>
                             <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 text-sm font-bold"><FiMessageCircle/> Yorum Yap</button>
                         </div>
                     </div>
                 ))}
             </div>
        )}

        {/* 2. EKİP SOHBETİ */}
        {activeTab === 'chat' && (
            <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-sm text-gray-600 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FiMessageSquare /> Proje Ekibi ({project.messages.length} mesaj)</span>
                    <span className="text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Çevrimiçi</span>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#e5ddd5]/30">
                    {project.messages.length === 0 && <div className="text-center text-gray-400 mt-20">Sohbeti başlatın!</div>}
                    {project.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[70%] ${msg.userId === currentUser.id ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.user.name}</span>
                                <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.userId === currentUser.id ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-800 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 px-1">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-white border-t border-gray-200">
                    <form action={addProjectMessage} className="flex gap-2">
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="userId" value={currentUser.id} />
                        <input name="content" required placeholder="Mesaj yaz..." className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                        <button className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-transform hover:scale-105 shadow-md"><FiSend /></button>
                    </form>
                </div>
            </div>
        )}

        {/* 3. İŞ TAKİBİ & İLERLEME */}
        {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-48">
                        <h3 className="font-bold text-slate-900 mb-3">Yeni Görev Ekle</h3>
                        <form action={addTask}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <input name="title" required placeholder="Örn: 3. Kat Beton Dökümü" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-slate-900" />
                            <button className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Listeye Ekle</button>
                        </form>
                        <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500">
                            * Görev tamamlandığında ilerleme çubuğu otomatik güncellenir.
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                    {project.tasks.length === 0 && <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed text-gray-500">Henüz görev eklenmemiş.</div>}
                    {project.tasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${task.status === 'DONE' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleTaskToggle(task.id, task.status)} className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.status === 'DONE' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-slate-900'}`}>
                                    {task.status === 'DONE' && <FiCheckCircle size={14}/>}
                                </button>
                                <span className={`font-medium text-sm ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-slate-900'}`}>{task.title}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.status === 'DONE' ? 'Tamamlandı' : 'Yapılacak'}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 4. İHALELER & TEKLİFLER */}
        {activeTab === 'tenders' && (
            <div>
                 <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">Açık İhaleler</h3>
                        <p className="text-xs text-gray-500">Projeniz için alınan teklifler.</p>
                     </div>
                     {currentUser.id === project.ownerId && (
                         <button onClick={() => setIsTenderModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg"><FiPlus /> Yeni İhale</button>
                     )}
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                     {project.tenders.length === 0 && <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed text-gray-500">Aktif ihale bulunmuyor.</div>}
                     
                     {project.tenders.map(tender => (
                         <div key={tender.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                             <div className="p-6 border-b border-gray-100">
                                 <div className="flex justify-between items-start mb-2">
                                     <h4 className="font-bold text-slate-900 text-lg">{tender.title}</h4>
                                     <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full">AKTİF</span>
                                 </div>
                                 <p className="text-sm text-gray-600">{tender.description}</p>
                                 <div className="mt-4 flex gap-4 text-xs font-bold text-gray-500">
                                     <span>Bütçe: {tender.budget || "-"}</span>
                                     <span>{tender.proposals.length} Teklif</span>
                                 </div>
                             </div>
                             
                             {/* TEKLİFLER LİSTESİ */}
                             <div className="bg-gray-50 p-4">
                                 <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Gelen Teklifler</h5>
                                 {tender.proposals.length === 0 && <div className="text-xs text-gray-400 italic">Henüz teklif gelmemiş.</div>}
                                 <div className="space-y-2">
                                     {tender.proposals.map(proposal => (
                                         <div key={proposal.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                             <div className="flex items-center gap-3">
                                                 <Link href="/profile" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs hover:bg-blue-200 transition-colors">
                                                     {/* Normalde proposal.bidder.name[0] olmalı ama include etmedik, şimdilik sabit */}
                                                     <FiUser />
                                                 </Link>
                                                 <div>
                                                     {/* BURASI ÖNEMLİ: Link ile profil sayfasına gidiyoruz */}
                                                     <Link href="/profile" className="font-bold text-sm text-slate-900 hover:text-blue-600 hover:underline">
                                                         Teklif Veren Usta/Firma
                                                     </Link>
                                                     <div className="text-xs text-gray-500">{new Date(proposal.createdAt).toLocaleDateString()}</div>
                                                 </div>
                                             </div>
                                             <div className="text-right">
                                                 <div className="font-bold text-slate-900">{proposal.price} TL</div>
                                                 {proposal.note && <div className="text-[10px] text-gray-400 max-w-[150px] truncate">{proposal.note}</div>}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* Usta ise Teklif Ver */}
                             {currentUser.role === 'PROFESSIONAL' && (
                                 <div className="p-4 border-t border-gray-200">
                                     <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">Teklif Ver</button>
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>

                 {/* İhale Modal (Aynı kaldı) */}
                 {isTenderModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-2xl w-full max-w-md animate-in zoom-in shadow-2xl">
                            <h3 className="font-bold text-xl mb-6 text-slate-900">Yeni İhale Başlat</h3>
                            <form action={async (formData) => {
                                await createProjectTender(formData);
                                setIsTenderModalOpen(false);
                            }}>
                                <input type="hidden" name="projectId" value={project.id} />
                                <input type="hidden" name="companyId" value={currentUser.id} />
                                <div className="space-y-4">
                                    <input name="title" required placeholder="İhale Başlığı" className="w-full border p-3 rounded-xl text-sm" />
                                    <input name="budget" placeholder="Bütçe" className="w-full border p-3 rounded-xl text-sm" />
                                    <textarea name="description" required placeholder="Açıklama" className="w-full border p-3 rounded-xl text-sm h-24"></textarea>
                                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Yayınla</button>
                                </div>
                            </form>
                            <button onClick={() => setIsTenderModalOpen(false)} className="w-full mt-3 text-sm text-gray-500">Vazgeç</button>
                        </div>
                    </div>
                 )}
            </div>
        )}

      </div>
    </div>
  );
}