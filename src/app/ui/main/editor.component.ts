import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-editor',
    template: `
    <div class="editor-main-ui">
        <app-main-toolbar id="main-toolbar"></app-main-toolbar>
        <app-formula-editor id="formula-editor"></app-formula-editor>

        <div id="center-ui">
            <as-split unit="percent" direction="horizontal">
                <as-split-area [size]="85">
                    <app-spreadsheet></app-spreadsheet>
                </as-split-area>

                <as-split-area [size]="15">
                    <app-chart-panel></app-chart-panel>
                </as-split-area>
            </as-split>
        </div>
        
        <app-status-bar id="status-bar"></app-status-bar>
    </div>
    `,
    styles: [],
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit
{
    constructor() { }

    ngOnInit(): void { }

}
