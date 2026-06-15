'use client';

import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-white/80 backdrop-blur-sm">
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          rows={1}
          disabled={disabled}
          className="flex-1 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white text-sm disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="p-3.5 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl text-white disabled:opacity-40 hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
