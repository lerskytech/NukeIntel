// Diagnostic script to examine Windy API response formats and determine correct usage
// Run with: node diagnosticWindy.js

import('dotenv/config').then(async () => {
  // Define global variables used across functions
  let workingEndpoint;
  let knownWebcamId;
  
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Windy API Diagnostics');
  console.log('====================');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in environment variables');
    console.error('Make sure VITE_WINDY_API_KEY is set in your .env file');
    process.exit(1);
  }
  
  // 1. Test the point-forecast API to verify API key works at all
  console.log('1. Testing Windy Point Forecast API (basic API key validation)');
  try {
    const forecastResponse = await fetch('https://api.windy.com/api/point-forecast/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: 50,
        lon: 14,
        model: 'gfs',
        parameters: ['temp', 'precip'],
        levels: ['surface'],
        key: apiKey
      })
    });
    
    console.log(`   Status: ${forecastResponse.status} ${forecastResponse.statusText}`);
    
    if (forecastResponse.ok) {
      const data = await forecastResponse.json();
      console.log('   ✅ Point forecast API works - API key is valid');
      console.log(`   Response contains data: ${!!data}\n`);
    } else {
      console.log('   ❌ Point forecast API failed - API key might be invalid or expired');
      const text = await forecastResponse.text();
      console.log(`   Error: ${text.substring(0, 100)}...\n`);
    }
  } catch (error) {
    console.error(`   ❌ Error testing point forecast API: ${error.message}\n`);
  }
  
  // 2. Test webcam API base endpoints
  const endpoints = [
    { name: 'Original endpoint', url: 'https://webcams.windy.com/webcams/api/v3/webcams' },
    { name: 'Updated endpoint', url: 'https://api.windy.com/webcams/api/v3/webcams' },
    { name: 'Alternative endpoint 1', url: 'https://api.windy.com/api/webcams/v3/webcams' },
    { name: 'Alternative endpoint 2', url: 'https://api.windy.com/api/webcam/v3/webcams' },
    { name: 'Alternative endpoint 3', url: 'https://api.windy.com/api/v3/webcams' }
  ];
  
  console.log('2. Testing different webcam API endpoints');
  for (const endpoint of endpoints) {
    try {
      console.log(`\n   Testing: ${endpoint.name} (${endpoint.url})`);
      
      // Test with API key in header
      const headerResponse = await fetch(`${endpoint.url}?limit=1`, {
        headers: { 'x-windy-api-key': apiKey }
      });
      
      console.log(`   Header auth status: ${headerResponse.status} ${headerResponse.statusText}`);
      
      // Test with API key as query parameter as well
      const queryResponse = await fetch(`${endpoint.url}?limit=1&key=${apiKey}`);
      
      console.log(`   Query param auth status: ${queryResponse.status} ${queryResponse.statusText}`);
      
      // If either worked, try to get response data
      if (headerResponse.ok || queryResponse.ok) {
        const response = headerResponse.ok ? headerResponse : queryResponse;
        const data = await response.json();
        console.log('   ✅ This endpoint works!');
        
        // Check what kind of data we got back
        if (data.webcams && Array.isArray(data.webcams)) {
          console.log(`   Found ${data.webcams.length} webcams in response`);
          if (data.webcams.length > 0) {
            console.log('   Example webcam data structure:');
            console.log(JSON.stringify(data.webcams[0], null, 2).substring(0, 300) + '...');
          }
        } else if (data.result && data.result.webcams && Array.isArray(data.result.webcams)) {
          console.log(`   Found ${data.result.webcams.length} webcams in response.result`);
          if (data.result.webcams.length > 0) {
            console.log('   Example webcam data structure:');
            console.log(JSON.stringify(data.result.webcams[0], null, 2).substring(0, 300) + '...');
          }
        } else {
          console.log('   Unusual response format:');
          console.log(JSON.stringify(data, null, 2).substring(0, 300) + '...');
        }
        
        // Save the working endpoint
        workingEndpoint = {
          url: endpoint.url,
          authMethod: headerResponse.ok ? 'header' : 'query'
        };
      }
    } catch (error) {
      console.error(`   ❌ Error testing ${endpoint.name}: ${error.message}`);
    }
  }
  
  // 3. Test webcam search functionality if we found a working endpoint
  if (typeof workingEndpoint !== 'undefined') {
    console.log('\n3. Testing webcam search by location');
    
    const locations = ['Moscow', 'London', 'Paris', 'Washington'];
    for (const location of locations) {
      try {
        console.log(`\n   Searching for webcams in "${location}"...`);
        
        let url = `${workingEndpoint.url}?limit=3&search=${encodeURIComponent(location)}`;
        let headers = {};
        
        if (workingEndpoint.authMethod === 'header') {
          headers = { 'x-windy-api-key': apiKey };
        } else {
          url += `&key=${apiKey}`;
        }
        
        const response = await fetch(url, { headers });
        
        console.log(`   Search status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          let webcams = [];
          
          if (data.webcams && Array.isArray(data.webcams)) {
            webcams = data.webcams;
          } else if (data.result && data.result.webcams && Array.isArray(data.result.webcams)) {
            webcams = data.result.webcams;
          }
          
          console.log(`   ✅ Found ${webcams.length} webcams for "${location}"`);
          
          if (webcams.length > 0) {
            console.log('   First webcam:');
            const webcam = webcams[0];
            
            // Print the important fields we need for our app
            if (webcam.id || webcam.webcamId) {
              console.log(`   ID: ${webcam.id || webcam.webcamId}`);
            }
            if (webcam.title) {
              console.log(`   Title: ${webcam.title}`);
            }
            if (webcam.location) {
              console.log(`   Location: ${webcam.location.city}, ${webcam.location.country}`);
              console.log(`   Coordinates: ${webcam.location.latitude}, ${webcam.location.longitude}`);
            }
            if (webcam.player) {
              console.log('   Has player data: Yes');
            }
          }
        } else {
          console.log(`   ❌ Search failed for "${location}"`);
        }
      } catch (error) {
        console.error(`   ❌ Error searching for "${location}": ${error.message}`);
      }
    }
  }
  
  // 4. Check fetching single webcam directly with a known ID
  // (Using webcam ID from response if available)
  if (typeof workingEndpoint !== 'undefined' && typeof knownWebcamId !== 'undefined') {
    console.log('\n4. Testing direct webcam retrieval by ID');
    try {
      console.log(`   Retrieving webcam ID: ${knownWebcamId}...`);
      
      let url = `${workingEndpoint.url}/${knownWebcamId}`;
      let headers = {};
      
      if (workingEndpoint.authMethod === 'header') {
        headers = { 'x-windy-api-key': apiKey };
      } else {
        url += `?key=${apiKey}`;
      }
      
      const response = await fetch(url, { headers });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Successfully retrieved webcam by ID');
      } else {
        console.log('   ❌ Failed to retrieve webcam by ID');
      }
    } catch (error) {
      console.error(`   ❌ Error retrieving webcam by ID: ${error.message}`);
    }
  }
  
  // 5. Final conclusions and recommendations
  console.log('\n======= DIAGNOSTIC CONCLUSIONS =======');
  
  if (typeof workingEndpoint !== 'undefined') {
    console.log('✅ WORKING ENDPOINT FOUND:');
    console.log(`   URL: ${workingEndpoint.url}`);
    console.log(`   Auth method: ${workingEndpoint.authMethod === 'header' ? 'x-windy-api-key header' : 'key query parameter'}`);
    
    console.log('\nRECOMMENDED CHANGES:');
    console.log('1. Update your API endpoint URLs in the codebase');
    console.log(`   From: 'https://webcams.windy.com/webcams/api/v3/webcams'`);
    console.log(`   To:   '${workingEndpoint.url}'`);
    console.log('2. Update your webcam IDs to current ones');
    console.log('3. Make sure API authentication is using the correct method');
  } else {
    console.log('❌ NO WORKING ENDPOINT FOUND');
    console.log('\nRECOMMENDED ACTIONS:');
    console.log('1. Verify your Windy API key is valid and active');
    console.log('2. Contact Windy support to confirm API access and proper endpoints');
    console.log('3. Consider temporarily using static images instead of live webcams');
    console.log('4. Investigate alternative webcam providers if Windy API is permanently changed');
  }
  
  // End of diagnostic script
});
