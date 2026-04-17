'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { BookCard, BookStatus } from '@/components/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
  status: BookStatus;
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/Books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, []);

  const totalBooksCount = books.reduce((acc, book) => acc + book.quantity, 0);
  const borrowedBooksCount = books.filter(b => b.status === BookStatus.Borrowed).length;
  const availableBooksCount = books.filter(b => b.status === BookStatus.Available).length;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-secondary mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <button className="bg-gradient-premium text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform active:scale-95">
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Books" 
          value={totalBooksCount} 
          icon={BookOpen} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          label="Available Now" 
          value={availableBooksCount} 
          icon={Users} 
          trend="+5%" 
          trendUp={true} 
        />
        <StatCard 
          label="Borrowed Books" 
          value={borrowedBooksCount} 
          icon={Clock} 
          trend="-2%" 
          trendUp={false} 
        />
        <StatCard 
          label="Unique Titles" 
          value={books.length} 
          icon={ArrowUpRight} 
          trend="+3" 
          trendUp={true} 
        />
      </div>

      {/* Recent Books */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Recently Added</h3>
          <button className="text-primary text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Popular Books</h3>
          <div className="space-y-4">
            {books.slice(0, 3).map((book, i) => (
              <div key={book.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-2xl font-black text-secondary/20 italic w-8">0{i+1}</span>
                <div className="w-10 h-14 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={book.imageUrl || 'https://images.unsplash.com/photo-1543004218-ee14110497f9?auto=format&fit=crop&q=80&w=100'} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold line-clamp-1">{book.title}</p>
                  <p className="text-sm text-secondary line-clamp-1">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{20 - i*4}</p>
                  <p className="text-[10px] text-secondary uppercase font-bold">Borrows</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { name: "John Doe", book: "Atomic Habits", date: "2 mins ago", seed: "john" },
              { name: "Jane Smith", book: "Sapiens", date: "15 mins ago", seed: "jane" },
              { name: "Alex Johnson", book: "The Alchemist", date: "1 hour ago", seed: "alex" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.seed}`} 
                    alt={activity.name}
                    className="w-full h-full object-cover bg-white/5"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{activity.name}</p>
                  <p className="text-sm text-secondary">borrowed <span className="text-foreground font-medium">{activity.book}</span></p>
                </div>
                <p className="text-xs text-secondary">{activity.date}</p>
              </div>
            ))}
          </div>
        {/* Quick Actions */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href='/books'}
              className="p-4 rounded-xl bg-primary/10 hover:bg-primary hover:text-white transition-all text-center flex flex-col items-center gap-2 group"
            >
              <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-white/20">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">New Book</span>
            </button>
            <button 
              onClick={() => window.location.href='/members'}
              className="p-4 rounded-xl bg-secondary/10 hover:bg-secondary hover:text-white transition-all text-center flex flex-col items-center gap-2 group"
            >
              <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-white/20">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">New Member</span>
            </button>
            <button 
              onClick={() => window.location.href='/transactions'}
              className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-white transition-all text-center flex flex-col items-center gap-2 group col-span-2"
            >
              <div className="p-3 rounded-lg bg-amber-500/20 group-hover:bg-white/20">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">New Borrowing Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
