import ChatInbox from '@/components/admin/ChatInbox';

export default function AdminChatPage() {
  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 text-xs font-medium text-teal-200">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live Chat System
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading mb-2">
            Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Inbox</span>
          </h1>
          <p className="text-teal-200/80 text-sm">Kelola dan balas pertanyaan dari pengguna WaqfChain secara real-time</p>
        </div>
      </div>
      
      <ChatInbox />
    </div>
  );
}
