# 🚀 MoltBot - Aplicativo Desktop para Windows

## ✨ O que foi criado?

Transformei o MoltBot em um **aplicativo desktop instalável para Windows**! 

### 📦 O que está incluído:

- ✅ **Backend FastAPI** compilado em executável Windows
- ✅ **Frontend React** otimizado para produção
- ✅ **MongoDB Portable** embutido no aplicativo
- ✅ **Electron** gerenciando todos os processos
- ✅ **Instalador NSIS** para distribuição fácil

### 🎯 Características:

- 🔒 **Funciona 100% offline** - todos os dados ficam no computador do usuário
- 🚀 **Auto-start** - todos os serviços iniciam automaticamente
- 💾 **Independente** - não precisa instalar Python, Node ou MongoDB
- 🎨 **Nativo** - parece e funciona como app Windows nativo
- 📊 **~250MB** - instalador completo com tudo incluído

---

## 🛠️ Como Criar o Instalador

### Pré-requisitos (apenas para quem vai fazer o build):

1. **Node.js** 18+ → https://nodejs.org/
2. **Python** 3.8+ → https://python.org/
3. **PyInstaller** → `pip install pyinstaller`

### 🎯 Build Automático (Recomendado):

```bash
# 1. Entre na pasta
cd /app/electron

# 2. Instale dependências
npm install

# 3. Execute o build completo
bash build-all.sh
```

**⏱️ Tempo total:** 15-25 minutos (dependendo da conexão)

O script vai:
1. ✅ Compilar backend Python → executável Windows
2. ✅ Fazer build do frontend React
3. ✅ Baixar MongoDB portable (~100MB)
4. ✅ Criar instalador completo

### 📍 Resultado:

```
/app/electron/dist/MoltBot-Setup-1.0.0.exe  (~250MB)
```

---

## 💻 Instalação no Windows

### Para o usuário final:

1. **Baixe** `MoltBot-Setup-1.0.0.exe`
2. **Execute** o instalador (duplo clique)
3. **Escolha** o diretório de instalação
4. **Aguarde** ~1-2 minutos
5. **Pronto!** MoltBot abre automaticamente

### ⚠️ Aviso de Segurança:

O Windows pode mostrar: *"Windows protegeu seu PC"*

**Isso é normal!** O app não está assinado digitalmente. Para continuar:
- Clique em **"Mais informações"**
- Clique em **"Executar assim mesmo"**

---

## 📂 Estrutura de Arquivos

### No Sistema (após instalação):

```
C:\Program Files\MoltBot\
├── MoltBot.exe              # Aplicativo principal
├── resources/
│   ├── backend/
│   │   └── server.exe       # Backend (FastAPI compilado)
│   ├── mongodb/
│   │   └── bin/
│   │       └── mongod.exe   # MongoDB
│   └── frontend/            # React build estático
└── ...

C:\Users\<Usuario>\AppData\Roaming\moltbot\
├── logs/
│   └── moltbot.log          # Logs do aplicativo
└── mongodb-data/            # Banco de dados
```

---

## 🔧 Build Manual (Passo a Passo)

Se preferir fazer etapa por etapa:

```bash
cd /app/electron
npm install

# Etapa 1: Backend (5-10 min)
npm run prepare-backend

# Etapa 2: Frontend (2-3 min)  
npm run prepare-frontend

# Etapa 3: MongoDB (3-5 min - download)
npm run prepare-mongodb

# Etapa 4: Instalador (3-5 min)
npm run build:win
```

---

## 📋 Arquitetura do Aplicativo

```
┌─────────────────────────────────────┐
│     Electron (Processo Principal)   │
└─────────────┬───────────────────────┘
              │
      ┌───────┴───────┐
      │               │
┌─────▼──────┐  ┌────▼──────┐
│  MongoDB   │  │  Backend  │
│ (port 27017)  │ (port 8001)│
└─────┬──────┘  └────┬──────┘
      │               │
      └───────┬───────┘
              │
      ┌───────▼────────┐
      │   Frontend     │
      │  (port 3000)   │
      └────────────────┘
              │
      ┌───────▼────────┐
      │ Browser Window │
      └────────────────┘
```

---

## 🎨 Customização

### Alterar Nome do App:

Edite `/app/electron/package.json`:
```json
{
  "productName": "Meu App",
  "name": "meuapp"
}
```

### Adicionar Ícone:

1. Crie um ícone `.ico` (256x256 pixels)
2. Use: https://convertio.co/png-ico/
3. Salve em `/app/electron/build/icon.ico`
4. Rebuild

### Alterar Portas:

Edite `/app/electron/main.js`:
```javascript
const PORTS = {
  backend: 8001,   // Porta do backend
  frontend: 3000,  // Porta do frontend
  mongo: 27017     // Porta do MongoDB
};
```

---

## 🐛 Troubleshooting

### Build falha no backend:
```bash
# Reinstale PyInstaller
pip uninstall pyinstaller
pip install pyinstaller
```

### Erro de memória no build:
```bash
# Aumente limite de memória do Node
export NODE_OPTIONS=--max_old_space_size=4096
npm run build:win
```

### MongoDB não baixa:
```bash
# Download manual:
# 1. Baixe de: https://www.mongodb.com/try/download/community
# 2. Extraia para: /app/electron/resources/mongodb
```

### Backend não compila:
```bash
# Teste manualmente:
cd /app/backend
pip install -r requirements.txt
python server.py  # Deve funcionar sem erros
```

---

## 📊 Requisitos do Sistema

### Para fazer o BUILD:
- 💻 Windows/Mac/Linux
- 🔧 Node.js 18+
- 🐍 Python 3.8+
- 💾 ~2GB espaço livre
- 🌐 Internet (para downloads)

### Para INSTALAR no Windows:
- 💻 Windows 10/11 (64-bit)
- 💾 500MB espaço livre
- 🧠 4GB RAM (mínimo)
- ✨ Nenhuma dependência adicional!

---

## 🔐 Assinatura Digital (Opcional)

Para distribuição profissional sem avisos de segurança:

1. **Adquira** um certificado Code Signing (~$100-400/ano)
2. **Configure** no `package.json`:

```json
"build": {
  "win": {
    "certificateFile": "caminho/para/cert.pfx",
    "certificatePassword": "senha",
    "signingHashAlgorithms": ["sha256"]
  }
}
```

3. **Rebuild** e o instalador será assinado

Fornecedores: Sectigo, DigiCert, GlobalSign

---

## 📚 Documentação Adicional

- 📖 [BUILD_GUIDE.md](electron/BUILD_GUIDE.md) - Guia completo de build
- 📘 [README.md](electron/README.md) - Documentação geral
- 🚀 [GUIA-RAPIDO.md](electron/GUIA-RAPIDO.md) - Quick start

---

## ✅ Checklist de Distribuição

Antes de distribuir:

- [ ] Testado em Windows 10
- [ ] Testado em Windows 11
- [ ] Todas as features funcionando
- [ ] Logs não mostram erros críticos
- [ ] Instalador testado em máquina limpa
- [ ] README para usuários criado
- [ ] Documentação de requisitos
- [ ] (Opcional) Certificado de assinatura
- [ ] (Opcional) Auto-update configurado

---

## 🎉 Pronto!

Agora você tem um aplicativo Windows profissional do MoltBot!

**Próximos passos:**
1. ✅ Teste localmente
2. 🚀 Distribua para usuários
3. 📣 Crie landing page de download
4. 💬 Configure suporte/feedback

**Dúvidas?** Consulte a documentação na pasta `/app/electron/`

---

**Desenvolvido com ❤️ usando Electron + React + FastAPI + MongoDB**
