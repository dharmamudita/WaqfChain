import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({ children, className = '', hover = false, padding = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${
        hover ? 'hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5' : ''
      } ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-gray-900 font-heading ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-gray-50 ${className}`}>{children}</div>;
}
