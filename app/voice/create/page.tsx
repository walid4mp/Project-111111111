import FeaturePage from '@/app/components/layout/FeaturePage';

export default function CreateVoiceRoomPage() {
  return (
    <FeaturePage
      title="Create Voice Room"
      subtitle="Prepare the room name, choose seat capacity, set privacy rules, and confirm microphone permissions before opening the room."
      eyebrow="Creator Tools"
      statusText="Setup route active"
      primaryActionHref="/voice"
      primaryActionLabel="Back to Voice Rooms"
      secondaryActionHref="/settings"
      secondaryActionLabel="Open Settings"
      cards={[
        { title: 'Room identity', description: 'Configure a room title, theme, and short description.' },
        { title: 'Access controls', description: 'Decide whether the room is public, invite-only, or password protected.' },
        { title: 'Speaker management', description: 'Define seat count, co-host permissions, and moderation rules.' },
      ]}
    />
  );
}
