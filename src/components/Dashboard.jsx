import React, { useMemo, useState } from 'react';
import { Building2, CheckCircle2, MapPin, PlusCircle, RefreshCcw, XCircle } from 'lucide-react';
import MapView from './MapView';

export default function Dashboard({ user, billboards, onAdd, onBook, onRelease, onStatus, selected, setSelected, query, setQuery }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    lat: '',
    lng: '',
    price: '',
    size: '20ft x 10ft',
  });

  const myBoards = useMemo(() => billboards.filter((b) => b.ownerId === user.id), [billboards, user.id]);
  const availableBoards = useMemo(() => billboards.filter((b) => b.status === 'available'), [billboards]);
  const myBookings = useMemo(() => billboards.filter((b) => b.bookedBy === user.id), [billboards, user.id]);

  function submitAdd(e) {
    e.preventDefault();
    if (!form.title || !form.location) return;
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    const price = parseFloat(form.price) || 0;
    const bb = {
      title: form.title,
      description: form.description || '—',
      location: form.location,
      lat: isFinite(lat) ? lat : 0,
      lng: isFinite(lng) ? lng : 0,
      price,
      size: form.size || '20ft x 10ft',
      status: 'available',
      ownerId: user.id,
      bookedBy: null,
    };
    onAdd?.(bb);
    setForm({ title: '', description: '', location: '', lat: '', lng: '', price: '', size: '20ft x 10ft' });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {user.role === 'owner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Add a Billboard</h2>
              </div>
              <form onSubmit={submitAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <input
                  placeholder="Location (address or area)"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <input
                  placeholder="Latitude"
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <input
                  placeholder="Longitude"
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <input
                  placeholder="Price per week (USD)"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <select
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                >
                  <option>20ft x 10ft</option>
                  <option>30ft x 14ft</option>
                  <option>48ft x 14ft</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="md:col-span-2 px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
                />
                <button className="md:col-span-2 inline-flex items-center gap-2 justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                  <PlusCircle className="w-4 h-4" /> Add Billboard
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-semibold">My Billboards</h3>
                <div className="text-xs text-neutral-600">{myBoards.length} total</div>
              </div>
              <div className="divide-y divide-neutral-200">
                {myBoards.map((b) => (
                  <div key={b.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-emerald-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-xs text-neutral-600 truncate">{b.location} • {b.size} • ${b.price}/wk</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
                    <div className="flex items-center gap-2">
                      {b.status === 'available' ? (
                        <button onClick={() => onStatus?.(b.id, false)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50"><XCircle className="w-4 h-4" />Mark Booked</button>
                      ) : (
                        <button onClick={() => onStatus?.(b.id, true)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50"><RefreshCcw className="w-4 h-4" />Set Available</button>
                      )}
                      <button onClick={() => setSelected?.(b)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50">View</button>
                    </div>
                  </div>
                ))}
                {!myBoards.length && <div className="p-6 text-sm text-neutral-600">No billboards yet. Add your first one above.</div>}
              </div>
            </div>
          </div>

          <MapView items={myBoards.length ? myBoards : billboards} selected={selected} onSelect={setSelected} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <div className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">Available Billboards</h3>
                <div className="ml-auto">
                  <input
                    placeholder="Search available..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {availableBoards.map((b) => (
                  <div key={b.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-emerald-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-xs text-neutral-600 truncate">{b.location} • {b.size} • ${b.price}/wk</div>
                    </div>
                    <button onClick={() => setSelected?.(b)} className="text-xs px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50">View</button>
                    <button onClick={() => onBook?.(b.id)} className="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">Book</button>
                  </div>
                ))}
                {!availableBoards.length && <div className="p-6 text-sm text-neutral-600">No boards currently available.</div>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
              <div className="p-4 font-semibold">My Bookings</div>
              <div className="divide-y divide-neutral-200">
                {myBookings.map((b) => (
                  <div key={b.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-emerald-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-xs text-neutral-600 truncate">{b.location} • {b.size} • ${b.price}/wk</div>
                    </div>
                    <button onClick={() => setSelected?.(b)} className="text-xs px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50">View</button>
                    <button onClick={() => onRelease?.(b.id)} className="text-xs px-3 py-1.5 rounded bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                  </div>
                ))}
                {!myBookings.length && <div className="p-6 text-sm text-neutral-600">You have no active bookings.</div>}
              </div>
            </div>
          </div>

          <MapView items={billboards} selected={selected} onSelect={setSelected} />
        </div>
      )}
    </div>
  );
}
