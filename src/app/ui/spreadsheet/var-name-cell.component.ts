import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-var-name-cell',
  template: `
    <div class="resizable-col-block"
        (click)="spreadsheetService.setSelectedVarNameCell(currentColIndex)">
        <a class="col-var-name-text">{{currentColInfo?.varName}}</a>
    <div>`,
  styles: [],
  styleUrls: ['./spreadsheet.scss', './resizable-blocks.scss']
})
export class VarNameCellComponent implements OnInit
{
    /* Component ce afiseaza titlul unei coloane.
       Informatiile complete despre coloana si indexul coloanei sunt primite
       ca input de la parinte. */

    // informatiile coloanei curente, primita ca input de la parine
    // trebuie  sa fie 'public' ca sa poate fi accesat din template-ul HTML
    @Input() public currentColInfo?: ColumnInfo;

    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la 'buclele for' ale parintelui
    // trebuie  sa fie 'public' ca sa poate fi accesat din template-ul HTML
    @Input() public currentColIndex: number = -1;

    width: number = 0; // latimea acestui component
    height: number = 0; // inaltime acestui component

    resizeObserver?: ResizeObserver; // observator al evenimetelor de tip resize ce au loc asupra acestui component

    // referinta catre spreadsheet-ul curent
    private spreadsheet?: EditableSpreadsheet;

    constructor(protected spreadsheetService: SpreadsheetService, private host: ElementRef, private zone: NgZone)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();

        this.resizeObserver = new ResizeObserver( entries => 
                                { this.width = entries[0].contentRect.width; }
                            );
        this.resizeObserver.observe(this.host.nativeElement);
    }

    ngOnDestroy(): void
    {
        this.resizeObserver?.unobserve(this.host.nativeElement);
    }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }
}
