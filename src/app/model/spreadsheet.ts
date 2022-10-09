import { Cell, SelectedCellType } from './cell';
import { Row } from './row';
import { ColumnInfo } from './column';
import { ChartInfo } from './chart';

/* Interfata ce copiaza clasa 'Spreadsheet" de pe back-end.
   Scopul acestei interfete este luarea datelor corect de pe server, adica sa aiba o structura identica
   cu structura obiectului luat de pe server */
export interface Spreadsheet
{
    name: string;
    columnInfos: Array<ColumnInfo>;
    rows: Array<Row>;
    indexColWidthPx: number;
    charts: Array<ChartInfo>;
}

/* Clasa ce modeleaza un Spreadsheet editabil. Aceasta clasa contine un obiect de tip 'Spreadsheet' dar
   si alte variabile/obiecte ce sunt necesare doar in timpul editarii, si nu ar trebui stocate pe server
   ci oar temporar pe front-end. */
export interface EditableSpreadsheet
{
    // valori din interfata 'Spreadsheet' folosita in back-end
    name: string;
    columnInfos: Array<ColumnInfo>;
    rows: Array<Row>;
    generalRowHeightPx: number;
    titleRowHeightPx: number;
    indexColWidthPx: number;
    charts: Array<ChartInfo>;

    // ********** valori suplimentare necesare pt. editorul de spreadsheet-uri ***********
    // aceste valori NU se trimit inapoi catre server

    selectedCellType: SelectedCellType;

    /* variabile ce stocheaza indexii celulei de date selectate */
    selectedDataCellRow: number;
    selectedDataCellCol: number;

     // stocheaza indexul celulei de titlu selectate (aceste celule afiseaza titlul coloanei)
    selectedTitleCellCol: number;

    // stocheaza indexul celulei de nume de variabila selectate
    // (aceste celule afiseaza numele de variabila al unei coloane)
    selectedVarNameCellCol: number;

    // stocheaza indexul coloanei corespunzatoare celulei selectate (indiferent de tipul celulei)
    currentOnFocusCol: number;

    /* variabila ce stocheaza cate coloane noi au fost create, ca fiecare coloana noua
       sa aiba un nume diferit de cele adaugata pana atunci si, mai ales, sa aiba un nume de
       variabila unic (numele de variabila al unei coloane este folosit in formule si trebuie
       sa fie unic) */
    generatedNewColumns: number;
}