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
        <tr>
            <th></th>
            <th *ngFor="let currentCol of spreadsheet?.columnInfos" class="spreadsheet_cell">
                <div class="resizable-col">{{currentCol.name}}</div>
            </th>
        </tr>
        <tr *ngFor="let currentRow of spreadsheet?.rows; let rowIndex = index">
            <td> <div class="resizable-row"></div> </td>
            <td *ngFor="let currentCell of currentRow.cells; let colIndex = index" class="spreadsheet_cell">
                <app-cell [cell]="currentCell" [currentRowIndex] = "rowIndex" [currentColIndex] = "colIndex"></app-cell>
            </td>
        </tr>
    </table>
  `,
    styles: [ 'table { border-collapse: collapse; } td { border-collapse: collapse; } th { border-collapse: collapse; }',
        '.spreadsheet_cell { border-style: solid; border-width: 1px; border-color: rgb(150, 150, 150); }',
        '.resizable-col { display:block;  resize: horizontal; overflow: auto; width: auto; height: auto; min-height: 20px; min-width: 20px; }',
        '.resizable-row { display:block;  resize: vertical; overflow: auto; width: auto; height: auto; min-height: 20px; min-width: 20px; }' ],
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
                                            .map( columnInfo =>{ return columnInfo.name; });
                });
    }
}