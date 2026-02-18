const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const settings = require('./settings');
const { notifyUpdate, notifySuccess } = require('./notifications');

let mainWindow = null;

function setupAutoUpdater(window) {
  mainWindow = window;
  
  if (!settings.get('autoUpdate')) {
    console.log('Auto-update disabled in settings');
    return;
  }

  // Configure auto-updater
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // Check for updates on startup (after 10 seconds)
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 10000);

  // Check for updates every 6 hours
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 6 * 60 * 60 * 1000);

  // Events
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
    notifyUpdate(info.version);

    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Atualização Disponível',
      message: `Uma nova versão ${info.version} está disponível!`,
      detail: 'Deseja baixar e instalar agora?',
      buttons: ['Sim', 'Depois'],
      defaultId: 0
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available');
  });

  autoUpdater.on('error', (error) => {
    console.error('Update error:', error);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const message = `Baixando: ${Math.round(progressObj.percent)}%`;
    console.log(message);
    mainWindow.webContents.send('update-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info.version);
    notifySuccess('Atualização Pronta', 'Reinicie o app para instalar');

    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Atualização Pronta',
      message: `Versão ${info.version} foi baixada`,
      detail: 'O MoltBot será reiniciado para instalar a atualização.',
      buttons: ['Reiniciar Agora', 'Depois'],
      defaultId: 0
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

function checkForUpdatesManually() {
  autoUpdater.checkForUpdates();
}

module.exports = {
  setupAutoUpdater,
  checkForUpdatesManually
};
