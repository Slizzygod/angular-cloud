import * as later from 'later';
import * as cronParser from 'cron-parser';
import * as fsFinder from 'fs-finder';
import * as archiver from 'archiver';
import * as fs from 'fs';

import { config } from '../config/config';
import { Folder, FolderUser, Group, User } from '../models';
import { Op } from 'sequelize';


export class BackupService {

  intervals = [];

  constructor() {
    this.onStart();
  }

  async onStart(): Promise<any> {
    const interval = later.parse.text('every 1 days at 01:00');

    this.setSchedules();

    this.onNextStart(interval);
    later.setInterval(() => this.setSchedules(), interval);
  }

  async setSchedules(): Promise<any> {
    console.log(`${this.constructor.name} service launch`);

    this.clearIntervals();

    const groups = await Group.findAll({
      where: { schedule: { [Op.ne]: null } },
      attributes: ['id', 'name', 'schedule'],
    });

    if (groups.length > 0) {
      for (const group of groups) {
        if (group && group.schedule) {
          if (Object.keys(cronParser.parseString(group.schedule).errors).length === 0) {
            const interval = later.parse.cron(group.schedule) as later.RecurrenceBuilder;

            this.setSchedule(group, interval);
          }
        }
      }
    }
  }

  setSchedule(group: Group, interval: later.RecurrenceBuilder): void {
    this.onNextStart(interval);

    const needlyInterval = later.setInterval(() => {
      return this.startBackup(group);
    }, interval);

    this.intervals.push(needlyInterval);
  }

  async startBackup(group: Group): Promise<any> {
    const folderUser = await FolderUser.findOne({
      where: { owner: true },
      include: [
        {
          model: Folder,
          as: 'folder',
          where: { group: group.id },
          attributes: ['name', 'id']
        },
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    });

    const folderPath = fsFinder
      .from(`${config.rootDir}/${folderUser.user.username}`)
      .findDirectories(`${group.name}_${folderUser.folder.id}`)[0];

      if (folderPath) {
      const archive = archiver('zip').directory(folderPath, false);
      const output = fs.createWriteStream(`${config.rootDir}/${group.name}.zip`);

      archive.pipe(output);
      archive.finalize();
    }
  }

  clearIntervals(): void {
    if (this.intervals.length > 0) {
      for (const interval of this.intervals) {
        interval.clear();
      }

      this.intervals = [];
    }
  }

  onNextStart(schedule: later.RecurrenceBuilder): void {
    const value = later.schedule(schedule).next(2)[1];

    console.log(`${this.constructor.name} service next start ${value}`);
  }
}

export const backupService = new BackupService();
