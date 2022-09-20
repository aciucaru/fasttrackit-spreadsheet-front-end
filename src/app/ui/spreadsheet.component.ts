import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { ViewChild } from '@angular/core';
// import { MatFormField } from '@angular/material/form-field';

import { Spreadsheet } from '../model/spreadsheet';
import { Cell } from '../model/cell';
import { Row } from '../model/row';
import { CellStyle } from '../model/cell-style'; 
import { SpreadsheetService } from '../service/spreadsheet.service';
import { ColumnType } from '../model/column-type';
import { EditableSpreadsheet } from '../model/editable-spreadsheet';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-spreadsheet',
  template: `
    <table>
        <tr>
            <th *ngFor="let currentCol of spreadsheet!.spreadsheet.columnInfos">
                {{currentCol.name}}
            </th>
        </tr>
        <tr *ngFor="let currentRow of spreadsheet!.spreadsheet.rows; let rowIndex = index">
            <td *ngFor="let currentCell of currentRow.cells; let colIndex = index"
            (click)="spreadsheetService.setInputCell(rowIndex, colIndex)">
                <a *ngIf="!spreadsheetService.isCellAnInput(rowIndex, colIndex)">{{currentCell.value}}</a>
                <input matInput *ngIf="spreadsheetService.isCellAnInput(rowIndex, colIndex)"
                [(ngModel)]="currentCell.value" #value="ngModel" name="value">
            </td>
        </tr>
    </table>
  `,
    styles: []
})
export class SpreadsheetComponent implements OnInit
{
    defaultCellStyle: CellStyle =
    {
        hasBGColor: false,
        rgbBGColor: '#ffffff',

        hasFGColor: false,
        rgbFGColor: '#dd0000',

        hasFont: false,
        font: "Arial, sans-serif",

        isBold: false,
        isItalic: false,

        hasBorderColor: false,
        borderColor: '#000000',

        hasBorderThickness: false,
        borderThickness: 1
    };

    spreadsheet?: EditableSpreadsheet;
    displayedColumns: string[] = [];

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
                {
                    this.spreadsheet = spreadsheet;
                    this.displayedColumns = this.spreadsheet.spreadsheet!.columnInfos
                                            .map( columnInfo =>{ return columnInfo.name; });
                });
    }

    // isCellAnInput(rowIndex: number, colIndex: number): boolean
    // {
    //     return this.spreadsheet?.editableCellCol === colIndex
    //             && this.spreadsheet.editableCellRow === rowIndex;
    // }
}
