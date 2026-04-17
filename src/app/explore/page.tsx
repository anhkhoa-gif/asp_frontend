'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, 
  Search, 
  ChevronRight, 
  BookOpen, 
  GraduationCap, 
  Microscope, 
  Globe, 
  Compass,
  Filter
} from 'lucide-react';
import { BookCard } from '@/components/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  quantity: number;
  status: number;
}

const CATEGORIES = [
  { name: 'All', icon: Library, color: 'from-blue-500 to-indigo-600' },
  { name: 'Technology', icon: Microscope, color: 'from-emerald-500 to-teal-600' },
  { name: 'Literature', icon: GraduationCap, color: 'from-purple-500 to-pink-600' },
  { name: 'Science', icon: Globe, color: 'from-orange-500 to-red-600' },
  { name: 'General', icon: Compass, color: 'from-slate-500 to-slate-700' },
];

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/Books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[40px] overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-center px-12 space-y-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-white leading-tight">
              Discover a World of <span className="text-primary italic">Knowledge</span>
            </h1>
            <p className="text-xl text-gray-300 mt-4 leading-relaxed">
              Explore thousands of titles across technology, literature, and science. 
              Your next great adventure starts here at Lumina Library.
            </p>
          </motion.div>
          
          <div className="flex gap-4">
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-all">
              Join the Library
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Browse by Folders</h2>
          <div className="flex items-center gap-2 text-secondary font-medium">
            <Filter className="w-5 h-5" />
            <span>Filter items</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-6 rounded-[32px] border transition-all duration-300 flex flex-col items-center text-center gap-4 ${
                selectedCategory === cat.name 
                ? 'glass border-primary shadow-lg shadow-primary/10' 
                : 'glass border-transparent hover:border-white/20 hover:scale-105'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className={`font-bold text-lg ${selectedCategory === cat.name ? 'text-primary' : ''}`}>
                  {cat.name}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {books.filter(b => cat.name === 'All' || b.category === cat.name).length} Books
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Search and Books */}
      <section className="space-y-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary" />
          <input 
            type="text" 
            placeholder={`Search in ${selectedCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass rounded-3xl py-5 pl-16 pr-6 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg shadow-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="glass h-80 rounded-3xl animate-pulse bg-white/5"></div>
              ))
            ) : filteredBooks.length === 0 ? (
              <div className="col-span-full text-center py-20 glass rounded-[40px]">
                <BookOpen className="w-20 h-20 text-secondary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-bold">No books found in this folder</h3>
                <p className="text-secondary mt-2">Try selecting a different category or adjusting your search.</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer / Join Banner */}
      <section className="glass rounded-[40px] p-12 bg-gradient-premium relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <h2 className="text-4xl font-black text-white relative z-10">Ready to start your journey?</h2>
        <p className="text-white/80 max-w-2xl mx-auto text-lg relative z-10">
          Sign up for a library card today and get unlimited access to our digital and physical collection. 
          Free for all residents.
        </p>
        <div className="relative z-10 flex justify-center pt-4">
          <button className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-110 transition-transform active:scale-95">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
