import { ipcMain, app } from 'electron';
import sharp from 'sharp';

const fs = require('fs');
const path = require('path');
const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

let appData;

if(isDevelopment) {
  // Returns src dir if dev
  appData = path.dirname (app.getAppPath());
} else {
  // Returns path that exe is being run from
  appData = path.dirname (app.getPath ('exe'));
}

appData = path.join(appData, 'resources');

async function resizeImage(event, file, output) {
  try {
    await sharp(file)
      .resize({
        width: 80,
        height: 80,
      })
      .toFile(output, (err, info) => {
        if (err) {
          event.reply('imageHandler', err);
        } else {
          event.reply('imageHandler', info);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

ipcMain.on('fetchDevices', async (event, arg) => {
  console.log('fetch devices');
  console.log(appData);
  let devices = fs.readFileSync(`${appData}\\devices.json`);
  devices = JSON.parse(devices);

  event.reply('fetchDevices', devices);
});

ipcMain.on('fetchDeviceData', async (event, arg) => {
  console.log('device data ran');
  let data = fs.readFileSync(`${appData}\\status.json`);
  data = JSON.parse(data);
  event.reply('fetchDeviceData', data);
});

ipcMain.on('imageHandler', (event, arg) => {
  const dir = `${appData}\\images`;
  const type = arg.type.replace(/(.*)\//g, '');
  const output = `${dir}\\${arg.name}.${type}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Sharp decalration incorrect
  resizeImage(event, arg.path, output);
});

ipcMain.on('updateDeviceWidget', (event, arg) => {
  // Write to JS file
  event.reply('updateDeviceWidget', arg);
});
