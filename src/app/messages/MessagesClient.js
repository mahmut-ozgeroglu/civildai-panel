// src/app/messages/MessagesClient.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getConversation } from '../actions';
import { FiSearch, FiSend, FiUser, FiMoreVertical, FiArrowLeft, FiCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function MessagesClient({ currentUser, initialConversations, targetUser }) {
  
  // Eğer targetUser (Profil sayfasından gelen kişi) varsa, başlangıçta onu seçili yap
  const [selectedUser, setSelectedUser] = useState(targetUser || null); 
  const [messages, setMessages] = useState([]); 
  const [conversations, setConversations] = useState(initialConversations);
  const scrollRef = useRef(null);

  // Sayfa yüklendiğinde, eğer targetUser varsa sohbeti hemen çek
  useEffect(() => {
      if (targetUser) {
          // Bu kişiyle daha önce konuşmuş muyuz listeden bak?
          const existingConv = initialConversations.find(c => c.user.id === targetUser.id);
          
          if (existingConv) {
              // Zaten konuşmuşuz, normal akış (listeden seçilmiş gibi)
              selectConversation(targetUser);
          } else {
              // Yeni bir konuşma, mesajları boş getir ama kullanıcıyı seçili yap
              getConversation(currentUser.id, targetUser.id).then(msgs => setMessages(msgs));
          }
      }
  }, [targetUser]); // targetUser değişirse çalış

  // Sohbeti aşağı kaydır
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Bir kişiye tıklayınca mesajları çek
  const selectConversation = async (otherUser) => {
      setSelectedUser(otherUser);
      // Sunucudan mesajları al
      const msgs = await getConversation(currentUser.id, otherUser.id);
      setMessages(msgs);
  };

  // Mesaj gönderince listeyi güncelle
  const handleSend = async (formData) => {
      const content = formData.get("content");
      if(!content.trim()) return;

      // Hemen ekrana bas (Optimistic Update)
      const optimisticMsg = {
          id: Date.now().toString(),
          content,
          senderId: currentUser.id,
          createdAt: new Date()
      };
      setMessages([...messages, optimisticMsg]);

      // Sunucuya gönder
      await sendMessage(formData);
  };

  return (
    <div className="h-screen bg-[#F0F2F5] overflow-hidden flex flex-col">

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full h-full md:p-4 gap-4">
          
          {/* SOL: KİŞİ LİSTESİ */}
          <div className={`w-full md:w-1/3 bg-white md:rounded-2xl border border-gray-200 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-xl text-slate-900 mb-4">Sohbetler</h2>
                  <div className="relative">
                      <FiSearch className="absolute left-3 top-3 text-gray-400"/>
                      <input placeholder="Arama yap..." className="w-full bg-gray-100 rounded-lg pl-10 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 && !targetUser && <div className="p-6 text-center text-gray-400 text-sm">Henüz mesajınız yok.</div>}
                  
                  {/* Eğer hedef kullanıcı listede yoksa geçici olarak göster (Yeni Sohbet Başlatırken) */}
                  {targetUser && !conversations.find(c => c.user.id === targetUser.id) && (
                      <div className="p-4 border-b border-gray-50 flex items-center gap-3 cursor-pointer bg-blue-50">
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                              {targetUser.name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                  <h4 className="font-bold text-slate-900">{targetUser.name}</h4>
                                  <span className="text-[10px] text-green-600 font-bold">YENİ</span>
                              </div>
                              <p className="text-xs text-blue-600 font-medium">Sohbet başlatılıyor...</p>
                          </div>
                      </div>
                  )}

                  {conversations.map(conv => (
                      <div 
                        key={conv.user.id} 
                        onClick={() => selectConversation(conv.user)}
                        className={`p-4 border-b border-gray-50 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?.id === conv.user.id ? 'bg-blue-50' : ''}`}
                      >
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0 relative">
                              {conv.user.name?.[0]}
                              {!conv.isRead && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                  <h4 className={`text-sm truncate ${!conv.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{conv.user.name}</h4>
                                  <span className="text-[10px] text-gray-400">{new Date(conv.date).toLocaleDateString()}</span>
                              </div>
                              <p className={`text-xs truncate ${!conv.isRead ? 'font-bold text-slate-900' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* SAĞ: SOHBET PENCERESİ */}
          <div className={`w-full md:w-2/3 bg-white md:rounded-2xl border border-gray-200 flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
              {selectedUser ? (
                  <>
                      {/* Sohbet Başlığı */}
                      <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between bg-gray-50/50">
                          <div className="flex items-center gap-3">
                              <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-500 mr-2"><FiArrowLeft size={24}/></button>
                              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">{selectedUser.name?.[0]}</div>
                              <div>
                                  <div className="font-bold text-slate-900 text-sm">{selectedUser.name}</div>
                                  <div className="text-xs text-green-600 flex items-center gap-1"><FiCircle size={8} fill="currentColor"/> Çevrimiçi</div>
                              </div>
                          </div>
                          <button className="text-gray-400 hover:text-slate-900"><FiMoreVertical/></button>
                      </div>

                      {/* Mesaj Alanı */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#e5ddd5]/20" style={{backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'overlay'}}>
                          {messages.map((msg, index) => (
                              <div key={msg.id || index} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-sm relative ${msg.senderId === currentUser.id ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'}`}>
                                      {msg.content}
                                      <div className="text-[9px] text-gray-500 text-right mt-1 opacity-70">
                                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                  </div>
                              </div>
                          ))}
                          <div ref={scrollRef}></div>
                      </div>

                      {/* Mesaj Yazma */}
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <form action={handleSend} className="flex gap-3">
                              <input type="hidden" name="senderId" value={currentUser.id} />
                              <input type="hidden" name="receiverId" value={selectedUser.id} />
                              <input name="content" required autoComplete="off" placeholder="Bir mesaj yazın..." className="flex-1 bg-white border border-gray-300 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                              <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg transition-transform active:scale-95"><FiSend size={20} className="ml-1"/></button>
                          </form>
                      </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
                      <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-200"><FiSend size={64}/></div>
                      <h3 className="text-xl font-bold text-slate-800">Mesajlaşmaya Başlayın</h3>
                      <p className="text-gray-500 mt-2 max-w-sm">Sol taraftan bir kişi seçin veya profil sayfasından birine mesaj göndererek sohbeti başlatın.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}