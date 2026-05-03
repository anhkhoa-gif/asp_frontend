'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  Book as BookIcon, 
  MapPin, 
  Calendar, 
  Clock,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Filter,
  Layers,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { BorrowModal } from '@/components/BorrowModal';

interface BookType {
  id: number;
  title: string;
  author: string;
  quantity: number;
  category: string;
  status: string;
  imageUrl?: string;
}

const HOT_BOOKS = [
  { id: 101, title: 'Muôn Kiếp Nhân Sinh', author: 'Nguyên Phong', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200' },
  { id: 102, title: 'Nhà Giả Kim', author: 'Paulo Coelho', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200' },
  { id: 103, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200' },
];

export default function Dashboard() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<{id: number, title: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

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
    // Trigger storage event for the header to update
    window.dispatchEvent(new Event('storage'));
  };

  const fetchBooks = () => {
    setLoading(true);
    fetch('http://localhost:10000/api/Books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roles = user.userRoles || user.UserRoles || [];
        const isAdmin = roles.some((ur: any) => (ur?.role?.roleName || ur?.Role?.RoleName)?.toLowerCase() === 'admin');
        if (isAdmin) {
          window.location.href = '/admin';
          return;
        }
      } catch (e) {}
    }
    fetchBooks();
  }, []);

  const totalBooksCount = books.reduce((acc, book) => acc + book.quantity, 0);
  const categories = ['Tất cả', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = selectedCategory === 'Tất cả' 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  const handleOpenBorrow = (book: {id: number, title: string}) => {
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

      {/* Exact Hero Section */}
      <section className="relative pt-16 pb-24 px-6 bg-[#FAFBFF] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1C2D37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-xs font-bold text-primary uppercase tracking-widest mb-4">
            Nền tảng thuê sách số 1 Việt Nam
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy tracking-tight leading-[1.1]">
            Đọc Sách Không Giới Hạn <br/> 
            Chỉ Từ <span className="text-primary italic">1.500đ/Ngày</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto font-medium">
            Hơn 15.000+ đầu sách đa dạng thể loại. Giao nhận tận nhà, <br className="hidden md:block"/> quy trình đơn giản, tiết kiệm tới 90% chi phí mua sách.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] p-2 border border-gray-100">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Bạn muốn đọc sách gì hôm nay?" 
                  className="w-full py-4 bg-transparent outline-none text-base font-medium text-navy placeholder:text-gray-400"
                />
              </div>
              <button className="btn-orange btn-pill px-10 py-4 text-sm shadow-lg shadow-primary/20">Tìm kiếm</button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-muted">
              <span>Gợi ý:</span>
              {['Kinh doanh', 'Phát triển bản thân', 'Tiểu thuyết', 'Thiếu nhi'].map(tag => (
                <span key={tag} className="hover:text-primary cursor-pointer transition-colors underline underline-offset-4 decoration-gray-200">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6 py-20">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-navy tracking-tight">Khám phá kho sách</h3>
            <p className="text-sm text-muted font-medium">Lựa chọn những cuốn sách hay nhất dành cho bạn.</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  selectedCategory === cat 
                  ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20' 
                  : 'bg-white text-navy border-gray-200 hover:border-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exact Book Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {loading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 aspect-[3/5] rounded-2xl"></div>
            ))
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-card group flex flex-col h-full border-none shadow-none hover:shadow-none hover:transform-none">
                <div className="relative aspect-[3/4.2] overflow-hidden rounded-2xl mb-5 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500">
                  <img 
                    src={book.imageUrl || 'https://images.unsplash.com/photo-1543004218-ee14110497f9?auto=format&fit=crop&q=80&w=400'} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black uppercase text-navy border border-gray-100 shadow-sm">
                    {book.category}
                  </div>
                  {book.quantity <= 0 && (
                    <div className="absolute inset-0 bg-navy/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                      <span className="text-[10px] text-white font-black uppercase tracking-widest text-center border-2 border-white/50 px-3 py-1.5 rounded-lg">Đã hết lượt thuê</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 px-1">
                  <h4 className="font-bold text-[15px] text-navy leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[13px] font-semibold text-primary mb-3">{book.author}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-bold text-navy">Chỉ từ</span>
                        <span className="text-[15px] font-black text-primary">1.500đ</span>
                        <span className="text-[11px] font-bold text-muted mt-1">/ngày</span>
                      </div>
                      <div className="text-[11px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                        Còn {book.quantity} quyển
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        disabled={book.quantity <= 0}
                        onClick={() => handleOpenBorrow(book)}
                        className={`w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-navy transition-all shadow-lg shadow-primary/20 ${book.quantity <= 0 ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                      >
                        Thuê ngay
                      </button>
                      <button 
                        onClick={() => addToCart(book)}
                        className="w-full py-3 bg-gray-50 text-navy rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all border border-gray-100 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trust Section */}
        <section className="mt-32 border-t border-gray-100 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { title: 'Tiết kiệm tối đa', desc: 'Đọc sách không giới hạn với chi phí chỉ bằng 1 ly cà phê mỗi tháng.', icon: '💰' },
              { title: 'Giao nhận tận nơi', desc: 'Đội ngũ shipper chuyên nghiệp giao sách tận tay bạn chỉ trong 24h.', icon: '🚚' },
              { title: 'Cộng đồng văn minh', desc: 'Cùng hàng ngàn bạn đọc chia sẻ tri thức và đam mê đọc sách.', icon: '✨' }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="text-4xl">{feature.icon}</div>
                <h4 className="text-lg font-bold text-navy">{feature.title}</h4>
                <p className="text-sm text-muted leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
