'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RadioPlayerProps {
  streamUrl: string;
  stationColor: string;
  isPlaying: boolean;
}

export function RadioPlayer({ streamUrl, stationColor, isPlaying }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hlsRef = useRef<any>(null);
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    const initStream = async () => {
      // Check if browser supports HLS natively (Safari)
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = streamUrl;
        setLoaded(true);
      } else {
        // Use HLS.js for Chrome/Firefox
        try {
          const Hls = (await import('hls.js')).default;
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setLoaded(true);
            });
            hls.on(Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                setError(true);
              }
            });
            hlsRef.current = hls;
          } else {
            setError(true);
          }
        } catch {
          setError(true);
        }
      }
    };

    initStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !loaded) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay blocked - user needs to interact
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, loaded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
    }
  }, [muted]);

  return (
    <div className="flex flex-col items-center gap-4">
      <audio ref={audioRef} />

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: stationColor }} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stationColor }} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: stationColor }}>
          Live
        </span>
      </div>

      {error && (
        <p className="text-xs text-muted-foreground">Stream unavailable — showing preview</p>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={() => setMuted(!muted)}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
