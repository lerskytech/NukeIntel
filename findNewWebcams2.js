// Updated script to find new working webcams on Windy.com
// Run with: node findNewWebcams2.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Searching for new webcams on Windy.com...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    console.log('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }

  // First, let's check what the API returns with a simple request
  try {
    console.log('Testing API format with a sample webcam...');
    const testResponse = await fetch('https://api.windy.com/webcams/api/v3/webcams?limit=1', {
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
    console.log('✅ API Connection successful!');
    
    // Display the raw response to understand its structure
    console.log('\nAPI Response Structure:');
    console.log(JSON.stringify(testData, null, 2).substring(0, 1000) + '...');
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
    { name: 'Seoul', country: 'South Korea' }, // For North Korea border area
    { name: 'Hong Kong', country: 'China' },
    { name: 'Beijing', country: 'China' },
    { name: 'Washington', country: 'USA' },
    { name: 'Taipei', country: 'Taiwan' },
    { name: 'London', country: 'UK' },
    { name: 'Paris', country: 'France' }
  ];
  
  // Try direct IDs that might work - sampling popular webcams for these places
  console.log('\nTrying some specific popular webcams directly...');
  
  const possibleWebcamIds = [
    // Moscow
    '1673479530', '1456414151', '1462969478',
    // Jerusalem
    '1552266015', '1201336734', '1239232378',
    // Tel Aviv
    '1276922045', '1495905879', '1476130278',
    // South Korea
    '1391919118', '1672855241', '1559901836',
    // Hong Kong
    '1496193821', '1199564522', '1634473982',
    // Beijing
    '1396557034', '1463317162', '1433519491',
    // Washington DC
    '1578947118', '1558579544', '1624117539',
    // Taipei
    '1339616177', '1245230367', '1504353334',
    // London
    '1183968234', '1414267765', '1414233396',
    // Paris
    '1412244246', '1463046586', '1176726258'
  ];
  
  const foundWebcams = [];
  
  // Check each webcam ID directly
  for (const webcamId of possibleWebcamIds) {
    try {
      console.log(`Testing webcam ID: ${webcamId}...`);
      
      const response = await fetch(`https://api.windy.com/webcams/api/v3/webcams/${webcamId}`, {
        headers: {
          'x-windy-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        console.log(`  ❌ Invalid webcam ID: ${webcamId} (${response.status})`);
        continue;
      }
      
      const data = await response.json();
      if (!data.webcam) {
        console.log(`  ❌ No webcam data returned for ID: ${webcamId}`);
        continue;
      }
      
      // Extract webcam information
      const webcam = data.webcam;
      
      // Check if we get enough information to use this webcam
      if (webcam.title) {
        console.log(`  ✅ Valid webcam: ${webcam.title}`);
        
        // Get location information
        const city = webcam.location?.city || 'Unknown';
        const country = webcam.location?.country || 'Unknown';
        const location = `${city}, ${country}`;
        
        // Get coordinates
        const lat = webcam.location?.latitude || 0;
        const lng = webcam.location?.longitude || 0;
        const coordinates = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
        
        // Create a label from the title
        let label = webcam.title;
        if (label.includes(' - ')) {
          label = label.split(' - ')[1];
        } else if (label.includes(': ')) {
          label = label.split(': ')[1];
        } else {
          label = label.split(' ')[0];
        }
        
        // Add to found webcams
        foundWebcams.push({
          id: webcamId,
          title: webcam.title,
          location: location,
          coordinates: coordinates,
          label: label,
          status: 'working'
        });
        
        // If we have 10 working webcams (one for each location), we can stop
        if (foundWebcams.length >= 10) {
          break;
        }
      } else {
        console.log(`  ⚠️ Webcam has missing data: ${webcamId}`);
      }
    } catch (error) {
      console.error(`  ❌ Error testing webcam ${webcamId}:`, error.message);
    }
    
    // Short delay between requests
    await new Promise(resolve => setTimeout(resolve, 300));
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
  } else {
    console.log('❌ No working webcams found. Please try these troubleshooting steps:');
    console.log('1. Check if your Windy API key is valid or needs to be renewed');
    console.log('2. Try different search terms or locations');
    console.log('3. Consider using an alternative webcam provider if Windy is no longer available');
  }
});
