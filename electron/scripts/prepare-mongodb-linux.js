const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const MONGODB_VERSION = '8.0.4';
const MONGODB_DOWNLOAD_URL = `https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-${MONGODB_VERSION}.tgz`;
const RESOURCES_DIR = path.join(__dirname, '..', 'resources');
const MONGODB_TAR = path.join(RESOURCES_DIR, 'mongodb.tgz');
const MONGODB_DEST = path.join(RESOURCES_DIR, 'mongodb');

console.log('🔧 Preparing MongoDB Portable for Linux...');
console.log(`Download URL: ${MONGODB_DOWNLOAD_URL}`);
console.log(`Destination: ${MONGODB_DEST}`);

// Create resources directory
if (!fs.existsSync(RESOURCES_DIR)) {
  fs.mkdirSync(RESOURCES_DIR, { recursive: true });
}

// Check if already exists
if (fs.existsSync(MONGODB_DEST) && fs.existsSync(path.join(MONGODB_DEST, 'bin', 'mongod'))) {
  console.log('✓ MongoDB already prepared');
  process.exit(0);
}

// Download MongoDB
console.log('\n⬇️  Downloading MongoDB (this may take several minutes)...');

const file = fs.createWriteStream(MONGODB_TAR);
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
      fs.unlinkSync(MONGODB_TAR);
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
  fs.unlinkSync(MONGODB_TAR);
  console.error('\n❌ Download failed:', err.message);
  process.exit(1);
});

function extractMongoDB() {
  console.log('\n📦 Extracting MongoDB...');

  try {
    // Extract tar.gz
    execSync(`tar -xzf "${MONGODB_TAR}" -C "${RESOURCES_DIR}"`, {
      stdio: 'inherit'
    });
    console.log('✓ Extraction complete');
    
    // Find the extracted folder
    const extractedFolders = fs.readdirSync(RESOURCES_DIR)
      .filter(name => name.startsWith('mongodb-linux'));
    
    if (extractedFolders.length > 0) {
      const extractedPath = path.join(RESOURCES_DIR, extractedFolders[0]);
      
      // Rename to 'mongodb'
      fs.renameSync(extractedPath, MONGODB_DEST);
      console.log(`✓ Renamed to ${MONGODB_DEST}`);
    }
    
    // Cleanup tar file
    fs.unlinkSync(MONGODB_TAR);
    console.log('✓ Cleaned up tar file');
    
    // Make binaries executable
    const binDir = path.join(MONGODB_DEST, 'bin');
    if (fs.existsSync(binDir)) {
      const bins = fs.readdirSync(binDir);
      bins.forEach(bin => {
        fs.chmodSync(path.join(binDir, bin), '755');
      });
      console.log('✓ Made binaries executable');
    }
    
    console.log('\n✅ MongoDB preparation complete!');
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}
