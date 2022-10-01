import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';

import { ColumnInfo, ColumnType, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-column-info',
  template: `
    <div>
        <div class="col-info-label">Column variable name:</div>
        <div class="col-info-value">{{this.varName}}</div>

        <div class="col-info-label">Data type:</div>
        <select #typeSelect class="col-info-select"
            (change)="changeColumnType(typeSelect.value)">
            <option *ngFor="let currentType of availableDataTypes">
                {{currentType}}
            </option>
        </select>

        <div class="col-info-label">Generation method:</div>
        <select #genMethodSelect class="col-info-select"
            (change)="changeColumnGenMethod(genMethodSelect.value)">
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
    protected currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    protected currentColInfo?: ColumnInfo;

    protected varName: string = ' ';

    protected availableDataTypes: string[] = Object.values(ColumnType);
    protected availableGenMethods: string[] = Object.values(GeneratingMethod);

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

    changeColumnType(selection: string): void
    {
        console.log('new type: ' + selection);
        switch(selection)
        {
            case 'BOOL':
                this.spreadsheetService.setColumType(ColumnType.BOOL);
                break;

            case 'NUMBER':
                this.spreadsheetService.setColumType(ColumnType.NUMBER);
                break;

            case 'STRING':
                this.spreadsheetService.setColumType(ColumnType.STRING);
                break;
        }
    }

    changeColumnGenMethod(selection: string): void
    {
        console.log('new gen method: ' + selection);
    }
}
