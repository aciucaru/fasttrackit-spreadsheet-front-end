import { Component, OnInit } from '@angular/core';
import { EditableSpreadsheet, SpreadsheetShortInfo } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-document-browser',
    template: `
    <div class="browser-main-ui">
        <div class="spreadsheet-list" *ngFor="let currentSpreadsheetInfo of spreadsheetList">
            <div class="spreadsheet-group-container">
                <div class="spreadsheet-item-title">
                    {{currentSpreadsheetInfo.name}} <br>
                    {{currentSpreadsheetInfo.id}}
                </div>

                <button class="spreadsheet-item-open" class="toolbar-button" title="Open spreadsheet"
                    (click)="spreadsheetService.addEmptyBarChart()">
                    <img src="assets/icons/dbtableopen.png" alt="Open spreadsheet">
                </button>
                <div class="spreadsheet-item-open-label">Open</div>

                <button class="spreadsheet-item-delete" class="toolbar-button" title="Delete spreadsheet"
                    (click)="spreadsheetService.addEmptyBarChart()">
                    <img src="assets/icons/dbtabledelete.png" alt="Delete spreadsheet">
                </button>
                <div class="spreadsheet-item-delete-label">Delete</div>
            </div>
        </div>
    </div>
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
