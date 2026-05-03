'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { AdminLayout } from './AdminLayout';
import React from 'react';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function ClientLayoutWrapper({ children, footer }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Define routes that should use the Admin Layout (sidebar instead of header/footer)
  const isAdminRoute = pathname.startsWith('/admin') || 
                      pathname.startsWith('/books') || 
                      pathname.startsWith('/members') || 
                      pathname.startsWith('/transactions') || 
                      pathname.startsWith('/fines') || 
                      pathname.startsWith('/settings');

  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <div className="main-container flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {footer}
    </div>
  );
}
