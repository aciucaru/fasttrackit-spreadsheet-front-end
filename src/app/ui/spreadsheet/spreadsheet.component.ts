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
                <app-resizable-row-block> </app-resizable-row-block>
            </td>
            <td class="general-cell" *ngFor="let currentCol of spreadsheet?.columnInfos; let colIndex = index">
                <app-col-var-name [currentColInfo]="currentCol" [currentColIndex]="colIndex"></app-col-var-name>
            </td>
        </tr>
        <tr> <!-- rand cu titlul coloanelor -->
            <td class="general-cell"> <!-- celula suplimentara pt. coloana cu indexul randurilor -->
                <app-resizable-row-block></app-resizable-row-block>
            </td>
            <td class="general-cell" *ngFor="let currentCol of spreadsheet?.columnInfos; let colIndex = index">
                <app-col-title [currentColInfo]="currentCol" [currentColIndex]="colIndex"></app-col-title>
            </td>
        </tr>
        <!-- randurile cu celulele de date ale spreadshet-ului -->
        <tr *ngFor="let currentRow of spreadsheet?.rows; let rowIndex = index">
            <td class="general-cell"> <app-row-index [rowIndex]="rowIndex"></app-row-index> </td>
            <td class="general-cell" *ngFor="let currentCell of currentRow.cells; let colIndex = index">
                <app-cell [mainCell]="currentCell" [mainCellRowIndex] = "rowIndex" [mainCellColIndex] = "colIndex">
                </app-cell>
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
        hasBGColor: false, rgbBGColor: '#ffffff',
        hasFGColor: false, rgbFGColor: '#dd0000',
        hasFont: false, font: "Arial, sans-serif",
        isBold: false,
        isItalic: false,
        hasBorderColor: false, borderColor: '#000000',
        hasBorderThickness: false, borderThickness: 1
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
