import { Cell } from './cell';
import { Row } from './row';
import { ColumnInfo } from './column-info';

export interface Spreadsheet
{
    name: string;
    columnInfos: Array<ColumnInfo>;
    rows: Array<Row>;
}