// Script to retrieve the most popular webcams from Windy API
// to replace the existing invalid webcams
import('dotenv/config').then(async () => {
  const apiKey = process.env.VITE_WINDY_API_KEY;
  
  console.log('Finding popular webcams for your application...');
  console.log(`API Key available: ${apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No'}\n`);
  
  if (!apiKey) {
    console.error('❌ ERROR: No API key found in .env file');
    process.exit(1);
  }

  // The working API endpoint we identified
  const apiUrl = 'https://api.windy.com/webcams/api/v3/webcams';
  
  try {
    console.log('Fetching most popular webcams from Windy API...');
    
    const response = await fetch(`${apiUrl}?limit=30&orderby=popularity`, {
      headers: {
        'x-windy-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const webcams = data.webcams || [];
    
    console.log(`Retrieved ${webcams.length} popular webcams`);
    
    if (webcams.length === 0) {
      throw new Error('No webcams returned from API');
    }
    
    // Let's select 10 good webcams with diverse locations
    const selectedWebcams = [];
    const usedCountries = new Set();
    
    // First pass: Select webcams from different countries
    for (const webcam of webcams) {
      // Skip webcams without titles
      if (!webcam.title) continue;
      
      // Extract location from title
      const titleParts = webcam.title.split(/: |, /);
      let location = titleParts.length > 1 ? titleParts[1] : titleParts[0];
      let country = '';
      
      // Try to extract country from title
      if (webcam.title.includes(', ')) {
        const parts = webcam.title.split(', ');
        if (parts.length > 1) {
          country = parts[parts.length - 1];
        }
      }
      
      // If we've already used this country, skip to ensure diversity
      if (country && usedCountries.has(country)) continue;
      
      // Add to our selected webcams
      selectedWebcams.push({
        id: webcam.webcamId.toString(),
        title: webcam.title,
        location: location + (country ? `, ${country}` : ''),
        country: country || 'Unknown',
        label: titleParts[0]
      });
      
      // Track which countries we've used
      if (country) {
        usedCountries.add(country);
      }
      
      // Once we have 10 webcams, stop
      if (selectedWebcams.length >= 10) break;
    }
    
    // If we don't have enough diverse webcams, add more regardless of country
    if (selectedWebcams.length < 10) {
      for (const webcam of webcams) {
        if (!webcam.title) continue;
        
        // Skip webcams we've already selected
        if (selectedWebcams.some(w => w.id === webcam.webcamId.toString())) continue;
        
        const titleParts = webcam.title.split(/: |, /);
        let location = titleParts.length > 1 ? titleParts[1] : titleParts[0];
        
        selectedWebcams.push({
          id: webcam.webcamId.toString(),
          title: webcam.title,
          location: location,
          country: 'Unknown',
          label: titleParts[0]
        });
        
        if (selectedWebcams.length >= 10) break;
      }
    }
    
    // Generate coordinates for each webcam (approximate, since we don't have actual coordinates)
    const defaultCoordinates = {
      "United States": "38.8951° N, 77.0364° W", // Washington DC
      "Russia": "55.7558° N, 37.6173° E",        // Moscow
      "Israel": "31.7683° N, 35.2137° E",        // Jerusalem
      "South Korea": "37.5665° N, 126.9780° E",  // Seoul
      "China": "39.9042° N, 116.4074° E",        // Beijing
      "Taiwan": "25.0330° N, 121.5654° E",       // Taipei
      "UK": "51.5074° N, 0.1278° W",             // London
      "France": "48.8566° N, 2.3522° E",         // Paris
      "Unknown": "0.0000° N, 0.0000° E"          // Default
    };
    
    // Add coordinates to each webcam
    for (const webcam of selectedWebcams) {
      let coordinates = defaultCoordinates["Unknown"];
      
      // Try to match country with our default coordinates
      for (const [country, coords] of Object.entries(defaultCoordinates)) {
        if (webcam.country.includes(country) || webcam.location.includes(country)) {
          coordinates = coords;
          break;
        }
      }
      
      webcam.coordinates = coordinates;
    }
    
    console.log(`\nSelected ${selectedWebcams.length} webcams for your app\n`);
    
    // Generate webcamSources.js content
    console.log('FORMAT FOR webcamSources.js:');
    console.log('export const webcamSources = [');
    
    selectedWebcams.forEach((cam, index) => {
      console.log(`  {
    id: '${cam.id}',
    title: '${cam.title.replace(/'/g, "\\'")}',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: '${cam.location.replace(/'/g, "\\'")}',
    coordinates: '${cam.coordinates}',
    label: '${cam.label.replace(/'/g, "\\'")}'
  }${index < selectedWebcams.length - 1 ? ',' : ''}`);
    });
    
    console.log('];');
    
    console.log('\n// Lookup object for easier access to sources');
    console.log('export const windySources = webcamSources.reduce((acc, src) => {');
    console.log('  if (src.type === \'windy\') {');
    console.log('    acc[src.id] = src;');
    console.log('  }');
    console.log('  return acc;');
    console.log('}, {});');
    
    // Check if we should create the updated file automatically
    console.log('\nWould you like to automatically update webcamSources.js with these new webcams?');
    console.log('Run: node updateWebcamSources.js');
    
    // Create a helper script to automatically update the file
    console.log('\nCreating updateWebcamSources.js to help you update your webcam sources...');
    
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const updateScript = `// Script to automatically update webcamSources.js with new webcam IDs
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function updateWebcamSources() {
  const webcamSourcesPath = join(__dirname, 'src', 'data', 'webcamSources.js');
  
  try {
    // New content for webcamSources.js
    const newContent = \`export const webcamSources = [
${selectedWebcams.map((cam, index) => `  {
    id: '${cam.id}',
    title: '${cam.title.replace(/'/g, "\\\\'")}',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: '${cam.location.replace(/'/g, "\\\\'")}',
    coordinates: '${cam.coordinates}',
    label: '${cam.label.replace(/'/g, "\\\\'")}'
  }${index < selectedWebcams.length - 1 ? ',' : ''}`).join('\n')}
];

// Lookup object for easier access to sources
export const windySources = webcamSources.reduce((acc, src) => {
  if (src.type === 'windy') {
    acc[src.id] = src;
  }
  return acc;
}, {});\`;
    
    // Make a backup of the original file
    try {
      const originalContent = await fs.readFile(webcamSourcesPath, 'utf8');
      await fs.writeFile(webcamSourcesPath + '.backup', originalContent, 'utf8');
      console.log('✅ Created backup file at src/data/webcamSources.js.backup');
    } catch (backupErr) {
      console.warn('⚠️ Could not create backup file:', backupErr.message);
      console.log('Proceeding anyway...');
    }
    
    // Write the new content to the file
    await fs.writeFile(webcamSourcesPath, newContent, 'utf8');
    console.log('✅ Successfully updated src/data/webcamSources.js with new webcam IDs!');
    console.log('Next Steps:');
    console.log('1. Restart your development server if running');
    console.log('2. Test the webcams to ensure they load correctly');
    
  } catch (error) {
    console.error('❌ Error updating webcamSources.js:', error.message);
    console.log('Please manually copy the webcam sources from the previous output');
  }
}

updateWebcamSources();
`;
    
    await fs.writeFile(join(process.cwd(), 'updateWebcamSources.js'), updateScript, 'utf8');
    console.log('✅ Created updateWebcamSources.js');
    
  } catch (error) {
    console.error('❌ Error retrieving webcams:', error.message);
    console.log('\nTROUBLESHOOTING STEPS:');
    console.log('1. Check if your Windy API key is valid or needs to be renewed');
    console.log('2. Verify internet connectivity');
    console.log('3. Consider contacting Windy support if issues persist');
  }
});
