import { Spreadsheet } from './spreadsheet';

/* Clasa ce modeleaza un Spreadsheet editabil. Aceasta clasa contine un obiect de tip 'Spreadsheet' dar
   si alte variabile/obiecte ce sunt necesare doar in timpul editarii, si nu ar trebui stocate pe server
   ci oar temporar pe front-end. */
export class EditableSpreadsheet
{
    spreadsheet?: Spreadsheet;
    editableCellCol: number = -1;
    editableCellRow: number = -1;

    constructor(spreadsheet: Spreadsheet)
    {
        this.spreadsheet = spreadsheet;
    }
}