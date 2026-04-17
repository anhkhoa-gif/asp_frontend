'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 glass border-b sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search books, authors, members..."
            className="w-full bg-white/5 border border-glass-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl hover:bg-white/10 text-secondary relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        <div className="h-8 w-px bg-glass-border mx-2"></div>
        <Link href="/profile" className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition-colors">
          <div className="w-9 h-9 bg-gradient-premium rounded-lg flex items-center justify-center text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-secondary">Super Admin</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
