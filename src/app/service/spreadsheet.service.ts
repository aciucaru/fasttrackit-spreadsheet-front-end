import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject, of, shareReplay, share } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import * as mathjs from "mathjs";

import { Cell, CellStyle, SelectedCellType } from '../model/cell';
import { Row } from '../model/row';
import { ColumnInfo, ColumnType, GeneratingMethod } from '../model/column';
import { Spreadsheet, EditableSpreadsheet} from '../model/spreadsheet';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';

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
                                            indexColWidthPx: 70,
                                            titleRowHeightPx: 20,
                                            varNameRowHeightPx:20,

                                            selectedDataCellRow: -1,
                                            selectedDataCellCol: -1,
                                            selectedTitleCellCol: -1,
                                            selectedVarNameCellCol: -1,
                                            generatedNewColumns: 0
                                        }
                                )
                        )
                        .subscribe( (editableSpreadsheet: EditableSpreadsheet) =>
                            {
                                this.spreadsheetSubject.next(editableSpreadsheet);
                                console.log('got spreadsheet from httpClient');
                                this.logSpreadsheetValues();
                            }
                        );
    }
 
    // metoda ce returneaza spreadsheet-ul luat de pe server
    // este metoda principala pe care ar trebui sa o foloseasca componentele UI ce au acces la acest service
    public getSpreadsheetSubject(): BehaviorSubject<EditableSpreadsheet>
    { return this.spreadsheetSubject!; }

    // metoda ce spune daca o celula de data oarecare de indexi 'rowIndex' si 'colIndex'
    // este celula selectata; celula selectata va fi desenata ca 'input', restul vor fi 'read-only'
    isThisDataCellSelected(rowIndex: number, colIndex: number): boolean
    {
        let result: boolean = false;

        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // daca indexii sunt corecti
        if(rowIndex >= 0 && colIndex >= 0)
        {
            // si daca tipul celulei selectate curent este 'celula de date' ('DATA_CELL')
            if(spreadsheet.selectedCellType === SelectedCellType.DATA_CELL)
                // atunci rezultatul mai depinde doar de indexi
                result = spreadsheet.selectedDataCellCol === colIndex
                    && spreadsheet.selectedDataCellRow === rowIndex;
        }
        // altfel, rezultatul este fals

        return result; // se returneaza rezultatul
    }

    // returneaza daca celula de titlu, de index 'colIndex' este cea selectata
    isThisTitleCellSelected(colIndex: number): boolean
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // daca indexul este corect si tipul celulei selectate curent
        // este 'celula de titlu' ('TITLE_CELL')
        if(colIndex >= 0 && spreadsheet.selectedCellType === SelectedCellType.TITLE_CELL)
            // atunci rezultatul mai depinde doar de index
            return spreadsheet.selectedTitleCellCol === colIndex;
        else
            return false; // altfel, celula sigur nu este selectata
    }

    // returneaza daca celula de nume de variabila, de index 'colIndex' este cea selectata
    isThisVarNameCellSelected(colIndex: number): boolean
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // daca indexul este corect si tipul celulei selectate curent
        // este 'celula de nume de variabila' ('VAR_NAME_CELL')
        if(colIndex >= 0 && spreadsheet.selectedCellType === SelectedCellType.VAR_NAME_CELL)
            // atunci rezultatul mai depinde doar de index
            return spreadsheet.selectedVarNameCellCol === colIndex;
        else
            return false; // altfel, celula sigur nu este selectata
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
            // se creeaza o noua celula
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDummyCellStyle() };
 
            // celula respectiva se adauga la linia (randul) initial goala
            // in felul acesta, linia se umple treptat cu celule si se formeaza o linie completa
            newRow.cells.push(currentNewCell);
        }

        // la sfarsit se dauga intreaga linie noua ce tocmai s-a populat cu celule
        // aici splice() se foloseste pt. a adauga elementul 'newRow' la sir (nu se sterge nimic)
        spreadsheet.rows.splice(spreadsheet.selectedDataCellRow, 0, newRow);

        /* daca s-a adaugat o linie deasupra (adica inainte de linia curenta din sirul de linii),
        atunci inseamna ca indexul liniei curente ('selectedCellRow') se schimba si el, adica
        se incrementeaza cu 1 */
        spreadsheet.selectedDataCellRow += 1;

        this.spreadsheetSubject.next(spreadsheet);
        console.log('add row above');
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
            // se creeaza o noua celula
            currentNewCell = { stringValue: 'abc', numberValue:0, boolValue: false, style: this.getDummyCellStyle() };

            // celula respectiva se adauga la linia (randul) initial goala
            // in felul acesta, linia se umple treptat cu celule si se formeaza o linie completa
            newRow.cells.push(currentNewCell);
        }

        // la sfarsit se dauga intreaga linie noua ce tocmai s-a populat cu celule
        // aici splice() se foloseste pt. a adauga elementul 'newRow' la sir (nu se sterge nimic)
        spreadsheet.rows.splice(spreadsheet.selectedDataCellRow + 1, 0, newRow);
        /* daca s-a adaugat o linie dedesupt (adica dupa linia curenta din sirul de linii),
        atunci inseamna ca indexul liniei curente ('selectedCellRow') NU se schimba si el,
        adica nu mai trebuie modificat nimic */

        // se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add row below');
    }

    public deleteSelectedRow(): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();
        spreadsheet.rows.splice(spreadsheet.selectedDataCellRow, 1);
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete row');
    }

    public addColToRight(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let currentNewCell: Cell;
        // pentru fiecare linia (rand) a spreadsheet-ului
        for(let currentRow of spreadsheet.rows)
        {
            // se creeaza o noua celula de tip STRING (acesta este tipul default al spreadsheet-ului)
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDummyCellStyle() };

            // se dauga noua celula la linia curenta
            // aici splice() se foloseste pt. a adauga la sir (nu pentru a sterge)
            currentRow.cells.splice(spreadsheet.selectedDataCellCol + 1, 0, currentNewCell);
        }

        // se incrementeza numarul de coloane noi generate
        spreadsheet.generatedNewColumns += 1;

        // dupa aceea, se adauga un nou 'ColumnInfo' la sirul cu informatii despre coloane
        // adica la sirul 'columnInfos', care poate fi vazut ca sirul de coloane
        let newColumnInfo: ColumnInfo =
                                        {
                                            title: 'New Column' + spreadsheet.generatedNewColumns,
                                            colType: ColumnType.STRING,
                                            genMethod: GeneratingMethod.FROM_USER_INPUT,
                                            varName: 'newCol' + spreadsheet.generatedNewColumns,
                                            widthPx: 70
                                        };
        // se adauga noul 'ColumnInfo' la sirul cu informatii desprte coloane
        // aici splice() este folosit pt. a adauga, nu se sterge nimic
        spreadsheet.columnInfos.splice(spreadsheet.selectedDataCellCol + 1, 0, newColumnInfo);

        /* daca s-a adaugat o coloana spre dreapta (adica dupa coloana curenta din sirul 'columnInofs'),
        atunci inseamna ca indexul coloanei curente ('selectedCellCol') NU se schimba si el, adica
        nu mai trebui modificat nimic */

        // se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add col to right');
    }

    public addColToLeft(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let currentNewCell: Cell;
        // pentru fiecare linia (rand) a spreadsheet-ului
        for(let currentRow of spreadsheet.rows)
        {
            // se creeaza o noua celula de tip STRING (acesta este tipul default al spreadsheet-ului)
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDummyCellStyle() };

            // se dauga noua celula la linia curenta
            // aici splice() se foloseste pt. a adauga la sir (nu pentru a sterge)
            currentRow.cells.splice(spreadsheet.selectedDataCellCol, 0, currentNewCell);
        }

        // se incrementeza numarul de coloane noi generate
        spreadsheet.generatedNewColumns += 1;

        // dupa aceea, se adauga un nou 'ColumnInfo' la sirul cu informatii despre coloane
        // adica la sirul 'columnInfos', care poate fi vazut ca sirul de coloane
        let newColumnInfo: ColumnInfo =
                                        {
                                            title: "New Column" + spreadsheet.generatedNewColumns,
                                            colType: ColumnType.STRING,
                                            genMethod: GeneratingMethod.FROM_USER_INPUT,
                                            varName: "newCol" + spreadsheet.generatedNewColumns,
                                            widthPx: 70
                                        };
        // se adauga noul 'ColumnInfo' la sirul cu informatii desprte coloane
        // aici splice() este folosit pt. a adauga, nu se sterge nimic
        spreadsheet.columnInfos.splice(spreadsheet.selectedDataCellCol, 0, newColumnInfo);

        /* daca s-a adaugat o coloana spre stanga (adica inainte de coloana curenta din sirul 'columnInofs'),
        atunci inseamna ca indexul coloanei curente ('selectedCellCol') se schimba si el, adica
        trebuie incrementat cu 1 */
        spreadsheet.selectedDataCellCol += 1;

        // se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject.next(spreadsheet);
        console.log('add col to left');
    }

    public deleteSelectedCol(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // prima data se sterge cate o celula din coloana curenta, din fiecare rand (linie)
        for(let currentRow of spreadsheet.rows) // pentru fiecare rand
        {
            // sterge celula din coloana curenta
            currentRow.cells.splice(spreadsheet.selectedDataCellCol, 1);
        }

        // apoi se sterge si 'headerul', adica un element al sirului 'columnInfos', unde sunt
        // stocate informatiile despre fiecare coloana
        spreadsheet.columnInfos.splice(spreadsheet.selectedDataCellCol, 1);

        // apoi se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete col');
    }

    // metoda ce seteaza celula de date selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    setSelectedDataCell(rowIndex: number, colIndex: number): void
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        if(rowIndex >= 0 && colIndex >=0)
        {
            // pe ecran nu poate exista decat o singura celula selectata curent,
            // in acest caz se seteaza tipul acelei celule ca fiind 'DATA_CELL'
            spreadsheet.selectedCellType = SelectedCellType.DATA_CELL;

            // se stocheaza indexii ceulei de date selectate
            spreadsheet.selectedDataCellRow = rowIndex;
            spreadsheet.selectedDataCellCol = colIndex;

            // se stocheaza indexul coloanei ce contine celula selectata
            spreadsheet.currentOnFocusCol = colIndex;

            this.spreadsheetSubject.next(spreadsheet);
        }
        // console.log(`celula apasata: linie: ${rowIndex}, col: ${colIndex}`);
    }

    // seteaza celula titlului de coloana, celula selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    setSelectedTitleCell(colIndex: number): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        
        if(colIndex >= 0)
        {
            // pe ecran nu poate exista decat o singura celula selectata curent,
            // in acest caz se seteaza tipul acelei celule ca fiind 'DATA_CELL'
            spreadsheet.selectedCellType = SelectedCellType.TITLE_CELL;

            spreadsheet.selectedTitleCellCol = colIndex; // se seteaza valoarea

            // se stocheaza indexul coloanei ce contine celula selectata
            spreadsheet.currentOnFocusCol = colIndex;
            
            this.spreadsheetSubject.next(spreadsheet); // se emite noul spreadsheet
        }
        console.log('selected col title:' + colIndex);
    }

    // seteaza celula numelui de variabila de coloana, celula selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    setSelectedVarNameCell(colIndex: number): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();
        if(colIndex >= 0)
        {
            // pe ecran nu poate exista decat o singura celula selectata curent,
            // in acest caz se seteaza tipul acelei celule ca fiind 'DATA_CELL'
            spreadsheet.selectedCellType = SelectedCellType.VAR_NAME_CELL;

            spreadsheet.selectedVarNameCellCol = colIndex; // se seteaza valoarea

            // se stocheaza indexul coloanei ce contine celula selectata
            spreadsheet.currentOnFocusCol = colIndex;

            this.spreadsheetSubject.next(spreadsheet); // se emite noul spreadsheet
        }
    }

    // metoda ce modifica latimea tuturor celulelor din coloana de index 'colIndex'
    setColumWidth(colIndex: number, width: number): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        if(colIndex >= 0 && width >= 0)
        {
            // se schimba latimea coloanei de index 'colIndex'
            spreadsheet.columnInfos[colIndex].widthPx = width;
            // se trimite noul spreasheet catre observatorii sai
            this.spreadsheetSubject.next(spreadsheet);
        }
    }

    // metoda ce modifica latimea tuturor celulelor liniei de index 'rowIndex'
    setRowHeight(rowIndex: number, height: number): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se schimba inaltimea liniei de index 'rowIndex'
        spreadsheet.rows[rowIndex].heigthPx = height;

        // se trimite noul spreasheet catre observatorii sai
        this.spreadsheetSubject.next(spreadsheet);

        // console.log(`setRowHeight(${rowIndex}, ${height})`);
        console.log(`setRowHeight(${rowIndex}, ${height})`);
    }

    getCellTypeAsString(cellColIndex: number): string
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        if(cellColIndex >= 0)
            return String(spreadsheet.columnInfos[cellColIndex].colType);
        else
        {
            console.log('warning: SpreadsheetService.getCellTypeAsString(): illegal index');
            return String(ColumnType.STRING);
        }
    }

    getCellWitdh(cellColIndex: number): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        if(cellColIndex >= 0)
            return spreadsheet.columnInfos[cellColIndex].widthPx;
        else
        {
            console.log('warning: SpreadsheetService.getCellWitdh(): illegal index');
            return 100;
        }
    }

    getCellHeight(cellRowIndex: number): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        if(cellRowIndex >= 0)
            return spreadsheet.rows[cellRowIndex].heigthPx;
        else
        {
            console.log('warning: SpreadsheetService.getCellHeight(): illegal index');
            return 100;
        }
    }

    getColWidth(colIndex: number): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        if(colIndex >= 0)
            return spreadsheet.columnInfos[colIndex].widthPx;
        else
        {
            console.log('warning: SpreadsheetService.getColWidth(): illegal index');
            return 100;
        }
    }


    // metoda ce returneaza inaltimea celulelor ce reprezinta titlul coloanelor
    getTitleRowHeight(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // return spreadsheet.colTitleHeightPx;
        return spreadsheet.titleRowHeightPx;
    }

    // metoda ce returneaza inaltimea celulelor ce reprezinta numele de variabila ale coloanelor
    getVarNameRowHeight(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // return spreadsheet.colVarNameHeightPx;
        return spreadsheet.varNameRowHeightPx;
    }

    getCurrentOnFocusColumn(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // return spreadsheet.colVarNameHeightPx;
        return spreadsheet.varNameRowHeightPx;
    }

    // ****************** metode auxiliare sau de debugging ***************************

    // metoda folosita pt. logging
    public logSpreadsheetValues(): void
    { console.table(this.spreadsheetToStringMatrix()); }

    // metoda ce transforma 
    public spreadsheetToStringMatrix(): string[][]
    {
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let cellMatrix: string[][] = [[]];
        let currentStringRow: string[] = [];
        let currentCellString: string = '';
        for(let currentRow of spreadsheet.rows)
        {
            currentStringRow = []; // se reseteaza la fiecare iteratie
            for(let i = 0; i<currentRow.cells.length; i++)
            {
                /* Indexul 'i' reprezinta indexul celulei curente, dar si al coloanei curente,
                din care face parte celula curenta.
                O celula stocheaza cate o valoare pt. fiecare tip posibil al ei (STRING, NUMBER, etc.)
                dar se doreste logarea doar a valorii efective a celulei, adica cea corespunzatoare
                tipului coloanei din care face parte celula curenta. */
                
                switch(spreadsheet.columnInfos[i].colType)
                {
                    // daca celula face parte dintr-o coloana de tip STRING
                    case ColumnType.STRING:
                    {
                        // atunci se foloseste valoare 'stringValue' a celulei
                        // currentCellString = String(currentRow.cells[i].stringValue);
                        currentCellString = currentRow.cells[i].stringValue;
                        break;
                    }

                    // daca celula face parte dintr-o coloana de tip NUMBER
                    case ColumnType.NUMBER:
                    {
                        // atunci se foloseste valoare 'numberValue' a celulei
                        // ce trebuie covertita in 'string'
                        currentCellString = String(currentRow.cells[i].numberValue);
                        // currentCellString = currentRow.cells[i].numberValue.toString();
                        break;
                    }

                    // daca celula face parte dintr-o coloana de tip BOOL
                    case ColumnType.BOOL:
                    {
                        // atunci se foloseste valoare 'boolValue' a celulei
                        // ce trebuie covertita in 'string'
                        currentCellString = String(currentRow.cells[i].boolValue);
                        // currentCellString = currentRow.cells[i].boolValue.toString();
                        break;
                    }

                    default:
                    {
                        currentCellString = currentRow.cells[i].stringValue;
                        break;
                    }
                }
                currentStringRow.push(currentCellString);
            }
            cellMatrix.push(currentStringRow);
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
                    title: 'String Col',
                    colType: ColumnType.STRING,
                    genMethod:GeneratingMethod.FROM_USER_INPUT,
                    varName: 'stringCol',
                    widthPx: 70
                },
                {
                    title: 'Number Col',
                    colType: ColumnType.NUMBER,
                    genMethod:GeneratingMethod.FROM_USER_INPUT,
                    varName: 'numberCol',
                    widthPx: 70
                }
            ],
            rows:
            [
                { cells:
                    [
                        {stringValue: "abc", numberValue: 100, boolValue: false, style: this.getDummyCellStyle()},
                        {stringValue: "def", numberValue: 200, boolValue: false, style: this.getDummyCellStyle()}
                    ],
                 heigthPx: 20
                },
                { cells:
                    [
                        {stringValue: "ghi", numberValue: 300, boolValue: true, style: this.getDummyCellStyle()},
                        {stringValue: "jkl", numberValue: 400, boolValue: false, style: this.getDummyCellStyle()}
                    ],
                  heigthPx: 20
                }
            ],
            varNameRowHeightPx: 20,
            titleRowHeightPx: 20,
            indexColWidthPx: 70,

            selectedCellType: SelectedCellType.DATA_CELL,
            selectedDataCellRow: -1,
            selectedDataCellCol: -1,
            selectedTitleCellCol: -1,
            selectedVarNameCellCol: -1,
            generatedNewColumns: 0,
            currentOnFocusCol: -1
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
