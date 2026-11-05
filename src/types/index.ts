/** Shared domain types for FakeLives. */

export type GrowthMode = 'steady' | 'rising' | 'viral' | 'fading';
export type ChatSpeed = 'chill' | 'normal' | 'busy' | 'insane';
export type FilterKey = 'none' | 'warm' | 'cool' | 'rose' | 'dusk' | 'noir';
export type PlatformKey = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'twitch';

export type PackKey =
  | 'hype'
  | 'chat'
  | 'gaming'
  | 'music'
  | 'beauty'
  | 'fitness'
  | 'food'
  | 'questions'
  | 'trolls'
  | 'love';

export type LanguageKey = 'en' | 'es' | 'pt' | 'ru' | 'tr' | 'de' | 'fr' | 'ar' | 'hi' | 'id';

export type BotBadge = 'mod' | 'top' | 'sub' | 'vip' | 'new';

export interface GeneratedAvatar {
  /** Flat background colour. */
  color: string;
  /** Emoji shown instead of initials, when present. */
  emoji?: string;
  initials: string;
}

export interface BotUser {
  id: string;
  name: string;
  avatar: GeneratedAvatar;
  badge?: BotBadge;
  /** 0..1, how likely this user is to post again (regulars post more). */
  chattiness: number;
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  /** Coin value shown in the chat. */
  value: number;
  /** 1 = tiny sticker, 4 = full-screen event. */
  tier: 1 | 2 | 3 | 4;
}

export type ChatEventKind =
  | 'comment'
  | 'join'
  | 'follow'
  | 'gift'
  | 'donation'
  | 'subscribe'
  | 'share'
  | 'host'
  | 'system';

export interface ChatEvent {
  id: string;
  kind: ChatEventKind;
  user: BotUser;
  text: string;
  gift?: Gift;
  /** Gift combos: how many were sent. Donations: badges, Stars or Bits. Subscriptions: gifted subs. */
  count?: number;
  /** Donations: the amount in dollars. */
  amount?: number;
  /** Epoch ms. */
  at: number;
}

export interface Profile {
  displayName: string;
  username: string;
  bio: string;
  avatarUri: string | null;
  verified: boolean;
  /** When true, followers/likes/following are derived from the viewer count. */
  autoStats: boolean;
  followers: number;
  likes: number;
  following: number;
}

export interface AudienceSettings {
  viewers: number;
  growth: GrowthMode;
}

export interface ChatSettings {
  speed: ChatSpeed;
  packs: PackKey[];
  languages: LanguageKey[];
  joins: boolean;
  follows: boolean;
  gifts: boolean;
  shares: boolean;
  mentions: boolean;
  /** Listen through the microphone and let the chat react to what the host says. */
  listen: boolean;
  customComments: string[];
}

export interface LiveSummary {
  durationSec: number;
  peakViewers: number;
  avgViewers: number;
  totalComments: number;
  newFollowers: number;
  likes: number;
  /** TikTok gift coins. */
  coins: number;
  /** Donations in dollars (Super Chats, Stars, Bits, badges). */
  donations: number;
  /** Subscriptions and memberships. */
  subs: number;
  shares: number;
  topFans: { user: BotUser; coins: number; donations: number; comments: number }[];
  endedAt: number;
}
