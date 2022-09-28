import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-ui',
    template: `
    <app-main-toolbar></app-main-toolbar>

    <as-split unit="percent" direction="vertical">

        <as-split-area [size]="70">
            <as-split unit="percent" direction="horizontal">
                <as-split-area [size]="20">
                    <app-navigator></app-navigator>
                </as-split-area>

                <as-split-area [size]="80">
                    <app-spreadsheet></app-spreadsheet>
                </as-split-area>
            </as-split>
        </as-split-area>

        <as-split-area [size]="30">
            <app-column-editor></app-column-editor>
        </as-split-area>

    </as-split>
    
    <app-status-bar></app-status-bar>
    `,
    styles: [],
    styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit
{

    constructor() { }

    ngOnInit(): void { }

}
