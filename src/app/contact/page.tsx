'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push('/auth/login'); return; }
    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ ...form, message: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.message || 'Failed to send message.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-beige py-12 lg:py-16">
      <div className="container-x">
        <div className="mb-10 text-center">
          <p className="section-label">CONTACT US</p>
          <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Get in Touch</h1>
          <p className="mt-3 text-secondary">Have questions? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Phone</p>
                  <p className="text-sm text-secondary">[Add your phone number]</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Email</p>
                  <p className="text-sm text-secondary">[Add your email address]</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Address</p>
                  <p className="text-sm text-secondary">[Add your office address]</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Office Hours</p>
                  <p className="text-sm text-secondary">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-secondary">Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-lg font-bold text-navy">Send Us a Message</h2>
              <p className="mt-1 text-sm text-secondary">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

              {status === 'success' && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Your message has been sent! We&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Message *</label>
                  <textarea required rows={5} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'} {!loading && <Send className="h-4 w-4" />}
                </button>
              </form>

              {!session && (
                <p className="mt-3 text-center text-xs text-secondary">
                  Please <a href="/auth/login" className="text-gold hover:underline">login</a> to send a message.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
