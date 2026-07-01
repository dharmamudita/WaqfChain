'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin } from 'lucide-react';

// Fix leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  defaultLocation?: { lat: number; lng: number };
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition, onChange }: { 
  position: L.LatLng | null; 
  setPosition: (pos: L.LatLng) => void;
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

function MapController({ center }: { center: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ defaultLocation, onChange }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLocation ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) : null
  );
  
  const [flyToCenter, setFlyToCenter] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Default to center of Indonesia if no location provided
  const center = defaultLocation 
    ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) 
    : new L.LatLng(-2.5489, 118.0149);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=id`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const newPos = new L.LatLng(lat, lon);
    
    setPosition(newPos);
    setFlyToCenter(newPos);
    onChange(lat, lon);
    
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  if (!mounted) {
    return <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Memuat peta...</div>;
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-14 right-4 z-[1000] flex flex-col gap-1 max-w-sm">
        <div className="flex bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Cari kota, kecamatan, atau alamat..." 
            className="flex-1 px-4 py-3 text-sm focus:outline-none text-gray-900 bg-white"
          />
          <button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-3 bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-teal-50 transition-colors flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-700 leading-relaxed line-clamp-2">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer center={center} zoom={defaultLocation ? 13 : 5} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
        <MapController center={flyToCenter} />
      </MapContainer>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-xs font-medium text-gray-700 pointer-events-none">
        Klik di peta untuk sesuaikan titik presisi
      </div>
    </div>
  );
}
