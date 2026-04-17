'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Trash2
} from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Reader | null>(null);

  const fetchMembers = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/Readers')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSaveMember = async (formData: any) => {
    try {
      if (editingMember) {
        // Update existing
        const userUrl = `http://localhost:5000/api/Users/${editingMember.user.id}`;
        const readerUrl = `http://localhost:5000/api/Readers/${editingMember.id}`;

        await fetch(userUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingMember.user,
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username
          })
        });

        await fetch(readerUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingMember,
            maxBooks: formData.maxBooks
          })
        });
      } else {
        // Create new
        const userRes = await fetch('http://localhost:5000/api/Users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            passwordHash: 'default_pass',
            status: 0
          })
        });
        const newUser = await userRes.json();

        await fetch('http://localhost:5000/api/Readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: newUser.id,
            maxBooks: formData.maxBooks
          })
        });
      }

      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      console.error('Error saving member:', err);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await fetch(`http://localhost:5000/api/Readers/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const filteredMembers = members.filter(m => 
    m.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Members</h2>
          <p className="text-secondary mt-1">Manage library members and their permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-premium text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
        <input 
          type="text" 
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-secondary">Member</th>
                <th className="px-6 py-4 text-sm font-semibold text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-secondary">Max Books</th>
                <th className="px-6 py-4 text-sm font-semibold text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-secondary">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <motion.tr 
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-glass-border hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.username}`} 
                            alt={member.user?.fullName}
                            className="w-full h-full object-cover bg-white/5"
                          />
                        </div>
                        <div>
                          <p className="font-bold">{member.user?.fullName ?? 'Unknown'}</p>
                          <div className="flex items-center gap-1 text-xs text-secondary">
                            <Mail className="w-3 h-3" />
                            {member.user?.email ?? 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        member.user?.status === 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {member.user?.status === 0 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Shield className="w-4 h-4 text-primary" />
                        {member.maxBooks} Books
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingMember(member);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 text-secondary"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
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
