const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const settings = require('electron-settings')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  const windowSettings = getSavedWindowSize()
  const fullScreenMode = startInFullScreenMode();

  // Create the browser window.
  if (windowSettings != null) {
    mainWindow = new BrowserWindow({width: windowSettings.width, height: windowSettings.height})
  }
  else {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    const actualWidth = (width / 100) * 80
    const actualHeight = (height / 100) * 80
    mainWindow = new BrowserWindow({width: actualWidth, height: actualHeight})
  }
  console.log(fullScreenMode)
  if (fullScreenMode)
    mainWindow.maximize()


  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('resize', function(e) {
    const windowsSize = this.getSize()
    if (windowsSize != 0)
    {
      const workAreaSize = mainWindow.isMaximized()
      console.log(workAreaSize)
      if (!workAreaSize) {
        settings.set('window', {
          width: windowsSize[0],
          height: windowsSize[1]
        })
        settings.set('startUpEvents', {
          fullscreen: false
        })
      }
      else {
        settings.set('startUpEvents', {
          fullscreen: true
        })
      }
    }
  })
}

function startInFullScreenMode()
{
  const startUpEvents = settings.get('startUpEvents')

  if (startUpEvents != null)
    return startUpEvents.fullscreen
  else
    return false
}

function getSavedWindowSize()
{
  const window = settings.get('window')

  if (window != null)
    return window
  else
    return null
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
