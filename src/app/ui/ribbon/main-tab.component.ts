import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { EditableSpreadsheet } from 'src/app/model/editable-spreadsheet';
import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-main-tab',
    template: `
    <div>
        <button>Add row</button>
        <button>Delete row</button>
    </div>
    `,
    styles: []
})
export class MainTabComponent implements OnInit
{

    spreadsheet?: EditableSpreadsheet;
    spreadsheetObserver: Observer<EditableSpreadsheet> =
    {
        next: spreadsheet => this.spreadsheet = spreadsheet,
        error: err => console.error('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification'),
    };
    
    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe(spreadsheet =>
                {
                    this.spreadsheet = spreadsheet;
                });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }

}
