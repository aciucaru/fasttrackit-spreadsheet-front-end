import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-row-index',
  template: `
    <div class="resizable-row-block">
        <a class="row-index">{{this.rowIndex}}</a>
    </div>
  `,
    styles: [],
    styleUrls: ['./resizable-blocks.scss']
})
export class RowIndexComponent implements OnInit, OnDestroy
{
    @Input() rowIndex: number = -1; // indexul liniei curente, primit de la container
    width: number = 0; // latimea acestui component
    height: number = 0; // inaltimea acestui component
    resizeObserver?: ResizeObserver; // observator al evenimetelor de tip resize ce au loc asupra acestui component
    private spreadsheet?: EditableSpreadsheet;
    
    constructor(protected spreadsheetService: SpreadsheetService, private host: ElementRef, private zone: NgZone)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();

        this.resizeObserver =
            new ResizeObserver( entries => 
                {
                    this.zone.run( () =>
                            {
                                for(let entry of entries)
                                {
                                    this.height = entries[0].contentRect.height;
                                    this.spreadsheetService.setRowHeight(this.rowIndex, this.height);
                                    console.log('data row resize');
                                    // this.setNewHeight(entries[0].contentRect.height);
                                }
                            }
                        );
                }
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
            .subscribe((spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }

    setNewHeight(height: number): void
    {
        this.spreadsheetService.setRowHeight(this.rowIndex, this.height);
        console.log('data row resize');
    }
}
