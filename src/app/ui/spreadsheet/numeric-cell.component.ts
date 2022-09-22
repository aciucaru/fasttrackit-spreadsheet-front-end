import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-numeric-cell',
    template: `
    <div class="numeric-cell-container"
        (click)="spreadsheetService.setSelectedCell(currentRowIndex, currentColIndex)">

        <ng-container *ngIf="!spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">
            <a> {{cell?.stringValue}} </a>
        </ng-container>

        <ng-container *ngIf="spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">
            <input type="number" [(ngModel)]="cell!.numberValue" #value="ngModel" name="value">
            <!-- <input *ngSwitchDefault style="color:black;"
            matInput [(ngModel)]="cell!.stringValue" #value="ngModel" name="value"> -->
        </ng-container>
    <div>`,
    styles: []
})
export class NumericCellComponent implements OnInit
{
    // datele celulei curente, primita ca input de la parine
    // trebuie  sa fie 'public' ca sa poate fi accesata din template-ul HTML
    @Input() public cell?: Cell;

    // indexii randului si coloanei curente primite de la 'buclele for' ale parintelui
    // trebuie  sa fie 'public' ca sa poate fi accesate din template-ul HTML
    @Input() public currentRowIndex: number = -1;
    @Input() public currentColIndex: number = -1;
    
    private spreadsheet?: EditableSpreadsheet;
    // protected ColumnTypeEnumRef = ColumnType;

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();
    }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe((spreadsheet: EditableSpreadsheet) =>
                            {
                                this.spreadsheet = spreadsheet;
                            }
                        );
    }
}
