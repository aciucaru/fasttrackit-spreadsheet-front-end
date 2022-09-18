import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject, of, shareReplay, share } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import { Cell } from '../model/cell';
import { CellStyle } from '../model/cell-style'; 
import { ColumnType } from '../model/column-type';
import { Spreadsheet} from '../model/spreadsheet';
import { EditableSpreadsheet} from '../model/editable-spreadsheet';
import { Row } from '../model/row';
import { GeneratingMethod } from '../model/generating-method';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetService
{
    editableCellCol: number = -1;
    editableCellRow: number = -1;

    private oneSpreadsheetUrl = 'http://localhost:8080/sheets/one';
    // httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    private editableSpreadsheetSource$: BehaviorSubject<Spreadsheet>
            = new BehaviorSubject<Spreadsheet>(this.getDummySpreadsheet());
    private editableSpreadsheet$?:Observable<Spreadsheet>
            = this.editableSpreadsheetSource$.asObservable();

    constructor(private httpClient: HttpClient)
    {
        // aceasta metoda ar trebui apelata la comanda unui component UI
        // dar momentan este apelata din constructor, pt. a avea un spreadsheet cu care se poate lucra
        this.getCurrentSpreadsheetFromServer(''); // se ia un spreadsheet de pe server
    }

    // metoda ce ia un spreadsheet de pe server, temporar argumentul nu este folosit
    getCurrentSpreadsheetFromServer(spreadsheetName: string): void
    {
        this.editableSpreadsheet$ =
            this.httpClient.get<Spreadsheet>(this.oneSpreadsheetUrl)
                            .pipe(shareReplay(1));
    }

    // metoda ce returneaza spreadsheet-ul luat de pe server
    // este metoda principala pe care ar trebui sa o foloseasca componentele UI ce au acces la acest service
    getCurrentSpreadsheet(): Observable<Spreadsheet>
    { return this.editableSpreadsheet$!; }

    addRow(): void
    {
        let newRow: Row = {cells: []};
        let currentNewCell: Cell;
        for(let columnInfo of this.editableSpreadsheetSource$.getValue().columnInfos)
        {
            switch(columnInfo.cellType)
            {
                case ColumnType.STRING:
                    currentNewCell = { value: '', style: this.getDummyCellStyle() };
                    newRow.cells.push(currentNewCell);
                    break;
                case ColumnType.NUMBER:
                    currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                    newRow.cells.push(currentNewCell);
                    break;
                case ColumnType.BOOL:
                    currentNewCell = { value: 'false', style: this.getDummyCellStyle() };
                    newRow.cells.push(currentNewCell);
                    break;
            }
        }
        console.log('add row');
    }

    deleteRow(rowIndex: number): void
    {
        this.editableSpreadsheetSource$.getValue().rows.splice(rowIndex, 1);
        // this.dataSource = new MatTableDataSource(this.table.rows); // merge si fara
        console.log('delete row');
    }

    logSpreadsheetValues(): void
    {
        console.table(this.spreadsheetToStringMatrix());
    }

    spreadsheetToStringMatrix(): string[][]
    {
        let cellMatrix: string[][] = [[]];

        for(let row of this.editableSpreadsheetSource$.getValue().rows)
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

    private getDummySpreadsheet(): Spreadsheet
    {
        let spreadsheet: Spreadsheet = 
        {
            // spreadsheet:
            // {
                name: "dummy spreadsheet",
                columnInfos:
                [
                    {
                        name: 'Numbers',
                        cellType: ColumnType.NUMBER,
                        genMethod:GeneratingMethod.FROM_USER_INPUT,
                        varName: 'number_col'
                    }
                ],
                rows:
                [
                    { cells: [ {value: "100", style: this.getDummyCellStyle()}, ] },
                ]
            // },
            // editableCellCol:-1,
            // editableCellRow: -1
        };
        return spreadsheet;
    }

    private getDummyCellStyle(): CellStyle
    {
        let cellStyle: CellStyle =
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

        return cellStyle;
    }
}
