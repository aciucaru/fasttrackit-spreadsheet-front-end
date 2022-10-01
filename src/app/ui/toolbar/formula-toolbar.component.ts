import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';


@Component({
  selector: 'app-formula-toolbar',
  template: `
    <div class="formula-toolbar">
        <button id="apply-formula" class="formula-toolbar-button" title="Apply formula"
        (click)="spreadsheetService.calculateColumnValues()">
            <img src="assets/icons/toggleformula.png" alt="Apply formula">
        </button>
    </div>
  `,
  styles: [],
  styleUrls:
  [
      './toolbar-general.scss',
      './formula-toolbar.scss'
  ]
})
export class FormulaToolbarComponent implements OnInit
{
    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la service
    public currentColIndex: number = -1;

    // informatiile coloanei curente, primita de la sevice
    public currentColInfo?: ColumnInfo;
    
    // referinta catre spreadsheet-ul curent
    spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                    this.currentColIndex = spreadsheet.currentOnFocusCol;
                    this.currentColInfo = spreadsheet.columnInfos[this.currentColIndex];
                });
    }
}
