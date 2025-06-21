// Simple script to test the Windy API
// Run with: node testWindyAPI.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  // All webcam IDs from webcamSources.js to test
  const webcamIds = [
    { id: '1693844957', name: 'Moscow Khamovniki District' },
    { id: '1389696188', name: 'Jerusalem City Center' },
    { id: '1748254982', name: 'Tel Aviv Hilton Beach' },
    { id: '1744523397', name: 'Near North Korea Border' },
    { id: '1166267733', name: 'Hong Kong Victoria Harbour' },
    { id: '1596008082', name: 'Beijing Olympic Tower' },
    { id: '1263154384', name: 'Washington D.C. US Capitol' },
    { id: '1731400881', name: 'Taipei 101' },
    { id: '1568461321', name: 'London City Center' },
    { id: '1706118429', name: 'Paris Palais d\'Iéna' },
  ];
  
  console.log('Testing Windy API connection...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    console.log('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }
  
  // Try to fetch all webcams in parallel
  console.log(`Testing ${webcamIds.length} webcam IDs...\n`);
  
  const results = {
    working: [],
    notWorking: []
  };

  // Test each webcam
  const promises = webcamIds.map(webcam => {
    return fetch(`https://api.windy.com/webcams/api/v3/webcams/${webcam.id}`, {
      headers: {
        'x-windy-api-key': apiKey
      }
    })
    .then(response => {
      if (!response.ok) {
        results.notWorking.push({
          id: webcam.id,
          name: webcam.name,
          status: response.status,
          error: response.statusText
        });
        return null;
      }
      return response.json().then(data => {
        results.working.push({
          id: webcam.id,
          name: webcam.name,
          title: data.webcam.title,
          location: `${data.webcam.location?.city || 'Unknown'}, ${data.webcam.location?.country || 'Unknown'}`,
          hasPlayer: !!data.webcam.player?.day?.embed
        });
      });
    })
    .catch(error => {
      results.notWorking.push({
        id: webcam.id,
        name: webcam.name,
        error: error.message
      });
    });
  });

  // Wait for all requests to complete
  await Promise.all(promises);

  // Display results
  console.log('======= TEST RESULTS =======');
  console.log(`✅ WORKING WEBCAMS: ${results.working.length} of ${webcamIds.length}`);
  if (results.working.length > 0) {
    results.working.forEach(cam => {
      console.log(`- ${cam.name} (ID: ${cam.id}): ${cam.title} - ${cam.location}`);
    });
  }
  
  console.log('\n❌ NOT WORKING WEBCAMS: ' + results.notWorking.length);
  if (results.notWorking.length > 0) {
    results.notWorking.forEach(cam => {
      console.log(`- ${cam.name} (ID: ${cam.id}): ${cam.status || 'Error'} - ${cam.error || 'Unknown error'}`);
    });
    
    console.log('\n📋 RECOMMENDATION:');
    if (results.working.length === 0) {
      console.log('ALL webcam IDs are invalid. You need to get updated webcam IDs from Windy.com.');
      console.log('1. Go to https://www.windy.com/webcams');
      console.log('2. Find webcams for your desired locations');
      console.log('3. Extract the webcam IDs from the URLs');
      console.log('4. Update the webcamSources.js file with the new IDs');
    } else {
      console.log('Some webcam IDs work, but others need to be updated:');
      console.log('1. Remove the non-working webcams from webcamSources.js, or');
      console.log('2. Get new IDs from Windy.com for those locations');
    }
  } else {
    console.log('All webcam IDs are valid!');
  }
});
