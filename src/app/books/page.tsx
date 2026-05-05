'use client';

import { API_URL } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Plus, Search, BookOpen, Trash2, Edit3 } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { BookModal } from '@/components/BookModal';

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: number;
  imageUrl?: string;
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
    fetch(`${API_URL}/api/Books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return (window.location.href = '/login');

    try {
      const user = JSON.parse(userStr);
      const roles = user.userRoles || user.UserRoles || [];

      const isAdmin = roles.some(
        (ur: any) =>
          (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin'
      );

      if (!isAdmin) return (window.location.href = '/');

      setIsAuthorized(true);
      fetchBooks();
    } catch {
      window.location.href = '/login';
    }
  }, []);

  const handleDeleteBook = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    await fetch(`${API_URL}/api/Books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) {
    return <div className="p-10 text-center">Checking quyền...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Kho sách</h2>

        <div className="flex gap-2">
          <button onClick={() => setView('grid')}>
            <Grid />
          </button>
          <button onClick={() => setView('list')}>
            <List />
          </button>
          <button onClick={() => setIsModalOpen(true)}>
            <Plus />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2" />
          <input
            className="pl-8 border p-2 w-full"
            placeholder="Tìm sách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="border px-4">
          <Filter />
        </button>
      </div>

      {/* LIST */}
      <AnimatePresence>
        {loading ? (
          <p>Loading...</p>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen />
            <p>Không có sách</p>
          </div>
        ) : (
          <motion.div
            layout
            className={
              view === 'grid'
                ? 'grid grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredBooks.map((book) =>
              view === 'grid' ? (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />

                  <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit3 />
                    </button>

                    <button onClick={() => handleDeleteBook(book.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  key={book.id}
                  className="flex justify-between border p-4"
                >
                  <div>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setEditingBook(book)}>
                      <Edit3 />
                    </button>
                    <button onClick={() => handleDeleteBook(book.id)}>
                      <Trash2 />
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
        book={editingBook}
      />
    </div>
  );
}