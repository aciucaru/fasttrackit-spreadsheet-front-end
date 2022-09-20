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
            <button (click)="spreadsheetService.addRowAbove()">Add row above</button>
            <button (click)="spreadsheetService.addRowBellow()">Add row bellow</button>
            <button (click)="spreadsheetService.deleteSelectedRow()">Delete row</button>
            <button (click)="spreadsheetService.logSpreadsheetValues()">Log table values</button>
        </div>
    `,
    styles: []
})
export class MainTabComponent implements OnInit
{

    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                });
    }

}
