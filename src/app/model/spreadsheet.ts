import { Cell } from './cell';
import { Row } from './row';
import { ColumnInfo } from './column-info';

/* Interfata ce copiaza clasa 'Spreadsheet" de pe back-end.
   Scopul acestei interfete este luarea datelor corect de pe server, adica sa aiba o structura identica
   cu structura obiectului luat de pe server */
export interface Spreadsheet
{
    name: string;
    columnInfos: Array<ColumnInfo>;
    rows: Array<Row>;
}