'use client';

import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalBorrows: 0,
    overdueBooks: 0
  });
  const [recentBorrows, setRecentBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, usersRes, borrowsRes, readersRes] = await Promise.all([
          fetch('http://localhost:10000/api/Books'),
          fetch('http://localhost:10000/api/Users'),
          fetch('http://localhost:10000/api/Borrows'),
          fetch('http://localhost:10000/api/Readers')
        ]);

        const [books, users, borrows, readers] = await Promise.all([
          booksRes.json(),
          usersRes.json(),
          borrowsRes.json(),
          readersRes.json()
        ]);

        const readerUserIds = readers.map((r: any) => r.user?.id);
        const pendingMembers = users.filter((u: any) => !readerUserIds.includes(u.id)).length;

        setStats({
          totalBooks: books.length,
          totalMembers: readers.length,
          totalBorrows: borrows.length,
          overdueBooks: borrows.filter((b: any) => new Date(b.dueDate) < new Date() && b.status !== 1).length,
          pendingMembers: pendingMembers
        });

        setRecentBorrows(borrows.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const STAT_CARDS = [
    { label: 'Tổng số sách', value: stats.totalBooks, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Thành viên', value: stats.totalMembers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Lượt mượn', value: stats.totalBorrows, icon: ArrowLeftRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Thành viên mới', value: (stats as any).pendingMembers || 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-navy tracking-tight">Chào buổi sáng, Admin! 👋</h2>
        <p className="text-sm text-muted font-medium">Dưới đây là thống kê tình hình thư viện của bạn trong hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-navy/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-navy">{stat.value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-navy uppercase tracking-tight flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              Giao dịch gần đây
            </h3>
            <button className="text-xs font-bold text-primary hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">Khách hàng</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">Sách</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">Hạn trả</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-muted uppercase tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBorrows.map((borrow, i) => (
                  <tr key={i} className="hover:bg-soft transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-soft border border-gray-100 flex items-center justify-center font-bold text-[10px] text-navy">
                          {borrow.reader?.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-bold text-navy">{borrow.reader?.user?.fullName || 'Người dùng'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-navy line-clamp-1 max-w-[200px]">
                        ID: #{borrow.id}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-muted">
                        {new Date(borrow.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        borrow.status === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {borrow.status === 1 ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {borrow.status === 1 ? 'Đã trả' : 'Đang thuê'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity Feed */}
        <div className="space-y-6">
          <div className="bg-navy rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-black">Khám phá tính năng mới</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">Hệ thống báo cáo tự động hiện đã sẵn sàng để sử dụng.</p>
              <button className="btn-orange btn-pill w-full py-4 text-xs font-bold uppercase tracking-widest">Mở Báo Cáo</button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-navy uppercase tracking-tight mb-6">Thông báo hệ thống</h3>
            <div className="space-y-6">
              {[
                { title: 'Bảo trì hệ thống', time: '10 phút trước', color: 'bg-amber-500' },
                { title: 'Đã thêm 50 sách mới', time: '2 giờ trước', color: 'bg-emerald-500' },
                { title: 'Tài khoản admin mới', time: '5 giờ trước', color: 'bg-blue-500' },
              ].map((note, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-2 h-2 ${note.color} rounded-full mt-2 shrink-0`}></div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-navy">{note.title}</p>
                    <p className="text-xs text-muted font-medium">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
