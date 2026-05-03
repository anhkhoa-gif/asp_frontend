'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Camera } from 'lucide-react';

interface Book {
  id?: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: number;
  imageUrl?: string;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: any) => void;
  book?: any | null;
}

export function BookModal({ isOpen, onClose, onSave, book }: BookModalProps) {
  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    quantity: 1,
    category: 'Chung',
    status: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        quantity: 1,
        category: 'Chung',
        status: 0,
        imageUrl: ''
      });
    }
  }, [book, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[32px] overflow-y-auto max-h-[90vh] shadow-2xl"
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-soft/50">
          <div>
            <h3 className="text-2xl font-black text-navy tracking-tight">{book ? 'Chỉnh sửa thông tin sách' : 'Thêm tựa sách mới'}</h3>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">Cập nhật kho sách OpenBoox</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm text-muted">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Tiêu đề sách</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="Ví dụ: Nhà Giả Kim"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Tác giả</label>
                <input 
                  required
                  type="text" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="Ví dụ: Paulo Coelho"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Danh mục</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy appearance-none"
                >
                  <option value="Chung">Chung</option>
                  <option value="Kinh doanh">Kinh doanh</option>
                  <option value="Phát triển bản thân">Phát triển bản thân</option>
                  <option value="Văn học">Văn học</option>
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Thiếu nhi">Thiếu nhi</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Ảnh bìa (Upload hoặc Link)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full bg-soft rounded-2xl py-4 px-4 pl-10 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy text-sm"
                      placeholder="Link ảnh..."
                    />
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  </div>
                  <div className="relative flex-shrink-0">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-full px-4 bg-navy text-white rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-navy-hover transition-colors shadow-md relative">
                      Tải ảnh lên
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Số lượng</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted px-1">Tình trạng</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                    className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy appearance-none"
                  >
                    <option value={0}>Sẵn sàng thuê</option>
                    <option value={1}>Đang cho thuê</option>
                    <option value={2}>Đã đặt trước</option>
                    <option value={3}>Bảo trì / Mất</option>
                  </select>
                </div>
              </div>

              <div className="aspect-[3/4] bg-soft rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative group">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="w-10 h-10 text-muted mx-auto" />
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Xem trước ảnh bìa</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-soft hover:bg-gray-100 rounded-2xl font-black text-navy transition-all uppercase tracking-widest text-xs"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 btn-navy btn-pill shadow-xl shadow-navy/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5 text-primary" />
              <span className="uppercase tracking-widest text-xs font-black">
                {book ? 'Cập nhật ngay' : 'Lưu vào kho'}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
