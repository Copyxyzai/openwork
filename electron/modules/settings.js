const Store = require('electron-store');

// Settings manager with defaults
const schema = {
  theme: {
    type: 'string',
    default: 'light',
    enum: ['light', 'dark', 'auto']
  },
  autoStart: {
    type: 'boolean',
    default: false
  },
  minimizeToTray: {
    type: 'boolean',
    default: true
  },
  notifications: {
    type: 'boolean',
    default: true
  },
  autoUpdate: {
    type: 'boolean',
    default: true
  },
  autoBackup: {
    type: 'boolean',
    default: true
  },
  backupInterval: {
    type: 'number',
    default: 24 // hours
  },
  debugMode: {
    type: 'boolean',
    default: false
  },
  language: {
    type: 'string',
    default: 'pt-BR'
  },
  shortcuts: {
    type: 'object',
    default: {
      toggleWindow: 'CommandOrControl+Shift+M',
      newChat: 'CommandOrControl+N',
      search: 'CommandOrControl+F',
      settings: 'CommandOrControl+,'
    }
  }
};

const store = new Store({ schema });

module.exports = {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  getAll: () => store.store,
  reset: () => store.clear(),
  store
};
