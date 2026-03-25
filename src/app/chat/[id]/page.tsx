'use client';
import ChatView from '@/components/chat/ChatView';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  return <ChatView params={params} />;
}
