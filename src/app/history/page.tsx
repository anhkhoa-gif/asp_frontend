'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  BookOpen,
  ArrowLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { BorrowDetailModal } from '@/components/BorrowDetailModal';

interface Borrow {
  id: number;
  borrowDate: string;
  dueDate: string;
  status: number;
  borrowDetails: any[];
}

export default function HistoryPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchHistory(userData.id || userData.Id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHistory = async (userId: number) => {
    try {
      // First get reader info
      const readersRes = await fetch('http://localhost:10000/api/Readers');
      const readers = await readersRes.json();
      const reader = readers.find((r: any) => r.user?.id === userId || r.User?.Id === userId);

      if (reader) {
        const borrowsRes = await fetch('http://localhost:10000/api/Borrows');
        const allBorrows = await borrowsRes.json();
        const readerId = reader.id || reader.Id;
        const userBorrows = allBorrows.filter((b: any) => (b.readerId || b.ReaderId) == readerId);
        setBorrows(userBorrows.reverse()); // Newest first
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setLoading(false);
    }
  };

  const handleReturn = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn trả sách này không?')) return;
    
    try {
      const res = await fetch(`http://localhost:10000/api/Borrows/${id}`);
      const borrow = await res.json();
      
      const response = await fetch(`http://localhost:10000/api/Borrows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...borrow, status: 1 })
      });

      if (response.ok) {
        fetchHistory(user.id || user.Id);
        alert('Trả sách thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
      }
    } catch (err) {
      console.error('Error returning book:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-6 h-6 text-navy" />
            </Link>
            <h1 className="text-xl font-black text-navy uppercase tracking-tight">Lịch sử thuê sách</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted bg-gray-50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-primary" />
            Cập nhật lần cuối: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!user ? (
          <div className="bg-white p-12 rounded-[32px] text-center shadow-sm border border-gray-100">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-navy">Bạn chưa đăng nhập</h2>
            <p className="text-muted font-medium mt-2 mb-8">Vui lòng đăng nhập để xem lịch sử thuê sách của bạn.</p>
            <Link href="/login" className="btn-navy px-8 py-4 inline-block">Đăng nhập ngay</Link>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-32 rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : borrows.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-muted" />
            </div>
            <h2 className="text-2xl font-black text-navy uppercase tracking-tight">Trống trơn</h2>
            <p className="text-muted font-medium mt-2 mb-8">Bạn chưa từng thuê cuốn sách nào. Hãy khám phá kho sách của chúng tôi nhé!</p>
            <Link href="/" className="btn-orange px-8 py-4 inline-block shadow-lg shadow-primary/20">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {borrows.map((borrow) => {
              const isOverdue = new Date(borrow.dueDate) < new Date() && borrow.status === 0;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={borrow.id}
                  className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-sm ${
                        borrow.status === 0 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                      }`}>
                        {borrow.status === 0 ? <Clock className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-navy uppercase tracking-tight">Đơn thuê #{borrow.id}</h3>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                            borrow.status === 0 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-green-500/10 text-green-500'
                          }`}>
                            {borrow.status === 0 ? 'Đang mượn' : 'Đã hoàn trả'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {formatDate(borrow.borrowDate)}
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-muted'}`}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Hạn trả: {formatDate(borrow.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {borrow.status === 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReturn(borrow.id);
                          }}
                          className="btn-orange px-6 py-3 shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Trả sách ngay</span>
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setSelectedBorrow(borrow);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-3 bg-soft rounded-2xl text-navy hover:bg-navy hover:text-white transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BorrowDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        borrow={selectedBorrow}
      />
    </div>
  );
}
