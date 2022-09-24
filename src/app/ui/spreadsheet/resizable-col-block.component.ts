import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-resizable-col-block',
  template: `
    <div class="resizable-col-block"></div>
  `,
    styles: [],
    styleUrls: ['./resizable-blocks.scss']
})
export class ResizableColBlockComponent implements OnInit, OnDestroy
{
    width: number = 0; // latimea acestui component
    height: number = 0; // inaltime acestui component
    resizeObserver?: ResizeObserver; // observator al evenimetelor de tip resize ce au loc asupra acestui component
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
            .subscribe((spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }
}
