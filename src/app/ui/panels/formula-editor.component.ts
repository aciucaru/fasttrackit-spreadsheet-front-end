import { Component, OnInit, ViewChild } from '@angular/core';

import { ColumnInfo, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-formula-editor',
    template: `
    <div class="formula-editor-container">
        <div id="col-var-name-value">{{this.currentColVarNameString}}</div>
        <div>=</div>

        <textarea id="code-editor" [(ngModel)]="formulaCode" (input)="onCodeChanged($event)"></textarea>
    </div>
    `,
    styles: [],
    styleUrls: ['./formula-editor.component.scss']
})
export class FormulaEditorComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    protected currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    protected currentColInfo?: ColumnInfo;

    protected currentColVarNameString: string = '';
    protected isGeneratedByFormula: boolean = false;

    protected formulaCode: string = '';

    // referinta catre spreadsheet-ul curent
    // protected spreadsheet?: EditableSpreadsheet;

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
                                this.currentColVarNameString = this.currentColInfo.varName;
                                
                                if(this.currentColInfo.genMethod === GeneratingMethod.FROM_FORMULA)
                                    this.isGeneratedByFormula = true;
                                
                                if(this.currentColInfo.genMethod === GeneratingMethod.FROM_USER_INPUT)
                                    this.isGeneratedByFormula = false;

                                // this.codeModel.value = this.currentColInfo.formula;
                            }
                        }
                    );
    }

    // pentru editorul de cod
    onCodeChanged(event: any): void
    {
        this.spreadsheetService.setColumnFormula(this.formulaCode);
        console.log(`FormulaEditorComponent: onCodeChanged(${this.formulaCode})`);
    }
}
