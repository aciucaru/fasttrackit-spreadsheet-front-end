import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-chart-settings',
    template: `
    <div class="chart-settings-container">
        <div class="label-for-label-column">Label column</div>
        <select #labelColumnSelect class="label-column-selector" [value]="currentColDataTypeString">
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="bool">bool</option>
        </select>
        <input type="color" class="label-col-fg-color-input" name="head" value="#e66465">

        <div class="label-for-data-column">Data column</div>
        <select class="data-column-selector" [value]="currentColDataTypeString">
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="bool">bool</option>
        </select>
        <input type="color" class="data-col-fg-color-input" name="head" value="#e66465">
        <input type="color" class="data-col-bg-color-input" name="head" value="#e66465">
        
        <button class="remove-data-column-button" class="toolbar-button" title="Remove data column"
            (click)="displayChartSettings()">
            <img src="assets/icons/presenterscreen-ButtonMinusNormal.png" alt="Remove data column">
        </button>

        <button class="add-data-column-button" class="toolbar-button" title="Add data column"
            (click)="displayChartSettings()">
            <img src="assets/icons/presenterscreen-ButtonPlusNormal.png" alt="Add data column">
        </button>
    </div>
    `,
    styles: []
})
export class ChartSettingsComponent implements OnInit
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
