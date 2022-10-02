import { Component, OnInit } from '@angular/core';

import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-column-editor',
    template: `
    <as-split direction="horizontal">
        <as-split-area [size]="15">
            <app-column-info></app-column-info>
        </as-split-area>

        <as-split-area [size]="85">
            <app-formula-editor></app-formula-editor>
        </as-split-area>
    </as-split>
    `,
    styles: [],
    styleUrls: ['./column-editor.component.scss']
})
export class ColumnEditorComponent implements OnInit
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
}
