const fs = require('fs');
const { execSync } = require('child_process');

// Create a simple conversion using FBX2glTF
try {
  console.log('Converting FBX to GLB...');
  
  // Try using FBX2glTF (if available)
  execSync('fbx2gltf "attached_assets/Small Office_1749699593499.fbx" --output "client/public/models/office.glb"', {
    stdio: 'inherit'
  });
  
  console.log('Conversion complete!');
} catch (error) {
  console.log('FBX2glTF not available, trying alternative method...');
  
  // Alternative: Copy the FBX file and load it directly with proper loader
  fs.copyFileSync('attached_assets/Small Office_1749699593499.fbx', 'client/public/models/office.fbx');
  console.log('FBX file copied to public directory');
}