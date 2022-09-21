import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-cell',
  template:`
    <!-- <div [ngStyle]="{backgroundColor: cell?.style?.rgbBGColor}"> -->
    <div class="main-cell-container"
            (click)="spreadsheetService.setSelectedCell(currentRowIndex, currentColIndex)"
            [style.background-color]="cell?.style?.rgbBGColor"
            [style.color]="cell?.style?.rgbFGColor"
            [style.font-family]="cell?.style?.font">
                <a *ngIf="!spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">{{cell?.value}}</a>
                <input matInput *ngIf="spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)"
                [(ngModel)]="cell!.value" #value="ngModel" name="value">
    <div>
  `,
  styles: ['.main-cell-container { }']
})
export class CellComponent implements OnInit
{
    // datele celulei curente, primita ca input de la parine
    // trebuie  sa fie 'public' ca sa poate fi accesata din template-ul HTML
    @Input() public cell?: Cell;

    // indexii randului si coloanei curente primite de la 'buclele for' ale parintelui
    // trebuie  sa fie 'public' ca sa poate fi accesate din template-ul HTML
    @Input() public currentRowIndex: number = -1;
    @Input() public currentColIndex: number = -1;
    
    private spreadsheet?: EditableSpreadsheet;
    // displayedColumns: string[] = [];

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
