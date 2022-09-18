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