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
import { ChartColumnDataInfo, ChartColumnLabelInfo, ChartType, ChartInfo } from '../model/chart';

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
                                            generalRowHeightPx: 20,
                                            titleRowHeightPx: 20,
                                            charts: spreadsheet.charts,

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

    public getCurrentOnFocusColumn(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        return spreadsheet.currentOnFocusCol;
    }

    public getCurrentColumnInfo(): ColumnInfo | null
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let currentColIndex: number = spreadsheet.currentOnFocusCol;

        if(currentColIndex >= 0)
            return spreadsheet.columnInfos[currentColIndex];
        else
            return null;
    }

    public findColumnInfoByVarName(varName: string): number
    {
        let columnInfo: ColumnInfo;

        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // se cauta 'columnInfo' dupa string-ul 'varName'
        let notFound: boolean = true;
        let currentColumnInfo: ColumnInfo;
        let i = 0;
        while(notFound && i<spreadsheet.columnInfos.length)
        {
            currentColumnInfo = spreadsheet.columnInfos[i];
            if(currentColumnInfo.varName === varName)
                notFound = false;
            i++;
        }

        if(notFound != true)
            return i;
        else
            return -1;
    }

    // metoda ce spune daca o celula de data oarecare de indexi 'rowIndex' si 'colIndex'
    // este celula selectata; celula selectata va fi desenata ca 'input', restul vor fi 'read-only'
    public isThisDataCellSelected(rowIndex: number, colIndex: number): boolean
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
    public isThisTitleCellSelected(colIndex: number): boolean
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
    public isThisVarNameCellSelected(colIndex: number): boolean
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

        let newRow: Row = {cells: []};
        let currentNewCell: Cell;

        // pentru fiecare coloana
        for(let columnInfo of spreadsheet.columnInfos)
        {
            // se creeaza o noua celula
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDefaultCellStyle() };
 
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

        let newRow: Row = {cells: []};
        let currentNewCell: Cell;
        
        // pentru fiecare coloana
        for(let columnInfo of spreadsheet.columnInfos)
        {
            // se creeaza o noua celula
            currentNewCell = { stringValue: 'abc', numberValue:0, boolValue: false, style: this.getDefaultCellStyle() };

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
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDefaultCellStyle() };

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
                                            formula: '',
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
            currentNewCell = { stringValue: 'abc', numberValue: 0, boolValue: false, style: this.getDefaultCellStyle() };

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
                                            formula: '',
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
        console.log('addColToLeft()');
    }

    public addChartDataColumn(chartIndex: number, colInfo: ColumnInfo): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let charts: ChartInfo[] = spreadsheet.charts;

        if(chartIndex < charts.length)
        {
            let newChartColumnDataInfo: ChartColumnDataInfo = 
            {
                dataColumnVarNameRef: colInfo.varName, // numele coloanei cu label-ul chartului
                rgbBGColor: "#ffffff", // valoare HTML hex a culorii de background
                rgbFGColor: "#ffffff", // valaore HTML hex a culorii pt. text
                borderColor: "#ffffff" // valoare HTML hex a culorii a marginilor
            };

            charts[chartIndex]?.dataColumns.push(newChartColumnDataInfo);

            // se trimite noul spreadsheet catre toti observatorii sai
            this.spreadsheetSubject.next(spreadsheet);
            console.log('addChartDataColumn()');
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
            currentRow.cells.splice(spreadsheet.selectedDataCellCol, 1);
        }

        // apoi se sterge si 'headerul', adica un element al sirului 'columnInfos', unde sunt
        // stocate informatiile despre fiecare coloana
        spreadsheet.columnInfos.splice(spreadsheet.selectedDataCellCol, 1);

        // apoi se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('delete col');
    }

    public addEmptyBarChart(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let chartInfo: ChartInfo =
        {
            chartType: ChartType.BAR,
            labelColumn:
            {
                labelColumnVarNameRef: '', // numele coloanei cu label-ul chartului
                labelColor: '#15a9f9' // culoarea de display a label-ului
            },
            dataColumns: []
        }

        spreadsheet.charts.push(chartInfo);

        // apoi se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject!.next(spreadsheet);
        console.log('SpreadsheetService: addBarChart()');
    }

    public calculateAllCellsValues(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se ia sirul cu informatii despre fiecare coloana
        let colInfos: ColumnInfo[] = spreadsheet.columnInfos;

        // // se ia indexul coloanei curente
        // let currentColIndex: number = this.getCurrentOnFocusColumn();

        let currentRow: Row;
        let currentCell: Cell;
        let currentColInfo: ColumnInfo;
        let currentColVarName: string;
        let currentColFormula: string;
        let currentRowResolvedCells: Map<string, Cell> = new Map<string, Cell>();
        // pentru fiecare rand in parte
        for(let i=0; i<spreadsheet.rows.length; i++)
        {
            console.log(`row ${i}:`);

            // lista de celule rezolvate se goleste la inceputul fiecarui rand al spreadsheet-ului
            currentRowResolvedCells.clear();

            // pentru fiecare celula in parte
            for(let j=0; j<colInfos.length; j++)
            {
                currentRow = spreadsheet.rows[i];
                currentCell = currentRow.cells[j];
                currentColInfo = colInfos[j];
                currentColVarName = colInfos[j].varName;
                currentColFormula = colInfos[j].formula;

                // daca valoarea celulei NU trebuie calculata
                if(currentColInfo.genMethod === GeneratingMethod.FROM_USER_INPUT)
                {
                    // atunci valoarea este deja calculata
                    // si valoarea se adauga la sirul celulelor deja rezolvate ale sirului curent
                    currentRowResolvedCells.set(currentColVarName, currentCell);
                }

                // daca valoarea celulei trebuie calculata prin formula
                if(currentColInfo.genMethod === GeneratingMethod.FROM_FORMULA)
                {
                    console.log(`  j=${j}`)
                    console.log(`    formula before: ${currentColFormula}`);

                    // se ia formula specifica coloanei celulei curente
                    currentColFormula = currentColInfo.formula;

                    // se inlocuiesc identificatorii din formula cu valorile rezolvate
                    // pana la acest moment:
                    // pentru fiecare celula deja rezolvata pana acum
                    for(let [key, value] of currentRowResolvedCells.entries())
                    {
                        // se inlocuiesc identificatorii din formula cu valoarea
                        // corespunzatoare tipului celulei curente
                        switch(currentColInfo.colType) // se determina tipul celulei curente
                        {
                            case ColumnType.STRING:
                                currentColFormula = currentColFormula.replace(key, value.stringValue);
                                console.log('    value: ', currentCell.stringValue);
                                break;

                            case ColumnType.NUMBER:
                                currentColFormula = currentColFormula.replace(key, value.numberValue.toString());
                                console.log('    value: ', currentCell.numberValue.toString());
                                break;

                            case ColumnType.BOOL:
                                currentColFormula = currentColFormula.replace(key, value.boolValue.toString());
                                console.log('    value: ', currentCell.boolValue.toString());
                                break;
                        }
                    }

                    console.log(`    formula after: ${currentColFormula}`);

                    // dupa inlocuirea variabilelor deja cunoscute, se evalueaza efectiv
                    // formula, adica se calculeaza valoarea celulei curente
                    let currentResult = mathjs.evaluate(currentColFormula);
                    currentCell.numberValue = currentResult;
                    console.log(`    result: ${currentResult}`);
                }
            }
        }

        // apoi se trimite noul spreadsheet catre toti observatorii sai
        this.spreadsheetSubject!.next(spreadsheet);
        console.log(`SpreadsheetService: calculateAllCellsValues()`);
    }

    // metoda ce seteaza celula de date selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    public setSelectedDataCell(rowIndex: number, colIndex: number): void
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

            console.log(`SpreadsheetService: setSelectedDataCell(${rowIndex}, ${colIndex})`);
        }
    }

    // seteaza celula titlului de coloana, celula selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    public setSelectedTitleCell(colIndex: number): void
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

            console.log(`SpreadsheetService: setSelectedTitleCell(${colIndex})`);
        }
    }

    // seteaza celula numelui de variabila de coloana, celula selectata curent
    // aceasta celula este singura ce va fi editabila, restul celulelor vor fi 'read-only'
    public setSelectedVarNameCell(colIndex: number): void
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

            console.log(`SpreadsheetService: setSelectedVarNameCell(${colIndex})`);
        }
    }

    // metoda ce modifica latimea tuturor celulelor din coloana de index 'colIndex'
    public setColumWidth(colIndex: number, width: number): void
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
    // setRowHeight(rowIndex: number, height: number): void
    // {
    //     // se ia spreadsheet-ul curent
    //     let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

    //     // se schimba inaltimea liniei de index 'rowIndex'
    //     spreadsheet.rows[rowIndex].heigthPx = height;

    //     // se trimite noul spreasheet catre observatorii sai
    //     this.spreadsheetSubject.next(spreadsheet);

    //     // console.log(`setRowHeight(${rowIndex}, ${height})`);
    //     console.log(`setRowHeight(${rowIndex}, ${height})`);
    // }

    public setColumnFormula(formula: string): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se ia indexul coloanei curente
        let currentColIndex = this.getCurrentOnFocusColumn();

        // se seteaza noua formula in infortmatiile despre coloana
        // acest lucru nu are nici un efect asupra celulelor coloanei (nu se recalculeaza nimic)
        spreadsheet.columnInfos[currentColIndex].formula = formula;

        // se trimite noul spreasheet catre observatorii sai
        this.spreadsheetSubject.next(spreadsheet);
    }

    public setChartLabelColumn(chartIndex: number, colVarName: string): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let charts: ChartInfo[] = spreadsheet.charts;
        let columnInfos: ColumnInfo[] = spreadsheet.columnInfos;

        if(chartIndex < charts.length)
        {
            let columnInfoIndex: number = this.findColumnInfoByVarName(colVarName);

            if(columnInfoIndex >= 0)
            {
                let newChartColumnLabelInfo: ChartColumnLabelInfo = 
                {
                    labelColumnVarNameRef: colVarName, // numele coloanei cu label-ul chartului
                    labelColor: "#ffffff" // culoarea de display a label-ului
                };
                console.log(`setChartLabelColumn() chartIndex: ${chartIndex}`);

                charts[chartIndex].labelColumn = newChartColumnLabelInfo;
    
                // se trimite noul spreadsheet catre toti observatorii sai
                this.spreadsheetSubject.next(spreadsheet);
                console.log('setChartLabelColumn()');
            }
        }
    }

    public setChartDataColumn(chartIndex: number, dataColIndex: number, colInfo: ColumnInfo): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        let charts: ChartInfo[] = spreadsheet.charts;
        let columnInfos: ColumnInfo[] = spreadsheet.columnInfos;

        if(chartIndex < charts.length && dataColIndex < columnInfos.length)
        {
            let newChartColumnDataInfo: ChartColumnDataInfo = 
            {
                dataColumnVarNameRef: colInfo.varName, // numele coloanei cu label-ul chartului
                rgbBGColor: "#ffffff", // valoare HTML hex a culorii de background
                rgbFGColor: "#ffffff", // valaore HTML hex a culorii pt. text
                borderColor: "#ffffff" // valoare HTML hex a culorii a marginilor
            };

            charts[chartIndex].dataColumns[dataColIndex] = newChartColumnDataInfo;

            // se trimite noul spreadsheet catre toti observatorii sai
            this.spreadsheetSubject.next(spreadsheet);
            console.log('setChartDataColumn()');
        }
    }

    // metoda ce modifica tipul de date al coloanei curente
    public changeCurrentColumType(newColType: ColumnType): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se ia indexul coloanei curente
        let currentColIndex = this.getCurrentOnFocusColumn();

        // se ia tipul coloanei curente
        let oldColType: ColumnType = spreadsheet.columnInfos[currentColIndex].colType;

        // se seteaza noul tip in infortmatiile despre coloana
        // acest lucru nu are nici un efect asupra celulelor coloanei (nu realizeaza si cast)
        spreadsheet.columnInfos[currentColIndex].colType = newColType;

        // se convertesc celulele coloanei din tipul vechi in tipul nou:
        // conversie de la 'BOOL' la 'NUMBER'
        if(oldColType === ColumnType.BOOL && newColType === ColumnType.NUMBER)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    if(currentCell.boolValue === true)
                        // 'true' se converteste in 1
                        currentCell.numberValue = 1;
                    else
                        // 'false' se converteste in 0
                        currentCell.numberValue = 0;
                }
            }
        }

        // conversie de la 'BOOL' la 'STRING'
        if(oldColType === ColumnType.BOOL && newColType === ColumnType.STRING)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    if(currentCell.boolValue === true)
                        // 'true' se converteste in stringul 'true'
                        currentCell.stringValue = 'true';
                    else
                        // 'false' se converteste in stringul 'false'
                        currentCell.stringValue = 'false';
                }
            }
        }

        // conversie de la 'NUMBER' la 'BOOL'
        if(oldColType === ColumnType.NUMBER && newColType === ColumnType.BOOL)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    if(currentCell.numberValue > 0)
                        // > 0 se converteste in 'true'
                        currentCell.boolValue = true;
                    else if(currentCell.numberValue < 0)
                        // < 0 se converteste in 'true'
                        currentCell.boolValue = true;
                    else
                        // 0 se converteste in 'false'
                        currentCell.boolValue = false;
                }
            }
        }

        // conversie de la 'NUMBER' la 'STRING'
        if(oldColType === ColumnType.NUMBER && newColType === ColumnType.STRING)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    currentCell.stringValue = currentCell.numberValue.toString();
                }
            }
        }

        // conversie de la 'STRING' la 'BOOL'
        if(oldColType === ColumnType.STRING && newColType === ColumnType.BOOL)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    if(currentCell.stringValue != '')
                        // orice string de minim 1 caracter se converteste in 'true'
                        currentCell.boolValue = true;
                    else
                        // altfel se converteste in 'false'
                        currentCell.boolValue = false;
                }
            }
        }

        // conversie de la 'STRING' la 'NUMBER'
        if(oldColType === ColumnType.STRING && newColType === ColumnType.NUMBER)
        {
            // pentru fiecare rand (linie) al spreadsheet-ului
            for(let currentRow of spreadsheet.rows)
            {
                // pentru fiecare celula din randul curent
                for(let currentCell of currentRow.cells)
                {
                    if(currentCell.stringValue != '')
                        // orice string de minim 1 caracter se converteste in '1'
                        currentCell.numberValue = 1;
                    else
                        // altfel se converteste in '0'
                        currentCell.numberValue = 0;
                }
            }
        }

        // se trimite noul spreasheet catre observatorii sai
        this.spreadsheetSubject.next(spreadsheet);

        console.log(`SpreadsheetService: changeCurrentColumType(${newColType}), index: ${currentColIndex}`);
    }

    public changeCurrentColumGenMethod(newGenMethod: GeneratingMethod): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se ia indexul coloanei curente
        let currentColIndex = this.getCurrentOnFocusColumn();

        // se ia tipul coloanei curente
        let oldGenMethod: GeneratingMethod = spreadsheet.columnInfos[currentColIndex].genMethod;

        // se seteaza noul tip in infortmatiile despre coloana
        // acest lucru nu are nici un efect asupra celulelor coloanei (nu realizeaza si cast)
        spreadsheet.columnInfos[currentColIndex ].genMethod = newGenMethod;


        // se trimite noul spreasheet catre observatorii sai
        this.spreadsheetSubject.next(spreadsheet);

        console.log(`SpreadsheetService: changeCurrentColumType(${newGenMethod}), index: ${currentColIndex}`);
    }


    public getCellTypeAsString(cellColIndex: number): string
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

    public getCellWitdh(cellColIndex: number): number
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

    public getCellHeight(cellRowIndex: number): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // if(cellRowIndex >= 0)
        //     return spreadsheet.rows[cellRowIndex].heigthPx;
        // else
        // {
        //     console.log('warning: SpreadsheetService.getCellHeight(): illegal index');
        //     return 100;
        // }

        return spreadsheet.generalRowHeightPx;
    }

    public getColWidth(colIndex: number): number
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
    public getGeneralRowHeight(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // return spreadsheet.colTitleHeightPx;
        return spreadsheet.generalRowHeightPx;
    }

    // metoda ce returneaza inaltimea celulelor ce reprezinta titlul coloanelor
    public getTitleRowHeight(): number
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

        // return spreadsheet.colTitleHeightPx;
        return spreadsheet.titleRowHeightPx;
    }

    // metoda ce returneaza inaltimea celulelor ce reprezinta numele de variabila ale coloanelor
    // getVarNameRowHeight(): number
    // {
    //     // se ia spreadsheet-ul curent
    //     let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject!.getValue();

    //     // return spreadsheet.colVarNameHeightPx;
    //     return spreadsheet.varNameRowHeightPx;
    // }



    // ****************** metode auxiliare sau de debugging ***************************

    // metoda ce transforma un spreadsheet intr-o matrice, pt. logging
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
                    formula: '',
                    widthPx: 70
                },
                {
                    title: 'Number Col',
                    colType: ColumnType.NUMBER,
                    genMethod:GeneratingMethod.FROM_USER_INPUT,
                    varName: 'numberCol',
                    formula: '',
                    widthPx: 70
                }
            ],
            rows:
            [
                { cells:
                    [
                        {stringValue: "abc", numberValue: 100, boolValue: false, style: this.getDefaultCellStyle()},
                        {stringValue: "def", numberValue: 200, boolValue: false, style: this.getDefaultCellStyle()}
                    ]
                },
                { cells:
                    [
                        {stringValue: "ghi", numberValue: 300, boolValue: true, style: this.getDefaultCellStyle()},
                        {stringValue: "jkl", numberValue: 400, boolValue: false, style: this.getDefaultCellStyle()}
                    ]
                }
            ],
            generalRowHeightPx: 20,
            titleRowHeightPx: 20,
            indexColWidthPx: 70,
            charts: new Array<ChartInfo>(),

            selectedCellType: SelectedCellType.DATA_CELL,

            selectedDataCellRow: -1,
            selectedDataCellCol: -1,

            selectedTitleCellCol: -1,
            selectedVarNameCellCol: -1,
            currentOnFocusCol: -1,
            generatedNewColumns: 0
        };
        return spreadsheet;
    }

    private getDefaultCellStyle(): CellStyle
    {
        let cellStyle: CellStyle =
        {
            rgbBGColor: '#ffffff',
            rgbFGColor: '#000000',
            borderColor: '#000000',
    
            font: "Arial, sans-serif",
            isBold: false,
            isItalic: false,
        };

        return cellStyle;
    }


    // ***************** metode pt. logging ********************

    // metoda folosita pt. logging
    public logSpreadsheetValues(): void
    {
        console.table(this.spreadsheetToStringMatrix());
    }
    
    public logCurrentColumFormula(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        // se ia indexul coloanei curente
        let currentColIndex: number = this.getCurrentOnFocusColumn();

        let currentColVarName: string = spreadsheet.columnInfos[currentColIndex].varName;
        let currentColFormula: string = spreadsheet.columnInfos[currentColIndex].formula;

        console.log(`Column ${currentColIndex}, ${currentColVarName} formula:`);
        console.log(currentColFormula);
    }

    public logChartsInfo(): void
    {
        // se ia spreadsheet-ul curent
        let spreadsheet: EditableSpreadsheet = this.spreadsheetSubject.getValue();

        console.log(`charts: \n`);
        let currentChartInfo: ChartInfo;
        for(let i = 0; i<spreadsheet.charts.length; i++)
        {
            console.log(`chart ${i}:`);
            currentChartInfo = spreadsheet.charts[i];
            console.log(`  type: ${currentChartInfo.chartType}`);

            console.log(`  label col ref: ${currentChartInfo.labelColumn.labelColumnVarNameRef}`);
            console.log(`  label col fg color: ${currentChartInfo.labelColumn.labelColor}`);

            console.log(`  data cols:`);
            let currentDataCol: ChartColumnDataInfo;
            for(let j = 0; j<currentChartInfo.dataColumns.length; j++)
            {
                currentDataCol = currentChartInfo.dataColumns[j];
                console.log(`    data col ${j}`);
                console.log(`    - ref: ${currentDataCol.dataColumnVarNameRef}`);
                console.log(`    - bg color: ${currentDataCol.rgbBGColor}`);
                console.log(`    - fg color: ${currentDataCol.rgbFGColor}`);
            }

            console.log(`\n`);
        }
    }
}
