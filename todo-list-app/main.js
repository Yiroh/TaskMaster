const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
let server;
let serverPort;

function createWindow() {
  // Start your Express server
  server = require('./server.js');
  serverPort = server.address().port;

  // Create the browser window
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load your React app
  const startURL = isDev
    ? 'http://localhost:3000'
    : `http://localhost:${serverPort}`;

  win.loadURL(startURL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (server) server.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
