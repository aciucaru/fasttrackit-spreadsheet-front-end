import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { EditableSpreadsheet } from 'src/app/model/spreadsheet';
import { SpreadsheetService } from 'src/app/service/spreadsheet.service';
import { DocumentBrowserComponent } from '../main/document-browser.component';

@Component({
    selector: 'app-file-group',
    template: `
    <div class="group-container">
        <div class="file-group">
            <button id="new-file" class="toolbar-button" title="New file"
                (click)="spreadsheetService.newSpreadsheet()">
                <img src="assets/icons/dbnewtable.png" alt="New file">
            </button>

            <button id="open-file" class="toolbar-button" title="Open file"
                (click)="this.openDialog()">
                <img src="assets/icons/open.png" alt="Open file">
            </button>

            <button id="save-file" class="toolbar-button" title="Save file"
                (click)="spreadsheetService.saveCurrentSpreadsheetToServer()">
                <img src="assets/icons/save.png" alt="Save file">
            </button>

            <div id="new-file-label">New</div>
            <div id="open-file-label">Open</div>
            <div id="save-file-label">Save</div>

            <div class="group-label">File</div>
        </div>
    </div>
    `,
    styles: [],
    styleUrls:
    [
        './toolbar-general.scss',
        './file-group.scss'
    ]
})
export class FileGroupComponent implements OnInit
{
    spreadsheet?: EditableSpreadsheet;
    spreadsheetId: string = '';
    
    constructor(protected spreadsheetService: SpreadsheetService, 
                            public dialog: MatDialog) { }

    ngOnInit(): void { this.subscribeAsSpreadsheetObserver(); }

    subscribeAsSpreadsheetObserver(): void
    {
        this.spreadsheetService
            .getSpreadsheetSubject()
            .subscribe( (spreadsheet: EditableSpreadsheet) =>
                {
                    this.spreadsheet = spreadsheet;
                });
    }

    // protected navigateToBrowsePage(): void
    // {
    //     this.router.navigateByUrl('/editor');
    // }

    protected openDialog(): void
    {
        const dialogRef = this.dialog.open(DocumentBrowserComponent,
            {
                width: '500px',
                height: '400px',
                disableClose: true
            });
      
          dialogRef.afterClosed()
                    .subscribe(result =>
                                {
                                    console.log('The dialog was closed');
                                    this.spreadsheetId = result;
                                });
    }
}
