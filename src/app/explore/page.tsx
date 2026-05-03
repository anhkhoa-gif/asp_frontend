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
  Filter,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { BookCard } from '@/components/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  quantity: number;
  status: number;
  imageUrl?: string;
}

const CATEGORIES = [
  { name: 'Tất cả', icon: ShoppingBag, color: 'bg-navy' },
  { name: 'Kinh doanh', icon: Zap, color: 'bg-primary' },
  { name: 'Văn học', icon: GraduationCap, color: 'bg-indigo-600' },
  { name: 'Công nghệ', icon: Microscope, color: 'bg-emerald-600' },
  { name: 'Kỹ năng', icon: Compass, color: 'bg-amber-600' },
];

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:10000/api/Books')
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
    const matchesCategory = selectedCategory === 'Tất cả' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Search Header */}
      <section className="bg-navy pt-12 pb-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tight">Cửa hàng <span className="text-primary italic">Sách Thuê</span></h1>
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
              Tìm kiếm và chọn thuê những đầu sách chất lượng nhất từ kho 15.000+ cuốn của OpenBoox.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto shadow-2xl shadow-black/50">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted" />
            <input 
              type="text" 
              placeholder={`Bạn muốn tìm sách gì trong mục ${selectedCategory}?`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-6 pl-16 pr-8 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-lg font-bold text-navy"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-8 -mt-12 relative z-20">
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${
                selectedCategory === cat.name 
                ? 'bg-primary text-white' 
                : 'bg-white text-navy hover:bg-soft'
              }`}
            >
              <cat.icon className={`w-5 h-5 ${selectedCategory === cat.name ? 'text-white' : 'text-primary'}`} />
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-8 mt-16 space-y-12">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-black text-navy tracking-tight">
            {selectedCategory === 'Tất cả' ? 'Tất cả tựa sách' : `Sách ${selectedCategory}`}
            <span className="ml-4 text-sm font-bold text-muted bg-soft px-3 py-1 rounded-full">{filteredBooks.length} kết quả</span>
          </h2>
          <button className="flex items-center gap-2 text-navy font-black text-xs uppercase tracking-widest hover:text-primary transition-colors">
            <Filter className="w-4 h-4" />
            Sắp xếp theo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="bg-soft aspect-[3/4] rounded-3xl animate-pulse"></div>
              ))
            ) : filteredBooks.length === 0 ? (
              <div className="col-span-full text-center py-32 bg-soft rounded-[48px] border-2 border-dashed border-gray-200">
                <BookOpen className="w-24 h-24 text-muted/30 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-navy">Rất tiếc! Không tìm thấy sách</h3>
                <p className="text-muted font-bold mt-4 text-lg">Bạn hãy thử tìm kiếm với từ khóa khác nhé.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('Tất cả');}}
                  className="mt-8 btn-navy btn-pill"
                >
                  Xem tất cả sách
                </button>
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

      {/* Join Banner */}
      <section className="max-w-7xl mx-auto px-8 mt-24">
        <div className="bg-navy rounded-[48px] p-16 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl font-black text-white tracking-tighter">Bạn là "mọt sách" chính hiệu?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
              Trở thành thành viên của OpenBoox ngay hôm nay để nhận được ưu đãi thuê sách không giới hạn chỉ từ 1.500đ/ngày.
            </p>
            <div className="flex justify-center gap-6 pt-4">
              <button className="btn-orange btn-pill px-12 py-5 text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                Đăng ký ngay
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-12 py-5 rounded-full font-black text-lg transition-all active:scale-95 backdrop-blur-md">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
