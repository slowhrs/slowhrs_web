/**
 * Event photo data — maps photo folders to archive items.
 * Photos are numbered sequentially: 01.jpeg, 02.jpeg, etc.
 */

export interface EventPhotoSet {
  /** Matches archive item id */
  archiveId: string;
  /** Display title */
  title: string;
  /** Folder slug under /assets/events/photos/ */
  folder: string;
  /** Number of photos in the folder */
  count: number;
  /** Alt text prefix */
  alt: string;
}

export const EVENT_PHOTO_SETS: EventPhotoSet[] = [
  {
    archiveId: 'harbarium_holiday',
    title: 'Holiday Photoshoot — Harbarium',
    folder: 'harbarium_holiday',
    count: 17,
    alt: 'SLOWHRS Holiday Photoshoot at Harbarium',
  },
  {
    archiveId: 'dtla_highrise',
    title: 'DTLA Highrise Private Party',
    folder: 'dtla_highrise',
    count: 11,
    alt: 'SLOWHRS Private Party at DTLA Highrise',
  },
  {
    archiveId: 'runway_ss1_archive',
    title: 'Runway SS1 Archive TV',
    folder: 'runway_ss1_archive',
    count: 6,
    alt: 'SLOWHRS Runway SS1 Archive',
  },
  {
    archiveId: 'runway_vhs_models',
    title: 'SS26 Runway VHS Frames',
    folder: 'runway_vhs_models',
    count: 6,
    alt: 'SLOWHRS SS26 Runway VHS Models',
  },
];

/**
 * Generate photo paths for a given event photo set.
 */
export function getPhotoUrls(set: EventPhotoSet): string[] {
  return Array.from({ length: set.count }, (_, i) =>
    `/assets/events/photos/${set.folder}/${String(i + 1).padStart(2, '0')}.jpeg`
  );
}
