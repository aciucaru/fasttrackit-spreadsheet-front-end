import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';


import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CellComponent } from './ui/spreadsheet/cell.component';
import { SpreadsheetComponent } from './ui/spreadsheet/spreadsheet.component';
import { RibbonComponent } from './ui/ribbon/ribbon.component';
import { MainTabComponent } from './ui/ribbon/main-tab.component';
import { DebugTabComponent } from './ui/ribbon/debug-tab.component';
import { NumericCellComponent } from './ui/spreadsheet/numeric-cell.component';

@NgModule({
    declarations:
    [
        AppComponent,
        CellComponent,
        SpreadsheetComponent,
        RibbonComponent,
        MainTabComponent,
        DebugTabComponent,
        NumericCellComponent
    ],
    imports:
    [
        // NgModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,

        NoopAnimationsModule,
        FormsModule,
        // CdkTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatTabsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
