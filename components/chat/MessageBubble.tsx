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
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwnMessage
            ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-teal-600 mb-0.5">
            {message.senderRole === 'admin' ? 'Admin' : 'Anda'}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1 ${isOwnMessage ? 'text-teal-200' : 'text-gray-400'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
