/** Procedural avatars: a flat colour plus initials or an emoji, stable per name. */
import type { GeneratedAvatar } from '@/types';
import { hashString } from '@/utils/random';

export const AvatarColors: string[] = [
  '#E5484D', '#E54666', '#D6409F', '#AB4ABA', '#8E4EC6', '#6E56CF', '#5B5BD6', '#3E63DD',
  '#0090FF', '#00A2C7', '#12A594', '#30A46C', '#46A758', '#A18072', '#F76B15', '#FFC53D',
  '#E93D82', '#8DA4EF', '#3CB179', '#CE2C31',
];

export const AvatarEmoji = [
  '🌸', '🦋', '🔥', '⚡', '🌙', '⭐', '🍓', '🐺', '🦊', '🐸',
  '🌈', '💀', '👾', '🎮', '🎧', '🎸', '🌊', '🍕', '🧃', '🫧',
  '🪐', '🧸', '🍒', '🐼', '🦄', '👑', '💎', '🧿', '🌵', '🍄',
  '🦈', '🐉', '🎀', '🕶️', '🏀', '⚽', '🎯', '🧁', '🍉', '🥷',
];

const emojiRegex = /\p{Extended_Pictographic}/u;

export function initialsOf(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s_.]/gu, ' ')
    .split(/[\s_.]+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function generateAvatar(name: string, salt = 0): GeneratedAvatar {
  const h = hashString(name + ':' + salt);
  const color = AvatarColors[h % AvatarColors.length];
  const wantsEmoji = emojiRegex.test(name) || (h >>> 8) % 100 < 38;
  const emoji = wantsEmoji ? AvatarEmoji[(h >>> 16) % AvatarEmoji.length] : undefined;
  return { color, emoji, initials: initialsOf(name) };
}
