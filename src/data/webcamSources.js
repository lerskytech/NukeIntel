/**
 * Webcam Sources for NukeIntel
 * Direct links to webcam feeds from sites of global geopolitical interest
 * Updated: 2025-06-20
 *
 * IMPLEMENTATION NOTE: All sources use the Windy Webcams API
 * All Windy webcams use API key authentication via environment variables
 * Tokens expire after 10 minutes, so data is refreshed automatically every 8 minutes
 */

// Visible webcam sources for user interface - using Windy Webcams API IDs
// ONLY using the explicit list of 10 webcams provided by the user
export const webcamSources = [
  {
    id: '1693844957',
    title: 'Moscow Khamovniki District',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Moscow, Russia',
    coordinates: '55.7558° N, 37.6173° E',
    label: 'Khamovniki District (Near Kremlin)'
  },
  {
    id: '1389696188',
    title: 'Jerusalem City Center',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Jerusalem, Israel',
    coordinates: '31.7683° N, 35.2137° E',
    label: 'City Center'
  },
  {
    id: '1748254982',
    title: 'Tel Aviv Hilton Beach',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Tel Aviv, Israel',
    coordinates: '32.0853° N, 34.7818° E',
    label: 'Hilton Beach'
  },
  {
    id: '1744523397',
    title: 'Near North Korea Border',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Jeokseong-myeon, South Korea',
    coordinates: '38.1124° N, 127.0767° E',
    label: 'Near North Korea Border'
  },
  {
    id: '1166267733',
    title: 'Hong Kong Victoria Harbour',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Hong Kong',
    coordinates: '22.2783° N, 114.1747° E',
    label: 'Victoria Harbour'
  },
  {
    id: '1596008082',
    title: 'Beijing Olympic Tower',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Beijing, China',
    coordinates: '39.9042° N, 116.4074° E',
    label: 'Olympic Tower'
  },
  {
    id: '1263154384',
    title: 'Washington D.C. US Capitol',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Washington D.C., USA',
    coordinates: '38.8921° N, 77.0241° W',
    label: 'US Capitol'
  },
  {
    id: '1731400881',
    title: 'Taipei 101',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Taipei, Taiwan',
    coordinates: '25.0330° N, 121.5654° E',
    label: 'Taipei 101'
  },
  {
    id: '1568461321',
    title: 'London City Center',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'London, UK',
    coordinates: '51.5074° N, 0.1278° W',
    label: 'City Center'
  },
  {
    id: '1706118429',
    title: 'Paris Palais d\'Iéna',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Paris, France',
    coordinates: '48.8566° N, 2.3522° E',
    label: 'Palais d\'Iéna'
  }
];

// Lookup object for easier access to sources
export const windySources = webcamSources.reduce((acc, src) => {
  if (src.type === 'windy') {
    acc[src.id] = src;
  }
  return acc;
}, {});

