const notifier = require('node-notifier');
const path = require('path');
const settings = require('./settings');

function showNotification(title, message, options = {}) {
  if (!settings.get('notifications')) {
    return;
  }

  notifier.notify({
    title: title || 'MoltBot',
    message: message,
    icon: path.join(__dirname, '../build/icon.png'),
    sound: options.sound !== false,
    wait: options.wait || false,
    timeout: options.timeout || 5
  });
}

function notifyServiceStatus(serviceName, status) {
  const message = status === 'started' 
    ? `${serviceName} iniciado com sucesso` 
    : `${serviceName} parou`;
  
  showNotification('Status do Serviço', message, { sound: false });
}

function notifyError(title, message) {
  showNotification(`❌ ${title}`, message, { sound: true, timeout: 10 });
}

function notifySuccess(title, message) {
  showNotification(`✅ ${title}`, message, { sound: false });
}

function notifyUpdate(version) {
  showNotification(
    'Atualização Disponível',
    `Nova versão ${version} disponível para download`,
    { wait: true, timeout: 10 }
  );
}

module.exports = {
  showNotification,
  notifyServiceStatus,
  notifyError,
  notifySuccess,
  notifyUpdate
};
