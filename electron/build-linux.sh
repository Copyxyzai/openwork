#!/bin/bash

# MoltBot Linux Build Script

set -e

echo "========================================"
echo "  MoltBot - Build para Linux"
echo "========================================"
echo ""

# Verificar se está no Linux
if [[ "$OSTYPE" != "linux"* ]]; then
    echo "❌ Este script deve ser executado no Linux"
    exit 1
fi

echo "🔍 Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js: $(node --version)"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python não encontrado. Instale: sudo apt install python3"
    exit 1
fi
echo "✓ Python: $(python3 --version)"

# Verificar PyInstaller
if ! python3 -c "import PyInstaller" 2>/dev/null; then
    echo "⚠️  PyInstaller não encontrado. Instalando..."
    pip3 install pyinstaller
fi
echo "✓ PyInstaller instalado"

cd /app/electron

echo ""
echo "========================================"
echo "  Etapa 1: Instalar dependências"
echo "========================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do Electron..."
    npm install
else
    echo "✓ Dependências já instaladas"
fi

echo ""
echo "========================================"
echo "  Etapa 2: Preparar Backend"
echo "========================================"
echo ""
echo "Isso pode levar 5-10 minutos..."
echo ""

node scripts/prepare-backend-linux.js

echo ""
echo "========================================"
echo "  Etapa 3: Preparar Frontend"
echo "========================================"
echo ""
echo "Isso pode levar 2-3 minutos..."
echo ""

node scripts/prepare-frontend.js

echo ""
echo "========================================"
echo "  Etapa 4: Preparar MongoDB"
echo "========================================"
echo ""
echo "Isso pode levar 3-5 minutos (download)..."
echo ""

node scripts/prepare-mongodb-linux.js

echo ""
echo "========================================"
echo "  Etapa 5: Construir Instaladores"
echo "========================================"
echo ""
echo "Isso pode levar 5-10 minutos..."
echo ""

npm run build:linux

echo ""
echo "========================================"
echo "  ✅ BUILD CONCLUÍDO!"
echo "========================================"
echo ""
echo "Instaladores criados em:"
echo "💾 /app/electron/dist/"
echo ""
ls -lh /app/electron/dist/*.AppImage 2>/dev/null || echo "  - MoltBot-*.AppImage"
ls -lh /app/electron/dist/*.deb 2>/dev/null || echo "  - MoltBot-*.deb"
ls -lh /app/electron/dist/*.rpm 2>/dev/null || echo "  - MoltBot-*.rpm"
ls -lh /app/electron/dist/*.snap 2>/dev/null || echo "  - MoltBot-*.snap"
echo ""
echo "Para instalar no Linux:"
echo ""
echo "AppImage:"
echo "  chmod +x MoltBot-*.AppImage"
echo "  ./MoltBot-*.AppImage"
echo ""
echo "Debian/Ubuntu:"
echo "  sudo dpkg -i MoltBot-*.deb"
echo "  sudo apt-get install -f"
echo ""
echo "Fedora/RHEL:"
echo "  sudo rpm -i MoltBot-*.rpm"
echo ""
echo "Snap:"
echo "  sudo snap install MoltBot-*.snap --dangerous"
echo ""
