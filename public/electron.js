const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({ 
        width: 1200, 
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    mainWindow.loadURL(isDev ? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);

    if(isDev){
        window.webContents.openDevTools({mode: "detach"});
    }

    if(!isDev){
        autoUpdater.checkForUpdates();
    }

    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    const dialogOptions = {
        type: "info",
        buttons: ['OK'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOptions, (response) => {

    })
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOptions = {
        type: "info",
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
    dialog.showMessageBox(dialogOptions).then((returnValue) => {
        if(returnValue.response === 0) autoUpdater.quitAndInstall();
    })
});