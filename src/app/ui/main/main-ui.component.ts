import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-ui',
    template: `
    <div class="main-ui">
        <app-main-toolbar id="main-toolbar"></app-main-toolbar>
        <app-formula-editor id="formula-editor"></app-formula-editor>

        <div id="center-ui">
            <as-split unit="percent" direction="horizontal">
                <as-split-area [size]="85">
                    <app-spreadsheet></app-spreadsheet>
                </as-split-area>

                <as-split-area [size]="15">
                    <app-navigator></app-navigator>
                </as-split-area>
            </as-split>
        </div>
        
        <app-status-bar id="status-bar"></app-status-bar>
    </div>
    `,
    styles: [],
    styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit
{
    constructor() { }

    ngOnInit(): void { }

}
