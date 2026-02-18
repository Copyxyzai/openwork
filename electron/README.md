# MoltBot Windows Desktop Application

## Overview

MoltBot Desktop is a standalone Windows application that packages the complete MoltBot stack (Frontend, Backend, MongoDB) into a single installable application.

## Quick Start

### For Users

1. Download `MoltBot-Setup-1.0.0.exe`
2. Run the installer
3. Launch MoltBot from Desktop or Start Menu

### For Developers

See [BUILD_GUIDE.md](BUILD_GUIDE.md) for detailed build instructions.

## What's Included

- **Frontend:** React application with MoltBot UI
- **Backend:** FastAPI server (compiled to .exe)
- **Database:** MongoDB 8.0.4 portable edition
- **Electron:** Desktop wrapper and process manager

## Features

- ✅ Fully offline operation
- ✅ All data stored locally
- ✅ No external dependencies required
- ✅ Auto-starts all services
- ✅ System tray integration
- ✅ Auto-updates (can be configured)

## System Requirements

- Windows 10/11 (64-bit)
- 4GB RAM minimum
- 500MB free disk space
- Internet connection (for OpenClaw features only)

## Architecture

```
Electron Main Process
├── MongoDB Process (port 27017)
├── Backend Process (port 8001)
├── Frontend Server (port 3000)
└── Browser Window
```

## Data Storage

- Application: `C:\Program Files\MoltBot`
- User Data: `%APPDATA%\moltbot`
- Logs: `%APPDATA%\moltbot\logs`
- Database: `%APPDATA%\moltbot\mongodb-data`

## Ports Used

- `27017` - MongoDB
- `8001` - Backend API
- `3000` - Frontend (internal)
- `18789` - OpenClaw Gateway (when active)

## Logs

Application logs are written to:
```
%APPDATA%\moltbot\logs\moltbot.log
```

## Uninstallation

1. Use Windows "Add or Remove Programs"
2. Select MoltBot and click Uninstall
3. User data will be preserved unless manually deleted

## Development

### Running in Development Mode

```bash
cd /app/electron
npm install
npm start
```

Note: This requires services to be running separately.

### Building for Production

See [BUILD_GUIDE.md](BUILD_GUIDE.md)

## License

MIT
