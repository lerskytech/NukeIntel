/**
 * High Alert Windy Webcams Data Source
 * Defines critical webcams from Windy.com to be displayed in the High Alert section
 */

const webcams = [
  {
    id: '1693844957',
    city: 'Moscow',
    label: 'Kremlin area',
    location: 'Moscow, Russia',
    description: 'Live view near the Kremlin in Khamovniki District',
    windyUrl: 'https://www.windy.com/-Webcams-Khamovniki-District/webcams/1693844957',
    tags: ['Kremlin', 'Russia', 'High Alert'],
    highAlert: true,
    shareId: 'moscow-kremlin'
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
    id: '1578725744',
    city: 'Tehran',
    label: 'City View',
    location: 'Tehran, Iran',
    description: 'Panoramic view of Tehran cityscape',
    windyUrl: 'https://www.windy.com/-Webcams-Tehran/webcams/1578725744',
    tags: ['Tehran', 'Iran', 'High Alert'],
    highAlert: true,
    shareId: 'tehran-view'
  },
  {
    id: '1547367347',
    city: 'Kyiv',
    label: 'Independence Square',
    location: 'Kyiv, Ukraine',
    description: 'Live view of Independence Square (Maidan Nezalezhnosti)',
    windyUrl: 'https://www.windy.com/-Webcams-Kyiv/webcams/1547367347',
    tags: ['Kyiv', 'Ukraine', 'High Alert'],
    highAlert: true,
    shareId: 'kyiv-maidan'
  },
  {
    id: '1163118294',
    city: 'Seoul',
    label: 'City Skyline',
    location: 'Seoul, South Korea',
    description: 'Panoramic view of Seoul city center',
    windyUrl: 'https://www.windy.com/-Webcams-Seoul/webcams/1163118294',
    tags: ['Seoul', 'South Korea', 'High Alert'],
    highAlert: true,
    shareId: 'seoul-skyline'
  },
  {
    id: '1744523397',
    city: 'Pyongyang',
    label: 'Border View',
    location: 'Near Pyongyang, North Korea',
    description: 'Closest available view to Pyongyang from border area',
    windyUrl: 'https://www.windy.com/-Webcams-Jeokseong-myeon/webcams/1744523397',
    tags: ['Pyongyang', 'North Korea', 'DMZ', 'High Alert'],
    highAlert: true,
    shareId: 'pyongyang-view'
  },
  {
    id: '1596008082',
    city: 'Beijing',
    label: 'Olympic Tower',
    location: 'Beijing, China',
    description: 'View from the Olympic Tower in Beijing',
    windyUrl: 'https://www.windy.com/-Webcams-Huayuanlu-Subdistrict-%E5%8C%97%E4%BA%AC%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E5%A1%94/webcams/1596008082',
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
    label: 'City View',
    location: 'London, UK',
    description: 'Panoramic view of central London',
    windyUrl: 'https://www.windy.com/-Webcams-London/webcams/1568461321',
    tags: ['London', 'UK', 'High Alert'],
    highAlert: true,
    shareId: 'london-view'
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
