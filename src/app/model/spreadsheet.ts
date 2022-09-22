import { Cell } from './cell';
import { Row } from './row';
import { ColumnInfo } from './column';

/* Interfata ce copiaza clasa 'Spreadsheet" de pe back-end.
   Scopul acestei interfete este luarea datelor corect de pe server, adica sa aiba o structura identica
   cu structura obiectului luat de pe server */
export interface Spreadsheet
{
    name: string;
    columnInfos: Array<ColumnInfo>;
    rows: Array<Row>;
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

    // valori suplimentare necesare pt. editorul de spreadsheet-uri
    // aceste valori NU se trimit inapoi catre server

    /* variabile ce stocheaza indexii celulei selectate */
    selectedCellRow: number;
    selectedCellCol: number;

    /* variabila ce stocheaza cate coloane noi au fost create, ca fiecare coloana noua
       sa aiba un nume diferit de cele adaugata pana atunci si, mai ales, sa aiba un nume de
       variabila unic (numele de variabila al unei coloane este folosit in formule si trebuie
       sa fie unic) */
    generatedNewColumns: number;
}