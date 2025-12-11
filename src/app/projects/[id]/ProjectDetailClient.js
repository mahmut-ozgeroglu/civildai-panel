// src/app/projects/[id]/ProjectDetailClient.js
"use client";

import React, { useState } from 'react';
import { addTask, addProjectMessage, createProjectTender, createSiteLog, toggleTaskStatus } from '../../actions';
import { 
  FiArrowLeft, FiCheckSquare, FiCamera, FiMessageSquare, FiFileText, 
  FiPlus, FiClock, FiCheckCircle, FiSend, FiMapPin, FiMoreVertical, FiUser 
} from 'react-icons/fi';

export default function ProjectDetailClient({ project, currentUser }) {
  // Varsayılan sekme 'tasks' (İş Takibi)
  const [activeTab, setActiveTab] = useState('tasks'); 
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);

  // Görev Tamamlama Tetikleyicisi
  const handleTaskToggle = async (taskId, currentStatus) => {
     await toggleTaskStatus(taskId, project.id, currentStatus);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans pb-20">
      
      {/* --- HEADER: PROJE BİLGİLERİ --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <a href="/projects" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-colors">
                      <FiArrowLeft size={20}/>
                  </a>
                  <div>
                      <h1 className="font-bold text-slate-900 text-xl leading-none">{project.title}</h1>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FiMapPin size={10}/> {project.location || "Konum Yok"}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                   <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${project.status === 'ONGOING' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                       {project.status === 'ONGOING' ? 'Aktif Şantiye' : 'Tamamlandı'}
                   </span>
                   {/* Sadece Proje Sahibi Düzenleyebilir */}
                   {currentUser.id === project.ownerId && (
                       <button className="text-gray-400 hover:text-slate-900"><FiMoreVertical /></button>
                   )}
              </div>
          </div>
          
          {/* --- SEKMELER (NAVIGASYON) --- */}
          <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'tasks' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiCheckSquare size={18} /> İş Takibi
              </button>
              <button onClick={() => setActiveTab('logs')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'logs' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiCamera size={18} /> Şantiye Duvarı
              </button>
              <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'chat' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiMessageSquare size={18} /> Sohbet
              </button>
              <button onClick={() => setActiveTab('tenders')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'tenders' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  <FiFileText size={18} /> İhale & Teklifler
              </button>
          </div>
      </div>

      {/* --- İÇERİK ALANI --- */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* 1. İŞ TAKİBİ (TODO LIST) */}
        {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-36">
                        <h3 className="font-bold text-slate-900 mb-3">Yeni Görev Ekle</h3>
                        <form action={addTask}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <input name="title" required placeholder="Yapılacak iş nedir?" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-slate-900" />
                            <button className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Listeye Ekle</button>
                        </form>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                    {project.tasks.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
                            <span className="text-4xl block mb-2">📝</span>
                            <span className="text-gray-500 font-medium">Henüz görev eklenmemiş.</span>
                        </div>
                    )}
                    {project.tasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${task.status === 'DONE' ? 'bg-green-50 border-green-100 opacity-70' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleTaskToggle(task.id, task.status)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.status === 'DONE' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-slate-900'}`}>
                                    {task.status === 'DONE' && <FiCheckCircle size={14}/>}
                                </button>
                                <span className={`font-medium text-sm ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-slate-900'}`}>{task.title}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {task.status === 'DONE' ? 'Tamamlandı' : 'Yapılacak'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 2. ŞANTİYE DUVARI (LOGS) */}
        {activeTab === 'logs' && (
             <div className="max-w-2xl mx-auto">
                 {/* Paylaşım Alanı */}
                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                     <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                             {currentUser.name?.[0]}
                         </div>
                         <form action={createSiteLog} className="flex-1">
                             <input type="hidden" name="projectId" value={project.id} />
                             <input type="hidden" name="userId" value={currentUser.id} />
                             <textarea name="content" required placeholder="Şantiyeden son durum ne? Not al..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none mb-3"></textarea>
                             <div className="flex justify-between items-center">
                                 <button type="button" className="text-gray-400 hover:text-slate-900"><FiCamera size={20}/></button>
                                 <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Paylaş</button>
                             </div>
                         </form>
                     </div>
                 </div>

                 {/* Akış */}
                 <div className="space-y-6">
                     {project.siteLogs.length === 0 && <div className="text-center text-gray-400">Henüz şantiye notu paylaşılmadı.</div>}
                     {project.siteLogs.map(log => (
                         <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                             <div className="flex items-center gap-3 mb-3">
                                 <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                     {log.user.name?.[0]}
                                 </div>
                                 <div>
                                     <div className="font-bold text-slate-900 text-sm">{log.user.name}</div>
                                     <div className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleDateString()}</div>
                                 </div>
                             </div>
                             <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>
                         </div>
                     ))}
                 </div>
             </div>
        )}

        {/* 3. SOHBET (CHAT) */}
        {activeTab === 'chat' && (
            <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-sm text-gray-600 flex items-center gap-2">
                    <FiMessageSquare /> Proje Ekibi Sohbeti
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {project.messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FiMessageSquare size={40} className="mb-2 opacity-50"/>
                            <p>Sohbeti başlatın!</p>
                        </div>
                    )}
                    {project.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex flex-col max-w-[70%]">
                                <span className={`text-[10px] mb-1 ${msg.userId === currentUser.id ? 'text-right' : 'text-left'} text-gray-500`}>
                                    {msg.user.name}
                                </span>
                                <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.userId === currentUser.id ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-800 rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-white border-t border-gray-200">
                    <form action={addProjectMessage} className="flex gap-2">
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="userId" value={currentUser.id} />
                        <input name="content" required placeholder="Mesaj yaz..." className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                        <button className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-transform hover:scale-105 shadow-md">
                            <FiSend />
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* 4. İHALELER & TEKLİFLER */}
        {activeTab === 'tenders' && (
            <div>
                 <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg">Açık İhaleler</h3>
                        <p className="text-xs text-gray-500">Bu proje için tedarikçi veya usta arayışları.</p>
                     </div>
                     
                     {currentUser.id === project.ownerId && (
                         <button onClick={() => setIsTenderModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg">
                             <FiPlus /> Yeni İhale
                         </button>
                     )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {project.tenders.length === 0 && (
                        <div className="col-span-2 text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><FiFileText size={24}/></div>
                             <span className="text-gray-500 font-medium">Aktif ihale bulunmuyor.</span>
                        </div>
                     )}
                     
                     {project.tenders.map(tender => (
                         <div key={tender.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                             <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl">AKTİF</div>
                             
                             <h4 className="font-bold text-slate-900 mb-2 text-lg">{tender.title}</h4>
                             <p className="text-sm text-gray-600 mb-6 line-clamp-2">{tender.description}</p>
                             
                             <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                 <div className="flex flex-col">
                                     <span className="text-[10px] text-gray-400 font-bold uppercase">Bütçe Aralığı</span>
                                     <span className="text-sm font-bold text-slate-900">{tender.budget || "Belirtilmedi"}</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                     <span className="text-[10px] text-gray-400 font-bold uppercase">Teklifler</span>
                                     <div className="flex items-center gap-1">
                                         <FiUser size={12} className="text-blue-600"/>
                                         <span className="text-sm font-bold text-blue-600">{tender.proposals.length}</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Sadece Profesyoneller Teklif Verebilir */}
                             {currentUser.role === 'PROFESSIONAL' && (
                                 <button className="w-full mt-5 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                                     Teklif Ver
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>

                 {/* İhale Oluşturma Modalı */}
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
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İhale Başlığı</label>
                                        <input name="title" required placeholder="Örn: Alçıpan ve Boya İşleri" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tahmini Bütçe</label>
                                        <input name="budget" placeholder="Örn: 50.000 - 80.000 TL" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Detaylı Açıklama</label>
                                        <textarea name="description" required placeholder="Yapılacak işin detayları, metrajlar vb." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                                    </div>
                                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg">İhaleyi Yayınla</button>
                                </div>
                            </form>
                            <button onClick={() => setIsTenderModalOpen(false)} className="w-full mt-3 text-gray-500 text-sm font-medium hover:text-slate-900">Vazgeç</button>
                        </div>
                    </div>
                 )}
            </div>
        )}

      </div>
    </div>
  );
}