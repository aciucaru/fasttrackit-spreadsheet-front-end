import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-bar-chart',
    template: `
    <div class="chart-container">
        <div class="chart-area">
            chart area
        </div>

        <div class="chart-settings" *ngIf="showChartSettings">
            <div class="label-column-select-container">
                <div class="chart-column-select-label"></div>
                <select #labelColumnSelect class="label-column-select" [value]="currentColDataTypeString">
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="bool">bool</option>
                </select>
            </div>

            <div class="data-column-select-container">
                <div class="chart-column-select-label"></div>
                <select class="data-column-select" [value]="currentColDataTypeString">
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="bool">bool</option>
                </select>
                <button class="display-chart-settings-button" class="toolbar-button" title="Remove data column"
                    (click)="displayChartSettings()">
                    <img src="assets/icons/presenterscreen-ButtonMinusNormal.png" alt="Remove data column">
                </button>
            </div>

            <button class="add-data-column-button" class="toolbar-button" title="Add data column"
                (click)="displayChartSettings()">
                <img src="assets/icons/presenterscreen-ButtonPlusNormal.png" alt="Add data column">
            </button>
        </div>
    </div>
    `,
    styles: [],
    styleUrls: ['./chart-general.scss']
})
export class BarChartComponent implements OnInit
{
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
