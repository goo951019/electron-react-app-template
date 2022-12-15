const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const path = require("path");
const isDev = require("electron-is-dev");

log.transports.file.resolvePath = () => isDev ? `./logs/dev.log` : path.join(app.getPath("userData"), "./logs/prod.log");
log.log("App Version: "+app.getVersion());

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
        mainWindow.webContents.openDevTools({mode: "detach"});
    }

    if(!isDev){
        autoUpdater.setFeedURL({ provider: 'github', owner: 'goo951019', repo: 'electron-react-app', private: true, token: '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' })
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

autoUpdater.on("checking-for-update", () => { log.info("Checking for an update..."); })

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    log.info("Update Available!");
    const dialogOptions = {
        type: "info",
        buttons: ['OK'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOptions, (response) => { })
});

autoUpdater.on("update-not-available", () => { log.info("Update not available.");});
autoUpdater.on("download-progress", (progressTrack) => { log.info("Downloading..."+progressTrack); })

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    log.info("Update Downloaded.");
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

autoUpdater.on("error", (err) => {log.info("Update Error: "+ err)})