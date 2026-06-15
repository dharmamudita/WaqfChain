import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const time = message.createdAt?.toDate
    ? message.createdAt.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isOwnMessage && (
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto mb-1 shadow-sm flex-shrink-0">
          A
        </div>
      )}
      <div
        className={`max-w-[70%] px-4 py-3 ${
          isOwnMessage
            ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl rounded-br-lg shadow-lg shadow-teal-500/15'
            : 'bg-white text-gray-800 rounded-2xl rounded-bl-lg border border-gray-100 shadow-sm'
        }`}
      >
        {!isOwnMessage && (
          <p className="text-[11px] font-bold text-teal-600 mb-0.5">
            {message.senderRole === 'admin' ? 'Admin' : 'Anda'}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1.5 ${isOwnMessage ? 'text-teal-200/80' : 'text-gray-400'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
