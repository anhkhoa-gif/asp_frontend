'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Search, 
  DollarSign, 
  Clock, 
  CreditCard, 
  User 
} from 'lucide-react';

interface Fine {
  id: number;
  amount: number;
  borrow: {
    reader: {
      user: {
        fullName: string;
      }
    }
  };
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/Fines')
      .then(res => res.json())
      .then(data => {
        setFines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching fines:', err);
        setLoading(false);
      });
  }, []);

  const filteredFines = fines.filter(f => 
    f.borrow?.reader?.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const totalFines = filteredFines.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Fines & Fees</h2>
          <p className="text-secondary mt-1">Manage late return fees and penalties.</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-secondary">Total Outstanding</p>
            <p className="text-xl font-bold text-red-500">${totalFines.toFixed(2)}</p>
          </div>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredFines.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-2xl text-secondary">
            No fines found.
          </div>
        ) : (
          filteredFines.map((fine) => (
            <motion.div 
              key={fine.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-2xl hover:border-red-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-secondary">ID: #{fine.id}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="font-bold">{fine.borrow?.reader?.user?.fullName ?? 'Unknown Member'}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Late Return Fee</span>
                  </div>
                  <p className="text-xl font-black text-red-500">${fine.amount.toFixed(2)}</p>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <CreditCard className="w-4 h-4" />
                Mark as Paid
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
