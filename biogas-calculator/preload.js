const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  generateReport: (htmlContent, filename) =>
    ipcRenderer.invoke('generate-report', htmlContent, filename),
  viewReport: (filePath) =>
    ipcRenderer.invoke('view-report', filePath),
  downloadReport: (filePath) =>
    ipcRenderer.invoke('download-report', filePath)
});
