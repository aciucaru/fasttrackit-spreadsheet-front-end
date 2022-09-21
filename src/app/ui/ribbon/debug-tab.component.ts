import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-debug-tab',
  template: `
    <div class="tab-group-container">
        <div class="tab-group">
            <button (click)="spreadsheetService.logSpreadsheetValues()">Log table values</button>
        <div>
    </div>
  `,
  styles: [],
  styleUrls: ['./ribbon-general.scss', './debug-tab.component.scss']
})
export class DebugTabComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                });
    }
}
