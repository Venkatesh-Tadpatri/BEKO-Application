# BEKO Application - Filter selection

A desktop application built with Electron and React for filter selection of housing model and report generation.

##  Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building Installer](#building-installer)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software
1. Node.js (v16.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. Git
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Optional (Recommended):
- Visual Studio Code or any code editor
- Git GUI Client (GitHub Desktop, GitKraken, etc.)

## Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd BEKO_APPLICATION
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Electron
- React
- Electron Builder
- All other dependencies listed in `package.json`

## Development

### Running the Application in Development Mode
```bash
npm start
```
This will:
- Start the React development server
- Launch the Electron application
- Enable hot-reload for development

### Available Scripts
- `npm start` - Run the application in development mode
- `npm run build` - Build the React app for production
- `npm run electron` - Run Electron (after building React app)
- `npm run dist` - Create Windows installer (.exe)

## Building Installer

### Create Windows Installer
```bash
npm run dist
```

This will:
- Build the React application
- Package the Electron app
- Create a Windows installer (.exe) in the `dist/` folder
- The installer will:
  - Install the application to `C:\Program Files\BEKO Application`
  - Create a desktop shortcut
  - Add to Windows Start Menu

### Build Output Location
- Installer: `dist/BEKO Application Setup <version>.exe`
- Unpacked files: `dist/win-unpacked/`

## Project Structure

```
BEKO_APPLICATION/
├── biogas-calculator/
│   ├── assets/           # Images, icons, logos
│   │   ├── icon.ico
│   │   └── BEKO-logo-300dpi.ico
│   ├── public/           # Static files
│   │   ├── electron.js   # Main Electron process
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── password.html # Password protection page
│   │   └── robots.txt
│   └── src/              # React source code
│       └── (React components and logic)
├── build/                # Build output (ignored in Git)
├── dist/                 # Distribution files (ignored in Git)
├── node_modules/         # Dependencies (ignored in Git)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── electron.js           # Electron configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── README.md             # This file
└── tailwind.config.js    # Tailwind CSS configuration
```

## Environment Variables

If the project uses environment variables:

1. Copy `.env.example` to `.env`
2. Fill in the required values
3. Never commit `.env` to Git (it's in .gitignore)

## Troubleshooting

### Common Issues:

#### Issue: `npm install` fails
Solution:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

#### Issue: Electron app doesn't start
Solution:
- Make sure all dependencies are installed
- Check if ports 3000 is available
- Try running `npm run build` first, then `npm run electron`

#### Issue: Build fails with "out of memory" error
Solution:
- Increase Node.js memory: `set NODE_OPTIONS=--max-old-space-size=4096` (Windows)
- Close other applications to free up memory

#### Issue: Installer doesn't create desktop shortcut
Solution:
- Check `package.json` electron-builder configuration
- Ensure `"createDesktopShortcut": true` is set

## Development Workflow

1. Make changes in the `src/` folder
2. Test using `npm start`
3. Commit your changes with meaningful messages
4. Push to the repository
5. Build installer when ready for release

## Updating the Application

To update the application after pulling changes:

```bash
git pull origin main
npm install  # Install any new dependencies
npm start    # Test the changes
npm run dist # Build new installer if needed
```

## Support

For issues or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## Team

- Team Lead: [Nikita Dixit]
- Developer: [Venkatesh Tdpatri]

---

Note: Make sure to keep this README updated as the project evolves.
