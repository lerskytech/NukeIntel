// Script to find new working webcams on Windy.com
// Run with: node findNewWebcams.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Searching for new webcams on Windy.com...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    console.log('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }

  // First, let's check if the API endpoints work at all by retrieving some random webcams
  try {
    console.log('Testing API connection with newest webcams...');
    const testResponse = await fetch('https://api.windy.com/webcams/api/v3/webcams?limit=5&orderby=newest', {
      headers: {
        'x-windy-api-key': apiKey
      }
    });
    
    if (!testResponse.ok) {
      console.error(`❌ API Error: ${testResponse.status} ${testResponse.statusText}`);
      console.log('The API might be down or your key might be invalid.');
      process.exit(1);
    }
    
    const testData = await testResponse.json();
    console.log(`✅ API Connection successful! Retrieved ${testData.webcams?.length || 0} test webcams.`);
    
    // If we got data, show a sample webcam
    if (testData.webcams && testData.webcams.length > 0) {
      const sample = testData.webcams[0];
      console.log('\nSample webcam data:');
      console.log(`- ID: ${sample.id}`);
      console.log(`- Title: ${sample.title}`);
      console.log(`- Location: ${sample.location?.city}, ${sample.location?.country}`);
      console.log(`- URL: https://www.windy.com/webcams/${sample.id}`);
    }
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    console.log('Unable to connect to Windy API. Please check your internet connection and API key.');
    process.exit(1);
  }
  
  // Locations we want to find webcams for
  const targetLocations = [
    { name: 'Moscow', country: 'Russia' },
    { name: 'Jerusalem', country: 'Israel' },
    { name: 'Tel Aviv', country: 'Israel' },
    { name: 'South Korea', country: '' }, // For North Korea border area
    { name: 'Hong Kong', country: '' },
    { name: 'Beijing', country: 'China' },
    { name: 'Washington', country: 'USA' },
    { name: 'Taipei', country: 'Taiwan' },
    { name: 'London', country: 'UK' },
    { name: 'Paris', country: 'France' }
  ];
  
  // Results array to hold the found webcams
  const foundWebcams = [];
  
  // Search for webcams in each location
  console.log('\n=== SEARCHING FOR WEBCAMS BY LOCATION ===');
  for (const location of targetLocations) {
    const searchQuery = location.country ? 
      `${location.name}, ${location.country}` : 
      location.name;
      
    console.log(`\nSearching for webcams in "${searchQuery}"...`);
    
    try {
      // Build the search query - we'll search by location name and limit to top 3 results
      let queryUrl = `https://api.windy.com/webcams/api/v3/webcams?limit=3`;
      
      // Add location filters
      if (location.name) {
        queryUrl += `&search=${encodeURIComponent(location.name)}`;
      }
      if (location.country) {
        queryUrl += `&country=${encodeURIComponent(location.country)}`;
      }
      
      // Add includes for more data
      queryUrl += '&include=location,images,player';
      
      const response = await fetch(queryUrl, {
        headers: {
          'x-windy-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        console.log(`  ❌ Error searching for "${searchQuery}": ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      const webcams = data.webcams || [];
      
      if (webcams.length === 0) {
        console.log(`  ⚠️ No webcams found for "${searchQuery}"`);
        continue;
      }
      
      console.log(`  ✅ Found ${webcams.length} webcams for "${searchQuery}"`);
      
      // Process each webcam and add to our results
      webcams.forEach(webcam => {
        // Only include webcams with player data
        if (webcam.player?.day?.embed) {
          // Calculate coordinates display
          const lat = webcam.location?.latitude || 0;
          const lng = webcam.location?.longitude || 0;
          const coordinates = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
          
          // Create a label from the title
          const titleParts = webcam.title.split(' - ');
          const label = titleParts.length > 1 ? titleParts[1] : titleParts[0];
          
          // Add to found webcams
          foundWebcams.push({
            id: webcam.id,
            title: webcam.title,
            location: `${webcam.location?.city || location.name}, ${webcam.location?.country || location.country}`,
            coordinates,
            label,
            url: `https://www.windy.com/webcams/${webcam.id}`
          });
          
          console.log(`    - ${webcam.title} (ID: ${webcam.id})`);
        }
      });
    } catch (error) {
      console.error(`  ❌ Error searching for "${searchQuery}":`, error.message);
    }
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Display the results in the format needed for webcamSources.js
  console.log('\n\n======= WEBCAM SOURCES FOR YOUR APP =======');
  console.log(`Found ${foundWebcams.length} working webcams that can be used in your app\n`);
  
  if (foundWebcams.length > 0) {
    console.log('FORMAT FOR webcamSources.js:');
    console.log('export const webcamSources = [');
    
    foundWebcams.forEach((cam, index) => {
      console.log(`  {
    id: '${cam.id}',
    title: '${cam.title.replace(/'/g, "\\'")}',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: '${cam.location.replace(/'/g, "\\'")}',
    coordinates: '${cam.coordinates}',
    label: '${cam.label.replace(/'/g, "\\'")}'
  }${index < foundWebcams.length - 1 ? ',' : ''}`);
    });
    
    console.log('];');
    
    console.log('\n// Lookup object for easier access to sources');
    console.log('export const windySources = webcamSources.reduce((acc, src) => {');
    console.log('  if (src.type === \'windy\') {');
    console.log('    acc[src.id] = src;');
    console.log('  }');
    console.log('  return acc;');
    console.log('}, {});');
    
    // Also provide instructions
    console.log('\n\nINSTRUCTIONS:');
    console.log('1. Copy the code above and replace the entire contents of src/data/webcamSources.js');
    console.log('2. Also update src/data/windyWebcams.js if needed with the same IDs');
    console.log('3. Make sure to save the files and restart your dev server');
    console.log('4. Test the webcams to ensure they load correctly');
  } else {
    console.log('❌ No working webcams found. Please try these troubleshooting steps:');
    console.log('1. Check if your Windy API key is valid or needs to be renewed');
    console.log('2. Try different search terms or locations');
    console.log('3. Check if the Windy webcams service is still available');
  }
});
