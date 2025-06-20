/**
 * High Alert Windy Webcams Data Source
 * Defines critical webcams from Windy.com to be displayed in the High Alert section
 */

const webcams = [
  {
    id: '1693844957',
    city: 'Moscow',
    label: 'Khamovniki District (Near Kremlin)',
    location: 'Moscow, Russia',
    description: 'Live view near the Kremlin in Khamovniki District',
    windyUrl: 'https://www.windy.com/-Webcams-Khamovniki-District/webcams/1693844957',
    tags: ['Kremlin', 'Russia', 'High Alert'],
    highAlert: true,
    shareId: 'moscow-kremlin'
  },
  {
    id: '1389696188',
    city: 'Jerusalem',
    label: 'City Center',
    location: 'Jerusalem, Israel',
    description: 'Live view of Jerusalem city center',
    windyUrl: 'https://www.windy.com/-Webcams-Jerusalem/webcams/1389696188',
    tags: ['Jerusalem', 'Israel', 'High Alert'],
    highAlert: true,
    shareId: 'jerusalem-center'
  },
  {
    id: '1748254982',
    city: 'Tel Aviv',
    label: 'Hilton Beach',
    location: 'Tel Aviv, Israel',
    description: 'Live coastal view from Tel Aviv Hilton Beach area',
    windyUrl: 'https://www.windy.com/-Webcams-Tel-Aviv-Yafo-Hilton-Beach/webcams/1748254982',
    tags: ['Tel Aviv', 'Israel', 'High Alert'],
    highAlert: true,
    shareId: 'tel-aviv-beach'
  },
  {
    id: '1744523397',
    city: 'Jeokseong-myeon',
    label: 'Near North Korea Border',
    location: 'Near North Korea border, South Korea',
    description: 'View from South Korea near the North Korean border',
    windyUrl: 'https://www.windy.com/-Webcams-Jeokseong-myeon/webcams/1744523397',
    tags: ['North Korea', 'DMZ', 'High Alert'],
    highAlert: true,
    shareId: 'north-korea-border'
  },
  {
    id: '1166267733',
    city: 'Hong Kong',
    label: 'Victoria Harbour',
    location: 'Hong Kong',
    description: 'Panoramic view of Victoria Harbour in Hong Kong',
    windyUrl: 'https://www.windy.com/-Webcams-Hong-Kong/webcams/1166267733',
    tags: ['Hong Kong', 'China', 'High Alert'],
    highAlert: true,
    shareId: 'hong-kong-harbour'
  },
  {
    id: '1596008082',
    city: 'Beijing',
    label: 'Olympic Tower',
    location: 'Beijing, China',
    description: 'View from the Olympic Tower in Beijing',
    windyUrl: 'https://www.windy.com/-Webcams-Huayuanlu-Subdistrict/webcams/1596008082',
    tags: ['Beijing', 'China', 'Olympic', 'High Alert'],
    highAlert: true,
    shareId: 'beijing-olympic'
  },
  {
    id: '1263154384',
    city: 'Washington D.C.',
    label: 'US Capitol',
    location: 'Washington D.C., USA',
    description: 'Live feed of the US Capitol Building',
    windyUrl: 'https://www.windy.com/-Webcams-Washington-D-C-US-Capitol/webcams/1263154384',
    tags: ['Washington', 'USA', 'Capitol', 'High Alert'],
    highAlert: true,
    shareId: 'us-capitol'
  },
  {
    id: '1731400881',
    city: 'Taipei',
    label: 'Taipei 101',
    location: 'Taipei, Taiwan',
    description: 'View from the iconic Taipei 101 tower',
    windyUrl: 'https://www.windy.com/-Webcams-Taipei-Taipei-101-Shopping-center/webcams/1731400881',
    tags: ['Taipei', 'Taiwan', 'Taipei 101', 'High Alert'],
    highAlert: true,
    shareId: 'taipei-101'
  },
  {
    id: '1568461321',
    city: 'London',
    label: 'City Center',
    location: 'London, UK',
    description: 'Panoramic view of central London',
    windyUrl: 'https://www.windy.com/-Webcams-London/webcams/1568461321',
    tags: ['London', 'UK', 'High Alert'],
    highAlert: true,
    shareId: 'london-view'
  },
  {
    id: '1706118429',
    city: 'Paris',
    label: 'Palais d\'Iéna',
    location: 'Paris, France',
    description: 'View of Paris from Palais d\'Iéna',
    windyUrl: 'https://www.windy.com/-Webcams-Paris/webcams/1706118429',
    tags: ['Paris', 'France', 'High Alert'],
    highAlert: true,
    shareId: 'paris-iena'
  }
];

// Verify we have all the required locations: Tel Aviv, Tehran, Kyiv, Moscow, Washington DC, Beijing, Seoul, Taipei, London, Pyongyang

/**
 * Lookup object to quickly find webcams by their shareId
 * Used for direct access to webcam data when sharing links
 */
const webcamsByShareId = webcams.reduce((acc, webcam) => {
  acc[webcam.shareId] = webcam;
  return acc;
}, {});

// Export both the array and the lookup object
export const windyWebcams = webcams;
export const windyWebcamsByShareId = webcamsByShareId;

// Lookup object for easier access to Windy webcams by ID
export const windyWebcamsById = windyWebcams.reduce((acc, webcam) => {
  acc[webcam.id] = webcam;
  return acc;
}, {});

// Second declaration of windyWebcamsByShareId removed (was redundant)
