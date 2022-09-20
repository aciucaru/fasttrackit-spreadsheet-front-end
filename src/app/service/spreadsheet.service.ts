import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject, of, shareReplay, share } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { map } from 'rxjs/operators';

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
    private oneSpreadsheetUrl = 'http://localhost:8080/sheets/one';
    private spreadsheetSubject: BehaviorSubject<EditableSpreadsheet>
            = new BehaviorSubject<EditableSpreadsheet>(this.getDummySpreadsheet());

    constructor(private httpClient: HttpClient)
    {
        // aceasta metoda ar trebui apelata la comanda unui component UI
        // dar momentan este apelata din constructor, pt. a avea un spreadsheet cu care se poate lucra
        this.getCurrentSpreadsheetFromServer(''); // se ia un spreadsheet de pe server
    }

    // metoda ce ia un spreadsheet de pe server, temporar argumentul nu este folosit
    // public getCurrentSpreadsheetFromServer(spreadsheetName: string): void
    // {
    //     this.editableSpreadsheet$ =
    //         this.httpClient.get<Spreadsheet>(this.oneSpreadsheetUrl)
    //                         .pipe(shareReplay(1));
    // }

    public getCurrentSpreadsheetFromServer(spreadsheetName: string): void
    {
        this.httpClient.get<Spreadsheet>(this.oneSpreadsheetUrl)
                        .pipe(
                            map(
                                (spreadsheet: Spreadsheet) =>
                                        <EditableSpreadsheet>{
                                            spreadsheet: spreadsheet,
                                            editableCellCol: -1,
                                            editableCellRow: -1,
                                        }
                                )
                        )
                        .subscribe( (editableSpreadsheet: EditableSpreadsheet) =>
                            {
                                this.spreadsheetSubject.next(editableSpreadsheet);
                                console.log('got spreadsheet from httpClient');
                                // console.log(editableSpreadsheet);
                            }
                        );
    }
 
    // metoda ce returneaza spreadsheet-ul luat de pe server
    // este metoda principala pe care ar trebui sa o foloseasca componentele UI ce au acces la acest service
    public getSpreadsheetSubject(): BehaviorSubject<EditableSpreadsheet>
    { return this.spreadsheetSubject!; }

    public logSpreadsheetValues(): void
    {
        console.table(this.spreadsheetToStringMatrix());
    }

    public spreadsheetToStringMatrix(): string[][]
    {
        let cellMatrix: string[][] = [[]];

        for(let row of this.spreadsheetSubject!.getValue().spreadsheet!.rows)
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

    private getDummySpreadsheet(): EditableSpreadsheet
    {
        let spreadsheet: EditableSpreadsheet = 
        {
            spreadsheet:
            {
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
            },
            editableCellCol:-1,
            editableCellRow: -1
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

    setInputCell(rowIndex: number, colIndex: number): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        spreadsheet.editableCellRow = rowIndex;
        spreadsheet.editableCellCol = colIndex;
        this.spreadsheetSubject.next(spreadsheet);
        console.log(`celula apasata: linie: ${rowIndex}, col: ${colIndex}`);
    }

    isCellAnInput(rowIndex: number, colIndex: number): boolean
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        
        return spreadsheet.editableCellCol === colIndex
                && spreadsheet.editableCellRow === rowIndex;
    }

    public addRow(): void
    {
        let newRow: Row = {cells: []};
        let currentNewCell: Cell;
        for(let columnInfo of this.spreadsheetSubject!.getValue().spreadsheet!.columnInfos)
        {
            switch(columnInfo.cellType)
            {
                case ColumnType.STRING:
                    currentNewCell = { value: 'abc', style: this.getDummyCellStyle() };
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
                default:
                    currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                    newRow.cells.push(currentNewCell);
                    break;
            }
        }
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        spreadsheet.spreadsheet.rows.push(newRow);
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add row');
    }

    public deleteRow(): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();
        spreadsheet.spreadsheet?.rows.splice(spreadsheet.editableCellRow, 1);
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete row');
    }

}
