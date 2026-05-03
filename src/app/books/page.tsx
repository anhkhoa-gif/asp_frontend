'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  Plus,
  Search,
  BookOpen,
  Trash2,
  Edit3,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { BookCard, BookStatus } from '@/components/BookCard';
import { BookModal } from '@/components/BookModal';

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: BookStatus;
}

export default function BooksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      window.location.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const roles = user.userRoles || user.UserRoles || [];
      const isAdmin = roles.some((ur: any) => (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin');
      
      if (!isAdmin) {
        window.location.replace('/');
        return;
      }
      
      setIsAuthorized(true);
      fetchBooks();
    } catch {
      window.location.replace('/login');
    }
  }, []);

  const handleSaveBook = async (bookData: any) => {
    const url = bookData.id 
      ? `http://localhost:10000/api/Books/${bookData.id}` 
      : 'http://localhost:10000/api/Books';
    const method = bookData.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchBooks();
      }
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này không?')) return;

    try {
      const response = await fetch(`http://localhost:10000/api/Books/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBooks();
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-navy animate-pulse">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Kho sách của bạn</h2>
            <p className="text-sm text-muted font-medium mt-1">Quản lý kho và cập nhật thông tin các tựa sách thuê.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-soft p-1 rounded-xl flex items-center gap-1 border border-gray-100">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-navy'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-navy'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => {
              setEditingBook(null);
              setIsModalOpen(true);
            }}
            className="btn-navy flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="font-bold">Thêm Sách Mới</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-soft rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-primary/5 border border-gray-100 transition-all font-medium"
          />
        </div>
        <button className="bg-white border border-gray-200 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-primary transition-all text-navy shadow-sm">
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-muted animate-pulse">Đang tải kho sách...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-24 bg-soft rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BookOpen className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-black text-navy">Không tìm thấy sách</h3>
            <p className="text-muted font-medium mt-2">Hãy thử điều chỉnh từ khóa tìm kiếm hoặc thêm sách mới vào kho.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className={view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
              : "flex flex-col gap-4"
            }
          >
            {filteredBooks.map((book) => (
              view === 'grid' ? (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => {
                        setEditingBook(book);
                        setIsModalOpen(true);
                      }}
                      className="p-3 bg-white shadow-xl hover:bg-navy hover:text-white text-navy rounded-xl transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id!)}
                      className="p-3 bg-white shadow-xl hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-2xl flex items-center gap-6 group hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="w-16 h-20 bg-soft rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img src={book.imageUrl || 'https://images.unsplash.com/photo-1543004218-ee14110497f9?w=100'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-navy text-lg truncate group-hover:text-primary transition-colors">{book.title}</h4>
                    <p className="text-sm font-semibold text-primary truncate">{book.author}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted bg-soft px-2 py-0.5 rounded-md">{book.category}</span>
                      <span className="text-[10px] font-black uppercase text-navy">ID: #{book.id}</span>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0 px-8">
                    <p className="text-[10px] text-muted mb-1 uppercase tracking-widest font-black">Kho lưu trữ</p>
                    <p className="font-black text-xl text-navy">{book.quantity} cuốn</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setEditingBook(book);
                        setIsModalOpen(true);
                      }}
                      className="p-3 rounded-xl hover:bg-soft text-navy transition-colors border border-gray-50"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id!)}
                      className="p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors border border-gray-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <BookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveBook}
        book={editingBook}
      />
    </div>
  );
}
