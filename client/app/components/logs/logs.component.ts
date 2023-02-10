import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from '@app/core/models';
import { LOGS_COLUMNS } from './logs.constants';
import { LogsService } from './services/logs.service';
import { NotificationService } from './../../core/services/notification.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  source = new MatTableDataSource<Log>;

  columns = LOGS_COLUMNS;

  constructor(
    public logsService: LogsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.onGetData();
  }

  onGetData(): void {
    this.logsService.getLogs().subscribe({
      next: (logs: Log[]) => this.onDataLoaded(logs),
      error: (error: any) => this.onError(error)
    });
  }

  onDataLoaded(logs: Log[]): void {
    this.source = new MatTableDataSource(logs);

    setTimeout(() => {
      this.source.sort = this.sort;
    });
  }

  onError(error: any): void {
    this.notificationService.error(error.error);
    console.error(error);
  }

}
