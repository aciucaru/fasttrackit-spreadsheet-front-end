import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';


@Component({
    selector: 'app-column-group',
    template: `
    <div class="group-container">
        <div class="column-group">
            <div id="col-type-select-label">Data type</div>
            <app-col-type-select id="col-type-select"></app-col-type-select>

            <div id="col-gen-method-select-label">Generation</div>
            <app-gen-method-select id="col-gen-method-select"></app-gen-method-select>

            <button id="calculate-values" class="toolbar-button" title="Apply formula"
                (click)="spreadsheetService.calculateAllCellsValues()">
                <img src="assets/icons/toggleformula.png" alt="Apply formula">
            </button>
            <!-- <div id="calculate-values-label">Generation</div> -->
            
            <div class="group-label">Column</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './column-group.scss',
        './dummy-group.scss'
    ]
})
export class ColumnGroupComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    
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
