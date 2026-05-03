import { API_URL } from '@/lib/api';
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe, User, AlertCircle, Layout } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('${API_URL}/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const user = await response.json();
        sessionStorage.setItem('user', JSON.stringify(user));
        router.push('/');
        router.refresh();
      } else {
        const msg = await response.text();
        setError(msg || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[480px] rounded-[40px] shadow-2xl p-10 relative z-10 border border-gray-100"
      >
        <div className="text-center space-y-3 mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-2xl">O</span>
            </div>
            <span className="text-2xl font-black text-navy uppercase tracking-tighter">OpenBoox</span>
          </Link>
          <h2 className="text-3xl font-black text-navy tracking-tight">Chào mừng trở lại!</h2>
          <p className="text-muted font-medium">Đăng nhập để quản lý kho sách và đơn thuê của bạn.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted px-1">Tên đăng nhập hoặc Email</label>
            <div className="relative">
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                placeholder="Nhập username hoặc email của bạn"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Mật khẩu</label>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Quên mật khẩu?</Link>
            </div>
            <div className="relative">
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-transparent focus:border-primary/20 transition-all font-bold text-navy"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 btn-navy btn-pill shadow-xl shadow-navy/20 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-black uppercase tracking-[0.2em] text-sm">Đăng nhập ngay</span>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-4 bg-white text-muted">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-soft transition-all font-bold text-navy text-sm shadow-sm active:scale-95">
              <Globe className="w-5 h-5" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-soft transition-all font-bold text-navy text-sm shadow-sm active:scale-95">
              <Layout className="w-5 h-5" />
              Github
            </button>
          </div>

          <p className="text-center text-sm font-bold text-muted">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

