/** Curated handles in many styles, plus a generator so the crowd never repeats. */
import { pick, randInt } from '@/utils/random';

export const CuratedUsernames: string[] = [
  // realistic handles
  'jess.ko', 'marcus_b', 'itz.liam', 'sofiaa.r', 'noahh', 'ava.mx', 'ethan.w', 'mia_lov',
  'lucas.pdf', 'isabella.gr', 'oliver.jpg', 'emma.s', 'leo.vibes', 'chloe__', 'jayden.k',
  'zoe.m', 'ryan.oc', 'lily_rose', 'daniel.ss', 'grace.ly', 'kai.here', 'nora.b', 'mateo.c',
  'ella.rae', 'tyler_j', 'maya.p', 'aiden.x', 'hannah.r', 'julian.dm', 'aria.v',
  'nathan.lo', 'stella.k', 'elijah.q', 'layla.z', 'owen.b', 'ivy.jpg', 'caleb.r', 'ruby.rae',
  'adrian.m', 'luna.sky', 'cam_18', 'jordan.ps', 'brooklyn.m', 'tomas.v', 'sienna.l',
  // short / aesthetic
  'cloudy', 'moonchild', 'sunkissed', 'honeybee', 'softie', 'glow.up', 'dreamer', 'velvet',
  'lofi.cat', 'peachy', 'nightowl', 'coffee.first', 'starlit', 'daisy', 'hazel', 'mint.tea',
  'icyy', 'blurry', 'soft.aura', 'rosegold', 'wavy', 'golden.hr', 'silk', 'cherry.cola',
  // gamer tags
  'xXNoScopeXx', 'ShadowZ', 'ghost_recon', 'sniperwolf99', 'KingSlayer', 'nova.gg', 'Zephyr',
  'DrLagg', 'pixel_pete', 'clutchgod', 'Ryz3n', 'Toxic_Ty', 'NightFury', 'Blaze404', 'Frostbyte',
  'ReaperX', 'TTV_BigMike', 'spawnkill', 'headshot.hero', 'AimBotti', 'Zyro', 'Kryptic', 'VoidWalker',
  // emoji & symbols
  '🌸 lily 🌸', '❤️‍🔥 AVA', 'Sophia💋', '🎀🎀🎀', '🔱', '🦋 mari', 'zay 💫', '👑 queen b',
  'jin ⭐', 'luv ☁️', '✨ emmy ✨', '🌙 nova', '💀 jay', 'kenny 🔥', '🐸 fred', '⚡ max',
  // numeric / generated looking
  'user8827162', 'user02938472', 'user1938279', 'user55012', 'user7791', 'user33301941',
  'guest_4421', 'anon.92', 'nobody_01', 'someone', 'idk_lol', 'hi_there_7',
  // brands & fan pages
  'daily.fits', 'edits.by.k', 'clipz.central', 'streamfails', 'bestmoments.tv', 'viral.hub',
  'funny.clipz', 'fan.page.1', 'updates.daily', 'memes.only', 'fit.inspo', 'music.finds',
  // stan / fandom
  'swiftie4ever', 'army.forever', 'blink.jisoo', 'onceuponatwice', 'stay.skz', 'carat.diamond',
  'moa_txt', 'engene.ni-ki', 'belieber.01', 'arianator', 'drizzy.fan', 'weeknd.xo',
  // international
  'carlos.mx', 'valentina.ar', 'joao.br', 'ana.clara', 'kaan.ist', 'elif.tr', 'dmitry.ru',
  'anya.spb', 'lukas.de', 'lena.berlin', 'hugo.paris', 'camille.fr', 'ahmed.eg', 'fatima.ma',
  'rahul.in', 'priya.sharma', 'arjun.07', 'putri.id', 'budi.jkt', 'minji.kr', 'haruto.jp',
  'yuki.tokyo', 'wei.sg', 'linh.vn', 'nikos.gr', 'mateusz.pl', 'omar.dxb',
  // silly
  'nuh uhhhh', 'pro gamer', 'R.I.P', 'Real', 'Someone', 'Lo-Gan', 'not a bot', 'definitely.human',
  'ur mom', 'mr worldwide', 'the real one', 'bob', 'steve', 'yeet', 'bruh', 'lol', 'ok', 'why',
  'sleepy', 'hungry', 'ya boi', 'big chungus', 'certified goofball', 'main character',
];

const FirstNames = [
  'alex', 'sam', 'jess', 'mike', 'sara', 'tom', 'nina', 'ben', 'lea', 'max', 'eva', 'dan',
  'liv', 'joe', 'amy', 'jake', 'zoe', 'nick', 'mia', 'ryan', 'ella', 'luke', 'ivy', 'josh',
  'kate', 'adam', 'emma', 'leon', 'anna', 'noah', 'lily', 'finn', 'maya', 'tyler', 'ruby',
  'kai', 'nora', 'eli', 'isla', 'theo', 'chloe', 'mason', 'aria', 'owen', 'luna', 'leo',
  'zara', 'cole', 'hana', 'ravi', 'omar', 'yara', 'diego', 'lucia', 'mateo', 'sofia',
  'kenji', 'mei', 'arjun', 'priya', 'elif', 'kaan', 'lena', 'jonas', 'ines', 'hugo',
  'amara', 'tariq', 'nia', 'jett', 'skye', 'remy', 'blu', 'ace', 'rio', 'kit',
];

const Suffixes = ['', '', '_', '.', 'x', 'xx', '.official', '.real', '_tv', '.gg', '.jpg', '.exe'];
const Words = [
  'vibes', 'world', 'daily', 'edits', 'plays', 'streams', 'life', 'official', 'live', 'tv',
  'fan', 'lol', 'xo', 'ok', 'here', 'again', 'two', 'wav', 'mp3', 'raw',
];

export function generateUsername(): string {
  const style = randInt(0, 9);
  const name = pick(FirstNames);
  switch (style) {
    case 0:
      return `${name}${pick(Suffixes)}${randInt(1, 99)}`;
    case 1:
      return `${name}.${pick(Words)}`;
    case 2:
      return `${name}_${pick(Words)}`;
    case 3:
      return `itz.${name}`;
    case 4:
      return `${name}${randInt(1990, 2012)}`;
    case 5:
      return `${name}${pick(Suffixes)}`;
    case 6:
      return `not.${name}`;
    case 7:
      return `${name.charAt(0).toUpperCase() + name.slice(1)}${randInt(1, 999)}`;
    case 8:
      return `user${randInt(100000, 99999999)}`;
    default:
      return `${pick(Words)}.${name}`;
  }
}
