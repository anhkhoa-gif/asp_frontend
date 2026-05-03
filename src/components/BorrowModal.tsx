'use client';
import { API_URL } from '@/lib/api';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Hash, CheckCircle } from 'lucide-react';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bookTitle: string;
  bookId: number;
}

export function BorrowModal({ isOpen, onClose, onSuccess, bookTitle, bookId }: BorrowModalProps) {
  const [formData, setFormData] = useState({
    borrowerName: '',
    quantity: 1,
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readerId, setReaderId] = useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({ ...prev, borrowerName: user.fullName || user.FullName || '' }));
        
        // Fetch reader info for this user
        fetch(`${API_URL}/api/Readers`)
          .then(res => res.json())
          .then(readers => {
            // Use loose equality == to handle string vs number from sessionStorage
            const reader = readers.find((r: any) => 
              (r.userId || r.UserId) == (user.id || user.Id) ||
              (r.user?.id || r.User?.Id) == (user.id || user.Id)
            );
            
            if (reader) setReaderId(reader.id || reader.Id);
            else setReaderId(null);
          })
          .catch(() => setReaderId(null));
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalReaderId = readerId;

      if (!finalReaderId) {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
          setError("Vui lòng đăng nhập để thuê sách.");
          return;
        }
        const user = JSON.parse(storedUser);

        const createReaderRes = await fetch('${API_URL}/api/Readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || user.Id, maxBooks: 5 })
        });
        
        if (createReaderRes.ok) {
          const newReader = await createReaderRes.json();
          finalReaderId = newReader.id || newReader.Id;
        } else {
          const errText = await createReaderRes.text();
          setError(errText || "Không thể khởi tạo thẻ thư viện của bạn.");
          return;
        }
      }

      if (!finalReaderId) {
        setError("Hệ thống không xác định được mã thẻ của bạn.");
        return;
      }

      const borrowData = {
        readerId: finalReaderId, 
        borrowDate: new Date(formData.borrowDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        status: 0, 
        borrowDetails: Array.from({ length: formData.quantity }).map(() => ({
          bookId: bookId
        }))
      };

      const response = await fetch('${API_URL}/api/Borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(borrowData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        setError(`Lỗi: ${errorData}`);
        return;
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(`Lỗi hệ thống: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isSuccess) return null;

  return (
    <AnimatePresence>
      {(isOpen || isSuccess) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md rounded-sm overflow-hidden shadow-2xl border-t-4 border-orange-500"
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-bold uppercase text-navy">Thuê sách thành công!</h3>
                <p className="text-gray-500">Đơn thuê sách <strong>{bookTitle}</strong> đã được ghi nhận.</p>
              </div>
            ) : (
              <>
                <div className="p-6 bg-navy text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Xác nhận thuê sách</h3>
                    <p className="text-xs opacity-80 mt-1">{bookTitle}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold animate-pulse">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                      <User className="w-3 h-3 text-orange-500" /> Tên khách hàng
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.borrowerName}
                      onChange={(e) => setFormData({...formData, borrowerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nhập họ và tên"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                      <Hash className="w-3 h-3 text-orange-500" /> Số lượng
                    </label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={formData.quantity || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setFormData({...formData, quantity: isNaN(val) ? 0 : val});
                      }}
                      className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-orange-500" /> Ngày thuê
                      </label>
                      <input 
                        required
                        type="date" 
                        value={formData.borrowDate}
                        onChange={(e) => setFormData({...formData, borrowDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-orange-500" /> Hạn trả
                      </label>
                      <input 
                        required
                        type="date" 
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 text-xs">
                    <div className="p-3 bg-gray-100 border-l-4 border-green-500 flex-1 italic text-gray-600">
                      Vui lòng trả sách đúng hạn để không phát sinh chi phí quá hạn.
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 bg-orange-500 text-white font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Đang xử lý...' : 'Xác nhận thuê sách'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


