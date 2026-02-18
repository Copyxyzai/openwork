const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific IPC messages
contextBridge.exposeInMainWorld('electron', {
  // Add any IPC methods you need here
  platform: process.platform,
  version: process.versions.electron
});
