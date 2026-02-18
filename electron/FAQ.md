# ❓ FAQ - MoltBot Electron Desktop

## Perguntas Frequentes

### 📦 Sobre o Aplicativo

**P: O aplicativo funciona offline?**  
R: Sim! 100% offline. Todos os dados ficam no computador do usuário. Conexão é necessária apenas para recursos OpenClaw (se usar).

**P: Preciso instalar MongoDB, Python ou Node separadamente?**  
R: Não! Tudo está embutido no instalador. O usuário final não precisa instalar nada adicional.

**P: Qual o tamanho do instalador?**  
R: ~200-300 MB completo com MongoDB, Backend e Frontend.

**P: Funciona em Windows 7?**  
R: Oficialmente suportado apenas Windows 10/11 (64-bit). Windows 7 pode funcionar mas não é testado.

**P: Funciona em Mac ou Linux?**  
R: Este setup é apenas para Windows. Para Mac/Linux seria necessário adaptar (usando MongoDB binários corretos, etc).

---

### 🛠️ Sobre o Build

**P: Quanto tempo leva para fazer o build?**  
R: ~15-25 minutos total. Backend (5-10min), Frontend (2-3min), MongoDB download (3-5min), Instalador (3-5min).

**P: Preciso do Windows para fazer o build?**  
R: Não! Pode fazer build em Linux, Mac ou Windows. O Electron Builder cria o instalador Windows de qualquer plataforma.

**P: PyInstaller funciona no Mac/Linux?**  
R: PyInstaller gera executáveis específicos para o sistema onde roda. Para gerar .exe Windows, precisa rodar em Windows OU usar Wine/cross-compile (complexo).

**P: Posso fazer o build em partes?**  
R: Sim! Use os scripts individuais:
- `npm run prepare-backend`
- `npm run prepare-frontend`
- `npm run prepare-mongodb`
- `npm run build:win`

**P: O build falhou, posso continuar de onde parou?**  
R: Sim! Os scripts verificam se arquivos já existem e pulam etapas concluídas.

---

### 🔧 Problemas Técnicos

**P: Erro "PyInstaller not found"**  
R: Instale com: `pip install pyinstaller`

**P: Erro "Node version too old"**  
R: Instale Node.js 18+ de https://nodejs.org/

**P: MongoDB download falha**  
R: Verifique conexão. Ou baixe manualmente de mongodb.com e extraia em `electron/resources/mongodb/`

**P: Backend build falha com erro de imports**  
R: Certifique-se que todas as dependências estão instaladas:
```bash
cd /app/backend
pip install -r requirements.txt
```

**P: Frontend build falha**  
R: Limpe e reinstale:
```bash
cd /app/frontend
rm -rf node_modules build
yarn install
yarn build
```

**P: "ENOSPC: no space left on device"**  
R: Precisa de ~2GB livres. Libere espaço e tente novamente.

---

### 🚀 Distribuição

**P: Posso vender o aplicativo?**  
R: Depende das licenças dos componentes. MoltBot em si precisa verificar. Electron, React, MongoDB têm licenças permissivas.

**P: Como remover o aviso de "Windows protegeu seu PC"?**  
R: Precisa assinar o código com um certificado Windows Code Signing (~$100-400/ano). Ou instrua usuários a clicar "Mais informações" → "Executar assim mesmo".

**P: Posso criar auto-update?**  
R: Sim! Electron suporta auto-update. Configure usando `electron-updater`. Documentação: https://www.electron.build/auto-update

**P: Como criar um MSI ao invés de NSIS?**  
R: Edite `package.json`:
```json
"build": {
  "win": {
    "target": ["msi"]
  }
}
```

**P: Posso fazer portable (sem instalador)?**  
R: Sim! Use:
```bash
npm run pack
```
Cria pasta em `dist/win-unpacked` que pode ser zipada e distribuída.

---

### 🎨 Customização

**P: Como adicionar ícone personalizado?**  
R: 
1. Crie `icon.ico` (256x256)
2. Salve em `/app/electron/build/icon.ico`
3. Rebuild

**P: Como mudar nome do app?**  
R: Edite `/app/electron/package.json`:
```json
{
  "productName": "Seu Nome",
  "name": "seunome"
}
```

**P: Como mudar portas usadas?**  
R: Edite `/app/electron/main.js`:
```javascript
const PORTS = {
  backend: 8001,
  frontend: 3000,
  mongo: 27017
};
```

**P: Como adicionar splash screen?**  
R: Use o pacote `electron-splash-screen`. Adicione em `main.js`.

---

### 💾 Dados e Segurança

**P: Onde ficam os dados do usuário?**  
R: `C:\Users\<Usuario>\AppData\Roaming\moltbot\`

**P: Como fazer backup dos dados?**  
R: Copie a pasta `%APPDATA%\moltbot\mongodb-data\`

**P: É seguro?**  
R: Sim. MongoDB roda localmente sem autenticação externa. Todos os dados ficam no PC do usuário. Não há conexões externas (exceto OpenClaw se configurado).

**P: Como limpar tudo?**  
R: Desinstale o app e delete: `%APPDATA%\moltbot\`

---

### 🔍 Debugging

**P: Como ver logs do app?**  
R: `%APPDATA%\moltbot\logs\moltbot.log`

**P: Como abrir DevTools no app instalado?**  
R: Edite `main.js` e adicione:
```javascript
mainWindow.webContents.openDevTools();
```
Depois rebuild.

**P: Backend não inicia, como testar manualmente?**  
R: 
```bash
cd "C:\Program Files\MoltBot\resources\backend"
.\server.exe
```
Veja os erros no console.

**P: MongoDB não inicia, como testar?**  
R:
```bash
cd "C:\Program Files\MoltBot\resources\mongodb\bin"
.\mongod.exe --dbpath "%APPDATA%\moltbot\mongodb-data"
```

---

### ⚡ Performance

**P: O app está lento para iniciar**  
R: Normal na primeira execução (MongoDB cria estruturas). Execuções seguintes são mais rápidas.

**P: Como reduzir tamanho do instalador?**  
R: 
- Use MongoDB Lite (versão menor)
- Comprima executável backend com UPX
- Remova features desnecessárias

**P: Quanto RAM o app usa?**  
R: ~200-400MB (Electron + Backend + MongoDB).

---

### 🌐 Recursos Online

**P: Documentação oficial do Electron?**  
R: https://www.electronjs.org/docs/latest/

**P: Documentação do Electron Builder?**  
R: https://www.electron.build/

**P: Como converter ícones?**  
R: https://convertio.co/png-ico/

**P: Onde comprar certificado Code Signing?**  
R: Sectigo, DigiCert, GlobalSign

---

### 📱 Outros

**P: Posso fazer versão mobile?**  
R: Não diretamente. Precisaria usar React Native ou converter para Progressive Web App (PWA).

**P: Posso rodar múltiplas instâncias?**  
R: Por padrão não (portas conflitam). Mas pode configurar para usar portas diferentes ou `app.requestSingleInstanceLock()`.

**P: Como adicionar menu nativo?**  
R: Use `Menu` do Electron em `main.js`. Documentação: https://www.electronjs.org/docs/latest/api/menu

---

## 🆘 Ainda tem dúvidas?

Consulte:
- 📖 [BUILD_GUIDE.md](BUILD_GUIDE.md) - Guia detalhado
- 🚀 [GUIA-RAPIDO.md](GUIA-RAPIDO.md) - Quick start
- 🧪 [TESTE-RAPIDO.md](TESTE-RAPIDO.md) - Como testar
- 📘 [README.md](README.md) - Visão geral

Ou procure na documentação oficial:
- Electron: https://www.electronjs.org/
- Electron Builder: https://www.electron.build/
- PyInstaller: https://pyinstaller.org/

---

**Boa sorte com seu build! 🚀**
