'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  DollarSign, 
  Clock, 
  CreditCard, 
  User,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Fine {
  id: number;
  amount: number;
  borrow: {
    reader: {
      user: {
        fullName: string;
      }
    }
  };
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:10000/api/Fines')
      .then(res => res.json())
      .then(data => {
        setFines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching fines:', err);
        setLoading(false);
      });
  }, []);

  const filteredFines = fines.filter(f => 
    f.borrow?.reader?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const totalFines = filteredFines.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors text-navy">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Hóa đơn & Phạt</h2>
            <p className="text-sm text-muted font-medium mt-1">Quản lý các khoản phí quá hạn và hóa đơn thuê sách của khách hàng.</p>
          </div>
        </div>

        <div className="bg-soft px-8 py-4 rounded-[24px] flex items-center gap-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted tracking-widest">Tổng phí chưa thu</p>
            <p className="text-2xl font-black text-red-500">{(totalFines * 1000).toLocaleString('vi-VN')} đ</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-gray-100 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-muted animate-pulse">Đang tải danh sách hóa đơn...</p>
          </div>
        ) : filteredFines.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-soft rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <DollarSign className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-black text-navy">Không tìm thấy hóa đơn nào</h3>
            <p className="text-muted font-medium mt-2">Tuyệt vời! Hiện tại không có khách hàng nào nợ phí quá hạn.</p>
          </div>
        ) : (
          filteredFines.map((fine) => (
            <motion.div 
              key={fine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[32px] hover:shadow-2xl transition-all group border border-gray-100 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-soft rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-muted tracking-widest uppercase">Mã đơn: #{fine.id}</span>
              </div>

              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-soft flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-navy" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">Khách hàng</p>
                    <p className="font-bold text-navy text-lg line-clamp-1">{fine.borrow?.reader?.user?.fullName ?? 'Unknown Member'}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted text-xs font-bold">
                      <Clock className="w-4 h-4" />
                      <span>Phí trả muộn</span>
                    </div>
                    <p className="text-2xl font-black text-red-500">{(fine.amount * 1000).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 btn-navy flex items-center justify-center gap-3 py-4 shadow-lg shadow-navy/10 active:scale-95 transition-all">
                <span className="font-bold text-sm">Đánh dấu đã thanh toán</span>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
