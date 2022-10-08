import { Component, OnInit } from '@angular/core';

import { ColumnInfo, ColumnType, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-gen-method-select',
    template: `
         <select #genMethodSelect class="col-info-select" [value]="currentColGenMethodString"
            (change)="changeColumnGenMethod(genMethodSelect.value)">
            <option value="user input">user input</option>
            <option value="formula">formula</option>
        </select>
    `,
    styles: []
})
export class GenMethodSelectComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    protected currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    protected currentColInfo?: ColumnInfo;

    protected availableGenMethods: string[] = ['user input', 'formula'];
    protected currentColGenMethodString: string = 'user input';

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
                                this.setDisplayedGenMethod(this.currentColInfo);
                            }
                        }
                    );
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
