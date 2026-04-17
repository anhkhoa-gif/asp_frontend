'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  Plus,
  Search,
  BookOpen
} from 'lucide-react';
import { BookCard, BookStatus } from '@/components/BookCard';
import { BookModal } from '@/components/BookModal';

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
  status: BookStatus;
}

export default function BooksPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSaveBook = async (bookData: Book) => {
    const url = bookData.id 
      ? `http://localhost:5000/api/Books/${bookData.id}` 
      : 'http://localhost:5000/api/Books';
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
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/Books/${id}`, {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Books Catalog</h2>
          <p className="text-secondary mt-1">Manage and explore your library collection.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-white/5'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-white/5'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => {
              setEditingBook(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-premium text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Book
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input 
            type="text" 
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
        <button className="glass px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <BookOpen className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No books found</h3>
            <p className="text-secondary">Try adjusting your search or add a new book.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className={view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
            }
          >
            {filteredBooks.map((book) => (
              view === 'grid' ? (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingBook(book);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-md hover:bg-primary text-white rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id!)}
                      className="p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  key={book.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-4 rounded-xl flex items-center gap-6 group hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-16 bg-gradient-premium rounded flex items-center justify-center text-white/50 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{book.title}</h4>
                    <p className="text-sm text-secondary truncate">{book.author}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs text-secondary mb-1 uppercase tracking-wider font-bold">Status</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      book.status === BookStatus.Available ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {book.status === BookStatus.Available ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                  <div className="text-right shrink-0 px-4">
                    <p className="text-xs text-secondary mb-1 uppercase tracking-wider font-bold">Qty</p>
                    <p className="font-bold">{book.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingBook(book);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 text-secondary"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id!)}
                      className="p-2 rounded-lg hover:bg-white/10 text-red-500"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
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
