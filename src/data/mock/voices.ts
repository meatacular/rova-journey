import { Voice } from '@/lib/types';

export const voices: Voice[] = [
  { id: 'aroha', name: 'Aroha', description: 'Warm and friendly — like your favourite aunt giving you the morning rundown. Natural Kiwi accent with a touch of humour.', personality: 'warm', station: 'the-hits', avatar: '🎙️' },
  { id: 'tane', name: 'Tane', description: 'Smooth and authoritative — the voice you trust for news and traffic. Clear, confident delivery with a deep timbre.', personality: 'professional', station: 'newstalk-zb', avatar: '🎤' },
  { id: 'maia', name: 'Maia', description: 'Energetic and upbeat — brings the vibes to your morning commute. Young, fresh, and full of personality.', personality: 'energetic', station: 'the-edge', avatar: '🎧' },
  { id: 'rua', name: 'Rua', description: 'Calm and measured — perfect for when you want a chill start to the day. Soothing tones with a relaxed pace.', personality: 'calm', station: 'the-breeze', avatar: '🎵' },
  { id: 'kahu', name: 'Kahu', description: 'Witty and irreverent — adds a cheeky twist to every update. Think of a mate who happens to be a great storyteller.', personality: 'humorous', station: 'radio-hauraki', avatar: '📻' },
];
