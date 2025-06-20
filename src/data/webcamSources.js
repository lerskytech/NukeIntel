/**
 * Webcam Sources for NukeIntel
 * Direct links to webcam feeds from sites of global geopolitical interest
 * Updated: 2025-06-19
 *
 * IMPLEMENTATION NOTE: All sources use the Windy Webcams API
 * All Windy webcams use API key authentication via environment variables
 * Tokens expire after 10 minutes, so data is refreshed automatically every 8 minutes
 */

// Visible webcam sources for user interface - using Windy Webcams API IDs
export const webcamSources = [
  {
    id: '1538348110',  // Windy webcam ID for Tel Aviv 
    title: 'Tel Aviv Beach',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Tel Aviv, Israel',
    coordinates: '32.0853° N, 34.7818° E'
  },
  {
    id: '1479594949',  // Windy webcam ID for Tehran
    title: 'Tehran City View',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Tehran, Iran',
    coordinates: '35.6892° N, 51.3890° E'
  },
  {
    id: '1501891517',  // Windy webcam ID for Kyiv
    title: 'Kyiv Maidan Square',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Kyiv, Ukraine',
    coordinates: '50.4501° N, 30.5234° E'
  },
  {
    id: '1250865925',  // Windy webcam ID for Moscow
    title: 'Moscow City View',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Moscow, Russia',
    coordinates: '55.7558° N, 37.6173° E'
  },
  {
    id: '1236943260',  // Windy webcam ID for Washington DC
    title: 'Washington DC Capitol',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Washington DC, USA',
    coordinates: '38.8921° N, 77.0241° W'
  },
  {
    id: '1266166264',  // Windy webcam ID for Tokyo
    title: 'Tokyo Shibuya Crossing',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Tokyo, Japan',
    coordinates: '35.6762° N, 139.6503° E'
  },
  {
    id: '1517595746',  // Windy webcam ID for Seoul
    title: 'Seoul Live',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Seoul, South Korea',
    coordinates: '37.5665° N, 126.9780° E'
  },
  {
    id: '1260641782',  // Windy webcam ID for Taipei
    title: 'Taipei 101 Tower',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Taipei, Taiwan',
    coordinates: '25.0330° N, 121.5654° E'
  },
  {
    id: '1341439400',  // Windy webcam ID for New York
    title: 'New York Times Square',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'New York City, USA',
    coordinates: '40.7580° N, 73.9855° W'
  },
  {
    id: '1173901066',  // Windy webcam ID for London
    title: 'London Westminster',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'London, UK',
    coordinates: '51.5074° N, 0.1278° W'
  },
  {
    id: '1478938274',  // Windy webcam ID for a location near NK border
    title: 'North Korea Border',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'North Korea Border',
    coordinates: '39.0392° N, 125.7625° E'
  },
  {
    id: '1224129419',  // Windy webcam ID for Berlin
    title: 'Berlin Brandenburg Gate',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Berlin, Germany',
    coordinates: '52.5200° N, 13.4050° E'
  },
  {
    id: '1200564526',  // Windy webcam ID for Venice Grand Canal
    title: 'Venice Grand Canal',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Venice, Italy',
    coordinates: '45.4408° N, 12.3155° E'
  }
];

// Lookup object for easier access to sources
export const windySources = webcamSources.reduce((acc, src) => {
  if (src.type === 'windy') {
    acc[src.id] = src;
  }
  return acc;
}, {});
