// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An implementation of DataNode for wrapping JS data.
***REMOVED***
***REMOVED***


goog.provide('goog.ds.JsDataSource');
goog.provide('goog.ds.JsPropertyDataSource');

goog.require('goog.ds.BaseDataNode');
goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.EmptyNodeList');
goog.require('goog.ds.LoadState');


***REMOVED***
***REMOVED*** Data source whose backing is JavaScript data
***REMOVED***
***REMOVED*** Names that are reserved for system use and shouldn't be used for data node
***REMOVED*** names: eval, toSource, toString, unwatch, valueOf, watch. Behavior is
***REMOVED*** undefined if these names are used.
***REMOVED***
***REMOVED*** @param {Object} root The root JS node.
***REMOVED*** @param {string} dataName The name of this node relative to the parent node.
***REMOVED*** @param {Object=} opt_parent Optional parent of this JsDataSource.
***REMOVED***
***REMOVED*** implements goog.ds.DataNode.
***REMOVED***
***REMOVED*** @extends {goog.ds.DataNode}
***REMOVED***
// TODO(arv): Use interfaces when available.
goog.ds.JsDataSource = function(root, dataName, opt_parent) {
  this.parent_ = opt_parent;
  this.dataName_ = dataName;
  this.setRoot(root);
***REMOVED***


***REMOVED***
***REMOVED*** The root JS object. Can be null.
***REMOVED*** @type {*}
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ds.JsDataSource.prototype.root_;


***REMOVED***
***REMOVED*** Sets the root JS object
***REMOVED*** @param {Object} root The root JS object. Can be null.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ds.JsDataSource.prototype.setRoot = function(root) {
  this.root_ = root;
  this.childNodeList_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Set this data source to use list semantics. List data sources:
***REMOVED*** - Are assumed to have child nodes of all of the same type of data
***REMOVED*** - Fire data changes on the root node of the list whenever children
***REMOVED***     are added or removed
***REMOVED*** @param {?boolean} isList True to use list semantics.
***REMOVED*** @private
***REMOVED***
goog.ds.JsDataSource.prototype.setIsList_ = function(isList) {
  this.isList_ = isList;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.JsDataSource.prototype.get = function() {
  return !goog.isObject(this.root_) ? this.root_ : this.getChildNodes();
***REMOVED***


***REMOVED***
***REMOVED*** Set the value of the node
***REMOVED*** @param {*} value The new value of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.set = function(value) {
  if (value && goog.isObject(this.root_)) {
    throw Error('Can\'t set group nodes to new values yet');
  }

  if (this.parent_) {
    this.parent_.root_[this.dataName_] = value;
  }
  this.root_ = value;
  this.childNodeList_ = null;

  goog.ds.DataManager.getInstance().fireDataChange(this.getDataPath());
***REMOVED***


***REMOVED***
***REMOVED*** TODO(user) revisit lazy creation.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getChildNodes = function(opt_selector) {
  if (!this.root_) {
    return new goog.ds.EmptyNodeList();
  }

  if (!opt_selector || opt_selector == goog.ds.STR_ALL_CHILDREN_SELECTOR) {
    this.createChildNodes_(false);
    return this.childNodeList_;
  } else if (opt_selector.indexOf(goog.ds.STR_WILDCARD) == -1) {
    if (this.root_[opt_selector] != null) {
      return new goog.ds.BasicNodeList([this.getChildNode(opt_selector)]);
    } else {
      return new goog.ds.EmptyNodeList();
    }
  } else {
    throw Error('Selector not supported yet (' + opt_selector + ')');
  }

***REMOVED***


***REMOVED***
***REMOVED*** Creates the DataNodeList with the child nodes for this element.
***REMOVED*** Allows for only building list as needed.
***REMOVED***
***REMOVED*** @param {boolean=} opt_force Whether to force recreating child nodes,
***REMOVED***     defaults to false.
***REMOVED*** @private
***REMOVED***
goog.ds.JsDataSource.prototype.createChildNodes_ = function(opt_force) {
  if (this.childNodeList_ && !opt_force) {
    return;
  }

  if (!goog.isObject(this.root_)) {
    this.childNodeList_ = new goog.ds.EmptyNodeList();
    return;
  }

  var childNodeList = new goog.ds.BasicNodeList();
  var newNode;
  if (goog.isArray(this.root_)) {
    var len = this.root_.length;
    for (var i = 0; i < len; i++) {
      // "id" is reserved node name that will map to a named child node
      // TODO(user) Configurable logic for choosing id node
      var node = this.root_[i];
      var id = node.id;
      var name = id != null ? String(id) : '[' + i + ']';
      newNode = new goog.ds.JsDataSource(node, name, this);
      childNodeList.add(newNode);
    }
  } else {
    for (var name in this.root_) {
      var obj = this.root_[name];
      // If the node is already a datasource, then add it.
      if (obj.getDataName) {
        childNodeList.add(obj);
      } else if (!goog.isFunction(obj)) {
        newNode = new goog.ds.JsDataSource(obj, name, this);
        childNodeList.add(newNode);
      }
    }
  }
  this.childNodeList_ = childNodeList;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a named child node of the current node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @param {boolean=} opt_canCreate If true, can create child node.
***REMOVED*** @return {goog.ds.DataNode} The child node, or null if no node of
***REMOVED***     this name exists.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getChildNode = function(name, opt_canCreate) {
  if (!this.root_) {
    return null;
  }
  var node =***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED*** (this.getChildNodes().get(name));
  if (!node && opt_canCreate) {
    var newObj = {***REMOVED***
    if (goog.isArray(this.root_)) {
      newObj['id'] = name;
      this.root_.push(newObj);
    } else {
      this.root_[name] = newObj;
    }
    node = new goog.ds.JsDataSource(newObj, name, this);
    if (this.childNodeList_) {
      this.childNodeList_.add(node);
    }
  }
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of a child node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {Object} The value of the node, or null if no value or the child
***REMOVED***    node doesn't exist.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getChildNodeValue = function(name) {
  if (this.childNodeList_) {
    var node = this.getChildNodes().get(name);
    return node ? node.get() : null;
  } else if (this.root_) {
    return this.root_[name];
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a named child node of the current node.
***REMOVED*** If value is null, removes the child node.
***REMOVED*** @param {string} name The node name.
***REMOVED*** @param {Object} value The value to set, can be DataNode, object,
***REMOVED***     property, or null.
***REMOVED*** @return {Object} The child node, if set.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.setChildNode = function(name, value) {
  var removedPath = null;
  var node = null;
  var addedNode = false;

  // Set node to the DataNode to add - if the value isn't already a DataNode,
  // creates a JsDataSource or JsPropertyDataSource wrapper
  if (value != null) {
    if (value.getDataName) {
      // The value is a DataNode. We must update its parent.
      node = value;
      node.parent_ = this;
    } else {
      if (goog.isArray(value) || goog.isObject(value)) {
        node = new goog.ds.JsDataSource(value, name, this);
      } else {
        node = new goog.ds.JsPropertyDataSource(
           ***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED*** (this.root_), name, this);
      }
    }
  }

  // This logic will get cleaner once we can remove the backing array / object
  // and just rely on the childNodeList_. This is needed until dependent code
  // is cleaned up.
  // TODO(user) Remove backing array / object and just use childNodeList_

  if (goog.isArray(this.root_)) {
    // To remove by name, need to create a map of the child nodes by ID
    this.createChildNodes_();
    var index = this.childNodeList_.indexOf(name);
    if (value == null) {
      // Remove the node
      var nodeToRemove = this.childNodeList_.get(name);
      if (nodeToRemove) {
        removedPath = nodeToRemove.getDataPath();
      }
      this.root_.splice(index, 1);
    } else {
      // Add the node
      if (index) {
        this.root_[index] = value;
      } else {
        this.root_.push(value);
      }
    }
    if (index == null) {
      addedNode = true;
    }
    this.childNodeList_.setNode(name,***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED*** (node));
  } else if (goog.isObject(this.root_)) {
    if (value == null) {
      // Remove the node
      this.createChildNodes_();
      var nodeToRemove = this.childNodeList_.get(name);
      if (nodeToRemove) {
        removedPath = nodeToRemove.getDataPath();
      }
      delete this.root_[name];
    } else {
      // Add the node
      if (!this.root_[name]) {
        addedNode = true;
      }
      this.root_[name] = value;
    }
    // Only need to update childNodeList_ if has been created already
    if (this.childNodeList_) {
      this.childNodeList_.setNode(name,***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED*** (node));
    }
  }

  // Fire the event that the node changed
  var dm = goog.ds.DataManager.getInstance();
  if (node) {
    dm.fireDataChange(node.getDataPath());
    if (addedNode && this.isList()) {
      dm.fireDataChange(this.getDataPath());
      dm.fireDataChange(this.getDataPath() + '/count()');
    }
  } else if (removedPath) {
    dm.fireDataChange(removedPath);
    if (this.isList()) {
      dm.fireDataChange(this.getDataPath());
      dm.fireDataChange(this.getDataPath() + '/count()');
    }
  }
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getDataName = function() {
  return this.dataName_;
***REMOVED***


***REMOVED***
***REMOVED*** Setthe name of the node relative to the parent node
***REMOVED*** @param {string} dataName The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.setDataName = function(dataName) {
  this.dataName_ = dataName;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the a qualified data path to this node
***REMOVED*** @return {string} The data path.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getDataPath = function() {
  var parentPath = '';
  if (this.parent_) {
    parentPath = this.parent_.getDataPath() + goog.ds.STR_PATH_SEPARATOR;
  }

  return parentPath + this.dataName_;
***REMOVED***


***REMOVED***
***REMOVED*** Load or reload the backing data for this node
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.load = function() {
  // Nothing to do
***REMOVED***


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** TODO(user) Discuss null value handling
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.getLoadState = function() {
  return (this.root_ == null) ? goog.ds.LoadState.NOT_LOADED :
      goog.ds.LoadState.LOADED;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the value of this node is a homogeneous list of data
***REMOVED*** @return {boolean} True if a list.
***REMOVED*** @override
***REMOVED***
goog.ds.JsDataSource.prototype.isList = function() {
  return this.isList_ != null ? this.isList_ : goog.isArray(this.root_);
***REMOVED***



***REMOVED***
***REMOVED*** Data source for JavaScript properties that arent objects. Contains reference
***REMOVED*** to parent object so that you can set the vaule
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode} parent Parent object.
***REMOVED*** @param {string} dataName Name of this property.
***REMOVED*** @param {goog.ds.DataNode=} opt_parentDataNode The parent data node. If
***REMOVED***     omitted, assumes that the parent object is the parent data node.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ds.BaseDataNode}
***REMOVED***
goog.ds.JsPropertyDataSource = function(parent, dataName, opt_parentDataNode) {
  goog.ds.BaseDataNode.call(this);
  this.dataName_ = dataName;
  this.parent_ = parent;
  this.parentDataNode_ = opt_parentDataNode || this.parent_;
***REMOVED***
goog.inherits(goog.ds.JsPropertyDataSource, goog.ds.BaseDataNode);


***REMOVED***
***REMOVED*** Get the value of the node
***REMOVED*** @return {Object} The value of the node, or null if no value.
***REMOVED***
goog.ds.JsPropertyDataSource.prototype.get = function() {
  return this.parent_[this.dataName_];
***REMOVED***


***REMOVED***
***REMOVED*** Set the value of the node
***REMOVED*** @param {Object} value The new value of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.JsPropertyDataSource.prototype.set = function(value) {
  var oldValue = this.parent_[this.dataName_];
  this.parent_[this.dataName_] = value;

  if (oldValue != value) {
    goog.ds.DataManager.getInstance().fireDataChange(this.getDataPath());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.JsPropertyDataSource.prototype.getDataName = function() {
  return this.dataName_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.JsPropertyDataSource.prototype.getParent = function() {
  return this.parentDataNode_;
***REMOVED***
