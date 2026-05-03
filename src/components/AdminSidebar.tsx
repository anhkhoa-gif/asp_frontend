'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  AlertCircle, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Quản lý Sách', href: '/books', icon: BookOpen },
  { label: 'Thành viên', href: '/members', icon: Users },
  { label: 'Mượn trả', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Tiền phạt', href: '/fines', icon: AlertCircle },
  { label: 'Cài đặt', href: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <aside className="w-72 bg-navy min-h-screen flex flex-col sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-2xl">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">OPENBOOX</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
