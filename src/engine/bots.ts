/** The crowd: a pool of bot users, regulars who post often and newcomers who drift in. */
import { generateAvatar } from '@/data/avatars';
import { CuratedUsernames, generateUsername } from '@/data/usernames';
import type { BotBadge, BotUser } from '@/types';
import { chance, pick, randFloat, shuffle, uid } from '@/utils/random';

const MAX_POOL = 420;

function rollBadge(): BotBadge | undefined {
  const r = Math.random();
  if (r < 0.03) return 'mod';
  if (r < 0.07) return 'top';
  if (r < 0.10) return 'vip';
  if (r < 0.24) return 'sub';
  return undefined;
}

function rollChattiness(): number {
  const r = Math.random();
  if (r < 0.7) return randFloat(0.05, 0.3);
  if (r < 0.95) return randFloat(0.3, 0.7);
  return randFloat(0.7, 1);
}

export function makeBot(name: string, overrides: Partial<BotUser> = {}): BotUser {
  return {
    id: uid('bot'),
    name,
    avatar: generateAvatar(name),
    badge: rollBadge(),
    chattiness: rollChattiness(),
    ...overrides,
  };
}

export class BotPool {
  private users: BotUser[] = [];
  private names = new Set<string>();
  private weights: number[] = [];

  constructor(size = 160) {
    const curated = shuffle(CuratedUsernames).slice(0, Math.floor(size * 0.6));
    for (const name of curated) this.add(makeBot(name));
    while (this.users.length < size) this.add(makeBot(this.uniqueGenerated()));
  }

  get size() {
    return this.users.length;
  }

  private uniqueGenerated(): string {
    for (let i = 0; i < 20; i++) {
      const candidate = generateUsername();
      if (!this.names.has(candidate)) return candidate;
    }
    return `${generateUsername()}${Math.floor(Math.random() * 1000)}`;
  }

  private add(user: BotUser) {
    if (this.names.has(user.name)) return;
    this.names.add(user.name);
    this.users.push(user);
    this.weights.push(user.chattiness);
    if (this.users.length > MAX_POOL) {
      // Evict the quietest early user so the pool stays bounded.
      let minIdx = 0;
      for (let i = 1; i < Math.min(60, this.users.length); i++) {
        if (this.weights[i] < this.weights[minIdx]) minIdx = i;
      }
      const [gone] = this.users.splice(minIdx, 1);
      this.weights.splice(minIdx, 1);
      this.names.delete(gone.name);
    }
  }

  /** Someone who just arrived: a fresh face, likely with no badge, who may chat a little. */
  newcomer(): BotUser {
    const user = makeBot(this.uniqueGenerated(), {
      badge: chance(0.08) ? 'sub' : undefined,
      chattiness: randFloat(0.05, 0.35),
    });
    this.add(user);
    return user;
  }

  /** A poster, weighted so regulars show up more often. */
  poster(): BotUser {
    const total = this.weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < this.users.length; i++) {
      r -= this.weights[i];
      if (r <= 0) return this.users[i];
    }
    return pick(this.users);
  }

  /** Any user, evenly. */
  anyone(): BotUser {
    return pick(this.users);
  }
}
