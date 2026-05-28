import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50/50 overflow-auto">
        {children}
      </div>
    </div>
  );
}
