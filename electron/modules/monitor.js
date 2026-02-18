const os = require('os');
const { app } = require('electron');

let monitorInterval = null;
let stats = {
  cpu: 0,
  memory: 0,
  uptime: 0,
  processes: {
    mongo: null,
    backend: null,
    frontend: null
  }
};

function getSystemStats() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    cpu: getCPUUsage(),
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percent: Math.round((usedMem / totalMem) * 100)
    },
    uptime: process.uptime(),
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname()
  };
}

function getCPUUsage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - ~~(100 * idle / total);
  
  return usage;
}

function getProcessStats(processes) {
  stats.processes = {
    mongo: processes.mongo ? {
      running: true,
      pid: processes.mongo.pid
    } : { running: false },
    backend: processes.backend ? {
      running: true,
      pid: processes.backend.pid
    } : { running: false },
    frontend: processes.frontend ? {
      running: true
    } : { running: false }
  };
  
  return stats;
}

function startMonitoring(mainWindow, processes) {
  // Update stats every 2 seconds
  monitorInterval = setInterval(() => {
    stats = getSystemStats();
    stats.processes = getProcessStats(processes).processes;
    
    // Send to renderer
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('system-stats', stats);
    }
  }, 2000);
  
  console.log('Performance monitoring started');
}

function stopMonitoring() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    console.log('Performance monitoring stopped');
  }
}

function getStats() {
  return stats;
}

module.exports = {
  startMonitoring,
  stopMonitoring,
  getSystemStats,
  getProcessStats,
  getStats
};
