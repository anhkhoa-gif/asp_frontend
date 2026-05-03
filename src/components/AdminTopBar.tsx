'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Search, Globe, ChevronDown } from 'lucide-react';

export function AdminTopBar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-[50]">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm mọi thứ..." 
          className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 rounded-xl hover:bg-gray-50 transition-colors relative">
          <Bell className="w-5 h-5 text-navy" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-navy leading-none">
              {user?.fullName || user?.FullName || 'Admin'}
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
              Administrator
            </span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-soft border border-gray-100 overflow-hidden group-hover:border-primary transition-all">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
