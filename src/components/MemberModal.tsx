'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, UserPlus } from 'lucide-react';

interface Member {
  id?: number;
  maxBooks: number;
  userId: number;
  user: {
    fullName: string;
    email: string;
    username: string;
    status: number;
  };
}

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: any) => void;
  member?: Member | null;
}

export function MemberModal({ isOpen, onClose, onSave, member }: MemberModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    maxBooks: 5,
    status: 0
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.user?.fullName || '',
        email: member.user?.email || '',
        username: member.user?.username || '',
        maxBooks: member.maxBooks,
        status: member.user?.status || 0
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        username: '',
        maxBooks: 5,
        status: 0
      });
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-glass-border flex items-center justify-between">
          <h3 className="text-xl font-bold">{member ? 'Edit Member' : 'Register New Member'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Username</label>
              <input 
                required
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Max Books</label>
              <input 
                required
                type="number" 
                value={formData.maxBooks}
                onChange={(e) => setFormData({...formData, maxBooks: parseInt(e.target.value)})}
                className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 glass rounded-xl font-bold">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-gradient-premium text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {member ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
