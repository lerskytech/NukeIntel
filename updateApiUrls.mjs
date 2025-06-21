// Script to update API URLs in the useWindyWebcam.js file (ES module version)
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function updateApiUrls() {
  try {
    const filePath = join(__dirname, 'src', 'hooks', 'useWindyWebcam.js');

    // Read the current file content
    const data = await fs.readFile(filePath, 'utf8');

    // Replace all instances of the old URL with the new one
    const oldUrl = 'https://webcams.windy.com/webcams/api/v3/webcams';
    const newUrl = 'https://api.windy.com/webcams/api/v3/webcams';
    
    // Update the content
    const updatedContent = data.replace(
      new RegExp(oldUrl.replace(/\//g, '\\/'), 'g'),
      newUrl
    );

    // Check if any replacements were made
    if (data === updatedContent) {
      console.log('No URLs needed to be updated');
      return;
    }

    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log('Successfully updated API URLs in useWindyWebcam.js');
    
    // Also update our test script
    await updateTestScript();
  } catch (err) {
    console.error('Error updating API URLs:', err);
  }
}

// Function to update our test script with the new URL
async function updateTestScript() {
  try {
    const testScriptPath = join(__dirname, 'testWindyAPI.js');
    
    const data = await fs.readFile(testScriptPath, 'utf8');
    
    // Update the test script to use the new URL too
    const updatedScript = data.replace(
      'https://webcams.windy.com/webcams/api/v3/webcams',
      'https://api.windy.com/webcams/api/v3/webcams'
    );
    
    await fs.writeFile(testScriptPath, updatedScript, 'utf8');
    console.log('Successfully updated test script with new URL');
  } catch (err) {
    console.error('Error updating test script:', err);
  }
}

// Run the update function
updateApiUrls();
