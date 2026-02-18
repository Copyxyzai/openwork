# MoltBot - Guia Rápido de Build Windows

## 🚀 Build em 4 Comandos

```bash
# 1. Entre na pasta electron
cd /app/electron

# 2. Instale dependências
npm install

# 3. Execute o build automático
bash build-all.sh

# 4. Aguarde! (~15-25 minutos)
```

## 💾 Resultado

O instalador estará em:
```
/app/electron/dist/MoltBot-Setup-1.0.0.exe
```

**Tamanho:** ~200-300 MB

## 💻 Instalação no Windows

1. Copie o `.exe` para o Windows
2. Execute como Administrador
3. Siga o assistente de instalação
4. Pronto! 🎉

## ⚠️ Aviso de Segurança

O Windows pode mostrar um aviso porque o app não está assinado:
- Clique em "Mais informações"
- Clique em "Executar assim mesmo"

Isso é normal para apps não assinados digitalmente.

## 🔧 Pré-requisitos

Para fazer o build, você precisa de:

1. **Node.js** (v18+)
   - https://nodejs.org/

2. **Python** (3.8+)
   - https://python.org/
   - Marque "Add to PATH" na instalação

3. **PyInstaller**
   ```bash
   pip install pyinstaller
   ```

## 🐛 Problemas?

### PyInstaller não encontrado
```bash
pip install pyinstaller
```

### Erro no build do frontend
```bash
cd /app/frontend
yarn build
```

### extract-zip não encontrado
```bash
cd /app/electron
npm install extract-zip
```

## 📚 Documentação Completa

Para detalhes completos, veja:
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Guia detalhado
- [README.md](README.md) - Documentação geral

## ⚙️ Customização

### Mudar Nome do App
Edite `/app/electron/package.json`:
```json
{
  "productName": "Seu Nome",
  "name": "seunome"
}
```

### Adicionar Ícone
1. Crie `icon.ico` (256x256)
2. Salve em `/app/electron/build/icon.ico`
3. Faça o build novamente

### Mudar Versão
Edite `/app/electron/package.json`:
```json
{
  "version": "2.0.0"
}
```

## ✅ Checklist de Build

- [ ] Node.js instalado
- [ ] Python instalado
- [ ] PyInstaller instalado
- [ ] `npm install` executado
- [ ] Backend preparado
- [ ] Frontend preparado
- [ ] MongoDB baixado
- [ ] Instalador gerado
- [ ] Testado no Windows

## 📊 Tempo de Build

| Etapa | Tempo |
|-------|-------|
| Backend | 5-10 min |
| Frontend | 2-3 min |
| MongoDB | 3-5 min |
| Instalador | 3-5 min |
| **Total** | **15-25 min** |

## 🚀 Próximos Passos

Após criar o instalador:

1. **Teste localmente** primeiro
2. **Documente** requisitos de sistema
3. **Crie um site** de download
4. **Considere** assinatura de código para distribuição profissional

---

**Pronto para começar?** Execute `bash build-all.sh` agora! 🎉
