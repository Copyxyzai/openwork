# 📖 Guia do Usuário - MoltBot

## Introdução

Bem-vindo ao MoltBot! Este guia irá ajudá-lo a aproveitar ao máximo a aplicação.

## Índice

1. [Primeiros Passos](#primeiros-passos)
2. [Interface Principal](#interface-principal)
3. [Configuração de Provedores](#configuração-de-provedores)
4. [Usando o OpenClaw](#usando-o-openclaw)
5. [Configurações](#configurações)
6. [Atalhos de Teclado](#atalhos-de-teclado)
7. [Backup e Restauração](#backup-e-restauração)
8. [Dicas e Truques](#dicas-e-truques)

---

## Primeiros Passos

### Primeira Execução

Quando você abre o MoltBot pela primeira vez:

1. **Tela de Setup**
   - Você verá a tela de configuração do OpenClaw
   - Precisa escolher um provedor LLM

2. **Escolha um Provedor**
   - **Universal Key** (Recomendado)
     * Sem necessidade de chave
     * Funciona imediatamente
     * Ideal para testes
   
   - **OpenAI (GPT)**
     * Precisa de chave API da OpenAI
     * Modelos: GPT-4, GPT-3.5
   
   - **Anthropic (Claude)**
     * Precisa de chave API da Anthropic
     * Modelos: Claude 3

3. **Configure a Chave** (se necessário)
   - Cole sua chave API no campo
   - Botão de "revelar" para ver a chave

4. **Inicie o OpenClaw**
   - Clique em "Start OpenClaw"
   - Aguarde a inicialização (~10-15 segundos)

5. **Acesse a Interface de Controle**
   - URL será exibida após iniciar
   - Clique para abrir no navegador

---

## Interface Principal

### Tela de Setup

```
┌───────────────────────────────────────────────┐
│  🦀 MoltBot - OpenClaw Desktop                │
│                                               │
│  Connect your LLM provider to start           │
│                                               │
│  ┌─────────────────────────────────────┐   │
│  │ Provider & API Key                    │   │
│  │                                       │   │
│  │ LLM Provider:                         │   │
│  │ [Universal Key (Recommended)    ▼]   │   │
│  │                                       │   │
│  │ [Start OpenClaw]                      │   │
│  └─────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```

### System Tray (Bandeja)

O MoltBot fica na bandeja do sistema (canto inferior direito no Windows).

**Ícone na Bandeja:**
- 🔵 Verde: Tudo funcionando
- 🟡 Amarelo: Serviço parcial
- 🔴 Vermelho: Erro

**Menu do Tray:**
```
┌─────────────────────────────┐
│ Abrir MoltBot               │
├─────────────────────────────┤
│ Status dos Serviços ▶        │
│   ● MongoDB               │
│   ● Backend               │
│   ● Frontend              │
├─────────────────────────────┤
│ Abrir Logs                  │
│ Abrir Pasta de Dados        │
├─────────────────────────────┤
│ Sair                        │
└─────────────────────────────┘
```

---

## Configuração de Provedores

### Universal Key

**O que é:**
- Chave universal que funciona sem configuração
- Sem custo adicional
- Ideal para começar

**Como usar:**
1. Selecione "Universal Key" no dropdown
2. Clique "Start OpenClaw"
3. Pronto!

### OpenAI (GPT)

**O que é:**
- Modelos GPT-4, GPT-3.5-turbo
- Precisa de chave da OpenAI

**Como obter chave:**
1. Acesse https://platform.openai.com/
2. Faça login ou crie conta
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie a chave

**Como configurar:**
1. Selecione "OpenAI (GPT)" no dropdown
2. Cole a chave no campo "API Key"
3. Clique "Start OpenClaw"

### Anthropic (Claude)

**O que é:**
- Modelos Claude 3 (Opus, Sonnet, Haiku)
- Precisa de chave da Anthropic

**Como obter chave:**
1. Acesse https://console.anthropic.com/
2. Faça login ou crie conta
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie a chave

**Como configurar:**
1. Selecione "Anthropic (Claude)" no dropdown
2. Cole a chave no campo "API Key"
3. Clique "Start OpenClaw"

---

## Usando o OpenClaw

### Iniciar o OpenClaw

1. **Configure o provedor** (se ainda não fez)
2. **Clique em "Start OpenClaw"**
3. **Aguarde a inicialização**
   - Barra de progresso será exibida
   - Leva ~10-15 segundos

4. **Acesse a interface**
   - URL aparecerá após iniciar
   - Exemplo: `http://localhost:18791`
   - Clique no link para abrir

### Interface de Controle

Após abrir a URL:

1. **Dashboard**
   - Visão geral do sistema
   - Status dos agentes
   - Métricas de uso

2. **Chat**
   - Converse com os agentes
   - Envie comandos
   - Receba respostas

3. **Projetos**
   - Gerencie projetos
   - Organize tarefas
   - Acompanhe progresso

### Parar o OpenClaw

1. **Botão "Stop OpenClaw"**
   - Aparece quando OpenClaw está rodando
   - Clique para parar

2. **Via System Tray**
   - Clique direito no ícone
   - "Stop OpenClaw"

3. **Fechando o MoltBot**
   - OpenClaw para automaticamente

---

## Configurações

### Acessar Configurações

- **Atalho:** `Ctrl + ,` (virgula)
- **Menu:** Arquivo → Configurações
- **Tray:** Botão direito → Configurações

### Opções Disponíveis

#### Geral
```
☐ Tema
   ○ Claro
   ● Escuro
   ○ Automático (sistema)

☑ Notificações
   Exibir notificações desktop

☑ Minimizar para bandeja
   Minimizar para system tray ao fechar janela
```

#### Sistema
```
☐ Iniciar com Windows
   Abrir MoltBot ao ligar o computador

☑ Atualizações Automáticas
   Baixar e instalar atualizações automaticamente
```

#### Backup
```
☑ Backup Automático
   Criar backups periodicamente

Intervalo: [24 horas ▼]
   - A cada hora
   - A cada 6 horas
   - A cada 12 horas
   - Diariamente
   - Semanalmente
```

#### Avançado
```
☐ Modo Debug
   Exibir logs detalhados e DevTools

Atalhos de Teclado:
   Ctrl+Shift+M: Mostrar/Ocultar janela
   Ctrl+N: Novo chat
   Ctrl+F: Busca
   Ctrl+,: Configurações
```

---

## Atalhos de Teclado

### Globais (funcionam sempre)

| Atalho | Ação |
|--------|-------|
| `Ctrl+Shift+M` | Mostrar/Ocultar janela |
| `Ctrl+N` | Novo chat |
| `Ctrl+F` | Busca |
| `Ctrl+,` | Configurações |

### Na Janela

| Atalho | Ação |
|--------|-------|
| `Ctrl+Q` | Sair |
| `Ctrl+R` | Recarregar |
| `F11` | Tela cheia |
| `Ctrl+0` | Zoom padrão |
| `Ctrl++` | Aumentar zoom |
| `Ctrl+-` | Diminuir zoom |

---

## Backup e Restauração

### Criar Backup Manual

1. **Via Menu**
   - Ferramentas → Criar Backup

2. **Via Configurações**
   - Configurações → Backup → "Criar Backup Agora"

3. **Localização**
   ```
   Windows: %APPDATA%\moltbot\backups\
   ```

### Backup Automático

**Como funciona:**
- Ativado por padrão
- Cria backup a cada 24 horas
- Mantém últimos 10 backups
- Limpa backups antigos automaticamente

**Configurar:**
1. Configurações → Backup
2. Marcar "Backup Automático"
3. Escolher intervalo

### Restaurar Backup

1. **Via Menu**
   - Ferramentas → Restaurar Backup

2. **Escolher arquivo**
   - Selecione o backup desejado
   - Data e hora são mostradas

3. **Confirmar**
   - Clique "Restaurar"
   - App será reiniciado

---

## Dicas e Truques

### Performance

**Se o app estiver lento:**
1. Feche outras aplicações
2. Verifique uso de CPU/RAM (monitor integrado)
3. Limpe backups antigos
4. Reinicie o MoltBot

### Espaço em Disco

**Liberar espaço:**
1. Remova backups antigos manualmente
2. Limpe logs antigos
3. Compacte banco de dados (backup + restauração)

### Problemas Comuns

**OpenClaw não inicia:**
1. Verifique chave API
2. Verifique conexão com internet
3. Veja logs: Ferramentas → Abrir Logs
4. Reinicie o MoltBot

**Interface travada:**
1. Aguarde 30 segundos
2. Se não responder, force fechar
3. Reabra o MoltBot
4. Verifique logs

**Atalhos não funcionam:**
1. Verifique se outro app usa o mesmo atalho
2. Reinicie o MoltBot
3. Redefina atalhos nas configurações

### Próximas Ações

- 📖 Leia o [Troubleshooting](TROUBLESHOOTING.md) completo
- ⚙️ Explore as [Configurações Avançadas](ADVANCED.md)
- 💻 Consulte a [API Reference](API_REFERENCE.md)
- 💬 Junte-se ao [Discord](https://discord.gg/moltbot)

---

## Suporte

Precisa de ajuda?

- 📖 [FAQ](TROUBLESHOOTING.md#faq)
- 💬 [Discord](https://discord.gg/moltbot)
- 🐛 [GitHub Issues](https://github.com/yourusername/moltbot/issues)
- 📧 support@moltbot.com

---

**Última atualização:** 18 de Fevereiro de 2025