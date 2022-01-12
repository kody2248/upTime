import sqlite3 from 'sqlite3';
import {Database} from 'sqlite3'
import { open } from 'sqlite';
import { promises } from 'stream';

export default class Data {
  db:Database;

  connect(file: string) {
    return new Promise<void>((resolve, reject) => {
      this.db = new sqlite3.Database(file, (err) => {
        if (err) {
          reject(err.message);
        }
        console.log('Connected to database');
        resolve();
      });
    });
  }

  createTables() {
    return new Promise((resolve, reject)=>{
      this.db.exec(`CREATE TABLE IF NOT EXISTS devices (
                    device_id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    ip TEXT NOT NULL,
                    port TEXT NULL,
                    iconName TEXT NULL,
                    iconPath TEXT NULL,
                    iconSize TEXT NULL,
                    iconType TEXT NULL,
                  )`);

      this.db.exec(`CREATE TABLE IF NOT EXISTS events (
                    event_id INTEGER PRIMARY KEY,
                    device INTEGER NOT NULL,
                    action TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    dtTm TEXT NULL,
                  )`);
    });
  }
}

const db = new Data();
db.connect('./data.db')
  .then(() => {
    console.log('connected!');
    return true;
  })
  .then(()=>{
    console.log('created tables');
    return true;
  })
  .catch((err) => {
    console.log(err);
  });
