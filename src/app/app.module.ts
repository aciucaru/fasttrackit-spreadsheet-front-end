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
import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularSplitModule } from 'angular-split';
import { CodeEditorModule } from '@ngstack/code-editor';

import { DataCellComponent } from './ui/spreadsheet/data-cell.component';
import { SpreadsheetComponent } from './ui/spreadsheet/spreadsheet.component';
import { MainToolbarComponent } from './ui/toolbar/main-toolbar.component';
import { NumericCellComponent } from './ui/spreadsheet/numeric-cell.component';
import { StringCellComponent } from './ui/spreadsheet/string-cell.component';
import { BoolCellComponent } from './ui/spreadsheet/bool-cell.component';
import { RowIndexComponent } from './ui/spreadsheet/row-index.component';
import { VarNameCellComponent } from './ui/spreadsheet/var-name-cell.component';
import { TitleCellComponent } from './ui/spreadsheet/title-cell.component';
import { MainUiComponent } from './ui/main/main-ui.component';
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
import { ChartSettingsComponent } from './ui/chart/chart-settings.component';

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
        MainUiComponent,
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
        ChartSettingsComponent
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
        MatTabsModule,
        MatSelectModule,

        AngularSplitModule,
        CodeEditorModule.forRoot()
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
