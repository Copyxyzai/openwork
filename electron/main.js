const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const kill = require('tree-kill');
const express = require('express');

// Handle Squirrel events on Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let backendProcess = null;
let mongoProcess = null;
let frontendServer = null;

const PORTS = {
  backend: 8001,
  frontend: 3000,
  mongo: 27017
};

// Get resource paths
function getResourcePath(resourceName) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, resourceName);
  }
  return path.join(__dirname, 'resources', resourceName);
}

// Create logs directory
const logsDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'moltbot.log');
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

// Start MongoDB
function startMongoDB() {
  return new Promise((resolve, reject) => {
    const mongoPath = getResourcePath('mongodb');
    const mongodExe = path.join(mongoPath, 'bin', 'mongod.exe');
    const dataDir = path.join(app.getPath('userData'), 'mongodb-data');
    
    // Create data directory
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    log(`Starting MongoDB from: ${mongodExe}`);
    log(`Data directory: ${dataDir}`);

    mongoProcess = spawn(mongodExe, [
      '--dbpath', dataDir,
      '--port', PORTS.mongo.toString(),
      '--bind_ip', '127.0.0.1',
      '--noauth'
    ], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    mongoProcess.stdout.on('data', (data) => {
      log(`MongoDB: ${data.toString().trim()}`);
    });

    mongoProcess.stderr.on('data', (data) => {
      const message = data.toString();
      log(`MongoDB: ${message.trim()}`);
      if (message.includes('waiting for connections')) {
        log('MongoDB is ready!');
        resolve();
      }
    });

    mongoProcess.on('error', (error) => {
      log(`MongoDB error: ${error.message}`);
      reject(error);
    });

    mongoProcess.on('close', (code) => {
      log(`MongoDB process exited with code ${code}`);
      mongoProcess = null;
    });

    // Timeout fallback
    setTimeout(() => {
      if (mongoProcess) {
        log('MongoDB startup timeout - assuming ready');
        resolve();
      }
    }, 5000);
  });
}

// Start Backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getResourcePath('backend');
    const backendExe = path.join(backendPath, 'server.exe');
    
    log(`Starting Backend from: ${backendExe}`);

    // Set environment variables
    const env = {
      ...process.env,
      MONGO_URL: `mongodb://127.0.0.1:${PORTS.mongo}/moltbot_app`,
      DB_NAME: 'moltbot_app',
      CORS_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000',
      PYTHONUNBUFFERED: '1'
    };

    backendProcess = spawn(backendExe, [], {
      cwd: backendPath,
      env: env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    backendProcess.stdout.on('data', (data) => {
      log(`Backend: ${data.toString().trim()}`);
    });

    backendProcess.stderr.on('data', (data) => {
      const message = data.toString();
      log(`Backend: ${message.trim()}`);
      if (message.includes('Uvicorn running') || message.includes('Application startup complete')) {
        log('Backend is ready!');
        resolve();
      }
    });

    backendProcess.on('error', (error) => {
      log(`Backend error: ${error.message}`);
      reject(error);
    });

    backendProcess.on('close', (code) => {
      log(`Backend process exited with code ${code}`);
      backendProcess = null;
    });

    // Timeout fallback
    setTimeout(() => {
      if (backendProcess) {
        log('Backend startup timeout - assuming ready');
        resolve();
      }
    }, 10000);
  });
}

// Start Frontend Server
function startFrontend() {
  return new Promise((resolve) => {
    const frontendPath = getResourcePath('frontend');
    log(`Starting Frontend server from: ${frontendPath}`);

    const app = express();
    app.use(express.static(frontendPath));
    
    // Serve index.html for all routes (SPA support)
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    frontendServer = app.listen(PORTS.frontend, '127.0.0.1', () => {
      log(`Frontend server running on http://127.0.0.1:${PORTS.frontend}`);
      resolve();
    });
  });
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    title: 'MoltBot'
  });

  // Load the frontend
  mainWindow.loadURL(`http://127.0.0.1:${PORTS.frontend}`);

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Stop all processes
function stopAllProcesses() {
  return new Promise((resolve) => {
    let stopped = 0;
    const total = 3;

    function checkDone() {
      stopped++;
      if (stopped >= total) resolve();
    }

    // Stop frontend
    if (frontendServer) {
      log('Stopping frontend server...');
      frontendServer.close(() => {
        log('Frontend server stopped');
        frontendServer = null;
        checkDone();
      });
    } else {
      checkDone();
    }

    // Stop backend
    if (backendProcess) {
      log('Stopping backend...');
      kill(backendProcess.pid, 'SIGTERM', (err) => {
        if (err) log(`Error stopping backend: ${err.message}`);
        else log('Backend stopped');
        backendProcess = null;
        checkDone();
      });
    } else {
      checkDone();
    }

    // Stop MongoDB
    if (mongoProcess) {
      log('Stopping MongoDB...');
      kill(mongoProcess.pid, 'SIGTERM', (err) => {
        if (err) log(`Error stopping MongoDB: ${err.message}`);
        else log('MongoDB stopped');
        mongoProcess = null;
        checkDone();
      });
    } else {
      checkDone();
    }

    // Timeout
    setTimeout(() => {
      log('Process shutdown timeout');
      resolve();
    }, 5000);
  });
}

// App initialization
app.whenReady().then(async () => {
  log('MoltBot starting...');
  log(`User data path: ${app.getPath('userData')}`);
  log(`Logs path: ${logFile}`);

  try {
    // Start services sequentially
    log('Starting MongoDB...');
    await startMongoDB();
    
    log('Starting Backend...');
    await startBackend();
    
    log('Starting Frontend...');
    await startFrontend();
    
    // Wait a bit for everything to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log('All services started, creating window...');
    createWindow();
    
  } catch (error) {
    log(`Failed to start services: ${error.message}`);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start MoltBot services:\n${error.message}\n\nCheck logs at: ${logFile}`
    );
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cleanup on quit
app.on('before-quit', async (event) => {
  if (backendProcess || mongoProcess || frontendServer) {
    event.preventDefault();
    log('Shutting down services...');
    await stopAllProcesses();
    log('All services stopped');
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
  log(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled rejection at: ${promise}, reason: ${reason}`);
});
