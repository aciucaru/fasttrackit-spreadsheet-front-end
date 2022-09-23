import { Component, Input, OnInit } from '@angular/core';

import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-col-var-name',
  template: `
    <div class="cell-container"
    [style.width.px]="spreadsheetService.getColWidth(currentColIndex)"
    [style.height.px]="spreadsheetService.getColVarNameHeight()"
    (click)="spreadsheetService.setSelectedColVarName(currentColIndex)">

        <a *ngIf="!spreadsheetService.isThisColVarNameSelected(currentColIndex)"
            style="color:purple;" >
            {{currentColInfo?.varName}}
        </a>

        <textarea class="cell-textarea"
            *ngIf="spreadsheetService.isThisColVarNameSelected(currentColIndex)"
            type="text" style="color:purple;" autofocus
            [style.width.px]="spreadsheetService.getColWidth(currentColIndex)"
            [style.height.px]="spreadsheetService.getColVarNameHeight()"
            [(ngModel)]="currentColInfo!.varName" #value="ngModel" name="value">
        </textarea>

    <div>`,
  styles: [],
  styleUrls: ['./spreadsheet.component.scss']
})
export class ColVarNameComponent implements OnInit
{
    /* Component ce afiseaza titlul unei coloane.
       Informatiile complete despre coloana si indexul coloanei sunt primite
       ca input de la parinte. */

    // informatiile coloanei curente, primita ca input de la parine
    // trebuie  sa fie 'public' ca sa poate fi accesat din template-ul HTML
    @Input() public currentColInfo?: ColumnInfo;

    // indexul coloanei curente primite de la 'buclele for' ale parintelui
    // trebuie  sa fie 'public' ca sa poate fi accesat din template-ul HTML
    @Input() public currentColIndex: number = -1;

    // referinta catre spreadsheet-ul curent
    private spreadsheet?: EditableSpreadsheet;

    constructor(protected spreadsheetService: SpreadsheetService)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();
    }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }
}
