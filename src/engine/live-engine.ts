/**
 * The live simulation. Drives viewers, chat, likes, gifts, follows and shares on timers,
 * and reports back through a listener. Pure TypeScript, no React.
 */
import {
  DonationMessages,
  EarlyComments,
  EmojiSpam,
  FollowTemplates,
  GiftSubTemplates,
  HostReactions,
  JoinTemplates,
  LanguageComments,
  MentionTemplates,
  MilestoneTemplates,
  PackComments,
  ShareTemplates,
  TwitchSubTemplates,
  YouTubeMemberTemplates,
  fillTemplate,
} from '@/data/comments';
import { giftOfTier } from '@/data/gifts';
import { BotPool, makeBot } from '@/engine/bots';
import { analyzeSpeech } from '@/engine/topic-engine';
import type {
  BotUser,
  ChatEvent,
  ChatSpeed,
  Gift,
  GrowthMode,
  LanguageKey,
  LiveSummary,
  PackKey,
  PlatformKey,
} from '@/types';
import { formatCompact } from '@/utils/format';
import { chance, pick, pickWeighted, randFloat, randInt, uid } from '@/utils/random';

export interface EngineConfig {
  platform: PlatformKey;
  viewers: number;
  growth: GrowthMode;
  speed: ChatSpeed;
  packs: PackKey[];
  languages: LanguageKey[];
  joins: boolean;
  follows: boolean;
  gifts: boolean;
  shares: boolean;
  mentions: boolean;
  customComments: string[];
  hostName: string;
}

export interface EngineSnapshot {
  viewers: number;
  likes: number;
  followers: number;
  coins: number;
  donations: number;
  subs: number;
  shares: number;
  comments: number;
  elapsedSec: number;
}

export interface EngineListener {
  onEvent: (event: ChatEvent) => void;
  onSnapshot: (snapshot: EngineSnapshot) => void;
  /** Spawn this many floating hearts. */
  onLikeBurst: (count: number) => void;
  /** A tier 3 or 4 gift, a large donation or a pile of gift subs: show the big overlay. */
  onBigGift: (event: ChatEvent) => void;
  /** A follow or share worth a toast. */
  onToast: (event: ChatEvent) => void;
}

const MIN_VIEWERS = 10;
const MILESTONES = [1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000];

const SPEED_INTERVAL: Record<ChatSpeed, number> = { chill: 2600, normal: 1300, busy: 650, insane: 300 };
const SPEED_FACTOR: Record<ChatSpeed, number> = { chill: 0.7, normal: 1, busy: 1.35, insane: 1.7 };
const PACK_WEIGHT: Partial<Record<PackKey, number>> = { hype: 1.3, chat: 1.3, love: 1.2, trolls: 0.55 };

const EXTRA_EMOJI = ['🔥', '😭', '💀', '❤️', '😂', '✨', '👀', '🫶', '🥹', '💯'];
const BIG_MONEY_REACTIONS = ['WOAH', 'the donation 😭', 'rich rich', 'W donor', 'thank them!!', 'omg 😭😭', 'no way 💸', 'say thank you lol', 'W chat'];
const DONATION_AMOUNTS = [1, 2, 3, 5, 10, 20, 50, 100, 200, 500];
const DONATION_WEIGHTS = [18, 14, 10, 22, 12, 10, 6, 4, 1.5, 0.5];

export class LiveEngine {
  private readonly pool = new BotPool(160);
  private readonly host: BotUser;
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private running = false;
  private startedAt = 0;
  private viewers: number;
  private readonly baseViewers: number;
  private readonly viralPeak: number;
  private peak: number;
  private viewerSamples = 0;
  private viewerSum = 0;
  private surge = 0;
  private likes = 0;
  private likeRemainder = 0;
  private followers = 0;
  private hiddenFollowers = 0;
  private coins = 0;
  private donations = 0;
  private subs = 0;
  private shares = 0;
  private comments = 0;
  private readonly fans = new Map<string, { user: BotUser; coins: number; donations: number; comments: number }>();
  private readonly milestonesHit = new Set<number>();
  private readonly recentTexts: string[] = [];
  /** What the host was just talking about; steers the chat for a while. */
  private topic: { pack: PackKey | null; keywords: string[]; until: number } = { pack: null, keywords: [], until: 0 };

  constructor(
    private readonly config: EngineConfig,
    private readonly listener: EngineListener,
  ) {
    this.viewers = Math.max(MIN_VIEWERS, config.viewers);
    this.baseViewers = this.viewers;
    this.peak = this.viewers;
    this.viralPeak = randFloat(4, 9);
    this.host = makeBot(config.hostName || 'you', { id: 'host', badge: undefined, chattiness: 0 });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startedAt = Date.now();
    this.every(1000, () => this.tickViewers());
    this.every(700, () => this.tickLikes());
    this.every(500, () => this.emitSnapshot());
    this.loop(() => this.commentInterval(), () => this.postComment());
    if (this.config.joins) this.loop(() => this.joinInterval(), () => this.postJoin());
    if (this.config.follows) this.loop(() => randFloat(5000, 18000) / this.crowdFactor(), () => this.postFollow());
    if (this.config.shares) this.loop(() => randFloat(25000, 70000) / this.crowdFactor(), () => this.postShare());
    if (this.config.gifts) {
      const { platform } = this.config;
      if (platform === 'tiktok') this.loop(() => randFloat(8000, 20000) / this.crowdFactor(), () => this.postGift());
      else this.loop(() => randFloat(12000, 32000) / this.crowdFactor(), () => this.postDonation());
      if (platform === 'twitch') this.loop(() => randFloat(20000, 55000) / this.crowdFactor(), () => this.postSubscribe());
      if (platform === 'youtube') this.loop(() => randFloat(30000, 80000) / this.crowdFactor(), () => this.postSubscribe());
    }
    // A warm welcome so the chat is never empty on arrival.
    this.after(300, () => this.postComment());
    this.after(900, () => this.postComment());
    if (this.config.joins) this.after(500, () => this.postJoin());
  }

  stop(): LiveSummary {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    const durationSec = Math.round((Date.now() - this.startedAt) / 1000);
    const worth = (f: { coins: number; donations: number }) => f.coins + f.donations * 100;
    const topFans = [...this.fans.values()]
      .sort((a, b) => worth(b) - worth(a) || b.comments - a.comments)
      .slice(0, 5);
    return {
      durationSec,
      peakViewers: Math.round(this.peak),
      avgViewers: this.viewerSamples ? Math.round(this.viewerSum / this.viewerSamples) : Math.round(this.viewers),
      totalComments: this.comments,
      newFollowers: this.followers + Math.round(this.hiddenFollowers),
      likes: Math.round(this.likes),
      coins: this.coins,
      donations: Math.round(this.donations * 100) / 100,
      subs: this.subs,
      shares: this.shares,
      topFans,
      endedAt: Date.now(),
    };
  }

  /** The host typed something: show it, then let the chat react. */
  hostComment(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.emit({ id: uid('ev'), kind: 'host', user: this.host, text: trimmed, at: Date.now() });
    const reactions = randInt(2, 5);
    for (let i = 0; i < reactions; i++) {
      this.after(randFloat(700, 3600), () => this.postText(pick(HostReactions), this.pool.poster()));
    }
    this.likeRemainder += randFloat(6, 14);
  }

  /** The host tapped the heart. */
  hostLike() {
    this.likes += 1;
  }

  /** The host said something out loud: the chat answers and stays on that topic for a while. */
  hostSpeech(transcript: string) {
    const text = transcript.trim();
    if (text.length < 2) return;
    const analysis = analyzeSpeech(text, this.config.hostName);
    this.topic = { pack: analysis.pack, keywords: analysis.keywords, until: Date.now() + 45_000 };
    analysis.replies.forEach((reply, i) => {
      this.after(900 + i * randFloat(700, 1600), () => this.postText(reply, this.pool.poster()));
    });
    this.likeRemainder += randFloat(4, 12);
    if (analysis.intents.includes('askFollow') && this.config.follows) {
      for (let i = 0; i < randInt(2, 4); i++) this.after(randFloat(1500, 6000), () => this.postFollow());
    }
    if (analysis.intents.includes('askShare') && this.config.shares) this.after(randFloat(2000, 5000), () => this.postShare());
    if (analysis.intents.includes('askGift') && this.config.gifts) {
      this.after(randFloat(2000, 6000), () => (this.config.platform === 'tiktok' ? this.postGift() : this.postDonation()));
    }
    if (analysis.intents.includes('askLike')) this.likeRemainder += randFloat(30, 80);
    if (analysis.intents.includes('goodbye')) this.likeRemainder += 20;
  }

  get elapsedSec() {
    return (Date.now() - this.startedAt) / 1000;
  }

  // ---- timers -------------------------------------------------------------

  private every(ms: number, fn: () => void) {
    const run = () => {
      if (!this.running) return;
      fn();
      this.after(ms, run);
    };
    this.after(ms, run);
  }

  private loop(interval: () => number, fn: () => void) {
    const run = () => {
      if (!this.running) return;
      fn();
      this.after(interval(), run);
    };
    this.after(interval(), run);
  }

  private after(ms: number, fn: () => void) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      if (this.running) fn();
    }, ms);
    this.timers.add(t);
  }

  // ---- viewers ------------------------------------------------------------

  /** >1 when the room is big: more of everything happens. */
  private crowdFactor() {
    return 1 + Math.log10(Math.max(10, this.viewers)) / 4;
  }

  private tickViewers() {
    const t = this.elapsedSec;
    let v = this.viewers;
    switch (this.config.growth) {
      case 'steady':
        v += (this.baseViewers - v) * 0.02 + v * gauss() * 0.004;
        break;
      case 'rising':
        v *= 1 + randFloat(0.0006, 0.0035);
        v = Math.min(v, this.baseViewers * 8);
        break;
      case 'viral': {
        const target = this.baseViewers * (1 + (this.viralPeak - 1) / (1 + Math.exp(-(t - 55) / 13)));
        v += (target - v) * 0.08 + v * gauss() * 0.006;
        if (t > 120 && chance(0.02)) this.surge = Math.max(this.surge, randFloat(0.04, 0.15));
        break;
      }
      case 'fading':
        v *= 1 - randFloat(0.0004, 0.0028);
        v = Math.max(v, this.baseViewers * 0.2);
        break;
    }
    if (chance(0.006)) this.surge = Math.max(this.surge, randFloat(0.03, 0.12));
    if (chance(0.004)) v *= 1 - randFloat(0.015, 0.05);
    if (this.surge > 0.002) {
      const step = this.surge * 0.3;
      v *= 1 + step;
      this.surge -= step;
    } else {
      this.surge = 0;
    }
    v *= 1 + gauss() * 0.003;
    v = Math.max(MIN_VIEWERS, v);

    this.viewers = v;
    this.peak = Math.max(this.peak, v);
    this.viewerSamples += 1;
    this.viewerSum += v;
    this.hiddenFollowers += v * 0.00025;
    this.checkMilestones(v);
  }

  private checkMilestones(v: number) {
    for (const m of MILESTONES) {
      if (m > this.baseViewers * 1.05 && v >= m && !this.milestonesHit.has(m)) {
        this.milestonesHit.add(m);
        const n = randInt(2, 4);
        for (let i = 0; i < n; i++) {
          this.after(randFloat(200, 3000), () =>
            this.postText(fillTemplate(pick(MilestoneTemplates), { count: formatCompact(m) }), this.pool.poster()),
          );
        }
        this.likeRemainder += 20;
      }
    }
  }

  // ---- likes --------------------------------------------------------------

  private tickLikes() {
    const gain = this.viewers * randFloat(0.003, 0.011) * SPEED_FACTOR[this.config.speed] + this.likeRemainder;
    this.likeRemainder = 0;
    this.likes += gain;
    const hearts = Math.min(8, Math.max(1, Math.round(Math.log10(this.viewers + 1) * randFloat(0.3, 1.3))));
    this.listener.onLikeBurst(hearts);
  }

  private emitSnapshot() {
    this.listener.onSnapshot({
      viewers: Math.round(this.viewers),
      likes: Math.round(this.likes),
      followers: this.followers + Math.round(this.hiddenFollowers),
      coins: this.coins,
      donations: Math.round(this.donations * 100) / 100,
      subs: this.subs,
      shares: this.shares,
      comments: this.comments,
      elapsedSec: Math.floor(this.elapsedSec),
    });
  }

  // ---- chat ---------------------------------------------------------------

  private commentInterval() {
    const base = SPEED_INTERVAL[this.config.speed];
    const crowd = this.viewers < 1000 ? 1.25 : this.viewers < 20000 ? 1 : this.viewers < 200000 ? 0.85 : 0.7;
    return base * crowd * randFloat(0.55, 1.45);
  }

  private joinInterval() {
    const base = this.config.speed === 'chill' ? 6000 : this.config.speed === 'normal' ? 4200 : 7000;
    return base * randFloat(0.6, 1.5);
  }

  private postComment() {
    const user = this.pool.poster();
    const text = this.pickCommentText();
    this.postText(text, user);

    // Copycat waves: short hype gets echoed.
    if (text.length <= 4 && chance(0.25)) {
      const n = randInt(2, 4);
      for (let i = 0; i < n; i++) this.after(randFloat(250, 1600), () => this.postText(text, this.pool.poster()));
    }
    // Bursts: a flurry of unrelated comments.
    if (chance(0.07)) {
      const n = randInt(3, 6);
      for (let i = 0; i < n; i++) {
        this.after(160 * (i + 1) + randFloat(0, 120), () => this.postText(this.pickCommentText(), this.pool.poster()));
      }
    }
  }

  private pickCommentText(): string {
    for (let attempt = 0; attempt < 4; attempt++) {
      const text = this.rawCommentText();
      if (!this.recentTexts.includes(text) || attempt === 3) {
        this.recentTexts.push(text);
        if (this.recentTexts.length > 14) this.recentTexts.shift();
        return this.decorate(text);
      }
    }
    return this.decorate(pick(EmojiSpam));
  }

  private rawCommentText(): string {
    const { customComments, mentions, hostName, languages, packs } = this.config;
    if (this.elapsedSec < 25 && chance(0.5)) return pick(EarlyComments);
    if (mentions && hostName && chance(0.12)) return fillTemplate(pick(MentionTemplates), { name: hostName });
    if (customComments.length && chance(Math.min(0.35, 0.08 + customComments.length * 0.02))) return pick(customComments);
    if (chance(0.08)) return pick(EmojiSpam);
    if (this.topic.until > Date.now()) {
      if (this.topic.keywords.length && chance(0.12)) return `${pick(this.topic.keywords)} ${pick(['😭', 'fr', '!!', '🔥', '??', 'lol'])}`;
      if (this.topic.pack && chance(0.4)) return pick(PackComments[this.topic.pack]);
    }

    const langs = languages.length ? languages : ['en' as LanguageKey];
    const weights = langs.map((l) => (l === 'en' ? 1 : langs.includes('en') ? 0.35 : 1));
    const lang = pickWeighted(langs, weights);
    if (lang !== 'en') return pick(LanguageComments[lang]);

    const keys = packs.length ? packs : (['chat'] as PackKey[]);
    const pack = pickWeighted(keys, keys.map((k) => PACK_WEIGHT[k] ?? 1));
    return pick(PackComments[pack]);
  }

  private decorate(text: string): string {
    if (chance(0.07)) return text + ' ' + pick(EXTRA_EMOJI);
    if (chance(0.04) && text.length < 24 && /[a-z]/.test(text)) return text.toUpperCase();
    if (chance(0.04) && /[a-z]$/.test(text)) return text + text.slice(-1).repeat(randInt(2, 4));
    return text;
  }

  private postText(text: string, user: BotUser) {
    this.comments += 1;
    this.fan(user).comments += 1;
    this.emit({ id: uid('ev'), kind: 'comment', user, text, at: Date.now() });
  }

  private postJoin() {
    const user = this.pool.newcomer();
    this.emit({ id: uid('ev'), kind: 'join', user, text: fillTemplate(pick(JoinTemplates), { name: user.name }), at: Date.now() });
    // Newcomers sometimes say hi.
    if (chance(0.3)) this.after(randFloat(1500, 6000), () => this.postText(pick(EarlyComments), user));
  }

  private postFollow() {
    const user = this.pool.anyone();
    this.followers += 1;
    const event: ChatEvent = {
      id: uid('ev'),
      kind: 'follow',
      user,
      text: fillTemplate(pick(FollowTemplates), { name: user.name }),
      at: Date.now(),
    };
    this.emit(event);
    if (chance(0.5)) this.listener.onToast(event);
  }

  private postShare() {
    const user = this.pool.anyone();
    this.shares += 1;
    const event: ChatEvent = {
      id: uid('ev'),
      kind: 'share',
      user,
      text: fillTemplate(pick(ShareTemplates), { name: user.name }),
      at: Date.now(),
    };
    this.emit(event);
    this.listener.onToast(event);
    this.surge = Math.max(this.surge, randFloat(0.01, 0.04));
  }

  private postGift() {
    const big = this.viewers >= 5000;
    const tier = pickWeighted([1, 2, 3, 4] as const, [70, 20, big ? 8 : 5, big ? 2.5 : 0.6]);
    const gift: Gift = giftOfTier(tier);
    const count = tier === 1 ? pickWeighted([1, 2, 3, 5, 10, 20, 50], [40, 20, 15, 10, 8, 5, 2]) : tier === 2 ? randInt(1, 5) : tier === 3 ? randInt(1, 2) : 1;
    const user = tier >= 3 ? this.pool.poster() : this.pool.anyone();
    const value = gift.value * count;
    this.coins += value;
    this.fan(user).coins += value;
    const event: ChatEvent = {
      id: uid('ev'),
      kind: 'gift',
      user,
      gift,
      count,
      text: `sent ${gift.name}`,
      at: Date.now(),
    };
    this.emit(event);
    if (tier >= 3) {
      this.listener.onBigGift(event);
      this.likeRemainder += 30;
      this.cheer(['WOAH', 'the gift 😭', 'rich rich', 'W gifter', 'thank them!!', 'omg 😭😭', 'no way 💎', 'say thank you lol']);
    }
  }

  /** A Super Chat, Stars, Bits, badges or a plain donation, depending on the platform. */
  private postDonation() {
    const { platform, hostName } = this.config;
    const big = this.viewers >= 5000;
    const weights = DONATION_WEIGHTS.map((w, i) => (i >= 7 && !big ? w * 0.25 : w));
    let amount = pickWeighted(DONATION_AMOUNTS, weights);
    let count: number | undefined;
    if (platform === 'instagram') {
      count = pickWeighted([1, 2, 3], [60, 28, 12]);
      amount = [0.99, 1.99, 4.99][count - 1];
    } else if (platform === 'facebook') {
      count = amount * 100; // Stars
    } else if (platform === 'twitch' && chance(0.55)) {
      count = amount * 100; // Bits
    }
    const user = amount >= 20 ? this.pool.poster() : this.pool.anyone();
    const message = platform === 'instagram' ? '' : chance(0.7) ? fillTemplate(pick(DonationMessages), { name: hostName }) : '';
    this.donations += amount;
    this.fan(user).donations += amount;
    const event: ChatEvent = { id: uid('ev'), kind: 'donation', user, text: message, amount, count, at: Date.now() };
    this.emit(event);
    if (amount >= 20) {
      this.likeRemainder += amount >= 50 ? 30 : 12;
      if (amount >= 50) this.listener.onBigGift(event);
      this.cheer(BIG_MONEY_REACTIONS);
    }
  }

  /** Twitch subs and gift subs, YouTube memberships. */
  private postSubscribe() {
    const { platform } = this.config;
    const user = this.pool.poster();
    const gifted = chance(0.3);
    const n = gifted ? pickWeighted([1, 5, 10, 20, 50], [40, 30, 18, 9, 3]) : 1;
    const months = randInt(2, 36);
    const template = gifted
      ? pick(platform === 'youtube' ? [YouTubeMemberTemplates[1]] : GiftSubTemplates)
      : pick(platform === 'youtube' ? [YouTubeMemberTemplates[0], YouTubeMemberTemplates[2]] : TwitchSubTemplates);
    this.subs += n;
    this.fan(user).donations += n * 4.99;
    const event: ChatEvent = {
      id: uid('ev'),
      kind: 'subscribe',
      user,
      text: fillTemplate(template, { n: String(n), months: String(months) }),
      count: n,
      at: Date.now(),
    };
    this.emit(event);
    if (n >= 10) {
      this.listener.onBigGift(event);
      this.likeRemainder += 25;
      this.cheer(['GIFTED SUBS 😭', 'W gifter', 'thank you!!', 'pog', 'LETS GOOO', 'rich rich']);
    } else if (chance(0.4)) {
      this.cheer(['welcome!!', 'W sub', 'pog', 'welcome to the fam 💜', 'lets gooo']);
    }
  }

  private cheer(lines: string[]) {
    const n = randInt(2, 5);
    for (let i = 0; i < n; i++) {
      this.after(randFloat(600, 3500), () => this.postText(pick(lines), this.pool.poster()));
    }
  }

  private fan(user: BotUser) {
    let f = this.fans.get(user.id);
    if (!f) {
      f = { user, coins: 0, donations: 0, comments: 0 };
      this.fans.set(user.id, f);
    }
    return f;
  }

  private emit(event: ChatEvent) {
    this.listener.onEvent(event);
  }
}

/** Approximately normal noise in about -1..1. */
function gauss(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}
