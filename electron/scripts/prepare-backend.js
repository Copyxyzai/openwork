const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKEND_SOURCE = path.join(__dirname, '..', '..', 'backend');
const BACKEND_DEST = path.join(__dirname, '..', 'resources', 'backend');
const SPEC_FILE = path.join(__dirname, 'backend.spec');

console.log('🔧 Preparing Backend for Windows...');
console.log(`Source: ${BACKEND_SOURCE}`);
console.log(`Destination: ${BACKEND_DEST}`);

// Create resources directory
if (!fs.existsSync(BACKEND_DEST)) {
  fs.mkdirSync(BACKEND_DEST, { recursive: true });
}

// Check if PyInstaller is available
try {
  execSync('pyinstaller --version', { stdio: 'ignore' });
  console.log('✓ PyInstaller found');
} catch (error) {
  console.error('❌ PyInstaller not found. Installing...');
  try {
    execSync('pip install pyinstaller', { stdio: 'inherit' });
    console.log('✓ PyInstaller installed');
  } catch (installError) {
    console.error('❌ Failed to install PyInstaller');
    console.error('Please install manually: pip install pyinstaller');
    process.exit(1);
  }
}

// Create PyInstaller spec file
const specContent = `# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['${BACKEND_SOURCE}/server.py'],
    pathex=['${BACKEND_SOURCE}'],
    binaries=[],
    datas=[
        ('${BACKEND_SOURCE}/.env', '.'),
    ],
    hiddenimports=[
        'fastapi',
        'uvicorn',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan.on',
        'motor',
        'motor.motor_asyncio',
        'pymongo',
        'pydantic',
        'websockets',
        'httpx',
        'dotenv',
        'starlette',
        'psutil',
        'emergentintegrations'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pdict = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pdict,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
`;

fs.writeFileSync(SPEC_FILE, specContent);
console.log(`✓ Created spec file: ${SPEC_FILE}`);

// Build with PyInstaller
console.log('\n📦 Building backend executable...');
console.log('This may take 5-10 minutes...');

try {
  execSync(`pyinstaller --clean --noconfirm "${SPEC_FILE}"`, {
    cwd: path.dirname(SPEC_FILE),
    stdio: 'inherit'
  });
  console.log('✓ Backend built successfully');
} catch (error) {
  console.error('❌ Failed to build backend');
  console.error(error.message);
  process.exit(1);
}

// Copy executable to resources
const builtExe = path.join(__dirname, '..', 'dist', 'server.exe');
if (fs.existsSync(builtExe)) {
  fs.copyFileSync(builtExe, path.join(BACKEND_DEST, 'server.exe'));
  console.log(`✓ Copied executable to ${BACKEND_DEST}`);
} else {
  console.error('❌ Built executable not found');
  process.exit(1);
}

// Copy .env file
const envSource = path.join(BACKEND_SOURCE, '.env');
const envDest = path.join(BACKEND_DEST, '.env');
if (fs.existsSync(envSource)) {
  let envContent = fs.readFileSync(envSource, 'utf8');
  
  // Update .env for local execution
  envContent = envContent.replace(/MONGO_URL=.*/g, 'MONGO_URL=mongodb://127.0.0.1:27017/moltbot_app');
  envContent = envContent.replace(/CORS_ORIGINS=.*/g, 'CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000');
  
  fs.writeFileSync(envDest, envContent);
  console.log('✓ Copied and updated .env file');
}

// Copy additional files if needed
const filesToCopy = [
  'gateway_config.py',
  'supervisor_client.py',
  'whatsapp_monitor.py',
  'install_moltbot_deps.sh'
];

filesToCopy.forEach(file => {
  const src = path.join(BACKEND_SOURCE, file);
  const dest = path.join(BACKEND_DEST, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

console.log('\n✅ Backend preparation complete!');
