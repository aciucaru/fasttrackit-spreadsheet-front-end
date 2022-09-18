import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Cell } from '../model/cell';

@Component({
  selector: 'app-cell',
  template:`
    <!-- <div [ngStyle]="{backgroundColor: cell?.style?.rgbBGColor}"> -->
    <div [style.background-color]="cell?.style?.rgbBGColor"
        [style.color]="cell?.style?.rgbFGColor"
        [style.font-family]="cell?.style?.font">
        <!-- <p>{{cell?.value}}</p> -->
        <input type="text">
    </div>
  `,
  styles: []
})
export class CellComponent implements OnInit
{
    @Input() cell?: Cell;

    constructor() { }  

    ngOnInit(): void {  }

    onKeypressEvent(event: any)
    {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar))
        {
            // invalid character, prevent input
            event.preventDefault();
        }
        console.log(event.target.value);
    }
}
