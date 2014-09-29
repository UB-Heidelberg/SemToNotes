// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Table editing support.
***REMOVED*** This file provides the class goog.editor.Table and two
***REMOVED*** supporting classes, goog.editor.TableRow and
***REMOVED*** goog.editor.TableCell. Together these provide support for
***REMOVED*** high level table modifications: Adding and deleting rows and columns,
***REMOVED*** and merging and splitting cells.
***REMOVED***
***REMOVED*** @supported IE6+, WebKit 525+, Firefox 2+.
***REMOVED***

goog.provide('goog.editor.Table');
goog.provide('goog.editor.TableCell');
goog.provide('goog.editor.TableRow');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.string.Unicode');
goog.require('goog.style');



***REMOVED***
***REMOVED*** Class providing high level table editing functions.
***REMOVED*** @param {Element} node Element that is a table or descendant of a table.
***REMOVED***
***REMOVED***
goog.editor.Table = function(node) {
  this.element = goog.dom.getAncestorByTagNameAndClass(node,
      goog.dom.TagName.TABLE);
  if (!this.element) {
    this.logger_.severe(
        "Can't create Table based on a node " +
        "that isn't a table, or descended from a table.");
  }
  this.dom_ = goog.dom.getDomHelper(this.element);
  this.refresh();
***REMOVED***


***REMOVED***
***REMOVED*** Logger object for debugging and error messages.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.editor.Table.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.editor.Table');


***REMOVED***
***REMOVED*** Walks the dom structure of this object's table element and populates
***REMOVED*** this.rows with goog.editor.TableRow objects. This is done initially
***REMOVED*** to populate the internal data structures, and also after each time the
***REMOVED*** DOM structure is modified. Currently this means that the all existing
***REMOVED*** information is discarded and re-read from the DOM.
***REMOVED***
// TODO(user): support partial refresh to save cost of full update
// every time there is a change to the DOM.
goog.editor.Table.prototype.refresh = function() {
  var rows = this.rows = [];
  var tbody = this.element.getElementsByTagName(goog.dom.TagName.TBODY)[0];
  if (!tbody) {
    return;
  }
  var trs = [];
  for (var child = tbody.firstChild; child; child = child.nextSibling) {
    if (child.nodeName == goog.dom.TagName.TR) {
      trs.push(child);
    }
  }

  for (var rowNum = 0, tr; tr = trs[rowNum]; rowNum++) {
    var existingRow = rows[rowNum];
    var tds = goog.editor.Table.getChildCellElements(tr);
    var columnNum = 0;
    // A note on cellNum vs. columnNum: A cell is a td/th element. Cells may
    // use colspan/rowspan to extend over multiple rows/columns. cellNum
    // is the dom element number, columnNum is the logical column number.
    for (var cellNum = 0, td; td = tds[cellNum]; cellNum++) {
      // If there's already a cell extending into this column
      // (due to that cell's colspan/rowspan), increment the column counter.
      while (existingRow && existingRow.columns[columnNum]) {
        columnNum++;
      }
      var cell = new goog.editor.TableCell(td, rowNum, columnNum);
      // Place this cell in every row and column into which it extends.
      for (var i = 0; i < cell.rowSpan; i++) {
        var cellRowNum = rowNum + i;
        // Create TableRow objects in this.rows as needed.
        var cellRow = rows[cellRowNum];
        if (!cellRow) {
          // TODO(user): try to avoid second trs[] lookup.
          rows.push(
              cellRow = new goog.editor.TableRow(trs[cellRowNum], cellRowNum));
        }
        // Extend length of column array to make room for this cell.
        var minimumColumnLength = columnNum + cell.colSpan;
        if (cellRow.columns.length < minimumColumnLength) {
          cellRow.columns.length = minimumColumnLength;
        }
        for (var j = 0; j < cell.colSpan; j++) {
          var cellColumnNum = columnNum + j;
          cellRow.columns[cellColumnNum] = cell;
        }
      }
      columnNum += cell.colSpan;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns all child elements of a TR element that are of type TD or TH.
***REMOVED*** @param {Element} tr TR element in which to find children.
***REMOVED*** @return {Array.<Element>} array of child cell elements.
***REMOVED***
goog.editor.Table.getChildCellElements = function(tr) {
  var cells = [];
  for (var i = 0, cell; cell = tr.childNodes[i]; i++) {
    if (cell.nodeName == goog.dom.TagName.TD ||
        cell.nodeName == goog.dom.TagName.TH) {
      cells.push(cell);
    }
  }
  return cells;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a new row in the table. The row will be populated with new
***REMOVED*** cells, and existing rowspanned cells that overlap the new row will
***REMOVED*** be extended.
***REMOVED*** @param {number=} opt_rowIndex Index at which to insert the row. If
***REMOVED***     this is omitted the row will be appended to the end of the table.
***REMOVED*** @return {Element} The new row.
***REMOVED***
goog.editor.Table.prototype.insertRow = function(opt_rowIndex) {
  var rowIndex = goog.isDefAndNotNull(opt_rowIndex) ?
      opt_rowIndex : this.rows.length;
  var refRow;
  var insertAfter;
  if (rowIndex == 0) {
    refRow = this.rows[0];
    insertAfter = false;
  } else {
    refRow = this.rows[rowIndex - 1];
    insertAfter = true;
  }
  var newTr = this.dom_.createElement('tr');
  for (var i = 0, cell; cell = refRow.columns[i]; i += 1) {
    // Check whether the existing cell will span this new row.
    // If so, instead of creating a new cell, extend
    // the rowspan of the existing cell.
    if ((insertAfter && cell.endRow > rowIndex) ||
        (!insertAfter && cell.startRow < rowIndex)) {
      cell.setRowSpan(cell.rowSpan + 1);
      if (cell.colSpan > 1) {
        i += cell.colSpan - 1;
      }
    } else {
      newTr.appendChild(this.createEmptyTd());
    }
    if (insertAfter) {
      goog.dom.insertSiblingAfter(newTr, refRow.element);
    } else {
      goog.dom.insertSiblingBefore(newTr, refRow.element);
    }
  }
  this.refresh();
  return newTr;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a new column in the table. The column will be created by
***REMOVED*** inserting new TD elements in each row, or extending the colspan
***REMOVED*** of existing TD elements.
***REMOVED*** @param {number=} opt_colIndex Index at which to insert the column. If
***REMOVED***     this is omitted the column will be appended to the right side of
***REMOVED***     the table.
***REMOVED*** @return {Array.<Element>} Array of new cell elements that were created
***REMOVED***     to populate the new column.
***REMOVED***
goog.editor.Table.prototype.insertColumn = function(opt_colIndex) {
  // TODO(user): set column widths in a way that makes sense.
  var colIndex = goog.isDefAndNotNull(opt_colIndex) ?
      opt_colIndex :
      (this.rows[0] && this.rows[0].columns.length) || 0;
  var newTds = [];
  for (var rowNum = 0, row; row = this.rows[rowNum]; rowNum++) {
    var existingCell = row.columns[colIndex];
    if (existingCell && existingCell.endCol >= colIndex &&
        existingCell.startCol < colIndex) {
      existingCell.setColSpan(existingCell.colSpan + 1);
      rowNum += existingCell.rowSpan - 1;
    } else {
      var newTd = this.createEmptyTd();
      // TODO(user): figure out a way to intelligently size new columns.
      newTd.style.width = goog.editor.Table.OPTIMUM_EMPTY_CELL_WIDTH + 'px';
      this.insertCellElement(newTd, rowNum, colIndex);
      newTds.push(newTd);
    }
  }
  this.refresh();
  return newTds;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a row from the table, removing the TR element and
***REMOVED*** decrementing the rowspan of any cells in other rows that overlap the row.
***REMOVED*** @param {number} rowIndex Index of the row to delete.
***REMOVED***
goog.editor.Table.prototype.removeRow = function(rowIndex) {
  var row = this.rows[rowIndex];
  if (!row) {
    this.logger_.warning(
        "Can't remove row at position " + rowIndex + ': no such row.');
  }
  for (var i = 0, cell; cell = row.columns[i]; i += cell.colSpan) {
    if (cell.rowSpan > 1) {
      cell.setRowSpan(cell.rowSpan - 1);
      if (cell.startRow == rowIndex) {
        // Rowspanned cell started in this row - move it down to the next row.
        this.insertCellElement(cell.element, rowIndex + 1, cell.startCol);
      }
    }
  }
  row.element.parentNode.removeChild(row.element);
  this.refresh();
***REMOVED***


***REMOVED***
***REMOVED*** Removes a column from the table. This is done by removing cell elements,
***REMOVED*** or shrinking the colspan of elements that span multiple columns.
***REMOVED*** @param {number} colIndex Index of the column to delete.
***REMOVED***
goog.editor.Table.prototype.removeColumn = function(colIndex) {
  for (var i = 0, row; row = this.rows[i]; i++) {
    var cell = row.columns[colIndex];
    if (!cell) {
      this.logger_.severe(
          "Can't remove cell at position " + i + ', ' + colIndex +
          ': no such cell.');
    }
    if (cell.colSpan > 1) {
      cell.setColSpan(cell.colSpan - 1);
    } else {
      cell.element.parentNode.removeChild(cell.element);
    }
    // Skip over following rows that contain this same cell.
    i += cell.rowSpan - 1;
  }
  this.refresh();
***REMOVED***


***REMOVED***
***REMOVED*** Merges multiple cells into a single cell, and sets the rowSpan and colSpan
***REMOVED*** attributes of the cell to take up the same space as the original cells.
***REMOVED*** @param {number} startRowIndex Top coordinate of the cells to merge.
***REMOVED*** @param {number} startColIndex Left coordinate of the cells to merge.
***REMOVED*** @param {number} endRowIndex Bottom coordinate of the cells to merge.
***REMOVED*** @param {number} endColIndex Right coordinate of the cells to merge.
***REMOVED*** @return {boolean} Whether or not the merge was possible. If the cells
***REMOVED***     in the supplied coordinates can't be merged this will return false.
***REMOVED***
goog.editor.Table.prototype.mergeCells = function(
    startRowIndex, startColIndex, endRowIndex, endColIndex) {
  // TODO(user): take a single goog.math.Rect parameter instead?
  var cells = [];
  var cell;
  if (startRowIndex == endRowIndex && startColIndex == endColIndex) {
    this.logger_.warning("Can't merge single cell");
    return false;
  }
  // Gather cells and do sanity check.
  for (var i = startRowIndex; i <= endRowIndex; i++) {
    for (var j = startColIndex; j <= endColIndex; j++) {
      cell = this.rows[i].columns[j];
      if (cell.startRow < startRowIndex ||
          cell.endRow > endRowIndex ||
          cell.startCol < startColIndex ||
          cell.endCol > endColIndex) {
        this.logger_.warning(
            "Can't merge cells: the cell in row " + i + ', column ' + j +
            'extends outside the supplied rectangle.');
        return false;
      }
      // TODO(user): this is somewhat inefficient, as we will add
      // a reference for a cell for each position, even if it's a single
      // cell with row/colspan.
      cells.push(cell);
    }
  }
  var targetCell = cells[0];
  var targetTd = targetCell.element;
  var doc = this.dom_.getDocument();

  // Merge cell contents and discard other cells.
  for (var i = 1; cell = cells[i]; i++) {
    var td = cell.element;
    if (!td.parentNode || td == targetTd) {
      // We've already handled this cell at one of its previous positions.
      continue;
    }
    // Add a space if needed, to keep merged content from getting squished
    // together.
    if (targetTd.lastChild &&
        targetTd.lastChild.nodeType == goog.dom.NodeType.TEXT) {
      targetTd.appendChild(doc.createTextNode(' '));
    }
    var childNode;
    while ((childNode = td.firstChild)) {
      targetTd.appendChild(childNode);
    }
    td.parentNode.removeChild(td);
  }
  targetCell.setColSpan((endColIndex - startColIndex) + 1);
  targetCell.setRowSpan((endRowIndex - startRowIndex) + 1);
  if (endColIndex > startColIndex) {
    // Clear width on target cell.
    // TODO(user): instead of clearing width, calculate width
    // based on width of input cells
    targetTd.removeAttribute('width');
    targetTd.style.width = null;
  }
  this.refresh();

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Splits a cell with colspans or rowspans into multiple descrete cells.
***REMOVED*** @param {number} rowIndex y coordinate of the cell to split.
***REMOVED*** @param {number} colIndex x coordinate of the cell to split.
***REMOVED*** @return {Array.<Element>} Array of new cell elements created by splitting
***REMOVED***     the cell.
***REMOVED***
// TODO(user): support splitting only horizontally or vertically,
// support splitting cells that aren't already row/colspanned.
goog.editor.Table.prototype.splitCell = function(rowIndex, colIndex) {
  var row = this.rows[rowIndex];
  var cell = row.columns[colIndex];
  var newTds = [];
  for (var i = 0; i < cell.rowSpan; i++) {
    for (var j = 0; j < cell.colSpan; j++) {
      if (i > 0 || j > 0) {
        var newTd = this.createEmptyTd();
        this.insertCellElement(newTd, rowIndex + i, colIndex + j);
        newTds.push(newTd);
      }
    }
  }
  cell.setColSpan(1);
  cell.setRowSpan(1);
  this.refresh();
  return newTds;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a cell element at the given position. The colIndex is the logical
***REMOVED*** column index, not the position in the dom. This takes into consideration
***REMOVED*** that cells in a given logical  row may actually be children of a previous
***REMOVED*** DOM row that have used rowSpan to extend into the row.
***REMOVED*** @param {Element} td The new cell element to insert.
***REMOVED*** @param {number} rowIndex Row in which to insert the element.
***REMOVED*** @param {number} colIndex Column in which to insert the element.
***REMOVED***
goog.editor.Table.prototype.insertCellElement = function(
    td, rowIndex, colIndex) {
  var row = this.rows[rowIndex];
  var nextSiblingElement = null;
  for (var i = colIndex, cell; cell = row.columns[i]; i += cell.colSpan) {
    if (cell.startRow == rowIndex) {
      nextSiblingElement = cell.element;
      break;
    }
  }
  row.element.insertBefore(td, nextSiblingElement);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an empty TD element and fill it with some empty content so it will
***REMOVED*** show up with borders even in IE pre-7 or if empty-cells is set to 'hide'
***REMOVED*** @return {Element} a new TD element.
***REMOVED***
goog.editor.Table.prototype.createEmptyTd = function() {
  // TODO(user): more cross-browser testing to determine best
  // and least annoying filler content.
  return this.dom_.createDom(goog.dom.TagName.TD, {}, goog.string.Unicode.NBSP);
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a logical table row: a tr element and any cells
***REMOVED*** that appear in that row.
***REMOVED*** @param {Element} trElement This rows's underlying TR element.
***REMOVED*** @param {number} rowIndex This row's index in its parent table.
***REMOVED***
***REMOVED***
goog.editor.TableRow = function(trElement, rowIndex) {
  this.index = rowIndex;
  this.element = trElement;
  this.columns = [];
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a table cell, which may span across multiple
***REMOVED*** rows and columns
***REMOVED*** @param {Element} td This cell's underlying TD or TH element.
***REMOVED*** @param {number} startRow Index of the row where this cell begins.
***REMOVED*** @param {number} startCol Index of the column where this cell begins.
***REMOVED***
***REMOVED***
goog.editor.TableCell = function(td, startRow, startCol) {
  this.element = td;
  this.colSpan = parseInt(td.colSpan, 10) || 1;
  this.rowSpan = parseInt(td.rowSpan, 10) || 1;
  this.startRow = startRow;
  this.startCol = startCol;
  this.updateCoordinates_();
***REMOVED***


***REMOVED***
***REMOVED*** Calculates this cell's endRow/endCol coordinates based on rowSpan/colSpan
***REMOVED*** @private
***REMOVED***
goog.editor.TableCell.prototype.updateCoordinates_ = function() {
  this.endCol = this.startCol + this.colSpan - 1;
  this.endRow = this.startRow + this.rowSpan - 1;
***REMOVED***


***REMOVED***
***REMOVED*** Set this cell's colSpan, updating both its colSpan property and the
***REMOVED*** underlying element's colSpan attribute.
***REMOVED*** @param {number} colSpan The new colSpan.
***REMOVED***
goog.editor.TableCell.prototype.setColSpan = function(colSpan) {
  if (colSpan != this.colSpan) {
    if (colSpan > 1) {
      this.element.colSpan = colSpan;
    } else {
      this.element.colSpan = 1,
      this.element.removeAttribute('colSpan');
    }
    this.colSpan = colSpan;
    this.updateCoordinates_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set this cell's rowSpan, updating both its rowSpan property and the
***REMOVED*** underlying element's rowSpan attribute.
***REMOVED*** @param {number} rowSpan The new rowSpan.
***REMOVED***
goog.editor.TableCell.prototype.setRowSpan = function(rowSpan) {
  if (rowSpan != this.rowSpan) {
    if (rowSpan > 1) {
      this.element.rowSpan = rowSpan.toString();
    } else {
      this.element.rowSpan = '1';
      this.element.removeAttribute('rowSpan');
    }
    this.rowSpan = rowSpan;
    this.updateCoordinates_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Optimum size of empty cells (in pixels), if possible.
***REMOVED*** @type {number}
***REMOVED***
goog.editor.Table.OPTIMUM_EMPTY_CELL_WIDTH = 60;


***REMOVED***
***REMOVED*** Maximum width for new tables.
***REMOVED*** @type {number}
***REMOVED***
goog.editor.Table.OPTIMUM_MAX_NEW_TABLE_WIDTH = 600;


***REMOVED***
***REMOVED*** Default color for table borders.
***REMOVED*** @type {string}
***REMOVED***
goog.editor.Table.DEFAULT_BORDER_COLOR = '#888';


***REMOVED***
***REMOVED*** Creates a new table element, populated with cells and formatted.
***REMOVED*** @param {Document} doc Document in which to create the table element.
***REMOVED*** @param {number} columns Number of columns in the table.
***REMOVED*** @param {number} rows Number of rows in the table.
***REMOVED*** @param {Object=} opt_tableStyle Object containing borderWidth and borderColor
***REMOVED***    properties, used to set the inital style of the table.
***REMOVED*** @return {Element} a table element.
***REMOVED***
goog.editor.Table.createDomTable = function(
    doc, columns, rows, opt_tableStyle) {
  // TODO(user): define formatting properties as constants,
  // make separate formatTable() function
  var style = {
    borderWidth: '1',
    borderColor: goog.editor.Table.DEFAULT_BORDER_COLOR
 ***REMOVED*****REMOVED***
  for (var prop in opt_tableStyle) {
    style[prop] = opt_tableStyle[prop];
  }
  var dom = new goog.dom.DomHelper(doc);
  var tableElement = dom.createTable(rows, columns, true);

  var minimumCellWidth = 10;
  // Calculate a good cell width.
  var cellWidth = Math.max(
      minimumCellWidth,
      Math.min(goog.editor.Table.OPTIMUM_EMPTY_CELL_WIDTH,
               goog.editor.Table.OPTIMUM_MAX_NEW_TABLE_WIDTH / columns));

  var tds = tableElement.getElementsByTagName(goog.dom.TagName.TD);
  for (var i = 0, td; td = tds[i]; i++) {
    td.style.width = cellWidth + 'px';
  }

  // Set border somewhat redundantly to make sure they show
  // up correctly in all browsers.
  goog.style.setStyle(
      tableElement, {
        'borderCollapse': 'collapse',
        'borderColor': style.borderColor,
        'borderWidth': style.borderWidth + 'px'
      });
  tableElement.border = style.borderWidth;
  tableElement.setAttribute('bordercolor', style.borderColor);
  tableElement.setAttribute('cellspacing', '0');

  return tableElement;
***REMOVED***
