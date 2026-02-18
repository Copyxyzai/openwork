#!/bin/bash

# Script de validação do ambiente de build

echo "========================================"
echo "  MoltBot - Validação de Ambiente"
echo "========================================"
echo ""

ERRORS=0
WARNINGS=0

# Cores
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js encontrado: $NODE_VERSION"
    
    # Check version
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    if [ $NODE_MAJOR -lt 18 ]; then
        echo -e "${YELLOW}⚠${NC} Aviso: Node.js $NODE_VERSION pode ser muito antigo (recomendado: v18+)"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${RED}❌${NC} Node.js não encontrado"
    echo "   Instale em: https://nodejs.org/"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "2. Verificando npm/yarn..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm encontrado: v$NPM_VERSION"
else
    echo -e "${RED}❌${NC} npm não encontrado"
    ERRORS=$((ERRORS+1))
fi

if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}✓${NC} yarn encontrado: v$YARN_VERSION"
else
    echo -e "${YELLOW}⚠${NC} yarn não encontrado (opcional, mas recomendado)"
    echo "   Instale com: npm install -g yarn"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "3. Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python3 encontrado: $PYTHON_VERSION"
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓${NC} Python encontrado: $PYTHON_VERSION"
    PYTHON_CMD=python
else
    echo -e "${RED}❌${NC} Python não encontrado"
    echo "   Instale em: https://www.python.org/downloads/"
    ERRORS=$((ERRORS+1))
    PYTHON_CMD=""
fi

echo ""
echo "4. Verificando pip..."
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version)
    echo -e "${GREEN}✓${NC} pip3 encontrado: $PIP_VERSION"
    PIP_CMD=pip3
elif command -v pip &> /dev/null; then
    PIP_VERSION=$(pip --version)
    echo -e "${GREEN}✓${NC} pip encontrado: $PIP_VERSION"
    PIP_CMD=pip
else
    echo -e "${RED}❌${NC} pip não encontrado"
    ERRORS=$((ERRORS+1))
    PIP_CMD=""
fi

echo ""
echo "5. Verificando PyInstaller..."
if [ ! -z "$PYTHON_CMD" ]; then
    if $PYTHON_CMD -c "import PyInstaller" 2>/dev/null; then
        PYINSTALLER_VERSION=$($PYTHON_CMD -c "import PyInstaller; print(PyInstaller.__version__)" 2>/dev/null)
        echo -e "${GREEN}✓${NC} PyInstaller encontrado: v$PYINSTALLER_VERSION"
    else
        echo -e "${YELLOW}⚠${NC} PyInstaller não encontrado"
        echo "   Instale com: pip install pyinstaller"
        WARNINGS=$((WARNINGS+1))
    fi
fi

echo ""
echo "6. Verificando estrutura de arquivos..."

FILES_TO_CHECK=(
    "/app/backend/server.py"
    "/app/frontend/package.json"
    "/app/electron/package.json"
    "/app/electron/main.js"
    "/app/electron/build-all.sh"
)

for FILE in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$FILE" ]; then
        echo -e "${GREEN}✓${NC} $(basename $FILE)"
    else
        echo -e "${RED}❌${NC} $FILE não encontrado"
        ERRORS=$((ERRORS+1))
    fi
done

echo ""
echo "7. Verificando dependências do backend..."
if [ -f "/app/backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} requirements.txt encontrado"
    if [ ! -z "$PIP_CMD" ]; then
        echo "   Testando instalação de dependências..."
        if $PIP_CMD install -r /app/backend/requirements.txt --dry-run &>/dev/null; then
            echo -e "${GREEN}✓${NC} Todas as dependências podem ser instaladas"
        else
            echo -e "${YELLOW}⚠${NC} Algumas dependências podem ter problemas"
            WARNINGS=$((WARNINGS+1))
        fi
    fi
else
    echo -e "${RED}❌${NC} requirements.txt não encontrado"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "8. Verificando dependências do frontend..."
if [ -f "/app/frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json encontrado"
    if [ -d "/app/frontend/node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules instalados"
    else
        echo -e "${YELLOW}⚠${NC} node_modules não encontrados"
        echo "   Execute: cd /app/frontend && yarn install"
        WARNINGS=$((WARNINGS+1))
    fi
fi

echo ""
echo "9. Verificando espaço em disco..."
AVAILABLE_SPACE=$(df -h /app | awk 'NR==2 {print $4}' | sed 's/G//')
if [ ! -z "$AVAILABLE_SPACE" ]; then
    echo "   Espaço disponível: ${AVAILABLE_SPACE}GB"
    if (( $(echo "$AVAILABLE_SPACE > 2" | bc -l) )); then
        echo -e "${GREEN}✓${NC} Espaço suficiente"
    else
        echo -e "${YELLOW}⚠${NC} Pouco espaço disponível (recomendado: 2GB+)"
        WARNINGS=$((WARNINGS+1))
    fi
fi

echo ""
echo "10. Verificando conexão com internet..."
if ping -c 1 google.com &>/dev/null; then
    echo -e "${GREEN}✓${NC} Conexão ativa"
else
    echo -e "${YELLOW}⚠${NC} Sem conexão (necessária para baixar MongoDB)"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "========================================"
echo "  Resumo da Validação"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tudo pronto para o build!${NC}"
    echo ""
    echo "Para começar, execute:"
    echo "  cd /app/electron"
    echo "  bash build-all.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS aviso(s) encontrado(s)${NC}"
    echo "Você pode prosseguir, mas pode encontrar problemas."
    echo ""
    echo "Para começar, execute:"
    echo "  cd /app/electron"
    echo "  bash build-all.sh"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erro(s) crítico(s) encontrado(s)${NC}"
    echo -e "${YELLOW}⚠ $WARNINGS aviso(s) encontrado(s)${NC}"
    echo ""
    echo "Por favor, corrija os erros antes de prosseguir."
    exit 1
fi
