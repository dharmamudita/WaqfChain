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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading text-gray-900">Chat dengan Admin</h1>
          <p className="text-sm text-gray-500">Tanyakan apapun tentang proyek wakaf kami</p>
        </div>
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
