import React, { useState } from 'react';
import { Building2, User } from 'lucide-react';

export default function AuthPanel({ onLogin }) {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name || !email) return;
    onLogin?.({ role, name, email: email.toLowerCase() });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700">
          {role === 'owner' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <div>
          <h1 className="text-xl font-semibold">Welcome to BillboardHub</h1>
          <p className="text-sm text-neutral-600">Choose your role and sign in to continue.</p>
        </div>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center rounded-lg border border-neutral-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 text-sm ${role === 'customer' ? 'bg-emerald-600 text-white' : 'bg-white text-neutral-700'}`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`flex-1 py-2 text-sm ${role === 'owner' ? 'bg-emerald-600 text-white' : 'bg-white text-neutral-700'}`}
          >
            I am an Owner
          </button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
        />
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
          />
          <button className="px-4 whitespace-nowrap rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Continue</button>
        </div>
      </form>
    </div>
  );
}
