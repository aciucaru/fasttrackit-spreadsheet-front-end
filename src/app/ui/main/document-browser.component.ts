import { Component, OnInit } from '@angular/core';
import { EditableSpreadsheet, SpreadsheetShortInfo } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-document-browser',
    template: `
    <ng-container *ngFor="let currentSpreadsheetInfo of spreadsheetList">
        <div class="spreadsheet-item-container">
            <div class="spreadsheet-item-title">
                {{currentSpreadsheetInfo.name}} <br>
                {{currentSpreadsheetInfo.id}}
            </div>

            <button class="spreadsheet-item-open" class="toolbar-button" title="Bar chart"
                (click)="spreadsheetService.addEmptyBarChart()">
                <img src="assets/icons/bar_52x60_v2.png" alt="Bar chart">
            </button>

            <button class="spreadsheet-item-delete" class="toolbar-button" title="Bar chart"
                (click)="spreadsheetService.addEmptyBarChart()">
                <img src="assets/icons/bar_52x60_v2.png" alt="Bar chart">
            </button>
        </div>
    </ng-container>
    `,
    styles: [],
    styleUrls: ['./document-browser.component.scss']
})
export class DocumentBrowserComponent implements OnInit
{
    spreadsheetList?: Array<SpreadsheetShortInfo>;
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnInit(): void { this.subscribeAsListObserver(); }

    subscribeAsListObserver(): void
    {
        this.spreadsheetService
            .getListSubject()
            .subscribe( (spreadsheetList: Array<SpreadsheetShortInfo>) =>
                {
                    this.spreadsheetList = spreadsheetList;
                });
    }
}
