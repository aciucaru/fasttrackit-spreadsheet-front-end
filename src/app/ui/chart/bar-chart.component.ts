import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartColumnDataInfo, ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-bar-chart',
    template: `
    <div class="chart-container">
        <div class="chart-area">
            chart area<br>
            <canvas #chartCanvas width="400" height="200"></canvas>
        </div>

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
export class BarChartComponent implements OnInit, AfterViewInit
{
    @ViewChild('chartCanvas', {static: true}) chartCanvas: ElementRef<HTMLCanvasElement>;
    private renderContext: CanvasRenderingContext2D;
    private canvasInitialized: boolean = false;
    
    // indexul acestui chart (in cadrul sirului de chart-uri din spreadsheet)
    @Input() public chartIndex: number = -1;
    // toate informatiile despre acest chart
    @Input() public chartInfo: ChartInfo;

    protected spreadsheet?: EditableSpreadsheet;

    protected showChartSettings: boolean = true;
    protected availableDataTypes: string[] = ['string', 'number', 'bool'];
    protected currentColDataTypeString: string = 'string';
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnChanges()
    {
        if(this.canvasInitialized)
        {
            this.drawBarCharts(this.renderContext);
            console.log(`ngOnChanges()`);
        }
    }

    ngOnInit(): void
    { 
        this.subscribeAsSpreadsheetObserver();
    }

    ngAfterViewInit()
    {
        this.canvasInitialized = true;

        this.renderContext = this.chartCanvas.nativeElement.getContext('2d')!;
        this.drawBarCharts(this.renderContext);
        console.log(`ngAfterViewInit()`);
    }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;

                    if(this.canvasInitialized)
                    {
                        this.drawBarCharts(this.renderContext);
                        console.log(`subscribeAsSpreadsheetObserver()`);
                    }
                });
    }

    protected displayChartSettings(): void
    { this.showChartSettings = true; }

    protected hideChartSettings(): void
    { this.showChartSettings = false; }

    private drawBarCharts(renderContext: CanvasRenderingContext2D): void
    {
        let chartDataColumnsMinValue = this.spreadsheetService.getChartMinValue(this.chartInfo);
        let chartDataColumnsMaxValue = this.spreadsheetService.getChartMaxValue(this.chartInfo);
        let chartBarWidth = 20.0;
        let chartBarMaxHeight = 200.0;
        let chartBarHeightRatio = (1.0*chartBarMaxHeight) / (1.0*chartDataColumnsMaxValue);
        let spaceBetweenBars = 5.0;
        let spaceBetweenSequences = 10.0;

        let dataColumns: ChartColumnDataInfo[] = this.chartInfo.dataColumns;

        renderContext.clearRect(0, 0, 
            this.chartCanvas.nativeElement.width,
            this.chartCanvas.nativeElement.height
            );
        
        
        renderContext.fillStyle = 'blue';
        // renderContext.fillRect(0, 0, 100, 100);


        let columnRefs: string[] = this.spreadsheetService.getChartDataColumnRefs(this.chartInfo);
        let numericData: Array<Array<number>> = this.spreadsheetService.getNumericValuesForChartDataColumns(columnRefs);

        let currentRow: Array<number>;
        let currentColumnValue: number = 0.0;
        let currentBarHeight: number = 0.0;
        let currentBarStartX: number = spaceBetweenBars;
        let barStartY: number = chartBarMaxHeight + spaceBetweenBars;
        for(let i=0; i<numericData.length; i++)
        {
            currentRow = numericData[i];
            for(let j=0; j<currentRow.length; j++)
            {
                currentColumnValue = 1.0*currentRow[j];
                currentBarHeight = 1.0 - (currentColumnValue * chartBarHeightRatio);

                renderContext.fillRect(currentBarStartX, barStartY, chartBarWidth, currentBarHeight);

                currentBarStartX += chartBarWidth + spaceBetweenBars;
            }
            currentBarStartX += spaceBetweenSequences;
        }


    }
}
