// src/app/dashboard/SupplierDashboardClient.js
"use client";

import React, { useState } from 'react';
import { updateOrderStatus, logout } from '../actions';
import { 
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiX, 
  FiMapPin, FiUser, FiPhone, FiBox, FiLogOut 
} from 'react-icons/fi';

export default function SupplierDashboardClient({ user, initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('ACTIVE'); // ACTIVE, COMPLETED

  // Siparişleri Duruma Göre Filtrele
  const activeOrders = orders.filter(o => ['PENDING', 'APPROVED', 'SHIPPED'].includes(o.status));
  const completedOrders = orders.filter(o => ['DELIVERED', 'RECEIVED', 'CANCELLED'].includes(o.status));
  
  const displayedOrders = filter === 'ACTIVE' ? activeOrders : completedOrders;

  // Durum Güncelleme
  const handleStatusChange = async (orderId, newStatus) => {
      // Optimistic Update (Anında Arayüzü Güncelle)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      await updateOrderStatus(orderId, newStatus);
  };

  // Durum Rozetleri
  const getStatusBadge = (status) => {
      const styles = {
          PENDING:   { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Onay Bekliyor', icon: <FiClock/> },
          APPROVED:  { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Hazırlanıyor',  icon: <FiPackage/> },
          SHIPPED:   { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Yola Çıktı',    icon: <FiTruck/> },
          DELIVERED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Teslim Edildi', icon: <FiBox/> },
          RECEIVED:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Müşteri Onayladı', icon: <FiCheckCircle/> },
      };
      const s = styles[status] || styles.PENDING;
      return <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>{s.icon} {s.label}</span>;
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="font-bold text-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">T</div>
                  {user.name} <span className="text-xs font-normal opacity-70 bg-slate-800 px-2 py-0.5 rounded">Tedarikçi Paneli</span>
              </div>
              <button onClick={() => logout()} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2"><FiLogOut/> Çıkış</button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-slate-900">{activeOrders.length}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase mt-1">Aktif Sipariş</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">{completedOrders.length}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase mt-1">Tamamlanan</div>
              </div>
          </div>

          {/* FİLTRE SEKMELERİ */}
          <div className="flex gap-4 border-b border-gray-300 mb-6">
              <button onClick={() => setFilter('ACTIVE')} className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${filter === 'ACTIVE' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500'}`}>
                  Bekleyen & Aktif
              </button>
              <button onClick={() => setFilter('COMPLETED')} className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${filter === 'COMPLETED' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500'}`}>
                  Geçmiş Siparişler
              </button>
          </div>

          {/* SİPARİŞ LİSTESİ */}
          <div className="space-y-4">
              {displayedOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                      <FiPackage className="mx-auto text-gray-300 mb-3" size={48}/>
                      <h3 className="font-bold text-gray-600">Sipariş Bulunamadı</h3>
                      <p className="text-sm text-gray-400">Bu kategoride gösterilecek sipariş yok.</p>
                  </div>
              ) : (
                  displayedOrders.map(order => (
                      <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Sipariş Başlığı */}
                          <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-bold text-slate-700">
                                      {order.project?.title?.[0]}
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-slate-900 text-sm">{order.project?.title}</h3>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span className="flex items-center gap-1"><FiUser/> {order.orderedBy?.name}</span>
                                          <span className="flex items-center gap-1"><FiMapPin/> {order.project?.location}</span>
                                      </div>
                                  </div>
                              </div>
                              <div>{getStatusBadge(order.status)}</div>
                          </div>

                          {/* İçerik ve Aksiyonlar */}
                          <div className="p-4 flex flex-col md:flex-row gap-6">
                              {/* Malzeme Listesi */}
                              <div className="flex-1">
                                  <table className="w-full text-sm text-left">
                                      <thead>
                                          <tr className="text-gray-400 text-xs uppercase"><th className="pb-2">Ürün</th><th className="pb-2">Miktar</th></tr>
                                      </thead>
                                      <tbody>
                                          {order.items.map(item => (
                                              <tr key={item.id} className="border-t border-gray-100">
                                                  <td className="py-2 font-bold text-slate-700">{item.name}</td>
                                                  <td className="py-2 text-slate-600">{item.quantity} {item.unit}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                                  {order.note && (
                                      <div className="mt-3 bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-100">
                                          <span className="font-bold">Müşteri Notu:</span> {order.note}
                                      </div>
                                  )}
                              </div>

                              {/* Yönetim Butonları (Sadece Aktif Siparişler İçin) */}
                              {filter === 'ACTIVE' && (
                                  <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                                      {order.status === 'PENDING' && (
                                          <>
                                              <button onClick={() => handleStatusChange(order.id, 'APPROVED')} className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Siparişi Onayla</button>
                                              <button onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">Reddet</button>
                                          </>
                                      )}
                                      
                                      {order.status === 'APPROVED' && (
                                          <button onClick={() => handleStatusChange(order.id, 'SHIPPED')} className="w-full bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                              <FiTruck/> Yola Çıkar
                                          </button>
                                      )}

                                      {order.status === 'SHIPPED' && (
                                          <button onClick={() => handleStatusChange(order.id, 'DELIVERED')} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                              <FiBox/> Teslim Ettim
                                          </button>
                                      )}

                                      <div className="text-[10px] text-gray-400 text-center mt-2">
                                          Durum: {order.status === 'PENDING' ? 'Onay Bekliyor' : order.status === 'APPROVED' ? 'Hazırlanıyor' : 'Yolda'}
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
}