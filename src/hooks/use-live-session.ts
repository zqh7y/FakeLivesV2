import { useEffect, useRef, useState } from 'react';

import { LiveEngine, type EngineConfig, type EngineListener, type EngineSnapshot } from '@/engine/live-engine';
import type { ChatEvent, LiveSummary } from '@/types';

const MAX_EVENTS = 80;

export type LiveHandlers = Pick<EngineListener, 'onLikeBurst' | 'onBigGift' | 'onToast'>;

/** Runs one live session for the lifetime of the component. */
export function useLiveSession(config: EngineConfig, handlers: LiveHandlers) {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [snapshot, setSnapshot] = useState<EngineSnapshot>({
    viewers: config.viewers,
    likes: 0,
    followers: 0,
    coins: 0,
    donations: 0,
    subs: 0,
    shares: 0,
    comments: 0,
    elapsedSec: 0,
  });
  const engineRef = useRef<LiveEngine | null>(null);
  const handlersRef = useRef(handlers);
  const summaryRef = useRef<LiveSummary | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const engine = new LiveEngine(config, {
      onEvent: (event) => setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS)),
      onSnapshot: setSnapshot,
      onLikeBurst: (n) => handlersRef.current.onLikeBurst(n),
      onBigGift: (e) => handlersRef.current.onBigGift(e),
      onToast: (e) => handlersRef.current.onToast(e),
    });
    engineRef.current = engine;
    engine.start();
    return () => {
      if (!summaryRef.current) summaryRef.current = engine.stop();
      engineRef.current = null;
    };
    // The session is configured once, when the screen mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    events,
    snapshot,
    sendHostComment: (text: string) => engineRef.current?.hostComment(text),
    hostSpeech: (text: string) => engineRef.current?.hostSpeech(text),
    addHostLike: () => engineRef.current?.hostLike(),
    end: (): LiveSummary | null => {
      if (!summaryRef.current && engineRef.current) summaryRef.current = engineRef.current.stop();
      return summaryRef.current;
    },
  };
}
