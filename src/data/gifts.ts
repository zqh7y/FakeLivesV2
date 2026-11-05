import type { Gift } from '@/types';
import { pick } from '@/utils/random';

export const Gifts: Gift[] = [
  { id: 'rose', name: 'Rose', emoji: '🌹', value: 1, tier: 1 },
  { id: 'heart', name: 'Heart', emoji: '❤️', value: 1, tier: 1 },
  { id: 'icecream', name: 'Ice Cream', emoji: '🍦', value: 1, tier: 1 },
  { id: 'fingerheart', name: 'Finger Heart', emoji: '🫰', value: 5, tier: 1 },
  { id: 'coffee', name: 'Coffee', emoji: '☕', value: 10, tier: 1 },
  { id: 'donut', name: 'Donut', emoji: '🍩', value: 30, tier: 1 },
  { id: 'star', name: 'Star', emoji: '⭐', value: 20, tier: 1 },
  { id: 'perfume', name: 'Perfume', emoji: '🌺', value: 20, tier: 2 },
  { id: 'cap', name: 'Cap', emoji: '🧢', value: 99, tier: 2 },
  { id: 'handhearts', name: 'Hand Hearts', emoji: '🫶', value: 100, tier: 2 },
  { id: 'confetti', name: 'Confetti', emoji: '🎉', value: 100, tier: 2 },
  { id: 'moneygun', name: 'Money Gun', emoji: '💸', value: 500, tier: 2 },
  { id: 'swan', name: 'Swan', emoji: '🦢', value: 699, tier: 3 },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', value: 1000, tier: 3 },
  { id: 'fireworks', name: 'Fireworks', emoji: '🎆', value: 1088, tier: 3 },
  { id: 'diamond', name: 'Diamond', emoji: '💎', value: 1500, tier: 3 },
  { id: 'yacht', name: 'Yacht', emoji: '🛥️', value: 9999, tier: 4 },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', value: 20000, tier: 4 },
  { id: 'castle', name: 'Castle', emoji: '🏰', value: 20000, tier: 4 },
  { id: 'lion', name: 'Lion', emoji: '🦁', value: 29999, tier: 4 },
  { id: 'universe', name: 'Universe', emoji: '🪐', value: 34999, tier: 4 },
];

export function giftOfTier(tier: Gift['tier']): Gift {
  return pick(Gifts.filter((g) => g.tier === tier));
}
