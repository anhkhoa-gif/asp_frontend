import { API_URL } from '@/lib/api';
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  History, 
  Wallet,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  username: string;
  reader?: {
    maxBooks: number;
    borrows?: any[];
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, let's fetch the first user (Reader) as our "current user"
    fetch('${API_URL}/api/Users/1')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 glass rounded-3xl">
      <p className="text-secondary">User profile not found.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-gradient-premium flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-primary/20">
            {profile.fullName[0]}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl font-bold">{profile.fullName}</h2>
            <p className="text-secondary text-lg mt-1">@{profile.username}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="bg-green-500/10 text-green-500 text-xs font-black uppercase px-3 py-1.5 rounded-full border border-green-500/20">
                Active Member
              </span>
              <span className="bg-primary/10 text-primary text-xs font-black uppercase px-3 py-1.5 rounded-full border border-primary/20">
                Lumina Prime
              </span>
            </div>
          </div>
          <button className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border border-glass-border">
            <Settings className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="space-y-8">
          <div className="glass p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              About Me
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-secondary">
                <Mail className="w-5 h-5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-secondary">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 000-1234</span>
              </div>
              <div className="flex items-center gap-3 text-secondary">
                <MapPin className="w-5 h-5" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-secondary">
                <Calendar className="w-5 h-5" />
                <span>Joined April 2024</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg">Library Limits</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-secondary font-medium">Borrowing Power</span>
                  <span className="font-bold">2 / {profile.reader?.maxBooks || 5} Books</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(2 / (profile.reader?.maxBooks || 5)) * 100}%` }}
                    className="h-full bg-primary rounded-full shadow-lg shadow-primary/50"
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border-l-4 border-l-primary">
              <BookOpen className="w-8 h-8 text-primary mb-3" />
              <p className="text-2xl font-black">2</p>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Active Borrows</p>
            </div>
            <div className="glass p-6 rounded-3xl border-l-4 border-l-secondary">
              <History className="w-8 h-8 text-secondary mb-3" />
              <p className="text-2xl font-black">12</p>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Read</p>
            </div>
            <div className="glass p-6 rounded-3xl border-l-4 border-l-green-500">
              <Wallet className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-2xl font-black">$0.00</p>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Current Fines</p>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <h3 className="font-bold text-lg">Current Borrowings</h3>
              <button className="text-primary text-sm font-semibold hover:underline">View History</button>
            </div>
            <div className="divide-y divide-glass-border">
              {[
                { title: "Clean Code", author: "Robert C. Martin", due: "Apr 25, 2024", status: "Due in 8 days" },
                { title: "Design Patterns", author: "Erich Gamma", due: "Apr 18, 2024", status: "Due tomorrow" },
              ].map((book, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gradient-premium rounded-lg flex items-center justify-center text-white/50">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">{book.title}</h4>
                      <p className="text-sm text-secondary">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{book.due}</p>
                    <p className={`text-xs ${i === 1 ? 'text-amber-500' : 'text-secondary'}`}>{book.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Account Status
              </h3>
            </div>
            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
              <p className="text-sm text-green-500 font-medium leading-relaxed">
                Your account is in good standing. You have 3 more borrowing slots available. 
                Keep returning books on time to maintain your Prime status!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

