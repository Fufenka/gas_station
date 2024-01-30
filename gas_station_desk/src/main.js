const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const path = require('path');
const url = require('url');
const axios = require('axios');
const WebSocket = require('ws');

let mainWindow;
let wss;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 830,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('src/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('loadData', async (event, stationId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8080/getStationInfo/?id=${stationId}`);
        const data = response.data;
        event.reply('loadedData', data);
    } catch (error) {
        console.error(error);
        event.reply('loadDataError');
    }
});

ipcMain.on('saveChanges', async (event, postData) => {
    try {
        await axios.post('http://127.0.0.1:8080/setStation/', postData);
        event.reply('savedChanges');
    } catch (error) {
        console.error(error);
        event.reply('saveChangesError');
    }
});
