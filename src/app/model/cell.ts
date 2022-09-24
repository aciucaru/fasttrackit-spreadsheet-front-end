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
    hasBGColor: boolean;
    rgbBGColor: string;

    hasFGColor: boolean;
    rgbFGColor: string;

    hasFont: boolean;
    font: string;

    isBold: boolean;
    isItalic: boolean;

    hasBorderColor: boolean;
    borderColor: string;

    hasBorderThickness: boolean;
    borderThickness: number;
}

// enum folosit in 'EditableSpreadsheet' ce stocheaza tipul celulei selectate curent
// (numai o singura celula poate fi selectata la un moment data)
export enum SelectedCellType
{
    COL_TITLE_CELL = 'COL_TITLE_CELL', // celula selectata este un titlu de coloana
    COL_VAR_NAME_CELL = 'COL_VAR_NAME_CELL', // celula selectata este un nume de variabila al unei coloane
    DATA_CELL = 'DATA_CELL' // celula selectata este o celula obisnuita de date
}