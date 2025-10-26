import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import AuthPanel from './components/AuthPanel';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';

// Local storage keys
const STORAGE_KEYS = {
  USER: 'bb_user',
  BILLBOARDS: 'bb_billboards',
};

const seedBillboards = [
  {
    id: 'bb-1',
    title: 'Downtown LED Board',
    description: 'High visibility LED billboard in downtown district',
    location: 'Downtown, City Center',
    lat: 40.7128,
    lng: -74.006,
    price: 1500,
    size: '20ft x 10ft',
    status: 'available',
    ownerId: 'demo-owner',
    bookedBy: null,
  },
  {
    id: 'bb-2',
    title: 'Airport Highway Billboard',
    description: 'Prime location on route to the airport with heavy traffic',
    location: 'Airport Hwy 101',
    lat: 37.6213,
    lng: -122.379,
    price: 2200,
    size: '30ft x 14ft',
    status: 'available',
    ownerId: 'demo-owner',
    bookedBy: null,
  },
  {
    id: 'bb-3',
    title: 'Suburban Static Board',
    description: 'Affordable static billboard in suburban shopping area',
    location: 'Maple Ave, Suburbia',
    lat: 34.0522,
    lng: -118.2437,
    price: 800,
    size: '14ft x 10ft',
    status: 'booked',
    ownerId: 'demo-owner',
    bookedBy: 'demo-customer',
  },
];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [user, setUser] = useState(() => readLS(STORAGE_KEYS.USER, null));
  const [billboards, setBillboards] = useState(() => {
    const existing = readLS(STORAGE_KEYS.BILLBOARDS, null);
    if (existing && Array.isArray(existing) && existing.length) return existing;
    writeLS(STORAGE_KEYS.BILLBOARDS, seedBillboards);
    return seedBillboards;
  });
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    writeLS(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    writeLS(STORAGE_KEYS.BILLBOARDS, billboards);
  }, [billboards]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return billboards;
    return billboards.filter((b) =>
      [b.title, b.description, b.location].some((f) => f.toLowerCase().includes(q))
    );
  }, [billboards, query]);

  function handleLogin({ role, name, email }) {
    const id = `${role}-${email}`;
    const newUser = { id, role, name, email };
    setUser(newUser);
  }

  function handleLogout() {
    setUser(null);
  }

  function addBillboard(bb) {
    setBillboards((prev) => [{ ...bb, id: `bb-${Date.now()}` }, ...prev]);
  }

  function bookBillboard(id) {
    if (!user || user.role !== 'customer') return;
    setBillboards((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'booked', bookedBy: user.id } : b)));
  }

  function releaseBooking(id) {
    // Customer unbooks their own booking
    if (!user) return;
    setBillboards((prev) =>
      prev.map((b) => (b.id === id && b.bookedBy === user.id ? { ...b, status: 'available', bookedBy: null } : b))
    );
  }

  function ownerSetAvailability(id, toAvailable) {
    if (!user || user.role !== 'owner') return;
    setBillboards((prev) =>
      prev.map((b) => (b.id === id && b.ownerId === user.id ? { ...b, status: toAvailable ? 'available' : 'booked', bookedBy: toAvailable ? null : b.bookedBy } : b))
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header user={user} onLogout={handleLogout} onQuery={setQuery} />

      {!user ? (
        <div className="max-w-6xl mx-auto p-4">
          <AuthPanel onLogin={handleLogin} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white shadow-sm border border-neutral-200">
              <h2 className="text-xl font-semibold mb-2">Browse Available Billboards</h2>
              <p className="text-sm text-neutral-600 mb-4">Sign in to book or list your billboard. Use the map to explore locations.</p>
              <div className="divide-y divide-neutral-200">
                {filtered.map((b) => (
                  <button key={b.id} onClick={() => setSelected(b)} className="py-4 w-full text-left hover:bg-neutral-50 rounded-md px-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{b.title}</div>
                        <div className="text-sm text-neutral-600">{b.location} • {b.size} • ${b.price}/wk</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <MapView selected={selected} onSelect={setSelected} items={filtered} />
          </div>
        </div>
      ) : (
        <Dashboard
          user={user}
          billboards={billboards}
          onAdd={addBillboard}
          onBook={bookBillboard}
          onRelease={releaseBooking}
          onStatus={ownerSetAvailability}
          selected={selected}
          setSelected={setSelected}
          query={query}
          setQuery={setQuery}
        />
      )}

      <footer className="text-center text-xs text-neutral-500 py-8">© {new Date().getFullYear()} BillboardHub • Demo</footer>
    </div>
  );
}
