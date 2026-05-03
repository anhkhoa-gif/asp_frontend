'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  User,
  Hash
} from 'lucide-react';
import Link from 'next/link';

interface Borrow {
  id: number;
  borrowDate: string;
  dueDate: string;
  status: number;
  reader: {
    user: {
      fullName: string;
    }
  };
}

export default function TransactionsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:10000/api/Borrows')
      .then(res => res.json())
      .then(data => {
        setBorrows(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, []);

  const handleReturnBook = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:10000/api/Borrows/${id}`);
      const borrow = await res.json();
      
      const updatedBorrow = { ...borrow, status: 1 };
      
      const response = await fetch(`http://localhost:10000/api/Borrows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBorrow)
      });

      if (response.ok) {
        fetch('http://localhost:10000/api/Borrows')
          .then(res => res.json())
          .then(data => setBorrows(data));
      }
    } catch (err) {
      console.error('Error returning book:', err);
    }
  };

  const filteredBorrows = borrows.filter(b => 
    b.reader?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors text-navy">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Quản lý Thuê & Trả</h2>
            <p className="text-sm text-muted font-medium mt-1">Giám sát toàn bộ hoạt động lưu thông sách trong hệ thống.</p>
          </div>
        </div>
        
        <button className="btn-navy flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <span className="font-bold">Ghi nhận giao dịch mới</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên khách hàng hoặc mã đơn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-gray-100 transition-all font-medium"
        />
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-muted animate-pulse">Đang truy xuất dữ liệu giao dịch...</p>
          </div>
        ) : filteredBorrows.length === 0 ? (
          <div className="py-24 text-center bg-soft rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ArrowLeftRight className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-black text-navy">Không tìm thấy giao dịch</h3>
            <p className="text-muted font-medium mt-2">Hiện tại không có hoạt động thuê/trả nào được ghi nhận.</p>
          </div>
        ) : (
          filteredBorrows.map((borrow) => (
            <motion.div 
              key={borrow.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[32px] flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  borrow.status === 0 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                }`}>
                  {borrow.status === 0 ? <Clock className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <p className="font-black text-navy text-lg group-hover:text-primary transition-colors">{borrow.reader?.user?.fullName ?? 'Khách hàng ẩn danh'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted">
                    <Hash className="w-3 h-3" />
                    Mã đơn: {borrow.id}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Ngày bắt đầu</span>
                  <div className="flex items-center gap-2 font-bold text-navy text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(borrow.borrowDate)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted tracking-widest mb-1">Hạn trả sách</span>
                  <div className="flex items-center gap-2 font-bold text-navy text-sm">
                    <AlertCircle className={`w-4 h-4 ${new Date(borrow.dueDate) < new Date() && borrow.status === 0 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                    {formatDate(borrow.dueDate)}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
                    borrow.status === 0 
                    ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' 
                    : 'bg-green-500/5 text-green-500 border-green-500/20'
                  }`}>
                    {borrow.status === 0 ? 'Đang thuê' : 'Đã trả sách'}
                  </span>
                  
                  {borrow.status === 0 && (
                    <button 
                      onClick={() => handleReturnBook(borrow.id)}
                      className="btn-orange px-6 py-2.5 shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Xác nhận trả</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
