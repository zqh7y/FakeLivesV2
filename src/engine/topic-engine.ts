/**
 * Understands what the host said, offline: picks out keywords, guesses the topic and
 * writes a handful of replies the chat can post. No network, no model. Keyword matching only.
 */
import { PackComments } from '@/data/comments';
import type { PackKey } from '@/types';
import { chance, pick, shuffle } from '@/utils/random';

export type Intent =
  | 'greeting'
  | 'goodbye'
  | 'thanks'
  | 'askFollow'
  | 'askLike'
  | 'askShare'
  | 'askGift'
  | 'song'
  | 'viewers'
  | 'birthday'
  | 'tired'
  | 'hungry'
  | 'sad'
  | 'happy'
  | 'question'
  | 'number';

export interface SpeechAnalysis {
  keywords: string[];
  pack: PackKey | null;
  intents: Intent[];
  /** What the chat should say, in order. */
  replies: string[];
}

const STOPWORDS = new Set(
  (
    'a an the and or but so if then than that this these those i me my mine you your yours he she it its we us our they them their ' +
    'is am are was were be been being do does did doing have has had having will would can could should shall may might must ' +
    'to of in on at by for with about from up down out over under into onto as like just really very so too also only even ' +
    'not no yes yeah yep nah ok okay oh um uh hmm well right now today tonight here there what when where who why how which ' +
    'going gonna wanna gotta get got go went come came let lets know think thing things stuff kind sort guys guy everyone ' +
    'everybody people someone something anything nothing all some any more most much many lot lots bit little big new old ' +
    'good bad great nice cool fine sure maybe actually literally basically honestly because cause since while still again ' +
    'ever never always sometimes often back first last next one two three four five six seven eight nine ten hey hi hello ' +
    'chat stream live streaming say said says tell told talk talking look looking see seen watch watching'
  ).split(/\s+/),
);

const PACK_KEYWORDS: Partial<Record<PackKey, string[]>> = {
  gaming: ['game', 'games', 'gaming', 'play', 'playing', 'rank', 'ranked', 'kill', 'kills', 'win', 'won', 'lose', 'lost', 'match', 'fortnite', 'valorant', 'minecraft', 'roblox', 'warzone', 'controller', 'keyboard', 'clutch', 'noob', 'lobby', 'squad', 'duo', 'solo', 'level', 'boss', 'console', 'playstation', 'xbox', 'pc', 'fps', 'lag', 'ping'],
  music: ['song', 'songs', 'sing', 'singing', 'music', 'album', 'guitar', 'piano', 'beat', 'beats', 'spotify', 'playlist', 'concert', 'lyrics', 'rap', 'rapping', 'melody', 'vocals', 'cover', 'band', 'drums', 'bass', 'producer', 'studio'],
  food: ['eat', 'eating', 'food', 'pizza', 'hungry', 'recipe', 'dinner', 'lunch', 'breakfast', 'cook', 'cooking', 'kitchen', 'burger', 'sushi', 'pasta', 'chicken', 'cheese', 'snack', 'snacks', 'coffee', 'dessert', 'cake', 'taco', 'tacos', 'ramen', 'restaurant', 'sauce'],
  fitness: ['gym', 'workout', 'lift', 'lifting', 'run', 'running', 'protein', 'muscle', 'muscles', 'bench', 'squat', 'squats', 'cardio', 'reps', 'sets', 'abs', 'training', 'train', 'weights', 'deadlift', 'pushups', 'diet', 'bulk', 'cut'],
  beauty: ['makeup', 'hair', 'outfit', 'fit', 'skin', 'skincare', 'dress', 'shoes', 'nails', 'lipstick', 'lashes', 'brows', 'fashion', 'style', 'shopping', 'clothes', 'perfume', 'glow', 'routine', 'jacket', 'sneakers'],
  love: ['love', 'miss', 'heart', 'crush', 'boyfriend', 'girlfriend', 'relationship', 'date', 'dating', 'kiss', 'wedding', 'married', 'marry', 'valentine', 'cute', 'adorable'],
  hype: ['crazy', 'insane', 'fire', 'lit', 'hype', 'viral', 'famous', 'legend', 'epic', 'wild', 'unreal', 'amazing', 'awesome', 'incredible'],
};

const ECHO: string[] = [
  '{kw}??', 'wait {kw}?? 😭', '{kw} is crazy', 'talk more about {kw}', 'not the {kw} 💀', '{kw} mentioned 🔥',
  'did they just say {kw}', '{kw} gang where u at', 'ok {kw} 😭😭', 'the {kw} thing is so real', 'me when {kw}',
  '{kw}!!!', 'i love {kw}', '{kw} is everything', 'omg {kw}', 'say more about {kw}', '{kw} fr', 'the {kw} part 😭',
];

const YES_NO: string[] = ['yes!!', 'YES', 'no way', 'do it', 'DO IT', '1000%', 'nahh', 'yesss pls', 'nope lol', 'obviously', 'why not', 'absolutely', 'yes yes yes', 'pls do', 'no 😭', 'yes omg'];

const INTENT_REPLIES: Record<Intent, string[]> = {
  greeting: ['hiii', 'hi!!', 'hello 👋', 'heyyy', 'hi from brazil 🇧🇷', 'HI', 'omg hi', 'hey hey', 'hi bestie'],
  goodbye: ['noooo dont go', 'bye!! 😭', 'already??', 'stay a bit longer', 'bye bye 👋', 'see you next time!!', 'come back soon', 'dont end 😭'],
  thanks: ['ur welcome 🥹', 'anytime!!', 'we love you', 'no thank YOU', '🫶🫶', 'of course', 'ily'],
  askFollow: ['followed!!', 'done ✅', 'already following', 'followed 🫶', 'ok ok following', 'followed from 2 accounts lol'],
  askLike: ['liked ❤️', 'spamming likes rn', 'done!!', 'liking liking', '❤️❤️❤️❤️', 'likes on the way'],
  askShare: ['shared!!', 'sent it to my gc', 'sharing rn', 'sent to everyone i know', 'shared on my story'],
  askGift: ['sending one rn', 'gift incoming 🎁', 'im broke sorry 😭', 'sent!!', 'ok ok 🌹', 'take my money'],
  song: ['song name??', 'play it pls', 'what song is this', 'sing it!!', 'drop the playlist', 'this song 🎶'],
  viewers: ['so many people wow', 'we hit so many 😭', 'viral alert 🚨', 'the whole app is here', 'lets get even more', 'thats insane'],
  birthday: ['HAPPY BIRTHDAY 🎂', 'happy bday!!!', 'bday 🎉🎉', 'happy birthday omg', 'make a wish ✨'],
  tired: ['get some rest 😴', 'go sleep after this', 'rest up!!', 'same honestly', 'take care of yourself'],
  hungry: ['eat something!!', 'order pizza 🍕', 'im hungry too now', 'go eat pls', 'snack break'],
  sad: ['sending hugs 🤗', 'ur not alone', 'we are here for you', 'it gets better 💗', 'love you', 'stay strong'],
  happy: ['love to see it', 'we love happy you', 'the energy 🔥', 'yesss', 'deserved!!', '🥹🥹'],
  question: [],
  number: ['{n}??? insane', 'wait {n}', '{n} is crazy', '{n} 😭', 'did they say {n}'],
};

const INTENT_PATTERNS: [Intent, RegExp][] = [
  ['greeting', /\b(hi|hello|hey|what'?s up|good (morning|evening|afternoon)|welcome)\b/],
  ['goodbye', /\b(bye|goodbye|see you|gotta go|have to go|ending (the )?(live|stream)|end(ing)? soon|wrap(ping)? up|that'?s it for today)\b/],
  ['thanks', /\b(thank you|thanks|thank u|appreciate)\b/],
  ['askFollow', /\b(follow me|hit (the )?follow|follow (the )?(page|channel|account)|subscribe|smash (the )?(like|subscribe))\b/],
  ['askLike', /\b(like the|tap the (heart|screen)|double tap|send (some )?(likes|hearts)|like it|spam (the )?(likes|hearts))\b/],
  ['askShare', /\b(share (this|the|it|my)|share the (live|stream)|send this to)\b/],
  ['askGift', /\b(send (a )?(gift|gifts|rose|roses|donation|super ?chat|bits|stars)|donate|gift me)\b/],
  ['song', /\b(song|music|sing|playlist)\b/],
  ['viewers', /\b(viewers|people (are )?watching|watching right now|so many of you)\b/],
  ['birthday', /\b(birthday|bday)\b/],
  ['tired', /\b(tired|sleepy|exhausted|no sleep)\b/],
  ['hungry', /\b(hungry|starving|haven'?t eaten)\b/],
  ['sad', /\b(sad|depressed|crying|upset|rough (day|week)|bad day)\b/],
  ['happy', /\b(happy|excited|so good|best day|amazing day)\b/],
];

const QUESTION_START = /^(do|does|did|should|can|could|would|will|what|which|who|how|is|are|am|was|were|any|anyone|y'?all)\b/;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function extractKeywords(text: string, max = 3): string[] {
  const seen = new Set<string>();
  const words = tokenize(text).filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w) && !seen.has(w) && seen.add(w));
  // Longer words tend to be the interesting ones; keep the order they were said in among ties.
  return words
    .map((w, i) => ({ w, i, score: w.length + (i === 0 ? 0 : 0.1) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, max)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.w);
}

export function detectPack(text: string): PackKey | null {
  const words = new Set(tokenize(text));
  let best: PackKey | null = null;
  let bestHits = 0;
  for (const [pack, keys] of Object.entries(PACK_KEYWORDS) as [PackKey, string[]][]) {
    const hits = keys.reduce((n, k) => n + (words.has(k) ? 1 : 0), 0);
    if (hits > bestHits) {
      best = pack;
      bestHits = hits;
    }
  }
  return best;
}

export function detectIntents(text: string): Intent[] {
  const lower = text.toLowerCase().trim();
  const intents: Intent[] = [];
  for (const [intent, pattern] of INTENT_PATTERNS) if (pattern.test(lower)) intents.push(intent);
  if (/\?\s*$/.test(lower) || QUESTION_START.test(lower)) intents.push('question');
  if (/\b\d{2,}\b/.test(lower)) intents.push('number');
  return intents;
}

/** Turns one spoken sentence into replies for the chat. */
export function analyzeSpeech(text: string, hostName: string): SpeechAnalysis {
  const keywords = extractKeywords(text);
  const pack = detectPack(text);
  const intents = detectIntents(text);
  const replies: string[] = [];

  for (const intent of intents) {
    const pool = INTENT_REPLIES[intent];
    if (pool.length === 0) continue;
    const n = intent === 'greeting' || intent === 'goodbye' || intent === 'birthday' ? 2 : 1;
    const number = text.match(/\b(\d{2,})\b/)?.[1] ?? '';
    for (let i = 0; i < n; i++) replies.push(pick(pool).replace('{n}', number));
  }
  if (intents.includes('question')) replies.push(pick(YES_NO));
  if (chance(0.5) && intents.includes('question')) replies.push(pick(YES_NO));

  for (const kw of keywords.slice(0, 2)) replies.push(pick(ECHO).replace('{kw}', kw));
  if (pack) {
    replies.push(pick(PackComments[pack]));
    if (chance(0.6)) replies.push(pick(PackComments[pack]));
  }
  if (replies.length === 0) replies.push(pick(['real', 'facts', 'so true', 'lmaooo', 'wait what', 'say that again', 'fr fr', '😭😭', 'huh', 'ok and?', 'W take']));
  if (chance(0.25)) replies.push(pick(['they talk so well', 'the voice 😩', 'i could listen all day', `${hostName} talking is my asmr`, 'preach']));

  const unique = [...new Set(replies)];
  return { keywords, pack, intents, replies: shuffle(unique).slice(0, 7) };
}
