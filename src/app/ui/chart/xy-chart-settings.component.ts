import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartColumnDataInfo, ChartInfo } from 'src/app/model/chart';
import { ColumnInfo, ColumnType } from 'src/app/model/column';

@Component({
    selector: 'app-xy-chart-settings',
    template: `
    <div class="xy-chart-settings-flex-container">
        <div class="xy-chart-settings-grid-container">
            <div class="xy-chart-label-column">Label col</div>
            <select #labelColumnSelect class="xy-chart-label-column-selector"
                (change)="spreadsheetService.setChartLabelColumn(this.chartIndex, labelColumnSelect.value)">
                <option [value]="''">none</option>
                <option *ngFor="let currentColumn of spreadsheet?.columnInfos"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>
            <input #labelFGColor type="color"
            class="xy-chart-label-col-fg-color-input" name="head" value="#63aeff"
            (change)="spreadsheetService.setChartLabelColumnColor(this.chartIndex, labelFGColor.value)">


            <div class="xy-chart-label-x-column">X col</div>
            <select #columnXSelect class="x-data-column-selector"
                (change)="spreadsheetService.setXYChartXColumn(this.chartIndex, columnXSelect.value)">
                <option [value]="''">none</option>
                <option *ngFor="let currentColumn of availableNumericColums; let dataColIndex = index"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>

            <div class="xy-chart-label-y-column">Y col</div>
            <select #columnYSelect class="y-data-column-selector"
            (change)="spreadsheetService.setXYChartYColumn(this.chartIndex, columnYSelect.value)">
                <option [value]="''">none</option>
                <option *ngFor="let currentColumn of availableNumericColums; let dataColIndex = index"
                    [value]="currentColumn.varName">
                    {{currentColumn.varName}}
                </option>
            </select>

            <input #dataBGColor type="color"
                class="xy-chart-data-col-bg-color-input" name="head" value="#63aeff">
        </div>
    </div>
    `,
    styles: [],
    styleUrls: ['./chart-general.scss', './xy-chart-settings.component.scss']
})
export class XyChartSettingsComponent implements OnInit
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
