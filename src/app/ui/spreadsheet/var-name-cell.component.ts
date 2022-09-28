import { Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ColumnInfo } from 'src/app/model/column';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

// [style.width.px]="spreadsheetService.getCellWitdh(currentColIndex)"
@Component({
  selector: 'app-var-name-cell',
  template: `
    <div #varNameCell class="resizable-container"
        (click)="spreadsheetService.setSelectedVarNameCell(currentColIndex)"
        [style.width.px]="spreadsheetService.getCellWitdh(currentColIndex)"
        [style.height.px]="spreadsheetService.getVarNameRowHeight()"
        (window:mouseup)="setStatus($event, false)">

        <div class="text-content">
            <a class="col-var-name-text">{{currentColInfo?.varName}}</a>
        </div>
        <div class="resize-handle" (mousedown)="setStatus($event, true)"></div>
    </div>`,
  styles: [],
  styleUrls: ['./var-name-cell.component.scss']
})
export class VarNameCellComponent implements OnInit
{
    /* Component ce afiseaza numele de variabila al unei coloane.
       Informatiile complete despre coloana si indexul coloanei sunt primite
       ca input de la parinte. */

    // informatiile coloanei curente, primita de la parine
    @Input() public currentColInfo?: ColumnInfo;

    // indexul coloanei curente din care face parte acest component, 
    // indexul este primit de la 'buclele for' ale parintelui
    @Input() public currentColIndex: number = -1;

    // referinta catre spreadsheet-ul curent
    private spreadsheet?: EditableSpreadsheet;

    @ViewChild("varNameCell") public varNameCell?: ElementRef;

    public isBeingResized: boolean = false;

    public containerWidth: number = 100;
    public containerHeight: number = 25;
    public containerLeft: number = 0;
    public containerTop: number = 0;

    private boxPosition: { left: number, top: number } = { left: 0, top: 0 };
    private containerPos: { left: number, top: number, right: number, bottom: number } =
        { left: 0, top: 0, right: 0, bottom: 0 };
    public mouse: {x: number, y: number} = { x: 0, y: 0 };

    constructor(protected spreadsheetService: SpreadsheetService, private host: ElementRef, private zone: NgZone)
    { }

    ngOnInit(): void
    {
        this.subscribeAsSpreadsheetObserver();
    }

    ngAfterViewInit()
    {
        this.loadBox();

        // load container
        const left = this.boxPosition.left - this.containerLeft;
        const top = this.boxPosition.top - this.containerTop;
        const right = left + 100;
        const bottom = top + 25;
        this.containerPos = { left, top, right, bottom };
    }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                            { this.spreadsheet = spreadsheet; }
                        );
    }

    private loadBox()
    {
        const {left, top} = this.varNameCell?.nativeElement.getBoundingClientRect();
        this.boxPosition = {left, top};
    }
    
    setStatus(event: MouseEvent, isBeingResized: boolean)
    {
        if(isBeingResized === true)
            event.stopPropagation();
        else
            this.loadBox();

        this.isBeingResized = isBeingResized;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent)
    {
        this.mouse = { x: event.clientX, y: event.clientY };

        if(this.isBeingResized === true)
            this.resize();
    }
    
    private resize()
    {
        if(this.containerPos.left < this.mouse.x-10 && this.mouse.x < 1000)
        {
            if(this.mouse.x > this.boxPosition.left)
            {
                this.containerWidth = this.mouse.x - this.boxPosition.left
                this.spreadsheetService.setColumWidth(this.currentColIndex, this.containerWidth);
                console.log('redimensionare coloana');
            }
            else
                this.containerWidth = 0;
        }
    }
}
