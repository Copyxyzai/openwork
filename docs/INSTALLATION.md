# 📦 Guia de Instalação - MoltBot

## Instalação para Usuários (Windows)

### Método 1: Instalador (Recomendado)

#### Requisitos
- Windows 10/11 (64-bit)
- 4GB RAM mínimo
- 500MB espaço em disco

#### Passos

1. **Baixe o Instalador**
   ```
   MoltBot-Setup-1.0.0.exe (~250MB)
   ```
   - [Download Direto](https://releases.moltbot.com/latest)
   - [GitHub Releases](https://github.com/yourusername/moltbot/releases)

2. **Execute o Instalador**
   - Duplo clique no arquivo `.exe`
   - Windows pode mostrar aviso de segurança:
     * Clique "Mais informações"
     * Clique "Executar assim mesmo"
   - Escolha o diretório de instalação
   - Aguarde a instalação (~1-2 minutos)

3. **Primeira Execução**
   - MoltBot abre automaticamente
   - Você verá a tela de Setup
   - Configure seu provedor LLM

4. **Pronto!**
   - Ícone no Desktop criado
   - Atalho no Menu Iniciar
   - Ícone na bandeja (system tray)

---

## Instalação para Desenvolvedores

### Requisitos

#### Node.js
```bash
# Versão 18 ou superior
node --version  # v18.0.0+
npm --version   # 9.0.0+
```
Download: https://nodejs.org/

#### Python
```bash
# Versão 3.8 ou superior
python --version  # 3.8.0+
pip --version     # 21.0.0+
```
Download: https://www.python.org/downloads/

#### MongoDB
```bash
# Versão 4.4 ou superior
mongod --version  # 4.4.0+
```
Download: https://www.mongodb.com/try/download/community

#### Yarn (Opcional, mas recomendado)
```bash
npm install -g yarn
```

### Passos de Instalação

#### 1. Clone o Repositório
```bash
git clone https://github.com/yourusername/moltbot.git
cd moltbot
```

#### 2. Instale Dependências do Backend
```bash
cd backend
pip install -r requirements.txt
```

#### 3. Configure Variáveis de Ambiente
```bash
# backend/.env
MONGO_URL=mongodb://localhost:27017/moltbot_app
DB_NAME=moltbot_app
CORS_ORIGINS=http://localhost:3000
```

#### 4. Instale Dependências do Frontend
```bash
cd ../frontend
yarn install
# ou
npm install
```

#### 5. Configure Variáveis de Ambiente
```bash
# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### 6. Inicie o MongoDB
```bash
# Terminal separado
mongod --dbpath ./data/db
```

#### 7. Inicie o Backend
```bash
# Terminal separado
cd backend
python server.py
# ou
uvicorn server:app --reload --port 8001
```

#### 8. Inicie o Frontend
```bash
# Terminal separado
cd frontend
yarn start
# ou
npm start
```

#### 9. Acesse a Aplicação
```
http://localhost:3000
```

---

## Instalação do Electron (Desktop)

### Preparação
```bash
cd electron
npm install
```

### Modo Desenvolvimento
```bash
npm start
```

### Build do Instalador Windows

#### Pré-requisitos Adicionais
```bash
pip install pyinstaller
```

#### Build Completo
```bash
cd electron
bash build-all.sh
```

Isso vai:
1. Compilar backend Python → `server.exe`
2. Build do frontend React
3. Baixar MongoDB portable
4. Criar instalador NSIS

**Tempo:** ~15-25 minutos

**Resultado:**
```
electron/dist/MoltBot-Setup-1.0.0.exe
```

---

## Instalação em Outros Sistemas

### macOS

#### Via Homebrew (quando disponível)
```bash
brew install moltbot
```

#### Build Manual
```bash
cd electron
npm run build:mac
```

### Linux

#### Via Package Manager (quando disponível)
```bash
# Debian/Ubuntu
sudo apt install moltbot

# Fedora
sudo dnf install moltbot

# Arch
yay -S moltbot
```

#### Build Manual
```bash
cd electron
npm run build:linux
```

---

## Verificação da Instalação

### Verificar Serviços
```bash
# Backend
curl http://localhost:8001/api/openclaw/status

# Frontend
curl http://localhost:3000

# MongoDB
mongo --eval "db.version()"
```

### Verificar Logs
```bash
# Backend
tail -f backend/logs/app.log

# Frontend (desenvolvimento)
# Logs aparecem no terminal

# Electron
# Windows: %APPDATA%/moltbot/logs/moltbot.log
# macOS: ~/Library/Application Support/moltbot/logs/moltbot.log
# Linux: ~/.config/moltbot/logs/moltbot.log
```

---

## Desinstalação

### Windows

#### Via Painel de Controle
1. Painel de Controle → Programas
2. Localizar "MoltBot"
3. Clicar em "Desinstalar"

#### Via PowerShell
```powershell
# Desinstalar aplicativo
Get-Package "MoltBot" | Uninstall-Package

# Remover dados (opcional)
Remove-Item -Recurse -Force "$env:APPDATA\moltbot"
```

### macOS
```bash
# Remover aplicativo
rm -rf /Applications/MoltBot.app

# Remover dados (opcional)
rm -rf ~/Library/Application\ Support/moltbot
```

### Linux
```bash
# Via package manager
sudo apt remove moltbot

# Remover dados (opcional)
rm -rf ~/.config/moltbot
```

---

## Troubleshooting de Instalação

### Erro: "Python não encontrado"
**Solução:**
```bash
# Windows
# Baixar e instalar: https://www.python.org/downloads/
# Marcar "Add Python to PATH" durante instalação

# Verificar
python --version
```

### Erro: "Node não encontrado"
**Solução:**
```bash
# Baixar e instalar: https://nodejs.org/

# Verificar
node --version
```

### Erro: "MongoDB não inicia"
**Solução:**
```bash
# Verificar se porta 27017 está livre
netstat -an | grep 27017

# Criar diretório de dados
mkdir -p data/db

# Iniciar com log
mongod --dbpath ./data/db --logpath ./mongodb.log
```

### Erro: "Porta 8001 já em uso"
**Solução:**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8001
kill -9 <PID>
```

### Erro: "Build falha no Windows"
**Solução:**
```bash
# Instalar Visual C++ Build Tools
# https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Reinstalar dependências
rm -rf node_modules
npm install
```

---

## Próximos Passos

Após instalação bem-sucedida:

1. 📖 Leia o [Guia do Usuário](USER_GUIDE.md)
2. ⚙️ Configure seu [Provedor LLM](USER_GUIDE.md#configuração-de-provedores)
3. 🚀 Comece a usar o [OpenClaw](USER_GUIDE.md#usando-openclaw)
4. 🎨 Personalize as [Configurações](USER_GUIDE.md#configurações)

---

## Suporte

Se encontrar problemas:

- 📖 [Troubleshooting](TROUBLESHOOTING.md)
- 💬 [Discord](https://discord.gg/moltbot)
- 🐛 [GitHub Issues](https://github.com/yourusername/moltbot/issues)
- 📧 support@moltbot.com