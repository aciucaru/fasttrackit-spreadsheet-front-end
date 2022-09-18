import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-ribbon',
  template: `
    <div *ngFor="let currentCol of displayedColumns; let colIndex = index;">
        <p>{{currentCol}}</p>
    </div>
  `,
  styles: []
})
export class RibbonComponent implements OnInit
{
    spreadsheet?: Spreadsheet;
    displayedColumns: string[] = [];

    constructor(private spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService.getCurrentSpreadsheet()
                        .subscribe(spreadsheet =>
                            {
                                this.spreadsheet = spreadsheet;
                                this.displayedColumns = this.spreadsheet?.columnInfos
                                                        .map( columnInfo =>{ return columnInfo.name; });
                            });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }
}