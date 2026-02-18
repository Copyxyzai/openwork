# 🏗️ Arquitetura - MoltBot

## Visão Geral

MoltBot é uma aplicação desktop full-stack que combina:
- Frontend React (UI)
- Backend FastAPI (API)
- MongoDB (Banco de Dados)
- Electron (Desktop Wrapper)
- OpenClaw Gateway (Sistema de Agentes)

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────┐
│                 ELECTRON MAIN PROCESS                   │
│  (Gerencia todos os processos e comunicação)            │
└─────────────────────────────────────────────────┘
              │                      │
    ┌─────────┼──────────────────────────────┐
    │         │                                  │
┌───┴─────┐  ┌──┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐
│ MongoDB │  │ Backend │  │  Frontend  │  │  OpenClaw  │
│  27017  │  │  :8001  │  │   :3000    │  │  Gateway   │
└─────────┘  └─────────┘  └────────────┘  └─────────────┘
     │            │          │              │
     └────────────┼──────────┼──────────────┘
                    │
            ┌───────┼───────┐
            │  BrowserWindow  │
            │  (Renderer)    │
            └───────────────┘
```

## Componentes

### 1. Electron Main Process

**Responsabilidades:**
- Iniciar e gerenciar todos os processos
- Criar janelas (BrowserWindow)
- Gerenciar system tray
- Registrar atalhos globais
- Controlar ciclo de vida do app
- Comunicar entre processos (IPC)

**Arquivos principais:**
```
electron/
├── main.js                 # Processo principal
├── preload.js              # Script de preload (bridge)
├── modules/
│   ├── settings.js        # Gerenciamento de configs
│   ├── tray.js            # System tray
│   ├── shortcuts.js       # Atalhos globais
│   ├── notifications.js   # Notificações
│   ├── updater.js         # Auto-update
│   ├── autostart.js       # Auto-start
│   ├── backup.js          # Backup/restore
│   └── monitor.js         # Monitor performance
```

**Tecnologias:**
- Electron 28
- Node.js
- electron-store (persistência)
- electron-updater (atualizações)
- auto-launch (auto-start)

### 2. MongoDB

**Responsabilidades:**
- Armazenar dados da aplicação
- Persistência de conversações
- Status do OpenClaw
- Configurações de usuário

**Porta:** 27017 (local)

**Collections:**
```javascript
// status_checks - Verificações de status
{
  _id: ObjectId,
  client_name: String,
  timestamp: Date
}

// configurations - Configurações globais
{
  _id: ObjectId,
  key: String,
  value: Mixed,
  updated_at: Date
}
```

**Tecnologias:**
- MongoDB 8.0
- Motor (async driver Python)

### 3. Backend (FastAPI)

**Responsabilidades:**
- API REST para frontend
- Gerenciar OpenClaw Gateway
- WebSocket para comunicação real-time
- Integração com MongoDB
- Monitoramento de serviços

**Porta:** 8001

**Estrutura:**
```python
backend/
├── server.py                  # Aplicação principal
├── gateway_config.py          # Config do gateway
├── supervisor_client.py       # Cliente supervisor
├── whatsapp_monitor.py        # Monitor WhatsApp
├── requirements.txt           # Dependências
└── .env                       # Variáveis de ambiente
```

**Endpoints principais:**
```
GET  /api/openclaw/status      # Status do OpenClaw
POST /api/openclaw/start       # Iniciar OpenClaw
POST /api/openclaw/stop        # Parar OpenClaw
GET  /api/openclaw/whatsapp    # Status WhatsApp
WS   /ws/openclaw              # WebSocket real-time
```

**Tecnologias:**
- FastAPI
- Python 3.11
- Motor (MongoDB async)
- WebSockets
- httpx (HTTP client)

### 4. Frontend (React)

**Responsabilidades:**
- Interface do usuário
- Comunicação com backend via API
- Gerenciamento de estado
- Animações e transições

**Porta:** 3000 (desenvolvimento) / static (produção)

**Estrutura:**
```
frontend/
├── src/
│   ├── pages/
│   │   └── SetupPage.js       # Página principal
│   ├── components/
│   │   └── ui/                # Componentes UI
│   ├── App.js                 # Componente raiz
│   ├── App.css                # Estilos globais
│   └── index.js               # Entry point
├── public/
│   └── index.html             # HTML base
├── package.json               # Dependências
└── tailwind.config.js         # Config Tailwind
```

**Tecnologias:**
- React 19
- React Router
- Tailwind CSS
- Framer Motion
- shadcn/ui

### 5. OpenClaw Gateway

**Responsabilidades:**
- Executar sistema de agentes
- Processar requisições LLM
- Gerenciar sessões
- Interface de controle

**Portas:**
- 18789: Gateway principal
- 18791: Interface de controle

**Tecnologias:**
- Python
- OpenClaw SDK
- WebSockets

## Fluxo de Dados

### 1. Inicialização

```
Electron Main Process
  │
  ├───> Inicia MongoDB (spawn)
  │
  ├───> Inicia Backend (spawn)
  │     │
  │     └───> Conecta MongoDB
  │
  ├───> Inicia Frontend Server (Express)
  │     │
  │     └───> Serve arquivos estáticos
  │
  └───> Cria BrowserWindow
        │
        └───> Carrega http://localhost:3000
```

### 2. Iniciar OpenClaw

```
Frontend (UI)
  │
  └───> POST /api/openclaw/start
        │     { provider, apiKey }
        │
        v
Backend (FastAPI)
  │
  ├───> Valida dados
  │
  ├───> Escreve config gateway
  │     (gateway_config.py)
  │
  ├───> Inicia gateway via supervisor
  │     (supervisor_client.py)
  │
  ├───> Aguarda gateway estar pronto
  │     (polling status)
  │
  └───> Retorna URL de controle
        │
        v
Frontend (UI)
  │
  └───> Exibe link para abrir
```

### 3. Comunicação Real-time

```
Frontend
  │
  └───> WebSocket /ws/openclaw
        │
        v
Backend
  │
  ├───> Aceita conexão
  │
  ├───> Envia updates de status
  │     (a cada 2s)
  │
  └───> Recebe comandos
        (start, stop, status)
```

## Segurança

### 1. Isolation

**Context Isolation (Electron):**
```javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  // Apenas funções específicas expostas
  getSettings: () => ipcRenderer.invoke('get-settings'),
  // ...
});
```

**Node Integration:**
```javascript
// main.js
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,  // Desabilitado
    contextIsolation: true   // Habilitado
  }
});
```

### 2. API Security

**CORS:**
```python
# server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Validação:**
```python
# Pydantic models
class OpenClawStartRequest(BaseModel):
    provider: str = "emergent"
    apiKey: Optional[str] = None
```

### 3. Dados Sensíveis

**Armazenamento:**
- Chaves API: Criptografadas com electron-store
- Configurações: Arquivos locais protegidos
- Backups: Apenas local, sem cloud

**Comunicação:**
- HTTP local apenas (localhost)
- WebSocket sem exposição externa
- Sem telemetria ou analytics

## Performance

### 1. Otimizações Frontend

**Code Splitting:**
```javascript
// React.lazy para carregamento sob demanda
const SetupPage = React.lazy(() => import('./pages/SetupPage'));
```

**Memoização:**
```javascript
// useMemo para cálculos custosos
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

**Tree Shaking:**
- Importações específicas
- Build otimizado com Webpack

### 2. Otimizações Backend

**Async/Await:**
```python
# Motor async driver
async def get_status():
    return await db.status.find_one()
```

**Connection Pooling:**
```python
# MongoDB connection pool
client = AsyncIOMotorClient(
    mongo_url,
    maxPoolSize=10
)
```

### 3. Otimizações Electron

**Process Management:**
- Processos separados para backend/frontend
- Comunicação IPC eficiente
- Garbage collection otimizado

**Resource Usage:**
- Monitor de performance integrado
- Controle de memória
- CPU throttling quando minimizado

## Escalabilidade

### Limitações Atuais

- **Usuário único:** Apenas um usuário por instância
- **Local apenas:** Sem sincronização cloud
- **MongoDB local:** Sem replica set

### Futuro

- Multi-usuário local (v2.0)
- Sincronização cloud opcional (v2.0)
- API pública (v2.1)
- Plugin system (v1.2)

## Monitoramento

### 1. Logs

**Backend:**
```python
# Logging configurado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

**Electron:**
```javascript
// Logs salvos em arquivo
const logFile = path.join(app.getPath('userData'), 'logs/moltbot.log');
```

### 2. Métricas

**Monitor integrado:**
- CPU usage
- RAM usage
- Uptime
- Status de processos

**APIs:**
```javascript
// Frontend pode consultar
window.electronAPI.getSystemStats()
```

## Deployment

### Build Process

```
1. Backend
   └──> PyInstaller → server.exe

2. Frontend
   └──> React Build → static files

3. MongoDB
   └──> Download portable → mongodb/

4. Electron
   └──> electron-builder → MoltBot-Setup.exe
```

### Distribuição

**Windows:**
- NSIS Installer
- Auto-update via electron-updater
- Assinatura digital (opcional)

**Futuro:**
- macOS: DMG + Notarization
- Linux: AppImage / Snap / Flatpak

---

## Referências

- [Electron Docs](https://www.electronjs.org/docs/latest/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)