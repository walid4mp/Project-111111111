import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import { chatRooms, currentUser } from '@/app/data/mockData';
import Avatar from '@/app/components/ui/Avatar';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { getTimeAgo } from '@/app/lib/utils';

export function generateStaticParams() {
  return chatRooms.map((room) => ({ id: room.id }));
}

export default async function ChatDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = chatRooms.find((item) => item.id === id);

  if (!room) {
    notFound();
  }

  const otherParticipant = room.participants.find((participant) => participant.id !== currentUser.id) ?? currentUser;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <Card variant="premium">
          <div className="flex items-center gap-4">
            <Avatar src={otherParticipant.avatar} size="xl" vipLevel={otherParticipant.vipLevel} online={otherParticipant.isOnline} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold truncate">{otherParticipant.username}</h1>
                {room.unread > 0 ? (
                  <Badge variant="red" size="sm">{room.unread} unread</Badge>
                ) : null}
              </div>
              <p className="text-sm text-gray-400">Direct conversation</p>
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="space-y-4">
            {room.lastMessage ? (
              <>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-3 text-sm text-white shadow-lg">
                    Welcome back to the thread.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/8 px-4 py-3 text-sm text-gray-100 border border-white/10">
                    {room.lastMessage.content}
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Last activity {getTimeAgo(room.lastMessage.timestamp)}</p>
              </>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h2 className="font-bold text-lg mb-2">No messages yet</h2>
                <p className="text-sm text-gray-400">Start the conversation from this screen.</p>
              </div>
            )}
          </div>
        </Card>

        <Card variant="premium">
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value="Composer wiring requires a real backend or websocket service."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-300"
            />
            <Button variant="primary" aria-label="Send message" disabled>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <Link href="/chat">
          <Button variant="ghost">Back to Messages</Button>
        </Link>
      </div>
    </div>
  );
}
