import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject, of, shareReplay, share } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cell, CellStyle } from '../model/cell';
import { Row } from '../model/row';
import { ColumnInfo, ColumnType, GeneratingMethod } from '../model/column';
import { Spreadsheet, EditableSpreadsheet} from '../model/spreadsheet';

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

    public getCurrentSpreadsheetFromServer(spreadsheetName: string): void
    {
        this.httpClient.get<Spreadsheet>(this.oneSpreadsheetUrl)
                        .pipe(
                            map(
                                (spreadsheet: Spreadsheet) =>
                                        <EditableSpreadsheet>{
                                            name: spreadsheet.name,
                                            columnInfos: spreadsheet.columnInfos,
                                            rows: spreadsheet.rows,
                                            selectedCellCol: -1,
                                            selectedCellRow: -1,
                                        }
                                )
                        )
                        .subscribe( (editableSpreadsheet: EditableSpreadsheet) =>
                            {
                                this.spreadsheetSubject.next(editableSpreadsheet);
                                console.log('got spreadsheet from httpClient');
                            }
                        );
    }
 
    // metoda ce returneaza spreadsheet-ul luat de pe server
    // este metoda principala pe care ar trebui sa o foloseasca componentele UI ce au acces la acest service
    public getSpreadsheetSubject(): BehaviorSubject<EditableSpreadsheet>
    { return this.spreadsheetSubject!; }

    // metoda ce seteaza celula selectata curent
    // aceasta celula este singura ce va fi de tip html 'input', restul celulelor vor fi 'read-only'
    setSelectedCell(rowIndex: number, colIndex: number): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        spreadsheet.selectedCellRow = rowIndex;
        spreadsheet.selectedCellCol = colIndex;
        this.spreadsheetSubject.next(spreadsheet);
        console.log(`celula apasata: linie: ${rowIndex}, col: ${colIndex}`);
    }

    // metoda ce spune daca o celula oarecare de indexi 'rowIndex' si 'colIndex' este celula selectata
    // celula selectata va fi randata ca 'input', restul celulelor vor fi de tip 'read-only'
    isThisCellSelected(rowIndex: number, colIndex: number): boolean
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        return spreadsheet.selectedCellCol === colIndex
                && spreadsheet.selectedCellRow === rowIndex;
    }

    public addRowAbove(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let newRow: Row = {cells: [], heigthPx: 20};
        let currentNewCell: Cell;

        // pentru fiecare coloana
        for(let columnInfo of spreadsheet.columnInfos)
        {
            // se creeaza o celula specifica tipului acelei coloane (STRING, NUMBER, etc.)
            switch(columnInfo.cellType)
            {
                case ColumnType.STRING:
                    currentNewCell = { value: 'abc', style: this.getDummyCellStyle() };
                    break;
                case ColumnType.NUMBER:
                    currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                    break;
                case ColumnType.BOOL:
                    currentNewCell = { value: 'false', style: this.getDummyCellStyle() };
                    break;
                default:
                    currentNewCell = { value: '100', style: this.getDummyCellStyle() };
                    break;
            }

            // celula respectiva se adauga la linia (randul) initial goala
            // in felul acesta, linia se umple treptat cu celule si se formeaza o linie completa
            newRow.cells.push(currentNewCell);
        }

        // la sfarsit se dauga intreaga linie noua ce tocmai s-a populat cu celule
        // aici splice() se foloseste pt. a adauga elementul 'newRow' la sir (nu se sterge nimic)
        spreadsheet.rows.splice(spreadsheet.selectedCellRow, 0, newRow);
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add row');
    }

    public addRowBelow(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let newRow: Row = {cells: [], heigthPx: 20};
        let currentNewCell: Cell;
        
        // pentru fiecare coloana
        for(let columnInfo of spreadsheet.columnInfos)
        {
            // se creeaza o celula specifica tipului acelei coloane (STRING, NUMBER, etc.)
            switch(columnInfo.cellType)
            {
                case ColumnType.STRING:
                    currentNewCell = { value: 'abc', style: this.getDummyCellStyle() };
                    break;
                case ColumnType.NUMBER:
                    currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                    break;
                case ColumnType.BOOL:
                    currentNewCell = { value: 'false', style: this.getDummyCellStyle() };
                    break;
                default:
                    currentNewCell = { value: '100', style: this.getDummyCellStyle() };
                    break;
            }
            // celula respectiva se adauga la linia (randul) initial goala
            // in felul acesta, linia se umple treptat cu celule si se formeaza o linie completa
            newRow.cells.push(currentNewCell);
        }

        // la sfarsit se dauga intreaga linie noua ce tocmai s-a populat cu celule
        // aici splice() se foloseste pt. a adauga elementul 'newRow' la sir (nu se sterge nimic)
        spreadsheet.rows.splice(spreadsheet.selectedCellRow + 1, 0, newRow);
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add row');
    }

    public deleteSelectedRow(): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();
        spreadsheet.rows.splice(spreadsheet.selectedCellRow, 1);
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete row');
    }

    public addColToRight(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let currentNewCell: Cell;
        let currentRow: Row;
        let selectedColInfo: ColumnInfo = spreadsheet.columnInfos[spreadsheet.selectedCellCol];
        switch(selectedColInfo.cellType)
        {
            case ColumnType.STRING:
                currentNewCell = { value: 'abc', style: this.getDummyCellStyle() };
                break;
            case ColumnType.NUMBER:
                currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                break;
            case ColumnType.BOOL:
                currentNewCell = { value: 'false', style: this.getDummyCellStyle() };
                break;
            default:
                currentNewCell = { value: '0', style: this.getDummyCellStyle() };
                break;
        }
    }

    public deleteSelectedCol(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // prima data se sterge cate o celula din coloana curenta, din fiecare rand (linie)
        for(let currentRow of spreadsheet.rows) // pentru fiecare rand
        {
            // sterge celula din coloana curenta
            currentRow.cells.splice(spreadsheet.selectedCellCol, 1);
        }

        // apoi se sterge si 'headerul', adica un element al sirului 'columnInfos', unde sunt
        // stocate informatiile despre fiecare coloana
        spreadsheet.columnInfos.splice(spreadsheet.selectedCellCol, 1);

        // apoi se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete col');
    }

    // ****************** metode auxiliare sau de debugging ***************************

    // metoda folosita pt. logging
    public logSpreadsheetValues(): void
    { console.table(this.spreadsheetToStringMatrix()); }

    // metoda ce transforma 
    public spreadsheetToStringMatrix(): string[][]
    {
        let cellMatrix: string[][] = [[]];

        for(let row of this.spreadsheetSubject!.getValue().rows)
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
            name: "dummy spreadsheet",
            columnInfos:
            [
                {
                    name: 'Numbers',
                    cellType: ColumnType.NUMBER,
                    genMethod:GeneratingMethod.FROM_USER_INPUT,
                    varName: 'number_col',
                    widthPx: 70
                }
            ],
            rows: [ { cells: [ {value: "100", style: this.getDummyCellStyle()} ], heigthPx: 20 }, ],
            selectedCellCol: -1,
            selectedCellRow: -1
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
            rgbFGColor: '#000000',
    
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
