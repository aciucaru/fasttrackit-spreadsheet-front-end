import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-resizable-row-block',
  template: `
    <div class="resizable-row-block"></div>
  `,
    styles: [],
    styleUrls: ['./resizable-blocks.scss']
})
export class ResizableRowBlockComponent implements OnInit
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
                                { this.height = entries[0].contentRect.height; }
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