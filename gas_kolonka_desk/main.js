const {app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);
  
  ipcMain.on('console-message', (_, message) => {
    console.log(message); 
  });

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});