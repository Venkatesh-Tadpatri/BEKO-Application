const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    autoHideMenuBar: true,
    title: "Biogas System Calculator",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // LOAD REACT BUILD (PRODUCTION)
  mainWindow.loadFile(path.join(__dirname, "build", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/* -------- FILE SAVE HANDLERS -------- */

// Reports folder lives next to the installed app (created by the NSIS
// installer via installer.nsh); fall back to creating it in dev mode.
function getReportsDir() {
  const baseDir = app.isPackaged ? path.dirname(app.getPath("exe")) : __dirname;
  const reportsDir = path.join(baseDir, "Reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  return reportsDir;
}

async function renderHtmlToPdfBuffer(htmlContent) {
  // __dirname/build lives inside app.asar (read-only) once packaged, so the
  // temp file must go in the OS temp dir instead. Asset URLs are rewritten
  // to absolute file:// paths into the (readable) asar build folder so the
  // logo still resolves.
  const buildDir = path.join(__dirname, "build").replace(/\\/g, "/");
  const resolvedHtml = htmlContent.replace(/(["'])\/static\//g, `$1file://${buildDir}/static/`);

  const tempPath = path.join(app.getPath("temp"), `_beko_report_${Date.now()}.html`);
  fs.writeFileSync(tempPath, resolvedHtml, "utf-8");

  const win = new BrowserWindow({ show: false, webPreferences: { contextIsolation: true } });
  await win.loadFile(tempPath);

  // Allow fonts and images to finish loading
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const pdfData = await win.webContents.printToPDF({
    pageSize: "A4",
    printBackground: true
  });

  win.close();
  try { fs.unlinkSync(tempPath); } catch (_) {}

  return pdfData;
}

ipcMain.handle("generate-report", async (event, htmlContent, filename) => {
  const pdfData = await renderHtmlToPdfBuffer(htmlContent);
  const filePath = path.join(getReportsDir(), `${filename}.pdf`);
  fs.writeFileSync(filePath, pdfData);
  return { success: true, filePath };
});

ipcMain.handle("view-report", async (event, filePath) => {
  const errorMessage = await shell.openPath(filePath);
  return { success: !errorMessage, error: errorMessage || null };
});

ipcMain.handle("download-report", async (event, filePath) => {
  // Report is already saved in the Reports folder by generate-report;
  // reveal it in Explorer instead of prompting for another save location.
  shell.showItemInFolder(filePath);
  return { success: true, filePath };
});

ipcMain.handle("save-excel", async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Excel Report",
    defaultPath: `Biogas_Report_${Date.now()}.xlsx`,
    filters: [{ name: "Excel Files", extensions: ["xlsx"] }]
  });
  return filePath;
});

