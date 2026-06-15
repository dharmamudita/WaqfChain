'use client';

import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
  const { user, userData } = useAuth();
  const chatId = user?.uid || null;
  const { messages, loading, sendMessage } = useChat(chatId, user?.uid, userData?.name);

  const handleSend = (text: string) => {
    sendMessage(text, 'user');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 text-xs font-medium text-teal-200">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Online — Siap Membantu
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-2">
            Chat dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Admin</span>
          </h1>
          <p className="text-teal-200/80 text-sm">Tanyakan apapun tentang proyek wakaf kami. Kami siap membantu Anda.</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-10">
        <ChatWindow
          messages={messages}
          currentUserId={user.uid}
          onSendMessage={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
