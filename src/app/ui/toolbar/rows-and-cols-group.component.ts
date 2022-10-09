import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-rows-and-cols-group',
    template: `
    <div class="group-container">
        <div class="row-and-cols-group">
            <button id="add-row-above" class="toolbar-button" title="Add row above"
                (click)="spreadsheetService.addRowAbove()">
                <img src="assets/icons/insertrowsbefore.png" alt="Add row above">
            </button>
            <button id="add-row-below" class="toolbar-button" title="Add row below"
                (click)="spreadsheetService.addRowBelow()">
                <img src="assets/icons/insertrowsafter.png" alt="Add row below">
            </button>
            <button id="delete-row" class="toolbar-button" title="Delete row"
                (click)="spreadsheetService.deleteSelectedRow()">
                <img src="assets/icons/deleterows.png" alt="Delete row">
            </button>
            <button id="add-col-right" class="toolbar-button" title="Add column right"
                (click)="spreadsheetService.addColToRight()">
                <img src="assets/icons/insertcolumnsafter.png" alt="Add column right">
            </button>
            <button id="add-col-left" class="toolbar-button" title="Add column left"
                (click)="spreadsheetService.addColToLeft()">
                <img src="assets/icons/insertcolumnsbefore.png" alt="Add column left">
            </button>
            <button id="delete-col" class="toolbar-button" title="Delete column"
                (click)="spreadsheetService.deleteSelectedCol()">
                <img src="assets/icons/deletecolumns.png" alt="Delete column">
            </button>
            <div class="group-label">Rows and cols</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './rows-and-cols-group.scss',
        './dummy-group.scss'
    ]
})
export class RowsAndColsGroupComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

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
