import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from '@app/core/models';
import { LOGS_COLUMNS } from './logs.constants';
import { LogsService } from './services/logs.service';

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
    public logsService: LogsService
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
    console.error(error);
  }

}
