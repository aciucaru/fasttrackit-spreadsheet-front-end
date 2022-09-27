import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main-ui',
    template: `
    <div class="main-ui">
        <app-main-toolbar id="main-toolbar"></app-main-toolbar>
        <app-navigator id="navigator"></app-navigator>
        <app-spreadsheet id="spreadsheet"></app-spreadsheet>
        <app-column-editor id="column-editor"></app-column-editor>
    <div>

    <!-- <app-main-toolbar></app-main-toolbar>
    <div class="horizontal-splitter">
        <div class="left-split-section">
            <app-navigator></app-navigator>
        </div>
        <div class="right-split-section">
            <div class="vertical-splitter"></div>
                <div class="top-split-section">
                    <app-spreadsheet></app-spreadsheet>
                </div>
                <div class="bottom-split-section">
                    <app-column-editor></app-column-editor>
                </div>
        </div>
    </div> -->
    `,
    styles: [],
    styleUrls: ['./main-ui.component.scss']
})
export class MainUiComponent implements OnInit
{

    constructor() { }

    ngOnInit(): void { }

}
