import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observer } from 'rxjs';
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
    // spreadsheetObserver: Observer<EditableSpreadsheet> =
    //     {
    //         next: spreadsheet => this.spreadsheet = spreadsheet,
    //         error: err => console.error('Observer got an error: ' + err),
    //         complete: () => console.log('Observer got a complete notification'),
    //     };
    displayedColumns: string[] = [];

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                    this.displayedColumns = this.spreadsheet.spreadsheet!.columnInfos
                                            .map( columnInfo =>{ return columnInfo.name; });
                });
    }
}