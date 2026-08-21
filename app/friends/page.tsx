'use client';

import { useWarHexData } from '@/app/data/runtime';
import FeaturePage from '@/app/components/layout/FeaturePage';


export default function FriendsPage() {
  const { chatRooms, currentUser } = useWarHexData();
  const friendCards = chatRooms.flatMap((room) => room.participants.filter((participant) => participant.id !== currentUser.id).map((participant) => ({ title: participant.username, description: `Level ${participant.level} • VIP ${participant.vipLevel} • Ready to queue for the next match or chat session.`, badge: participant.isOnline ? 'Online' : 'Away' })));
  return (
    <FeaturePage
      title="Friends"
      subtitle="Every friend-related CTA now opens a usable destination with fast navigation back into chat, live rooms, and gameplay."
      eyebrow="Social Hub"
      statusText="Party flow restored"
      primaryActionHref="/chat"
      primaryActionLabel="Open Chat"
      secondaryActionHref="/profile"
      secondaryActionLabel="Back to Profile"
      cards={friendCards}
      quickLinks={[
        { label: 'Followers', href: '/followers' },
        { label: 'Following', href: '/following' },
        { label: 'Games', href: '/games' },
        { label: 'Home', href: '/' },
      ]}
    />
  );
}
