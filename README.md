# Spreadsheet editor front-end
This is a homework project that recreates an website similar to Google Sheets, e.g. an online spreadsheet editor. This is the front-end part of the website, which manages the actual editing of a spreadsheet and the communication with the back-end.

- In order to make the GUI react immediately to the changes made to the data (e.g. reactive programming), the RxJS library is used.
- The data is stored in a SpreadsheetService which has RxJS observable properties inside
- The spreadsheet data can only be modified trough the SpreadsheetService, trough 'setters'
- When a 'setter' has completed, it also emits e new value for the specific observable, and so, all interested subscribers of that observable get the new value, without using 'store' libraries
- In this way, the GUI responds immediately to any changes, without the need for clumsy 'store' libraries

# Technologies used
- TypeScript
- Angular
- RxJS
- HTML, CSS
- Math.js - for evaluating formulas

The icons are Colibre icons from LibreOffice.
![screenshot](spreadsheet.png)

