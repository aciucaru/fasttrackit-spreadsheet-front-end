import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-column-editor',
    template: `
        <div class="column-editor">Colum editor</div>
    `,
    styles: [],
    styleUrls: ['./column-editor.component.scss']
})
export class ColumnEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
