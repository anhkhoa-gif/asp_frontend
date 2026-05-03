'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut,
  Library,
  ArrowLeftRight,
  Wallet,
  User,
  ShoppingBag
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: ShoppingBag, label: 'Cửa hàng', href: '/explore' },
  { icon: BookOpen, label: 'Kho sách', href: '/books' },
  { icon: Users, label: 'Khách hàng', href: '/members' },
  { icon: ArrowLeftRight, label: 'Quản lý thuê', href: '/transactions' },
  { icon: Wallet, label: 'Hóa đơn & Phạt', href: '/fines' },
  { icon: User, label: 'Hồ sơ', href: '/profile' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-50 flex flex-col shadow-sm">
      <div className="h-[70px] px-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xl">O</span>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-navy uppercase">OpenBoox</h1>
      </div>

      <div className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Danh mục quản lý</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href 
                ? "bg-navy text-white shadow-lg shadow-navy/20" 
                : "hover:bg-soft text-muted hover:text-navy"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-primary" : "group-hover:text-primary"
            )} />
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-soft/30">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted font-bold text-sm hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
