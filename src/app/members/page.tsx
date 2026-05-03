'use client';
import { API_URL } from '@/lib/api';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Trash2,
  Edit3,
  User,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { MemberModal } from '@/components/MemberModal';

interface Reader {
  id: number;
  maxBooks: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    status: number;
    username: string;
  };
}

export default function MembersPage() {
  const [members, setMembers] = useState<Reader[]>([]);
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Reader | null>(null);
  const [viewTab, setViewTab] = useState<'all' | 'new'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [readersRes, usersRes] = await Promise.all([
        fetch('${API_URL}/api/Readers'),
        fetch('${API_URL}/api/Users')
      ]);

      const readersData: Reader[] = await readersRes.json();
      const usersData: any[] = await usersRes.json();

      setMembers(readersData);
      
      // Filter out users who are already readers and also filter out admin accounts
      const readerUserIds = readersData.map(r => r.user?.id);
      const pendingUsers = usersData.filter(u => {
        const isAdmin = (u.userRoles || u.UserRoles)?.some((ur: any) => 
          (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin'
        );
        return !readerUserIds.includes(u.id) && !isAdmin;
      });
      setNewUsers(pendingUsers);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveMember = async (formData: any) => {
    setLoading(true);
    try {
      if (editingMember && editingMember.id > 0) {
        // Update existing reader
        const userUrl = `${API_URL}/api/Users/${editingMember.user.id}`;
        const readerUrl = `${API_URL}/api/Readers/${editingMember.id}`;

        const userRes = await fetch(userUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Id: editingMember.user.id,
            Username: formData.username,
            FullName: formData.fullName,
            Email: formData.email,
            PasswordHash: editingMember.user.passwordHash || 'default_pass',
            Status: formData.status
          })
        });

        if (!userRes.ok) throw new Error(await userRes.text());

        const readerRes = await fetch(readerUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Id: editingMember.id,
            UserId: editingMember.user.id,
            MaxBooks: formData.maxBooks
          })
        });
        
        if (!readerRes.ok) throw new Error(await readerRes.text());
      } else {
        // Approval or New creation
        let userId = formData.userId;
        
        if (!userId) {
          const userRes = await fetch('${API_URL}/api/Users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Username: formData.username,
              FullName: formData.fullName,
              Email: formData.email,
              PasswordHash: 'default_pass',
              Status: 0
            })
          });
          if (!userRes.ok) throw new Error(await userRes.text());
          const newUser = await userRes.json();
          userId = newUser.id || newUser.Id;
        }

        const readerRes = await fetch('${API_URL}/api/Readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            UserId: userId,
            MaxBooks: formData.maxBooks
          })
        });

        if (!readerRes.ok) {
            const errorText = await readerRes.text();
            throw new Error(errorText || 'Không thể tạo thẻ khách hàng. Có thể người dùng này đã có thẻ rồi.');
        }
      }

      setIsModalOpen(false);
      await fetchData();
      alert('Đã cập nhật danh sách khách hàng thành công!');
    } catch (err: any) {
      console.error('Error saving member:', err);
      alert('Lỗi: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleApproveUser = (user: any) => {
    setEditingMember(null);
    // Pre-fill modal with user data
    setEditingMember({
        id: 0,
        maxBooks: 5,
        user: user
    } as any);
    setIsModalOpen(true);
  };

  const handleApproveAll = async () => {
    if (!confirm(`Bạn có chắc chắn muốn chuyển toàn bộ ${newUsers.length} thành viên mới thành khách hàng không?`)) return;
    
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const user of newUsers) {
      try {
        const res = await fetch('${API_URL}/api/Readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            UserId: user.id || user.Id,
            MaxBooks: 5
          })
        });
        if (res.ok) successCount++;
        else failCount++;
      } catch (err) {
        failCount++;
      }
    }
    
    await fetchData();
    alert(`Hoàn tất! Duyệt thành công: ${successCount}, Thất bại: ${failCount}`);
    setLoading(false);
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) return;
    try {
      await fetch(`${API_URL}/api/Readers/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const filteredMembers = members.filter(m => 
    m.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNewUsers = newUsers.filter(u => 
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-soft transition-colors text-navy">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Danh sách Khách hàng</h2>
            <p className="text-sm text-muted font-medium mt-1">Quản lý tài khoản và quyền hạn thuê sách của khách hàng.</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="btn-navy flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5 text-primary" />
          <span className="font-bold">Thêm Khách Hàng</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewTab('all')}
            className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all relative ${
              viewTab === 'all' ? 'text-primary' : 'text-muted hover:text-navy'
            }`}
          >
            Khách hàng ({members.length})
            {viewTab === 'all' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
          <button 
            onClick={() => setViewTab('new')}
            className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all relative ${
              viewTab === 'new' ? 'text-primary' : 'text-muted hover:text-navy'
            }`}
          >
            Thành viên mới ({newUsers.length})
            {newUsers.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                Mới
              </span>
            )}
            {viewTab === 'new' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
        </div>

        {viewTab === 'new' && newUsers.length > 0 && (
          <button 
            onClick={handleApproveAll}
            className="mb-4 bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Duyệt toàn bộ thành khách hàng
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên khách hàng, email hoặc username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-gray-100 transition-all font-medium"
        />
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-soft/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Khách hàng</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Trạng thái</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">{viewTab === 'all' ? 'Hạn mức thuê' : 'Ngày đăng ký'}</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-muted">Đang tải danh sách...</p>
                  </td>
                </tr>
              ) : (viewTab === 'all' ? filteredMembers : filteredNewUsers).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-muted font-bold">
                    Không có khách hàng nào trong danh sách này.
                  </td>
                </tr>
              ) : (
                (viewTab === 'all' ? filteredMembers : filteredNewUsers).map((item: any) => {
                  const isReader = viewTab === 'all';
                  const user = isReader ? item.user : item;
                  
                  return (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-soft/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-soft shrink-0">
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                              alt={user?.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-navy group-hover:text-primary transition-colors">{user?.fullName ?? 'Unknown'}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-muted">
                                <Mail className="w-3 h-3 text-primary" />
                                {user?.email ?? 'No email'}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-muted">
                                <User className="w-3 h-3 text-primary" />
                                {user?.username}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                          user?.status === 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {user?.status === 0 ? 'Đang hoạt động' : 'Tạm khóa'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {isReader ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-navy">
                            <Shield className="w-4 h-4 text-primary" />
                            Tối đa {item.maxBooks} cuốn
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-muted">Người dùng vãng lai</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {!isReader && (
                            <button 
                              onClick={() => handleApproveUser(user)}
                              className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                              Duyệt thành khách hàng
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (isReader) {
                                setEditingMember(item);
                              } else {
                                handleApproveUser(user);
                              }
                              setIsModalOpen(true);
                            }}
                            className="p-3 rounded-xl hover:bg-soft text-navy border border-transparent hover:border-gray-100 transition-all"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => isReader ? handleDeleteMember(item.id) : null}
                            className={`p-3 rounded-xl hover:bg-red-50 text-red-500 border border-transparent hover:border-red-100 transition-all ${!isReader ? 'opacity-0 pointer-events-none' : ''}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMember}
        member={editingMember}
      />
    </div>
  );
}


