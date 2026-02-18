const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const settings = require('./settings');
const { notifySuccess, notifyError } = require('./notifications');

let backupInterval = null;

function getBackupDir() {
  const backupDir = path.join(app.getPath('userData'), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = getBackupDir();
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    
    const dataDir = path.join(app.getPath('userData'), 'mongodb-data');
    const configFile = path.join(app.getPath('userData'), 'config.json');
    
    const backupData = {
      timestamp: new Date().toISOString(),
      version: app.getVersion(),
      settings: settings.getAll(),
      hasMongoData: fs.existsSync(dataDir),
      mongoDataSize: fs.existsSync(dataDir) ? getDirectorySize(dataDir) : 0
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    // Keep only last 10 backups
    cleanOldBackups();
    
    console.log(`Backup created: ${backupFile}`);
    notifySuccess('Backup Criado', 'Backup dos dados realizado com sucesso');
    
    return backupFile;
  } catch (error) {
    console.error('Backup error:', error);
    notifyError('Erro no Backup', error.message);
    return null;
  }
}

function getDirectorySize(dirPath) {
  let size = 0;
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        size += stats.size;
      } else if (stats.isDirectory()) {
        size += getDirectorySize(filePath);
      }
    });
  } catch (error) {
    console.error('Error calculating directory size:', error);
  }
  return size;
}

function cleanOldBackups() {
  try {
    const backupDir = getBackupDir();
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    // Keep only last 10 backups
    files.slice(10).forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`Deleted old backup: ${file.name}`);
    });
  } catch (error) {
    console.error('Error cleaning old backups:', error);
  }
}

function restoreBackup(backupFile) {
  try {
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    // Restore settings
    Object.keys(backupData.settings).forEach(key => {
      settings.set(key, backupData.settings[key]);
    });
    
    console.log(`Backup restored from: ${backupFile}`);
    notifySuccess('Backup Restaurado', 'Configurações restauradas com sucesso');
    
    return true;
  } catch (error) {
    console.error('Restore error:', error);
    notifyError('Erro na Restauração', error.message);
    return false;
  }
}

function listBackups() {
  try {
    const backupDir = getBackupDir();
    return fs.readdirSync(backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(backupDir, f),
        time: fs.statSync(path.join(backupDir, f)).mtime,
        size: fs.statSync(path.join(backupDir, f)).size
      }))
      .sort((a, b) => b.time - a.time);
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

function startAutoBackup() {
  if (!settings.get('autoBackup')) {
    console.log('Auto-backup disabled');
    return;
  }
  
  const intervalHours = settings.get('backupInterval') || 24;
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  // Create initial backup
  setTimeout(() => createBackup(), 5000);
  
  // Set interval for automatic backups
  backupInterval = setInterval(() => {
    createBackup();
  }, intervalMs);
  
  console.log(`Auto-backup started (interval: ${intervalHours}h)`);
}

function stopAutoBackup() {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
    console.log('Auto-backup stopped');
  }
}

module.exports = {
  createBackup,
  restoreBackup,
  listBackups,
  startAutoBackup,
  stopAutoBackup
};
