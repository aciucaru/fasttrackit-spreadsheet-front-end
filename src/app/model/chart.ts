export interface ChartColumnLabelInfo
{
    labelColumnVarNameRef: string; // numele coloanei cu label-ul chartului
    rgbFGColor: string; // culoarea de display a label-ului
}

export interface ChartColumnDataInfo
{
    dataColumnVarNameRef: string; // numele coloanei cu label-ul chartului
    rgbBGColor: string; // valoare HTML hex a culorii de background
}

export enum ChartType
{
    BAR = 'BAR',
    XY = 'XY',
    PIE = 'PIE'
}

export interface ChartInfo
{
    chartType: ChartType;
    labelColumn: ChartColumnLabelInfo;
    dataColumns: Array<ChartColumnDataInfo>;
}