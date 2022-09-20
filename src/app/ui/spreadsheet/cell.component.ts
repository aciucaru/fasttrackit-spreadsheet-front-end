import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/editable-spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-cell',
  template:`
    <!-- <div [ngStyle]="{backgroundColor: cell?.style?.rgbBGColor}"> -->
    <div (click)="spreadsheetService.setSelectedCell(rowIndex, colIndex)"
        [style.background-color]="cell?.style?.rgbBGColor"
        [style.color]="cell?.style?.rgbFGColor"
        [style.font-family]="cell?.style?.font">
            <a *ngIf="!spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">{{currentCell.value}}</a>
            <input matInput *ngIf="spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)"
            [(ngModel)]="currentCell.value" #value="ngModel" name="value">
    </div>
  `,
  styles: []
})
export class CellComponent implements OnInit
{
    @Input() protected cell?: Cell;
    @Input() protected currentRowIndex: number = -1;
    @Input() protected currentColIndex: number = -1;
    private spreadsheet?: EditableSpreadsheet;
    // displayedColumns: string[] = [];

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute)
    { }

    ngOnInit(): void
    {
        this.getSpreadsheet();
    }

    getSpreadsheet(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe((spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }
}
