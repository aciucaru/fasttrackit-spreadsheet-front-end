import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableSpreadsheet } from 'src/app/model/editable-spreadsheet';

import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-ribbon',
  template: `
    <mat-tab-group>
        <mat-tab label="Main"> <app-main-tab></app-main-tab> </mat-tab>
        <mat-tab label="Styles">  </mat-tab>
        <mat-tab label="Formula">  </mat-tab>
    </mat-tab-group>
  `,
  styles: []
})
export class RibbonComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    displayedColumns: string[] = [];

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService
            .getCurrentSpreadsheetSource()
            .subscribe(spreadsheet =>
                {
                    this.spreadsheet = spreadsheet;
                    this.displayedColumns = this.spreadsheet?.spreadsheet!.columnInfos
                                            .map( columnInfo =>{ return columnInfo.name; });
                });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }
}