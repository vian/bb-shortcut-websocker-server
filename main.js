const { app, Menu, Tray } = require('electron');
const webapp = require('express')();
var cors = require('cors');
webapp.use(cors());

const http = require('http').Server(webapp);
const io = require('socket.io')(http);

const path = require('path');
const assetsDirectory = path.join(__dirname, 'img');

let tray = undefined;

// Don't show the app in the doc
app.dock.hide()

// Creates tray & window
app.on('ready', () => {
  createTray();
});

// Creates tray image & toggles window on click
const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Helper for Betburger Shortcuts', enabled: false },
    { type: 'separator' },
    { label: 'Quit', click() { app.quit(); } }
  ]);
  tray.setToolTip('Betburger Shortcuts Events Dispatcher Service');
  tray.setContextMenu(contextMenu);
};

io.on('connection', function (socket) {
    socket.on('sendData', function (data) {
        console.log(data);
        socket.broadcast.emit('sendData', data);
    });

    socket.on('sendDataCycler', function (data) {
        console.log(data);
        socket.broadcast.emit('sendDataCycler', data);
    });
});

http.listen(3001, function() {
    console.log('listening on localhost:3001');
});
