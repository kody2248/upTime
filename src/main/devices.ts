import { ipcMain, app } from 'electron';
import sharp from 'sharp';

const fs = require('fs');
const path = require('path');

const appData = app.getPath('appData');

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

ipcMain.on('imageHandler', (event, arg) => {
  const dir = `${app.getPath('appData')}\\UpTime\\images`;
  const type = arg.type.replace(/(.*)\//g, '');
  const output = `${dir}\\${arg.name}.${type}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Sharp decalration incorrect
  resizeImage(event, arg.path, output);
});
