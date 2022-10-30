import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-chart-group',
    template: `
    <div class="group-container">
        <div class="chart-group">
            <button id="bar-chart" class="toolbar-button" title="Bar chart"
                (click)="spreadsheetService.addEmptyBarChart()">
                <img src="assets/icons/bar_52x60_v2.png" alt="Bar chart">
            </button>

            <button id="xy-chart" class="toolbar-button" title="XY chart"
                (click)="spreadsheetService.addEmptyXYChart()">
                <img src="assets/icons/stackdirectboth_52x60_v2.png" alt="XY chart">
            </button>

            <div id="bar-chart-label">Bar chart</div>
            <div id="xy-chart-label">XY chart</div>

            <div class="group-label">Chart</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './chart-group.scss',
        './dummy-group.scss'
    ]
})
export class ChartGroupComponent implements OnInit
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
