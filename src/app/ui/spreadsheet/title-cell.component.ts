import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-title-cell',
  template: `
    <div class="cell-container" class="col-title-text" style="user-select: none;"
    (click)="spreadsheetService.setSelectedTitleCell(currentColIndex)">

        <div *ngIf="!spreadsheetService.isThisTitleCellSelected(currentColIndex)"
        [style.width.px]="spreadsheetService.getColWidth(currentColIndex)"
        [style.height.px]="spreadsheetService.getTitleRowHeight()"
        style="user-select: none;">
            {{currentColInfo?.title}}
        </div>

        <textarea type="text" autofocus class="cell-textarea" style="user-select: none;"
            *ngIf="spreadsheetService.isThisTitleCellSelected(currentColIndex)"
            [style.width.px]="spreadsheetService.getColWidth(currentColIndex) - 5"
            [style.height.px]="spreadsheetService.getTitleRowHeight() - 5"
            [(ngModel)]="currentColInfo!.title" #value="ngModel" name="value">
        </textarea>

    <div>`,
  styles: [],
  styleUrls: ['./spreadsheet.scss']
})
export class TitleCellComponent implements OnInit
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