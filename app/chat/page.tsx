'use client';

import { chatRooms, currentUser } from '../data/mockData';
import { getTimeAgo } from '../lib/utils';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { MessageCircle, Search, Users } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-7 h-7 text-blue-500" />
              Messages
            </h1>
            <Button variant="primary" size="sm">
              <Users className="w-4 h-4 mr-1" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Chat Tabs */}
        <div className="flex gap-2">
          <button className="flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            All Chats
          </button>
          <button className="flex-1 px-6 py-3 rounded-xl font-medium bg-gray-800/50 text-gray-400 hover:text-white">
            Groups
          </button>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {chatRooms.map((room) => {
            const otherParticipant = room.participants.find((p) => p.id !== currentUser.id);
            return (
              <Link key={room.id} href={`/chat/${room.id}`}>
                <Card variant="premium" interactive className="cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar
                        src={otherParticipant?.avatar || ''}
                        size="lg"
                        vipLevel={otherParticipant?.vipLevel}
                        online={otherParticipant?.isOnline}
                      />
                      {room.unread > 0 && (
                        <Badge
                          variant="red"
                          size="sm"
                          className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center"
                        >
                          {room.unread}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{otherParticipant?.username}</h3>
                        {room.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(room.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {room.lastMessage?.content || 'Start a conversation'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* More Mock Chats */}
          {[
            {
              id: '2',
              username: 'ProGamer88',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer88',
              lastMessage: 'GG! That was an amazing game',
              time: '1h ago',
              online: true,
              vipLevel: 8,
              unread: 0,
            },
            {
              id: '3',
              username: 'StreamQueen',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StreamQueen',
              lastMessage: 'Thanks for the gift! 💖',
              time: '3h ago',
              online: false,
              vipLevel: 15,
              unread: 1,
            },
            {
              id: '4',
              username: 'ChessKing',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChessKing',
              lastMessage: 'Want to play another round?',
              time: '5h ago',
              online: true,
              vipLevel: 5,
              unread: 0,
            },
          ].map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <Card variant="premium" interactive className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={chat.avatar}
                      size="lg"
                      vipLevel={chat.vipLevel}
                      online={chat.online}
                    />
                    {chat.unread > 0 && (
                      <Badge
                        variant="red"
                        size="sm"
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center"
                      >
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold">{chat.username}</h3>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State (when no chats) */}
        {chatRooms.length === 0 && (
          <Card variant="glass" className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
            <p className="text-gray-400 mb-6">Start chatting with your friends and players</p>
            <Button variant="primary" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Find Friends
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
