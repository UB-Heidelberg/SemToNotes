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
***REMOVED*** @fileoverview A table sorting decorator.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @see ../demos/tablesorter.html
***REMOVED***

goog.provide('goog.ui.TableSorter');
goog.provide('goog.ui.TableSorter.EventType');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.functions');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** A table sorter allows for sorting of a table by column.  This component can
***REMOVED*** be used to decorate an already existing TABLE element with sorting
***REMOVED*** features.
***REMOVED***
***REMOVED*** The TABLE should use a THEAD containing TH elements for the table column
***REMOVED*** headers.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.TableSorter = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current sort header of the table, or null if none.
  ***REMOVED*** @type {HTMLTableCellElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.header_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the last sort was in reverse.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.reversed_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The default sorting function.
  ***REMOVED*** @type {function(*,***REMOVED***) : number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultSortFunction_ = goog.ui.TableSorter.numericSort;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of custom sorting functions per colun.
  ***REMOVED*** @type {Array.<function(*,***REMOVED***) : number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sortFunctions_ = [];
***REMOVED***
goog.inherits(goog.ui.TableSorter, goog.ui.Component);


***REMOVED***
***REMOVED*** Row number (in <thead>) to use for sorting.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.TableSorter.prototype.sortableHeaderRowIndex_ = 0;


***REMOVED***
***REMOVED*** Sets the row index (in <thead>) to be used for sorting.
***REMOVED*** By default, the first row (index 0) is used.
***REMOVED*** Must be called before decorate() is called.
***REMOVED*** @param {number} index The row index.
***REMOVED***
goog.ui.TableSorter.prototype.setSortableHeaderRowIndex = function(index) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.sortableHeaderRowIndex_ = index;
***REMOVED***


***REMOVED***
***REMOVED*** Table sorter events.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.TableSorter.EventType = {
  BEFORESORT: 'beforesort',
  SORT: 'sort'
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TableSorter.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.TABLE;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TableSorter.prototype.enterDocument = function() {
  goog.ui.TableSorter.superClass_.enterDocument.call(this);

  var table = this.getElement();
  var headerRow = table.tHead.rows[this.sortableHeaderRowIndex_];

  this.getHandler().listen(headerRow, goog.events.EventType.CLICK, this.sort_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The current sort column of the table, or -1 if none.
***REMOVED***
goog.ui.TableSorter.prototype.getSortColumn = function() {
  return this.header_ ? this.header_.cellIndex : -1;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the last sort was in reverse.
***REMOVED***
goog.ui.TableSorter.prototype.isSortReversed = function() {
  return this.reversed_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {function(*,***REMOVED***) : number} The default sort function to be used by
***REMOVED***     all columns.
***REMOVED***
goog.ui.TableSorter.prototype.getDefaultSortFunction = function() {
  return this.defaultSortFunction_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default sort function to be used by all columns.  If not set
***REMOVED*** explicitly, this defaults to numeric sorting.
***REMOVED*** @param {function(*,***REMOVED***) : number} sortFunction The new default sort function.
***REMOVED***
goog.ui.TableSorter.prototype.setDefaultSortFunction = function(sortFunction) {
  this.defaultSortFunction_ = sortFunction;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the sort function to be used by the given column.  Returns the default
***REMOVED*** sort function if no sort function is explicitly set for this column.
***REMOVED*** @param {number} column The column index.
***REMOVED*** @return {function(*,***REMOVED***) : number} The sort function used by the column.
***REMOVED***
goog.ui.TableSorter.prototype.getSortFunction = function(column) {
  return this.sortFunctions_[column] || this.defaultSortFunction_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the sort function for the given column, overriding the default sort
***REMOVED*** function.
***REMOVED*** @param {number} column The column index.
***REMOVED*** @param {function(*,***REMOVED***) : number} sortFunction The new sort function.
***REMOVED***
goog.ui.TableSorter.prototype.setSortFunction = function(column, sortFunction) {
  this.sortFunctions_[column] = sortFunction;
***REMOVED***


***REMOVED***
***REMOVED*** Sort the table contents by the values in the given column.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.ui.TableSorter.prototype.sort_ = function(e) {
  // Determine what column was clicked.
  // TODO(robbyw): If this table cell contains another table, this could break.
  var target =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target);
  var th = goog.dom.getAncestorByTagNameAndClass(target,
      goog.dom.TagName.TH);

  // If the user clicks on the same column, sort it in reverse of what it is
  // now.  Otherwise, sort forward.
  var reverse = th == this.header_ ? !this.reversed_ : false;

  // Perform the sort.
  if (this.dispatchEvent(goog.ui.TableSorter.EventType.BEFORESORT)) {
    if (this.sort(th.cellIndex, reverse)) {
      this.dispatchEvent(goog.ui.TableSorter.EventType.SORT);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sort the table contents by the values in the given column.
***REMOVED*** @param {number} column The column to sort by.
***REMOVED*** @param {boolean=} opt_reverse Whether to sort in reverse.
***REMOVED*** @return {boolean} Whether the sort was executed.
***REMOVED***
goog.ui.TableSorter.prototype.sort = function(column, opt_reverse) {
  var sortFunction = this.getSortFunction(column);
  if (sortFunction === goog.ui.TableSorter.noSort) {
    return false;
  }

  // Remove old header classes.
  if (this.header_) {
    goog.dom.classlist.remove(this.header_, this.reversed_ ?
        goog.getCssName('goog-tablesorter-sorted-reverse') :
        goog.getCssName('goog-tablesorter-sorted'));
  }

  // If the user clicks on the same column, sort it in reverse of what it is
  // now.  Otherwise, sort forward.
  this.reversed_ = !!opt_reverse;
  var multiplier = this.reversed_ ? -1 : 1;
  var cmpFn = function(a, b) {
    return multiplier***REMOVED*** sortFunction(a[0], b[0]) || a[1] - b[1];
 ***REMOVED*****REMOVED***

  // Sort all tBodies
  var table = this.getElement();
  goog.array.forEach(table.tBodies, function(tBody) {
    // Collect all of the rows into an array.
    var values = goog.array.map(tBody.rows, function(row, rowIndex) {
      return [goog.dom.getTextContent(row.cells[column]), rowIndex, row];
    });

    goog.array.sort(values, cmpFn);

    // Remove the tBody temporarily since this speeds up the sort on some
    // browsers.
    var nextSibling = tBody.nextSibling;
    table.removeChild(tBody);

    // Sort the rows, using the resulting array.
    goog.array.forEach(values, function(row) {
      tBody.appendChild(row[2]);
    });

    // Reinstate the tBody.
    table.insertBefore(tBody, nextSibling);
  });

  // Mark this as the last sorted column.
  this.header_ = table.tHead.rows[this.sortableHeaderRowIndex_].cells[column];

  // Update the header class.
  goog.dom.classlist.add(this.header_, this.reversed_ ?
      goog.getCssName('goog-tablesorter-sorted-reverse') :
      goog.getCssName('goog-tablesorter-sorted'));

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Disables sorting on the specified column
***REMOVED*** @param {*} a First sort value.
***REMOVED*** @param {*} b Second sort value.
***REMOVED*** @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
***REMOVED***
goog.ui.TableSorter.noSort = goog.functions.error('no sort');


***REMOVED***
***REMOVED*** A numeric sort function.
***REMOVED*** @param {*} a First sort value.
***REMOVED*** @param {*} b Second sort value.
***REMOVED*** @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
***REMOVED***
goog.ui.TableSorter.numericSort = function(a, b) {
  return parseFloat(a) - parseFloat(b);
***REMOVED***


***REMOVED***
***REMOVED*** Alphabetic sort function.
***REMOVED*** @param {*} a First sort value.
***REMOVED*** @param {*} b Second sort value.
***REMOVED*** @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
***REMOVED***
goog.ui.TableSorter.alphaSort = goog.array.defaultCompare;


***REMOVED***
***REMOVED*** Returns a function that is the given sort function in reverse.
***REMOVED*** @param {function(*,***REMOVED***) : number} sortFunction The original sort function.
***REMOVED*** @return {function(*,***REMOVED***) : number} A new sort function that reverses the
***REMOVED***     given sort function.
***REMOVED***
goog.ui.TableSorter.createReverseSort = function(sortFunction) {
  return function(a, b) {
    return -1***REMOVED*** sortFunction(a, b);
 ***REMOVED*****REMOVED***
***REMOVED***
