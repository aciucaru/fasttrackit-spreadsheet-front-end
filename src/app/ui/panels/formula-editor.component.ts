import { Component, OnInit, ViewChild } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { ColumnInfo, GeneratingMethod } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-formula-editor',
    template: `
    <app-formula-toolbar></app-formula-toolbar>
    <as-split unit="percent" direction="horizontal">
        <as-split-area [size]="60">
            <ngs-code-editor #formulaEditor *ngIf="isGeneratedByFormula"
                [theme]="'vs'"
                [codeModel]="codeModel"
                [options]="options"
                (valueChanged)="onCodeChanged($event)">
            </ngs-code-editor>

            <div *ngIf="!isGeneratedByFormula">
                Formula editor (disabled)
            </div>
        </as-split-area>

        <as-split-area [size]="40">
            <div #formulaErrors class="formula-errors"
                *ngIf="isGeneratedByFormula">
                Formula errors
            </div>
            <div *ngIf="!isGeneratedByFormula">
                Formula errors (disabled)
            </div>
        </as-split-area>
    </as-split>
    `,
    styles: []
})
export class FormulaEditorComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    protected currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    protected currentColInfo?: ColumnInfo;

    protected isGeneratedByFormula: boolean = false;

    // referinta catre spreadsheet-ul curent
    protected spreadsheet?: EditableSpreadsheet;

    @ViewChild('formulaEditor') formulaEditor: any;
    @ViewChild('formulaErrors') formulaErrors: any;

    constructor(protected spreadsheetService: SpreadsheetService)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();
    }

    ngAfterViewInit(): void
    {
        // daca celulele coloanei sunt introduse de catre utilizator (nu sunt generate de formule)
        // atunci se dezactiveaza editorul de formule
        // if(this.currentColInfo?.genMethod === GeneratingMethod.FROM_USER_INPUT)
        //     this.disableFormulaEditor();
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
                                if(this.currentColInfo.genMethod === GeneratingMethod.FROM_FORMULA)
                                    this.isGeneratedByFormula = true;
                                
                                if(this.currentColInfo.genMethod === GeneratingMethod.FROM_USER_INPUT)
                                    this.isGeneratedByFormula = false;
                            }
                        }
                    );
    }

    disableFormulaEditor(): void
    {
        let nativeFormulaEditor: HTMLElement = this.formulaEditor.nativeElement;
        let nativeFormulaErrors: HTMLElement = this.formulaErrors.nativeElement;

        nativeFormulaEditor.setAttribute('disabled', 'true');
        nativeFormulaErrors.setAttribute('disabled', 'true');

        console.log('disableFormulaEditor()');
    }

    enableFormulaEditor(): void
    {
        
    }

    // pentru editorul de cod:
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
        console.log('CODE: \n', value);
    }
}
