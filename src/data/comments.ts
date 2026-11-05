/**
 * Everything the bots can say. Grouped by topic pack, language and situation.
 * `{name}` is replaced with the host's name, `{count}` with a viewer count.
 */
import type { LanguageKey, PackKey } from '@/types';

export interface PackMeta {
  key: PackKey;
  name: string;
  emoji: string;
  description: string;
}

export const Packs: PackMeta[] = [
  { key: 'hype', name: 'Hype', emoji: '🔥', description: 'W stream, LETS GOOO, sheesh' },
  { key: 'chat', name: 'Just chatting', emoji: '💬', description: 'hellos, where from, small talk' },
  { key: 'love', name: 'Fans', emoji: '💗', description: 'ily, ur my fav, protect at all costs' },
  { key: 'questions', name: 'Questions', emoji: '❓', description: 'how old, insta?, are you single' },
  { key: 'gaming', name: 'Gaming', emoji: '🎮', description: 'clutch, settings, 1v1 me' },
  { key: 'music', name: 'Music', emoji: '🎶', description: 'song name?, sing more, chills' },
  { key: 'beauty', name: 'Beauty & fits', emoji: '💄', description: 'skincare, outfit links, grwm' },
  { key: 'fitness', name: 'Fitness', emoji: '💪', description: 'reps, split, form check' },
  { key: 'food', name: 'Food', emoji: '🍜', description: 'recipe pls, im hungry, rate it' },
  { key: 'trolls', name: 'Trolls', emoji: '😈', description: 'L, mid, fake viewers 💀' },
];

export const PackComments: Record<PackKey, string[]> = {
  hype: [
    '🔥🔥🔥', 'LETS GOOO', 'W stream', 'this is insane', 'GOATED', 'no way 😭', 'SHEEEESH', 'W',
    'W W W', 'ate that', 'cooked 🔥', 'u ate and left no crumbs', 'slay', 'so real for this',
    'this is so fire', 'the drip 🔥', 'aura +1000', 'big W', 'certified banger', 'ICONIC',
    'we love to see it', 'best live rn', 'ur so cool omg', 'legendary', 'unmatched', 'the goat 🐐',
    '😭😭😭 no way', 'this is peak', 'crazy work', 'ok this is lit', 'hype hype hype', 'YOOOO',
    'nahh this is crazy', 'chat we eating good tonight', 'never seen anything like this',
    'main character energy', 'rizz level 100', '10/10 no notes', 'instant follow', 'this made my day',
    'W energy', 'HELLO??? 😭', 'this is going viral', 'the comeback is real', 'absolute cinema',
  ],
  chat: [
    'hiii', 'hello from the uk 🇬🇧', 'hi from brazil 🇧🇷', 'greetings from germany 🇩🇪',
    'watching from canada 🇨🇦', 'hey everyone', 'hows everyone doing', 'whats good', 'sup',
    'finally caught a live', 'been waiting all day for this', 'first time here, love it already',
    'just got home', 'eating dinner while watching', 'its 3am here lol', 'cant sleep so im here',
    'lmaooo', 'lol', 'lmfao', '😂😂😂', '💀💀', '💀', 'fr', 'facts', 'real', 'same', 'mood',
    'literally me', 'wait what', 'huh', 'whats happening', 'i just joined what did i miss',
    'someone catch me up', 'can you say hi to me', 'shoutout pls 🙏', 'my sister says hi',
    'my mom is watching too lol', 'my dog is watching with me 🐶', 'turn up the volume',
    'the lighting is so good', 'where did you get that shirt', 'what camera is this',
    'the quality is crazy', 'this is my comfort stream', 'stay hydrated 💧', 'drink some water',
    'dont forget to eat', 'ok im hooked', 'brb getting snacks', 'back 🍿', 'hi from australia 🇦🇺',
    'watching from the bus lol', 'at work pretending to work', 'hi from the philippines 🇵🇭',
    'what did i miss', 'love the energy today', 'this is so chill', 'how long are you live for',
  ],
  gaming: [
    'whats your sens', 'what are your settings', '1v1 me', 'drop ur gamertag',
    'that clutch was insane', 'no scope pls', 'ur cracked', 'aimbot?? 👀', 'built different',
    'GG', 'ggs', 'ez clap', 'rush b', 'whats ur rank', 'are you radiant', 'diff', 'skill issue 💀',
    "he's lagging", 'ping check', 'what keyboard', 'what mouse', 'add me pls', 'can i join',
    'lets run duos', 'play with viewers', 'whats ur kd', 'that was a 200 iq play', 'clip that',
    'someone clip it', 'CLIP IT', 'that was cinema', 'mods pin this', 'touch grass lol', 'ratio',
    'nerf this guy', 'what fps are you getting', 'controller or kbm', 'whats ur main',
  ],
  music: [
    'sing something', 'voice is angelic', 'your voice omg 😍', 'drop the song name',
    'whats this song', 'song??', 'spotify when', 'release this pls', 'ur voice is so smooth',
    'play guitar', 'one more song', 'encore encore', 'can you do a cover', 'sing my fav song pls',
    'chills', 'goosebumps fr', 'that high note 😭', 'vocals on point', 'the vibes 🎶',
    'this is my new fav song', 'harmonize pls', 'freestyle', 'beatbox 😭', 'producer tag goes hard',
    'this beat is crazy', 'where can i listen', 'soundcloud link?', 'ur gonna be famous',
    'need this on repeat', 'ARIANA WHO', 'grammy incoming', 'the runs 😭', 'acoustic version pls',
  ],
  beauty: [
    'whats that lipstick', 'skincare routine pls', 'glowing ✨', 'ur skin is flawless',
    'whats ur foundation shade', 'tutorial pls', 'how do you do your brows', 'lashes 😍',
    'that blush is everything', 'hair routine??', 'what hair products', 'ur hair is so healthy',
    'nails are so cute', 'where is the top from', 'outfit details pls', 'link the dress',
    'that jacket omg', 'ur style is immaculate', 'the fit is fire', 'face card never declines',
    'you look so pretty today', 'glow up is real', 'whats ur perfume', 'ur so beautiful omg',
    'the makeup is serving', 'do a grwm', 'get ready with us', 'eyeliner tutorial pls',
    'ur so gorgeous', 'the lipgloss 💋', 'that necklace 😍', 'shoes??', 'clean girl aesthetic fr',
  ],
  fitness: [
    "what's ur workout split", 'how many reps', 'form check 👀', 'protein intake?',
    'ur gains are insane', 'leg day when', 'do pushups', '100 pushups challenge',
    'whats ur max bench', 'ur so strong', 'gym motivation fr', 'what pre workout', 'creatine?',
    'shredded 🔥', 'the arms omg', 'ur abs are crazy', 'how long u been training', 'beast mode',
    'no days off', 'lets gooo one more rep', 'i need to go gym after this', 'fitness goals',
    'whats ur diet', 'do you do cardio', 'flex pls', 'show us the back', 'inspo fr', 'lock in 🔒',
    'what shoes for lifting', 'how much do you weigh', 'bulk or cut rn',
  ],
  food: [
    'what are you making', 'recipe pls', 'that looks so good 🤤', 'im hungry now', 'im drooling',
    'send me some', 'is it spicy', 'add more cheese', 'the sizzle 😩', 'chef mode',
    'gordon ramsay who', 'rate it 1-10', 'whats the sauce', 'how long do you cook it',
    'can i come over', 'mukbang pls', 'eat it on cam', 'try it with hot sauce',
    'i tried this recipe and it was 🔥', 'make dessert next', 'make pasta', 'cook for me pls',
    'ur kitchen is so nice', 'the plating omg', 'michelin star fr', 'needs more salt lol', 'yum',
    '5 stars ⭐⭐⭐⭐⭐', 'crunch check', 'what seasoning is that', 'ok chef 👨‍🍳',
  ],
  questions: [
    'how old are you', 'where are you from', 'whats ur name', 'ig?', 'whats ur insta', 'snap?',
    'do you have tiktok', 'are you single 👀', 'boyfriend?', 'girlfriend?', 'whats ur fav color',
    'whats ur fav food', 'fav movie?', 'cats or dogs', 'whats ur zodiac', 'how tall are you',
    'what time is it there', 'how long have you been streaming', 'when did you start',
    'how did you get so many viewers', 'are you famous', 'whats ur dream', 'whats ur job',
    'do you go to school', 'what language do you speak', 'can you speak spanish',
    'do you play fortnite', 'whats ur phone', 'iphone or android', 'do you have a discord',
    'whats ur fav song', 'where do you live', 'marry me?', 'when is the next live',
    'how often do you stream', 'do you read the chat', 'can you see me', 'do you remember me',
    'whats ur favorite country', 'whats ur mbti', 'what do you do for fun', 'coffee or tea',
  ],
  trolls: [
    'FIRST', 'first 🤓', 'second', 'L', 'L stream', 'mid', 'ok and?', 'nobody asked', 'ratio + L',
    'fake viewers 💀', 'these are bots', 'the viewers are fake', 'this is staged', 'touch grass',
    'go outside', 'cringe', 'ur mic is bad', 'boring', 'i could do better', 'copy', 'copied',
    'my 5yo cousin is better', 'why am i here', 'STOP SPAMMING', 'mods ban him', 'who let him cook',
    "bro thinks he's him", 'nah', 'nuh uh', "that's crazy", 'caught in 4k 📸', '💀💀💀 bro', '😐',
    'this is a wholesome stream chat please be nice', 'why is everyone spamming', 'bot check 🤖',
    'STOP TF SPAMMING!!!!!1', 'how did he get so many viewers huh',
  ],
  love: [
    'i love you', 'ily 💕', 'ur my fav streamer', 'ur so sweet', 'marry me', 'ur literally perfect',
    'my heart 😭', 'protect this person at all costs', 'ur so wholesome', 'we love you',
    'i would die for you', 'ur so kind', 'the best 💗', 'sending love from texas', 'sending hugs 🤗',
    'ur so underrated', 'ur gonna make it', 'proud of you', 'keep going',
    'dont let anyone bring you down', 'you deserve the world', 'ur smile 🥹', 'cutie', 'so adorable',
    'ur energy is everything', 'i needed this today', 'you make me so happy',
    'thank you for existing', 'the sweetest', 'angel', 'ur my role model', 'ur amazing',
    'love this community', 'ily so much', 'forever a fan', 'my favorite person 🫶',
    'ur literally sunshine', 'never change', 'best part of my day',
  ],
};

/** Comments that mention the host by name. */
export const MentionTemplates: string[] = [
  '{name} ur so cool', '@{name} say hi pls', '{name} i love you', '{name} notice me 😭',
  '{name} how are you doing today', '@{name} whats ur fav song', '{name} can i get a shoutout',
  '{name} ur the best', '{name} play my song', '{name} marry me',
  '{name} do you remember me from last live', '{name} ur literally famous now',
  '{name} how many viewers wow', '{name} follow me back pls', '{name} can we collab',
  '{name} do a face reveal 😂', '{name} happy birthday!!!', '{name} ur glowing',
  '{name} where are you from', '{name} i told all my friends about you', '{name} GOAT',
  '{name} is HIM', '{name} is HER', '@{name} 🔥🔥🔥', '{name} reply to me pls',
  '{name} u saw my comment?', '{name} ur voice is so calming', '{name} ur so funny', '{name} pin me',
  '{name} do a giveaway', '{name} when merch', '{name} say my name pls', '{name} ur stream is my fav',
  '{name} i watch every live', '{name} can u tell a joke', '{name} ur hair looks great',
  '{name} ur doing amazing sweetie', '{name} what time do you stream tomorrow', '{name} dont end pls',
  '{name} 💘', 'we love you {name}', 'everyone follow {name}', '{name} is so underrated',
  'go follow {name} rn', 'ok {name} i see you 👀',
];

/** What the chat says right after the host posts something. */
export const HostReactions: string[] = [
  'they replied 😭', 'OMG REPLY', 'NOTICED', 'lmaooo', '😂😂', 'so true', 'W reply', 'facts', 'real',
  'haha yes', '💀💀', 'agreed', 'this ^', 'okay okay', 'i screamed', 'said what needed to be said',
  '😭😭😭', 'LOL', 'preach', 'yesss', 'no because same', 'the way i laughed', 'exactly!!', 'tell em',
];

/** Fired when the viewer count crosses a milestone. */
export const MilestoneTemplates: string[] = [
  '{count} viewers wtf', '{count} PEOPLE WATCHING', 'we hit {count}!!', '{count} lets gooo',
  '{count} already??', 'viral alert 🚨 {count}', '{count} viewers in minutes insane',
  'chat is moving so fast', 'cant even read the chat lol', 'the chat is flying',
  'this is blowing up', 'trending for sure', 'fyp brought me here', 'the algorithm did its thing',
  'why is this on my fyp lol', '{count}??? hello', 'this is going to be on the explore page',
];

/** The first half minute of a live. */
export const EarlyComments: string[] = [
  'first!!', 'hi', 'hiii', 'finally live', 'yesss ur live', 'notification gang 🔔',
  'came as soon as i got the notif', 'early gang', 'hello?', 'can you hear me', 'is this live?',
  'omg hi', 'ur live!!!', 'about time', 'lets gooo', 'hey hey', 'we are so early', 'hi bestie',
];

export const EmojiSpam: string[] = [
  '❤️❤️❤️', '🔥🔥🔥🔥🔥', '😍😍😍', '💀', '😭', '🥹', '👏👏👏', '🫶🫶', '💯', '🎉🎉', '😂', '👀',
  '🤩🤩', '✨✨✨', '🙌', '🤯', '🥰🥰🥰', '💖💖💖', '😮', '🐐', '🔥', '❤️', '😭😭😭', '💗', '🫠',
];

export interface LanguageMeta {
  key: LanguageKey;
  name: string;
  flag: string;
}

export const Languages: LanguageMeta[] = [
  { key: 'en', name: 'English', flag: '🇺🇸' },
  { key: 'es', name: 'Español', flag: '🇪🇸' },
  { key: 'pt', name: 'Português', flag: '🇧🇷' },
  { key: 'ru', name: 'Русский', flag: '🇷🇺' },
  { key: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { key: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { key: 'fr', name: 'Français', flag: '🇫🇷' },
  { key: 'ar', name: 'العربية', flag: '🇸🇦' },
  { key: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { key: 'id', name: 'Indonesia', flag: '🇮🇩' },
];

export const LanguageComments: Record<Exclude<LanguageKey, 'en'>, string[]> = {
  es: [
    'hola desde méxico 🇲🇽', 'saludos desde argentina', 'qué buen directo', 'eres increíble',
    'jajaja', 'te amo', 'salúdame porfa', 'hola a todos', 'qué guapo/a', 'sigue así crack',
    'esto es fuego 🔥', 'no manches', 'qué onda', 'me encanta', 'desde colombia 🇨🇴', 'jajajaja no',
  ],
  pt: [
    'oi do brasil 🇧🇷', 'kkkkkk', 'muito bom', 'salve', 'fala comigo', 'arrasou', 'te amo',
    'brasil presente 🇧🇷', 'que lindo', 'manda um salve', 'top demais', 'kkkkkkk eu não acredito',
    'melhor live', 'tmj 🤝', 'oi de portugal 🇵🇹', 'maravilhoso',
  ],
  ru: [
    'привет из россии', 'привет всем', 'это круто', 'ахахах', 'красава', 'передай привет',
    'русские тут?', 'лучший стрим', 'огонь 🔥', 'ты лучший', 'ахаха жиза', 'с любовью из москвы',
    'класс', 'вау', 'Русскоязычные?', 'привет из казахстана 🇰🇿',
  ],
  tr: [
    'türkler burada mı', 'selam', 'harikasın', 'çok iyi', 'kral', 'selam ver lütfen',
    "istanbul'dan selamlar", 'efsane', 'seni seviyorum', 'hahaha', 'muhteşem', 'bayıldım',
    'türkiye 🇹🇷', 'adamsın', 'çok tatlısın', 'devam et',
  ],
  de: [
    'hallo aus deutschland 🇩🇪', 'mega', 'krass', 'digga was', 'grüß mich mal', 'bester stream',
    'hahaha', 'ich liebe es', 'weiter so', 'wie alt bist du', 'nice', 'geil', 'hallo zusammen',
    'respekt', 'aus wien 🇦🇹', 'servus',
  ],
  fr: [
    'salut de paris 🇫🇷', 'trop bien', 'mdr', 'ptdr', "c'est incroyable", "je t'aime",
    "t'es trop fort", 'coucou', 'un salut stp', 'magnifique', 'franchement ouf', 'la france est là',
    'bravo', "t'es magnifique", 'salut du québec 🇨🇦', 'trop drôle',
  ],
  ar: [
    'مرحبا من السعودية', 'رائع', 'هههههه', 'احبك', 'سلم علي', 'اجمل بث', 'عرب هنا؟', 'ماشاء الله',
    'كفو', 'واو', 'استمر', 'من مصر 🇪🇬', 'تحية من المغرب', 'جميل', 'من الامارات 🇦🇪', 'ابدعت',
  ],
  hi: [
    'namaste from india 🇮🇳', 'bhai op', 'kya baat hai', 'mast', 'bahut badhiya', 'hello ji',
    'india se pyaar ❤️', 'op bhai op', 'ek shoutout do', 'bohot acha', 'zabardast',
    'proud of you bhai', 'hi from delhi', 'mumbai se hello', 'kamaal hai', 'bhai sahab 🔥',
  ],
  id: [
    'halo dari indonesia 🇮🇩', 'keren banget', 'wkwkwk', 'mantap', 'salam dari jakarta',
    'sapa aku dong', 'cakep', 'gokil', 'semangat kak', 'aku suka', 'bagus banget', 'indonesia hadir',
    'kak sapa dong', 'wkwk gila', 'seru banget', 'dari bandung 👋',
  ],
};

export const JoinTemplates = ['{name} joined', '{name} joined the LIVE', '{name} is here'];
export const FollowTemplates = ['{name} followed you', '{name} started following you'];
export const ShareTemplates = ['{name} shared the LIVE', '{name} shared to their story'];

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

export function countAllComments(): number {
  const packs = Object.values(PackComments).reduce((n, list) => n + list.length, 0);
  const langs = Object.values(LanguageComments).reduce((n, list) => n + list.length, 0);
  return (
    packs +
    langs +
    MentionTemplates.length +
    HostReactions.length +
    MilestoneTemplates.length +
    EarlyComments.length +
    EmojiSpam.length
  );
}

/** What people write next to a donation. */
export const DonationMessages: string[] = [
  'keep it up!!', 'love from germany 🇩🇪', 'buy yourself a coffee ☕', 'for the W', 'ur the best',
  'first donation ever, u deserve it', 'say hi to my brother pls', 'can you play my song', 'shoutout plss',
  'been here since day one', 'thanks for the content 🙏', 'take care of yourself', 'for snacks 🍕',
  'ur stream got me through a rough week', 'MARRY ME', 'more lives pls', 'from the uk with love 🇬🇧',
  'this is all i have lol', 'do a backflip', 'read this pls 😭', 'W streamer', 'hydrate!!',
  'happy birthday to me 🎂 say my name', 'say "i love you chat"', 'best live on the app',
  'tell a joke', 'pin my comment 🥺', 'road to 1M 🚀', 'sending love ❤️', 'you deserve the world',
];

export const TwitchSubTemplates: string[] = [
  'subscribed with Prime!',
  'subscribed at Tier 1!',
  'just subscribed!',
  'resubscribed for {months} months!',
  'resubscribed for {months} months in a row!',
];

export const GiftSubTemplates: string[] = ['gifted {n} subs to the community!', 'is gifting {n} Tier 1 subs!'];

export const YouTubeMemberTemplates: string[] = ['became a member!', 'gifted {n} memberships!', 'is a member for {months} months!'];
