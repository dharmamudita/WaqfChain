'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

export default function MapPicker({ defaultLocation, onChange }: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLocation ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) : null
  );

  // Default to center of Indonesia if no location provided
  const center = defaultLocation 
    ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) 
    : new L.LatLng(-2.5489, 118.0149);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Memuat peta...</div>;
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={center} zoom={defaultLocation ? 13 : 5} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
      </MapContainer>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-xs font-medium text-gray-700 pointer-events-none">
        Klik pada peta untuk memilih lokasi proyek
      </div>
    </div>
  );
}
