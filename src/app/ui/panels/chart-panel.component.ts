import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-chart-panel',
    template: `
    <div *ngFor="let currentChart of spreadsheet?.charts; let currentChartIndex = index">
        <ng-container [ngSwitch]="currentChart.chartType.toString()">
            <app-bar-chart *ngSwitchCase="'BAR'"
                [chartIndex]="currentChartIndex" [chartInfo]="currentChart">
            </app-bar-chart>

            <app-xy-chart *ngSwitchCase="'XY'"
                [chartIndex]="currentChartIndex" [chartInfo]="currentChart">
            </app-xy-chart>

            <!-- <app-bar-chart *ngSwitchCase="'PIE'"
                [chartIndex]="currentChartIndex" [chartInfo]="currentChart">
            </app-bar-chart> -->
        </ng-container>
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
