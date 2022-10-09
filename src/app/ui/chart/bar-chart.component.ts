import { Component, OnInit, Input } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ChartInfo } from 'src/app/model/chart';

@Component({
    selector: 'app-bar-chart',
    template: `
    <div>
    <div class="chart-area"></div>
    <div></div>
    <div>{{chartInfo?.chartType}}</div>
    <div>{{chartInfo?.labelColumn?.labelColumnVarName}}</div>
    `,
    styles: []
})
export class BarChartComponent implements OnInit
{
    @Input() public chartInfo?: ChartInfo;

    protected spreadsheet?: EditableSpreadsheet;
    
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
