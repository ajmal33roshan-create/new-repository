'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, MapPin, Settings, Image as ImageIcon, Phone, Check,
  ArrowRight, ArrowLeft, Upload, X, Star, CheckCircle2, AlertCircle,
} from 'lucide-react';
import {
  PROPERTY_TYPES, LISTING_TYPES, CURRENCIES, AMENITIES, FURNISHED_OPTIONS, CITIES,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

const steps = [
  { num: 1, label: 'Basic Info', icon: Home },
  { num: 2, label: 'Location', icon: MapPin },
  { num: 3, label: 'Details', icon: Settings },
  { num: 4, label: 'Images', icon: ImageIcon },
  { num: 5, label: 'Contact', icon: Phone },
  { num: 6, label: 'Review', icon: Check },
];

export default function ListPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: '', propertyType: '', listingType: '', description: '',
    country: 'United States', city: '', neighborhood: '', address: '',
    price: '', currency: 'USD', bedrooms: '', bathrooms: '', area: '', areaUnit: 'sqft',
    furnished: '', amenities: [] as string[],
    images: [] as string[], mainImage: '',
    contactName: '', contactEmail: '', contactPhone: '',
  });

  if (status === 'loading') return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;
  if (!session) { router.push('/auth/login'); return null; }

  const update = (key: string, value: any) => setForm({ ...form, [key]: value });
  const toggleAmenity = (a: string) => {
    const list = form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a];
    setForm({ ...form, amenities: list });
  };

  const validateStep = (): boolean => {
    setError('');
    switch (step) {
      case 1: if (!form.title || !form.propertyType || !form.listingType || !form.description) { setError('Please fill in all required fields.'); return false; } break;
      case 2: if (!form.city || !form.address) { setError('City and address are required.'); return false; } break;
      case 3: if (!form.price || !form.area) { setError('Price and area are required.'); return false; } break;
      case 4: if (form.images.length === 0) { setError('Please upload at least one image.'); return false; } break;
      case 5: if (!form.contactName || !form.contactEmail) { setError('Contact name and email are required.'); return false; } break;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(step + 1); };
  const prev = () => { setError(''); setStep(step - 1); };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append('files', f);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.urls) {
        const newImages = [...form.images, ...data.urls];
        setForm({ ...form, images: newImages, mainImage: form.mainImage || data.urls[0] });
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch {
      setError('Upload failed. Please try again.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (url: string) => {
    const newImages = form.images.filter((i) => i !== url);
    setForm({
      ...form,
      images: newImages,
      mainImage: form.mainImage === url ? newImages[0] || '' : form.mainImage,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Submission failed. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-navy">Property Submitted!</h1>
          <p className="mt-3 text-secondary">
            Your property has been submitted for review. An administrator will review your listing and approve it shortly. You&apos;ll receive a notification once it&apos;s live.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
            <Link href="/properties" className="btn-outline">Browse Properties</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige py-8 lg:py-12">
      <div className="container-x max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy">List Your Property</h1>
          <p className="mt-2 text-secondary">Submit your property for review. It will be live once approved.</p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  step === s.num ? 'border-gold bg-gold text-navy' : step > s.num ? 'border-green-500 bg-green-500 text-white' : 'border-navy/15 bg-white text-secondary'
                )}>
                  {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={cn('hidden text-xs font-medium sm:block', step >= s.num ? 'text-navy' : 'text-secondary/60')}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded transition-colors', step > s.num ? 'bg-green-500' : 'bg-navy/10')} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Basic Information</h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Property Title *</label>
                <input type="text" placeholder="e.g. Modern Glass Villa with Pool" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Property Type *</label>
                  <select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="input-field cursor-pointer">
                    <option value="">Select type</option>
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Listing Purpose *</label>
                  <select value={form.listingType} onChange={(e) => update('listingType', e.target.value)} className="input-field cursor-pointer">
                    <option value="">Select purpose</option>
                    {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Description *</label>
                <textarea placeholder="Describe your property..." rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Location</h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Country</label>
                <input type="text" value={form.country} onChange={(e) => update('country', e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">City *</label>
                  <input type="text" placeholder="e.g. Beverly Hills, CA" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" list="cities" />
                  <datalist id="cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Neighborhood</label>
                  <input type="text" placeholder="e.g. Beverly Crest" value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Street Address *</label>
                <input type="text" placeholder="e.g. 1289 Sunset Boulevard" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Property Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Price *</label>
                  <input type="number" placeholder="e.g. 2850000" value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Currency</label>
                  <select value={form.currency} onChange={(e) => update('currency', e.target.value)} className="input-field cursor-pointer">
                    {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Bedrooms</label>
                  <input type="number" placeholder="0" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Bathrooms</label>
                  <input type="number" placeholder="0" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Area *</label>
                  <input type="number" placeholder="0" value={form.area} onChange={(e) => update('area', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">Unit</label>
                  <select value={form.areaUnit} onChange={(e) => update('areaUnit', e.target.value)} className="input-field cursor-pointer">
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Furnished Status</label>
                <select value={form.furnished} onChange={(e) => update('furnished', e.target.value)} className="input-field cursor-pointer">
                  <option value="">Select status</option>
                  {FURNISHED_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-navy">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-colors', form.amenities.includes(a) ? 'bg-navy text-white' : 'bg-beige text-navy hover:bg-navy/10')}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Property Images</h2>
              <p className="text-sm text-secondary">Upload at least one image. The first image will be the main image unless you select another.</p>
              <div className="rounded-xl border-2 border-dashed border-navy/15 p-8 text-center">
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleUpload(e.target.files)} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mx-auto flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-beige">
                    {uploading ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" /> : <Upload className="h-6 w-6 text-gold" />}
                  </div>
                  <span className="text-sm font-medium text-navy">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
                  <span className="text-xs text-secondary">PNG, JPG up to 5MB each</span>
                </button>
              </div>
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {form.images.map((url) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-navy/5">
                      <Image src={url} alt="Property" fill className="object-cover" sizes="200px" />
                      {form.mainImage === url && (
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-xs font-semibold text-navy">
                          <Star className="h-3 w-3 fill-navy" /> Main
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {form.mainImage !== url && (
                          <button type="button" onClick={() => update('mainImage', url)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-navy">
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(url)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Contact */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Contact Details</h2>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Agent/Owner Name *</label>
                <input type="text" placeholder="Your name" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Email *</label>
                <input type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} className="input-field" />
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy">Review &amp; Submit</h2>
              <p className="text-sm text-secondary">Please review your property details before submitting.</p>
              <div className="space-y-3 rounded-xl bg-beige/50 p-5 text-sm">
                <div className="flex justify-between"><span className="text-secondary">Title:</span><span className="font-medium text-navy">{form.title}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Type:</span><span className="font-medium text-navy">{PROPERTY_TYPES.find(t => t.value === form.propertyType)?.label}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Purpose:</span><span className="font-medium text-navy">{LISTING_TYPES.find(t => t.value === form.listingType)?.label}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Price:</span><span className="font-medium text-navy">{form.currency} {Number(form.price).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Location:</span><span className="font-medium text-navy">{form.city}, {form.address}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Bedrooms:</span><span className="font-medium text-navy">{form.bedrooms || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Bathrooms:</span><span className="font-medium text-navy">{form.bathrooms || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Area:</span><span className="font-medium text-navy">{form.area} {form.areaUnit}</span></div>
                <div className="flex justify-between"><span className="text-secondary">Images:</span><span className="font-medium text-navy">{form.images.length} uploaded</span></div>
                <div className="flex justify-between"><span className="text-secondary">Contact:</span><span className="font-medium text-navy">{form.contactName} ({form.contactEmail})</span></div>
                {form.amenities.length > 0 && (
                  <div className="border-t border-navy/10 pt-2">
                    <span className="text-secondary">Amenities: </span>
                    <span className="font-medium text-navy">{form.amenities.join(', ')}</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-gold/10 p-3 text-sm text-navy">
                <strong>Note:</strong> Your listing will be reviewed by an administrator before it becomes publicly visible.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={prev} className="btn-outline">
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
            ) : <div />}
            {step < 6 ? (
              <button onClick={next} className="btn-primary">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-gold disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Listing'} {!loading && <Check className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
