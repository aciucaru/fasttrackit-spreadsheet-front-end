import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartColumnDataInfo, ChartInfo } from 'src/app/model/chart';
import { ColumnInfo, ColumnType } from 'src/app/model/column';

@Component({
    selector: 'app-chart-settings',
    template: `
    <div class="bar-chart-settings-flex-container">
        <div class="bar-chart-settings-grid-container">
            <div class="bar-chart-label-for-label-column">Label col</div>
            <select #labelColumnSelect class="bar-chart-label-column-selector"
                (change)="spreadsheetService.setChartLabelColumn(this.chartIndex, labelColumnSelect.value)">
                <option [value]="''">none</option>
                <option *ngFor="let currentColumn of spreadsheet?.columnInfos"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>
            <input #labelFGColor type="color"
            class="bar-chart-label-col-fg-color-input" name="head" value="#000000"
            (change)="spreadsheetService.setChartLabelColumnColor(this.chartIndex, labelFGColor.value)">

            <ng-container *ngFor="let currentDataColumn of chartDataColumns; let dataColIndex=index">
                <div class="bar-chart-label-for-data-column">Data col</div>
                <select #dataColumnSelect class="bar-chart-data-column-selector"
                    (change)="spreadsheetService.setChartDataColumn(this.chartIndex, dataColIndex, dataColumnSelect.value)">
                    <option [value]="''">none</option>
                    <option *ngFor="let currentColumn of availableNumericColums; let dataColIndex = index"
                        [value]="currentColumn.varName">
                        {{currentColumn.varName}}
                    </option>
                </select>
                <input #dataBGColor type="color"
                class="bar-chart-data-col-bg-color-input" name="head" value="#63aeff"
                (change)="spreadsheetService.setChartDataColumnColor(this.chartIndex, dataColIndex, dataBGColor.value)">
                
                <button class="bar-chart-remove-data-column-button" class="toolbar-button" title="Remove data column"
                    (click)="spreadsheetService.removeChartDataColumn(this.chartIndex, dataColIndex)">
                    <img src="assets/icons/minus11-4.png" alt="Remove data column">
                </button>
            </ng-container>
        </div>
        
        <button class="bar-chart-add-data-column-button" class="toolbar-button" title="Add data column"
            (click)="spreadsheetService.addEmptyChartDataColumn(this.chartIndex)">
            <img src="assets/icons/plus11-5.png" alt="Add data column">
        </button>
    </div>
    `,
    styles: [],
    styleUrls: ['./chart-general.scss', './bar-chart-settings.scss']
})
export class ChartSettingsComponent implements OnInit
{
    @Input() public chartIndex: number = -1;
    @Input() public chartInfo?: ChartInfo;

    protected spreadsheet?: EditableSpreadsheet;

    protected showChartSettings: boolean = true;
    protected availableNumericColums: Array<ColumnInfo> = new Array<ColumnInfo>();
    protected chartDataColumns: ChartColumnDataInfo[] = [];
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                    this.chartDataColumns = spreadsheet.charts[this.chartIndex].dataColumns;
                    this.setAvailableNumericColumns();
                });
    }

    protected displayChartSettings(): void
    { this.showChartSettings = true; }

    protected hideChartSettings(): void
    { this.showChartSettings = false; }

    protected setAvailableNumericColumns(): void
    {
        this.availableNumericColums = new Array<ColumnInfo>();

        for(let currentColumnInfo of this.spreadsheet!.columnInfos)
        {
            if(currentColumnInfo.colType === ColumnType.NUMBER)
                this.availableNumericColums.push(currentColumnInfo);
        }
    }

    protected changeColor(): void
    {
        console.log(`color change`);
    }
}
