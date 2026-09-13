'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MessageCircle, Search, Users } from 'lucide-react';
import { chatRooms, currentUser } from '../data/mockData';
import { getTimeAgo } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'groups'>('all');

  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return chatRooms.filter((room) => {
      const matchesTab = activeTab === 'all' ? true : room.type === 'group';
      const participantNames = room.participants.map((participant) => participant.username).join(' ');
      const lastMessage = room.lastMessage?.content ?? '';
      const matchesSearch = !query || `${participantNames} ${lastMessage}`.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-7 h-7 text-blue-500" />
              Messages
            </h1>
            <Link href="/friends">
              <Button variant="primary" size="sm">
                <Users className="w-4 h-4 mr-1" />
                New Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`flex-1 px-6 py-3 rounded-xl font-medium ${activeTab === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('all')}
          >
            All Chats
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-xl font-medium ${activeTab === 'groups' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>

        <div className="space-y-3">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              const otherParticipant = room.participants.find((participant) => participant.id !== currentUser.id) ?? currentUser;

              return (
                <Link key={room.id} href={`/chat/${room.id}`}>
                  <Card variant="premium" interactive className="cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar
                          src={otherParticipant.avatar}
                          size="lg"
                          vipLevel={otherParticipant.vipLevel}
                          online={otherParticipant.isOnline}
                        />
                        {room.unread > 0 ? (
                          <Badge variant="red" size="sm" className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center">
                            {room.unread}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-3">
                          <h3 className="font-bold truncate">{otherParticipant.username}</h3>
                          {room.lastMessage ? (
                            <span className="text-xs text-gray-400 whitespace-nowrap">{getTimeAgo(room.lastMessage.timestamp)}</span>
                          ) : null}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{room.lastMessage?.content || 'Start a conversation'}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <Card variant="glass" className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">No conversations found</h3>
              <p className="text-gray-400 mb-6">Try another search term or switch tabs.</p>
              <Link href="/friends">
                <Button variant="primary" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Find Friends
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
