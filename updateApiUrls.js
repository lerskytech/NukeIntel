// Script to update API URLs in the useWindyWebcam.js file
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'hooks', 'useWindyWebcam.js');

// Read the current file content
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

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
  fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated API URLs in useWindyWebcam.js');
    
    // Also update our list of webcams to check if they exist now
    updateWebcamIds();
  });
});

// Function to update our test script with working IDs
function updateWebcamIds() {
  const testScriptPath = path.join(__dirname, 'testWindyAPI.js');
  
  fs.readFile(testScriptPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading test script:', err);
      return;
    }
    
    // Update the test script to use the new URL too
    const updatedScript = data.replace(
      'https://webcams.windy.com/webcams/api/v3/webcams',
      'https://api.windy.com/webcams/api/v3/webcams'
    );
    
    fs.writeFile(testScriptPath, updatedScript, 'utf8', (err) => {
      if (err) {
        console.error('Error updating test script:', err);
        return;
      }
      console.log('Successfully updated test script with new URL');
    });
  });
}
