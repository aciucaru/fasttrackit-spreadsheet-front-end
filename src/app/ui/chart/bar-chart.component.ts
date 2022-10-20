import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-bar-chart',
    template: `
    <div class="chart-container">
        <div class="chart-area">chart area</div>

        <app-chart-settings class="chart-settings" *ngIf="showChartSettings"
        [chartIndex]="this.chartIndex" [chartInfo]="this.chartInfo">
        </app-chart-settings>

        <button class="display-chart-settings-button" *ngIf="!showChartSettings"
            class="toolbar-button" title="Display chart settings"
            (click)="displayChartSettings()">
            <img src="assets/icons/optionstreedialog.png" alt="Display chart settings">
        </button>

        <button class="hide-chart-settings-button" *ngIf="showChartSettings"
            class="toolbar-button" title="Hide chart settings"
            (click)="hideChartSettings()">
            <img src="assets/icons/arrowshapes.right-arrow.png" alt="Hide chart settings">
        </button>
    </div>
    `,
    styles: [],
    styleUrls: ['./chart-general.scss']
})
export class BarChartComponent implements OnInit
{
    @Input() public chartIndex: number = -1;
    @Input() public chartInfo?: ChartInfo;

    protected spreadsheet?: EditableSpreadsheet;

    protected showChartSettings: boolean = true;
    protected availableDataTypes: string[] = ['string', 'number', 'bool'];
    protected currentColDataTypeString: string = 'string';
    
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

    protected displayChartSettings(): void
    { this.showChartSettings = true; }

    protected hideChartSettings(): void
    { this.showChartSettings = false; }
}
