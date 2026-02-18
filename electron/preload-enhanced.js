const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  version: process.versions.electron,
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  
  // System stats
  getSystemStats: () => ipcRenderer.invoke('get-system-stats'),
  onSystemStats: (callback) => {
    ipcRenderer.on('system-stats', (event, stats) => callback(stats));
  },
  
  // Backup
  createBackup: () => ipcRenderer.invoke('create-backup'),
  listBackups: () => ipcRenderer.invoke('list-backups'),
  restoreBackup: (path) => ipcRenderer.invoke('restore-backup', path),
  
  // Files and folders
  openLogs: () => ipcRenderer.invoke('open-logs'),
  openDataFolder: () => ipcRenderer.invoke('open-data-folder'),
  
  // Updates
  checkUpdates: () => ipcRenderer.invoke('check-updates'),
  onUpdateProgress: (callback) => {
    ipcRenderer.on('update-progress', (event, progress) => callback(progress));
  },
  
  // Import/Export
  exportSettings: () => ipcRenderer.invoke('export-settings'),
  importSettings: () => ipcRenderer.invoke('import-settings'),
  
  // Shortcuts
  onShortcutNewChat: (callback) => {
    ipcRenderer.on('shortcut-new-chat', callback);
  },
  onShortcutSearch: (callback) => {
    ipcRenderer.on('shortcut-search', callback);
  },
  onShortcutSettings: (callback) => {
    ipcRenderer.on('shortcut-settings', callback);
  },
  
  // Theme
  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },
  
  // Logs (debug mode)
  onLogMessage: (callback) => {
    ipcRenderer.on('log-message', (event, log) => callback(log));
  }
});
