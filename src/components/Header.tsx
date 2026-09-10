import React from 'react';
import { Building2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-6 shadow-md border-b-4 border-accent">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="bg-white text-primary p-3 rounded-full flex-shrink-0 shadow-lg">
            <Building2 size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
              KPCC Industries Cell
            </h1>
            <p className="text-sm md:text-base text-primary-foreground/80 mt-1">
              Membership Application Form
            </p>
          </div>
        </div>
        
        <div className="text-xs md:text-sm text-primary-foreground/70 hidden md:block max-w-xs text-right">
          <p>Indira Bhavan, Vellayambalam-Sasthamangalam Road</p>
          <p>Sasthamangalam P.O, Thiruvananthapuram</p>
          <p>Kerala, PIN: 695010</p>
        </div>
      </div>
    </header>
  );
}
