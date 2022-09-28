import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';

import { ColumnInfo, ColumnType, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-column-info',
  template: `
    <div>
        <div class="col-info-label">Variable name:</div>
        <div class="col-info-value">{{this.varName}}</div>
        <div class="col-info-label">Data type:</div>
        <select #typeSelect class="col-info-select"
            (change)="someMethod(typeSelect.value)">
            <option *ngFor="let currentType of availableDataTypes">
                {{currentType}}
            </option>
        </select>
        <div class="col-info-label">Generation method:</div>
        <select #genMethodSelect class="col-info-select"
            (change)="someMethod(genMethodSelect.value)">
            <option *ngFor="let currentGenMethod of availableGenMethods">
                {{currentGenMethod}}
            </option>
        </select>
    </div>
  `,
  styles: [],
  styleUrls: ['./column-info.component.scss']
})
export class ColumnInfoComponent implements OnInit
{
    // referinta catre spreadsheet-ul curent
    private spreadsheet?: EditableSpreadsheet;

    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    public currentColIndex: number = 0;

    // informatiile coloanei curente, primita de la sevice
    public currentColInfo?: ColumnInfo;

    public varName: string = ' ';
    public dataType: string = ' ';
    public genMethod: string = ' ';

    public availableDataTypes: string[] = Object.values(ColumnType);
    public availableGenMethods: string[] = Object.values(GeneratingMethod);

    constructor(protected spreadsheetService: SpreadsheetService)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();
    }


    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                            {
                                this.spreadsheet = spreadsheet;
                                this.currentColIndex = spreadsheet.currentOnFocusCol;
                                this.currentColInfo = spreadsheet.columnInfos[this.currentColIndex];
                                this.varName = this.currentColInfo?.varName;
                            }
                        );
    }

    someMethod(selection: string): void
    {
        console.log('selection: ' + selection);
    }
}
