import React from 'react';
import { Building2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 border-b-4 border-accent">
      <div className="container mx-auto px-4 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
            <Building2 size={24} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-white">
              KPCC Industries Cell
            </h1>
            <p className="text-xs sm:text-sm text-primary-foreground/70 font-medium tracking-wide">
              MEMBERSHIP APPLICATION
            </p>
          </div>
        </div>
        
        <div className="text-[10px] sm:text-xs text-primary-foreground/60 hidden md:block text-right">
          <p>Indira Bhavan, Vellayambalam-Sasthamangalam Rd</p>
          <p>Trivandrum, Kerala 695010</p>
        </div>
      </div>
    </header>
  );
}
