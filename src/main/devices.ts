import { ipcMain, app } from 'electron';
import sharp from 'sharp';

const fs = require('fs');
const path = require('path');

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

let appData: string;

if (isDevelopment) {
  // Returns src dir if dev
  appData = path.dirname(app.getAppPath());
} else {
  // Returns path that exe is being run from
  appData = path.dirname(app.getPath('exe'));
}

appData = path.join(appData, 'resources');

console.log(appData);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resizeImage(
  event: any,
  file: string,
  output: string,
  name: string
) {
  try {
    await sharp(file)
      .resize({
        width: 80,
        height: 80,
      })
      .toFile(output, (err, info) => {
        if (err) {
          console.log('err1');
          event.reply('imageHandler', err);
        } else {
          console.log('success');
          event.reply('imageHandler', { info, output, name });
        }
      });
  } catch (error) {
    console.log('err2');
    event.reply('imageHandler', error);
  }
}

ipcMain.on('fetchDevices', async (event) => {
  console.log('fetch devices from main');
  let devices = fs.readFileSync(`${appData}\\devices.json`);
  devices = JSON.parse(devices);

  event.reply('fetchDevices', devices);
});

ipcMain.on('fetchDeviceData', async (event) => {
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
  resizeImage(event, arg.path, output, arg.name);
});

ipcMain.on('updateDeviceWidget', (event, arg) => {
  console.log(arg);
  let data = fs.readFileSync(`${appData}\\devices.json`);
  data = JSON.parse(data);
  data = data.map(
    (item: { id: any; name: any; ip: any; port: any; icon: any }) => {
      if (item.id === arg.id) {
        item = {
          id: item.id,
          name: arg.name !== item.name ? arg.name : item.name,
          ip: arg.ip !== item.ip ? arg.ip : item.ip,
          port: arg.port !== item.port ? arg.port : item.port,
          icon: {
            name:
              arg.icon.name !== item.icon.name ? arg.icon.name : item.icon.name,
            path: '',
            size: '0 mb',
            type: '',
          },
        };
      }
      return item;
    }
  );
  console.log(data);
  fs.writeFile(`${appData}\\devices.json`, JSON.stringify(data), (err: any) => {
    if (err) {
      event.reply('updateDeviceWidget', err);
      return;
    }
    event.reply('updateDeviceWidget', 'success');
  });
});
