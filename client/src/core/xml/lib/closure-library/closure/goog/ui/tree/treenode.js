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
***REMOVED*** @fileoverview Definition of the goog.ui.tree.TreeNode class.
***REMOVED***
***REMOVED***
***REMOVED*** This is a based on the webfx tree control. See file comment in
***REMOVED*** treecontrol.js.
***REMOVED***

goog.provide('goog.ui.tree.TreeNode');

goog.require('goog.ui.tree.BaseNode');



***REMOVED***
***REMOVED*** A single node in the tree.
***REMOVED*** @param {string} html The html content of the node label.
***REMOVED*** @param {Object=} opt_config The configuration for the tree. See
***REMOVED***    goog.ui.tree.TreeControl.defaultConfig. If not specified, a default config
***REMOVED***    will be used.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.tree.BaseNode}
***REMOVED***
goog.ui.tree.TreeNode = function(html, opt_config, opt_domHelper) {
  goog.ui.tree.BaseNode.call(this, html, opt_config, opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.tree.TreeNode, goog.ui.tree.BaseNode);


***REMOVED***
***REMOVED*** The tree the item is in. Cached on demand from the parent.
***REMOVED*** @type {goog.ui.tree.TreeControl?}
***REMOVED*** @private
***REMOVED***
goog.ui.tree.TreeNode.prototype.tree_ = null;


***REMOVED***
***REMOVED*** Returns the tree.
***REMOVED*** @return {goog.ui.tree.TreeControl?} The tree.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.TreeNode.prototype.getTree = function() {
  if (this.tree_) {
    return this.tree_;
  }
  var parent = this.getParent();
  if (parent) {
    var tree = parent.getTree();
    if (tree) {
      this.setTreeInternal(tree);
      return tree;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the source for the icon.
***REMOVED*** @return {string} Src for the icon.
***REMOVED*** @override
***REMOVED***
goog.ui.tree.TreeNode.prototype.getCalculatedIconClass = function() {
  var expanded = this.getExpanded();
  if (expanded && this.expandedIconClass_) {
    return this.expandedIconClass_;
  }
  if (!expanded && this.iconClass_) {
    return this.iconClass_;
  }

  // fall back on default icons
  var config = this.getConfig();
  if (this.hasChildren()) {
    if (expanded && config.cssExpandedFolderIcon) {
      return config.cssTreeIcon + ' ' +
             config.cssExpandedFolderIcon;
    } else if (!expanded && config.cssCollapsedFolderIcon) {
      return config.cssTreeIcon + ' ' +
             config.cssCollapsedFolderIcon;
    }
  } else {
    if (config.cssFileIcon) {
      return config.cssTreeIcon + ' ' + config.cssFileIcon;
    }
  }
  return '';
***REMOVED***
