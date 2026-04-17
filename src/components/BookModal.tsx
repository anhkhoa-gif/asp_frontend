'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2 } from 'lucide-react';

interface Book {
  id?: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: number;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  book?: Book | null;
}

export function BookModal({ isOpen, onClose, onSave, book }: BookModalProps) {
  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    quantity: 1,
    category: 'General',
    status: 0
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData({
        title: '',
        author: '',
        quantity: 1,
        category: 'General',
        status: 0
      });
    }
  }, [book, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
      >
        <div className="p-6 border-b border-glass-border flex items-center justify-between bg-white/5">
          <h3 className="text-xl font-bold">{book ? 'Edit Book' : 'Add New Book'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Book Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="e.g. The Great Gatsby"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Author</label>
            <input 
              required
              type="text" 
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-transparent"
            >
              <option value="General" className="bg-slate-900">General</option>
              <option value="Technology" className="bg-slate-900">Technology</option>
              <option value="Literature" className="bg-slate-900">Literature</option>
              <option value="Science" className="bg-slate-900">Science</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Quantity</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                className="w-full glass rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-transparent"
              >
                <option value={0} className="bg-slate-900">Available</option>
                <option value={1} className="bg-slate-900">Borrowed</option>
                <option value={2} className="bg-slate-900">Reserved</option>
                <option value={3} className="bg-slate-900">Lost</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 glass hover:bg-white/10 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-gradient-premium text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {book ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
