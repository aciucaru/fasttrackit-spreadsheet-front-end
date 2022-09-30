// interfata identica cu varianta de pe back-end
export interface Cell
{
    stringValue: string;
    numberValue: number;
    boolValue: boolean;
    style: CellStyle;
}

// interfata identica cu varianta de pe back-end
export interface CellStyle
{
    rgbBGColor: string;
    rgbFGColor: string;
    borderColor: string;

    font: string;
    isBold: boolean;
    isItalic: boolean;
}

// enum folosit in 'EditableSpreadsheet' ce stocheaza tipul celulei selectate curent
// (numai o singura celula poate fi selectata la un moment data)
export enum SelectedCellType
{
    DATA_CELL = 'DATA_CELL', // celula selectata este o celula obisnuita de date
    TITLE_CELL = 'TITLE_CELL', // celula selectata este un titlu de coloana
    VAR_NAME_CELL = 'VAR_NAME_CELL' // celula selectata este un nume de variabila al unei coloane
}