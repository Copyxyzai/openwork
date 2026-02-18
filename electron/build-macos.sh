#!/bin/bash

# MoltBot macOS Build Script

set -e

echo "========================================"
echo "  MoltBot - Build para macOS"
echo "========================================"
echo ""

# Verificar se está no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Este script deve ser executado no macOS"
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
    echo "❌ Python não encontrado. Instale em: https://python.org/"
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

node scripts/prepare-backend-macos.js

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

node scripts/prepare-mongodb-macos.js

echo ""
echo "========================================"
echo "  Etapa 5: Construir Instalador"
echo "========================================"
echo ""
echo "Isso pode levar 3-5 minutos..."
echo ""

npm run build:mac

echo ""
echo "========================================"
echo "  ✅ BUILD CONCLUÍDO!"
echo "========================================"
echo ""
echo "Instaladores criados em:"
echo "💾 /app/electron/dist/"
echo ""
ls -lh /app/electron/dist/*.dmg 2>/dev/null || echo "  - MoltBot-*.dmg"
ls -lh /app/electron/dist/*.zip 2>/dev/null || echo "  - MoltBot-*.zip"
echo ""
echo "Para instalar no macOS:"
echo "1. Abra o arquivo .dmg"
echo "2. Arraste MoltBot para Applications"
echo "3. MoltBot estará disponível no Launchpad"
echo ""
