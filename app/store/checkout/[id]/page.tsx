import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CreditCard, Gift, ShieldCheck } from 'lucide-react';
import { storeItems } from '@/app/data/mockData';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { formatCurrency } from '@/app/lib/utils';

export function generateStaticParams() {
  return storeItems.map((item) => ({ id: item.id }));
}

export default async function StoreCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = storeItems.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        <Card variant="premium">
          <div className="text-center">
            <div className="text-7xl mb-4">{item.image}</div>
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <p className="text-gray-400 mb-4">Checkout route connected for this offer.</p>
            <Badge variant={item.featured ? 'gold' : 'purple'} size="md">{formatCurrency(item.price)}</Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="glass" className="text-center p-5">
            <Gift className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Base value</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <CreditCard className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(item.price)}</p>
            <p className="text-sm text-gray-400">Price</p>
          </Card>
          <Card variant="glass" className="text-center p-5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">Secure</p>
            <p className="text-sm text-gray-400">Payment flow placeholder</p>
          </Card>
        </div>

        <Card variant="glass">
          <p className="text-sm text-gray-300 leading-7">
            This route replaces dead purchase CTAs with a valid checkout destination. Completing real payment capture still requires a payment provider, secure server-side order creation, and inventory fulfillment logic.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/store">
            <Button variant="ghost">Back to Store</Button>
          </Link>
          <Button variant="gold" disabled>
            Complete Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
