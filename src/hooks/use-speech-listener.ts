/**
 * Listens through the microphone and hands finished phrases to the caller.
 * Wraps expo-speech-recognition, loaded lazily so the app still runs where the native
 * module is missing (Expo Go, simulators without a recognizer): there, `supported` is false.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SpeechPackage = typeof import('expo-speech-recognition');

/** A pause this long after the last words means the sentence is over. */
const PHRASE_PAUSE_MS = 1400;
const MIN_PHRASE_CHARS = 3;
const RESTART_DELAY_MS = 400;

let cached: SpeechPackage | null | undefined;

function loadSpeech(): SpeechPackage | null {
  if (cached !== undefined) return cached;
  try {
    // Required lazily: the import itself throws where the native module is not built in.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-speech-recognition') as SpeechPackage;
  } catch {
    cached = null;
  }
  return cached;
}

export interface SpeechListenerOptions {
  /** Start listening as soon as the screen opens. */
  enabled: boolean;
  onPhrase: (text: string) => void;
  /** Called with a short reason when listening cannot start. */
  onUnavailable?: (reason: string) => void;
}

export interface SpeechListener {
  supported: boolean;
  listening: boolean;
  start: () => void;
  stop: () => void;
}

export function useSpeechListener({ enabled, onPhrase, onUnavailable }: SpeechListenerOptions): SpeechListener {
  const pkg = useMemo(() => loadSpeech(), []);
  const [listening, setListening] = useState(false);
  const wanted = useRef(false);
  const emittedChars = useRef(0);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef('');
  const callbacks = useRef({ onPhrase, onUnavailable });

  useEffect(() => {
    callbacks.current = { onPhrase, onUnavailable };
  });

  const flush = useCallback(() => {
    const text = latest.current;
    const delta = text.slice(emittedChars.current).trim();
    if (delta.length >= MIN_PHRASE_CHARS) callbacks.current.onPhrase(delta);
    emittedChars.current = text.length;
  }, []);

  const begin = useCallback(() => {
    if (!pkg) return;
    pkg.ExpoSpeechRecognitionModule.start({
      interimResults: true,
      continuous: true,
      maxAlternatives: 1,
      addsPunctuation: false,
    });
  }, [pkg]);

  const start = useCallback(() => {
    if (!pkg) {
      callbacks.current.onUnavailable?.('Voice needs a development build');
      return;
    }
    wanted.current = true;
    pkg.ExpoSpeechRecognitionModule.requestPermissionsAsync()
      .then((permission) => {
        if (!permission.granted) {
          wanted.current = false;
          callbacks.current.onUnavailable?.('Microphone permission needed');
          return;
        }
        begin();
      })
      .catch(() => {
        wanted.current = false;
        callbacks.current.onUnavailable?.('Voice is unavailable on this device');
      });
  }, [pkg, begin]);

  const stop = useCallback(() => {
    wanted.current = false;
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    try {
      pkg?.ExpoSpeechRecognitionModule.stop();
    } catch {
      // Already stopped.
    }
    setListening(false);
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    const M = pkg.ExpoSpeechRecognitionModule;
    const subs = [
      M.addListener('start', () => setListening(true)),
      M.addListener('end', () => {
        setListening(false);
        flush();
        latest.current = '';
        emittedChars.current = 0;
        if (wanted.current) setTimeout(() => wanted.current && begin(), RESTART_DELAY_MS);
      }),
      M.addListener('result', (event) => {
        const transcript = event.results[0]?.transcript ?? '';
        // A shorter transcript means the recognizer started a new segment.
        if (transcript.length < emittedChars.current) emittedChars.current = 0;
        latest.current = transcript;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        if (event.isFinal) flush();
        else pauseTimer.current = setTimeout(flush, PHRASE_PAUSE_MS);
      }),
      M.addListener('error', (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          wanted.current = false;
          setListening(false);
          callbacks.current.onUnavailable?.('Microphone permission needed');
        }
        // Everything else ("no-speech", "network") ends the session and the end handler restarts it.
      }),
    ];
    return () => {
      subs.forEach((s) => s.remove());
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      try {
        M.abort();
      } catch {
        // Nothing was running.
      }
    };
  }, [pkg, begin, flush]);

  useEffect(() => {
    if (enabled) start();
    return () => {
      wanted.current = false;
    };
  }, [enabled, start]);

  return { supported: !!pkg, listening, start, stop };
}
