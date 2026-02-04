const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

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
      contextIsolation: true
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

ipcMain.handle("save-pdf", async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save PDF Report",
    defaultPath: `Biogas_Report_${Date.now()}.pdf`,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }]
  });
  return filePath;
});

ipcMain.handle("save-excel", async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Excel Report",
    defaultPath: `Biogas_Report_${Date.now()}.xlsx`,
    filters: [{ name: "Excel Files", extensions: ["xlsx"] }]
  });
  return filePath;
});


