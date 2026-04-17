'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut,
  Library,
  ArrowLeftRight,
  Wallet,
  User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Library, label: 'Explore', href: '/explore' },
  { icon: BookOpen, label: 'Books', href: '/books' },
  { icon: Users, label: 'Members', href: '/members' },
  { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions' },
  { icon: Wallet, label: 'Fines', href: '/fines' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass border-r z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-gradient-premium p-2 rounded-lg">
          <Library className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gradient">Lumina Lib</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "hover:bg-white/10 text-secondary hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-white" : "group-hover:text-primary"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-glass-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
