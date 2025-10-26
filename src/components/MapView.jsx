import React, { useMemo, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

function mapUrl(lat, lng, zoom = 13) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  const base = 'https://www.openstreetmap.org/';
  const params = `?mlat=${lat}&mlon=${lng}`;
  const hash = `#map=${zoom}/${lat}/${lng}`;
  return base + params + hash;
}

export default function MapView({ items = [], selected, onSelect }) {
  const [localQuery, setLocalQuery] = useState('');

  const list = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((b) => [b.title, b.location, b.description].some((v) => v.toLowerCase().includes(q)));
  }, [items, localQuery]);

  const sel = selected || list[0];
  const url = sel ? mapUrl(sel.lat, sel.lng, 14) : null;

  return (
    <div className="p-0 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-3 border-b border-neutral-200 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            placeholder="Quick filter within results"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 max-h-[420px] overflow-auto divide-y divide-neutral-200">
          {list.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelect?.(b)}
              className={`w-full text-left px-4 py-3 hover:bg-neutral-50 ${sel?.id === b.id ? 'bg-emerald-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">{b.title}</div>
                  <div className="text-xs text-neutral-600">{b.location}</div>
                </div>
              </div>
            </button>
          ))}
          {!list.length && (
            <div className="p-6 text-sm text-neutral-600">No billboards match your search.</div>
          )}
        </div>
        <div className="lg:col-span-3 min-h-[420px]">
          {url ? (
            <iframe title="Map" src={url} className="w-full h-full" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-500">Select a billboard to preview location</div>
          )}
        </div>
      </div>
    </div>
  );
}
