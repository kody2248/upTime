import { ipcMain, app } from 'electron';
import sharp from 'sharp';

const fs = require('fs');
const path = require('path');

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

let appData: string;

if (isDevelopment) {
  // Returns src dir if dev
  appData = path.join(__dirname, '../../');
} else {
  // Returns path that exe is being run from
  //appData = process.resourcesPath;
  appData = process.env.PORTABLE_EXECUTABLE_DIR;
}

// Utilize Sharp package to resize and output file
async function resizeImage(
  event: Electron.IpcMainEvent,
  options: { file: any; output: any; fileName?: string; name?: any },
  callback: { (res: any): void; (arg0: unknown): void }
) {
  const { file, output, name } = options;
  try {
    await sharp(file)
      .resize({
        width: 80,
        height: 80,
      })
      .toFile(output, (err, info) => {
        if (err) {
          callback(err);
        } else {
          callback('success');
        }
      });
  } catch (error) {
    callback(error);
  }
}

// Write to device.json
const writeToDeviceJson = (
  devices: any,
  callback: { (res: any): void; (res: any): void; (arg0: string): void }
) => {
  const file = path.join(appData, 'configs', 'devices.json');
  fs.writeFile(file, JSON.stringify(devices), (err: any) => {
    if (err) {
      callback(err);
    }
    callback('success');
  });
};

// Sample IPC event
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', appData);
});

// Read JSON and parse devices
ipcMain.on('fetchDevices', async (event) => {
  const file = path.join(appData, 'configs', 'devices.json');
  let devices = fs.readFileSync(file);
  devices = JSON.parse(devices);

  event.reply('fetchDevices',{ devices, appData});
});

// Read JSON and parse events
ipcMain.on('fetchDeviceData', async (event) => {
  const file = path.join(appData, 'configs', 'status.json');
  let data = fs.readFileSync(file);
  data = JSON.parse(data);
  event.reply('fetchDeviceData', data);
});

// Handle image uploads
// Expects object parameter with following properties:
//  file: {id: deviceID, name: deviceName, type: fileType, path: file path upload}
//  device: compiled device with new data present
ipcMain.on('imageHandler', (event, arg) => {
  // Get output directory, image type and file output path
  const dir = path.join(appData, 'device-images');
  const type = arg.type.replace(/(.*)\//g, '');
  const fileName = `${arg.name}.${type}`;
  const output = path.join(dir, fileName);
  const options = {
    file: arg.path,
    output,
    fileName,
  };

  // Create destination if doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // Pass to Sharp for resizing and saving
  resizeImage(event, options, (res: any) => {
    event.reply('imageHandler', { output, fileName, type });
  });
});

// Handle image deletion. Expects full Device List to update JSON file with blank values
ipcMain.on('imageDelete', (event, arg) => {
  const file = path.join(appData, 'device-images', arg.icon.name);
  console.log(`image delete ${file}`);
  try {
    fs.unlinkSync(file);
    writeToDeviceJson(arg.devices, (res: any) => {
      event.reply('imageDelete', res);
    });
  } catch (err) {
    event.reply('imageDelete', err);
  }
});

// Handle updates from Device Edit Widget
ipcMain.on('updateDeviceJSON', (event, arg) => {
  writeToDeviceJson(arg, (res: any) => {
    event.reply('updateDeviceJSON', res);
  });
});
