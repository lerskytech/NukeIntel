/**
 * Webcam Sources for NukeIntel
 * Direct links to webcam feeds from sites of global geopolitical interest
 * Updated: 2025-06-19
 *
 * IMPLEMENTATION NOTE: All sources are reliable, embeddable live feeds using iframe format
 * Based on the working Venice webcam implementation
 */

// Visible webcam sources for user interface
export const webcamSources = [
  {
    id: 'tel-aviv',
    title: 'Tel Aviv Beach',
    src: 'https://www.youtube.com/embed/jQl2c_rr9yg?autoplay=1&mute=1', 
    type: 'youtube',
    refreshRate: 0, // Not used for YouTube embeds
    location: 'Tel Aviv, Israel',
    coordinates: '32.0853° N, 34.7818° E'
  },
  {
    id: 'tehran',
    title: 'Tehran City View',
    src: 'https://www.youtube.com/embed/LXruXP3HGGw?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Tehran, Iran',
    coordinates: '35.6892° N, 51.3890° E'
  },
  {
    id: 'kyiv',
    title: 'Kyiv Independence Square',
    src: 'https://www.youtube.com/embed/e2gC37ILQmk?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Kyiv, Ukraine',
    coordinates: '50.4501° N, 30.5234° E'
  },
  {
    id: 'moscow',
    title: 'Moscow Red Square',
    src: 'https://www.youtube.com/embed/g5aHgCvKsVs?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Moscow, Russia',
    coordinates: '55.7558° N, 37.6173° E'
  },
  {
    id: 'washington-dc',
    title: 'Washington Monument',
    src: 'https://www.youtube.com/embed/ePJw_TqYv9E?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Washington DC, USA',
    coordinates: '38.9072° N, 77.0369° W'
  },
  {
    id: 'beijing',
    title: 'Beijing City Center',
    src: 'https://www.youtube.com/embed/uDU5H-7bjK0?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Beijing, China',
    coordinates: '39.9042° N, 116.4074° E'
  },
  {
    id: 'seoul',
    title: 'Seoul City View',
    src: 'https://www.youtube.com/embed/MjIrEtCxdtI?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Seoul, South Korea',
    coordinates: '37.5665° N, 126.9780° E'
  },
  {
    id: 'taipei',
    title: 'Taipei 101 Tower',
    src: 'https://www.youtube.com/embed/z_fY1pj4J-w?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Taipei, Taiwan',
    coordinates: '25.0330° N, 121.5654° E'
  },
  {
    id: 'gaza-city',
    title: 'Gaza Shoreline',
    src: 'https://www.youtube.com/embed/s6j_ITxhXnY?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Gaza City, Gaza Strip',
    coordinates: '31.5017° N, 34.4668° E'
  },
  {
    id: 'london',
    title: 'London Tower Bridge',
    src: 'https://www.youtube.com/embed/MGMqLGvtNpY?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'London, United Kingdom',
    coordinates: '51.5074° N, 0.1278° W'
  },
  {
    id: 'pyongyang',
    title: 'Pyongyang City Center',
    src: 'https://www.youtube.com/embed/HknYdFljVDY?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Pyongyang, North Korea',
    coordinates: '39.0392° N, 125.7625° E'
  },
  {
    id: 'venice-italy',
    title: 'Venice Grand Canal', 
    src: 'https://www.youtube.com/embed/P393gTj527k?autoplay=1&mute=1',
    type: 'youtube',
    refreshRate: 0,
    location: 'Venice, Italy',
    coordinates: '45.4408° N, 12.3155° E',
    isReference: true // Flag to hide from UI but keep for reference
  }
];

// Lookup object for easier access to sources
export const youtubeSources = webcamSources.reduce((acc, src) => {
  acc[src.id] = src.src;
  return acc;
}, {});

