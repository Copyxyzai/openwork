#!/bin/bash

# Script para ativar todas as funcionalidades

echo "========================================"
echo "  MoltBot - Ativar Funcionalidades"
echo "========================================"
echo ""

cd /app/electron

# Backup dos arquivos originais
if [ ! -f "main-original.js" ]; then
    echo "📋 Fazendo backup dos arquivos originais..."
    cp main.js main-original.js
    cp preload.js preload-original.js
    echo "✅ Backup criado"
else
    echo "✅ Backup já existe"
fi

echo ""
echo "📦 Instalando novas dependências..."
npm install electron-store electron-updater node-notifier auto-launch

echo ""
echo "🔄 Ativando funcionalidades..."
cp main-enhanced.js main.js
cp preload-enhanced.js preload.js

echo ""
echo "========================================"
echo "  ✅ Funcionalidades Ativadas!"
echo "========================================"
echo ""
echo "Funcionalidades adicionadas:"
echo "  ✅ System tray"
echo "  ✅ Auto-start"
echo "  ✅ Atalhos globais"
echo "  ✅ Notificações"
echo "  ✅ Auto-update"
echo "  ✅ Backup automático"
echo "  ✅ Monitor de performance"
echo "  ✅ Debug mode"
echo "  ✅ Tema dark/light"
echo ""
echo "Para testar:"
echo "  npm start"
echo ""
echo "Para fazer build:"
echo "  bash build-all.sh"
echo ""
echo "Documentação completa:"
echo "  /app/electron/FUNCIONALIDADES.md"
echo ""
