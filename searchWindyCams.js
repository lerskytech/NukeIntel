// Script to search for available webcams on Windy by location
// Run with: node searchWindyCams.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  // Cities we want to search for webcams in
  const locations = [
    'Moscow, Russia',
    'Jerusalem, Israel',
    'Tel Aviv, Israel',
    'Seoul, South Korea',  // Near North Korea border
    'Hong Kong',
    'Beijing, China',
    'Washington DC, USA',
    'Taipei, Taiwan',
    'London, UK',
    'Paris, France'
  ];
  
  console.log('Searching for webcams in specified locations...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    console.log('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }
  
  const results = [];
  
  // Search for each location
  for (const location of locations) {
    console.log(`Searching for webcams in "${location}"...`);
    
    try {
      // Search by location name - limit to 5 results per location
      const response = await fetch(`https://webcams.windy.com/webcams/api/v3/webcams?country=&query=${encodeURIComponent(location)}&limit=5`, {
        headers: {
          'x-windy-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        console.error(`  ❌ Error searching for "${location}": ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      const webcams = data.webcams || [];
      
      if (webcams.length === 0) {
        console.log(`  ⚠️ No webcams found for "${location}"`);
        continue;
      }
      
      // Add webcams to results
      webcams.forEach(cam => {
        results.push({
          id: cam.id,
          title: cam.title,
          location: `${cam.location?.city || 'Unknown'}, ${cam.location?.country || 'Unknown'}`,
          coordinates: `${cam.location?.latitude}° ${cam.location?.latitude > 0 ? 'N' : 'S'}, ${cam.location?.longitude}° ${cam.location?.longitude > 0 ? 'E' : 'W'}`,
          hasPlayer: !!cam.player?.day?.embed
        });
      });
      
      console.log(`  ✅ Found ${webcams.length} webcams for "${location}"`);
      
    } catch (error) {
      console.error(`  ❌ Error searching for "${location}": ${error.message}`);
    }
    
    // Short delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Display results
  console.log('\n======= SEARCH RESULTS =======');
  console.log(`Found ${results.length} total webcams that can be used in your app\n`);
  
  if (results.length > 0) {
    console.log('FORMAT FOR webcamSources.js:');
    console.log('-----------------------------');
    
    results.forEach((cam, index) => {
      console.log(`  {
    id: '${cam.id}',
    title: '${cam.title.replace(/'/g, "\\'")}',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: '${cam.location.replace(/'/g, "\\'")}',
    coordinates: '${cam.coordinates}',
    label: '${cam.title.replace(/'/g, "\\'").split(' - ')[1] || cam.title.replace(/'/g, "\\'").split(' ')[0]}'
  }${index < results.length - 1 ? ',' : ''}`);
    });
    
    console.log('\nCopy and paste these entries into your webcamSources.js file');
    console.log('Make sure to update your windyWebcams.js file as well if needed');
  } else {
    console.log('No webcams found. Try searching for different locations or check your API key.');
  }
});
