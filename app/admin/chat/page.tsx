import ChatInbox from '@/components/admin/ChatInbox';

export default function AdminChatPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold font-heading text-gray-900">Chat Inbox</h1>
        <p className="text-sm text-gray-500">Kelola percakapan dengan pengguna</p>
      </div>
      <ChatInbox />
    </div>
  );
}
