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
import { EditableSpreadsheet } from '../model/editable-spreadsheet';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-spreadsheet',
  template: `
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

    @ViewChild(MatTable) mainSpreadsheet?: MatTable<Row>;

    spreadsheet?: EditableSpreadsheet;
    spreadsheetObserver: Observer<EditableSpreadsheet> =
        {
            next: spreadsheet => this.spreadsheet = spreadsheet,
            error: err => console.error('Observer got an error: ' + err),
            complete: () => console.log('Observer got a complete notification'),
        };
        
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<Row>
        = new MatTableDataSource<Row>(this.spreadsheet!.spreadsheet!.rows);

    editableCellCol: number = -1;
    editableCellRow: number = -1;

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute)
    {
        // this.getSpreadsheet();
    }

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
                    this.dataSource = new MatTableDataSource(this.spreadsheet!.spreadsheet!.rows);
                    this.displayedColumns = this.spreadsheet?.spreadsheet!.columnInfos
                                            .map( columnInfo =>{ return columnInfo.name; });
                    this.mainSpreadsheet?.renderRows();
                });
        // this.displayedColumns = this.table.columnNames;
        // this.dataSource = new MatTableDataSource(this.table.rows);
        // this.mainTable?.renderRows();
    }

    setInputCell(rowIndex: number, colIndex: number): void
    {
        this.spreadsheetService.setInputCell(rowIndex, colIndex);
        this.editableCellRow = rowIndex;
        this.editableCellCol = colIndex;
        console.log(`celula apasata: linie: ${this.editableCellRow}, col: ${this.editableCellCol}`);
    }

    isCellAnInput(rowIndex: number, colIndex: number): boolean
    {
        return this.editableCellCol === colIndex && this.editableCellRow === rowIndex;
    }


}
