import Link from 'next/link';
import { TrendingUp } from 'lucide-react'; // Or a custom SVG logo

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <TrendingUp className="h-8 w-8" />
      <span className="text-2xl font-headline font-semibold">MemeTrade Pro</span>
    </Link>
  );
}
