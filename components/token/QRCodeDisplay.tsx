'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 120 }: QRCodeDisplayProps) {
  return (
    <div className="inline-block p-3 bg-white rounded-xl shadow-inner border border-gray-200">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#0F6E56"
        level="M"
        includeMargin={false}
      />
    </div>
  );
}
