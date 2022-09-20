import { ColumnInfo } from './column-info';
import { Row } from './row';
import { Spreadsheet } from './spreadsheet';

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
    // aceste valori nu se trimit inapoi catre server
    editableCellCol: number;
    editableCellRow: number;
}