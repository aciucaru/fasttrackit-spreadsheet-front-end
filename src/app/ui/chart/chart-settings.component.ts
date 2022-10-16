import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';
import { ColumnInfo, ColumnType } from 'src/app/model/column';

@Component({
    selector: 'app-chart-settings',
    template: `
    <div class="chart-settings-flex-container">
        <div class="chart-settings-grid-container">
            <div class="label-for-label-column">Label</div>
            <select #labelColumnSelect class="label-column-selector"
                (change)="changeChartLabelColumn(labelColumnSelect.value)">
                <option [value]="'none'">none</option>
                <option *ngFor="let currentColumn of availableStringColums"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>
            <input type="color" class="label-col-fg-color-input" name="head" value="#e66465">

            <div class="label-for-data-column">Data</div>
            <select #dataColumnSelect class="data-column-selector"
                (change)="changeChartDataColumn(dataColumnSelect.value)">
                <option [value]="'none'">none</option>
                <option *ngFor="let currentColumn of availableNumericColums"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>
            <input type="color" class="data-col-fg-color-input" name="head" value="#e66465">
            <input type="color" class="data-col-bg-color-input" name="head" value="#e66465">
            
            <button class="remove-data-column-button" class="toolbar-button" title="Remove data column"
                (click)="displayChartSettings()">
                <img src="assets/icons/minus11-4.png" alt="Remove data column">
            </button>
        </div>
        
        <button class="add-data-column-button" class="toolbar-button" title="Add data column"
            (click)="displayChartSettings()">
            <img src="assets/icons/plus11-5.png" alt="Add data column">
        </button>
    </div>
    `,
    styles: [],
    styleUrls: ['./chart-general.scss', 'chart-settings.scss']
})
export class ChartSettingsComponent implements OnInit
{
    @Input() public chartInfo?: ChartInfo;

    protected spreadsheet?: EditableSpreadsheet;

    protected showChartSettings: boolean = true;


    protected availableStringColums: Array<ColumnInfo> = new Array<ColumnInfo>();
    protected availableNumericColums: Array<ColumnInfo> = new Array<ColumnInfo>();
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                    this.setAvailableStringColumns();
                    this.setAvailableNumericColumns();
                });
    }

    protected displayChartSettings(): void
    { this.showChartSettings = true; }

    protected hideChartSettings(): void
    { this.showChartSettings = false; }

    protected setAvailableStringColumns(): void
    {
        this.availableStringColums = new Array<ColumnInfo>();

        for(let currentColumnInfo of this.spreadsheet!.columnInfos)
        {
            if(currentColumnInfo.colType === ColumnType.STRING)
                this.availableStringColums.push(currentColumnInfo);
        }
    }

    protected setAvailableNumericColumns(): void
    {
        this.availableNumericColums = new Array<ColumnInfo>();

        for(let currentColumnInfo of this.spreadsheet!.columnInfos)
        {
            if(currentColumnInfo.colType === ColumnType.NUMBER)
                this.availableNumericColums.push(currentColumnInfo);
        }
    }

    changeChartLabelColumn(selection: string): void
    {
        // this.chartInfo.
        console.log(`ChartSettingsCompone: changeChartLabelColumn(${selection})`);
    }

    changeChartDataColumn(selection: string): void
    {
        console.log(`ChartSettingsCompone: changeChartDataColumn(${selection})`);
    }
}
