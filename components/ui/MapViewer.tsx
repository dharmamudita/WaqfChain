'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Fix leaflet icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type?: string;
  address?: string;
  linkUrl?: string;
}

interface MapViewerProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function MapViewer({ markers, center, zoom, className = "h-[400px] w-full" }: MapViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400`}>
        Memuat peta...
      </div>
    );
  }

  // Calculate center based on markers if not provided
  let defaultCenter: L.LatLngExpression = [-2.5489, 118.0149]; // Center of Indonesia
  let defaultZoom = zoom || 5;

  if (center) {
    defaultCenter = [center.lat, center.lng];
  } else if (markers.length === 1) {
    defaultCenter = [markers[0].lat, markers[0].lng];
    defaultZoom = zoom || 14;
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0`}>
      <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={icon}>
            <Popup>
              <div className="text-sm font-sans min-w-[150px]">
                <h4 className="font-bold text-gray-900 mb-1">{marker.title}</h4>
                {marker.address && <p className="text-xs text-gray-500 mb-2 truncate max-w-[200px]">{marker.address}</p>}
                {marker.linkUrl && (
                  <Link href={marker.linkUrl} className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-block mt-1">
                    Lihat Proyek →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
