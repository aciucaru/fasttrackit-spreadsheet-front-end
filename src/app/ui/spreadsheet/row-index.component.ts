import { Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';

@Component({
  selector: 'app-row-index',
  template: `
    <!-- <div #rowIndexCell class="resizable-container" 
      [style.width.px]="containerWidth" 
      [style.height.px]="containerHeight" 
      [class.active]="isBeingResized"
      (window:mouseup)="setStatus($event, false)">

        <div class="text-content">
            <a class="row-index">{{this.rowIndex}}</a>
        </div>
        <div class="resize-handle" (mousedown)="setStatus($event, true)"></div>
    </div> -->

    <div #rowIndexCell class="resizable-container" 
      [style.width.px]="containerWidth" 
      [style.height.px]="containerHeight" 
      [class.active]="isBeingResized"
      (window:mouseup)="setStatus($event, false)">

        <a class="row-index">{{this.rowIndex}}</a>

    </div>
  `,
    styles: [],
    styleUrls: ['./row-index.component.scss']
})
export class RowIndexComponent implements OnInit
{
    @Input() rowIndex: number = -1; // indexul liniei curente, primit de la container
    // width: number = 0; // latimea acestui component
    // height: number = 0; // inaltimea acestui component
    private spreadsheet?: EditableSpreadsheet;

    @ViewChild("rowIndexCell") public rowIndexCell?: ElementRef;

    public isBeingResized: boolean = false;

    public containerWidth: number = 40;
    public containerHeight: number = 30;
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
        this.loadContainer();
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
        // this.spreadsheetService.setRowHeight(this.rowIndex, this.containerHeight);
        console.log('data row resize');
    }

    private loadBox()
    {
        const {left, top} = this.rowIndexCell?.nativeElement.getBoundingClientRect();
        this.boxPosition = {left, top};
    }

    private loadContainer()
    {
        const left = this.boxPosition.left - this.containerLeft;
        const top = this.boxPosition.top - this.containerTop;
        const right = left + 40;
        const bottom = top + 30;
        this.containerPos = { left, top, right, bottom };
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
        if(this.containerPos.top < this.mouse.y-10 && this.mouse.y < 1000)
        {
            if(this.mouse.y > this.boxPosition.top)
            {
                this.containerHeight = this.mouse.y - this.boxPosition.top;
                // this.spreadsheetService.setRowHeight(this.rowIndex, this.containerHeight);
                console.log('redimensionare linie');
            }
            else
                this.containerHeight = 0;
        }
    }
}
