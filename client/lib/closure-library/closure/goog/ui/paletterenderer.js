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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.Palette}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.PaletteRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeIterator');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.iter');
goog.require('goog.style');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Palette}s.  Renders the palette as an
***REMOVED*** HTML table wrapped in a DIV, with one palette item per cell:
***REMOVED***
***REMOVED***    <div class="goog-palette">
***REMOVED***      <table class="goog-palette-table">
***REMOVED***        <tbody class="goog-palette-body">
***REMOVED***          <tr class="goog-palette-row">
***REMOVED***            <td class="goog-palette-cell">...Item 0...</td>
***REMOVED***            <td class="goog-palette-cell">...Item 1...</td>
***REMOVED***            ...
***REMOVED***          </tr>
***REMOVED***          <tr class="goog-palette-row">
***REMOVED***            ...
***REMOVED***          </tr>
***REMOVED***        </tbody>
***REMOVED***      </table>
***REMOVED***    </div>
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.PaletteRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.PaletteRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.PaletteRenderer);


***REMOVED***
***REMOVED*** Globally unique ID sequence for cells rendered by this renderer class.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.PaletteRenderer.cellId_ = 0;


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.PaletteRenderer.CSS_CLASS = goog.getCssName('goog-palette');


***REMOVED***
***REMOVED*** Returns the palette items arranged in a table wrapped in a DIV, with the
***REMOVED*** renderer's own CSS class and additional state-specific classes applied to
***REMOVED*** it.
***REMOVED*** @param {goog.ui.Control} palette goog.ui.Palette to render.
***REMOVED*** @return {!Element} Root element for the palette.
***REMOVED*** @override
***REMOVED***
goog.ui.PaletteRenderer.prototype.createDom = function(palette) {
  var classNames = this.getClassNames(palette);
  var element = palette.getDomHelper().createDom(
      goog.dom.TagName.DIV, classNames ? classNames.join(' ') : null,
      this.createGrid(***REMOVED*** @type {Array.<Node>}***REMOVED***(palette.getContent()),
          palette.getSize(), palette.getDomHelper()));
  goog.a11y.aria.setRole(element, goog.a11y.aria.Role.GRID);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the given items in a table with {@code size.width} columns and
***REMOVED*** {@code size.height} rows.  If the table is too big, empty cells will be
***REMOVED*** created as needed.  If the table is too small, the items that don't fit
***REMOVED*** will not be rendered.
***REMOVED*** @param {Array.<Node>} items Palette items.
***REMOVED*** @param {goog.math.Size} size Palette size (columns x rows); both dimensions
***REMOVED***     must be specified as numbers.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for document interaction.
***REMOVED*** @return {Element} Palette table element.
***REMOVED***
goog.ui.PaletteRenderer.prototype.createGrid = function(items, size, dom) {
  var rows = [];
  for (var row = 0, index = 0; row < size.height; row++) {
    var cells = [];
    for (var column = 0; column < size.width; column++) {
      var item = items && items[index++];
      cells.push(this.createCell(item, dom));
    }
    rows.push(this.createRow(cells, dom));
  }

  return this.createTable(rows, dom);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a table element (or equivalent) that wraps the given rows.
***REMOVED*** @param {Array.<Element>} rows Array of row elements.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for document interaction.
***REMOVED*** @return {!Element} Palette table element.
***REMOVED***
goog.ui.PaletteRenderer.prototype.createTable = function(rows, dom) {
  var table = dom.createDom(goog.dom.TagName.TABLE,
      goog.getCssName(this.getCssClass(), 'table'),
      dom.createDom(goog.dom.TagName.TBODY,
          goog.getCssName(this.getCssClass(), 'body'), rows));
  table.cellSpacing = 0;
  table.cellPadding = 0;
  return table;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a table row element (or equivalent) that wraps the given cells.
***REMOVED*** @param {Array.<Element>} cells Array of cell elements.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for document interaction.
***REMOVED*** @return {!Element} Row element.
***REMOVED***
goog.ui.PaletteRenderer.prototype.createRow = function(cells, dom) {
  var row = dom.createDom(goog.dom.TagName.TR,
      goog.getCssName(this.getCssClass(), 'row'), cells);
  goog.a11y.aria.setRole(row, goog.a11y.aria.Role.ROW);
  return row;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a table cell element (or equivalent) that wraps the given palette
***REMOVED*** item (which must be a DOM node).
***REMOVED*** @param {Node|string} node Palette item.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for document interaction.
***REMOVED*** @return {!Element} Cell element.
***REMOVED***
goog.ui.PaletteRenderer.prototype.createCell = function(node, dom) {
  var cell = dom.createDom(goog.dom.TagName.TD, {
    'class': goog.getCssName(this.getCssClass(), 'cell'),
    // Cells must have an ID, for accessibility, so we generate one here.
    'id': goog.getCssName(this.getCssClass(), 'cell-') +
        goog.ui.PaletteRenderer.cellId_++
  }, node);
  goog.a11y.aria.setRole(cell, goog.a11y.aria.Role.GRIDCELL);
  // Initialize to an unselected state.
  goog.a11y.aria.setState(cell, goog.a11y.aria.State.SELECTED, false);

  if (!goog.dom.getTextContent(cell) && !goog.a11y.aria.getLabel(cell)) {
    var ariaLabelForCell = this.findAriaLabelForCell_(cell);
    if (ariaLabelForCell) {
      goog.a11y.aria.setLabel(cell, ariaLabelForCell);
    }
  }
  return cell;
***REMOVED***


***REMOVED***
***REMOVED*** Descends the DOM and tries to find an aria label for a grid cell
***REMOVED*** from the first child with a label or title.
***REMOVED*** @param {!Element} cell The cell.
***REMOVED*** @return {string} The label to use.
***REMOVED*** @private
***REMOVED***
goog.ui.PaletteRenderer.prototype.findAriaLabelForCell_ = function(cell) {
  var iter = new goog.dom.NodeIterator(cell);
  var label = '';
  var node;
  while (!label && (node = goog.iter.nextOrValue(iter, null))) {
    if (node.nodeType == goog.dom.NodeType.ELEMENT) {
      label = goog.a11y.aria.getLabel(***REMOVED*** @type {!Element}***REMOVED*** (node)) ||
          node.title;
    }
  }
  return label;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#canDecorate} to always return false.
***REMOVED*** @param {Element} element Ignored.
***REMOVED*** @return {boolean} False, since palettes don't support the decorate flow (for
***REMOVED***     now).
***REMOVED*** @override
***REMOVED***
goog.ui.PaletteRenderer.prototype.canDecorate = function(element) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#decorate} to be a no-op, since
***REMOVED*** palettes don't support the decorate flow (for now).
***REMOVED*** @param {goog.ui.Control} palette Ignored.
***REMOVED*** @param {Element} element Ignored.
***REMOVED*** @return {null} Always null.
***REMOVED*** @override
***REMOVED***
goog.ui.PaletteRenderer.prototype.decorate = function(palette, element) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#setContent} for palettes.  Locates
***REMOVED*** the HTML table representing the palette grid, and replaces the contents of
***REMOVED*** each cell with a new element from the array of nodes passed as the second
***REMOVED*** argument.  If the new content has too many items the table will have more
***REMOVED*** rows added to fit, if there are less items than the table has cells, then the
***REMOVED*** left over cells will be empty.
***REMOVED*** @param {Element} element Root element of the palette control.
***REMOVED*** @param {goog.ui.ControlContent} content Array of items to replace existing
***REMOVED***     palette items.
***REMOVED*** @override
***REMOVED***
goog.ui.PaletteRenderer.prototype.setContent = function(element, content) {
  var items =***REMOVED*****REMOVED*** @type {Array.<Node>}***REMOVED*** (content);
  if (element) {
    var tbody = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.TBODY,
        goog.getCssName(this.getCssClass(), 'body'), element)[0];
    if (tbody) {
      var index = 0;
      goog.array.forEach(tbody.rows, function(row) {
        goog.array.forEach(row.cells, function(cell) {
          goog.dom.removeChildren(cell);
          if (items) {
            var item = items[index++];
            if (item) {
              goog.dom.appendChild(cell, item);
            }
          }
        });
      });

      // Make space for any additional items.
      if (index < items.length) {
        var cells = [];
        var dom = goog.dom.getDomHelper(element);
        var width = tbody.rows[0].cells.length;
        while (index < items.length) {
          var item = items[index++];
          cells.push(this.createCell(item, dom));
          if (cells.length == width) {
            var row = this.createRow(cells, dom);
            goog.dom.appendChild(tbody, row);
            cells.length = 0;
          }
        }
        if (cells.length > 0) {
          while (cells.length < width) {
            cells.push(this.createCell('', dom));
          }
          var row = this.createRow(cells, dom);
          goog.dom.appendChild(tbody, row);
        }
      }
    }
    // Make sure the new contents are still unselectable.
    goog.style.setUnselectable(element, true, goog.userAgent.GECKO);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the item corresponding to the given node, or null if the node is
***REMOVED*** neither a palette cell nor part of a palette item.
***REMOVED*** @param {goog.ui.Palette} palette Palette in which to look for the item.
***REMOVED*** @param {Node} node Node to look for.
***REMOVED*** @return {Node} The corresponding palette item (null if not found).
***REMOVED***
goog.ui.PaletteRenderer.prototype.getContainingItem = function(palette, node) {
  var root = palette.getElement();
  while (node && node.nodeType == goog.dom.NodeType.ELEMENT && node != root) {
    if (node.tagName == goog.dom.TagName.TD && goog.dom.classlist.contains(
       ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (node),
        goog.getCssName(this.getCssClass(), 'cell'))) {
      return node.firstChild;
    }
    node = node.parentNode;
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the highlight styling of the palette cell containing the given node
***REMOVED*** based on the value of the Boolean argument.
***REMOVED*** @param {goog.ui.Palette} palette Palette containing the item.
***REMOVED*** @param {Node} node Item whose cell is to be highlighted or un-highlighted.
***REMOVED*** @param {boolean} highlight If true, the cell is highlighted; otherwise it is
***REMOVED***     un-highlighted.
***REMOVED***
goog.ui.PaletteRenderer.prototype.highlightCell = function(palette,
                                                           node,
                                                           highlight) {
  if (node) {
    var cell = this.getCellForItem(node);
    goog.asserts.assert(cell);
    goog.dom.classlist.enable(cell,
        goog.getCssName(this.getCssClass(), 'cell-hover'), highlight);
    // See http://www.w3.org/TR/2006/WD-aria-state-20061220/#activedescendent
    // for an explanation of the activedescendent.
    goog.a11y.aria.setState(palette.getElementStrict(),
        goog.a11y.aria.State.ACTIVEDESCENDANT, cell.id);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {Node} node Item whose cell is to be returned.
***REMOVED*** @return {Element} The grid cell for the palette item.
***REMOVED***
goog.ui.PaletteRenderer.prototype.getCellForItem = function(node) {
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (node ? node.parentNode : null);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the selection styling of the palette cell containing the given node
***REMOVED*** based on the value of the Boolean argument.
***REMOVED*** @param {goog.ui.Palette} palette Palette containing the item.
***REMOVED*** @param {Node} node Item whose cell is to be selected or deselected.
***REMOVED*** @param {boolean} select If true, the cell is selected; otherwise it is
***REMOVED***     deselected.
***REMOVED***
goog.ui.PaletteRenderer.prototype.selectCell = function(palette, node, select) {
  if (node) {
    var cell =***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (node.parentNode);
    goog.dom.classlist.enable(cell,
        goog.getCssName(this.getCssClass(), 'cell-selected'),
        select);
    goog.a11y.aria.setState(cell, goog.a11y.aria.State.SELECTED, select);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.PaletteRenderer.prototype.getCssClass = function() {
  return goog.ui.PaletteRenderer.CSS_CLASS;
***REMOVED***
