import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
// import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularSplitModule } from 'angular-split';

import { DataCellComponent } from './ui/spreadsheet/data-cell.component';
import { SpreadsheetComponent } from './ui/spreadsheet/spreadsheet.component';
import { MainToolbarComponent } from './ui/toolbar/main-toolbar.component';
import { NumericCellComponent } from './ui/spreadsheet/numeric-cell.component';
import { StringCellComponent } from './ui/spreadsheet/string-cell.component';
import { BoolCellComponent } from './ui/spreadsheet/bool-cell.component';
import { RowIndexComponent } from './ui/spreadsheet/row-index.component';
import { VarNameCellComponent } from './ui/spreadsheet/var-name-cell.component';
import { TitleCellComponent } from './ui/spreadsheet/title-cell.component';
import { EditorComponent } from './ui/main/editor.component';
import { StatusBarComponent } from './ui/panels/status-bar.component';
import { FormulaEditorComponent } from './ui/panels/formula-editor.component';
import { ColTypeSelectComponent } from './ui/controls/col-type-select.component';
import { GenMethodSelectComponent } from './ui/controls/gen-method-select.component';
import { RowsAndColsGroupComponent } from './ui/toolbar/rows-and-cols-group.component';
import { ColumnGroupComponent } from './ui/toolbar/column-group.component';
import { FormulaGroupComponent } from './ui/toolbar/formula-group.component';
import { DebugGroupComponent } from './ui/toolbar/debug-group.component';
import { ChartGroupComponent } from './ui/toolbar/chart-group.component';
import { BarChartComponent } from './ui/chart/bar-chart.component';
import { ChartPanelComponent } from './ui/panels/chart-panel.component';
import { ChartSettingsComponent } from './ui/chart/bar-chart-settings.component';
import { XYChartComponent } from './ui/chart/xy-chart.component';
import { XyChartSettingsComponent } from './ui/chart/xy-chart-settings.component';
import { FileGroupComponent } from './ui/toolbar/file-group.component';
import { DocumentBrowserComponent } from './ui/main/document-browser.component';

const routes: Routes =
[
    { path: 'editor', component: EditorComponent },
    { path: 'browse', component: DocumentBrowserComponent }
];

@NgModule({
    declarations:
    [
        AppComponent,
        DataCellComponent,
        SpreadsheetComponent,
        MainToolbarComponent,
        NumericCellComponent,
        StringCellComponent,
        BoolCellComponent,
        RowIndexComponent,
        VarNameCellComponent,
        TitleCellComponent,
        EditorComponent,
        StatusBarComponent,
        FormulaEditorComponent,
        ColTypeSelectComponent,
        GenMethodSelectComponent,
        RowsAndColsGroupComponent,
        ColumnGroupComponent,
        FormulaGroupComponent,
        DebugGroupComponent,
        ChartGroupComponent,
        BarChartComponent,
        ChartPanelComponent,
        ChartSettingsComponent,
        XYChartComponent,
        XyChartSettingsComponent,
        FileGroupComponent,
        DocumentBrowserComponent
    ],
    imports:
    [
        // NgModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,

        RouterModule.forRoot(routes),

        NoopAnimationsModule,
        FormsModule,
        // CdkTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatTabsModule,
        MatSelectModule,

        AngularSplitModule
    ],
    exports: [RouterModule],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
