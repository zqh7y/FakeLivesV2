/** The five live looks. Each is drawn with its own colour; the rest of the app keeps the accent. */
import type { Ionicons } from '@expo/vector-icons';

import type { PlatformKey } from '@/types';

export interface PlatformMeta {
  key: PlatformKey;
  name: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  /** The platform's signature colour: buttons, hearts, highlights. */
  color: string;
  soft: string;
  /** The LIVE tag colour. */
  live: string;
  placeholder: string;
  followerNoun: string;
  /** What money is called there. */
  moneyNoun: string;
  /** Whether likes float up as hearts (or reactions). */
  hearts: boolean;
}

export const Platforms: Record<PlatformKey, PlatformMeta> = {
  tiktok: {
    key: 'tiktok',
    name: 'TikTok',
    icon: 'logo-tiktok',
    color: '#FE2C55',
    soft: 'rgba(254,44,85,0.2)',
    live: '#FE2C55',
    placeholder: 'Say something...',
    followerNoun: 'followers',
    moneyNoun: 'coins',
    hearts: true,
  },
  instagram: {
    key: 'instagram',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: '#E1306C',
    soft: 'rgba(225,48,108,0.22)',
    live: '#ED4956',
    placeholder: 'Comment...',
    followerNoun: 'followers',
    moneyNoun: 'badges',
    hearts: true,
  },
  youtube: {
    key: 'youtube',
    name: 'YouTube',
    icon: 'logo-youtube',
    color: '#FF0000',
    soft: 'rgba(255,0,0,0.2)',
    live: '#FF0000',
    placeholder: 'Say something...',
    followerNoun: 'subscribers',
    moneyNoun: 'Super Chat',
    hearts: true,
  },
  facebook: {
    key: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    soft: 'rgba(24,119,242,0.22)',
    live: '#FA383E',
    placeholder: 'Write a comment...',
    followerNoun: 'followers',
    moneyNoun: 'Stars',
    hearts: true,
  },
  twitch: {
    key: 'twitch',
    name: 'Twitch',
    icon: 'logo-twitch',
    color: '#9146FF',
    soft: 'rgba(145,70,255,0.22)',
    live: '#EB0400',
    placeholder: 'Send a message',
    followerNoun: 'followers',
    moneyNoun: 'Bits',
    hearts: false,
  },
};

export const PlatformOrder: PlatformKey[] = ['tiktok', 'instagram', 'youtube', 'facebook', 'twitch'];

/** Twitch's default username colours. */
export const TwitchNameColors = [
  '#FF4D4D', '#5C9DFF', '#2ECC71', '#E8505B', '#FF7F50', '#9ACD32', '#FF4500', '#3CB371',
  '#DAA520', '#D2691E', '#5F9EA0', '#1E90FF', '#FF69B4', '#9B5DE5', '#00FA9A',
];

/** YouTube Super Chat tiers, by dollar amount. */
export function superChatTier(amount: number): { bg: string; fg: string } {
  if (amount >= 100) return { bg: '#E62117', fg: '#FFFFFF' };
  if (amount >= 50) return { bg: '#E91E63', fg: '#FFFFFF' };
  if (amount >= 20) return { bg: '#F57C00', fg: '#FFFFFF' };
  if (amount >= 10) return { bg: '#FFCA28', fg: '#000000' };
  if (amount >= 5) return { bg: '#1DE9B6', fg: '#000000' };
  if (amount >= 2) return { bg: '#00E5FF', fg: '#000000' };
  return { bg: '#1E88E5', fg: '#FFFFFF' };
}

export const FacebookReactions = ['👍', '❤️', '😆', '😮', '🥰', '😢'];

export function formatMoney(amount: number): string {
  return amount >= 100 || Number.isInteger(amount) ? `$${Math.round(amount)}` : `$${amount.toFixed(2)}`;
}
