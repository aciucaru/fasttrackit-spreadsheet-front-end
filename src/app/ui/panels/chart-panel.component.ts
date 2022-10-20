import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-chart-panel',
    template: `
    <div *ngFor="let currentChart of spreadsheet?.charts; let barChartIndex = index">
        <app-bar-chart [chartIndex]="barChartIndex" [chartInfo]="currentChart"></app-bar-chart>
    </div>
    `,
    styles: []
})
export class ChartPanelComponent implements OnInit
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
