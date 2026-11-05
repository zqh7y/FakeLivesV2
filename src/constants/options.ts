/** Labelled choices shown in the setup screens. */
import type { ChatSpeed, GrowthMode } from '@/types';

export const ViewerPresets = [1_000, 5_000, 12_400, 50_000, 100_000, 500_000, 1_000_000];

export const GrowthOptions: { key: GrowthMode; label: string; emoji: string; hint: string }[] = [
  { key: 'steady', label: 'Steady', emoji: '〰️', hint: 'Hovers around your number' },
  { key: 'rising', label: 'Rising', emoji: '📈', hint: 'Climbs the whole time' },
  { key: 'viral', label: 'Viral', emoji: '🚀', hint: 'Explodes in the first minute' },
  { key: 'fading', label: 'Fading', emoji: '📉', hint: 'Slowly drifts down' },
];

export const SpeedOptions: { key: ChatSpeed; label: string; emoji: string }[] = [
  { key: 'chill', label: 'Chill', emoji: '🧊' },
  { key: 'normal', label: 'Normal', emoji: '💬' },
  { key: 'busy', label: 'Busy', emoji: '🔥' },
  { key: 'insane', label: 'Insane', emoji: '🌪️' },
];
