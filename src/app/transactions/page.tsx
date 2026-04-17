'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface Borrow {
  id: number;
  borrowDate: string;
  dueDate: string;
  status: number;
  reader: {
    user: {
      fullName: string;
    }
  };
}

export default function TransactionsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/Borrows')
      .then(res => res.json())
      .then(data => {
        setBorrows(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, []);

  const handleReturnBook = async (id: number) => {
    try {
      // Fetch the current borrow record first
      const res = await fetch(`http://localhost:5000/api/Borrows/${id}`);
      const borrow = await res.json();
      
      // Update status to 1 (Returned)
      const updatedBorrow = { ...borrow, status: 1 };
      
      const response = await fetch(`http://localhost:5000/api/Borrows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBorrow)
      });

      if (response.ok) {
        // Refresh the list
        fetch('http://localhost:5000/api/Borrows')
          .then(res => res.json())
          .then(data => setBorrows(data));
      }
    } catch (err) {
      console.error('Error returning book:', err);
    }
  };

  const filteredBorrows = borrows.filter(b => 
    b.reader?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Transactions</h2>
          <p className="text-secondary mt-1">Monitor book borrowing and return history.</p>
        </div>
        <button className="bg-gradient-premium text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/25">
          <ArrowLeftRight className="w-5 h-5" />
          New Transaction
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
        <input 
          type="text" 
          placeholder="Search by member name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full glass rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBorrows.length === 0 ? (
          <div className="py-20 text-center glass rounded-2xl text-secondary">
            No transactions found.
          </div>
        ) : (
          filteredBorrows.map((borrow) => (
            <motion.div 
              key={borrow.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  borrow.status === 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {borrow.status === 0 ? <Clock className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-lg">{borrow.reader?.user?.fullName ?? 'Unknown Member'}</p>
                  <p className="text-sm text-secondary">Transaction ID: #{borrow.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Borrow Date</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(borrow.borrowDate)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Due Date</span>
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className={`w-4 h-4 ${new Date(borrow.dueDate) < new Date() && borrow.status === 0 ? 'text-red-500' : 'text-blue-500'}`} />
                    {formatDate(borrow.dueDate)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                    borrow.status === 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {borrow.status === 0 ? 'Borrowing' : 'Returned'}
                  </span>
                  {borrow.status === 0 && (
                    <button 
                      onClick={() => handleReturnBook(borrow.id)}
                      className="p-2 bg-primary text-white rounded-lg hover:scale-110 transition-transform shadow-lg shadow-primary/20"
                      title="Mark as Returned"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
