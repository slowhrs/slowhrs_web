export type NewsEntry = {
  id: string;
  date: string;
  headline: string;
  body: string;
  tag: "event" | "drop" | "update" | "internal";
  locked: boolean; // true = members-only content
};

export const NEWS_ENTRIES: NewsEntry[] = [
  {
    id: "ss25-preview",
    date: "05.01.25",
    headline: "SS25 preview is live. members first.",
    body: "The first piece from Spring/Summer 25 is visible in the showroom. Full collection drops when we say it drops. If you're not on the list, you'll know after everyone else.",
    tag: "drop",
    locked: false,
  },
  {
    id: "act-iv-recap",
    date: "03.20.25",
    headline: "act iv — the room remembered.",
    body: "Red Room. Members First. Over 400 through the door and zero phones during the first hour. The recap reel is live in the events archive. If you were there, you already know. If you weren't, the footage will have to do.",
    tag: "event",
    locked: false,
  },
  {
    id: "destroy-lonely-doc",
    date: "02.22.25",
    headline: "destroy lonely · trap rave footage delivered.",
    body: "WYA Trap Rave documentation complete. Delivered to WYA team. Selected footage available in the events archive. The floor was chaos. The edit is clean.",
    tag: "event",
    locked: false,
  },
  {
    id: "nye-recap",
    date: "01.05.25",
    headline: "nye at mid-city. fast life never sleeps.",
    body: "New Year's Eve recap from Mid-City is in the archive. Midnight was just the beginning. We stopped shooting at 4am. The edit tells the story from inside the room.",
    tag: "event",
    locked: false,
  },
  {
    id: "holiday-capsule",
    date: "12.20.24",
    headline: "holiday capsule shipped.",
    body: "End-of-year capsule is in hands. Members had 48-hour early access. Limited remaining stock available in the showroom. When it's gone, it's gone.",
    tag: "drop",
    locked: false,
  },
  {
    id: "fast-life-sellout",
    date: "11.18.24",
    headline: "fast life hoodie: gone.",
    body: "Sold out in 72 hours. The tee followed a week later. Both pieces are now archive-only. No restocks. We don't do that.",
    tag: "drop",
    locked: false,
  },
  {
    id: "membership-note",
    date: "11.01.24",
    headline: "a note on access.",
    body: "We're not building a mailing list. We're building a room. Membership is limited and intentional. If you're here, you're already closer than most. Applications are reviewed weekly.",
    tag: "internal",
    locked: false,
  },
  {
    id: "inner-circle-update",
    date: "10.15.24",
    headline: "inner circle: october briefing.",
    body: "",
    tag: "internal",
    locked: true,
  },
];
