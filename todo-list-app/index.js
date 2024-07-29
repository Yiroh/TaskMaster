const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let isDev = false;
if (process.env.NODE_ENV === 'development') {
  isDev = require('electron-is-dev');
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'client/build/index.html')}`
  );

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('getTodos', () => {
  return store.get('todos', []);
});

ipcMain.handle('saveTodos', (event, todos) => {
  store.set('todos', todos);
});
