import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-main-tab',
    template: `
        <div class="tab-group-container">
            <div class="tab-group">
                <button id="add-row-above" (click)="spreadsheetService.addRowAbove()">Add row above</button><br>
                <button id="add-row-below" (click)="spreadsheetService.addRowBelow()">Add row below</button><br>
                <button id="delete-row" (click)="spreadsheetService.deleteSelectedRow()">Delete row</button>
                <button id="add-col-right" (click)="spreadsheetService.addColToRight()">Add col right</button><br>
                <button id="add-col-left" (click)="spreadsheetService.addColToLeft()">Add col left</button><br>
                <button id="delete-col" (click)="spreadsheetService.deleteSelectedCol()">Delete col</button>
            <div>
            <button (click)="spreadsheetService.logSpreadsheetValues()">Log table values</button>
        </div>
    `,
    styles: ['.tab-group { display: grid; row-gap: 0px; column-gap: 0px; grid-template-columns: max-content max-content;}',
            '#add-row-above { grid-row: 1 / 2 ; grid-column: 1 / 2; }',
            '#add-row-below{ grid-row: 2 / 3 ; grid-column: 1 / 2; }',
            '#delete-row { grid-row: 3 / 4 ; grid-column: 1 / 2; }',
            '#add-col-right { grid-row: 1 / 2 ; grid-column: 2 / 3; }',
            '#add-col-left { grid-row: 2 / 3 ; grid-column: 2 / 3; }',
            '#delete-col { grid-row: 3 / 4 ; grid-column: 2 / 3; }']
})
export class MainTabComponent implements OnInit
{

    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                });
    }

}
