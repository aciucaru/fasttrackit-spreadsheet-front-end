import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { ViewChild } from '@angular/core';

import { CellStyle } from 'src/app/model/cell'; 
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { ColumnType } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-spreadsheet',
  template: `
    <table class="spreadsheet">
        <tr> <!-- rand cu denumirile de variabila a coloanelor -->
            <td class="general-cell"> <!-- celula header goala pt. celulele de redimensionare a inaltimii liniilor -->
                <div></div>
            </td>
            <td class="general-cell" *ngFor="let currentCol of spreadsheet?.columnInfos; let colIndex = index">
                <app-var-name-cell [currentColInfo]="currentCol" [currentColIndex]="colIndex"></app-var-name-cell>
            </td>
        </tr>
        <tr> <!-- rand cu titlul coloanelor -->
            <td class="general-cell"> <!-- celula suplimentara pt. coloana cu indexul randurilor -->
                <div></div>
            </td>
            <td class="general-cell" *ngFor="let currentCol of spreadsheet?.columnInfos; let colIndex = index">
                <app-title-cell [currentColInfo]="currentCol" [currentColIndex]="colIndex"></app-title-cell>
            </td>
        </tr>
        <!-- randurile cu celulele de date ale spreadshet-ului -->
        <tr *ngFor="let currentRow of spreadsheet?.rows; let rowIndex = index">
            <td class="general-cell"> <app-row-index [rowIndex]="rowIndex"></app-row-index> </td>
            <td class="general-cell" *ngFor="let currentCell of currentRow.cells; let colIndex = index">
                <app-data-cell [mainCell]="currentCell" [mainCellRowIndex] = "rowIndex" [mainCellColIndex] = "colIndex">
                </app-data-cell>
            </td>
        </tr>
    </table>
  `,
    styles: [],
    styleUrls: ['./spreadsheet.scss']
})
export class SpreadsheetComponent implements OnInit
{
    defaultCellStyle: CellStyle =
    {
        rgbBGColor: '#ffffff',
        rgbFGColor: '#dd0000',
        borderColor: '#000000',

        font: "Arial, sans-serif",
        isBold: false,
        isItalic: false,
    };

    spreadsheet?: EditableSpreadsheet;
    displayedColumns: string[] = [];

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
                    this.displayedColumns = this.spreadsheet.columnInfos
                                            .map( columnInfo =>{ return columnInfo.title; });
                });
    }
}
