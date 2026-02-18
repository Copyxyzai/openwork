import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    // Load settings
    if (window.electronAPI) {
      window.electronAPI.getSettings().then(setSettings);
      window.electronAPI.listBackups().then(setBackups);
      
      // Subscribe to system stats
      window.electronAPI.onSystemStats(setStats);
    }
  }, []);

  const toggleSetting = async (key) => {
    if (!window.electronAPI) return;
    
    await window.electronAPI.setSetting(key, !settings[key]);
    const updated = await window.electronAPI.getSettings();
    setSettings(updated);
  };

  const createBackup = async () => {
    if (!window.electronAPI) return;
    
    await window.electronAPI.createBackup();
    const updated = await window.electronAPI.listBackups();
    setBackups(updated);
  };

  const exportSettings = async () => {
    if (!window.electronAPI) {
      return;
    }
    await window.electronAPI.exportSettings();
  };

  const importSettings = async () => {
    if (!window.electronAPI) return;
    
    await window.electronAPI.importSettings();
    const updated = await window.electronAPI.getSettings();
    setSettings(updated);
  };

  if (!settings) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preferências Gerais</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tema</h3>
                  <p className="text-sm text-gray-500">Escolha o tema do aplicativo</p>
                </div>
                <select 
                  value={settings.theme}
                  onChange={(e) => window.electronAPI?.setSetting('theme', e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações</h3>
                  <p className="text-sm text-gray-500">Receber notificações do sistema</p>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={() => toggleSetting('notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Minimizar para Bandeja</h3>
                  <p className="text-sm text-gray-500">Ao minimizar, enviar para system tray</p>
                </div>
                <Switch 
                  checked={settings.minimizeToTray}
                  onCheckedChange={() => toggleSetting('minimizeToTray')}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sistema</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Iniciar com o Windows</h3>
                  <p className="text-sm text-gray-500">Abrir automaticamente ao ligar o PC</p>
                </div>
                <Switch 
                  checked={settings.autoStart}
                  onCheckedChange={() => toggleSetting('autoStart')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Atualizações Automáticas</h3>
                  <p className="text-sm text-gray-500">Verificar e baixar atualizações</p>
                </div>
                <Switch 
                  checked={settings.autoUpdate}
                  onCheckedChange={() => toggleSetting('autoUpdate')}
                />
              </div>

              <div className="border-t pt-4">
                <Button 
                  onClick={() => window.electronAPI?.checkUpdates()}
                  variant="outline"
                  className="w-full"
                >
                  Verificar Atualizações Agora
                </Button>
              </div>
            </div>
          </Card>

          {/* Performance Monitor */}
          {stats && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU</span>
                  <Badge variant="secondary">{stats.cpu}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memória</span>
                  <Badge variant="secondary">{stats.memory?.percent}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <Badge variant="secondary">
                    {Math.floor(stats.uptime / 60)} min
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Serviços</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      stats.processes?.mongo?.running ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">MongoDB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      stats.processes?.backend?.running ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">Backend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      stats.processes?.frontend?.running ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">Frontend</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Backup</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Backup Automático</h3>
                  <p className="text-sm text-gray-500">Criar backups periodicamente</p>
                </div>
                <Switch 
                  checked={settings.autoBackup}
                  onCheckedChange={() => toggleSetting('autoBackup')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Intervalo</h3>
                  <p className="text-sm text-gray-500">Frequência dos backups</p>
                </div>
                <select 
                  value={settings.backupInterval}
                  onChange={(e) => window.electronAPI?.setSetting('backupInterval', parseInt(e.target.value))}
                  className="border rounded px-3 py-2"
                >
                  <option value="1">A cada hora</option>
                  <option value="6">A cada 6 horas</option>
                  <option value="12">A cada 12 horas</option>
                  <option value="24">Diariamente</option>
                  <option value="168">Semanalmente</option>
                </select>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button onClick={createBackup} className="w-full">
                  Criar Backup Agora
                </Button>
                <Button 
                  onClick={() => window.electronAPI?.openDataFolder()}
                  variant="outline"
                  className="w-full"
                >
                  Abrir Pasta de Backups
                </Button>
              </div>
            </div>
          </Card>

          {/* Backup List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Backups Disponíveis</h2>
            
            {backups.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum backup disponível</p>
            ) : (
              <div className="space-y-2">
                {backups.map((backup, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{backup.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(backup.time).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => window.electronAPI?.restoreBackup(backup.path)}
                    >
                      Restaurar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Avançado</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Modo Debug</h3>
                  <p className="text-sm text-gray-500">Mostrar logs detalhados</p>
                </div>
                <Switch 
                  checked={settings.debugMode}
                  onCheckedChange={() => toggleSetting('debugMode')}
                />
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button 
                  onClick={exportSettings}
                  variant="outline"
                  className="w-full"
                >
                  Exportar Configurações
                </Button>
                <Button 
                  onClick={importSettings}
                  variant="outline"
                  className="w-full"
                >
                  Importar Configurações
                </Button>
                <Button 
                  onClick={() => window.electronAPI?.openLogs()}
                  variant="outline"
                  className="w-full"
                >
                  Abrir Pasta de Logs
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
