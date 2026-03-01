const QUOTES = [
  'The limits of my language mean the limits of my world.',
  'One language sets you in a corridor for life. Two languages open every door along the way.',
  'Language is the road map of a culture.',
  'To have another language is to possess a second soul.',
  'A different language is a different vision of life.',
  'You can never understand one language until you understand at least two.',
  'Learning another language is not only learning different words for the same things, but learning another way to think about things.',
  'Language is the dress of thought.',
  'The more languages you know, the more you are human.',
  'Words are, of course, the most powerful drug used by mankind.',
  'Language shapes the way we think, and determines what we can think about.',
  'With languages, you are at home anywhere.',
  'Every new language is a new window from which you observe the world.',
  'Knowledge of languages is the doorway to wisdom.',
  'Speak a new language so that the world will be a new world.',
];

const TIPS = [
  'Review words right before sleep — your brain consolidates them overnight.',
  'Shadowing native speakers builds fluency faster than grammar drills.',
  'Label objects around your house in your target language.',
  'Listen to podcasts at 0.8× speed to catch every word.',
  'Write a 3-sentence diary entry every day in your target language.',
  "Change your phone's language for passive immersion.",
  'Focus on the 1000 most common words — they cover 85% of daily speech.',
  "Read children's books first — simple grammar, useful vocabulary.",
  'Use spaced repetition — short daily sessions beat long weekly ones.',
  'Think in your target language during routine tasks.',
  'Watch movies with subtitles in the target language, not your native one.',
  'Record yourself speaking and compare with native audio.',
  'Learn phrases, not just isolated words — context sticks better.',
  'Teach what you learn to someone else — it doubles retention.',
  'Set micro-goals: 5 new words today, not 100 this month.',
];

export const CEFR_NAMES: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
  C2: 'Mastery',
};

function hashDate(date: Date): number {
  const day =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  let h = day;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return Math.abs(h);
}

export function getDailyContent() {
  const today = new Date();
  const h = hashDate(today);
  return {
    quote: QUOTES[h % QUOTES.length],
    tip: TIPS[(h >> 8) % TIPS.length],
  };
}
