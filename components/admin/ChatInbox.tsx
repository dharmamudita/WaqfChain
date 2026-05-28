'use client';

import { useState, useEffect } from 'react';
import { getAllChats } from '@/lib/firestore';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatWindow from '@/components/chat/ChatWindow';
import type { Chat } from '@/types';

export default function ChatInbox() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { messages, loading: msgLoading, sendMessage } = useChat(selectedChat, user?.uid);

  useEffect(() => {
    getAllChats()
      .then(setChats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = (text: string) => {
    sendMessage(text, 'admin');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      {/* Chat List */}
      <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold font-heading text-gray-900">Inbox Chat</h3>
          <p className="text-xs text-gray-500">{chats.length} percakapan</p>
        </div>
        <div className="overflow-y-auto max-h-[calc(100%-60px)]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">Belum ada pesan</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => setSelectedChat(chat.chatId)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                  selectedChat === chat.chatId ? 'bg-teal-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {chat.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{chat.userName}</p>
                    {!chat.isRead && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2">
        {selectedChat && user ? (
          <ChatWindow
            messages={messages}
            currentUserId={user.uid}
            onSendMessage={handleSend}
            loading={msgLoading}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-500 font-medium">Pilih percakapan</p>
              <p className="text-gray-400 text-sm">untuk memulai chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
