'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: number;
  title: string;
  author: string;
  imageUrl?: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [days, setDays] = useState(7);
  const PRICE_PER_DAY = 1500;

  const totalPrice = cart.reduce((acc, item) => acc + (item.quantity * days * PRICE_PER_DAY), 0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleCheckout = async () => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      alert('Vui lòng đăng nhập để thuê sách!');
      return;
    }

    setLoading(true);
    setError(null);
    const user = JSON.parse(storedUser);

    try {
      // 1. Get Reader ID or Auto-Create
      const readersRes = await fetch('http://localhost:10000/api/Readers');
      const readers = await readersRes.json();
      
      let reader = readers.find((r: any) => 
        (r.userId || r.UserId) == (user.id || user.Id) ||
        (r.user?.id || r.User?.Id) == (user.id || user.Id)
      );

      if (!reader) {
        // Auto-create reader card if missing
        const createReaderRes = await fetch('http://localhost:10000/api/Readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || user.Id, maxBooks: 5 })
        });
        if (createReaderRes.ok) {
          reader = await createReaderRes.json();
        } else {
          throw new Error('Không thể tự động tạo thẻ thư viện. Vui lòng liên hệ Admin.');
        }
      }

      const readerId = reader.id || reader.Id;

      // 2. Prepare Borrow Data
      const borrowData = {
        readerId: readerId, 
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        status: 0,
        borrowDetails: cart.flatMap(item => 
          Array.from({ length: item.quantity }).map(() => ({
            bookId: item.id
          }))
        )
      };

      // 3. POST to API
      const response = await fetch('http://localhost:10000/api/Borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(borrowData)
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Không thể thực hiện thuê sách.');
      }

      // 4. Success
      setIsSuccess(true);
      setCart([]);
      localStorage.removeItem('cart');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[48px] shadow-2xl text-center max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-navy uppercase tracking-tight mb-4">Giao dịch hoàn tất!</h1>
          <p className="text-muted font-bold text-lg mb-10 leading-relaxed">
            Đơn thuê sách của bạn đã được ghi nhận. Tổng chi phí: <span className="text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>.
          </p>
          <Link href="/history" className="btn-navy w-full py-5 block text-lg uppercase tracking-widest font-black rounded-2xl shadow-xl shadow-navy/20">
            Xem lịch sử thuê sách
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-6 h-6 text-navy" />
            </Link>
            <h1 className="text-xl font-black text-navy uppercase tracking-tight">Giỏ sách của bạn</h1>
          </div>
          <div className="bg-soft px-4 py-2 rounded-full text-xs font-black text-primary uppercase tracking-widest">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} Cuốn sách
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {cart.length === 0 ? (
          <div className="bg-white p-20 rounded-[48px] text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-soft rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-muted" />
            </div>
            <h2 className="text-3xl font-black text-navy uppercase tracking-tight mb-4">Giỏ sách đang trống</h2>
            <p className="text-muted font-bold text-lg mb-12">Hãy dạo quanh kho sách và chọn cho mình những tác phẩm ưng ý nhất.</p>
            <Link href="/" className="btn-orange px-12 py-5 inline-block text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl">
              Quay lại cửa hàng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <motion.div 
                  layout
                  key={item.id}
                  className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group"
                >
                  <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-md bg-soft flex-shrink-0">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200'} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-navy group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm font-bold text-muted mt-1 uppercase tracking-widest">{item.author}</p>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-soft rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-navy"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-navy">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-navy"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 sticky top-32">
                <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-8 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Tóm tắt đơn thuê
                </h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-sm font-bold text-muted">
                    <span>Tổng số lượng</span>
                    <span className="text-navy">{cart.reduce((acc, item) => acc + item.quantity, 0)} cuốn</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-muted">
                      <span>Thời hạn thuê (ngày)</span>
                      <span className="text-primary">{days} ngày</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="w-full h-2 bg-soft rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] font-black text-muted uppercase">
                      <span>1 ngày</span>
                      <span>30 ngày</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-4"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest">Đơn giá</span>
                      <span className="text-xs font-bold text-navy">1.500đ / ngày / cuốn</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-navy uppercase tracking-tight">Thanh toán</span>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Đã bao gồm VAT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full py-5 bg-navy text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-navy/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      Xác nhận thuê sách
                    </>
                  )}
                </button>
                
                <p className="text-[10px] text-center text-muted font-bold mt-6 uppercase tracking-widest">
                  Bằng cách nhấn xác nhận, bạn đồng ý với <span className="text-primary hover:underline cursor-pointer">điều khoản</span> của OpenBoox.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
