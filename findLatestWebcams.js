// Script to find latest available webcams on Windy.com based on the new API format
// Run with: node findLatestWebcams.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Finding latest available webcams on Windy.com...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    console.log('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }

  // Locations we want to find webcams for
  const targetLocations = [
    { name: 'Moscow', country: 'Russia' },
    { name: 'Jerusalem', country: 'Israel' },
    { name: 'Tel Aviv', country: 'Israel' },
    { name: 'Seoul', country: 'South Korea' },
    { name: 'Hong Kong', country: 'China' },
    { name: 'Beijing', country: 'China' },
    { name: 'Washington', country: 'United States' },
    { name: 'Taipei', country: 'Taiwan' },
    { name: 'London', country: 'United Kingdom' },
    { name: 'Paris', country: 'France' }
  ];
  
  const foundWebcams = [];
  
  // First get a list of available webcams using the new API format
  try {
    console.log('Fetching latest webcams from Windy API...');
    
    // Get popular webcams first as they're most likely to be maintained
    const response = await fetch('https://api.windy.com/webcams/api/v3/webcams?limit=100&orderby=popularity', {
      headers: {
        'x-windy-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      console.log('The API might be down or your key might be invalid.');
      process.exit(1);
    }
    
    const data = await response.json();
    const webcams = data.webcams || [];
    
    console.log(`Retrieved ${webcams.length} webcams from API`);
    
    // Get details for each webcam and match to our target locations
    for (const location of targetLocations) {
      console.log(`\nFinding webcams for ${location.name}, ${location.country}...`);
      
      // Find webcams that match this location
      const matchingWebcams = webcams.filter(webcam => {
        const title = webcam.title?.toLowerCase() || '';
        const hasLocationName = title.includes(location.name.toLowerCase());
        return hasLocationName;
      });
      
      if (matchingWebcams.length === 0) {
        console.log(`  ⚠️ No webcams found for ${location.name} in the top results`);
        continue;
      }
      
      // Use the first matching webcam for this location
      const selectedWebcam = matchingWebcams[0];
      console.log(`  ✅ Found webcam: ${selectedWebcam.title} (ID: ${selectedWebcam.webcamId})`);
      
      // Get detailed information for this webcam
      const detailResponse = await fetch(`https://api.windy.com/webcams/api/v3/webcams/${selectedWebcam.webcamId}`, {
        headers: {
          'x-windy-api-key': apiKey
        }
      });
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        const webcamDetail = detailData.webcam;
        
        if (webcamDetail) {
          // Default coordinates if not available
          const lat = webcamDetail.location?.latitude || 0;
          const lng = webcamDetail.location?.longitude || 0;
          const coordinates = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
          
          // Create webcam entry
          foundWebcams.push({
            id: selectedWebcam.webcamId.toString(),
            title: selectedWebcam.title,
            type: 'windy',
            refreshRate: 480000, // 8 minutes in milliseconds
            location: `${location.name}, ${location.country}`,
            coordinates: coordinates,
            label: location.name
          });
        }
      } else {
        console.log(`  ⚠️ Could not get details for webcam ID ${selectedWebcam.webcamId}`);
      }
      
      // Short delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // If we still need more webcams, let's search specifically for each location
    if (foundWebcams.length < targetLocations.length) {
      console.log('\nSearching for additional webcams by location name...');
      
      for (const location of targetLocations) {
        // Skip if we already found a webcam for this location
        if (foundWebcams.some(w => w.location.includes(location.name))) {
          continue;
        }
        
        console.log(`\nSearching for webcams in "${location.name}"...`);
        
        const searchResponse = await fetch(
          `https://api.windy.com/webcams/api/v3/webcams?limit=5&search=${encodeURIComponent(location.name)}`,
          {
            headers: {
              'x-windy-api-key': apiKey
            }
          }
        );
        
        if (!searchResponse.ok) {
          console.log(`  ⚠️ Search failed for ${location.name}: ${searchResponse.status}`);
          continue;
        }
        
        const searchData = await searchResponse.json();
        const searchResults = searchData.webcams || [];
        
        if (searchResults.length === 0) {
          console.log(`  ⚠️ No webcams found for ${location.name} in search`);
          continue;
        }
        
        // Use the first result
        const selectedWebcam = searchResults[0];
        console.log(`  ✅ Found webcam: ${selectedWebcam.title} (ID: ${selectedWebcam.webcamId})`);
        
        // Add to our list
        foundWebcams.push({
          id: selectedWebcam.webcamId.toString(),
          title: selectedWebcam.title,
          type: 'windy',
          refreshRate: 480000, // 8 minutes in milliseconds
          location: `${location.name}, ${location.country}`, 
          coordinates: '0.0000° N, 0.0000° E', // Default as we don't have details
          label: location.name
        });
        
        // Short delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  } catch (error) {
    console.error('❌ Error finding webcams:', error.message);
  }
  
  // Display the results in the format needed for webcamSources.js
  console.log('\n\n======= WEBCAM SOURCES FOR YOUR APP =======');
  console.log(`Found ${foundWebcams.length} webcams that can be used in your app\n`);
  
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
    console.log('2. Make sure to save the file and restart your dev server');
    console.log('3. Test the webcams to ensure they load correctly');
  } else {
    console.log('❌ No working webcams found. Windy may have changed their API format or restricted access.');
    console.log('\nTROUBLESHOOTING STEPS:');
    console.log('1. Check if your Windy API key is valid or needs to be renewed');
    console.log('2. Consider contacting Windy support for guidance on their updated API');
    console.log('3. Consider using an alternative webcam provider if Windy is no longer suitable');
  }
});
