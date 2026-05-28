'use client';

import { useState, useEffect, useCallback } from 'react';
import { subscribeToMessages, sendMessage as sendMsg, createChat, getChat } from '@/lib/firestore';
import type { Message } from '@/types';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function useChat(chatId: string | null, userId?: string, userName?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = useCallback(
    async (text: string, senderRole: 'user' | 'admin') => {
      if (!chatId || !userId) return;

      try {
        // Ensure chat document exists
        const existingChat = await getChat(chatId);
        if (!existingChat) {
          await createChat({
            chatId,
            userId,
            userName: userName || 'Pengguna',
            lastMessage: text,
            isRead: false,
          });
        }

        await sendMsg(chatId, {
          messageId: '',
          senderId: userId,
          senderRole,
          text,
        });
      } catch (error: any) {
        console.error('Failed to send message:', error);
        toast.error('Gagal mengirim pesan: ' + (error.message || 'Error tidak diketahui'));
      }
    },
    [chatId, userId, userName]
  );

  return { messages, loading, sendMessage };
}
