export interface ChartColumnLabelInfo
{
    labelColumnVarName: string; // numele coloanei cu label-ul chartului
    labelColor: string; // culoarea de display a label-ului
}

export interface ChartColumnDataInfo
{
    dataColumnVarName: string; // numele coloanei cu label-ul chartului
    rgbBGColor: string; // valoare HTML hex a culorii de background
    rgbFGColor: string; // valaore HTML hex a culorii pt. text
    borderColor: string; // valoare HTML hex a culorii a marginilor
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