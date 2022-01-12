import sqlite3, { Database } from 'sqlite3';
import { open } from 'sqlite';
import { promises } from 'stream';

export default class Data {
  db: Database;

  constructor(file: string) {
    this.db = new sqlite3.Database(file, (err) => {
      return this.createTables(err);
    });
  }

  createTables(err: Error | null) {
    return new Promise<void>((resolve, reject) => {
      if (err) {
        reject(err);
      }
      this.db.exec(`CREATE TABLE IF NOT EXISTS devices (
                    device_id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    ip TEXT NOT NULL,
                    port TEXT NULL,
                    iconName TEXT NULL,
                    iconPath TEXT NULL,
                    iconSize TEXT NULL,
                    iconType TEXT NULL
                  )`);

      this.db.exec(`CREATE TABLE IF NOT EXISTS events (
                    event_id INTEGER PRIMARY KEY,
                    device INTEGER NOT NULL,
                    action TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    dtTm TEXT NULL
                  )`);
      resolve();
    });
  }
}

// const db = new Data();
// db.connect('./data.db')
//   .then(() => {
//     console.log('connected!');
//     return true;
//   })
//   .then(() => {
//     console.log('created tables');
//     return true;
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const db = new Data('./data.db')
  .then(() => {
    console.log('created tables');
    return true;
  })
  .catch(() => {
    console.log('could not connect to tables');
  });
console.log(db);
