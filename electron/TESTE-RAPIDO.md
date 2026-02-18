# 🧪 Teste Rápido - MoltBot Electron

## Teste Antes do Build Completo

Antes de fazer o build completo (que leva ~20 minutos), você pode testar se tudo está configurado corretamente.

## 1️⃣ Validar Ambiente

```bash
cd /app/electron
bash validate-environment.sh
```

**Isso verifica:**
- ✅ Node.js instalado
- ✅ Python instalado  
- ✅ PyInstaller disponível
- ✅ Arquivos necessários presentes
- ✅ Espaço em disco suficiente
- ✅ Conexão com internet

**Resultado esperado:**
```
✅ Tudo pronto para o build!
```

---

## 2️⃣ Teste de Dependências

### Backend:
```bash
cd /app/backend
pip install -r requirements.txt
python server.py
```

**Deve mostrar:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

Pressione `Ctrl+C` para parar.

### Frontend:
```bash
cd /app/frontend
yarn install
yarn build
```

**Deve criar:** `/app/frontend/build/` com os arquivos otimizados

---

## 3️⃣ Teste do Electron (Modo Dev)

⚠️ **Nota:** Isso NÃO cria o instalador, apenas testa a estrutura Electron.

```bash
cd /app/electron
npm install
npm start
```

**O que acontece:**
- Abre uma janela Electron
- Tenta carregar o app em `http://localhost:3000`
- Pode mostrar erro se serviços não estiverem rodando (normal)

---

## 4️⃣ Teste Individual dos Scripts

### Teste Backend Build:
```bash
cd /app/electron
node scripts/prepare-backend.js
```

**Tempo:** ~5-10 minutos  
**Cria:** `resources/backend/server.exe`

### Teste Frontend Build:
```bash
node scripts/prepare-frontend.js
```

**Tempo:** ~2-3 minutos  
**Cria:** `resources/frontend-build/`

### Teste MongoDB Download:
```bash
node scripts/prepare-mongodb.js
```

**Tempo:** ~3-5 minutos  
**Cria:** `resources/mongodb/`

---

## 5️⃣ Checklist de Pré-Build

Antes de executar `build-all.sh`, certifique-se:

- [ ] `validate-environment.sh` passou sem erros
- [ ] Backend roda sem erros (`python server.py`)
- [ ] Frontend builda sem erros (`yarn build`)
- [ ] Tem conexão com internet (para MongoDB)
- [ ] Tem ~2GB de espaço livre
- [ ] PyInstaller está instalado

---

## 🐛 Problemas Comuns

### "PyInstaller not found"
```bash
pip install pyinstaller
# ou
pip3 install pyinstaller
```

### "Node version too old"
```bash
# Instale Node.js 18+ de:
# https://nodejs.org/
```

### "Permission denied" no Linux/Mac
```bash
chmod +x build-all.sh
chmod +x validate-environment.sh
```

### "Module not found" no backend
```bash
cd /app/backend
pip install -r requirements.txt
```

---

## ✅ Tudo OK?

Se todos os testes passaram, você está pronto para o build completo:

```bash
cd /app/electron
bash build-all.sh
```

⏱️ **Aguarde 15-25 minutos** e terá o instalador pronto em:
```
/app/electron/dist/MoltBot-Setup-1.0.0.exe
```

---

## 📊 Status dos Componentes

Após cada teste, marque aqui:

- [ ] ✅ Validação de ambiente passou
- [ ] ✅ Backend roda sem erros
- [ ] ✅ Frontend builda corretamente
- [ ] ✅ Electron abre em modo dev
- [ ] ✅ prepare-backend funciona
- [ ] ✅ prepare-frontend funciona
- [ ] ✅ prepare-mongodb funciona
- [ ] ✅ Build completo executado
- [ ] ✅ Instalador gerado
- [ ] ✅ Testado no Windows

---

**Dica:** Execute os testes individuais primeiro para identificar problemas mais rapidamente!
