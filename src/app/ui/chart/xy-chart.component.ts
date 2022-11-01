import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartColumnDataInfo, ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-xy-chart',
    template: `
    <div class="xy-chart-container">
        <div class="xy-chart-area">
            <p>XY chart</p>
            <canvas #chartCanvas width="300px" height="250px"></canvas>
        </div>

        <app-xy-chart-settings class="xy-chart-settings" *ngIf="showChartSettings"
        [chartIndex]="this.chartIndex" [chartInfo]="this.chartInfo">
        </app-xy-chart-settings>

        <button class="xy-display-chart-settings-button" *ngIf="!showChartSettings"
            class="toolbar-button" title="Display chart settings"
            (click)="displayChartSettings()">
            <img src="assets/icons/optionstreedialog.png" alt="Display chart settings">
        </button>

        <button class="xy-hide-chart-settings-button" *ngIf="showChartSettings"
            class="toolbar-button" title="Hide chart settings"
            (click)="hideChartSettings()">
            <img src="assets/icons/arrowshapes.left-arrow.png" alt="Hide chart settings">
        </button>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './chart-general.scss',
        './xy-chart.component.scss',
    ]
})
export class XYChartComponent implements OnInit
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

    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnChanges()
    {
        if(this.canvasInitialized)
        {
            this.drawXYChart(this.renderContext);
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
        this.drawXYChart(this.renderContext);
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
                        this.drawXYChart(this.renderContext);
                        console.log(`subscribeAsSpreadsheetObserver()`);
                    }
                });
    }

    protected displayChartSettings(): void
    { this.showChartSettings = true; }

    protected hideChartSettings(): void
    { this.showChartSettings = false; }

    private drawXYChart(renderContext: CanvasRenderingContext2D): void
    {
        let chartMaxYValue = this.spreadsheetService.getXYChartMaxYValue(this.chartInfo);
        let chartMaxHeight = 200.0;
        let chartHeightRatio = (1.0*chartMaxHeight) / (1.0*chartMaxYValue);
        let chartLengthRatio = (1.0*chartMaxHeight) / (1.0*chartMaxYValue);
        
        let columnRefs: string[] = this.spreadsheetService.getChartDataColumnRefs(this.chartInfo);
        let labelColumnRef: string = this.chartInfo.labelColumn.labelColumnVarNameRef;
        let labelData: string[] = this.spreadsheetService.getStringValuesForChartLabelColumn(labelColumnRef);
        let numericData: Array<Array<number>> = this.spreadsheetService.getNumericValuesForChartDataColumns(columnRefs);

        // prima data se determina lungimea canvas-ului, in functie de cate bare are de desenat
        let canvasWidth: number = 1000;
        // sequenceWidth = spaceBetweenBars;
        // for(let j=0; j<numericData[0].length; j++)
        // {
        //     sequenceWidth += chartBarWidth + spaceBetweenBars;
        // }

        // canvasWidth = sequenceWidth * numericData.length;

        // se seteaza lungimea chart-ului
        this.chartCanvas.nativeElement.width = canvasWidth;

        // apoi se deseneaza:

        renderContext.clearRect(0, 0, 
            this.chartCanvas.nativeElement.width,
            this.chartCanvas.nativeElement.height
            );

        renderContext.fillStyle = this.chartInfo.dataColumns[0].rgbBGColor;
        renderContext.lineWidth = 2;

        let prevX: number = numericData[0][0];
        let prevY: number = 100 - numericData[0][1];
        let currentX: number = 0;
        let currentY: number = 0;

        renderContext.fillRect(prevX-4, prevY-4, 8, 8);
        renderContext.beginPath();
        renderContext.moveTo(prevX, prevY);
        for(let i=0; i<numericData.length-1; i++)
        {   
            prevX = numericData[i][0];
            prevY = 100 - numericData[i][1];
            currentX = numericData[i+1][0];
            currentY = 100 - numericData[i+1][1];

            renderContext.lineTo(currentX, currentY);

            renderContext.fillStyle = this.chartInfo.dataColumns[0].rgbBGColor;
            renderContext.fillRect(currentX-4, currentY-4, 8, 8);
        }
        renderContext.stroke();
        // renderContext.stroke();
    }

}
