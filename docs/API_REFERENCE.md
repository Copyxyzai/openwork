# 🔌 API Reference - MoltBot

## Visão Geral

Base URL: `http://localhost:8001/api`

Todos os endpoints retornam JSON.

## Autenticação

**Nota:** A versão desktop atual não requer autenticação.

## Endpoints

### OpenClaw Management

#### GET /openclaw/status

Retorna o status atual do OpenClaw.

**Request:**
```http
GET /api/openclaw/status HTTP/1.1
Host: localhost:8001
```

**Response:**
```json
{
  "running": false,
  "pid": null,
  "provider": null,
  "started_at": null,
  "controlUrl": null,
  "owner_user_id": null,
  "is_owner": null
}
```

**Campos:**
- `running` (boolean): Se o OpenClaw está rodando
- `pid` (int|null): Process ID do gateway
- `provider` (string|null): Provedor configurado ("emergent", "openai", "anthropic")
- `started_at` (string|null): Timestamp ISO8601 do início
- `controlUrl` (string|null): URL da interface de controle
- `owner_user_id` (string|null): ID do usuário owner
- `is_owner` (boolean|null): Se o usuário atual é owner

---

#### POST /openclaw/start

Inicia o OpenClaw Gateway.

**Request:**
```http
POST /api/openclaw/start HTTP/1.1
Host: localhost:8001
Content-Type: application/json

{
  "provider": "emergent",
  "apiKey": null
}
```

**Body Parameters:**
- `provider` (string, required): "emergent", "openai", ou "anthropic"
- `apiKey` (string|null, optional): Chave API (null para "emergent")

**Response (Success):**
```json
{
  "ok": true,
  "controlUrl": "http://localhost:18791",
  "token": "abc123...",
  "message": "OpenClaw started successfully"
}
```

**Response (Error):**
```json
{
  "detail": "OpenClaw is already running"
}
```

**Status Codes:**
- `200`: Sucesso
- `400`: Requisição inválida (já rodando, chave inválida, etc)
- `500`: Erro interno

---

#### POST /openclaw/stop

Para o OpenClaw Gateway.

**Request:**
```http
POST /api/openclaw/stop HTTP/1.1
Host: localhost:8001
```

**Response:**
```json
{
  "message": "OpenClaw stopped successfully"
}
```

**Status Codes:**
- `200`: Sucesso
- `400`: OpenClaw não estava rodando
- `500`: Erro ao parar

---

#### GET /openclaw/whatsapp

Retorna o status da integração WhatsApp.

**Request:**
```http
GET /api/openclaw/whatsapp HTTP/1.1
Host: localhost:8001
```

**Response:**
```json
{
  "connected": true,
  "phone": "+5511999999999",
  "qr_code": null,
  "status": "ready"
}
```

**Campos:**
- `connected` (boolean): Se está conectado ao WhatsApp
- `phone` (string|null): Número do telefone conectado
- `qr_code` (string|null): QR Code para conexão (se não conectado)
- `status` (string): "ready", "qr_code", "connecting", "disconnected"

---

### Health Check

#### GET /health

Verifica se a API está funcionando.

**Request:**
```http
GET /api/health HTTP/1.1
Host: localhost:8001
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600
}
```

---

## WebSocket

### WS /openclaw

Conexão WebSocket para atualizações em tempo real.

**URL:** `ws://localhost:8001/ws/openclaw`

**Conexão:**
```javascript
const ws = new WebSocket('ws://localhost:8001/ws/openclaw');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Message:', data);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

**Mensagens Recebidas:**

```json
// Status update
{
  "type": "status",
  "data": {
    "running": true,
    "provider": "emergent",
    "uptime": 3600
  }
}

// Error
{
  "type": "error",
  "message": "Connection lost"
}

// Log
{
  "type": "log",
  "level": "info",
  "message": "Processing request..."
}
```

**Enviar Mensagens:**
```javascript
// Request status
ws.send(JSON.stringify({
  type: 'get_status'
}));

// Send command
ws.send(JSON.stringify({
  type: 'command',
  command: 'stop'
}));
```

---

## Electron IPC API

### window.electronAPI

APIs expostas para o renderer process.

#### Configurações

```javascript
// Obter todas configurações
const settings = await window.electronAPI.getSettings();

// Definir configuração
await window.electronAPI.setSetting('theme', 'dark');
```

#### Sistema

```javascript
// Obter estatísticas do sistema
const stats = await window.electronAPI.getSystemStats();
// Returns: { cpu: 25, memory: {...}, uptime: 3600, ... }

// Receber atualizações de estatísticas (a cada 2s)
window.electronAPI.onSystemStats((stats) => {
  console.log('CPU:', stats.cpu + '%');
  console.log('RAM:', stats.memory.percent + '%');
});
```

#### Backup

```javascript
// Criar backup
const backupPath = await window.electronAPI.createBackup();

// Listar backups
const backups = await window.electronAPI.listBackups();
// Returns: [{ name, path, time, size }, ...]

// Restaurar backup
await window.electronAPI.restoreBackup('/path/to/backup.json');
```

#### Arquivos

```javascript
// Abrir pasta de logs
await window.electronAPI.openLogs();

// Abrir pasta de dados
await window.electronAPI.openDataFolder();
```

#### Atualizações

```javascript
// Verificar atualizações
await window.electronAPI.checkUpdates();

// Receber progresso de download
window.electronAPI.onUpdateProgress((progress) => {
  console.log('Download:', progress.percent + '%');
});
```

#### Import/Export

```javascript
// Exportar configurações
const success = await window.electronAPI.exportSettings();

// Importar configurações
const success = await window.electronAPI.importSettings();
```

#### Atalhos

```javascript
// Escutar atalho "Novo Chat"
window.electronAPI.onShortcutNewChat(() => {
  console.log('New chat shortcut pressed');
});

// Escutar atalho "Busca"
window.electronAPI.onShortcutSearch(() => {
  console.log('Search shortcut pressed');
});

// Escutar atalho "Configurações"
window.electronAPI.onShortcutSettings(() => {
  console.log('Settings shortcut pressed');
});
```

#### Tema

```javascript
// Receber mudanças de tema
window.electronAPI.onThemeChanged((theme) => {
  console.log('Theme changed to:', theme);
  // theme: 'light', 'dark', 'auto'
});
```

#### Logs (Debug Mode)

```javascript
// Receber mensagens de log
window.electronAPI.onLogMessage((log) => {
  console.log(`[${log.timestamp}] ${log.message}`);
});
```

---

## Erros

### Códigos de Status HTTP

- `200`: Sucesso
- `400`: Bad Request (parâmetros inválidos)
- `401`: Unauthorized (não autenticado)
- `403`: Forbidden (sem permissão)
- `404`: Not Found (recurso não encontrado)
- `500`: Internal Server Error (erro do servidor)

### Formato de Erro

```json
{
  "detail": "Error message here"
}
```

Ou com mais detalhes:

```json
{
  "detail": {
    "message": "Validation error",
    "errors": [
      {
        "field": "provider",
        "message": "Invalid provider"
      }
    ]
  }
}
```

---

## Rate Limiting

**Nota:** Não há rate limiting na versão desktop atual (local apenas).

---

## Exemplos

### Iniciar OpenClaw com OpenAI

```javascript
const response = await fetch('http://localhost:8001/api/openclaw/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'openai',
    apiKey: 'sk-...'
  })
});

const data = await response.json();
if (data.ok) {
  console.log('Control URL:', data.controlUrl);
  window.open(data.controlUrl, '_blank');
} else {
  console.error('Error:', data.detail);
}
```

### Monitorar Status via WebSocket

```javascript
const ws = new WebSocket('ws://localhost:8001/ws/openclaw');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'status') {
    updateUI(message.data);
  } else if (message.type === 'error') {
    showError(message.message);
  }
};

function updateUI(status) {
  document.getElementById('status').textContent = 
    status.running ? 'Running' : 'Stopped';
}
```

### Verificar Sistema via Electron API

```javascript
// React component
import { useEffect, useState } from 'react';

function SystemMonitor() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Registrar listener
    window.electronAPI.onSystemStats(setStats);
    
    // Cleanup
    return () => {
      // Remover listener se necessário
    };
  }, []);
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div>
      <p>CPU: {stats.cpu}%</p>
      <p>RAM: {stats.memory.percent}%</p>
      <p>Uptime: {Math.floor(stats.uptime / 60)} min</p>
    </div>
  );
}
```

---

## Versionamento

API segue versionamento semântico: `MAJOR.MINOR.PATCH`

**Versão atual:** 1.0.0

**Breaking changes** incrementam MAJOR.
**Novas features** incrementam MINOR.
**Bug fixes** incrementam PATCH.

---

## Suporte

Para questões sobre a API:

- 📖 [Documentação](../README.md)
- 🐛 [GitHub Issues](https://github.com/yourusername/moltbot/issues)
- 💬 [Discord](https://discord.gg/moltbot)
- 📧 api@moltbot.com