import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableSpreadsheet } from 'src/app/model/editable-spreadsheet';
import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-main-tab',
    template: `
    <div>
        <button (click)="this.spreadsheetService.addRow()">Add row</button>
        <button (click)="this.spreadsheetService.deleteRow()">Delete row</button>
    </div>
    `,
    styles: []
})
export class MainTabComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void {}

    getTable(): void
    {
        this.spreadsheetService.getCurrentSpreadsheetSource()
                        .subscribe(spreadsheet =>
                            {
                                this.spreadsheet = spreadsheet;
                            });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }

}
