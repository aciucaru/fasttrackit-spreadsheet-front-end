import { ColumnType } from './column-type';
import { GeneratingMethod } from './generating-method';

export interface ColumnInfo
{
    name: string;
    cellType: ColumnType;
    genMethod: GeneratingMethod
    varName: string;
    widthPx: number
}