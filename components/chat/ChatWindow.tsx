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
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-heading text-sm">Admin WaqfChain</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-400">Memuat pesan...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-500 text-sm">Belum ada pesan.</p>
              <p className="text-gray-400 text-xs mt-1">Mulai percakapan dengan admin.</p>
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
