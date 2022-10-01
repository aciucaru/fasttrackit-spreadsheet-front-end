import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-formula-editor',
    template: `
    <as-split>
        <as-split-area [size]="60">
            <!-- <div class="formula-editor">Formula editor</div>    -->
            <ngs-code-editor
                [theme]="theme"
                [codeModel]="codeModel"
                [options]="options"
                (valueChanged)="onCodeChanged($event)">
            </ngs-code-editor>
        </as-split-area>

        <as-split-area [size]="40">
            <div class="formula-errors">Formula errors</div>
        </as-split-area>
    </as-split>
    `,
    styles: []
})
export class FormulaEditorComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    public currentColIndex: number = 0;

    // informatiile coloanei curente, primita de la sevice
    public currentColInfo?: ColumnInfo;

    // referinta catre spreadsheet-ul curent
    private spreadsheet?: EditableSpreadsheet;

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
                            }
                        );
    }


    // pentru editorul de cod:
    theme = 'vs';

    codeModel: CodeModel =
    {
        language: 'javascript',
        uri: 'main.js',
        value: ''
        // dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor']
      };

    // CodeModel
    // {
    //     language: string;
    //     value: string;
    //     uri: string;
    //     dependencies?: Array<string>;
    //     schemas?: Array<{ uri: string; schema: Object; }>;
    // }
  
    options =
    {
      contextmenu: true,
      minimap: { enabled: false }
    };
  
    onCodeChanged(value: any)
    {
      console.log('CODE', value);
    }
}
