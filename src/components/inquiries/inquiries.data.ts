export type InquiryCategory = {
  id: string;
  label: string;
  description: string;
  fields: FormField[];
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "date" | "select";
  placeholder: string;
  required: boolean;
  options?: string[]; // for select type
};

const COMMON_FIELDS: FormField[] = [
  { name: "name", label: "name", type: "text", placeholder: "your name", required: true },
  { name: "email", label: "email", type: "email", placeholder: "email address", required: true },
  { name: "instagram", label: "instagram", type: "text", placeholder: "@handle", required: false },
];

export const INQUIRY_CATEGORIES: InquiryCategory[] = [
  {
    id: "event-production",
    label: "event production",
    description: "you have the venue and the crowd. we bring the format, the footage, and the feeling.",
    fields: [
      ...COMMON_FIELDS,
      { name: "eventDate", label: "date", type: "date", placeholder: "", required: true },
      { name: "venue", label: "venue / location", type: "text", placeholder: "where is this?", required: true },
      { name: "capacity", label: "capacity", type: "select", placeholder: "select", required: true, options: ["under 100", "100–300", "300–500", "500+"] },
      { name: "details", label: "tell us about this", type: "textarea", placeholder: "what are we walking into?", required: true },
    ],
  },
  {
    id: "private-event",
    label: "private event",
    description: "birthday, launch, celebration. we document it like it matters.",
    fields: [
      ...COMMON_FIELDS,
      { name: "eventDate", label: "date", type: "date", placeholder: "", required: true },
      { name: "location", label: "location", type: "text", placeholder: "city / venue", required: true },
      { name: "details", label: "what is this for?", type: "textarea", placeholder: "describe the occasion", required: true },
    ],
  },
  {
    id: "brand-collab",
    label: "brand collaboration",
    description: "if you're reaching out, we're already paying attention. tell us what you're building.",
    fields: [
      ...COMMON_FIELDS,
      { name: "brand", label: "brand / company", type: "text", placeholder: "who are you with?", required: true },
      { name: "details", label: "what's the vision?", type: "textarea", placeholder: "describe the collaboration", required: true },
    ],
  },
  {
    id: "content-production",
    label: "content / film",
    description: "recap reels, campaign footage, music video direction. we shoot what we'd watch.",
    fields: [
      ...COMMON_FIELDS,
      { name: "projectType", label: "project type", type: "select", placeholder: "select", required: true, options: ["recap reel", "campaign", "music video", "documentary", "other"] },
      { name: "timeline", label: "timeline", type: "text", placeholder: "when do you need this?", required: true },
      { name: "details", label: "brief", type: "textarea", placeholder: "describe the project", required: true },
    ],
  },
  {
    id: "venue-partnership",
    label: "venue partnership",
    description: "we bring the night. you bring the room. recurring or one-off.",
    fields: [
      ...COMMON_FIELDS,
      { name: "venue", label: "venue name", type: "text", placeholder: "where?", required: true },
      { name: "capacity", label: "capacity", type: "select", placeholder: "select", required: true, options: ["under 100", "100–300", "300–500", "500+"] },
      { name: "details", label: "what are you looking for?", type: "textarea", placeholder: "describe the partnership", required: true },
    ],
  },
  {
    id: "talent-booking",
    label: "talent / booking",
    description: "DJs, performers, creatives. if they're in our orbit, we can make introductions.",
    fields: [
      ...COMMON_FIELDS,
      { name: "eventDate", label: "date", type: "date", placeholder: "", required: true },
      { name: "budget", label: "budget range", type: "select", placeholder: "select", required: true, options: ["under $2k", "$2k–$5k", "$5k–$10k", "$10k+"] },
      { name: "details", label: "who / what are you looking for?", type: "textarea", placeholder: "describe the need", required: true },
    ],
  },
  {
    id: "membership",
    label: "membership inquiry",
    description: "access is not a newsletter. if you want in, tell us why.",
    fields: [
      ...COMMON_FIELDS,
      { name: "why", label: "why do you want in?", type: "textarea", placeholder: "be honest", required: true },
    ],
  },
  {
    id: "general",
    label: "general",
    description: "doesn't fit the above? say it here.",
    fields: [
      ...COMMON_FIELDS,
      { name: "details", label: "what do you need?", type: "textarea", placeholder: "tell us", required: true },
    ],
  },
];
