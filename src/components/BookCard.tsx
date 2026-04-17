'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Book as BookIcon, User } from 'lucide-react';

export enum BookStatus {
  Available = 0,
  Borrowed = 1,
  Reserved = 2,
  Lost = 3
}

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  imageUrl?: string;
  status: BookStatus;
}

const statusColors = {
  [BookStatus.Available]: 'bg-green-500/10 text-green-500',
  [BookStatus.Borrowed]: 'bg-amber-500/10 text-amber-500',
  [BookStatus.Reserved]: 'bg-blue-500/10 text-blue-500',
  [BookStatus.Lost]: 'bg-red-500/10 text-red-500',
};

const statusLabels = {
  [BookStatus.Available]: 'Available',
  [BookStatus.Borrowed]: 'Borrowed',
  [BookStatus.Reserved]: 'Reserved',
  [BookStatus.Lost]: 'Lost',
};

export function BookCard({ book }: { book: Book }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-3 rounded-[32px] group hover:shadow-2xl hover:shadow-primary/10 transition-all border border-transparent hover:border-primary/20"
    >
      <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden mb-4 shadow-inner">
        {book.imageUrl ? (
          <img 
            src={book.imageUrl} 
            alt={book.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543004218-ee14110497f9?auto=format&fit=crop&q=80&w=400';
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-premium flex items-center justify-center text-white/50">
            <BookIcon className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-white/10">
            {book.category || 'General'}
          </span>
        </div>
      </div>

      <div className="px-2 space-y-1">
        <h4 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-secondary">
          <User className="w-3.5 h-3.5" />
          <span className="truncate">{book.author}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-glass-border flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[book.status]}`}>
          {statusLabels[book.status]}
        </span>
        <span className="text-sm font-medium text-secondary">
          Qty: <span className="text-foreground">{book.quantity}</span>
        </span>
      </div>
    </motion.div>
  );
}
