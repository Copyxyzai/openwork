# 🦀 MoltBot - OpenClaw Desktop

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yourusername/moltbot)

Aplicativo desktop completo para hospedar e gerenciar o OpenClaw localmente.

![MoltBot Banner](docs/images/banner.png)

## 📋 Visão Geral

MoltBot é um aplicativo desktop que permite executar o OpenClaw (sistema de IA com agentes) diretamente no seu computador, sem necessidade de servidores externos.

### ✨ Características Principais

- 🖥️ **Aplicativo Desktop Nativo** - Windows, Mac, Linux
- 🔒 **100% Local** - Seus dados nunca saem do seu computador
- 🚀 **Fácil de Usar** - Interface intuitiva e moderna
- ⚡ **Alto Desempenho** - Otimizado para uso local
- 🎨 **UI Moderna** - Design clean e responsivo
- 🔧 **Totalmente Configurável** - Personalize tudo

### 🎯 Funcionalidades

#### Core
- ✅ Gerenciamento completo do OpenClaw
- ✅ Suporte para múltiplos provedores LLM
- ✅ Interface web integrada
- ✅ Banco de dados MongoDB local
- ✅ Backup automático

#### Desktop (Electron)
- ✅ System tray com menu contextual
- ✅ Atalhos globais de teclado
- ✅ Notificações desktop
- ✅ Auto-start com sistema
- ✅ Auto-update
- ✅ Monitor de performance
- ✅ Tema claro/escuro

## 🚀 Início Rápido

### Instalação (Windows)

1. **Baixe o instalador:**
   - [MoltBot-Setup-1.0.0.exe](releases/latest)

2. **Execute o instalador:**
   - Duplo clique no arquivo `.exe`
   - Siga o assistente de instalação

3. **Pronto!**
   - MoltBot abre automaticamente
   - Configure seu provedor LLM
   - Comece a usar o OpenClaw

### Primeiros Passos

1. **Escolha um provedor:**
   - Universal Key (recomendado - sem chave necessária)
   - OpenAI (GPT)
   - Anthropic (Claude)

2. **Configure a chave API** (se não usar Universal Key)

3. **Inicie o OpenClaw**

4. **Acesse a interface de controle**

## 📚 Documentação

### Para Usuários
- 📖 [Guia do Usuário](docs/USER_GUIDE.md)
- 🔧 [Guia de Instalação](docs/INSTALLATION.md)
- ❓ [FAQ & Troubleshooting](docs/TROUBLESHOOTING.md)

### Para Desenvolvedores
- 🏗️ [Arquitetura](docs/ARCHITECTURE.md)
- 🔌 [API Reference](docs/API_REFERENCE.md)
- 💻 [Guia de Desenvolvimento](docs/DEVELOPER_GUIDE.md)
- 📦 [Como Fazer Build](electron/BUILD_GUIDE.md)

## 🛠️ Tecnologias

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **shadcn/ui** - Componentes

### Backend
- **FastAPI** - API framework
- **Python 3.11** - Runtime
- **Motor** - MongoDB async driver
- **WebSockets** - Comunicação real-time

### Desktop
- **Electron 28** - Desktop framework
- **electron-builder** - Empacotamento
- **electron-store** - Configurações
- **auto-launch** - Auto-start

### Banco de Dados
- **MongoDB 8.0** - Banco de dados NoSQL

## 📊 Requisitos de Sistema

### Para Usuário Final (Windows)
- Windows 10/11 (64-bit)
- 4GB RAM (mínimo)
- 500MB espaço em disco
- Nenhuma dependência adicional!

### Para Desenvolvimento
- Node.js 18+
- Python 3.8+
- MongoDB 4.4+
- Yarn ou npm

## 🎯 Roadmap

### v1.1 (Próxima)
- [ ] Histórico de conversas
- [ ] Templates de prompts
- [ ] Exportar conversas
- [ ] Múltiplos projetos

### v1.2 (Futuro)
- [ ] Plugin system
- [ ] Temas customizáveis
- [ ] Shortcuts customizáveis
- [ ] Integração com VS Code

### v2.0 (Planejado)
- [ ] Multi-usuário local
- [ ] Sincronização cloud (opcional)
- [ ] Mobile app (iOS/Android)

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](docs/CONTRIBUTING.md) para detalhes.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [OpenClaw](https://github.com/openclaw/openclaw) - Sistema de IA com agentes
- [Electron](https://www.electronjs.org/) - Framework desktop
- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [React](https://react.dev/) - Framework frontend

## 📞 Suporte

- 📧 Email: support@moltbot.com
- 💬 Discord: [discord.gg/moltbot](https://discord.gg/moltbot)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/moltbot/issues)
- 📖 Docs: [docs.moltbot.com](https://docs.moltbot.com)

## 🌟 Showcase

### Interface Principal
![Interface Principal](docs/images/main-interface.png)

### Configuração
![Configuração](docs/images/setup.png)

### Monitor de Performance
![Monitor](docs/images/performance.png)

---

**Desenvolvido com ❤️ pela comunidade MoltBot**

[⬆ Voltar ao topo](#-moltbot---openclaw-desktop)