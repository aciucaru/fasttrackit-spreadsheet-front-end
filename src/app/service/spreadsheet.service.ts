import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import { Cell } from '../model/cell';
import { CellStyle } from '../model/cell-style'; 
import { ColumnType } from '../model/column-type';
import { Spreadsheet } from '../model/spreadsheet';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetService
{
    private oneSpreadsheetUrl = 'http://localhost:8080/sheets/one';
    httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    constructor(private httpClient: HttpClient) { }

    getOneTable(): Observable<Spreadsheet>
    {
        return this.httpClient.get<Spreadsheet>(this.oneSpreadsheetUrl)
                                .pipe(
                                    tap(_ => console.log(`tabel luat de pe server`)),
                                    catchError(this.handleError<Spreadsheet>(`getOneTable()`))
                                );
    }

    private handleError<T>(operation = 'operation', result?: T)
    {
        return (error: any): Observable<T> =>
        {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        }
    }

    private dummySpreadsheet(): Observable<Spreadsheet>
    {
        const defaultCellStyle: CellStyle =
        {
            hasBGColor: false,
            rgbBGColor: '#ffffff',

            hasFGColor: false,
            rgbFGColor: '#dd0000',

            hasFont: false,
            font: "Arial, sans-serif",

            isBold: false,
            isItalic: false,

            hasBorderColor: false,
            borderColor: '#000000',

            hasBorderThickness: false,
            borderThickness: 1
        };

        const spreadsheet: Spreadsheet =
        {
            name: 'Test table',
            columnInfos:
            [
                { name: 'Numbers', cellType: ColumnType.NUMBER, varName: 'number_col' },
                { name: 'Strings', cellType: ColumnType.STRING, varName: 'string_col' },
                { name: 'Booleans', cellType: ColumnType.BOOL, varName: 'bool_col' }
            ],
            rows:
            [
                {
                    cells:
                        [
                            {
                                value: '0',
                                style: defaultCellStyle
                            },
                            {
                                value: 'a',
                                style: defaultCellStyle
                            },
                            {
                                value: 'true',
                                style: defaultCellStyle
                            }
                        ]
                },
                
                {
                    cells:
                    [
                        
                        {
                            value: '1',
                            style: defaultCellStyle
                        },
                        {
                            value: 'b',
                            style: defaultCellStyle
                        },
                        {
                            value: 'false',
                            style: defaultCellStyle
                        }
                    ]
                },
                    
                {
                    cells:
                    [
                        {
                            value: '2',
                            style: defaultCellStyle
                        },
                        {
                            value: 'c',
                            style: defaultCellStyle
                        },
                        {
                            value: 'true',
                            style: defaultCellStyle
                        }
                    ]
                },
                
                {
                    cells:
                    [
                        
                        {
                            value: '3',
                            style: defaultCellStyle
                        },
                        {
                            value: 'd',
                            style: defaultCellStyle
                        },
                        {
                            value: 'true',
                            style: defaultCellStyle
                        }
                    ]
                },
                
                {
                    cells:
                    [    
                        {
                            value: '4',
                            style: defaultCellStyle
                        },
                        {
                            value: 'e',
                            style: defaultCellStyle
                        },
                        {
                            value: 'false',
                            style: defaultCellStyle
                        }
                    ]
                }
            ]
        };

        return of(spreadsheet);
    }
}
