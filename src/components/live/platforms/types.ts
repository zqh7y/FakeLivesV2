import type { ComponentType } from 'react';

import type { PlatformMeta } from '@/constants/platforms';
import type { ChatEvent } from '@/types';

export interface HostInfo {
  name: string;
  username: string;
  avatarUri: string | null;
  verified: boolean;
}

export interface TopBarProps {
  platform: PlatformMeta;
  host: HostInfo;
  likes: number;
  viewers: number;
  followers: number;
  elapsedSec: number;
  onPressHost: () => void;
  onPressClose: () => void;
}

export interface BottomBarProps {
  platform: PlatformMeta;
  onSend: (text: string) => void;
  onLike: () => void;
  onGift: () => void;
  onShare: () => void;
}

export interface ChatItemProps {
  platform: PlatformMeta;
  event: ChatEvent;
  host: HostInfo;
}

/** What each platform look provides. The rest of the live screen is shared. */
export interface PlatformUIParts {
  TopBar: ComponentType<TopBarProps>;
  BottomBar: ComponentType<BottomBarProps>;
  ChatItem: ComponentType<ChatItemProps>;
}
