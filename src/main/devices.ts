import { ipcMain, app } from 'electron';
//import sharp from 'sharp';

const fs = require('fs');
const path = require('path');
const appData = app.getPath('appData');

async function resizeImage(  arg, output ) {
  try {
    await sharp(arg)
      .resize({
        width: 80,
        height: 80
      })
      .toFile( output );
  } catch (error) {
    console.log(error);
  }
}

ipcMain.on('fetchDevices', async (event, arg) => {
  let devices = fs.readFileSync(`${__dirname}\\devices.json`);
  devices = JSON.parse(devices);

  event.reply('fetchDevices', devices);
});

ipcMain.on('fetchDeviceData', async (event, arg) => {
  console.log('device data ran');
  let data = fs.readFileSync(`${__dirname}\\status.json`);
  data = JSON.parse(data);
  event.reply('fetchDeviceData', data);
});

// ipcMain.on('imageHandler', (event, arg) => {
//   console.log('attach icon from main');
//   console.log(arg);
//   console.log(app.getPath('appData'));

//   console.log(__dirname);

//   let output = `${appData}\\discord-alerts\\images\\${arg.name}.jpg`;

//   // Sharp decalration incorrect
//   resizeImage(arg.path, output);

// });
