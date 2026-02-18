# 🌍 Build Multi-Plataforma - MoltBot

## Visão Geral

MoltBot pode ser buildado para **3 plataformas:**
- 🪟 **Windows** - Instalador NSIS (.exe)
- 🍎 **macOS** - Disk Image (.dmg) + ZIP
- 🐧 **Linux** - AppImage, DEB, RPM, Snap

---

## ⚠️ Limitações Importantes

**PyInstaller NÃO faz cross-compile:**
- Build para Windows → deve rodar no Windows
- Build para macOS → deve rodar no macOS
- Build para Linux → deve rodar no Linux

**Não é possível:**
- ❌ Criar .exe no Linux/Mac
- ❌ Criar .dmg no Windows/Linux
- ❌ Criar AppImage no Windows/Mac

---

## 🪟 Build para Windows

### Requisitos
- Windows 10/11 (64-bit)
- Node.js 18+
- Python 3.8+
- PyInstaller

### Build Completo
```cmd
cd electron
npm install
build-all.sh
```

### Resultado
```
dist/
├── MoltBot-Setup-1.0.0.exe    (~250 MB)
└── MoltBot-Setup-1.0.0.exe.blockmap
```

### Instalação
```cmd
MoltBot-Setup-1.0.0.exe
```

---

## 🍎 Build para macOS

### Requisitos
- macOS 10.15+ (Catalina ou superior)
- Node.js 18+
- Python 3.8+
- PyInstaller
- Xcode Command Line Tools

### Build Completo
```bash
cd electron
npm install
bash build-macos.sh
```

### Resultado
```
dist/
├── MoltBot-1.0.0-x64.dmg        (~250 MB - Intel)
├── MoltBot-1.0.0-arm64.dmg      (~250 MB - Apple Silicon)
├── MoltBot-1.0.0-x64.zip
└── MoltBot-1.0.0-arm64.zip
```

### Instalação
```bash
# Abrir DMG
open MoltBot-1.0.0-x64.dmg

# Arrastar para Applications
# Ou via terminal
cp -R "/Volumes/MoltBot 1.0.0/MoltBot.app" /Applications/
```

### Assinatura e Notarização (Opcional)

Para distribuição sem avisos de segurança:

1. **Obter certificado Apple Developer**
   - Precisa conta Apple Developer ($99/ano)
   - Criar certificado em: https://developer.apple.com/

2. **Configurar codesign:**
```json
// package.json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXXXXXXX)",
      "hardenedRuntime": true,
      "entitlements": "build/entitlements.mac.plist"
    }
  }
}
```

3. **Notarizar:**
```bash
# Após build
xcrun notarytool submit dist/MoltBot-1.0.0.dmg \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAMID" \
  --wait
```

---

## 🐧 Build para Linux

### Requisitos
- Linux (Ubuntu 20.04+ recomendado)
- Node.js 18+
- Python 3.8+
- PyInstaller
- Dependências de build:

```bash
# Ubuntu/Debian
sudo apt install -y \
  build-essential \
  libnotify4 \
  libappindicator3-1 \
  libsecret-1-0 \
  rpm \
  snapcraft

# Fedora/RHEL
sudo dnf install -y \
  gcc \
  gcc-c++ \
  make \
  libnotify \
  libappindicator-gtk3 \
  libsecret \
  rpm-build
```

### Build Completo
```bash
cd electron
npm install
bash build-linux.sh
```

### Resultado
```
dist/
├── MoltBot-1.0.0-x64.AppImage    (~250 MB)
├── MoltBot-1.0.0-x64.deb         (~250 MB)
├── MoltBot-1.0.0-x64.rpm         (~250 MB)
└── MoltBot-1.0.0-x64.snap        (~250 MB)
```

### Instalação

**AppImage:**
```bash
chmod +x MoltBot-1.0.0-x64.AppImage
./MoltBot-1.0.0-x64.AppImage
```

**Debian/Ubuntu:**
```bash
sudo dpkg -i MoltBot-1.0.0-x64.deb
sudo apt-get install -f  # Fix dependencies
```

**Fedora/RHEL:**
```bash
sudo rpm -i MoltBot-1.0.0-x64.rpm
```

**Snap:**
```bash
sudo snap install MoltBot-1.0.0-x64.snap --dangerous
```

---

## 🤖 Build Automático (CI/CD)

### GitHub Actions

#### Arquivo: `.github/workflows/build-release.yml`

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install PyInstaller
        run: pip install pyinstaller
      - name: Build
        run: |
          cd electron
          npm install
          bash build-all.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: electron/dist/*.exe

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install PyInstaller
        run: pip3 install pyinstaller
      - name: Build
        run: |
          cd electron
          npm install
          bash build-macos.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: macos-installers
          path: |
            electron/dist/*.dmg
            electron/dist/*.zip

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y build-essential libnotify4 libappindicator3-1 libsecret-1-0 rpm snapcraft
          pip3 install pyinstaller
      - name: Build
        run: |
          cd electron
          npm install
          bash build-linux.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: linux-installers
          path: |
            electron/dist/*.AppImage
            electron/dist/*.deb
            electron/dist/*.rpm
            electron/dist/*.snap

  create-release:
    needs: [build-windows, build-macos, build-linux]
    runs-on: ubuntu-latest
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            windows-installer/*
            macos-installers/*
            linux-installers/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Uso

1. **Criar tag:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. **GitHub Actions automaticamente:**
   - Build em Windows, macOS e Linux
   - Cria release com todos instaladores
   - Disponibiliza em GitHub Releases

---

## 📊 Comparação de Tamanhos

| Plataforma | Formato | Tamanho Aproximado |
|------------|---------|-------------------|
| Windows | .exe | 200-300 MB |
| macOS (Intel) | .dmg | 200-300 MB |
| macOS (ARM) | .dmg | 200-300 MB |
| Linux | .AppImage | 200-300 MB |
| Linux | .deb | 200-300 MB |
| Linux | .rpm | 200-300 MB |
| Linux | .snap | 200-300 MB |

---

## 🎨 Ícones por Plataforma

### Windows
- **Formato:** `.ico`
- **Tamanhos:** 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Localização:** `build/icon.ico`

### macOS
- **Formato:** `.icns`
- **Tamanhos:** 16x16@1x/2x, 32x32@1x/2x, 128x128@1x/2x, 256x256@1x/2x, 512x512@1x/2x
- **Localização:** `build/icon.icns`
- **Criar:**
```bash
iconutil -c icns icon.iconset
```

### Linux
- **Formato:** `.png`
- **Tamanhos:** 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512
- **Localização:** `build/icons/`
```
build/icons/
├── 16x16.png
├── 32x32.png
├── 48x48.png
├── 64x64.png
├── 128x128.png
├── 256x256.png
└── 512x512.png
```

---

## 🔧 Troubleshooting

### Erro: PyInstaller not found
```bash
# Windows
pip install pyinstaller

# macOS/Linux
pip3 install pyinstaller
```

### Erro: Permission denied (Linux/Mac)
```bash
chmod +x build-macos.sh
chmod +x build-linux.sh
```

### Erro: MongoDB download fails
- Verifique conexão
- Tente novamente
- Ou baixe manualmente de mongodb.com

### Erro: Electron builder fails
```bash
# Limpar cache
rm -rf node_modules dist
npm install
```

### Erro: Code signing (macOS)
- Precisa certificado Apple Developer
- Ou desabilite em package.json:
```json
{
  "mac": {
    "identity": null
  }
}
```

---

## 📝 Checklist de Build

### Antes de Buildar
- [ ] Atualizar versão em `package.json`
- [ ] Testar aplicação localmente
- [ ] Atualizar `CHANGELOG.md`
- [ ] Commit todas mudanças
- [ ] Criar tag de versão

### Após Build
- [ ] Testar instalador em máquina limpa
- [ ] Verificar funcionalidades principais
- [ ] Verificar auto-update (se configurado)
- [ ] Upload para GitHub Releases
- [ ] Atualizar documentação

---

## 🚀 Distribuição

### GitHub Releases
1. Criar release
2. Upload dos instaladores
3. Adicionar release notes
4. Publicar

### Outros Canais
- **Windows:** Microsoft Store (requer certificação)
- **macOS:** Mac App Store (requer conta Developer)
- **Linux:** 
  - Snap Store
  - Flathub
  - AUR (Arch Linux)

---

## 📞 Suporte

Problemas com build?
- 📖 [Documentation](../README.md)
- 🐛 [GitHub Issues](https://github.com/yourusername/moltbot/issues)
- 💬 [Discord](https://discord.gg/moltbot)

---

**Última atualização:** 18 de Fevereiro de 2025
