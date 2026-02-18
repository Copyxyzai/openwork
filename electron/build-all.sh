#!/bin/bash

# MoltBot Windows Build Script
# Este script automatiza todo o processo de build

set -e  # Exit on error

echo "========================================"
echo "  MoltBot - Build para Windows"
echo "========================================"
echo ""

# Check prerequisites
echo "🔍 Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js: $(node --version)"

if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Instale em: https://python.org/"
    exit 1
fi

if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
    echo "✓ Python: $(python3 --version)"
else
    PYTHON_CMD=python
    echo "✓ Python: $(python --version)"
fi

if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip não encontrado"
    exit 1
fi
echo "✓ pip encontrado"

echo ""
echo "========================================"
echo "  Etapa 1: Instalar dependências"
echo "========================================"
echo ""

cd /app/electron

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do Electron..."
    npm install
else
    echo "✓ Dependências do Electron já instaladas"
fi

# Check for PyInstaller
if ! $PYTHON_CMD -c "import PyInstaller" 2>/dev/null; then
    echo "Instalando PyInstaller..."
    pip install pyinstaller
else
    echo "✓ PyInstaller já instalado"
fi

echo ""
echo "========================================"
echo "  Etapa 2: Preparar Backend"
echo "========================================"
echo ""
echo "Isso pode levar 5-10 minutos..."
echo ""

node scripts/prepare-backend.js

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

node scripts/prepare-mongodb.js

echo ""
echo "========================================"
echo "  Etapa 5: Construir Instalador"
echo "========================================"
echo ""
echo "Isso pode levar 3-5 minutos..."
echo ""

npm run build:win

echo ""
echo "========================================"
echo "  ✅ BUILD CONCLUÍDO!"
echo "========================================"
echo ""
echo "Instalador criado em:"
echo "💾 /app/electron/dist/MoltBot-Setup-1.0.0.exe"
echo ""
echo "Para instalar no Windows:"
echo "1. Copie o arquivo .exe para o Windows"
echo "2. Execute o instalador"
echo "3. MoltBot será iniciado automaticamente"
echo ""
echo "Tamanho esperado: 200-300 MB"
echo ""
