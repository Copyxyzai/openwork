const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const MONGODB_VERSION = '8.0.4';
const MONGODB_DOWNLOAD_URL = `https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-${MONGODB_VERSION}.zip`;
const RESOURCES_DIR = path.join(__dirname, '..', 'resources');
const MONGODB_ZIP = path.join(RESOURCES_DIR, 'mongodb.zip');
const MONGODB_DEST = path.join(RESOURCES_DIR, 'mongodb');

console.log('🔧 Preparing MongoDB Portable for Windows...');
console.log(`Download URL: ${MONGODB_DOWNLOAD_URL}`);
console.log(`Destination: ${MONGODB_DEST}`);

// Create resources directory
if (!fs.existsSync(RESOURCES_DIR)) {
  fs.mkdirSync(RESOURCES_DIR, { recursive: true });
}

// Check if already exists
if (fs.existsSync(MONGODB_DEST) && fs.existsSync(path.join(MONGODB_DEST, 'bin', 'mongod.exe'))) {
  console.log('✓ MongoDB already prepared');
  process.exit(0);
}

// Download MongoDB
console.log('\n⬇️  Downloading MongoDB (this may take several minutes)...');

const file = fs.createWriteStream(MONGODB_ZIP);
let receivedBytes = 0;
let totalBytes = 0;

https.get(MONGODB_DOWNLOAD_URL, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Follow redirect
    https.get(response.headers.location, (redirectResponse) => {
      totalBytes = parseInt(redirectResponse.headers['content-length'], 10);
      console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

      redirectResponse.on('data', (chunk) => {
        receivedBytes += chunk.length;
        const progress = ((receivedBytes / totalBytes) * 100).toFixed(2);
        process.stdout.write(`\rProgress: ${progress}%`);
      });

      redirectResponse.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('\n✓ Download complete');
        extractMongoDB();
      });
    }).on('error', (err) => {
      fs.unlinkSync(MONGODB_ZIP);
      console.error('\n❌ Download failed:', err.message);
      process.exit(1);
    });
  } else {
    totalBytes = parseInt(response.headers['content-length'], 10);
    console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

    response.on('data', (chunk) => {
      receivedBytes += chunk.length;
      const progress = ((receivedBytes / totalBytes) * 100).toFixed(2);
      process.stdout.write(`\rProgress: ${progress}%`);
    });

    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('\n✓ Download complete');
      extractMongoDB();
    });
  }
}).on('error', (err) => {
  fs.unlinkSync(MONGODB_ZIP);
  console.error('\n❌ Download failed:', err.message);
  process.exit(1);
});

function extractMongoDB() {
  console.log('\n📦 Extracting MongoDB...');

  try {
    // Check if extract-zip is available
    const extractZip = require('extract-zip');
    
    extractZip(MONGODB_ZIP, { dir: RESOURCES_DIR })
      .then(() => {
        console.log('✓ Extraction complete');
        
        // Find the extracted folder (mongodb-windows-x86_64-{version})
        const extractedFolder = fs.readdirSync(RESOURCES_DIR)
          .find(name => name.startsWith('mongodb-windows'));
        
        if (extractedFolder) {
          const extractedPath = path.join(RESOURCES_DIR, extractedFolder);
          
          // Rename to 'mongodb'
          fs.renameSync(extractedPath, MONGODB_DEST);
          console.log(`✓ Renamed to ${MONGODB_DEST}`);
        }
        
        // Cleanup zip file
        fs.unlinkSync(MONGODB_ZIP);
        console.log('✓ Cleaned up zip file');
        
        console.log('\n✅ MongoDB preparation complete!');
      })
      .catch((err) => {
        console.error('❌ Extraction failed:', err.message);
        process.exit(1);
      });
  } catch (error) {
    console.error('❌ extract-zip not available');
    console.error('Please install: npm install extract-zip');
    process.exit(1);
  }
}
