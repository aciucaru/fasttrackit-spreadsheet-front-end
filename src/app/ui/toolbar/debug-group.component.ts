import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-debug-group',
    template: `
    <div class="group-container">
        <!-- Debug group -->
        <div class="debug-group">
            <button id="log-spreadsheet" class="toolbar-button" title="Log spreadsheet"
                (click)="spreadsheetService.logSpreadsheetValues()">
                <img src="assets/icons/chapternumberingdialog.png" alt="Log spreadsheet">
            </button>

            <button id="log-col-formula" class="toolbar-button" title="Log column formula"
                (click)="spreadsheetService.logCurrentColumFormula()">
                <img src="assets/icons/pasteonlyformula.png" alt="Log column formula">
            </button>
            
            <button class="log-charts" class="toolbar-button" title="Log charts"
                (click)="spreadsheetService.logChartsInfo()">
                <img src="assets/icons/drawchart.png" alt="Log charts">
            </button>
            <button class="dummy04" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>
            <button class="dummy05" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>
            <button class="dummy06" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>

            <div class="group-label">Debug</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './debug-group.scss',
        './dummy-group.scss'
    ]
})
export class DebugGroupComponent implements OnInit
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
