const { globalShortcut } = require('electron');
const settings = require('./settings');

function registerShortcuts(mainWindow) {
  const shortcuts = settings.get('shortcuts');
  
  // Toggle window visibility
  if (shortcuts.toggleWindow) {
    globalShortcut.register(shortcuts.toggleWindow, () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  }

  // New chat
  if (shortcuts.newChat) {
    globalShortcut.register(shortcuts.newChat, () => {
      mainWindow.webContents.send('shortcut-new-chat');
    });
  }

  // Search
  if (shortcuts.search) {
    globalShortcut.register(shortcuts.search, () => {
      mainWindow.webContents.send('shortcut-search');
    });
  }

  // Settings
  if (shortcuts.settings) {
    globalShortcut.register(shortcuts.settings, () => {
      mainWindow.webContents.send('shortcut-settings');
    });
  }

  console.log('Global shortcuts registered');
}

function unregisterAllShortcuts() {
  globalShortcut.unregisterAll();
  console.log('Global shortcuts unregistered');
}

module.exports = {
  registerShortcuts,
  unregisterAllShortcuts
};
