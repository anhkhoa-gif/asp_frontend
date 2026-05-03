'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Calendar, User, Clock, CheckCircle2, Hash, Tag } from 'lucide-react';

interface BorrowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrow: any;
}

export function BorrowDetailModal({ isOpen, onClose, borrow }: BorrowDetailModalProps) {
  if (!isOpen || !borrow) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 bg-navy text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black uppercase tracking-tight">Chi tiết đơn thuê #{borrow.id}</h3>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  borrow.status === 0 ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {borrow.status === 0 ? 'Đang mượn' : 'Đã hoàn trả'}
                </span>
              </div>
              <p className="text-xs opacity-70 mt-1 font-bold uppercase tracking-widest">Thông tin giao dịch chi tiết</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Order Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-soft p-6 rounded-3xl border border-gray-100">
                <span className="text-[10px] font-black uppercase text-muted tracking-widest block mb-4">Thông tin giao dịch</span>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-navy">Ngày mượn: {formatDate(borrow.borrowDate || borrow.BorrowDate)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-navy">Hạn trả: {formatDate(borrow.dueDate || borrow.DueDate)}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200 mt-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-primary">Tổng tiền: {(borrow.totalAmount || borrow.TotalAmount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
              <div className="bg-soft p-6 rounded-3xl border border-gray-100">
                <span className="text-[10px] font-black uppercase text-muted tracking-widest block mb-4">Khách hàng</span>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-navy">{borrow.reader?.user?.fullName || borrow.Reader?.User?.FullName || 'Đang cập nhật...'}</p>
                    <p className="text-[10px] font-bold text-muted uppercase mt-0.5">Mã thẻ: {borrow.readerId || borrow.ReaderId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Books List */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary" />
                  Sách đã thuê
                </h4>
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                  {(borrow.borrowDetails || borrow.BorrowDetails)?.length || 0} Cuốn
                </span>
              </div>
              
              <div className="space-y-3">
                {(borrow.borrowDetails || borrow.BorrowDetails)?.map((detail: any, index: number) => {
                  const book = detail.book || detail.Book;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm group hover:border-primary transition-all">
                      <div className="w-16 h-24 rounded-xl overflow-hidden bg-soft shadow-md flex-shrink-0">
                        <img 
                          src={book?.imageUrl || book?.ImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200'} 
                          alt={book?.title || book?.Title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-black text-navy">{book?.title || book?.Title || 'Đang tải...'}</h5>
                        <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{book?.author || book?.Author || 'Tác giả'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-soft border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-navy leading-tight">
                Mọi sách đều đã được xác thực <br/> tính nguyên vẹn khi cho mượn.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-navy text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-navy/20"
            >
              Đóng lại
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
