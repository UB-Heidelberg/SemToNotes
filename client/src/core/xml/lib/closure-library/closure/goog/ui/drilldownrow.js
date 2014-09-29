// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Tree-like drilldown components for HTML tables.
***REMOVED***
***REMOVED*** This component supports expanding and collapsing groups of rows in
***REMOVED*** HTML tables.  The behavior is like typical Tree widgets, but tables
***REMOVED*** need special support to enable the tree behaviors.
***REMOVED***
***REMOVED*** Any row or rows in an HTML table can be DrilldownRows.  The root
***REMOVED*** DrilldownRow nodes are always visible in the table, but the rest show
***REMOVED*** or hide as input events expand and collapse their ancestors.
***REMOVED***
***REMOVED*** Programming them:  Top-level DrilldownRows are made by decorating
***REMOVED*** a TR element.  Children are made with addChild or addChildAt, and
***REMOVED*** are entered into the document by the render() method.
***REMOVED***
***REMOVED*** A DrilldownRow can have any number of children.  If it has no children
***REMOVED*** it can be loaded, not loaded, or with a load in progress.
***REMOVED*** Top-level DrilldownRows are always displayed (though setting
***REMOVED*** style.display on a containing DOM node could make one be not
***REMOVED*** visible to the user).  A DrilldownRow can be expanded, or not.  A
***REMOVED*** DrilldownRow displays if all of its ancestors are expanded.
***REMOVED***
***REMOVED*** Set up event handlers and style each row for the application in an
***REMOVED*** enterDocument method.
***REMOVED***
***REMOVED*** Children normally render into the document lazily, at the first
***REMOVED*** moment when all ancestors are expanded.
***REMOVED***
***REMOVED*** @see ../demos/drilldownrow.html
***REMOVED***

// TODO(user): Build support for dynamically loading DrilldownRows,
// probably using automplete as an example to follow.

// TODO(user): Make DrilldownRows accessible through the keyboard.

// The render method is redefined in this class because when addChildAt renders
// the new child it assumes that the child's DOM node will be a child
// of the parent component's DOM node, but all DOM nodes of DrilldownRows
// in the same tree of DrilldownRows are siblings to each other.
//
// Arguments (or lack of arguments) to the render methods in Component
// all determine the place of the new DOM node in the DOM tree, but
// the place of a new DrilldownRow in the DOM needs to be determined by
// its position in the tree of DrilldownRows.

goog.provide('goog.ui.DrilldownRow');

goog.require('goog.dom');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Builds a DrilldownRow component, which can overlay a tree
***REMOVED*** structure onto sections of an HTML table.
***REMOVED***
***REMOVED*** @param {Object=} opt_properties This parameter can contain:
***REMOVED***   contents:  if present, user data identifying
***REMOVED***     the information loaded into the row and its children.
***REMOVED***   loaded: initializes the isLoaded property, defaults to true.
***REMOVED***   expanded: DrilldownRow expanded or not, default is true.
***REMOVED***   html: String of HTML, relevant and required for DrilldownRows to be
***REMOVED***     added as children.  Ignored when decorating an existing table row.
***REMOVED***   decorator: Function that accepts one DrilldownRow argument, and
***REMOVED***     should customize and style the row.  The default is to call
***REMOVED***     goog.ui.DrilldownRow.decorator.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.DrilldownRow = function(opt_properties) {
  goog.ui.Component.call(this);
  var properties = opt_properties || {***REMOVED***

  // Initialize instance variables.

 ***REMOVED*****REMOVED***
  ***REMOVED*** String of HTML to initialize the DOM structure for the table row.
  ***REMOVED*** Should have the form '<tr attr="etc">Row contents here</tr>'.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.html_ = properties.html;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Controls whether this component's children will show when it shows.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.expanded_ = typeof properties.expanded != 'undefined' ?
      properties.expanded : true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Is this component loaded? States are true, false, and null for
  ***REMOVED*** 'loading in progress'.  For in-memory
  ***REMOVED*** trees of components, this is always true.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.loaded_ = typeof properties.loaded != 'undefined' ?
      properties.loaded : true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** If this component's DOM element is created from a string of
  ***REMOVED*** HTML, this is the function to call when it is entered into the DOM tree.
  ***REMOVED*** @type {Function} args are DrilldownRow and goog.events.EventHandler
  ***REMOVED***   of the DrilldownRow.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.decoratorFn_ = properties.decorator || goog.ui.DrilldownRow.decorate;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Is the DrilldownRow to be displayed?  If it is rendered, this mirrors
  ***REMOVED*** the style.display of the DrilldownRow's row.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.displayed_ = true;
***REMOVED***
goog.inherits(goog.ui.DrilldownRow, goog.ui.Component);


***REMOVED***
***REMOVED*** Example object with properties of the form accepted by the class
***REMOVED*** constructor.  These are educational and show the compiler that
***REMOVED*** these properties can be set so it doesn't emit warnings.
***REMOVED***
goog.ui.DrilldownRow.sampleProperties = {
  'html': '<tr><td>Sample</td><td>Sample</tr>',
  'loaded': true,
  'decorator': function(selfObj, handler) {
    // When the mouse is hovering, add CSS class goog-drilldown-hover.
    goog.ui.DrilldownRow.decorate(selfObj);
    var row = selfObj.getElement();
    handler.listen(row, 'mouseover', function() {
      goog.dom.classes.add(row, goog.getCssName('goog-drilldown-hover'));
    });
    handler.listen(row, 'mouseout', function() {
      goog.dom.classes.remove(row, goog.getCssName('goog-drilldown-hover'));
    });
  }
***REMOVED***


//
// Implementations of Component methods.
//


***REMOVED***
***REMOVED*** The base class method calls its superclass method and this
***REMOVED*** drilldown's 'decorator' method as defined in the constructor.
***REMOVED*** @override
***REMOVED***
goog.ui.DrilldownRow.prototype.enterDocument = function() {
  goog.ui.DrilldownRow.superClass_.enterDocument.call(this);
  this.decoratorFn_(this, this.getHandler());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DrilldownRow.prototype.createDom = function() {
  this.setElementInternal(goog.ui.DrilldownRow.createRowNode_(
      this.html_, this.getDomHelper().getDocument()));
***REMOVED***


***REMOVED***
***REMOVED*** A top-level DrilldownRow decorates a TR element.
***REMOVED***
***REMOVED*** @param {Element} node The element to test for decorability.
***REMOVED*** @return {boolean} true iff the node is a TR.
***REMOVED*** @override
***REMOVED***
goog.ui.DrilldownRow.prototype.canDecorate = function(node) {
  return node.tagName == 'TR';
***REMOVED***


***REMOVED***
***REMOVED*** Child drilldowns are rendered when needed.
***REMOVED***
***REMOVED*** @param {goog.ui.Component} child New DrilldownRow child to be added.
***REMOVED*** @param {number} index position to be occupied by the child.
***REMOVED*** @param {boolean=} opt_render true to force immediate rendering.
***REMOVED*** @override
***REMOVED***
goog.ui.DrilldownRow.prototype.addChildAt = function(child, index, opt_render) {
  goog.ui.DrilldownRow.superClass_.addChildAt.call(this, child, index, false);
  child.setDisplayable_(this.isVisible_() && this.isExpanded());
  if (opt_render && !child.isInDocument()) {
    child.render();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DrilldownRow.prototype.removeChild = function(child) {
  goog.dom.removeNode(child.getElement());
  return goog.ui.DrilldownRow.superClass_.removeChild.call(this, child);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DrilldownRow.prototype.disposeInternal = function() {
  delete this.html_;
  this.children_ = null;
  goog.ui.DrilldownRow.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Rendering of DrilldownRow's is on need, do not call this directly
***REMOVED*** from application code.
***REMOVED***
***REMOVED*** Rendering a DrilldownRow places it according to its position in its
***REMOVED*** tree of DrilldownRows.  DrilldownRows cannot be placed any other
***REMOVED*** way so this method does not use any arguments.  This does not call
***REMOVED*** the base class method and does not modify any of this
***REMOVED*** DrilldownRow's children.
***REMOVED*** @override
***REMOVED***
goog.ui.DrilldownRow.prototype.render = function() {
  if (arguments.length) {
    throw Error('A DrilldownRow cannot be placed under a specific parent.');
  } else {
    var parent = this.getParent();
    if (!parent.isInDocument()) {
      throw Error('Cannot render child of un-rendered parent');
    }
    // The new child's TR node needs to go just after the last TR
    // of the part of the parent's subtree that is to the left
    // of this.  The subtree includes the parent.
    var previous = parent.previousRenderedChild_(this);
    var row;
    if (previous) {
      row = previous.lastRenderedLeaf_().getElement();
    } else {
      row = parent.getElement();
    }
    row =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (row.nextSibling);
    // Render the child row component into the document.
    if (row) {
      this.renderBefore(row);
    } else {
      // Render at the end of the parent of this DrilldownRow's
      // DOM element.
      var tbody =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (parent.getElement().parentNode);
      goog.ui.DrilldownRow.superClass_.render.call(this, tbody);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Finds the numeric index of this child within its parent Component.
***REMOVED*** Throws an exception if it has no parent.
***REMOVED***
***REMOVED*** @return {number} index of this within the children of the parent Component.
***REMOVED***
goog.ui.DrilldownRow.prototype.findIndex = function() {
  var parent = this.getParent();
  if (!parent) {
    throw Error('Component has no parent');
  }
  return parent.indexOfChild(this);
***REMOVED***


//
// Type-specific operations
//


***REMOVED***
***REMOVED*** Returns the expanded state of the DrilldownRow.
***REMOVED***
***REMOVED*** @return {boolean} true iff this is expanded.
***REMOVED***
goog.ui.DrilldownRow.prototype.isExpanded = function() {
  return this.expanded_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the expanded state of this DrilldownRow: makes all children
***REMOVED*** displayable or not displayable corresponding to the expanded state.
***REMOVED***
***REMOVED*** @param {boolean} expanded whether this should be expanded or not.
***REMOVED***
goog.ui.DrilldownRow.prototype.setExpanded = function(expanded) {
  if (expanded != this.expanded_) {
    this.expanded_ = expanded;
    goog.dom.classes.toggle(this.getElement(),
        goog.getCssName('goog-drilldown-expanded'));
    goog.dom.classes.toggle(this.getElement(),
        goog.getCssName('goog-drilldown-collapsed'));
    if (this.isVisible_()) {
      this.forEachChild(function(child) {
        child.setDisplayable_(expanded);
      });
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns this DrilldownRow's level in the tree.  Top level is 1.
***REMOVED***
***REMOVED*** @return {number} depth of this DrilldownRow in its tree of drilldowns.
***REMOVED***
goog.ui.DrilldownRow.prototype.getDepth = function() {
  for (var component = this, depth = 0;
       component instanceof goog.ui.DrilldownRow;
       component = component.getParent(), depth++) {}
  return depth;
***REMOVED***


***REMOVED***
***REMOVED*** This static function is a default decorator that adds HTML at the
***REMOVED*** beginning of the first cell to display indentation and an expander
***REMOVED*** image; sets up a click handler on the toggler; initializes a class
***REMOVED*** for the row: either goog-drilldown-expanded or
***REMOVED*** goog-drilldown-collapsed, depending on the initial state of the
***REMOVED*** DrilldownRow; and sets up a click event handler on the toggler
***REMOVED*** element.
***REMOVED***
***REMOVED*** This creates a DIV with class=toggle.  Your application can set up
***REMOVED*** CSS style rules something like this:
***REMOVED***
***REMOVED*** tr.goog-drilldown-expanded .toggle {
***REMOVED***   background-image: url('minus.png');
***REMOVED*** }
***REMOVED***
***REMOVED*** tr.goog-drilldown-collapsed .toggle {
***REMOVED***   background-image: url('plus.png');
***REMOVED*** }
***REMOVED***
***REMOVED*** These background images show whether the DrilldownRow is expanded.
***REMOVED***
***REMOVED*** @param {goog.ui.DrilldownRow} selfObj DrilldownRow to be decorated.
***REMOVED***
goog.ui.DrilldownRow.decorate = function(selfObj) {
  var depth = selfObj.getDepth();
  var row = selfObj.getElement();
  if (!row.cells) {
    throw Error('No cells');
  }
  var cell = row.cells[0];
  var html = '<div style="float: left; width: ' + depth +
      'em;"><div class=toggle style="width: 1em; float: right;">' +
      '&nbsp;</div></div>';
  var fragment = selfObj.getDomHelper().htmlToDocumentFragment(html);
  cell.insertBefore(fragment, cell.firstChild);
  goog.dom.classes.add(row, selfObj.isExpanded() ?
      goog.getCssName('goog-drilldown-expanded') :
      goog.getCssName('goog-drilldown-collapsed'));
  // Default mouse event handling:
  var toggler = fragment.getElementsByTagName('div')[0];
  var key = selfObj.getHandler().listen(toggler, 'click', function(event) {
    selfObj.setExpanded(!selfObj.isExpanded());
  });
***REMOVED***


//
// Private methods
//


***REMOVED***
***REMOVED*** Turn display of a DrilldownRow on or off.  If the DrilldownRow has not
***REMOVED*** yet been rendered, this renders it.  This propagates the effect
***REMOVED*** of the change recursively as needed -- children displaying iff the
***REMOVED*** parent is displayed and expanded.
***REMOVED***
***REMOVED*** @param {boolean} display state, true iff display is desired.
***REMOVED*** @private
***REMOVED***
goog.ui.DrilldownRow.prototype.setDisplayable_ = function(display) {
  if (display && !this.isInDocument()) {
    this.render();
  }
  if (this.displayed_ == display) {
    return;
  }
  this.displayed_ = display;
  if (this.isInDocument()) {
    this.getElement().style.display = display ? '' : 'none';
  }
  var selfObj = this;
  this.forEachChild(function(child) {
    child.setDisplayable_(display && selfObj.expanded_);
  });
***REMOVED***


***REMOVED***
***REMOVED*** True iff this and all its DrilldownRow parents are displayable.  The
***REMOVED*** value is an approximation to actual visibility, since it does not
***REMOVED*** look at whether DOM nodes containing the top-level component have
***REMOVED*** display: none, visibility: hidden or are otherwise not displayable.
***REMOVED*** So this visibility is relative to the top-level component.
***REMOVED***
***REMOVED*** @return {boolean} visibility of this relative to its top-level drilldown.
***REMOVED*** @private
***REMOVED***
goog.ui.DrilldownRow.prototype.isVisible_ = function() {
  for (var component = this;
       component instanceof goog.ui.DrilldownRow;
       component = component.getParent()) {
    if (!component.displayed_)
      return false;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Create and return a TR element from HTML that looks like
***REMOVED*** "<tr> ... </tr>".
***REMOVED***
***REMOVED*** @param {string} html for one row.
***REMOVED*** @param {Document} doc object to hold the Element.
***REMOVED*** @return {Element} table row node created from the HTML.
***REMOVED*** @private
***REMOVED***
goog.ui.DrilldownRow.createRowNode_ = function(html, doc) {
  // Note: this may be slow.
  var tableHtml = '<table>' + html + '</table>';
  var div = doc.createElement('div');
  div.innerHTML = tableHtml;
  return div.firstChild.rows[0];
***REMOVED***


***REMOVED***
***REMOVED*** Get the recursively rightmost child that is in the document.
***REMOVED***
***REMOVED*** @return {goog.ui.DrilldownRow} rightmost child currently entered in
***REMOVED***     the document, potentially this DrilldownRow.  If this is in the
***REMOVED***     document, result is non-null.
***REMOVED*** @private
***REMOVED***
goog.ui.DrilldownRow.prototype.lastRenderedLeaf_ = function() {
  var leaf = null;
  for (var node = this;
       node && node.isInDocument();
       // Node will become undefined if parent has no children.
       node = node.getChildAt(node.getChildCount() - 1)) {
    leaf = node;
  }
  return***REMOVED*****REMOVED*** @type {goog.ui.DrilldownRow}***REMOVED*** (leaf);
***REMOVED***


***REMOVED***
***REMOVED*** Search this node's direct children for the last one that is in the
***REMOVED*** document and is before the given child.
***REMOVED*** @param {goog.ui.DrilldownRow} child The child to stop the search at.
***REMOVED*** @return {goog.ui.Component?} The last child component before the given child
***REMOVED***     that is in the document.
***REMOVED*** @private
***REMOVED***
goog.ui.DrilldownRow.prototype.previousRenderedChild_ = function(child) {
  for (var i = this.getChildCount() - 1; i >= 0; i--) {
    if (this.getChildAt(i) == child) {
      for (var j = i - 1; j >= 0; j--) {
        var prev = this.getChildAt(j);
        if (prev.isInDocument()) {
          return prev;
        }
      }
    }
  }
  return null;
***REMOVED***
