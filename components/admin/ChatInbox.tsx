'use client';

import { useState, useEffect } from 'react';
import { getAllChats } from '@/lib/firestore';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import ChatWindow from '@/components/chat/ChatWindow';
import { Mailbox, MessageCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
      {/* Chat List */}
      <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold font-heading text-gray-900 text-lg">Inbox Chat</h3>
              <p className="text-xs text-gray-500 font-medium">{chats.length} percakapan aktif</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-3"><Mailbox size={32} /></div>
              <p className="text-gray-500 font-medium text-sm">Inbox Kosong</p>
              <p className="text-gray-400 text-xs mt-1">Belum ada pesan dari pengguna.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chats.map((chat) => (
                <button
                  key={chat.chatId}
                  onClick={() => setSelectedChat(chat.chatId)}
                  className={`w-full flex items-center gap-4 p-5 transition-all text-left ${
                    selectedChat === chat.chatId 
                      ? 'bg-teal-50/80 border-l-4 border-l-teal-500' 
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-extrabold flex-shrink-0 shadow-sm transition-transform ${
                    selectedChat === chat.chatId ? 'bg-gradient-to-br from-teal-500 to-teal-700 scale-105 shadow-teal-500/25' : 'bg-gradient-to-br from-gray-300 to-gray-400'
                  }`}>
                    {chat.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-bold truncate ${selectedChat === chat.chatId ? 'text-teal-900' : 'text-gray-900'}`}>
                        {chat.userName}
                      </p>
                      {!chat.isRead && (
                        <span className="flex w-2.5 h-2.5 bg-amber-500 rounded-full shadow-sm shadow-amber-500/50" />
                      )}
                    </div>
                    <p className={`text-xs truncate ${selectedChat === chat.chatId ? 'text-teal-700/80 font-medium' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2 flex flex-col h-full">
        {selectedChat && user ? (
          <ChatWindow
            messages={messages}
            currentUserId={user.uid}
            onSendMessage={handleSend}
            loading={msgLoading}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-premium">
            <div className="text-center bg-gray-50/50 p-12 rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm text-teal-600">
                <MessageCircle size={40} className="opacity-80" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">Pilih Percakapan</h3>
              <p className="text-gray-500 text-sm max-w-[200px] mx-auto">Klik salah satu pengguna di panel kiri untuk mulai membalas pesan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
