'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const roles = user.userRoles || user.UserRoles || [];
      const isAdmin = roles.some((ur: any) => (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin');
      
      if (!isAdmin) {
        router.replace('/');
        return;
      }
      
      setIsAuthorized(true);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-soft">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-navy animate-pulse">Đang bảo mật kết nối...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopBar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
