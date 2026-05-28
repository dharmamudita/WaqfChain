'use client';

import { useState } from 'react';

interface MediaGalleryProps {
  mediaUrls: string[];
}

export default function MediaGallery({ mediaUrls }: MediaGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const images = mediaUrls.length > 0 ? mediaUrls : [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1541544741-207e8c12bc53?w=400&h=300&fit=crop',
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold font-heading text-gray-900 mb-4">Galeri Media</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className="relative h-32 rounded-xl overflow-hidden group"
            >
              <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedIdx(null)}>
          <img src={images[selectedIdx]} alt="" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-scaleIn" />
          <button onClick={() => setSelectedIdx(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
