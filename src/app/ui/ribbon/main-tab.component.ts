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
        </div>
    `,
    styles: [],
    styleUrls: ['./ribbon-general.scss', './main-tab.component.scss']
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
