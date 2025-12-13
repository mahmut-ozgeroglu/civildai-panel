// src/app/projects/[id]/ProjectDetailClient.js
"use client";

import React, { useState } from 'react';
import { 
  addTask, addProjectMessage, createProjectTender, createSiteLogWithMedia, 
  toggleTaskStatus, addTeamMember, uploadDocument, deleteProject, removeTeamMember,
  createOrder, updateOrderStatus, markAttendance 
} from '../../actions';
import { 
  FiArrowLeft, FiCheckSquare, FiCamera, FiMessageSquare, FiFileText, 
  FiPlus, FiClock, FiCheckCircle, FiSend, FiMapPin, FiMoreVertical, FiUser, 
  FiUsers, FiBriefcase, FiHeart, FiMessageCircle, FiActivity,
  FiCloud, FiSun, FiFolder, FiDownload, FiPaperclip, FiImage, FiVideo,
  FiTrash2, FiSettings, FiShoppingCart, FiTruck, FiBox, FiClipboard, FiUserCheck 
} from 'react-icons/fi';
import Link from 'next/link';

export default function ProjectDetailClient({ project, currentUser, initialOrders = [], suppliers = [], todaysAttendance = [], potentialWorkers = [] }) {
  const [activeTab, setActiveTab] = useState('summary'); 
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // YENİ MODALLAR
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // --- YETKİ VE ROLLER ---
  const isOwner = currentUser?.id === project.ownerId;
  const teamMemberInfo = (project.members || []).find(m => m.userId === currentUser?.id);
  const canManageTenders = isOwner || teamMemberInfo?.canManageTenders;

  // --- İLERLEME VE VERİLER ---
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const totalBudget = project.tenders?.reduce((acc, curr) => acc + (parseInt(curr.budget) || 0), 0);

  const handleTaskToggle = async (taskId, currentStatus) => { await toggleTaskStatus(taskId, project.id, currentStatus); };
  
  // Sipariş Durumu Güncelleme (Teslim Alma)
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
      if(confirm('Durumu güncellemek istediğine emin misin?')) {
          await updateOrderStatus(orderId, newStatus);
          window.location.reload(); // Sayfayı yenile ki statüs güncellensin
      }
  };

  // Sekme Butonu Bileşeni
  const TabButton = ({ id, icon: Icon, label, count }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`pb-4 px-4 flex items-center gap-2 text-sm font-bold transition-all relative whitespace-nowrap
        ${activeTab === id 
            ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' 
            : 'text-gray-500 hover:text-slate-800 hover:bg-gray-50/50 rounded-t-lg'}`}
    >
        <Icon size={18} className={activeTab === id ? 'stroke-[2.5px]' : ''} /> 
        {label} 
        {count !== undefined && <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full ml-1">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                      <Link href="/projects" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm"><FiArrowLeft size={20}/></Link>
                      <div>
                          <h1 className="font-extrabold text-slate-900 text-2xl leading-tight">{project.title}</h1>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><FiMapPin className="text-gray-400"/> {project.location || "Konum Yok"}</span>
                              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><FiClock className="text-gray-400"/> {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      {/* Hava Durumu */}
                      <div className="hidden md:flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white p-3 rounded-xl border border-blue-100 shadow-sm">
                          <div className="bg-yellow-400 p-2 rounded-full text-white shadow-sm ring-4 ring-yellow-100"><FiSun size={20}/></div>
                          <div>
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{project.location?.split(',')[0] || "ŞANTİYE"}</div>
                              <div className="text-lg font-extrabold text-slate-900 leading-none">24°C</div>
                          </div>
                      </div>

                      {/* AYARLAR MENÜSÜ */}
                      {isOwner && (
                          <div className="relative">
                              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-slate-900 hover:bg-gray-200 transition-colors">
                                  <FiMoreVertical size={20}/>
                              </button>
                              {isSettingsOpen && (
                                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                      <div className="p-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase bg-gray-50">Proje Ayarları</div>
                                      <form action={deleteProject}>
                                          <input type="hidden" name="projectId" value={project.id} />
                                          <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors">
                                              <FiTrash2 /> Projeyi Sil
                                          </button>
                                      </form>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>

              {/* İlerleme Çubuğu */}
              <div className="mb-4">
                   <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider"><span>Proje İlerlemesi</span><span>%{progressPercentage}</span></div>
                   <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]" style={{ width: `${progressPercentage}%` }}></div></div>
              </div>

              {/* Sekmeler */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 pt-2">
                  <TabButton id="summary" icon={FiActivity} label="Akış & Özet" />
                  <TabButton id="supply" icon={FiShoppingCart} label="Tedarik" count={initialOrders.length} />
                  <TabButton id="workers" icon={FiClipboard} label="Saha Ekibi" count={todaysAttendance.length} />
                  <TabButton id="chat" icon={FiMessageSquare} label="Sohbet" count={project.messages?.length} />
                  <TabButton id="files" icon={FiFolder} label="Dosyalar" count={project.documents?.length} />
                  <TabButton id="tasks" icon={FiCheckSquare} label="İş Takibi" count={project.tasks?.filter(t => t.status === 'TODO').length} />
                  <TabButton id="tenders" icon={FiFileText} label="İhale" count={project.tenders?.length} />
                  <TabButton id="team" icon={FiUsers} label="Ekip" count={(project.members?.length || 0) + 1} />
              </div>
          </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 1. AKIŞ (FEED) */}
        {activeTab === 'summary' && (
             <div className="space-y-6 max-w-4xl mx-auto">
                 {/* Paylaşım Kutusu */}
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                     <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-inner">{currentUser.name?.[0]}</div>
                         <div className="flex-1">
                             <form action={createSiteLogWithMedia}>
                                 <input type="hidden" name="projectId" value={project.id} />
                                 <input type="hidden" name="userId" value={currentUser.id} />
                                 <textarea name="content" required placeholder="Şantiyeden güncelleme paylaş..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all h-24 resize-none"></textarea>
                                 <div className="flex justify-between items-center mt-3">
                                     <div className="flex gap-2">
                                         <label className="cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"><FiImage size={16}/> Fotoğraf <input type="file" className="hidden" /></label>
                                         <input type="hidden" name="mediaUrl" value="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80" /> 
                                     </div>
                                     <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Paylaş</button>
                                 </div>
                             </form>
                         </div>
                     </div>
                 </div>
                 {/* Loglar */}
                 {project.siteLogs?.map(log => (
                     <div key={log.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                         <div className="p-5 flex items-start gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">{log.user.name?.[0]}</div>
                             <div className="flex-1">
                                 <div className="font-bold text-slate-900 text-sm flex items-center">{log.user.name}</div>
                                 <div className="text-xs text-gray-500 mt-0.5">{new Date(log.createdAt).toLocaleDateString()}</div>
                                 <div className="mt-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{log.content}</div>
                             </div>
                         </div>
                         {log.mediaUrl && <div className="w-full h-80 bg-gray-100 overflow-hidden border-t border-b border-gray-100 relative group"><img src={log.mediaUrl} alt="Medya" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>}
                         <div className="px-5 py-3 bg-gray-50/50 flex items-center gap-6"><button className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-xs font-bold transition-colors"><FiHeart size={16}/> Beğen</button><button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-xs font-bold transition-colors"><FiMessageCircle size={16}/> Yorum Yap</button></div>
                     </div>
                 ))}
             </div>
        )}

        {/* 2. TEDARİK (SİPARİŞLER) */}
        {activeTab === 'supply' && (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-xl">Malzeme Siparişleri</h3>
                    <button onClick={() => setIsOrderModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200">
                        <FiShoppingCart/> Sipariş Ver
                    </button>
                </div>
                {initialOrders.length === 0 ? (
                      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                          <FiShoppingCart className="mx-auto text-gray-300 mb-3" size={40}/>
                          <h3 className="font-bold text-gray-600">Henüz sipariş yok</h3>
                          <p className="text-sm text-gray-400">Bu proje için malzeme siparişi oluşturulmamış.</p>
                      </div>
                  ) : (
                      <div className="grid gap-4">
                        {initialOrders.map(order => (
                          <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                          {order.supplier?.name?.[0]}
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-900 text-sm">{order.supplier?.name || "Tedarikçi"}</div>
                                          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()} • {order.orderedBy?.name}</div>
                                      </div>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                                      order.status === 'DELIVERED' ? 'bg-indigo-100 text-indigo-700' :
                                      order.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                      {order.status === 'PENDING' ? 'Onay Bekliyor' : order.status}
                                  </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                  {order.items.map(item => (
                                      <div key={item.id} className="flex justify-between text-sm">
                                          <span className="font-bold text-slate-700">{item.name}</span>
                                          <span className="text-slate-900">{item.quantity} {item.unit}</span>
                                      </div>
                                  ))}
                              </div>
                              {/* TESLİM AL BUTONU */}
                              {order.status === 'DELIVERED' && (currentUser?.id === order.orderedById || isOwner) && (
                                  <button onClick={() => handleOrderStatusUpdate(order.id, 'RECEIVED')} className="w-full bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                                      <FiCheckCircle/> Malzemeyi Teslim Aldım
                                  </button>
                              )}
                          </div>
                        ))}
                      </div>
                  )}
            </div>
        )}

        {/* 3. SAHA EKİBİ / PUANTAJ */}
        {activeTab === 'workers' && (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                      <div>
                          <h3 className="text-2xl font-bold">{todaysAttendance.length} Kişi</h3>
                          <p className="text-slate-300 text-sm">Bugün Sahada Çalışan Personel</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString()} Tarihli Kayıt</p>
                      </div>
                      <button onClick={() => setIsAttendanceModalOpen(true)} className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-md">
                          <FiUserCheck size={18}/> Giriş Yap
                      </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 font-bold text-slate-900 flex items-center gap-2 bg-gray-50">
                          <FiClipboard/> Bugünkü Puantaj Listesi
                      </div>
                      {todaysAttendance.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">Bugün henüz kimse giriş yapmamış.</div>
                      ) : (
                          <div className="divide-y divide-gray-100">
                              {todaysAttendance.map(record => (
                                  <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                              {record.user?.name?.[0] || record.workerName?.[0] || "P"}
                                          </div>
                                          <div>
                                              <div className="font-bold text-slate-900 text-sm">{record.user ? record.user.name : record.workerName}</div>
                                              <div className="text-xs text-gray-500">{record.user?.profession || "Harici Personel"}</div>
                                          </div>
                                      </div>
                                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">SAHADA</span>
                                  </div>
                              ))}
                          </div>
                      )}
                </div>
            </div>
        )}

        {/* 4. DOSYALAR */}
        {activeTab === 'files' && (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg tracking-tight">Proje Belgeleri</h3>
                    <button onClick={() => setIsDocModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-md"><FiCloud/> Belge Yükle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(!project.documents || project.documents.length === 0) && <div className="col-span-2 text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200 border-dashed">Henüz belge yüklenmemiş.</div>}
                    {project.documents?.map(doc => (
                        <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition-all group hover:border-blue-200">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center font-bold text-lg border border-red-100 shadow-sm">PDF</div>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{doc.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">{doc.uploader?.name} • <span className="uppercase bg-gray-100 px-1.5 py-0.5 rounded text-[9px] font-bold">{doc.type}</span></div>
                            </div>
                            <a href={doc.url} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiDownload size={20}/></a>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 5. SOHBET */}
        {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl border border-gray-200 h-[650px] flex flex-col shadow-lg overflow-hidden max-w-4xl mx-auto">
                <div className="bg-white px-6 py-4 border-b border-gray-100 font-bold text-sm text-slate-800 flex items-center justify-between shadow-sm z-10">
                    <span className="flex items-center gap-2"><FiMessageSquare className="text-blue-600"/> Ekip Sohbeti</span>
                    <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Çevrimiçi</span>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F0F2F5]">
                    {project.messages?.map(msg => (
                        <div key={msg.id} className={`flex ${msg.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[75%] ${msg.userId === currentUser.id ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-gray-500 mb-1 px-1 flex items-center gap-1 font-medium">{msg.userId !== currentUser.id && msg.user.name}</span>
                                <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm relative ${msg.userId === currentUser.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-gray-200'}`}>
                                    {msg.content}
                                    <div className={`text-[9px] mt-1 text-right opacity-70`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white border-t border-gray-200">
                    <form action={addProjectMessage} className="flex gap-3">
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="userId" value={currentUser.id} />
                        <button type="button" className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors"><FiPaperclip size={20}/></button>
                        <input name="content" required placeholder="Mesaj yaz..." className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" />
                        <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-transform hover:scale-105 shadow-md"><FiSend className="ml-0.5" /></button>
                    </form>
                </div>
            </div>
        )}

        {/* 6. İŞ TAKİBİ */}
        {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-48">
                        <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold"><FiCheckSquare className="text-blue-600"/> Yeni Görev</div>
                        <form action={addTask}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <input name="title" required placeholder="Görev başlığı..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                            <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all">Listeye Ekle</button>
                        </form>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                    {project.tasks?.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all group ${task.status === 'DONE' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 shadow-sm hover:border-blue-300'}`}>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleTaskToggle(task.id, task.status)} className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${task.status === 'DONE' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-blue-500'}`}>
                                    <FiCheckCircle size={14} className={task.status === 'DONE' ? 'block' : 'hidden'}/>
                                </button>
                                <span className={`font-medium text-sm ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-slate-900'}`}>{task.title}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.status === 'DONE' ? 'Tamamlandı' : 'Bekliyor'}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 7. İHALE */}
        {activeTab === 'tenders' && (
            <div className="max-w-4xl mx-auto">
                 <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white mb-8 flex flex-col md:flex-row justify-between items-center shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      <div className="relative z-10">
                          <div className="text-xs text-blue-200 font-bold uppercase mb-1 tracking-wider">Toplam İhale Bütçesi</div>
                          <div className="text-4xl font-extrabold tracking-tight">{totalBudget.toLocaleString()} TL</div>
                          <p className="text-slate-400 text-sm mt-2 max-w-md">Aktif projeler için ayrılan tahmini bütçe toplamı.</p>
                      </div>
                      {canManageTenders && <button onClick={() => setIsTenderModalOpen(true)} className="relative z-10 mt-4 md:mt-0 bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg"><FiPlus /> Yeni İhale Başlat</button>}
                 </div>
                 <div className="grid grid-cols-1 gap-6">
                     {project.tenders?.map(tender => (
                         <div key={tender.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                             <div className="p-8 border-b border-gray-100">
                                 <h4 className="font-bold text-slate-900 text-xl">{tender.title}</h4>
                                 <p className="text-sm text-gray-600 mt-2 mb-6">{tender.description}</p>
                                 <div className="flex gap-8 text-sm">
                                     <div><span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Bütçe</span><span className="font-bold text-slate-900">{tender.budget}</span></div>
                                     <div><span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Teklif</span><span className="font-bold text-blue-600">{tender.proposals?.length}</span></div>
                                 </div>
                             </div>
                             {currentUser.role === 'PROFESSIONAL' && !canManageTenders && <div className="p-6 bg-gray-50 border-t border-gray-200"><button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700">Teklif Ver</button></div>}
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* 8. EKİP (TEAM) */}
        {activeTab === 'team' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                 <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
                     <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] px-3 py-1 rounded-bl-xl font-bold">KURUCU</div>
                     <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-slate-200">{project.owner?.name?.[0]}</div>
                     <div><div className="font-bold text-slate-900 text-lg">{project.owner?.name || "Firma Sahibi"}</div><div className="text-xs text-gray-500 font-medium">Proje Yöneticisi</div></div>
                 </div>

                 {project.members?.map(member => (
                     <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors group relative">
                         <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl border border-gray-100">{member.user.name?.[0]}</div>
                         <div><div className="font-bold text-slate-900 text-lg">{member.user.name}</div><div className="text-xs text-blue-600 font-bold uppercase bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">{member.roleTitle}</div></div>
                         
                         {isOwner && (
                            <form action={removeTeamMember} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="hidden" name="memberId" value={member.id} />
                                <input type="hidden" name="projectId" value={project.id} />
                                <button className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50"><FiTrash2 size={16}/></button>
                            </form>
                         )}
                     </div>
                 ))}
                 
                 {isOwner && (
                    <button onClick={() => setIsTeamModalOpen(true)} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center font-bold text-gray-500 hover:border-slate-900 hover:text-slate-900 h-32 transition-all gap-2"><FiPlus size={24}/> Ekip Üyesi Ekle</button>
                 )}
             </div>
        )}

      </div>

      {/* --- MODALLAR --- */}
      
      {/* 1. Belge Modalı */}
      {isDocModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white p-6 rounded-2xl w-full max-w-md animate-in zoom-in">
                    <h3 className="font-bold text-lg mb-4">Belge Yükle</h3>
                    <form action={async (formData) => { await uploadDocument(formData); setIsDocModalOpen(false); }}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="uploaderId" value={currentUser.id} />
                        <div className="space-y-4">
                            <input name="name" required placeholder="Dosya Adı" className="w-full border p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                            <select name="type" className="w-full border p-3 rounded-lg text-sm bg-white"><option>PDF</option><option>DWG</option></select>
                            <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800">Yükle</button>
                        </div>
                    </form>
                    <button onClick={() => setIsDocModalOpen(false)} className="w-full mt-2 text-sm text-gray-500">İptal</button>
                </div>
            </div>
      )}

      {/* 2. Ekip Modalı */}
      {isTeamModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white p-8 rounded-2xl w-full max-w-md animate-in zoom-in shadow-2xl">
                    <h3 className="font-bold text-xl mb-6 text-slate-900">Ekibe Davet Et</h3>
                    <form action={async (formData) => { await addTeamMember(formData); setIsTeamModalOpen(false); }}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <div className="space-y-4">
                            <input name="email" type="email" required placeholder="E-Posta" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                            <input name="roleTitle" required placeholder="Görevi" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200"><input name="canManageTenders" type="checkbox" id="perm1" className="w-5 h-5 text-slate-900 rounded accent-slate-900" /><label htmlFor="perm1" className="text-sm font-bold text-gray-700 cursor-pointer">İhale Yetkisi Ver</label></div>
                            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">Davet Gönder</button>
                        </div>
                    </form>
                    <button onClick={() => setIsTeamModalOpen(false)} className="w-full mt-4 text-sm text-gray-500 font-medium hover:text-slate-900 transition-colors">Vazgeç</button>
                </div>
            </div>
      )}

      {/* 3. İhale Modalı */}
      {isTenderModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white p-8 rounded-2xl w-full max-w-lg animate-in zoom-in shadow-2xl">
                    <h3 className="font-bold text-xl mb-6 text-slate-900">Yeni İhale</h3>
                    <form action={async (formData) => { await createProjectTender(formData); setIsTenderModalOpen(false); }}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="companyId" value={currentUser.id} />
                        <div className="space-y-5">
                            <input name="title" required placeholder="Başlık" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                            <input name="budget" placeholder="Bütçe" className="w-full border p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                            <textarea name="description" required placeholder="Açıklama" className="w-full border p-3.5 rounded-xl text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800">Yayınla</button>
                        </div>
                    </form>
                    <button onClick={() => setIsTenderModalOpen(false)} className="w-full mt-4 text-sm text-gray-500 hover:text-slate-900">Vazgeç</button>
                </div>
            </div>
      )}

      {/* 4. SİPARİŞ MODALI */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsOrderModalOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-red-500"><FiPlus className="rotate-45" size={24}/></button>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiShoppingCart/> Malzeme Siparişi</h2>
              
              <form action={async (formData) => { await createOrder(formData); setIsOrderModalOpen(false); }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="orderedById" value={currentUser?.id} />

                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Tedarikçi Firma</label>
                          <select name="supplierId" required className="w-full border border-gray-200 p-3 rounded-lg outline-none text-sm bg-white">
                              <option value="">Seçiniz...</option>
                              {suppliers.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} ({s.profession})</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                              <input name="itemName" required placeholder="Ürün Adı (Örn: C30 Beton)" className="w-full border border-gray-200 p-3 rounded-lg text-sm outline-none"/>
                          </div>
                          <div className="col-span-3">
                              <input name="itemQuantity" type="number" required placeholder="Miktar" className="w-full border border-gray-200 p-3 rounded-lg text-sm outline-none"/>
                          </div>
                          <div className="col-span-3">
                              <select name="itemUnit" className="w-full border border-gray-200 p-3 rounded-lg text-sm outline-none bg-white">
                                  <option value="Adet">Adet</option>
                                  <option value="m3">m³</option>
                                  <option value="Ton">Ton</option>
                                  <option value="Torba">Torba</option>
                              </select>
                          </div>
                      </div>
                      <textarea name="note" placeholder="Sipariş notu..." className="w-full border border-gray-200 p-3 rounded-lg h-20 resize-none outline-none text-sm"></textarea>
                      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all text-sm shadow-md">Siparişi Gönder</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* 5. PUANTAJ MODALI */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-red-500"><FiPlus className="rotate-45" size={24}/></button>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiUserCheck/> Personel Girişi</h2>
              
              <form action={async (formData) => { await markAttendance(formData); setIsAttendanceModalOpen(false); }}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Kayıtlı Personel Seç</label>
                          <select name="userId" className="w-full border border-gray-200 p-3 rounded-lg outline-none text-sm bg-white">
                              <option value="">-- Listeden Seç --</option>
                              {potentialWorkers.map(w => (
                                  <option key={w.id} value={w.id}>{w.name} ({w.profession})</option>
                              ))}
                          </select>
                      </div>
                      <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-gray-200"></div><span className="flex-shrink-0 mx-4 text-gray-400 text-xs">VEYA</span><div className="flex-grow border-t border-gray-200"></div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Manuel İsim Gir</label>
                          <input name="workerName" placeholder="Örn: Ahmet Yılmaz" className="w-full border border-gray-200 p-3 rounded-lg text-sm outline-none"/>
                      </div>
                      <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all text-sm shadow-md flex items-center justify-center gap-2">
                        <FiCheckCircle/> Girişi Kaydet
                      </button>
                  </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}