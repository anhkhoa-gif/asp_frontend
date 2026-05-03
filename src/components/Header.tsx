'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }

      // Sync cart count
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
      } else {
        setCartCount(0);
      }
    };

    checkUser();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', checkUser);
    
    // Poll for changes in the same tab (since storage event doesn't fire in the same tab)
    const interval = setInterval(checkUser, 1000);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="header-container bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100">
      <div className="flex-1 flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">O</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-navy uppercase tracking-tight">OPENBOOX</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className="text-sm font-black text-navy uppercase tracking-widest hover:text-primary transition-colors">Trang chủ</Link>
          <Link href="/explore" className="text-sm font-black text-muted uppercase tracking-widest hover:text-navy transition-colors">Khám phá</Link>
          <Link href="/history" className="text-sm font-black text-muted uppercase tracking-widest hover:text-navy transition-colors">Lịch sử</Link>
          <Link href="/cart" className="relative group">
            <span className="text-sm font-black text-muted uppercase tracking-widest group-hover:text-navy transition-colors">Giỏ hàng</span>
            {cartCount > 0 && (
              <div className="absolute -top-3 -right-4 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce group-hover:animate-none">
                {cartCount}
              </div>
            )}
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[15px] font-black text-navy leading-none">
                {user.fullName || user.FullName || 'Thành viên'}
              </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                Tài khoản
              </span>
            </div>
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-soft border border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group-hover:border-primary transition-all">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.Username || 'default'}`} 
                  alt={user.fullName || user.FullName || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-[200]">
                {(user?.userRoles || user?.UserRoles)?.some((ur: any) => (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin') && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-soft text-navy font-bold text-sm transition-all">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Quản trị hệ thống
                  </Link>
                )}
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-soft text-navy font-bold text-sm transition-all">
                  <Settings className="w-4 h-4 text-primary" />
                  Cài đặt tài khoản
                </Link>
                <div className="h-px bg-gray-50 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="text-[15px] font-semibold text-primary">Đăng nhập</Link>
            <Link href="/register" className="btn-navy text-[15px] font-semibold px-6 py-2.5 btn-pill">Đăng ký ngay</Link>
          </>
        )}
      </div>
    </header>
  );
}
