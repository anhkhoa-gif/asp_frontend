'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag
} from 'lucide-react';
import { BorrowModal } from '@/components/BorrowModal';

// 1. Định nghĩa API_URL (Thay bằng URL thật của bạn)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BookType {
  id: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: string;
  imageUrl?: string; // Đã có thuộc tính này để tránh lỗi TS
}

export default function Dashboard() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<{ id: number, title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Hàm tải dữ liệu
  const fetchBooks = () => {
    setLoading(true);
    fetch(`${API_URL}/api/Books`)
      .then(res => res.json())
      .then((data: BookType[]) => { // Ép kiểu dữ liệu trả về từ API
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Kiểm tra quyền Admin
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roles = user.userRoles || user.UserRoles || [];
        const isAdmin = roles.some((ur: any) =>
          (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin'
        );
        if (isAdmin) {
          window.location.href = '/admin';
          return;
        }
      } catch (e) {
        console.error("Lỗi parse user:", e);
      }
    }
    fetchBooks();
  }, []);

  const addToCart = (book: BookType) => {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find((item: any) => item.id === book.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${book.title}" vào giỏ sách!`);
    window.dispatchEvent(new Event('storage'));
  };

  const categories = ['Tất cả', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = selectedCategory === 'Tất cả'
    ? books
    : books.filter(b => b.category === selectedCategory);

  const handleOpenBorrow = (book: { id: number, title: string }) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBooks}
        bookTitle={selectedBook?.title || ''}
        bookId={selectedBook?.id || 0}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 bg-[#FAFBFF] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1C2D37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-xs font-bold text-primary uppercase tracking-widest mb-4">
            Nền tảng thuê sách số 1 Việt Nam
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy tracking-tight leading-[1.1]">
            Đọc Sách Không Giới Hạn <br />
            Chỉ Từ <span className="text-primary italic">1.500đ/Ngày</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Bạn muốn đọc sách gì hôm nay?"
                  className="w-full py-4 bg-transparent outline-none text-base font-medium text-navy"
                />
              </div>
              <button className="bg-orange-500 text-white rounded-xl px-10 py-4 text-sm font-bold">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <h3 className="text-2xl md:text-3xl font-black text-navy">Khám phá kho sách</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-navy text-white' : 'bg-white text-navy border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {loading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-2xl"></div>
            ))
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="group flex flex-col h-full">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 shadow-md">
                  <img
                    // Sửa lỗi fallback ảnh ở đây
                    src={book.imageUrl || 'https://images.unsplash.com/photo-1543004218-ee14110497f9?q=80&w=400'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-navy">
                    {book.category}
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h4 className="font-bold text-sm text-navy line-clamp-2 mb-1">{book.title}</h4>
                  <p className="text-xs text-primary font-medium mb-3">{book.author}</p>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-bold text-navy">1.500đ/ngày</span>
                      <span className="text-orange-600 font-bold">Còn {book.quantity}</span>
                    </div>
                    <button
                      disabled={book.quantity <= 0}
                      onClick={() => handleOpenBorrow(book)}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50"
                    >
                      Thuê ngay
                    </button>
                    <button
                      onClick={() => addToCart(book)}
                      className="w-full py-2.5 bg-gray-100 text-navy rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}