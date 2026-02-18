# MoltBot - Aplicativo Desktop para Windows

## 🛠️ Guia de Build

Este guia mostra como construir o instalador do MoltBot para Windows.

## Pré-requisitos

### No Sistema de Build (pode ser Windows, Mac ou Linux)

1. **Node.js** (v18 ou superior)
   - Download: https://nodejs.org/

2. **Python** (3.8 ou superior)
   - Download: https://www.python.org/downloads/
   - Marque a opção "Add Python to PATH" durante a instalação

3. **PyInstaller**
   ```bash
   pip install pyinstaller
   ```

4. **Yarn** (opcional, mas recomendado)
   ```bash
   npm install -g yarn
   ```

## 📦 Processo de Build Completo

### Passo 1: Preparar o Backend

```bash
cd /app/electron
npm install
npm run prepare-backend
```

Isso irá:
- Instalar PyInstaller se necessário
- Compilar o backend FastAPI em um executável Windows (server.exe)
- Copiar arquivos de configuração
- Criar pacote ~50MB

**Tempo estimado:** 5-10 minutos

### Passo 2: Preparar o MongoDB

```bash
npm run prepare-mongodb
```

Isso irá:
- Baixar MongoDB 8.0.4 portable para Windows
- Extrair arquivos necessários
- Criar pacote ~100MB

**Tempo estimado:** 3-5 minutos (dependendo da conexão)

### Passo 3: Preparar o Frontend

```bash
npm run prepare-frontend
```

Isso irá:
- Fazer build de produção do React
- Otimizar e minificar arquivos
- Copiar para pasta de recursos

**Tempo estimado:** 2-3 minutos

### Passo 4: Construir o Instalador

```bash
npm run build:win
```

Isso irá:
- Empacotar todos os recursos
- Criar executável Electron
- Gerar instalador NSIS
- Criar MoltBot-Setup-1.0.0.exe

**Tempo estimado:** 3-5 minutos

### Comando Único (Tudo de Uma Vez)

```bash
cd /app/electron
npm install
npm run prepare-all
npm run prepare-frontend
npm run build:win
```

**Tempo total estimado:** 15-25 minutos

## 📍 Localização do Instalador

Após o build, o instalador estará em:

```
/app/electron/dist/MoltBot-Setup-1.0.0.exe
```

**Tamanho esperado:** 200-300 MB

## 💻 Instalação no Windows

1. Execute `MoltBot-Setup-1.0.0.exe`
2. Escolha o diretório de instalação
3. Aguarde a instalação (1-2 minutos)
4. MoltBot será iniciado automaticamente

## 🛡️ Aviso de Segurança do Windows

Como o instalador não é assinado digitalmente, o Windows pode mostrar um aviso:

- Clique em "Mais informações"
- Clique em "Executar assim mesmo"

Para evitar isso em distribuições futuras, você precisará de um certificado de assinatura de código Windows.

## 📁 Estrutura do Aplicativo Instalado

```
C:\Program Files\MoltBot\
├── MoltBot.exe                 # Executável principal
├── resources/
│   ├── backend/
│   │   └── server.exe         # Backend FastAPI
│   ├── mongodb/
│   │   └── bin/
│   │       └── mongod.exe     # MongoDB
│   └── frontend/              # Frontend React (build)
└── ...
```

## 💾 Dados do Usuário

Dados, logs e banco de dados são armazenados em:

```
C:\Users\<Usuario>\AppData\Roaming\moltbot\
├── logs/
│   └── moltbot.log           # Logs da aplicação
└── mongodb-data/             # Dados do MongoDB
```

## 🔧 Configuração de Ícones

### Criar Ícones Personalizados

1. Crie um ícone 256x256 pixels
2. Converta para .ico (use https://convertio.co/png-ico/)
3. Salve como `/app/electron/build/icon.ico`
4. Também crie `icon.png` para o app

## 🚫 Troubleshooting

### Erro: PyInstaller não encontrado
```bash
pip install pyinstaller
```

### Erro: Falha no build do frontend
```bash
cd /app/frontend
yarn install
yarn build
```

### Erro: extract-zip não encontrado
```bash
cd /app/electron
npm install extract-zip
```

### MongoDB não inicia no Windows
- Verifique se a porta 27017 está disponível
- Verifique logs em: `%APPDATA%\moltbot\logs\moltbot.log`

### Backend não inicia
- Verifique se a porta 8001 está disponível
- Verifique logs da aplicação
- Teste o executável manualmente: `resources\backend\server.exe`

## 🔄 Atualizações

Para criar uma nova versão:

1. Atualize a versão em `/app/electron/package.json`
2. Refaça o build completo
3. O instalador será gerado com o novo número de versão

## ⚙️ Build Options

### Build apenas para teste (sem instalador)
```bash
npm run pack
```

Isso cria uma pasta executável em `dist/win-unpacked` sem gerar o instalador.

### Customizar nome do instalador

Edite `/app/electron/package.json`:
```json
"build": {
  "win": {
    "artifactName": "MeuApp-${version}.${ext}"
  }
}
```

## 📝 Notas Importantes

1. **Primeira execução:** O app pode levar 10-15 segundos para iniciar na primeira vez (MongoDB precisa criar estrutura de dados)

2. **Antivírus:** Alguns antivírus podem bloquear executáveis não assinados. Adicione exceção se necessário.

3. **Requisitos de sistema:**
   - Windows 10/11 (64-bit)
   - 4GB RAM (mínimo)
   - 500MB espaço em disco

4. **Portas usadas:**
   - 27017: MongoDB
   - 8001: Backend FastAPI
   - 3000: Frontend (interno)

## 🔐 Assinatura de Código (Opcional)

Para distribuição profissional:

1. Adquira um certificado de assinatura de código Windows
2. Configure no `package.json`:

```json
"build": {
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password"
  }
}
```

## ❓ Suporte

Para problemas durante o build ou instalação:
- Verifique os logs em: `%APPDATA%\moltbot\logs\moltbot.log`
- Consulte documentação do Electron: https://www.electronjs.org/
- Consulte documentação do Electron Builder: https://www.electron.build/

---

**Pronto! Seu MoltBot Desktop para Windows está configurado! 🎉**
