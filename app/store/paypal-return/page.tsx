'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export default function PayPalReturnPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your payment…');

  useEffect(() => {
    const orderId = params.get('token');
    if (!orderId) {
      setStatus('error');
      setMessage('No PayPal payment was found.');
      return;
    }
    fetch('/api/payments/paypal/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Payment could not be confirmed.');
        setStatus('success');
        setMessage(data.alreadyCaptured ? 'This payment was already confirmed.' : `Payment confirmed. ${data.item} has been added to your account.`);
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Payment confirmation failed.');
      });
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-24">
      <Card variant={status === 'success' ? 'glow' : 'premium'} className="max-w-md w-full text-center p-8">
        <div className="text-5xl mb-4">{status === 'loading' ? '⏳' : status === 'success' ? '✅' : '⚠️'}</div>
        <h1 className="text-2xl font-bold mb-3">{status === 'loading' ? 'Processing payment' : status === 'success' ? 'Payment successful' : 'Payment problem'}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        {status !== 'loading' && <Button variant="gold" fullWidth onClick={() => router.push('/store')}>Back to Store</Button>}
      </Card>
    </div>
  );
}
