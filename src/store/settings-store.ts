/** Persisted user settings: profile, audience, chat, look. The only place state is stored. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  AudienceSettings,
  ChatSettings,
  FilterKey,
  LanguageKey,
  LiveSummary,
  PackKey,
  PlatformKey,
  Profile,
} from '@/types';

export const MIN_VIEWERS = 10;
export const MAX_VIEWERS = 5_000_000;
export const MAX_CUSTOM_COMMENTS = 50;

export const defaultProfile: Profile = {
  displayName: '',
  username: '',
  bio: 'living my best life ✨',
  avatarUri: null,
  verified: true,
  autoStats: true,
  followers: 0,
  likes: 0,
  following: 233,
};

export const defaultAudience: AudienceSettings = {
  viewers: 12_400,
  growth: 'rising',
};

export const defaultChat: ChatSettings = {
  speed: 'normal',
  packs: ['hype', 'chat', 'questions', 'love'],
  languages: ['en'],
  joins: true,
  follows: true,
  gifts: true,
  shares: true,
  mentions: true,
  listen: false,
  customComments: [],
};

interface SettingsState {
  profile: Profile;
  audience: AudienceSettings;
  chat: ChatSettings;
  platform: PlatformKey;
  filter: FilterKey;
  mirrorFront: boolean;
  livesStarted: number;
  lastSummary: LiveSummary | null;
  hydrated: boolean;

  setProfile: (patch: Partial<Profile>) => void;
  setAudience: (patch: Partial<AudienceSettings>) => void;
  setChat: (patch: Partial<ChatSettings>) => void;
  togglePack: (key: PackKey) => void;
  toggleLanguage: (key: LanguageKey) => void;
  addCustomComment: (text: string) => void;
  removeCustomComment: (index: number) => void;
  setPlatform: (key: PlatformKey) => void;
  setFilter: (key: FilterKey) => void;
  setMirrorFront: (value: boolean) => void;
  recordLiveStarted: () => void;
  setLastSummary: (summary: LiveSummary | null) => void;
  setHydrated: (value: boolean) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      audience: defaultAudience,
      chat: defaultChat,
      platform: 'tiktok',
      filter: 'none',
      mirrorFront: true,
      livesStarted: 0,
      lastSummary: null,
      hydrated: false,

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setAudience: (patch) => set((s) => ({ audience: { ...s.audience, ...patch } })),
      setChat: (patch) => set((s) => ({ chat: { ...s.chat, ...patch } })),
      togglePack: (key) =>
        set((s) => {
          const has = s.chat.packs.includes(key);
          // Keep at least one pack selected so the chat never goes silent.
          if (has && s.chat.packs.length === 1) return s;
          const packs = has ? s.chat.packs.filter((p) => p !== key) : [...s.chat.packs, key];
          return { chat: { ...s.chat, packs } };
        }),
      toggleLanguage: (key) =>
        set((s) => {
          const has = s.chat.languages.includes(key);
          if (has && s.chat.languages.length === 1) return s;
          const languages = has
            ? s.chat.languages.filter((l) => l !== key)
            : [...s.chat.languages, key];
          return { chat: { ...s.chat, languages } };
        }),
      addCustomComment: (text) =>
        set((s) => {
          const trimmed = text.trim();
          if (!trimmed || s.chat.customComments.length >= MAX_CUSTOM_COMMENTS) return s;
          return { chat: { ...s.chat, customComments: [...s.chat.customComments, trimmed] } };
        }),
      removeCustomComment: (index) =>
        set((s) => ({
          chat: {
            ...s.chat,
            customComments: s.chat.customComments.filter((_, i) => i !== index),
          },
        })),
      setPlatform: (platform) => set({ platform }),
      setFilter: (filter) => set({ filter }),
      setMirrorFront: (mirrorFront) => set({ mirrorFront }),
      recordLiveStarted: () => set((s) => ({ livesStarted: s.livesStarted + 1 })),
      setLastSummary: (lastSummary) => set({ lastSummary }),
      setHydrated: (hydrated) => set({ hydrated }),
      resetAll: () =>
        set({
          profile: defaultProfile,
          audience: defaultAudience,
          chat: defaultChat,
          platform: 'tiktok',
          filter: 'none',
          mirrorFront: true,
        }),
    }),
    {
      name: 'fakelives.settings.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        profile: s.profile,
        audience: s.audience,
        chat: s.chat,
        platform: s.platform,
        filter: s.filter,
        mirrorFront: s.mirrorFront,
        livesStarted: s.livesStarted,
        lastSummary: s.lastSummary,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Followers/likes that look plausible for a given live viewer count. */
export function deriveStats(viewers: number): Pick<Profile, 'followers' | 'likes' | 'following'> {
  const v = Math.max(MIN_VIEWERS, viewers);
  const followers = Math.round(v * 38 + Math.sqrt(v) * 120);
  const likes = Math.round(followers * 14.2);
  return { followers, likes, following: 233 };
}

export function effectiveStats(profile: Profile, viewers: number) {
  return profile.autoStats
    ? deriveStats(viewers)
    : { followers: profile.followers, likes: profile.likes, following: profile.following };
}

export function displayNameOf(profile: Profile): string {
  return profile.displayName.trim() || profile.username.trim() || 'you';
}

export function usernameOf(profile: Profile): string {
  const raw = profile.username.trim() || profile.displayName.trim() || 'you';
  return raw.replace(/^@+/, '').replace(/\s+/g, '').toLowerCase();
}
