import { Cell } from './cell';

// interata identica cu cea de pe back-end
export interface Row
{
    cells: Cell[];
    heigthPx: number;
}

// varianta a interfetei 'Row' folosita pe front-end
// contine un sir de tip 'EditorCell' in loc de 'Cell' fata de varianta de pe back-end
// export interface EditorRow
// {
//     cells: EditorCell[];
//     heigthPx: number;
// }