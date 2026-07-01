import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 bg-gray-50/50 overflow-auto w-full">
        {children}
      </div>
    </div>
  );
}
