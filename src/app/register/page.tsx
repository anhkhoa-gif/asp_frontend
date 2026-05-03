'use client';
import { API_URL } from '@/lib/api';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, AlertCircle, Phone, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('${API_URL}/api/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          passwordHash: formData.password,
          status: 0
        })
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const msg = await response.text();
        setError(msg || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-[540px] rounded-[40px] shadow-2xl p-10 relative z-10 border border-gray-100"
      >
        <div className="text-center space-y-3 mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-2xl">O</span>
            </div>
            <span className="text-2xl font-black text-navy uppercase tracking-tighter">OpenBoox</span>
          </Link>
          <h2 className="text-3xl font-black text-navy tracking-tight">Tạo tài khoản mới</h2>
          <p className="text-muted font-medium">Bắt đầu hành trình khám phá tri thức cùng OpenBoox.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Họ và tên</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="Nguyễn Văn A"
                />
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Tên đăng nhập</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="user123"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Địa chỉ Email</label>
            <div className="relative">
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                placeholder="example@gmail.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Mật khẩu</label>
              <div className="relative">
                <input 
                  required
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Xác nhận</label>
              <div className="relative">
                <input 
                  required
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 btn-orange btn-pill shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="font-black uppercase tracking-[0.2em] text-sm">Đăng ký ngay</span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-muted">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-navy hover:underline">Đăng nhập ngay</Link>
        </p>

        <p className="text-center mt-6 text-[10px] text-muted leading-relaxed max-w-sm mx-auto font-medium">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <Link href="#" className="text-primary underline">Điều khoản dịch vụ</Link> và{' '}
          <Link href="#" className="text-primary underline">Chính sách bảo mật</Link> của OpenBoox.
        </p>
      </motion.div>
    </div>
  );
}


