import { Component, OnInit } from '@angular/core';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
    selector: 'app-main-toolbar',
    template: `
    <div class="toolbar">
        <app-file-group></app-file-group>
        <app-rows-and-cols-group></app-rows-and-cols-group>
        <app-column-group></app-column-group>
        <app-formula-group></app-formula-group>
        <app-chart-group></app-chart-group>
        <app-debug-group></app-debug-group>
    </div>
    `,
    styles: [],
    styleUrls: ['./toolbar-general.scss']
})
export class MainToolbarComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    
    constructor() { }

    ngOnInit(): void
    {
        // this.subscribeAsSpreadsheetObserver();
    }

    // subscribeAsSpreadsheetObserver(): void
    // {
    //     this.spreadsheetService
    //         .getSpreadsheetSubject()
    //         .subscribe( (spreadsheet: EditableSpreadsheet) =>
    //             {
    //                 this.spreadsheet = spreadsheet;
    //             });
    // }
}
