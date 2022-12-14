import { Component, OnInit } from '@angular/core';

import { ColumnInfo, ColumnType, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-col-type-select',
    template: `
        <select #typeSelect class="col-info-select" [value]="currentColDataTypeString"
            (change)="changeColumnType(typeSelect.value)">
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="bool">bool</option>
        </select>
    `,
    styles: []
})
export class ColTypeSelectComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    protected currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    protected currentColInfo?: ColumnInfo;

    protected availableDataTypes: string[] = ['string', 'number', 'bool'];
    protected currentColDataTypeString: string = 'string';

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
                            // this.spreadsheet = spreadsheet;
                            this.currentColIndex = spreadsheet.currentOnFocusCol;

                            if(this.currentColIndex >= 0)
                            {
                                this.currentColInfo = spreadsheet.columnInfos[this.currentColIndex];
                                // this.currentColVarNameString = this.currentColInfo.varName;
                                this.setDisplayedDataType(this.currentColInfo);
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
}
