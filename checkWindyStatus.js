// Simple script to test the Windy API base functionality
// Run with: node checkWindyStatus.js

import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Checking Windy API status and connection...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  // Check main Windy API (not webcams specifically)
  try {
    console.log('1. Testing basic Windy API connection...');
    const response = await fetch('https://api.windy.com/api/point-forecast/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat: 50,
        lon: 14,
        model: 'gfs',
        parameters: ['temp', 'precip'],
        levels: ['surface'],
        key: apiKey
      })
    });
    
    console.log(`   Response status: ${response.status} ${response.statusText}`);
    console.log(`   Is this a Windy API response? ${response.headers.has('server') ? 'Yes' : 'Unknown'}\n`);
    
    // Try just accessing the webcams domain to see if it exists
    console.log('2. Testing Windy Webcams domain...');
    const domainCheck = await fetch('https://webcams.windy.com/', {
      method: 'GET'
    });
    
    console.log(`   Domain response: ${domainCheck.status} ${domainCheck.statusText}`);
    console.log(`   Is domain accessible? ${domainCheck.ok ? 'Yes' : 'No'}\n`);
    
    // Try alternative endpoint format
    console.log('3. Testing alternative webcam endpoint formats...');
    const alt1 = await fetch(`https://api.windy.com/webcams/api/v3/webcams?limit=1`, {
      headers: { 'x-windy-api-key': apiKey }
    });
    console.log(`   Format 1 response: ${alt1.status} ${alt1.statusText}`);
    
    const alt2 = await fetch(`https://api.windy.com/api/webcams/v3/webcams?limit=1`, {
      headers: { 'x-windy-api-key': apiKey }
    });
    console.log(`   Format 2 response: ${alt2.status} ${alt2.statusText}`);
    
    console.log('\n======= CONCLUSIONS =======');
    console.log('Based on these tests:');
    
    if (alt1.ok || alt2.ok) {
      console.log('✅ Found a working endpoint format for Windy Webcams API!');
    } else if (domainCheck.ok) {
      console.log('⚠️ The webcams.windy.com domain is accessible, but all API endpoints return errors.');
      console.log('   This likely means the API has changed or your key needs to be updated.');
    } else {
      console.log('❌ The Windy Webcams API appears to be unavailable or discontinued.');
      console.log('   You may need to switch to an alternative webcam service.');
      console.log('\nRECOMMENDED ACTIONS:');
      console.log('1. Check if your Windy API key needs to be renewed');
      console.log('2. Review the latest Windy API documentation for changes');
      console.log('3. Consider implementing a fallback to static images or an alternative webcam provider');
    }
  } catch (error) {
    console.error(`Error during API checks: ${error.message}`);
  }
});
