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
***REMOVED*** @fileoverview
***REMOVED*** Efficient implementation of DataNode API.
***REMOVED***
***REMOVED*** The implementation consists of three concrete classes for modelling
***REMOVED*** DataNodes with different characteristics: FastDataNode,
***REMOVED*** FastPrimitiveDataNode and FastListNode.
***REMOVED***
***REMOVED*** FastDataNode is for bean-like or map-like objects that consists of
***REMOVED*** key/value mappings and where the primary access pattern is by key.
***REMOVED***
***REMOVED*** FastPrimitiveDataNode wraps primitives like strings, boolean, and numbers.
***REMOVED***
***REMOVED*** FastListNode is for array-like data nodes. It also supports key-based
***REMOVED*** lookups if the data nodes have an "id" property or if child nodes are
***REMOVED*** explicitly added by name. It is most efficient if these features are not
***REMOVED*** used.
***REMOVED***
***REMOVED*** FastDataNodes can be constructed from JSON-like objects via the function
***REMOVED*** goog.ds.FastDataNode.fromJs.

***REMOVED***

goog.provide('goog.ds.AbstractFastDataNode');
goog.provide('goog.ds.FastDataNode');
goog.provide('goog.ds.FastListNode');
goog.provide('goog.ds.PrimitiveFastDataNode');

goog.require('goog.ds.DataManager');
goog.require('goog.ds.EmptyNodeList');
goog.require('goog.string');

/*
***REMOVED*** Implementation note: In order to reduce the number of objects,
***REMOVED*** FastDataNode stores its key/value mappings directly in the FastDataNode
***REMOVED*** object iself (instead of a separate map). To make this work we have to
***REMOVED*** sure that there are no name clashes with other attribute names used by
***REMOVED*** FastDataNode (like dataName and parent). This is especially difficult in
***REMOVED*** the light of automatic renaming by the JavaScript compiler. For this reason,
***REMOVED*** all internal attributes start with "__" so that they are not renamed
***REMOVED*** by the compiler.
***REMOVED***

***REMOVED***
***REMOVED*** Creates a new abstract data node.
***REMOVED*** @param {string} dataName Name of the datanode.
***REMOVED*** @param {goog.ds.DataNode=} opt_parent Parent of this data node.
***REMOVED***
***REMOVED*** @extends {goog.ds.DataNodeList}
***REMOVED***
// TODO(arv): Use interfaces when available.
goog.ds.AbstractFastDataNode = function(dataName, opt_parent) {
  if (!dataName) {
    throw Error('Cannot create a fast data node without a data name');
  }
  this['__dataName'] = dataName;
  this['__parent'] = opt_parent;
***REMOVED***


***REMOVED***
***REMOVED*** Return the name of this data node.
***REMOVED*** @return {string} Name of this data noden.
***REMOVED*** @override
***REMOVED***
goog.ds.AbstractFastDataNode.prototype.getDataName = function() {
  return this['__dataName'];
***REMOVED***


***REMOVED***
***REMOVED*** Set the name of this data node.
***REMOVED*** @param {string} value Name.
***REMOVED*** @override
***REMOVED***
goog.ds.AbstractFastDataNode.prototype.setDataName = function(value) {
  this['__dataName'] = value;
***REMOVED***


***REMOVED***
***REMOVED*** Get the path leading to this data node.
***REMOVED*** @return {string} Data path.
***REMOVED*** @override
***REMOVED***
goog.ds.AbstractFastDataNode.prototype.getDataPath = function() {
  var parentPath;
  if (this['__parent']) {
    parentPath = this['__parent'].getDataPath() + goog.ds.STR_PATH_SEPARATOR;
  } else {
    parentPath = '';
  }
  return parentPath + this.getDataName();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new fast data node, using the properties of root.
***REMOVED*** @param {Object} root JSON-like object to initialize data node from.
***REMOVED*** @param {string} dataName Name of this data node.
***REMOVED*** @param {goog.ds.DataNode=} opt_parent Parent of this data node.
***REMOVED*** @extends {goog.ds.AbstractFastDataNode}
***REMOVED***
***REMOVED***
goog.ds.FastDataNode = function(root, dataName, opt_parent) {
  goog.ds.AbstractFastDataNode.call(this, dataName, opt_parent);
  this.extendWith(root);
***REMOVED***
goog.inherits(goog.ds.FastDataNode, goog.ds.AbstractFastDataNode);


***REMOVED***
***REMOVED*** Add all attributes of object to this data node.
***REMOVED*** @param {Object} object Object to add attributes from.
***REMOVED*** @protected
***REMOVED***
goog.ds.FastDataNode.prototype.extendWith = function(object) {
  for (var key in object) {
    this[key] = object[key];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new FastDataNode structure initialized from object. This will
***REMOVED*** return an instance of the most suitable sub-class of FastDataNode.
***REMOVED***
***REMOVED*** You should not modify object after creating a fast data node from it
***REMOVED*** or assume that changing object changes the data node. Doing so results
***REMOVED*** in undefined behaviour.
***REMOVED***
***REMOVED*** @param {Object|number|boolean|string} object Object to initialize data
***REMOVED***     node from.
***REMOVED*** @param {string} dataName Name of data node.
***REMOVED*** @param {goog.ds.DataNode=} opt_parent Parent of data node.
***REMOVED*** @return {!goog.ds.AbstractFastDataNode} Data node representing object.
***REMOVED***
goog.ds.FastDataNode.fromJs = function(object, dataName, opt_parent) {
  if (goog.isArray(object)) {
    return new goog.ds.FastListNode(object, dataName, opt_parent);
  } else if (goog.isObject(object)) {
    return new goog.ds.FastDataNode(object, dataName, opt_parent);
  } else {
    return new goog.ds.PrimitiveFastDataNode(object || !!object,
                                             dataName,
                                             opt_parent);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Static instance of an empty list.
***REMOVED*** @type {!goog.ds.EmptyNodeList}
***REMOVED*** @private
***REMOVED***
goog.ds.FastDataNode.emptyList_ = new goog.ds.EmptyNodeList();


***REMOVED***
***REMOVED*** Not supported for normal FastDataNodes.
***REMOVED*** @param {*} value Value to set data node to.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.set = function(value) {
  throw 'Not implemented yet';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.FastDataNode.prototype.getChildNodes = function(opt_selector) {
  if (!opt_selector || opt_selector == goog.ds.STR_ALL_CHILDREN_SELECTOR) {
    return this;
  } else if (opt_selector.indexOf(goog.ds.STR_WILDCARD) == -1) {
    var child = this.getChildNode(opt_selector);
    return child ? new goog.ds.FastListNode([child], '') :
        new goog.ds.EmptyNodeList();
  } else {
    throw Error('Unsupported selector: ' + opt_selector);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Makes sure that a named child is wrapped in a data node structure.
***REMOVED*** @param {string} name Name of child to wrap.
***REMOVED*** @private
***REMOVED***
goog.ds.FastDataNode.prototype.wrapChild_ = function(name) {
  var child = this[name];
  if (child != null && !child.getDataName) {
    this[name] = goog.ds.FastDataNode.fromJs(this[name], name, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get a child node by name.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @param {boolean=} opt_create Whether to create the child if it does not
***REMOVED*** exist.
***REMOVED*** @return {goog.ds.DataNode} Child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.getChildNode = function(name, opt_create) {
  this.wrapChild_(name);
  // this[name] always is a data node object, so using "||" is fine.
  var child = this[name] || null;
  if (child == null && opt_create) {
    child = new goog.ds.FastDataNode({}, name, this);
    this[name] = child;
  }
  return child;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a child node. Creates the child if it does not exist.
***REMOVED***
***REMOVED*** Calling  this function makes any child nodes previously obtained for name
***REMOVED*** invalid. You should not use these child nodes but instead obtain a new
***REMOVED*** instance by calling getChildNode.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.setChildNode = function(name, value) {
  if (value != null) {
    this[name] = value;
  } else {
    delete this[name];
  }
  goog.ds.DataManager.getInstance().fireDataChange(this.getDataPath() +
      goog.ds.STR_PATH_SEPARATOR + name);
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of a child node. By using this method you can avoid
***REMOVED*** the need to create PrimitiveFastData nodes.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @return {Object} Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.getChildNodeValue = function(name) {
  var child = this[name];
  if (child != null) {
    return (child.getDataName ? child.get() : child);
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this data node is a list. Always returns false for
***REMOVED*** instances of FastDataNode but may return true for subclasses.
***REMOVED*** @return {boolean} Whether this data node is array-like.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.isList = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a javascript object representation of this data node. You should
***REMOVED*** not modify the object returned by this function.
***REMOVED*** @return {!Object} Javascript object representation of this data node.
***REMOVED***
goog.ds.FastDataNode.prototype.getJsObject = function() {
  var result = {***REMOVED***
  for (var key in this) {
    if (!goog.string.startsWith(key, '__') && !goog.isFunction(this[key])) {
      result[key] = (this[key]['__dataName'] ? this[key].getJsObject() :
          this[key]);
    }
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a deep copy of this data node.
***REMOVED*** @return {goog.ds.FastDataNode} Clone of this data node.
***REMOVED***
goog.ds.FastDataNode.prototype.clone = function() {
  return***REMOVED*****REMOVED*** @type {goog.ds.FastDataNode}***REMOVED***(goog.ds.FastDataNode.fromJs(
      this.getJsObject(), this.getDataName()));
***REMOVED***


/*
***REMOVED*** Implementation of goog.ds.DataNodeList for FastDataNode.
***REMOVED***


***REMOVED***
***REMOVED*** Adds a child to this data node.
***REMOVED*** @param {goog.ds.DataNode} value Child node to add.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.add = function(value) {
  this.setChildNode(value.getDataName(), value);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of this data node (if called without opt_key) or
***REMOVED*** gets a child node (if called with opt_key).
***REMOVED*** @param {string=} opt_key Name of child node.
***REMOVED*** @return {*} This data node or a child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.get = function(opt_key) {
  if (!goog.isDef(opt_key)) {
    // if there is no key, DataNode#get was called
    return this;
  } else {
    return this.getChildNode(opt_key);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a child node by index. This method has a complexity of O(n) where
***REMOVED*** n is the number of children. If you need a faster implementation of this
***REMOVED*** method, you should use goog.ds.FastListNode.
***REMOVED*** @param {number} index Index of child node (starting from 0).
***REMOVED*** @return {goog.ds.DataNode} Child node at specified index.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.getByIndex = function(index) {
  var i = 0;
  for (var key in this) {
    if (!goog.string.startsWith(key, '__') && !goog.isFunction(this[key])) {
      if (i == index) {
        this.wrapChild_(key);
        return this[key];
      }
      ++i;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number of child nodes. This method has a complexity of O(n) where
***REMOVED*** n is the number of children. If you need a faster implementation of this
***REMOVED*** method, you should use goog.ds.FastListNode.
***REMOVED*** @return {number} Number of child nodes.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.getCount = function() {
  var count = 0;
  for (var key in this) {
    if (!goog.string.startsWith(key, '__') && !goog.isFunction(this[key])) {
      ++count;
    }
  }
  // maybe cache this?
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a child node.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @param {Object} value Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.setNode = function(name, value) {
  this.setChildNode(name, value);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastDataNode.prototype.removeNode = function(name) {
  delete this[name];
  return false;
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new data node wrapping a primitive value.
***REMOVED*** @param {number|boolean|string} value Value the value to wrap.
***REMOVED*** @param {string} dataName name Name of this data node.
***REMOVED*** @param {goog.ds.DataNode=} opt_parent Parent of this data node.
***REMOVED*** @extends {goog.ds.AbstractFastDataNode}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ds.PrimitiveFastDataNode = function(value, dataName, opt_parent) {
  this.value_ = value;
  goog.ds.AbstractFastDataNode.call(this, dataName, opt_parent);
***REMOVED***
goog.inherits(goog.ds.PrimitiveFastDataNode, goog.ds.AbstractFastDataNode);


***REMOVED***
***REMOVED*** Returns the value of this data node.
***REMOVED*** @return {(boolean|number|string)} Value of this data node.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.get = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets this data node to a new value.
***REMOVED*** @param {*} value Value to set data node to.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.set = function(value) {
  if (goog.isArray(value) || goog.isObject(value)) {
    throw Error('can only set PrimitiveFastDataNode to primitive values');
  }
  this.value_ = value;
  goog.ds.DataManager.getInstance().fireDataChange(this.getDataPath());
***REMOVED***


***REMOVED***
***REMOVED*** Returns child nodes of this data node. Always returns an unmodifiable,
***REMOVED*** empty list.
***REMOVED*** @return {!goog.ds.DataNodeList} (Empty) list of child nodes.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.getChildNodes = function() {
  return goog.ds.FastDataNode.emptyList_;
***REMOVED***


***REMOVED***
***REMOVED*** Get a child node by name. Always returns null.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @return {goog.ds.DataNode} Child node.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.getChildNode = function(name) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of a child node. Always returns null.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @return {Object} Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.getChildNodeValue = function(name) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Not supported by primitive data nodes.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @param {Object} value Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.setChildNode =
    function(name, value) {
  throw Error('Cannot set a child node for a PrimitiveFastDataNode');
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this data node is a list. Always returns false for
***REMOVED*** instances of PrimitiveFastDataNode.
***REMOVED*** @return {boolean} Whether this data node is array-like.
***REMOVED*** @override
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.isList = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a javascript object representation of this data node. You should
***REMOVED*** not modify the object returned by this function.
***REMOVED*** @return {*} Javascript object representation of this data node.
***REMOVED***
goog.ds.PrimitiveFastDataNode.prototype.getJsObject = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new list node from an array.
***REMOVED*** @param {Array} values values hold by this list node.
***REMOVED*** @param {string} dataName name of this node.
***REMOVED*** @param {goog.ds.DataNode=} opt_parent parent of this node.
***REMOVED*** @extends {goog.ds.AbstractFastDataNode}
***REMOVED***
***REMOVED*** @final
***REMOVED***
// TODO(arv): Use interfaces when available.  This implements DataNodeList
// as well.
goog.ds.FastListNode = function(values, dataName, opt_parent) {
  this.values_ = [];
  for (var i = 0; i < values.length; ++i) {
    var name = values[i].id || ('[' + i + ']');
    this.values_.push(goog.ds.FastDataNode.fromJs(values[i], name, this));
    if (values[i].id) {
      if (!this.map_) {
        this.map_ = {***REMOVED***
      }
      this.map_[values[i].id] = i;
    }
  }
  goog.ds.AbstractFastDataNode.call(this, dataName, opt_parent);
***REMOVED***
goog.inherits(goog.ds.FastListNode, goog.ds.AbstractFastDataNode);


***REMOVED***
***REMOVED*** Not supported for FastListNodes.
***REMOVED*** @param {*} value Value to set data node to.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.set = function(value) {
  throw Error('Cannot set a FastListNode to a new value');
***REMOVED***


***REMOVED***
***REMOVED*** Returns child nodes of this data node. Currently, only supports
***REMOVED*** returning all children.
***REMOVED*** @return {!goog.ds.DataNodeList} List of child nodes.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.getChildNodes = function() {
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Get a child node by name.
***REMOVED*** @param {string} key Name of child node.
***REMOVED*** @param {boolean=} opt_create Whether to create the child if it does not
***REMOVED*** exist.
***REMOVED*** @return {goog.ds.DataNode} Child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.getChildNode = function(key, opt_create) {
  var index = this.getKeyAsNumber_(key);
  if (index == null && this.map_) {
    index = this.map_[key];
  }
  if (index != null && this.values_[index]) {
    return this.values_[index];
  } else if (opt_create) {
    this.setChildNode(key, {});
    return this.getChildNode(key);
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of a child node.
***REMOVED*** @param {string} key Name of child node.
***REMOVED*** @return {*} Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.getChildNodeValue = function(key) {
  var child = this.getChildNode(key);
  return (child ? child.get() : null);
***REMOVED***


***REMOVED***
***REMOVED*** Tries to interpret key as a numeric index enclosed by square brakcets.
***REMOVED*** @param {string} key Key that should be interpreted as a number.
***REMOVED*** @return {?number} Numeric index or null if key is not of the form
***REMOVED***  described above.
***REMOVED*** @private
***REMOVED***
goog.ds.FastListNode.prototype.getKeyAsNumber_ = function(key) {
  if (key.charAt(0) == '[' && key.charAt(key.length - 1) == ']') {
    return Number(key.substring(1, key.length - 1));
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a child node. Creates the child if it does not exist. To set
***REMOVED*** children at a certain index, use a key of the form '[index]'. Note, that
***REMOVED*** you can only set values at existing numeric indices. To add a new node
***REMOVED*** to this list, you have to use the add method.
***REMOVED***
***REMOVED*** Calling  this function makes any child nodes previously obtained for name
***REMOVED*** invalid. You should not use these child nodes but instead obtain a new
***REMOVED*** instance by calling getChildNode.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.setChildNode = function(key, value) {
  var count = this.values_.length;
  if (value != null) {
    if (!value.getDataName) {
      value = goog.ds.FastDataNode.fromJs(value, key, this);
    }
    var index = this.getKeyAsNumber_(key);
    if (index != null) {
      if (index < 0 || index >= this.values_.length) {
        throw Error('List index out of bounds: ' + index);
      }
      this.values_[key] = value;
    } else {
      if (!this.map_) {
        this.map_ = {***REMOVED***
      }
      this.values_.push(value);
      this.map_[key] = this.values_.length - 1;
    }
  } else {
    this.removeNode(key);
  }
  var dm = goog.ds.DataManager.getInstance();
  dm.fireDataChange(this.getDataPath() + goog.ds.STR_PATH_SEPARATOR + key);
  if (this.values_.length != count) {
    this.listSizeChanged_();
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Fire data changes that are appropriate when the size of this list changes.
***REMOVED*** Should be called whenever the list size has changed.
***REMOVED*** @private
***REMOVED***
goog.ds.FastListNode.prototype.listSizeChanged_ = function() {
  var dm = goog.ds.DataManager.getInstance();
  dm.fireDataChange(this.getDataPath());
  dm.fireDataChange(this.getDataPath() + goog.ds.STR_PATH_SEPARATOR +
      'count()');
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this data node is a list. Always returns true.
***REMOVED*** @return {boolean} Whether this data node is array-like.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.isList = function() {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a javascript object representation of this data node. You should
***REMOVED*** not modify the object returned by this function.
***REMOVED*** @return {!Object} Javascript object representation of this data node.
***REMOVED***
goog.ds.FastListNode.prototype.getJsObject = function() {
  var result = [];
  for (var i = 0; i < this.values_.length; ++i) {
    result.push(this.values_[i].getJsObject());
  }
  return result;
***REMOVED***


/*
***REMOVED*** Implementation of goog.ds.DataNodeList for FastListNode.
***REMOVED***


***REMOVED***
***REMOVED*** Adds a child to this data node
***REMOVED*** @param {goog.ds.DataNode} value Child node to add.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.add = function(value) {
  if (!value.getDataName) {
    value = goog.ds.FastDataNode.fromJs(value,
        String('[' + (this.values_.length) + ']'), this);
  }
  this.values_.push(value);
  var dm = goog.ds.DataManager.getInstance();
  dm.fireDataChange(this.getDataPath() + goog.ds.STR_PATH_SEPARATOR +
      '[' + (this.values_.length - 1) + ']');
  this.listSizeChanged_();
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of this data node (if called without opt_key) or
***REMOVED*** gets a child node (if called with opt_key).
***REMOVED*** @param {string=} opt_key Name of child node.
***REMOVED*** @return {Array|goog.ds.DataNode} Array of child nodes (if called without
***REMOVED***     opt_key), or a named child node otherwise.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.get = function(opt_key) {
  // if there are no arguments, DataNode.get was called
  if (!goog.isDef(opt_key)) {
    return this.values_;
  } else {
    return this.getChildNode(opt_key);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a child node by (numeric) index.
***REMOVED*** @param {number} index Index of child node (starting from 0).
***REMOVED*** @return {goog.ds.DataNode} Child node at specified index.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.getByIndex = function(index) {
  var child = this.values_[index];
  return (child != null ? child : null); // never return undefined
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number of child nodes.
***REMOVED*** @return {number} Number of child nodes.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.getCount = function() {
  return this.values_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a child node.
***REMOVED*** @param {string} name Name of child node.
***REMOVED*** @param {Object} value Value of child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.setNode = function(name, value) {
  throw Error('Setting child nodes of a FastListNode is not implemented, yet');
***REMOVED***


***REMOVED***
***REMOVED*** Removes a child node.
***REMOVED*** @override
***REMOVED***
goog.ds.FastListNode.prototype.removeNode = function(name) {
  var index = this.getKeyAsNumber_(name);
  if (index == null && this.map_) {
    index = this.map_[name];
  }
  if (index != null) {
    this.values_.splice(index, 1);
    if (this.map_) {
      var keyToDelete = null;
      for (var key in this.map_) {
        if (this.map_[key] == index) {
          keyToDelete = key;
        } else if (this.map_[key] > index) {
          --this.map_[key];
        }
      }
      if (keyToDelete) {
        delete this.map_[keyToDelete];
      }
    }
    var dm = goog.ds.DataManager.getInstance();
    dm.fireDataChange(this.getDataPath() + goog.ds.STR_PATH_SEPARATOR +
        '[' + index + ']');
    this.listSizeChanged_();
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the index of a named child nodes. This method only works if
***REMOVED*** this list uses mixed name/indexed lookup, i.e. if its child node have
***REMOVED*** an 'id' attribute.
***REMOVED*** @param {string} name Name of child node to determine index of.
***REMOVED*** @return {number} Index of child node named name.
***REMOVED***
goog.ds.FastListNode.prototype.indexOf = function(name) {
  var index = this.getKeyAsNumber_(name);
  if (index == null && this.map_) {
    index = this.map_[name];
  }
  if (index == null) {
    throw Error('Cannot determine index for: ' + name);
  }
  return***REMOVED*****REMOVED*** @type {number}***REMOVED***(index);
***REMOVED***
