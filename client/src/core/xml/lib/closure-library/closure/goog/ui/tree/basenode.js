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
***REMOVED*** @fileoverview Definition of the goog.ui.tree.BaseNode class.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author jonp@google.com (Jon Perlow)
***REMOVED***
***REMOVED*** This is a based on the webfx tree control. It since been updated to add
***REMOVED*** typeahead support, as well as accessibility support using ARIA framework.
***REMOVED*** See file comment in treecontrol.js.
***REMOVED***

goog.provide('goog.ui.tree.BaseNode');
goog.provide('goog.ui.tree.BaseNode.EventType');

goog.require('goog.Timer');
goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** An abstract base class for a node in the tree.
***REMOVED***
***REMOVED*** @param {string} html The html content of the node label.
***REMOVED*** @param {Object=} opt_config The configuration for the tree. See
***REMOVED***    {@link goog.ui.tree.TreeControl.defaultConfig}. If not specified the
***REMOVED***    default config will be used.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.tree.BaseNode = function(html, opt_config, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The configuration for the tree.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.config_ = opt_config || goog.ui.tree.TreeControl.defaultConfig;

 ***REMOVED*****REMOVED***
  ***REMOVED*** HTML content of the node label.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.html_ = html;
***REMOVED***
goog.inherits(goog.ui.tree.BaseNode, goog.ui.Component);


***REMOVED***
***REMOVED*** The event types dispatched by this class.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.tree.BaseNode.EventType = {
  BEFORE_EXPAND: 'beforeexpand',
  EXPAND: 'expand',
  BEFORE_COLLAPSE: 'beforecollapse',
  COLLAPSE: 'collapse'
***REMOVED***


***REMOVED***
***REMOVED*** Map of nodes in existence. Needed to route events to the appropriate nodes.
***REMOVED*** Nodes are added to the map at {@link #enterDocument} time and removed at
***REMOVED*** {@link #exitDocument} time.
***REMOVED*** @type {Object}
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.allNodes = {***REMOVED***


***REMOVED***
***REMOVED*** Whether the tree item is selected.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.selected_ = false;


***REMOVED***
***REMOVED*** Whether the tree node is expanded.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.expanded_ = false;


***REMOVED***
***REMOVED*** Tooltip for the tree item
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.toolTip_ = null;


***REMOVED***
***REMOVED*** HTML that can appear after the label (so not inside the anchor).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.afterLabelHtml_ = '';


***REMOVED***
***REMOVED*** Whether to allow user to collapse this node.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.isUserCollapsible_ = true;


***REMOVED***
***REMOVED*** Nesting depth of this node; cached result of computeDepth_.
***REMOVED*** -1 if value has not been cached.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.depth_ = -1;


***REMOVED*** @override***REMOVED***
goog.ui.tree.BaseNode.prototype.disposeInternal = function() {
  goog.ui.tree.BaseNode.superClass_.disposeInternal.call(this);
  if (this.tree_) {
    this.tree_.removeNode(this);
    this.tree_ = null;
  }
  this.setElementInternal(null);
***REMOVED***


***REMOVED***
***REMOVED*** Adds roles and states.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.initAccessibility = function() {
  var el = this.getElement();
  if (el) {
    // Set an id for the label
    var label = this.getLabelElement();
    if (label && !label.id) {
      label.id = this.getId() + '.label';
    }

    goog.a11y.aria.setRole(el, 'treeitem');
    goog.a11y.aria.setState(el, 'selected', false);
    goog.a11y.aria.setState(el, 'expanded', false);
    goog.a11y.aria.setState(el, 'level', this.getDepth());
    if (label) {
      goog.a11y.aria.setState(el, 'labelledby', label.id);
    }

    var img = this.getIconElement();
    if (img) {
      goog.a11y.aria.setRole(img, 'presentation');
    }
    var ei = this.getExpandIconElement();
    if (ei) {
      goog.a11y.aria.setRole(ei, 'presentation');
    }

    var ce = this.getChildrenElement();
    if (ce) {
      goog.a11y.aria.setRole(ce, 'group');

      // In case the children will be created lazily.
      if (ce.hasChildNodes()) {
        // do setsize for each child
        var count = this.getChildCount();
        for (var i = 1; i <= count; i++) {
          var child = this.getChildAt(i - 1).getElement();
          goog.asserts.assert(child, 'The child element cannot be null');
          goog.a11y.aria.setState(child, 'setsize', count);
          goog.a11y.aria.setState(child, 'posinset', i);
        }
      }
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.BaseNode.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(***REMOVED*** @type {Element}***REMOVED*** (element));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.BaseNode.prototype.enterDocument = function() {
  goog.ui.tree.BaseNode.superClass_.enterDocument.call(this);
  goog.ui.tree.BaseNode.allNodes[this.getId()] = this;
  this.initAccessibility();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.tree.BaseNode.prototype.exitDocument = function() {
  goog.ui.tree.BaseNode.superClass_.exitDocument.call(this);
  delete goog.ui.tree.BaseNode.allNodes[this.getId()];
***REMOVED***


***REMOVED***
***REMOVED*** The method assumes that the child doesn't have parent node yet.
***REMOVED*** The {@code opt_render} argument is not used. If the parent node is expanded,
***REMOVED*** the child node's state will be the same as the parent's. Otherwise the
***REMOVED*** child's DOM tree won't be created.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.BaseNode.prototype.addChildAt = function(child, index,
    opt_render) {
  goog.asserts.assert(!child.getParent());
  var prevNode = this.getChildAt(index - 1);
  var nextNode = this.getChildAt(index);

  goog.ui.tree.BaseNode.superClass_.addChildAt.call(this, child, index);

  child.previousSibling_ = prevNode;
  child.nextSibling_ = nextNode;

  if (prevNode) {
    prevNode.nextSibling_ = child;
  } else {
    this.firstChild_ = child;
  }
  if (nextNode) {
    nextNode.previousSibling_ = child;
  } else {
    this.lastChild_ = child;
  }

  var tree = this.getTree();
  if (tree) {
    child.setTreeInternal(tree);
  }

  child.setDepth_(this.getDepth() + 1);

  if (this.getElement()) {
    this.updateExpandIcon();
    if (this.getExpanded()) {
      var el = this.getChildrenElement();
      if (!child.getElement()) {
        child.createDom();
      }
      var childElement = child.getElement();
      var nextElement = nextNode && nextNode.getElement();
      el.insertBefore(childElement, nextElement);

      if (this.isInDocument()) {
        child.enterDocument();
      }

      if (!nextNode) {
        if (prevNode) {
          prevNode.updateExpandIcon();
        } else {
          goog.style.showElement(el, true);
          this.setExpanded(this.getExpanded());
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a node as a child to the current node.
***REMOVED*** @param {goog.ui.tree.BaseNode} child The child to add.
***REMOVED*** @param {goog.ui.tree.BaseNode=} opt_before If specified, the new child is
***REMOVED***    added as a child before this one. If not specified, it's appended to the
***REMOVED***    end.
***REMOVED*** @return {goog.ui.tree.BaseNode} The added child.
***REMOVED***
goog.ui.tree.BaseNode.prototype.add = function(child, opt_before) {
  goog.asserts.assert(!opt_before || opt_before.getParent() == this,
      'Can only add nodes before siblings');
  if (child.getParent()) {
    child.getParent().removeChild(child);
  }
  this.addChildAt(child,
      opt_before ? this.indexOfChild(opt_before) : this.getChildCount());
  return child;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a child. The caller is responsible for disposing the node.
***REMOVED*** @param {goog.ui.Component|string} childNode The child to remove. Must be a
***REMOVED***     {@link goog.ui.tree.BaseNode}.
***REMOVED*** @param {boolean=} opt_unrender Unused. The child will always be unrendered.
***REMOVED*** @return {goog.ui.tree.BaseNode} The child that was removed.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.BaseNode.prototype.removeChild =
    function(childNode, opt_unrender) {
  // In reality, this only accepts BaseNodes.
  var child =***REMOVED*****REMOVED*** @type {goog.ui.tree.BaseNode}***REMOVED*** (childNode);

  // if we remove selected or tree with the selected we should select this
  var tree = this.getTree();
  var selectedNode = tree ? tree.getSelectedItem() : null;
  if (selectedNode == child || child.contains(selectedNode)) {
    if (tree.hasFocus()) {
      this.select();
      goog.Timer.callOnce(this.onTimeoutSelect_, 10, this);
    } else {
      this.select();
    }
  }

  goog.ui.tree.BaseNode.superClass_.removeChild.call(this, child);

  if (this.lastChild_ == child) {
    this.lastChild_ = child.previousSibling_;
  }
  if (this.firstChild_ == child) {
    this.firstChild_ = child.nextSibling_;
  }
  if (child.previousSibling_) {
    child.previousSibling_.nextSibling_ = child.nextSibling_;
  }
  if (child.nextSibling_) {
    child.nextSibling_.previousSibling_ = child.previousSibling_;
  }

  var wasLast = child.isLastSibling();

  child.tree_ = null;
  child.depth_ = -1;

  if (tree) {
    // Tell the tree control that this node is now removed.
    tree.removeNode(this);

    if (this.isInDocument()) {
      var el = this.getChildrenElement();

      if (child.isInDocument()) {
        var childEl = child.getElement();
        el.removeChild(childEl);

        child.exitDocument();
      }

      if (wasLast) {
        var newLast = this.getLastChild();
        if (newLast) {
          newLast.updateExpandIcon();
        }
      }
      if (!this.hasChildren()) {
        el.style.display = 'none';
        this.updateExpandIcon();
        this.updateIcon_();
      }
    }
  }

  return child;
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Use {@link #removeChild}.
***REMOVED***
goog.ui.tree.BaseNode.prototype.remove =
    goog.ui.tree.BaseNode.prototype.removeChild;


***REMOVED***
***REMOVED*** Handler for setting focus asynchronously.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.onTimeoutSelect_ = function() {
  this.select();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tree.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getTree = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the depth of the node in the tree. Should not be overridden.
***REMOVED*** @return {number} The non-negative depth of this node (the root is zero).
***REMOVED***
goog.ui.tree.BaseNode.prototype.getDepth = function() {
  var depth = this.depth_;
  if (depth < 0) {
    depth = this.computeDepth_();
    this.setDepth_(depth);
  }
  return depth;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the depth of the node in the tree.
***REMOVED*** Called only by getDepth, when the depth hasn't already been cached.
***REMOVED*** @return {number} The non-negative depth of this node (the root is zero).
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.computeDepth_ = function() {
  var parent = this.getParent();
  if (parent) {
    return parent.getDepth() + 1;
  } else {
    return 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the depth of a node (and all its descendants).
***REMOVED*** @param {number} depth The new nesting depth; must be non-negative.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.setDepth_ = function(depth) {
  if (depth != this.depth_) {
    this.depth_ = depth;
    var row = this.getRowElement();
    if (row) {
      var indent = this.getPixelIndent_() + 'px';
      if (this.isRightToLeft()) {
        row.style.paddingRight = indent;
      } else {
        row.style.paddingLeft = indent;
      }
    }
    this.forEachChild(function(child) {
      child.setDepth_(depth + 1);
    });
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the node is a descendant of this node
***REMOVED*** @param {goog.ui.tree.BaseNode} node The node to check.
***REMOVED*** @return {boolean} True if the node is a descendant of this node, false
***REMOVED***    otherwise.
***REMOVED***
goog.ui.tree.BaseNode.prototype.contains = function(node) {
  var current = node;
  while (current) {
    if (current == this) {
      return true;
    }
    current = current.getParent();
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** An array of empty children to return for nodes that have no children.
***REMOVED*** @type {!Array.<!goog.ui.tree.BaseNode>}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.EMPTY_CHILDREN_ = [];


***REMOVED***
***REMOVED*** @param {number} index 0-based index.
***REMOVED*** @return {goog.ui.tree.BaseNode} The child at the given index; null if none.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getChildAt;


***REMOVED***
***REMOVED*** Returns the children of this node.
***REMOVED*** @return {!Array.<!goog.ui.tree.BaseNode>} The children.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getChildren = function() {
  var children = [];
  this.forEachChild(function(child) {
    children.push(child);
  });
  return children;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The first child of this node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getFirstChild = function() {
  return this.getChildAt(0);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The last child of this node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLastChild = function() {
  return this.getChildAt(this.getChildCount() - 1);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The previous sibling of this node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getPreviousSibling = function() {
  return this.previousSibling_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The next sibling of this node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getNextSibling = function() {
  return this.nextSibling_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the node is the last sibling.
***REMOVED***
goog.ui.tree.BaseNode.prototype.isLastSibling = function() {
  return !this.nextSibling_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the node is selected.
***REMOVED***
goog.ui.tree.BaseNode.prototype.isSelected = function() {
  return this.selected_;
***REMOVED***


***REMOVED***
***REMOVED*** Selects the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.select = function() {
  var tree = this.getTree();
  if (tree) {
    tree.setSelectedItem(this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Originally it was intended to deselect the node but never worked.
***REMOVED*** @deprecated Use {@code tree.setSelectedItem(null)}.
***REMOVED***
goog.ui.tree.BaseNode.prototype.deselect = goog.nullFunction;


***REMOVED***
***REMOVED*** Called from the tree to instruct the node change its selection state.
***REMOVED*** @param {boolean} selected The new selection state.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.setSelectedInternal = function(selected) {
  if (this.selected_ == selected) {
    return;
  }
  this.selected_ = selected;

  this.updateRow();

  var el = this.getElement();
  if (el) {
    goog.a11y.aria.setState(el, 'selected', selected);
    if (selected) {
      var treeElement = this.getTree().getElement();
      goog.asserts.assert(treeElement,
          'The DOM element for the tree cannot be null');
      goog.a11y.aria.setState(treeElement,
          'activedescendant',
          this.getId());
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the node is expanded.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getExpanded = function() {
  return this.expanded_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the node to be expanded internally, without state change events.
***REMOVED*** @param {boolean} expanded Whether to expand or close the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setExpandedInternal = function(expanded) {
  this.expanded_ = expanded;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the node to be expanded.
***REMOVED*** @param {boolean} expanded Whether to expand or close the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setExpanded = function(expanded) {
  var isStateChange = expanded != this.expanded_;
  if (isStateChange) {
    // Only fire events if the expanded state has actually changed.
    var prevented = !this.dispatchEvent(
        expanded ? goog.ui.tree.BaseNode.EventType.BEFORE_EXPAND :
        goog.ui.tree.BaseNode.EventType.BEFORE_COLLAPSE);
    if (prevented) return;
  }
  var ce;
  this.expanded_ = expanded;
  var tree = this.getTree();
  var el = this.getElement();

  if (this.hasChildren()) {
    if (!expanded && tree && this.contains(tree.getSelectedItem())) {
      this.select();
    }

    if (el) {
      ce = this.getChildrenElement();
      if (ce) {
        goog.style.showElement(ce, expanded);

        // Make sure we have the HTML for the children here.
        if (expanded && this.isInDocument() && !ce.hasChildNodes()) {
          var sb = new goog.string.StringBuffer();
          this.forEachChild(function(child) {
            child.toHtml(sb);
          });
          ce.innerHTML = sb.toString();
          this.forEachChild(function(child) {
            child.enterDocument();
          });
        }
      }
      this.updateExpandIcon();
    }
  } else {
    ce = this.getChildrenElement();
    if (ce) {
      goog.style.showElement(ce, false);
    }
  }
  if (el) {
    this.updateIcon_();
    goog.a11y.aria.setState(el, 'expanded', expanded);
  }

  if (isStateChange) {
    this.dispatchEvent(expanded ? goog.ui.tree.BaseNode.EventType.EXPAND :
                       goog.ui.tree.BaseNode.EventType.COLLAPSE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Toggles the expanded state of the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.toggle = function() {
  this.setExpanded(!this.getExpanded());
***REMOVED***


***REMOVED***
***REMOVED*** Expands the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.expand = function() {
  this.setExpanded(true);
***REMOVED***


***REMOVED***
***REMOVED*** Collapses the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.collapse = function() {
  this.setExpanded(false);
***REMOVED***


***REMOVED***
***REMOVED*** Collapses the children of the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.collapseChildren = function() {
  this.forEachChild(function(child) {
    child.collapseAll();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Collapses the children and the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.collapseAll = function() {
  this.collapseChildren();
  this.collapse();
***REMOVED***


***REMOVED***
***REMOVED*** Expands the children of the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.expandChildren = function() {
  this.forEachChild(function(child) {
    child.expandAll();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Expands the children and the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.expandAll = function() {
  this.expandChildren();
  this.expand();
***REMOVED***


***REMOVED***
***REMOVED*** Expands the parent chain of this node so that it is visible.
***REMOVED***
goog.ui.tree.BaseNode.prototype.reveal = function() {
  var parent = this.getParent();
  if (parent) {
    parent.setExpanded(true);
    parent.reveal();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the node will allow the user to collapse it.
***REMOVED*** @param {boolean} isCollapsible Whether to allow node collapse.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setIsUserCollapsible = function(isCollapsible) {
  this.isUserCollapsible_ = isCollapsible;
  if (!this.isUserCollapsible_) {
    this.expand();
  }
  if (this.getElement()) {
    this.updateExpandIcon();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the node is collapsible by user actions.
***REMOVED***
goog.ui.tree.BaseNode.prototype.isUserCollapsible = function() {
  return this.isUserCollapsible_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the html for the node.
***REMOVED*** @param {goog.string.StringBuffer} sb A string buffer to append the HTML to.
***REMOVED***
goog.ui.tree.BaseNode.prototype.toHtml = function(sb) {
  var tree = this.getTree();
  var hideLines = !tree.getShowLines() ||
      tree == this.getParent() && !tree.getShowRootLines();

  var childClass = hideLines ? this.config_.cssChildrenNoLines :
      this.config_.cssChildren;

  var nonEmptyAndExpanded = this.getExpanded() && this.hasChildren();

  sb.append('<div class="', this.config_.cssItem, '" id="', this.getId(), '">',
      this.getRowHtml(),
      '<div class="', childClass, '" style="',
      this.getLineStyle(),
      (nonEmptyAndExpanded ? '' : 'display:none;'),
      '">');

  if (nonEmptyAndExpanded) {
    // children
    this.forEachChild(function(child) {
      child.toHtml(sb);
    });
  }

  // and tags
  sb.append('</div></div>');
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The pixel indent of the row.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.getPixelIndent_ = function() {
  return Math.max(0, (this.getDepth() - 1)***REMOVED*** this.config_.indentWidth);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html for the row.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getRowHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getRowClassName(), '" style="padding-',
      this.isRightToLeft() ? 'right:' : 'left:',
      this.getPixelIndent_(), 'px">',
      this.getExpandIconHtml(),
      this.getIconHtml(),
      this.getLabelHtml(),
      '</div>');
  return sb.toString();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The class name for the row.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getRowClassName = function() {
  var selectedClass;
  if (this.isSelected()) {
    selectedClass = ' ' + this.config_.cssSelectedRow;
  } else {
    selectedClass = '';
  }
  return this.config_.cssTreeRow + selectedClass;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html for the label.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLabelHtml = function() {
  var toolTip = this.getToolTip();
  var sb = new goog.string.StringBuffer();
  sb.append('<span class="', this.config_.cssItemLabel, '"',
      (toolTip ? ' title="' + goog.string.htmlEscape(toolTip) + '"' : ''),
      '>', this.getHtml(), '</span>',
      '<span>', this.getAfterLabelHtml(), '</span>');
  return sb.toString();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the html that appears after the label. This is useful if you want to
***REMOVED*** put extra UI on the row of the label but not inside the anchor tag.
***REMOVED*** @return {string} The html.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getAfterLabelHtml = function() {
  return this.afterLabelHtml_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the html that appears after the label. This is useful if you want to
***REMOVED*** put extra UI on the row of the label but not inside the anchor tag.
***REMOVED*** @param {string} html The html.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setAfterLabelHtml = function(html) {
  this.afterLabelHtml_ = html;
  var el = this.getAfterLabelElement();
  if (el) {
    el.innerHTML = html;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html for the icon.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getIconHtml = function() {
  return '<span style="display:inline-block" class="' +
      this.getCalculatedIconClass() + '"></span>';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the calculated icon class.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getCalculatedIconClass = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {string} The source for the icon.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getExpandIconHtml = function() {
  return '<span type="expand" style="display:inline-block" class="' +
      this.getExpandIconClass() + '"></span>';
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The class names of the icon used for expanding the node.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getExpandIconClass = function() {
  var tree = this.getTree();
  var hideLines = !tree.getShowLines() ||
      tree == this.getParent() && !tree.getShowRootLines();

  var config = this.config_;
  var sb = new goog.string.StringBuffer();
  sb.append(config.cssTreeIcon, ' ', config.cssExpandTreeIcon, ' ');

  if (this.hasChildren()) {
    var bits = 0;
    /*
      Bitmap used to determine which icon to use
      1  Plus
      2  Minus
      4  T Line
      8  L Line
  ***REMOVED*****REMOVED***

    if (tree.getShowExpandIcons() && this.isUserCollapsible_) {
      if (this.getExpanded()) {
        bits = 2;
      } else {
        bits = 1;
      }
    }

    if (!hideLines) {
      if (this.isLastSibling()) {
        bits += 4;
      } else {
        bits += 8;
      }
    }

    switch (bits) {
      case 1:
        sb.append(config.cssExpandTreeIconPlus);
        break;
      case 2:
        sb.append(config.cssExpandTreeIconMinus);
        break;
      case 4:
        sb.append(config.cssExpandTreeIconL);
        break;
      case 5:
        sb.append(config.cssExpandTreeIconLPlus);
        break;
      case 6:
        sb.append(config.cssExpandTreeIconLMinus);
        break;
      case 8:
        sb.append(config.cssExpandTreeIconT);
        break;
      case 9:
        sb.append(config.cssExpandTreeIconTPlus);
        break;
      case 10:
        sb.append(config.cssExpandTreeIconTMinus);
        break;
      default:  // 0
        sb.append(config.cssExpandTreeIconBlank);
    }
  } else {
    if (hideLines) {
      sb.append(config.cssExpandTreeIconBlank);
    } else if (this.isLastSibling()) {
      sb.append(config.cssExpandTreeIconL);
    } else {
      sb.append(config.cssExpandTreeIconT);
    }
  }
  return sb.toString();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The line style.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLineStyle = function() {
  return 'background-position:' + this.getLineStyle2() + ';';
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The line style.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLineStyle2 = function() {
  return (this.isLastSibling() ? '-100' :
          (this.getDepth() - 1)***REMOVED*** this.config_.indentWidth) + 'px 0';
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element for the tree node.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.BaseNode.prototype.getElement = function() {
  var el = goog.ui.tree.BaseNode.superClass_.getElement.call(this);
  if (!el) {
    el = this.getDomHelper().getElement(this.getId());
    this.setElementInternal(el);
  }
  return el;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The row is the div that is used to draw the node without
***REMOVED***     the children.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getRowElement = function() {
  var el = this.getElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.firstChild) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The expanded icon element.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getExpandIconElement = function() {
  var el = this.getRowElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.firstChild) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The icon element.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getIconElement = function() {
  var el = this.getRowElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.childNodes[1]) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The label element.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLabelElement = function() {
  var el = this.getRowElement();
  // TODO: find/fix race condition that requires us to add
  // the lastChild check
  return el && el.lastChild ?
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.lastChild.previousSibling) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element after the label.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getAfterLabelElement = function() {
  var el = this.getRowElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.lastChild) : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The div containing the children.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.getChildrenElement = function() {
  var el = this.getElement();
  return el ?***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.lastChild) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the icon class for the node.
***REMOVED*** @param {string} s The icon class.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setIconClass = function(s) {
  this.iconClass_ = s;
  if (this.isInDocument()) {
    this.updateIcon_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the icon class for the node.
***REMOVED*** @return {string} s The icon source.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getIconClass = function() {
  return this.iconClass_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the icon class for when the node is expanded.
***REMOVED*** @param {string} s The expanded icon class.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setExpandedIconClass = function(s) {
  this.expandedIconClass_ = s;
  if (this.isInDocument()) {
    this.updateIcon_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the icon class for when the node is expanded.
***REMOVED*** @return {string} The class.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getExpandedIconClass = function() {
  return this.expandedIconClass_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the text of the label.
***REMOVED*** @param {string} s The plain text of the label.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setText = function(s) {
  this.setHtml(goog.string.htmlEscape(s));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text of the label. If the text was originally set as HTML, the
***REMOVED*** return value is unspecified.
***REMOVED*** @return {string} The plain text of the label.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getText = function() {
  return goog.string.unescapeEntities(this.getHtml());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the html of the label.
***REMOVED*** @param {string} s The html string for the label.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setHtml = function(s) {
  this.html_ = s;
  var el = this.getLabelElement();
  if (el) {
    el.innerHTML = s;
  }
  var tree = this.getTree();
  if (tree) {
    // Tell the tree control about the updated label text.
    tree.setNode(this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the html of the label.
***REMOVED*** @return {string} The html string of the label.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getHtml = function() {
  return this.html_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the text of the tooltip.
***REMOVED*** @param {string} s The tooltip text to set.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setToolTip = function(s) {
  this.toolTip_ = s;
  var el = this.getLabelElement();
  if (el) {
    el.title = s;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text of the tooltip.
***REMOVED*** @return {?string} The tooltip text.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getToolTip = function() {
  return this.toolTip_;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the row styles.
***REMOVED***
goog.ui.tree.BaseNode.prototype.updateRow = function() {
  var rowEl = this.getRowElement();
  if (rowEl) {
    rowEl.className = this.getRowClassName();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the expand icon of the node.
***REMOVED***
goog.ui.tree.BaseNode.prototype.updateExpandIcon = function() {
  var img = this.getExpandIconElement();
  if (img) {
    img.className = this.getExpandIconClass();
  }
  var cel = this.getChildrenElement();
  if (cel) {
    cel.style.backgroundPosition = this.getLineStyle2();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the icon of the node. Assumes that this.getElement() is created.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.updateIcon_ = function() {
  this.getIconElement().className = this.getCalculatedIconClass();
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse down event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.onMouseDown = function(e) {
  var el = e.target;
  // expand icon
  var type = el.getAttribute('type');
  if (type == 'expand' && this.hasChildren()) {
    if (this.isUserCollapsible_) {
      this.toggle();
    }
    return;
  }

  this.select();
  this.updateRow();
***REMOVED***


***REMOVED***
***REMOVED*** Handles a click event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.tree.BaseNode.prototype.onClick_ = goog.events.Event.preventDefault;


***REMOVED***
***REMOVED*** Handles a double click event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.tree.BaseNode.prototype.onDoubleClick_ = function(e) {
  var el = e.target;
  // expand icon
  var type = el.getAttribute('type');
  if (type == 'expand' && this.hasChildren()) {
    return;
  }

  if (this.isUserCollapsible_) {
    this.toggle();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key down event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} The handled value.
***REMOVED*** @protected
***REMOVED***
goog.ui.tree.BaseNode.prototype.onKeyDown = function(e) {
  var handled = true;
  switch (e.keyCode) {
    case goog.events.KeyCodes.RIGHT:
      if (e.altKey) {
        break;
      }
      if (this.hasChildren()) {
        if (!this.getExpanded()) {
          this.setExpanded(true);
        } else {
          this.getFirstChild().select();
        }
      }
      break;

    case goog.events.KeyCodes.LEFT:
      if (e.altKey) {
        break;
      }
      if (this.hasChildren() && this.getExpanded() && this.isUserCollapsible_) {
        this.setExpanded(false);
      } else {
        var parent = this.getParent();
        var tree = this.getTree();
        // don't go to root if hidden
        if (parent && (tree.getShowRootNode() || parent != tree)) {
          parent.select();
        }
      }
      break;

    case goog.events.KeyCodes.DOWN:
      var nextNode = this.getNextShownNode();
      if (nextNode) {
        nextNode.select();
      }
      break;

    case goog.events.KeyCodes.UP:
      var previousNode = this.getPreviousShownNode();
      if (previousNode) {
        previousNode.select();
      }
      break;

    default:
      handled = false;
  }

  if (handled) {
    e.preventDefault();
    var tree = this.getTree();
    if (tree) {
      // clear type ahead buffer as user navigates with arrow keys
      tree.clearTypeAhead();
    }
  }

  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key down event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.tree.BaseNode.prototype.onKeyPress_ = function(e) {
  if (!e.altKey && e.keyCode >= goog.events.KeyCodes.LEFT &&
      e.keyCode <= goog.events.KeyCodes.DOWN) {
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The last shown descendant.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getLastShownDescendant = function() {
  if (!this.getExpanded() || !this.hasChildren()) {
    return this;
  }
  // we know there is at least 1 child
  return this.getLastChild().getLastShownDescendant();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The next node to show or null if there isn't
***REMOVED***     a next node to show.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getNextShownNode = function() {
  if (this.hasChildren() && this.getExpanded()) {
    return this.getFirstChild();
  } else {
    var parent = this;
    var next;
    while (parent != this.getTree()) {
      next = parent.getNextSibling();
      if (next != null) {
        return next;
      }
      parent = parent.getParent();
    }
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.tree.BaseNode} The previous node to show.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getPreviousShownNode = function() {
  var ps = this.getPreviousSibling();
  if (ps != null) {
    return ps.getLastShownDescendant();
  }
  var parent = this.getParent();
  var tree = this.getTree();
  if (!tree.getShowRootNode() && parent == tree) {
    return null;
  }
  return***REMOVED*****REMOVED*** @type {goog.ui.tree.BaseNode}***REMOVED*** (parent);
***REMOVED***


***REMOVED***
***REMOVED*** @return {*} Data set by the client.
***REMOVED*** @deprecated Use {@link #getModel} instead.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getClientData =
    goog.ui.tree.BaseNode.prototype.getModel;


***REMOVED***
***REMOVED*** Sets client data to associate with the node.
***REMOVED*** @param {*} data The client data to associate with the node.
***REMOVED*** @deprecated Use {@link #setModel} instead.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setClientData =
    goog.ui.tree.BaseNode.prototype.setModel;


***REMOVED***
***REMOVED*** @return {Object} The configuration for the tree.
***REMOVED***
goog.ui.tree.BaseNode.prototype.getConfig = function() {
  return this.config_;
***REMOVED***


***REMOVED***
***REMOVED*** Internal method that is used to set the tree control on the node.
***REMOVED*** @param {goog.ui.tree.TreeControl} tree The tree control.
***REMOVED***
goog.ui.tree.BaseNode.prototype.setTreeInternal = function(tree) {
  if (this.tree_ != tree) {
    this.tree_ = tree;
    // Add new node to the type ahead node map.
    tree.setNode(this);
    this.forEachChild(function(child) {
      child.setTreeInternal(tree);
    });
  }
***REMOVED***
