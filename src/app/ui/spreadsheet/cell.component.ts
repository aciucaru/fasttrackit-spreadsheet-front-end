import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-cell',
  template:`<!-- <div [ngStyle]="{backgroundColor: cell?.style?.rgbBGColor}"> -->
    <div class="main-cell-container"
        [style.background-color]="mainCell?.style?.rgbBGColor"
        [style.color]="mainCell?.style?.rgbFGColor"
        [style.font-family]="mainCell?.style?.font">

        <ng-container [ngSwitch]="spreadsheetService.getCellTypeAsString(mainCellColIndex)">
            <app-string-cell *ngSwitchCase="'STRING'" 
            [cell]="mainCell" [currentRowIndex] = "mainCellRowIndex" [currentColIndex] = "mainCellColIndex">
            </app-string-cell>

            <app-numeric-cell *ngSwitchCase="'NUMBER'"
            [cell]="mainCell" [currentRowIndex] = "mainCellRowIndex" [currentColIndex] = "mainCellColIndex">
            </app-numeric-cell>

            <app-bool-cell *ngSwitchCase="'BOOL'"
            [cell]="mainCell" [currentRowIndex] = "mainCellRowIndex" [currentColIndex] = "mainCellColIndex">
            </app-bool-cell>
        </ng-container>
        <!-- <input *ngSwitchDefault style="color:black;"
        matInput [(ngModel)]="cell!.stringValue" #value="ngModel" name="value"> -->
    <div>`,
  styles: ['.main-cell-container { }']
})
export class CellComponent implements OnInit
{
    // datele celulei curente, primita ca input de la parine
    // trebuie  sa fie 'public' ca sa poate fi accesata din template-ul HTML
    @Input() public mainCell?: Cell;

    // indexii randului si coloanei curente primite de la 'buclele for' ale parintelui
    // trebuie  sa fie 'public' ca sa poate fi accesate din template-ul HTML
    @Input() public mainCellRowIndex: number = -1;
    @Input() public mainCellColIndex: number = -1;
    
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
