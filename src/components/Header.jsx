import React from 'react';
import { Megaphone, LogIn, LogOut, MapPin, Search, User } from 'lucide-react';

export default function Header({ user, onLogout, onQuery }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emerald-600" />
          <span className="font-semibold">BillboardHub</span>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by city, street, or title"
              onChange={(e) => onQuery?.(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center text-neutral-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            Find boards
          </div>
          {!user ? (
            <div className="flex items-center gap-2 text-neutral-700">
              <User className="w-4 h-4" />
              <span className="text-sm">Guest</span>
              <LogIn className="w-4 h-4 ml-2" />
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
