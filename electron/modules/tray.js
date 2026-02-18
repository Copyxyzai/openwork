const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function createTray(mainWindow, app) {
  // Create tray icon
  const iconPath = path.join(__dirname, '../build/icon.png');
  let trayIcon;
  
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Fallback to default icon
      trayIcon = nativeImage.createEmpty();
    }
  } catch (error) {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir MoltBot',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    {
      label: 'Status dos Serviços',
      submenu: [
        { label: '● MongoDB', enabled: false },
        { label: '● Backend', enabled: false },
        { label: '● Frontend', enabled: false }
      ]
    },
    { type: 'separator' },
    {
      label: 'Abrir Logs',
      click: () => {
        const { shell } = require('electron');
        const logsPath = path.join(app.getPath('userData'), 'logs');
        shell.openPath(logsPath);
      }
    },
    {
      label: 'Abrir Pasta de Dados',
      click: () => {
        const { shell } = require('electron');
        shell.openPath(app.getPath('userData'));
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('MoltBot - OpenClaw Desktop');
  tray.setContextMenu(contextMenu);

  // Double click to show window
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return tray;
}

function updateTrayStatus(status) {
  if (!tray) return;
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir MoltBot',
      click: () => {
        const { BrowserWindow } = require('electron');
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          windows[0].show();
          windows[0].focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Status dos Serviços',
      submenu: [
        { label: `${status.mongo ? '●' : '○'} MongoDB`, enabled: false },
        { label: `${status.backend ? '●' : '○'} Backend`, enabled: false },
        { label: `${status.frontend ? '●' : '○'} Frontend`, enabled: false }
      ]
    },
    { type: 'separator' },
    {
      label: 'Abrir Logs',
      click: () => {
        const { shell, app } = require('electron');
        const logsPath = path.join(app.getPath('userData'), 'logs');
        shell.openPath(logsPath);
      }
    },
    {
      label: 'Abrir Pasta de Dados',
      click: () => {
        const { shell, app } = require('electron');
        shell.openPath(app.getPath('userData'));
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        const { app } = require('electron');
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

module.exports = {
  createTray,
  updateTrayStatus,
  destroyTray
};
