const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const kill = require('tree-kill');
const express = require('express');

// Import custom modules
const settings = require('./modules/settings');
const { createTray, updateTrayStatus, destroyTray } = require('./modules/tray');
const { registerShortcuts, unregisterAllShortcuts } = require('./modules/shortcuts');
const { showNotification, notifyServiceStatus, notifyError } = require('./modules/notifications');
const { setupAutoUpdater, checkForUpdatesManually } = require('./modules/updater');
const { setupAutoStart, toggleAutoStart } = require('./modules/autostart');
const { createBackup, restoreBackup, listBackups, startAutoBackup, stopAutoBackup } = require('./modules/backup');
const { startMonitoring, stopMonitoring, getSystemStats } = require('./modules/monitor');

// Handle Squirrel events on Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray;
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
  
  // Send to renderer if debug mode
  if (settings.get('debugMode') && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('log-message', { timestamp, message });
  }
}

// Start MongoDB
function startMongoDB() {
  return new Promise((resolve, reject) => {
    const mongoPath = getResourcePath('mongodb');
    const mongodExe = path.join(mongoPath, 'bin', 'mongod.exe');
    const dataDir = path.join(app.getPath('userData'), 'mongodb-data');
    
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
        notifyServiceStatus('MongoDB', 'started');
        updateServiceStatus();
        resolve();
      }
    });

    mongoProcess.on('error', (error) => {
      log(`MongoDB error: ${error.message}`);
      notifyError('MongoDB Error', error.message);
      reject(error);
    });

    mongoProcess.on('close', (code) => {
      log(`MongoDB process exited with code ${code}`);
      mongoProcess = null;
      updateServiceStatus();
    });

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
        notifyServiceStatus('Backend', 'started');
        updateServiceStatus();
        resolve();
      }
    });

    backendProcess.on('error', (error) => {
      log(`Backend error: ${error.message}`);
      notifyError('Backend Error', error.message);
      reject(error);
    });

    backendProcess.on('close', (code) => {
      log(`Backend process exited with code ${code}`);
      backendProcess = null;
      updateServiceStatus();
    });

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

    const expressApp = express();
    expressApp.use(express.static(frontendPath));
    
    expressApp.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    frontendServer = expressApp.listen(PORTS.frontend, '127.0.0.1', () => {
      log(`Frontend server running on http://127.0.0.1:${PORTS.frontend}`);
      notifyServiceStatus('Frontend', 'started');
      updateServiceStatus();
      resolve();
    });
  });
}

// Update service status in tray
function updateServiceStatus() {
  const status = {
    mongo: mongoProcess !== null,
    backend: backendProcess !== null,
    frontend: frontendServer !== null
  };
  updateTrayStatus(status);
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('shortcut-new-chat')
        },
        { type: 'separator' },
        {
          label: 'Configurações',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('shortcut-settings')
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectAll', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forçar Recarga' },
        { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Padrão' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Diminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    },
    {
      label: 'Ferramentas',
      submenu: [
        {
          label: 'Criar Backup',
          click: () => {
            createBackup();
          }
        },
        {
          label: 'Restaurar Backup',
          click: () => {
            const backups = listBackups();
            if (backups.length === 0) {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Sem Backups',
                message: 'Nenhum backup disponível'
              });
              return;
            }
            // Show backup list (simplified)
            const backupNames = backups.map(b => b.name);
            // Here you would show a dialog to select backup
          }
        },
        { type: 'separator' },
        {
          label: 'Abrir Pasta de Logs',
          click: () => shell.openPath(logsDir)
        },
        {
          label: 'Abrir Pasta de Dados',
          click: () => shell.openPath(app.getPath('userData'))
        },
        { type: 'separator' },
        {
          label: 'Verificar Atualizações',
          click: () => checkForUpdatesManually()
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Documentação',
          click: () => {
            // Open documentation
          }
        },
        {
          label: 'Sobre',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre MoltBot',
              message: `MoltBot v${app.getVersion()}`,
              detail: 'OpenClaw Desktop Application\n\nPowered by Electron, React, FastAPI & MongoDB'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Create main window
function createWindow() {
  const theme = settings.get('theme');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    title: 'MoltBot',
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    show: false // Don't show until ready
  });

  // Load the frontend
  mainWindow.loadURL(`http://127.0.0.1:${PORTS.frontend}`);

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in debug mode
  if (settings.get('debugMode')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle minimize to tray
  mainWindow.on('minimize', (event) => {
    if (settings.get('minimizeToTray')) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting && settings.get('minimizeToTray')) {
      event.preventDefault();
      mainWindow.hide();
      showNotification('MoltBot', 'Aplicativo minimizado para a bandeja');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();

  // Setup global shortcuts
  registerShortcuts(mainWindow);

  // Setup tray
  tray = createTray(mainWindow, app);

  // Setup auto-updater
  setupAutoUpdater(mainWindow);

  // Start performance monitoring
  startMonitoring(mainWindow, { mongoProcess, backendProcess, frontendServer });
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

    setTimeout(() => {
      log('Process shutdown timeout');
      resolve();
    }, 5000);
  });
}

// IPC Handlers
ipcMain.handle('get-settings', () => {
  return settings.getAll();
});

ipcMain.handle('set-setting', (event, key, value) => {
  settings.set(key, value);
  
  // Apply special settings
  if (key === 'autoStart') {
    toggleAutoStart(value);
  } else if (key === 'theme') {
    mainWindow.webContents.send('theme-changed', value);
  } else if (key === 'debugMode') {
    if (value) {
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.webContents.closeDevTools();
    }
  }
  
  return true;
});

ipcMain.handle('get-system-stats', () => {
  return getSystemStats();
});

ipcMain.handle('create-backup', () => {
  return createBackup();
});

ipcMain.handle('list-backups', () => {
  return listBackups();
});

ipcMain.handle('restore-backup', (event, backupPath) => {
  return restoreBackup(backupPath);
});

ipcMain.handle('open-logs', () => {
  shell.openPath(logsDir);
});

ipcMain.handle('open-data-folder', () => {
  shell.openPath(app.getPath('userData'));
});

ipcMain.handle('check-updates', () => {
  checkForUpdatesManually();
});

ipcMain.handle('export-settings', () => {
  const savePath = dialog.showSaveDialogSync(mainWindow, {
    title: 'Exportar Configurações',
    defaultPath: 'moltbot-settings.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  
  if (savePath) {
    fs.writeFileSync(savePath, JSON.stringify(settings.getAll(), null, 2));
    return true;
  }
  return false;
});

ipcMain.handle('import-settings', () => {
  const openPath = dialog.showOpenDialogSync(mainWindow, {
    title: 'Importar Configurações',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  
  if (openPath && openPath[0]) {
    try {
      const data = JSON.parse(fs.readFileSync(openPath[0], 'utf8'));
      Object.keys(data).forEach(key => {
        settings.set(key, data[key]);
      });
      return true;
    } catch (error) {
      log(`Error importing settings: ${error.message}`);
      return false;
    }
  }
  return false;
});

// App initialization
app.whenReady().then(async () => {
  log('MoltBot starting...');
  log(`User data path: ${app.getPath('userData')}`);
  log(`Logs path: ${logFile}`);

  // Setup auto-start
  await setupAutoStart();

  // Start auto-backup
  startAutoBackup();

  try {
    log('Starting MongoDB...');
    await startMongoDB();
    
    log('Starting Backend...');
    await startBackend();
    
    log('Starting Frontend...');
    await startFrontend();
    
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
    
    // Stop monitoring
    stopMonitoring();
    
    // Stop auto-backup
    stopAutoBackup();
    
    // Unregister shortcuts
    unregisterAllShortcuts();
    
    // Destroy tray
    destroyTray();
    
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
