import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, Sparkles } from 'lucide-react';
import { gifts } from '@/app/data/mockData';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export function generateStaticParams() {
  return gifts.map((gift) => ({ id: gift.id }));
}

export default async function SendGiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = gifts.find((item) => item.id === id);

  if (!gift) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <Card variant="premium" className="text-center">
          <div className="text-7xl mb-4">{gift.image}</div>
          <h1 className="text-3xl font-bold mb-2">Send {gift.name}</h1>
          <p className="text-gray-400 mb-4">This route replaces the broken gift CTA with a valid destination.</p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="gold" size="md">{gift.price} gems</Badge>
            <Badge variant={gift.rarity === 'vip' ? 'vip' : gift.rarity === 'legendary' ? 'red' : gift.rarity === 'epic' ? 'gold' : gift.rarity === 'rare' ? 'purple' : 'default'} size="md" className="capitalize">{gift.rarity}</Badge>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h2 className="font-bold text-lg">Gift summary</h2>
          </div>
          <p className="text-sm text-gray-300 leading-7">
            Real gifting still requires recipient selection, gem balance validation, transaction persistence, inventory deduction, and notification delivery.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/gifts">
            <Button variant="ghost">Back to Gifts</Button>
          </Link>
          <Link href="/chat">
            <Button variant="primary">
              <MessageCircle className="w-4 h-4 mr-2" />
              Choose Recipient
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
