// import { ColumnType } from './column-type';
// import { GeneratingMethod } from './generating-method';

export interface ColumnInfo
{
    name: string;
    cellType: ColumnType;
    genMethod: GeneratingMethod
    varName: string;
    widthPx: number
}

export enum ColumnType
{
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOL = "BOOL"
}

export enum GeneratingMethod
{
    FROM_USER_INPUT = 'FROM_USER_INPUT',
    FROM_FORMULA = 'FROM_FORMULA'
}