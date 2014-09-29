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
***REMOVED*** @fileoverview Generic rich data access API.
***REMOVED***
***REMOVED*** Abstraction for data sources that allows listening for changes at different
***REMOVED*** levels of the data tree and updating the data via XHR requests
***REMOVED***
***REMOVED***


goog.provide('goog.ds.BaseDataNode');
goog.provide('goog.ds.BasicNodeList');
goog.provide('goog.ds.DataNode');
goog.provide('goog.ds.DataNodeList');
goog.provide('goog.ds.EmptyNodeList');
goog.provide('goog.ds.LoadState');
goog.provide('goog.ds.SortedNodeList');
goog.provide('goog.ds.Util');
goog.provide('goog.ds.logger');

goog.require('goog.array');
goog.require('goog.debug.Logger');



***REMOVED***
***REMOVED*** Interface for node in rich data tree.
***REMOVED***
***REMOVED*** Names that are reserved for system use and shouldn't be used for data node
***REMOVED*** names: eval, toSource, toString, unwatch, valueOf, watch. Behavior is
***REMOVED*** undefined if these names are used.
***REMOVED***
***REMOVED***
***REMOVED***
goog.ds.DataNode = function() {***REMOVED***


***REMOVED***
***REMOVED*** Get the value of the node
***REMOVED*** @param {...?} var_args Do not check arity of arguments, because
***REMOVED***     some subclasses require args.
***REMOVED*** @return {*} The value of the node, or null if no value.
***REMOVED***
goog.ds.DataNode.prototype.get = goog.abstractMethod;


***REMOVED***
***REMOVED*** Set the value of the node
***REMOVED*** @param {*} value The new value of the node.
***REMOVED***
goog.ds.DataNode.prototype.set = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets all of the child nodes of the current node.
***REMOVED*** Should return an empty DataNode list if no child nodes.
***REMOVED*** @param {string=} opt_selector String selector to choose child nodes.
***REMOVED*** @return {goog.ds.DataNodeList} The child nodes.
***REMOVED***
goog.ds.DataNode.prototype.getChildNodes = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets a named child node of the current node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @param {boolean=} opt_canCreate Whether to create a child node if it does not
***REMOVED***     exist.
***REMOVED*** @return {goog.ds.DataNode} The child node, or null
***REMOVED*** if no node of this name exists.
***REMOVED***
goog.ds.DataNode.prototype.getChildNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets the value of a child node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {*} The value of the node, or null if no value or the child node
***REMOVED***     doesn't exist.
***REMOVED***
goog.ds.DataNode.prototype.getChildNodeValue = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets a named child node of the current node.
***REMOVED***
***REMOVED*** @param {string} name The node name.
***REMOVED*** @param {Object} value The value to set, can be DataNode, object, property,
***REMOVED***     or null. If value is null, removes the child node.
***REMOVED*** @return {Object} The child node, if the node was set.
***REMOVED***
goog.ds.DataNode.prototype.setChildNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED***
goog.ds.DataNode.prototype.getDataName = goog.abstractMethod;


***REMOVED***
***REMOVED*** Set the name of the node relative to the parent node
***REMOVED*** @param {string} name The name of the node.
***REMOVED***
goog.ds.DataNode.prototype.setDataName = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets the a qualified data path to this node
***REMOVED*** @return {string} The data path.
***REMOVED***
goog.ds.DataNode.prototype.getDataPath = goog.abstractMethod;


***REMOVED***
***REMOVED*** Load or reload the backing data for this node
***REMOVED***
goog.ds.DataNode.prototype.load = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED***
goog.ds.DataNode.prototype.getLoadState = goog.abstractMethod;


***REMOVED***
***REMOVED*** Whether the value of this node is a homogeneous list of data
***REMOVED*** @return {boolean} True if a list.
***REMOVED***
goog.ds.DataNode.prototype.isList = goog.abstractMethod;


***REMOVED***
***REMOVED*** Enum for load state of a DataNode.
***REMOVED*** @enum {string}
***REMOVED***
goog.ds.LoadState = {
  LOADED: 'LOADED',
  LOADING: 'LOADING',
  FAILED: 'FAILED',
  NOT_LOADED: 'NOT_LOADED'
***REMOVED***



***REMOVED***
***REMOVED*** Base class for data node functionality, has default implementations for
***REMOVED*** many of the functions.
***REMOVED***
***REMOVED*** implements {goog.ds.DataNode}
***REMOVED***
***REMOVED***
goog.ds.BaseDataNode = function() {***REMOVED***


***REMOVED***
***REMOVED*** Set the value of the node
***REMOVED*** @param {Object} value The new value of the node.
***REMOVED***
goog.ds.BaseDataNode.prototype.set = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets all of the child nodes of the current node.
***REMOVED*** Should return an empty DataNode list if no child nodes.
***REMOVED*** @param {string=} opt_selector String selector to choose child nodes.
***REMOVED*** @return {goog.ds.DataNodeList} The child nodes.
***REMOVED***
goog.ds.BaseDataNode.prototype.getChildNodes = function(opt_selector) {
  return new goog.ds.EmptyNodeList();
***REMOVED***


***REMOVED***
***REMOVED*** Gets a named child node of the current node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @param {boolean=} opt_canCreate Whether you can create the child node if
***REMOVED***     it doesn't exist already.
***REMOVED*** @return {goog.ds.DataNode} The child node, or null if no node of
***REMOVED***     this name exists and opt_create is false.
***REMOVED***
goog.ds.BaseDataNode.prototype.getChildNode = function(name, opt_canCreate) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of a child node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {Object} The value of the node, or null if no value or the
***REMOVED***     child node doesn't exist.
***REMOVED***
goog.ds.BaseDataNode.prototype.getChildNodeValue = function(name) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED***
goog.ds.BaseDataNode.prototype.getDataName = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets the a qualified data path to this node
***REMOVED*** @return {string} The data path.
***REMOVED***
goog.ds.BaseDataNode.prototype.getDataPath = function() {
  var parentPath = '';
  var myName = this.getDataName();
  if (this.getParent && this.getParent()) {
    parentPath = this.getParent().getDataPath() +
        (myName.indexOf(goog.ds.STR_ARRAY_START) != -1 ? '' :
        goog.ds.STR_PATH_SEPARATOR);
  }

  return parentPath + myName;
***REMOVED***


***REMOVED***
***REMOVED*** Load or reload the backing data for this node
***REMOVED***
goog.ds.BaseDataNode.prototype.load = goog.nullFunction;


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED***
goog.ds.BaseDataNode.prototype.getLoadState = function() {
  return goog.ds.LoadState.LOADED;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the parent node. Subclasses implement this function
***REMOVED*** @type {Function}
***REMOVED*** @protected
***REMOVED***
goog.ds.BaseDataNode.prototype.getParent = null;


***REMOVED***
***REMOVED*** Interface for node list in rich data tree.
***REMOVED***
***REMOVED*** Has both map and list-style accessors
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ds.DataNode}
***REMOVED***
// TODO(arv): Use interfaces when available.
goog.ds.DataNodeList = function() {***REMOVED***


***REMOVED***
***REMOVED*** Add a node to the node list.
***REMOVED*** If the node has a dataName, uses this for the key in the map.
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode} node The node to add.
***REMOVED***
goog.ds.DataNodeList.prototype.add = goog.abstractMethod;


***REMOVED***
***REMOVED*** Get a node by string key.
***REMOVED*** Returns null if node doesn't exist.
***REMOVED***
***REMOVED*** @param {string} key String lookup key.
***REMOVED*** @return {*} The node, or null if doesn't exist.
***REMOVED*** @override
***REMOVED***
goog.ds.DataNodeList.prototype.get = goog.abstractMethod;


***REMOVED***
***REMOVED*** Get a node by index
***REMOVED*** Returns null if the index is out of range
***REMOVED***
***REMOVED*** @param {number} index The index of the node.
***REMOVED*** @return {goog.ds.DataNode} The node, or null if doesn't exist.
***REMOVED***
goog.ds.DataNodeList.prototype.getByIndex = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets the size of the node list
***REMOVED***
***REMOVED*** @return {number} The size of the list.
***REMOVED***
goog.ds.DataNodeList.prototype.getCount = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets a node in the list of a given name
***REMOVED*** @param {string} name Name of the node.
***REMOVED*** @param {goog.ds.DataNode} node The node.
***REMOVED***
goog.ds.DataNodeList.prototype.setNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** Removes a node in the list of a given name
***REMOVED*** @param {string} name Name of the node.
***REMOVED*** @return {boolean} True if node existed and was deleted.
***REMOVED***
goog.ds.DataNodeList.prototype.removeNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** Simple node list implementation with underlying array and map
***REMOVED*** implements goog.ds.DataNodeList.
***REMOVED***
***REMOVED*** Names that are reserved for system use and shouldn't be used for data node
***REMOVED*** names: eval, toSource, toString, unwatch, valueOf, watch. Behavior is
***REMOVED*** undefined if these names are used.
***REMOVED***
***REMOVED*** @param {Array.<goog.ds.DataNode>=} opt_nodes optional nodes to add to list.
***REMOVED***
***REMOVED*** @extends {goog.ds.DataNodeList}
***REMOVED***
// TODO(arv): Use interfaces when available.
goog.ds.BasicNodeList = function(opt_nodes) {
  this.map_ = {***REMOVED***
  this.list_ = [];
  this.indexMap_ = {***REMOVED***
  if (opt_nodes) {
    for (var i = 0, node; node = opt_nodes[i]; i++) {
      this.add(node);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Add a node to the node list.
***REMOVED*** If the node has a dataName, uses this for the key in the map.
***REMOVED*** TODO(user) Remove function as well
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode} node The node to add.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.add = function(node) {
  this.list_.push(node);
  var dataName = node.getDataName();
  if (dataName) {
    this.map_[dataName] = node;
    this.indexMap_[dataName] = this.list_.length - 1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get a node by string key.
***REMOVED*** Returns null if node doesn't exist.
***REMOVED***
***REMOVED*** @param {string} key String lookup key.
***REMOVED*** @return {goog.ds.DataNode} The node, or null if doesn't exist.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.get = function(key) {
  return this.map_[key] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Get a node by index
***REMOVED*** Returns null if the index is out of range
***REMOVED***
***REMOVED*** @param {number} index The index of the node.
***REMOVED*** @return {goog.ds.DataNode} The node, or null if doesn't exist.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.getByIndex = function(index) {
  return this.list_[index] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the size of the node list
***REMOVED***
***REMOVED*** @return {number} The size of the list.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.getCount = function() {
  return this.list_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a node in the list of a given name
***REMOVED*** @param {string} name Name of the node.
***REMOVED*** @param {goog.ds.DataNode} node The node.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.setNode = function(name, node) {
  if (node == null) {
    this.removeNode(name);
  } else {
    var existingNode = this.indexMap_[name];
    if (existingNode != null) {
      this.map_[name] = node;
      this.list_[existingNode] = node;
    } else {
      this.add(node);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a node in the list of a given name
***REMOVED*** @param {string} name Name of the node.
***REMOVED*** @return {boolean} True if node existed and was deleted.
***REMOVED*** @override
***REMOVED***
goog.ds.BasicNodeList.prototype.removeNode = function(name) {
  var existingNode = this.indexMap_[name];
  if (existingNode != null) {
    this.list_.splice(existingNode, 1);
    delete this.map_[name];
    delete this.indexMap_[name];
    for (var index in this.indexMap_) {
      if (this.indexMap_[index] > existingNode) {
        this.indexMap_[index]--;
      }
    }
  }
  return existingNode != null;
***REMOVED***


***REMOVED***
***REMOVED*** Get the index of a named node
***REMOVED*** @param {string} name The name of the node to get the index of.
***REMOVED*** @return {number|undefined} The index.
***REMOVED***
goog.ds.BasicNodeList.prototype.indexOf = function(name) {
  return this.indexMap_[name];
***REMOVED***


***REMOVED***
***REMOVED*** Immulatable empty node list
***REMOVED*** @extends {goog.ds.BasicNodeList}
***REMOVED***
***REMOVED***

goog.ds.EmptyNodeList = function() {
  goog.ds.BasicNodeList.call(this);
***REMOVED***
goog.inherits(goog.ds.EmptyNodeList, goog.ds.BasicNodeList);


***REMOVED***
***REMOVED*** Add a node to the node list.
***REMOVED*** If the node has a dataName, uses this for the key in the map.
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode} node The node to add.
***REMOVED*** @override
***REMOVED***
goog.ds.EmptyNodeList.prototype.add = function(node) {
  throw Error('Can\'t add to EmptyNodeList');
***REMOVED***



***REMOVED***
***REMOVED*** Node list implementation which maintains sort order during insertion and
***REMOVED*** modification operations based on a comparison function.
***REMOVED***
***REMOVED*** The SortedNodeList does not guarantee sort order will be maintained if
***REMOVED*** the underlying data nodes are modified externally.
***REMOVED***
***REMOVED*** Names that are reserved for system use and shouldn't be used for data node
***REMOVED*** names: eval, toSource, toString, unwatch, valueOf, watch. Behavior is
***REMOVED*** undefined if these names are used.
***REMOVED***
***REMOVED*** @param {Function} compareFn Comparison function by which the
***REMOVED***     node list is sorted. Should take 2 arguments to compare, and return a
***REMOVED***     negative integer, zero, or a positive integer depending on whether the
***REMOVED***     first argument is less than, equal to, or greater than the second.
***REMOVED*** @param {Array.<goog.ds.DataNode>=} opt_nodes optional nodes to add to list;
***REMOVED***    these are assumed to be in sorted order.
***REMOVED*** @extends {goog.ds.BasicNodeList}
***REMOVED***
***REMOVED***
goog.ds.SortedNodeList = function(compareFn, opt_nodes) {
  this.compareFn_ = compareFn;
  goog.ds.BasicNodeList.call(this, opt_nodes);
***REMOVED***
goog.inherits(goog.ds.SortedNodeList, goog.ds.BasicNodeList);


***REMOVED***
***REMOVED*** Add a node to the node list, maintaining sort order.
***REMOVED*** If the node has a dataName, uses this for the key in the map.
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode} node The node to add.
***REMOVED*** @override
***REMOVED***
goog.ds.SortedNodeList.prototype.add = function(node) {
  if (!this.compareFn_) {
    this.append(node);
    return;
  }

  var searchLoc = goog.array.binarySearch(this.list_, node, this.compareFn_);

  // if there is another node that is "equal" according to the comparison
  // function, insert before that one; otherwise insert at the location
  // goog.array.binarySearch indicated
  if (searchLoc < 0) {
    searchLoc = -(searchLoc + 1);
  }

  // update any indexes that are after the insertion point
  for (var index in this.indexMap_) {
    if (this.indexMap_[index] >= searchLoc) {
      this.indexMap_[index]++;
    }
  }

  goog.array.insertAt(this.list_, node, searchLoc);
  var dataName = node.getDataName();
  if (dataName) {
    this.map_[dataName] = node;
    this.indexMap_[dataName] = searchLoc;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds the given node to the end of the SortedNodeList. This should
***REMOVED*** only be used when the caller can guarantee that the sort order will
***REMOVED*** be maintained according to this SortedNodeList's compareFn (e.g.
***REMOVED*** when initializing a new SortedNodeList from a list of nodes that has
***REMOVED*** already been sorted).
***REMOVED*** @param {goog.ds.DataNode} node The node to append.
***REMOVED***
goog.ds.SortedNodeList.prototype.append = function(node) {
  goog.ds.SortedNodeList.superClass_.add.call(this, node);
***REMOVED***


***REMOVED***
***REMOVED*** Sets a node in the list of a given name, maintaining sort order.
***REMOVED*** @param {string} name Name of the node.
***REMOVED*** @param {goog.ds.DataNode} node The node.
***REMOVED*** @override
***REMOVED***
goog.ds.SortedNodeList.prototype.setNode = function(name, node) {
  if (node == null) {
    this.removeNode(name);
  } else {
    var existingNode = this.indexMap_[name];
    if (existingNode != null) {
      if (this.compareFn_) {
        var compareResult = this.compareFn_(this.list_[existingNode], node);
        if (compareResult == 0) {
          // the new node can just replace the old one
          this.map_[name] = node;
          this.list_[existingNode] = node;
        } else {
          // remove the old node, then add the new one
          this.removeNode(name);
          this.add(node);
        }
      }
    } else {
      this.add(node);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** The character denoting an attribute.
***REMOVED*** @type {string}
***REMOVED***
goog.ds.STR_ATTRIBUTE_START = '@';


***REMOVED***
***REMOVED*** The character denoting all children.
***REMOVED*** @type {string}
***REMOVED***
goog.ds.STR_ALL_CHILDREN_SELECTOR = '*';


***REMOVED***
***REMOVED*** The wildcard character.
***REMOVED*** @type {string}
***REMOVED***
goog.ds.STR_WILDCARD = '*';


***REMOVED***
***REMOVED*** The character denoting path separation.
***REMOVED*** @type {string}
***REMOVED***
goog.ds.STR_PATH_SEPARATOR = '/';


***REMOVED***
***REMOVED*** The character denoting the start of an array.
***REMOVED*** @type {string}
***REMOVED***
goog.ds.STR_ARRAY_START = '[';


***REMOVED***
***REMOVED*** Shared logger instance for data package
***REMOVED*** @type {goog.debug.Logger}
***REMOVED***
goog.ds.logger = goog.debug.Logger.getLogger('goog.ds');


***REMOVED***
***REMOVED*** Create a data node that references another data node,
***REMOVED*** useful for pointer-like functionality.
***REMOVED*** All functions will return same values as the original node except for
***REMOVED*** getDataName()
***REMOVED*** @param {!goog.ds.DataNode} node The original node.
***REMOVED*** @param {string} name The new name.
***REMOVED*** @return {!goog.ds.DataNode} The new data node.
***REMOVED***
goog.ds.Util.makeReferenceNode = function(node, name) {
 ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***
  ***REMOVED*** @extends {goog.ds.DataNode}
 ***REMOVED*****REMOVED***
  var nodeCreator = function() {***REMOVED***
  nodeCreator.prototype = node;
  var newNode = new nodeCreator();
  newNode.getDataName = function() {
    return name;
 ***REMOVED*****REMOVED***
  return newNode;
***REMOVED***
