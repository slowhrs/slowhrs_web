export type Tier = {
  number: number;
  name: string;
  display: string;
  meter: string;
  threshold: number;
};

export function getTier(member: {
  hearts: number;
  is_contributor: boolean;
  is_architect: boolean;
}): Tier {
  if (member.is_architect)
    return { number: 5, name: 'the architects', display: 'the architects', meter: '\u25AE\u25AE\u25AE\u25AE\u25AE \u2605', threshold: 0 };
  if (member.hearts >= 5 && member.is_contributor)
    return { number: 4, name: 'the inner room', display: 'the inner room', meter: '\u25AE\u25AE\u25AE\u25AE\u25AE', threshold: 5 };
  if (member.hearts >= 3)
    return { number: 3, name: 'the regular', display: 'the regular', meter: '\u25AE\u25AE\u25AE\u25AF\u25AF', threshold: 3 };
  if (member.hearts >= 1)
    return { number: 2, name: 'the room', display: 'the room', meter: '\u25AE\u25AE\u25AF\u25AF\u25AF', threshold: 1 };
  return { number: 1, name: 'the line', display: 'the line', meter: '\u25AE\u25AF\u25AF\u25AF\u25AF', threshold: 0 };
}

export function nextTier(
  current: Tier,
  hearts: number,
  is_contributor: boolean
): { name: string; heartsToGo: number; note?: string } | null {
  if (current.number === 5) return null;
  if (current.number === 4)
    return { name: 'the architects', heartsToGo: 0, note: 'invite only' };
  if (current.number === 3) {
    if (hearts >= 5 && !is_contributor)
      return { name: 'the inner room', heartsToGo: 0, note: 'contribute to unlock' };
    return { name: 'the inner room', heartsToGo: Math.max(0, 5 - hearts), note: 'and contribute' };
  }
  if (current.number === 2)
    return { name: 'the regular', heartsToGo: 3 - hearts };
  return { name: 'the room', heartsToGo: 1 };
}
