// Parses an event from Partiful by fetching the page and reading Open Graph metadata.

export type ParsedEvent = {
  name: string;
  blurb: string;
  cover_image: string | null;
  date: string | null;
  location: string | null;
};

export async function fetchPartifulEvent(url: string): Promise<ParsedEvent> {
  if (!url.startsWith('https://partiful.com/e/')) {
    throw new Error('Invalid Partiful URL');
  }

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SLOWHRS/1.0)' },
  });
  if (!res.ok) throw new Error(`Partiful fetch failed: ${res.status}`);
  const html = await res.text();

  const og = (prop: string) => {
    const match = html.match(
      new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`)
    );
    return match?.[1] ?? null;
  };

  const name = og('title')?.replace(/ \| Partiful$/, '') ?? 'Untitled';
  const blurb = og('description')?.split('\n')[0]?.toLowerCase() ?? '';
  const cover_image = og('image');

  // Date / location: best-effort regex from page body. Admin can edit.
  const dateMatch = html.match(
    /(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*,\s+([A-Z][a-z]+\s+\d{1,2})/
  );
  const date = dateMatch
    ? new Date(`${dateMatch[1]}, ${new Date().getFullYear()}`).toISOString()
    : null;

  return { name, blurb, cover_image, date, location: null };
}
