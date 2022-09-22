import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from 'src/app/model/cell';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-cell',
  template:`<!-- <div [ngStyle]="{backgroundColor: cell?.style?.rgbBGColor}"> -->
    <div class="main-cell-container"
        (click)="spreadsheetService.setSelectedCell(currentRowIndex, currentColIndex)"
        [style.background-color]="cell?.style?.rgbBGColor"
        [style.color]="cell?.style?.rgbFGColor"
        [style.font-family]="cell?.style?.font">

        <ng-container *ngIf="!spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">
            <ng-container [ngSwitch]="spreadsheetService.getCellTypeAsString(currentColIndex)">
                <a *ngSwitchCase="'STRING'" style="color:purple;"> {{cell?.stringValue}} </a>
                <a *ngSwitchCase="'NUMBER'" style="color:blue;"> {{cell?.numberValue}} </a>
                <a *ngSwitchCase="'BOOL'" style="color:green;"> {{cell?.boolValue}} </a>
                <!-- <a *ngSwitchDefault style="color:black;"> {{cell?.stringValue}} </a> -->
            </ng-container>
        </ng-container>

        <ng-container *ngIf="spreadsheetService.isThisCellSelected(currentRowIndex, currentColIndex)">
            <ng-container [ngSwitch]="spreadsheetService.getCellTypeAsString(currentColIndex)">
                <input type="text" *ngSwitchCase="'STRING'" style="color:purple;"
                [(ngModel)]="cell!.stringValue" #value="ngModel" name="value">

                <input type="number" *ngSwitchCase="'NUMBER'" style="color:blue;"
                [(ngModel)]="cell!.numberValue" #value="ngModel" name="value">

                <input *ngSwitchCase="'BOOL'" style="color:green;"
                [(ngModel)]="cell!.boolValue" #value="ngModel" name="value">

                <!-- <input *ngSwitchDefault style="color:black;"
                matInput [(ngModel)]="cell!.stringValue" #value="ngModel" name="value"> -->
            </ng-container> 
        </ng-container>
    <div>`,
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
