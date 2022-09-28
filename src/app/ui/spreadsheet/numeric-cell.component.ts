import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-numeric-cell',
    template: `
    <div class="cell-container"
    (click)="spreadsheetService.setSelectedDataCell(currentRowIndex, currentColIndex)"
    [style.width.px]="spreadsheetService.getCellWitdh(currentColIndex)">

        <div *ngIf="!spreadsheetService.isThisDataCellSelected(currentRowIndex, currentColIndex)"
            [style.width.px]="spreadsheetService.getCellWitdh(currentColIndex)"
            style="color:blue;">
            {{cell?.numberValue}}
        </div>

        <input type="number" style="color:blue;"
        *ngIf="spreadsheetService.isThisDataCellSelected(currentRowIndex, currentColIndex)"
        [(ngModel)]="cell!.numberValue" #value="ngModel" name="value"
        [style.width.px]="spreadsheetService.getCellWitdh(currentColIndex)">
    <div>`,
    styles: [],
    styleUrls: ['./spreadsheet.scss']
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
                            { this.spreadsheet = spreadsheet; }
                        );
    }
}
