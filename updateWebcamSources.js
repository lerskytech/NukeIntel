// Script to automatically update webcamSources.js with new webcam IDs
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateWebcamSources() {
  const webcamSourcesPath = path.join(__dirname, 'src', 'data', 'webcamSources.js');
  
  try {
    // New content for webcamSources.js with the webcams we found
    const newContent = `export const webcamSources = [
  {
    id: '1360013045',
    title: 'Brisas de Zicatela: Puerto Escondido',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Puerto Escondido',
    coordinates: '19.0500° N, 104.3167° W',
    label: 'Puerto Escondido'
  },
  {
    id: '1566394308',
    title: 'El Penon › South-West',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'El Penon, Mexico',
    coordinates: '19.4326° N, 99.1332° W',
    label: 'El Penon'
  },
  {
    id: '1748362473',
    title: 'Ampliacion las Chiveras › West: Playa Larga',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Playa Larga, Mexico',
    coordinates: '20.6275° N, 87.0811° W',
    label: 'Playa Larga'
  },
  {
    id: '1639421838',
    title: 'Tel Aviv-Yafo',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Tel Aviv, Israel',
    coordinates: '32.0853° N, 34.7818° E',
    label: 'Tel Aviv'
  },
  {
    id: '1389696188',
    title: 'Jerusalem',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Jerusalem, Israel',
    coordinates: '31.7683° N, 35.2137° E',
    label: 'Jerusalem'
  },
  {
    id: '1306621426',
    title: 'Mexico City: Distrito Federal "Torre Latinoamericana" North',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Mexico City, Mexico',
    coordinates: '19.4326° N, 99.1332° W',
    label: 'Mexico City'
  },
  {
    id: '1602018625',
    title: 'Puerto Morelos: Casa Toucan',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Puerto Morelos, Mexico',
    coordinates: '20.8500° N, 86.8750° W',
    label: 'Puerto Morelos'
  },
  {
    id: '1662455177',
    title: 'Kopra Village',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Kopra Village',
    coordinates: '0.0000° N, 0.0000° E',
    label: 'Kopra Village'
  },
  {
    id: '1727873048',
    title: 'Igrejinha: Rio Paranhana',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Igrejinha, Brazil',
    coordinates: '29.5756° S, 50.7911° W',
    label: 'Igrejinha'
  },
  {
    id: '1662752804',
    title: 'El Posquelite › South: Ajijic',
    type: 'windy',
    refreshRate: 480000, // 8 minutes in milliseconds
    location: 'Ajijic, Mexico',
    coordinates: '20.2886° N, 103.2486° W',
    label: 'Ajijic'
  }
];

// Lookup object for easier access to sources
export const windySources = webcamSources.reduce((acc, src) => {
  if (src.type === 'windy') {
    acc[src.id] = src;
  }
  return acc;
}, {});`;
    
    // Make a backup of the original file
    try {
      const originalContent = await fs.readFile(webcamSourcesPath, 'utf8');
      await fs.writeFile(`${webcamSourcesPath}.backup`, originalContent, 'utf8');
      console.log('✅ Created backup file at src/data/webcamSources.js.backup');
    } catch (backupErr) {
      console.warn('⚠️ Could not create backup file:', backupErr.message);
      console.log('Proceeding anyway...');
    }
    
    // Write the new content to the file
    await fs.writeFile(webcamSourcesPath, newContent, 'utf8');
    console.log('✅ Successfully updated src/data/webcamSources.js with new webcam IDs!');
    console.log('\nNext Steps:');
    console.log('1. Test the webcams to ensure they load correctly');
    console.log('2. Update your hooks/useWindyWebcam.js file to use the new API URL');
    
  } catch (error) {
    console.error('❌ Error updating webcamSources.js:', error.message);
    console.log('Please manually copy the webcam sources from the previous output');
  }
}

updateWebcamSources();
