import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-main-toolbar',
    template: `
        <div class="tab-group-container">
            <div class="tab-group">
                <button id="add-row-above" (click)="spreadsheetService.addRowAbove()">
                    <img src="assets/icons/insertrowsbefore.png" alt="Add row above">
                </button><br>
                <button id="add-row-below" (click)="spreadsheetService.addRowBelow()">
                    <img src="assets/icons/insertrowsafter.png" alt="Add row below">
                </button><br>
                <button id="delete-row" (click)="spreadsheetService.deleteSelectedRow()">
                    <img src="assets/icons/deleterows.png" alt="Delete row">
                </button>
                <button id="add-col-right" (click)="spreadsheetService.addColToRight()">
                    <img src="assets/icons/insertcolumnsafter.png" alt="Add column right">
                </button><br>
                <button id="add-col-left" (click)="spreadsheetService.addColToLeft()">
                    <img src="assets/icons/insertcolumnsbefore.png" alt="Add column left">
                </button><br>
                <button id="delete-col" (click)="spreadsheetService.deleteSelectedCol()">
                    <img src="assets/icons/deletecolumns.png" alt="Delete column">
                </button>
                <button (click)="spreadsheetService.logSpreadsheetValues()">
                    <img src="assets/icons/chapternumberingdialog.png" alt="Log spreadsheet">
                </button>
            <div>
        </div>
    `,
    styles: [],
    styleUrls: ['./main-toolbar.component.scss', './buttons.scss']
})
export class MainToolbarComponent implements OnInit
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
