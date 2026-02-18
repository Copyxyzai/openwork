const AutoLaunch = require('auto-launch');
const settings = require('./settings');

const autoLauncher = new AutoLaunch({
  name: 'MoltBot',
  path: process.execPath
});

async function setupAutoStart() {
  const enabled = settings.get('autoStart');
  
  try {
    const isEnabled = await autoLauncher.isEnabled();
    
    if (enabled && !isEnabled) {
      await autoLauncher.enable();
      console.log('Auto-start enabled');
    } else if (!enabled && isEnabled) {
      await autoLauncher.disable();
      console.log('Auto-start disabled');
    }
  } catch (error) {
    console.error('Error setting up auto-start:', error);
  }
}

async function toggleAutoStart(enable) {
  try {
    if (enable) {
      await autoLauncher.enable();
      settings.set('autoStart', true);
      console.log('Auto-start enabled');
    } else {
      await autoLauncher.disable();
      settings.set('autoStart', false);
      console.log('Auto-start disabled');
    }
    return true;
  } catch (error) {
    console.error('Error toggling auto-start:', error);
    return false;
  }
}

module.exports = {
  setupAutoStart,
  toggleAutoStart
};
