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
        <div class="col-info-value">{{this.currentColVarNameString}}</div>

        <div class="col-info-label">Data type:</div>
        <select #typeSelect class="col-info-select" [value]="currentColDataTypeString"
            (change)="changeColumnType(typeSelect.value)">
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="bool">bool</option>
        </select>

        <div class="col-info-label">Generation method:</div>
        <select #genMethodSelect class="col-info-select" [value]="currentColGenMethodString"
            (change)="changeColumnGenMethod(genMethodSelect.value)">
            <option value="user input">user input</option>
            <option value="formula">formula</option>
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

    // valorile coloanei curente, se schimba de fiecare data cand este selectata alta coloana
    protected currentColVarNameString: string = '';
    protected currentColDataTypeString: string = 'string';
    protected currentColGenMethodString: string = 'user input';

    protected availableDataTypes: string[] = ['string', 'number', 'bool'];
    protected availableGenMethods: string[] = ['user input', 'formula'];

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

                            if(this.currentColIndex >= 0)
                            {
                                this.currentColInfo = spreadsheet.columnInfos[this.currentColIndex];
                                this.currentColVarNameString = this.currentColInfo.varName;
                                this.setDisplayedDataType(this.currentColInfo);
                                this.setDisplayedGenMethod(this.currentColInfo);
                            }
                        }
                    );
    }

    setDisplayedDataType(colInfo: ColumnInfo): void
    {
        switch(colInfo.colType)
        {
            case ColumnType.STRING:
                this.currentColDataTypeString = 'string';
                break;

            case ColumnType.NUMBER:
                this.currentColDataTypeString = 'number';
                break;
            
            case ColumnType.BOOL:
                this.currentColDataTypeString = 'bool';
                break;
        }
    }

    setDisplayedGenMethod(colInfo: ColumnInfo): void
    {
        switch(colInfo.genMethod)
        {
            case GeneratingMethod.FROM_USER_INPUT:
                this.currentColGenMethodString= 'user input';
                break;

            case GeneratingMethod.FROM_FORMULA:
                this.currentColGenMethodString = 'formula';
                break;
        }
    }

    changeColumnType(selection: string): void
    {
        switch(selection)
        {
            case 'bool':
                this.spreadsheetService.changeCurrentColumType(ColumnType.BOOL);
                break;

            case 'number':
                this.spreadsheetService.changeCurrentColumType(ColumnType.NUMBER);
                break;

            case 'string':
                this.spreadsheetService.changeCurrentColumType(ColumnType.STRING);
                break;
        }

        console.log(`ColumnInfoComponent: changeColumnType(${selection})`);
    }

    changeColumnGenMethod(selection: string): void
    {
        switch(selection)
        {
            case 'user input':
                this.spreadsheetService.changeCurrentColumGenMethod(GeneratingMethod.FROM_USER_INPUT);
                break;

            case 'formula':
                this.spreadsheetService.changeCurrentColumGenMethod(GeneratingMethod.FROM_FORMULA);
                break;
        }

        console.log(`ColumnInfoComponent: changeColumnGenMethod(${selection})`);
    }
}
