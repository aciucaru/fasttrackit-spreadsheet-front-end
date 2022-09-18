import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Spreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-ribbon',
  template: `
  <div><p>Ribbon</p></div>
    <!-- <button (click)="this.spreadsheetService.logSpreadsheetValues()">Log spreadsheet values</button>
    <button (click)="this.spreadsheetService.deleteRow()">Delete row</button> -->
  `,
  styles: []
})
export class RibbonComponent implements OnInit
{
    spreadsheet?: Spreadsheet;

    constructor(protected spreadsheetService: SpreadsheetService, private route: ActivatedRoute) { }

    ngOnInit(): void
    {
        this.spreadsheetService.getCurrentSpreadsheet()
        .subscribe(spreadsheet =>
            {
                this.spreadsheet = spreadsheet;
            });
    }

}
