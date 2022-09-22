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

// varianta a interfetei 'Cell' folosita pe front-end
// contine cateva proprietati in plus fata de varianta de pe back-end
// export interface EditorCell
// {
//     stringValue: string;
//     numberValue: number;
//     boolValue: boolean;
//     style: CellStyle;
// }