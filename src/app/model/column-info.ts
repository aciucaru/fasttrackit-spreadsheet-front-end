import { ColumnType } from './column-type';

export interface ColumnInfo
{
    name: string;
    cellType: ColumnType; 
    varName: string;
}