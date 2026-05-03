'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, UserPlus, Mail, User, Shield, Key } from 'lucide-react';

interface Member {
  id?: number;
  maxBooks: number;
  userId: number;
  user: {
    fullName: string;
    email: string;
    username: string;
    status: number;
  };
}

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: any) => void;
  member?: Member | null;
}

export function MemberModal({ isOpen, onClose, onSave, member }: MemberModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    maxBooks: 5,
    status: 0
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.user?.fullName || '',
        email: member.user?.email || '',
        username: member.user?.username || '',
        maxBooks: member.maxBooks,
        status: member.user?.status || 0
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        username: '',
        maxBooks: 5,
        status: 0
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-soft/50">
          <div>
            <h3 className="text-2xl font-black text-navy tracking-tight">
              {member?.id ? 'Cập nhật khách hàng' : member ? 'Cấp thẻ thành viên' : 'Đăng ký khách hàng mới'}
            </h3>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">Quản lý định danh OpenBoox</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm text-muted">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...formData,
            userId: member?.user?.id
          });
        }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted px-1 flex items-center gap-2">
                <User className="w-3 h-3 text-primary" /> Họ và tên
              </label>
              <input 
                required
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted px-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" /> Địa chỉ Email
              </label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                placeholder="example@gmail.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1 flex items-center gap-2">
                  <Key className="w-3 h-3 text-primary" /> Username
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="user123"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted px-1 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-primary" /> Hạn mức
                </label>
                <input 
                  required
                  type="number" 
                  value={formData.maxBooks}
                  onChange={(e) => setFormData({...formData, maxBooks: parseInt(e.target.value)})}
                  className="w-full bg-soft rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted px-1 flex items-center gap-2">
                <Shield className="w-3 h-3 text-primary" /> Trạng thái tài khoản
              </label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 0})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                    formData.status === 0 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-soft text-muted'
                  }`}
                >
                  Hoạt động
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 1})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                    formData.status === 1 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-soft text-muted'
                  }`}
                >
                  Đã khóa
                </button>
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
                {member?.id ? 'Xác nhận' : 'Cấp thẻ ngay'}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
