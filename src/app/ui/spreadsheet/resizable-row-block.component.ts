import { Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-resizable-row-block',
  template: `
    <div class="resizable-row-block">
        <a class="row-index">{{this.rowIndex}}</a>
    </div>
  `,
    styles: [],
    styleUrls: ['./resizable-blocks.scss']
})
export class ResizableRowBlockComponent implements OnInit
{
    @Input() rowIndex?: string // indexul liniei curente, primit de la container
    width: number = 0; // latimea acestui component
    height: number = 0; // inaltime acestui component
    observer?: ResizeObserver; // observator al evenimetelor de tip resize ce au loc asupra acestui component

    constructor(private host: ElementRef, private zone: NgZone)
    { }

    ngOnInit(): void
    {
        this.observer = new ResizeObserver( entries => 
                                { this.width = entries[0].contentRect.width; }
                            );
        this.observer.observe(this.host.nativeElement);
    }

    ngOnDestroy(): void
    {
        this.observer?.unobserve(this.host.nativeElement);
    }
}