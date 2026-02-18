const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_SOURCE = path.join(__dirname, '..', '..', 'frontend');
const FRONTEND_BUILD = path.join(FRONTEND_SOURCE, 'build');
const FRONTEND_DEST = path.join(__dirname, '..', 'resources', 'frontend-build');

console.log('🔧 Preparing Frontend for Windows...');
console.log(`Source: ${FRONTEND_SOURCE}`);
console.log(`Build: ${FRONTEND_BUILD}`);
console.log(`Destination: ${FRONTEND_DEST}`);

// Check if build exists
if (!fs.existsSync(FRONTEND_BUILD)) {
  console.log('\n📦 Building frontend...');
  
  // Update .env for local execution
  const envFile = path.join(FRONTEND_SOURCE, '.env');
  if (fs.existsSync(envFile)) {
    let envContent = fs.readFileSync(envFile, 'utf8');
    envContent = envContent.replace(/REACT_APP_BACKEND_URL=.*/g, 'REACT_APP_BACKEND_URL=http://127.0.0.1:8001');
    fs.writeFileSync(envFile, envContent);
    console.log('✓ Updated frontend .env');
  }
  
  try {
    execSync('yarn build', {
      cwd: FRONTEND_SOURCE,
      stdio: 'inherit'
    });
    console.log('✓ Frontend built successfully');
  } catch (error) {
    console.error('❌ Failed to build frontend');
    console.error(error.message);
    process.exit(1);
  }
}

// Copy build to resources
if (fs.existsSync(FRONTEND_BUILD)) {
  // Create destination directory
  if (fs.existsSync(FRONTEND_DEST)) {
    fs.rmSync(FRONTEND_DEST, { recursive: true, force: true });
  }
  fs.mkdirSync(FRONTEND_DEST, { recursive: true });
  
  // Copy files recursively
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursive(FRONTEND_BUILD, FRONTEND_DEST);
  console.log(`✓ Copied frontend build to ${FRONTEND_DEST}`);
} else {
  console.error('❌ Frontend build not found');
  process.exit(1);
}

console.log('\n✅ Frontend preparation complete!');
