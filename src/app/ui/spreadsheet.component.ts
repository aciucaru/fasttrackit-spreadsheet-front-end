import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
// import { MatFormField } from '@angular/material/form-field';

import { Spreadsheet } from '../model/spreadsheet';
import { Cell } from '../model/cell';
import { Row } from '../model/row';
import { CellStyle } from '../model/cell-style'; 
import { SpreadsheetService } from '../service/spreadsheet.service';
import { ColumnType } from '../model/column-type';

@Component({
  selector: 'app-sheet-table',
  template: `
    <button (click)="logSpreadsheetValues()">Spreadsheet values</button>
    <button (click)="deleteRow()">Delete row</button>
    <mat-table #mainSpreadsheet 
    [dataSource]="dataSource" class="mat-elevation-z8">
        <ng-container *ngFor="let currentCol of displayedColumns; let colIndex = index;" [matColumnDef]="currentCol">
            <th mat-header-cell *matHeaderCellDef>{{currentCol}}</th>
            <td mat-cell *matCellDef="let currentRow; let rowIndex = index;"
            (click)="setInputCell(rowIndex, colIndex)"
            [ngClass]="{'activeCell': editableCellCol === colIndex && editableCellRow === rowIndex}">
                <a *ngIf="!isCellAnInput(rowIndex, colIndex)" class="cell-value">
                    {{currentRow.cells[colIndex].value}}
                </a>
                <!-- <mat-form-field> -->
                    <input matInput *ngIf="isCellAnInput(rowIndex, colIndex)"
                    [(ngModel)]="currentRow.cells[colIndex].value" #value="ngModel" name="value">
                <!-- </mat-form-field> -->

            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </mat-table>
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

    spreadsheet: Spreadsheet =
    {
        name: "spreadsheet",
        columnInfos:
        [
            { name: 'Numbers', cellType: ColumnType.NUMBER, varName: 'number_col' },
            { name: 'Strings', cellType: ColumnType.STRING, varName: 'string_col' }
        ],
        rows:
        [
            {
                cells:
                    [
                        {value: "100", style: this.defaultCellStyle},
                        {value: "abc", style: this.defaultCellStyle}
                    ]
            },
            {
                cells:
                    [
                        {value: "200", style: this.defaultCellStyle},
                        {value: "def", style: this.defaultCellStyle}
                    ]
            }
        ]
    };

    @ViewChild(MatTable) mainSpreadsheet?: MatTable<Row>;

    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<Row> = new MatTableDataSource<Row>(this.spreadsheet.rows);

    editableCellCol: number = -1;
    editableCellRow: number = -1;

    constructor(private spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.getTable(); }

    getTable(): void
    {
        this.spreadsheetService.getOneTable()
                        .subscribe(spreadsheet =>
                            {
                                this.spreadsheet = spreadsheet;
                                this.dataSource = new MatTableDataSource(this.spreadsheet.rows);
                                this.displayedColumns = this.spreadsheet.columnInfos
                                                        .map( columnInfo =>{ return columnInfo.name; });
                            });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }

    spreadsheetToStringMatrix(): string[][]
    {
        let cellMatrix: string[][] = [[]];

        for(let row of this.spreadsheet.rows)
        {
            let currentRow: string[] = [];
            for(let cell of row.cells)
            {
                currentRow.push(cell.value);
            }
            cellMatrix.push(currentRow);
        }

        return cellMatrix;
    }

    setInputCell(rowIndex: number, colIndex: number): void
    {
        this.editableCellRow = rowIndex;
        this.editableCellCol = colIndex;
        console.log(`celula apasata: linie: ${this.editableCellRow}, col: ${this.editableCellCol}`);
    }

    isCellAnInput(rowIndex: number, colIndex: number): boolean
    {
        return this.editableCellCol === colIndex && this.editableCellRow === rowIndex;
    }

    addRow(): void
    {
        let newRow: Row = {cells: []};
        let currentNewCell: Cell;
        for(let columnInfo of this.spreadsheet.columnInfos)
        {
            switch(columnInfo.cellType)
            {
                case ColumnType.STRING:
                    currentNewCell = { value: '', style: this.defaultCellStyle };
                    newRow.cells.push(currentNewCell);
                    break;
                case ColumnType.NUMBER:
                    currentNewCell = { value: '0', style: this.defaultCellStyle };
                    newRow.cells.push(currentNewCell);
                    break;
                case ColumnType.BOOL:
                    currentNewCell = { value: 'false', style: this.defaultCellStyle };
                    newRow.cells.push(currentNewCell);
                    break;
            }
        }
        this.mainSpreadsheet?.renderRows();
        console.log('add row');
    }

    deleteRow(): void
    {
        this.spreadsheet.rows.splice(this.editableCellRow, 1);
        // this.dataSource = new MatTableDataSource(this.table.rows); // merge si fara
        this.mainSpreadsheet?.renderRows();
        console.log('delete row');
    }

    logSpreadsheetValues(): void
    {
        console.table(this.spreadsheetToStringMatrix());
    }
}
