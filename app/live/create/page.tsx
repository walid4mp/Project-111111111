import FeaturePage from '@/app/components/layout/FeaturePage';

export default function CreateLivePage() {
  return (
    <FeaturePage
      title="Create Live Stream"
      subtitle="Set up a stream title, choose a category, confirm moderation settings, and complete device checks before going live."
      eyebrow="Creator Tools"
      statusText="Setup route active"
      primaryActionHref="/live"
      primaryActionLabel="Back to Live"
      secondaryActionHref="/settings"
      secondaryActionLabel="Open Settings"
      cards={[
        { title: 'Stream title', description: 'Give the room a clear title that explains what viewers should expect.' },
        { title: 'Category & tags', description: 'Select the game or topic and add short discovery tags.' },
        { title: 'Camera, mic, and moderation', description: 'Verify permissions, bitrate presets, and safety controls before broadcasting.' },
      ]}
    />
  );
}
