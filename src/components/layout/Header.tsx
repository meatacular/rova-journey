'use client';

import { UserCircle, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStartJourney } from '@/lib/hooks/useStartJourney';
import { useJourney } from '@/lib/stores/journey';

export function Header() {
  const pathname = usePathname();
  const { handleStartJourney } = useStartJourney();
  const { isActive, isPlaying, pauseJourney, resumeJourney } = useJourney();

  const headerLabel = pathname === '/journey' ? 'journeys' : 'rova';

  const handleClick = () => {
    if (isActive && isPlaying) {
      pauseJourney();
    } else if (isActive && !isPlaying) {
      resumeJourney();
    } else {
      handleStartJourney();
    }
  };

  const buttonLabel = 'Your Journey';

  const ButtonIcon = isActive && isPlaying ? Pause : Play;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/rova-logo.png" alt="rova" width={28} height={28} />
          <span className="text-xl font-bold tracking-tight text-foreground">{headerLabel}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleClick}
            size="sm"
            className="h-8 rounded-full text-xs font-semibold"
          >
            <ButtonIcon className="mr-1 h-3 w-3" />
            {buttonLabel}
          </Button>
          <Link
            href="/preferences"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <UserCircle className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
