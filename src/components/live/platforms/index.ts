import * as facebook from '@/components/live/platforms/facebook';
import * as instagram from '@/components/live/platforms/instagram';
import * as tiktok from '@/components/live/platforms/tiktok';
import * as twitch from '@/components/live/platforms/twitch';
import type { PlatformUIParts } from '@/components/live/platforms/types';
import * as youtube from '@/components/live/platforms/youtube';
import type { PlatformKey } from '@/types';

export const PlatformUI: Record<PlatformKey, PlatformUIParts> = {
  tiktok: { TopBar: tiktok.TopBar, BottomBar: tiktok.BottomBar, ChatItem: tiktok.ChatItem },
  instagram: { TopBar: instagram.TopBar, BottomBar: instagram.BottomBar, ChatItem: instagram.ChatItem },
  youtube: { TopBar: youtube.TopBar, BottomBar: youtube.BottomBar, ChatItem: youtube.ChatItem },
  facebook: { TopBar: facebook.TopBar, BottomBar: facebook.BottomBar, ChatItem: facebook.ChatItem },
  twitch: { TopBar: twitch.TopBar, BottomBar: twitch.BottomBar, ChatItem: twitch.ChatItem },
};

export type { BottomBarProps, ChatItemProps, HostInfo, TopBarProps } from '@/components/live/platforms/types';
