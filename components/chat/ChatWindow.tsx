'use client';

import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import type { Message } from '@/types';

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  loading?: boolean;
}

export default function ChatWindow({ messages, currentUserId, onSendMessage, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-heading text-sm">Admin WaqfChain</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-1 bg-gradient-to-b from-gray-50/30 to-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-4" />
              <p className="text-sm text-gray-400 font-medium">Memuat pesan...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-gray-50/80 rounded-3xl p-10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Belum ada pesan</p>
              <p className="text-gray-400 text-xs">Mulai percakapan dengan admin WaqfChain.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isOwnMessage={msg.senderId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}
