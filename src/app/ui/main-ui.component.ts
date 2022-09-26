import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-ui',
  template: `
    <app-main-toolbar></app-main-toolbar>
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
                    <app-col-details></app-col-details>
                </div>
        </div>
    </div>
  `,
  styles: []
})
export class MainUiComponent implements OnInit
{

    constructor() { }

    ngOnInit(): void { }

}
