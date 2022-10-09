import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-formula-group',
    template: `
    <div class="group-container">
        <div class="formula-group">
            <button id="apply-formula" class="toolbar-button" title="Apply formula"
                (click)="evaluateFormula()">
                <img src="assets/icons/toggleformula.png" alt="Apply formula">
            </button>

            <button class="dummy02" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="Delete row">
            </button>
            <button class="dummy03" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="Delete row">
            </button>
            <button class="dummy04" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>
            <button class="dummy05" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>
            <button class="dummy06" class="toolbar-button" title="dummy">
                <img src="assets/icons/hidenote.png" alt="dummy">
            </button>

            <div class="group-label">Formula</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './formula-group.scss',
        './dummy-group.scss'
    ]
})
export class FormulaGroupComponent implements OnInit
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

    evaluateFormula(): void
    {
        this.spreadsheetService.calculateAllCellsValues();
    }
}
