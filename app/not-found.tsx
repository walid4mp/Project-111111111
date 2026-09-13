import Link from 'next/link';
import { Compass, Home } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-24">
      <Card variant="premium" className="max-w-xl w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto mb-6 flex items-center justify-center">
          <Compass className="w-10 h-10 text-white" />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80 mb-3">404</p>
        <h1 className="text-3xl font-bold mb-3 gradient-text">Page not found</h1>
        <p className="text-gray-300 mb-8">
          The destination you requested does not exist, has moved, or is not available in this build.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="ghost">Browse Games</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
