import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';

interface FeatureCardItem {
  title: string;
  description: string;
  badge?: string;
}

interface QuickLinkItem {
  label: string;
  href: string;
}

interface FeaturePageProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  statusText?: string;
  cards?: FeatureCardItem[];
  quickLinks?: QuickLinkItem[];
  primaryActionHref?: string;
  primaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
}

export default function FeaturePage({
  title,
  subtitle,
  eyebrow = 'WarHex',
  statusText = 'Ready for production wiring',
  cards = [],
  quickLinks = [],
  primaryActionHref = '/',
  primaryActionLabel = 'Back to Home',
  secondaryActionHref,
  secondaryActionLabel,
}: FeaturePageProps) {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Home
          </Link>
          <Badge variant="purple" size="sm">
            <Sparkles className="w-3 h-3 mr-1" />
            {statusText}
          </Badge>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <Card variant="premium">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">{eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{title}</h1>
            <p className="text-gray-300 max-w-2xl">{subtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={primaryActionHref}>
                <Button variant="primary">{primaryActionLabel}</Button>
              </Link>
              {secondaryActionHref && secondaryActionLabel ? (
                <Link href={secondaryActionHref}>
                  <Button variant="ghost">{secondaryActionLabel}</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </Card>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <Card key={card.title} variant="glass" className="h-full">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold">{card.title}</h2>
                  {card.badge ? <Badge variant="gold" size="sm">{card.badge}</Badge> : null}
                </div>
                <p className="text-sm text-gray-400 leading-6">{card.description}</p>
              </Card>
            ))}
          </div>
        ) : null}

        {quickLinks.length > 0 ? (
          <Card variant="glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Quick Links</h2>
              <Badge variant="emerald" size="sm">{quickLinks.length} items</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
