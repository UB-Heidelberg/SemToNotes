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
***REMOVED*** @fileoverview Definition of the goog.ui.tree.TreeControl class, which
***REMOVED*** provides a way to view a hierarchical set of data.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author jonp@google.com (Jon Perlow)
***REMOVED*** @author annams@google.com (Srinivas Annam)
***REMOVED***
***REMOVED*** This is a based on the webfx tree control. It since been updated to add
***REMOVED*** typeahead support, as well as accessibility support using ARIA framework.
***REMOVED***
***REMOVED*** @see ../../demos/tree/demo.html
***REMOVED***

goog.provide('goog.ui.tree.TreeControl');

goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.events.FocusHandler');
goog.require('goog.events.KeyHandler');
goog.require('goog.html.SafeHtml');
goog.require('goog.log');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeNode');
goog.require('goog.ui.tree.TypeAhead');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This creates a TreeControl object. A tree control provides a way to
***REMOVED*** view a hierarchical set of data.
***REMOVED*** @param {string|!goog.html.SafeHtml} html The HTML content of the node label.
***REMOVED*** @param {Object=} opt_config The configuration for the tree. See
***REMOVED***    goog.ui.tree.TreeControl.defaultConfig. If not specified, a default config
***REMOVED***    will be used.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.tree.BaseNode}
***REMOVED***
goog.ui.tree.TreeControl = function(html, opt_config, opt_domHelper) {
  goog.ui.tree.BaseNode.call(this, html, opt_config, opt_domHelper);

  // The root is open and selected by default.
  this.setExpandedInternal(true);
  this.setSelectedInternal(true);

  this.selectedItem_ = this;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used for typeahead support.
  ***REMOVED*** @type {!goog.ui.tree.TypeAhead}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.typeAhead_ = new goog.ui.tree.TypeAhead();

  if (goog.userAgent.IE) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      // works since IE6SP1
      document.execCommand('BackgroundImageCache', false, true);
    } catch (e) {
      goog.log.warning(this.logger_, 'Failed to enable background image cache');
    }
  }
***REMOVED***
goog.inherits(goog.ui.tree.TreeControl, goog.ui.tree.BaseNode);


***REMOVED***
***REMOVED*** The object handling keyboard events.
***REMOVED*** @type {goog.events.KeyHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.keyHandler_ = null;


***REMOVED***
***REMOVED*** The object handling focus events.
***REMOVED*** @type {goog.events.FocusHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.focusHandler_ = null;


***REMOVED***
***REMOVED*** Logger
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.logger_ =
    goog.log.getLogger('goog.ui.tree.TreeControl');


***REMOVED***
***REMOVED*** Whether the tree is focused.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.focused_ = false;


***REMOVED***
***REMOVED*** Child node that currently has focus.
***REMOVED*** @type {goog.ui.tree.BaseNode}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.focusedNode_ = null;


***REMOVED***
***REMOVED*** Whether to show lines.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.showLines_ = true;


***REMOVED***
***REMOVED*** Whether to show expanded lines.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.showExpandIcons_ = true;


***REMOVED***
***REMOVED*** Whether to show the root node.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.showRootNode_ = true;


***REMOVED***
***REMOVED*** Whether to show the root lines.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.showRootLines_ = true;


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getTree = function() {
  return this;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getDepth = function() {
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Expands the parent chain of this node so that it is visible.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.TreeControl.prototype.reveal = function() {
  // always expanded by default
  // needs to be overriden so that we don't try to reveal our parent
  // which is a generic component
***REMOVED***


***REMOVED***
***REMOVED*** Handles focus on the tree.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.handleFocus_ = function(e) {
  this.focused_ = true;
  goog.dom.classlist.add(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('focused'));

  if (this.selectedItem_) {
    this.selectedItem_.select();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles blur on the tree.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.handleBlur_ = function(e) {
  this.focused_ = false;
  goog.dom.classlist.remove(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('focused'));
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the tree has keyboard focus.
***REMOVED***
goog.ui.tree.TreeControl.prototype.hasFocus = function() {
  return this.focused_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getExpanded = function() {
  return !this.showRootNode_ ||
      goog.ui.tree.TreeControl.superClass_.getExpanded.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.setExpanded = function(expanded) {
  if (!this.showRootNode_) {
    this.setExpandedInternal(expanded);
  } else {
    goog.ui.tree.TreeControl.superClass_.setExpanded.call(this, expanded);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getExpandIconSafeHtml = function() {
  // no expand icon for root element
  return goog.html.SafeHtml.EMPTY;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getIconElement = function() {
  var el = this.getRowElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.firstChild) : null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getExpandIconElement = function() {
  // no expand icon for root element
  return null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.updateExpandIcon = function() {
  // no expand icon
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.getRowClassName = function() {
  return goog.ui.tree.TreeControl.superClass_.getRowClassName.call(this) +
      (this.showRootNode_ ? '' : ' ' + this.getConfig().cssHideRoot);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the source for the icon.
***REMOVED*** @return {string} Src for the icon.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.TreeControl.prototype.getCalculatedIconClass = function() {
  var expanded = this.getExpanded();
  var expandedIconClass = this.getExpandedIconClass();
  if (expanded && expandedIconClass) {
    return expandedIconClass;
  }
  var iconClass = this.getIconClass();
  if (!expanded && iconClass) {
    return iconClass;
  }

  // fall back on default icons
  var config = this.getConfig();
  if (expanded && config.cssExpandedRootIcon) {
    return config.cssTreeIcon + ' ' + config.cssExpandedRootIcon;
  } else if (!expanded && config.cssCollapsedRootIcon) {
    return config.cssTreeIcon + ' ' + config.cssCollapsedRootIcon;
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected item.
***REMOVED*** @param {goog.ui.tree.BaseNode} node The item to select.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setSelectedItem = function(node) {
  if (this.selectedItem_ == node) {
    return;
  }

  var hadFocus = false;
  if (this.selectedItem_) {
    hadFocus = this.selectedItem_ == this.focusedNode_;
    this.selectedItem_.setSelectedInternal(false);
  }

  this.selectedItem_ = node;

  if (node) {
    node.setSelectedInternal(true);
    if (hadFocus) {
      node.select();
    }
  }

  this.dispatchEvent(goog.events.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the selected item.
***REMOVED*** @return {goog.ui.tree.BaseNode} The currently selected item.
***REMOVED***
goog.ui.tree.TreeControl.prototype.getSelectedItem = function() {
  return this.selectedItem_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to show lines.
***REMOVED*** @param {boolean} b Whether to show lines.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setShowLines = function(b) {
  if (this.showLines_ != b) {
    this.showLines_ = b;
    if (this.isInDocument()) {
      this.updateLinesAndExpandIcons_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether to show lines.
***REMOVED***
goog.ui.tree.TreeControl.prototype.getShowLines = function() {
  return this.showLines_;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the lines after the tree has been drawn.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.updateLinesAndExpandIcons_ = function() {
  var tree = this;
  var showLines = tree.getShowLines();
  var showRootLines = tree.getShowRootLines();
  // Recursively walk through all nodes and update the class names of the
  // expand icon and the children element.
  function updateShowLines(node) {
    var childrenEl = node.getChildrenElement();
    if (childrenEl) {
      var hideLines = !showLines || tree == node.getParent() && !showRootLines;
      var childClass = hideLines ? node.getConfig().cssChildrenNoLines :
          node.getConfig().cssChildren;
      childrenEl.className = childClass;

      var expandIconEl = node.getExpandIconElement();
      if (expandIconEl) {
        expandIconEl.className = node.getExpandIconClass();
      }
    }
    node.forEachChild(updateShowLines);
  }
  updateShowLines(this);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to show root lines.
***REMOVED*** @param {boolean} b Whether to show root lines.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setShowRootLines = function(b) {
  if (this.showRootLines_ != b) {
    this.showRootLines_ = b;
    if (this.isInDocument()) {
      this.updateLinesAndExpandIcons_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether to show root lines.
***REMOVED***
goog.ui.tree.TreeControl.prototype.getShowRootLines = function() {
  return this.showRootLines_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to show expand icons.
***REMOVED*** @param {boolean} b Whether to show expand icons.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setShowExpandIcons = function(b) {
  if (this.showExpandIcons_ != b) {
    this.showExpandIcons_ = b;
    if (this.isInDocument()) {
      this.updateLinesAndExpandIcons_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether to show expand icons.
***REMOVED***
goog.ui.tree.TreeControl.prototype.getShowExpandIcons = function() {
  return this.showExpandIcons_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to show the root node.
***REMOVED*** @param {boolean} b Whether to show the root node.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setShowRootNode = function(b) {
  if (this.showRootNode_ != b) {
    this.showRootNode_ = b;
    if (this.isInDocument()) {
      var el = this.getRowElement();
      if (el) {
        el.className = this.getRowClassName();
      }
    }
    // Ensure that we do not hide the selected item.
    if (!b && this.getSelectedItem() == this && this.getFirstChild()) {
      this.setSelectedItem(this.getFirstChild());
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether to show the root node.
***REMOVED***
goog.ui.tree.TreeControl.prototype.getShowRootNode = function() {
  return this.showRootNode_;
***REMOVED***


***REMOVED***
***REMOVED*** Add roles and states.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.tree.TreeControl.prototype.initAccessibility = function() {
  goog.ui.tree.TreeControl.superClass_.initAccessibility.call(this);

  var elt = this.getElement();
  goog.asserts.assert(elt, 'The DOM element for the tree cannot be null.');
  goog.a11y.aria.setRole(elt, 'tree');
  goog.a11y.aria.setState(elt, 'labelledby', this.getLabelElement().id);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.enterDocument = function() {
  goog.ui.tree.TreeControl.superClass_.enterDocument.call(this);
  var el = this.getElement();
  el.className = this.getConfig().cssRoot;
  el.setAttribute('hideFocus', 'true');
  this.attachEvents_();
  this.initAccessibility();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.TreeControl.prototype.exitDocument = function() {
  goog.ui.tree.TreeControl.superClass_.exitDocument.call(this);
  this.detachEvents_();
***REMOVED***


***REMOVED***
***REMOVED*** Adds the event listeners to the tree.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.attachEvents_ = function() {
  var el = this.getElement();
  el.tabIndex = 0;

  var kh = this.keyHandler_ = new goog.events.KeyHandler(el);
  var fh = this.focusHandler_ = new goog.events.FocusHandler(el);

  this.getHandler().
      listen(fh, goog.events.FocusHandler.EventType.FOCUSOUT, this.handleBlur_).
      listen(fh, goog.events.FocusHandler.EventType.FOCUSIN, this.handleFocus_).
      listen(kh, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).
      listen(el, goog.events.EventType.MOUSEDOWN, this.handleMouseEvent_).
      listen(el, goog.events.EventType.CLICK, this.handleMouseEvent_).
      listen(el, goog.events.EventType.DBLCLICK, this.handleMouseEvent_);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the event listeners from the tree.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.detachEvents_ = function() {
  this.keyHandler_.dispose();
  this.keyHandler_ = null;
  this.focusHandler_.dispose();
  this.focusHandler_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse events.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.handleMouseEvent_ = function(e) {
  goog.log.fine(this.logger_, 'Received event ' + e.type);
  var node = this.getNodeFromEvent_(e);
  if (node) {
    switch (e.type) {
      case goog.events.EventType.MOUSEDOWN:
        node.onMouseDown(e);
        break;
      case goog.events.EventType.CLICK:
        node.onClick_(e);
        break;
      case goog.events.EventType.DBLCLICK:
        node.onDoubleClick_(e);
        break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles key down on the tree.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} The handled value.
***REMOVED***
goog.ui.tree.TreeControl.prototype.handleKeyEvent = function(e) {
  var handled = false;

  // Handle typeahead and navigation keystrokes.
  handled = this.typeAhead_.handleNavigation(e) ||
            (this.selectedItem_ && this.selectedItem_.onKeyDown(e)) ||
            this.typeAhead_.handleTypeAheadChar(e);

  if (handled) {
    e.preventDefault();
  }

  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Finds the containing node given an event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {goog.ui.tree.BaseNode} The containing node or null if no node is
***REMOVED***     found.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeControl.prototype.getNodeFromEvent_ = function(e) {
  // find the right node
  var node = null;
  var target = e.target;
  while (target != null) {
    var id = target.id;
    node = goog.ui.tree.BaseNode.allNodes[id];
    if (node) {
      return node;
    }
    if (target == this.getElement()) {
      break;
    }
    target = target.parentNode;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new tree node using the same config as the root.
***REMOVED*** @param {string=} opt_html The HTML content of the node label.
***REMOVED*** @return {!goog.ui.tree.TreeNode} The new item.
***REMOVED***
goog.ui.tree.TreeControl.prototype.createNode = function(opt_html) {
  return new goog.ui.tree.TreeNode(opt_html || goog.html.SafeHtml.EMPTY,
      this.getConfig(), this.getDomHelper());
***REMOVED***


***REMOVED***
***REMOVED*** Allows the caller to notify that the given node has been added or just had
***REMOVED*** been updated in the tree.
***REMOVED*** @param {goog.ui.tree.BaseNode} node New node being added or existing node
***REMOVED***    that just had been updated.
***REMOVED***
goog.ui.tree.TreeControl.prototype.setNode = function(node) {
  this.typeAhead_.setNodeInMap(node);
***REMOVED***


***REMOVED***
***REMOVED*** Allows the caller to notify that the given node is being removed from the
***REMOVED*** tree.
***REMOVED*** @param {goog.ui.tree.BaseNode} node Node being removed.
***REMOVED***
goog.ui.tree.TreeControl.prototype.removeNode = function(node) {
  this.typeAhead_.removeNodeFromMap(node);
***REMOVED***


***REMOVED***
***REMOVED*** Clear the typeahead buffer.
***REMOVED***
goog.ui.tree.TreeControl.prototype.clearTypeAhead = function() {
  this.typeAhead_.clear();
***REMOVED***


***REMOVED***
***REMOVED*** A default configuration for the tree.
***REMOVED***
goog.ui.tree.TreeControl.defaultConfig = {
  indentWidth: 19,
  cssRoot: goog.getCssName('goog-tree-root') + ' ' +
      goog.getCssName('goog-tree-item'),
  cssHideRoot: goog.getCssName('goog-tree-hide-root'),
  cssItem: goog.getCssName('goog-tree-item'),
  cssChildren: goog.getCssName('goog-tree-children'),
  cssChildrenNoLines: goog.getCssName('goog-tree-children-nolines'),
  cssTreeRow: goog.getCssName('goog-tree-row'),
  cssItemLabel: goog.getCssName('goog-tree-item-label'),
  cssTreeIcon: goog.getCssName('goog-tree-icon'),
  cssExpandTreeIcon: goog.getCssName('goog-tree-expand-icon'),
  cssExpandTreeIconPlus: goog.getCssName('goog-tree-expand-icon-plus'),
  cssExpandTreeIconMinus: goog.getCssName('goog-tree-expand-icon-minus'),
  cssExpandTreeIconTPlus: goog.getCssName('goog-tree-expand-icon-tplus'),
  cssExpandTreeIconTMinus: goog.getCssName('goog-tree-expand-icon-tminus'),
  cssExpandTreeIconLPlus: goog.getCssName('goog-tree-expand-icon-lplus'),
  cssExpandTreeIconLMinus: goog.getCssName('goog-tree-expand-icon-lminus'),
  cssExpandTreeIconT: goog.getCssName('goog-tree-expand-icon-t'),
  cssExpandTreeIconL: goog.getCssName('goog-tree-expand-icon-l'),
  cssExpandTreeIconBlank: goog.getCssName('goog-tree-expand-icon-blank'),
  cssExpandedFolderIcon: goog.getCssName('goog-tree-expanded-folder-icon'),
  cssCollapsedFolderIcon: goog.getCssName('goog-tree-collapsed-folder-icon'),
  cssFileIcon: goog.getCssName('goog-tree-file-icon'),
  cssExpandedRootIcon: goog.getCssName('goog-tree-expanded-folder-icon'),
  cssCollapsedRootIcon: goog.getCssName('goog-tree-collapsed-folder-icon'),
  cssSelectedRow: goog.getCssName('selected')
***REMOVED***
