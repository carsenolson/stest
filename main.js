const fs = require('fs');
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

function createWindow() {
    var words = fs.readFileSync('firebaseconfig.json');
    var readData = JSON.parse(words);
    var studentInfo = {};
    console.log(readData);

    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    let win = new BrowserWindow({width, height});
    win.loadURL(`file://${__dirname}/index.html`);

    ipcMain.on('asynchronous-message', (event, arg) => {
        if (arg == 1)
            event.sender.send('asynchronous-reply', readData);

        if (arg == 3)
            event.sender.send('asynchronous-reply', studentInfo);

        if (arg[0] == 4) {
            console.log(arg[1]);
            var writeData = JSON.stringify(arg[1], null, 2);
            fs.writeFile('firebaseconfig.json', writeData, finished);
        }

        if (arg[0] == 2) {
            studentInfo = arg[1];
            console.log(studentInfo);
        }

        function finished(err){
            console.log('all just been set.');
        }
    });
}

app.on('ready', createWindow);
