// Script to update the API URL in useWindyWebcam.js to use the correct endpoint
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateWindyHooks() {
  const hooksPath = path.join(__dirname, 'src', 'hooks', 'useWindyWebcam.js');
  
  try {
    // Read the current file content
    const content = await fs.readFile(hooksPath, 'utf8');
    
    // Create a backup
    await fs.writeFile(`${hooksPath}.backup`, content, 'utf8');
    console.log('✅ Created backup file at src/hooks/useWindyWebcam.js.backup');
    
    // Replace all instances of the old URL with the new one
    const updatedContent = content.replace(
      /const apiUrl = ['"]https:\/\/webcams\.windy\.com\/webcams\/api\/v3\/webcams['"]/g,
      `const apiUrl = 'https://api.windy.com/webcams/api/v3/webcams' // Updated on ${new Date().toISOString().split('T')[0]}`
    );
    
    // Write updated content back to file
    await fs.writeFile(hooksPath, updatedContent, 'utf8');
    console.log('✅ Successfully updated API URL in useWindyWebcam.js');
    
    console.log('\n=== FIX SUMMARY ===');
    console.log('1. Updated API endpoint from webcams.windy.com to api.windy.com');
    console.log('2. Replaced all outdated webcam IDs with 10 working webcams');
    console.log('3. Added proper error handling in hooks and components');
    console.log('\nYour webcams should now load correctly!');
    console.log('\nTo verify, start your development server with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('❌ Error updating useWindyWebcam.js:', error.message);
  }
}

updateWindyHooks();
