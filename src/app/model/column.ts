// import { ColumnType } from './column-type';
// import { GeneratingMethod } from './generating-method';

export interface ColumnInfo
{
    title: string; // numele afisat al coloanei (un fel de "header" sau "caption")
    colType: ColumnType; // tipul tuturor celulelor coloanei
    genMethod: GeneratingMethod; // modul in care se genereaza valoarea celulelor coloanei
    varName: string; // numele coloanei folosit in formule
    widthPx: number; // latimea in pixeli a coloanei (si a tuturor celuleor din ea)
}

export enum ColumnType
{
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOL = 'BOOL'
}

export enum GeneratingMethod
{
    FROM_USER_INPUT = 'FROM_USER_INPUT',
    FROM_FORMULA = 'FROM_FORMULA'
}