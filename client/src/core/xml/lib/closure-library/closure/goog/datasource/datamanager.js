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
***REMOVED*** @fileoverview
***REMOVED*** Central class for registering and accessing data sources
***REMOVED*** Also handles processing of data events.
***REMOVED***
***REMOVED*** There is a shared global instance that most client code should access via
***REMOVED*** goog.ds.DataManager.getInstance(). However you can also create your own
***REMOVED*** DataManager using new
***REMOVED***
***REMOVED*** Implements DataNode to provide the top element in a data registry
***REMOVED*** Prepends '$' to top level data names in path to denote they are root object
***REMOVED***
***REMOVED***
goog.provide('goog.ds.DataManager');

goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataNode');
goog.require('goog.ds.Expr');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.Map');



***REMOVED***
***REMOVED*** Create a DataManger
***REMOVED*** @extends {goog.ds.DataNode}
***REMOVED***
***REMOVED***
goog.ds.DataManager = function() {
  this.dataSources_ = new goog.ds.BasicNodeList();
  this.autoloads_ = new goog.structs.Map();
  this.listenerMap_ = {***REMOVED***
  this.listenersByFunction_ = {***REMOVED***
  this.aliases_ = {***REMOVED***
  this.eventCount_ = 0;
  this.indexedListenersByFunction_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Global instance
***REMOVED*** @private
***REMOVED***
goog.ds.DataManager.instance_ = null;
goog.inherits(goog.ds.DataManager, goog.ds.DataNode);


***REMOVED***
***REMOVED*** Get the global instance
***REMOVED*** @return {goog.ds.DataManager} The data manager singleton.
***REMOVED***
goog.ds.DataManager.getInstance = function() {
  if (!goog.ds.DataManager.instance_) {
    goog.ds.DataManager.instance_ = new goog.ds.DataManager();
  }
  return goog.ds.DataManager.instance_;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the global instance (for unit tests to reset state).
***REMOVED***
goog.ds.DataManager.clearInstance = function() {
  goog.ds.DataManager.instance_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Add a data source
***REMOVED*** @param {goog.ds.DataNode} ds The data source.
***REMOVED*** @param {boolean=} opt_autoload Whether to automatically load the data,
***REMOVED***   defaults to false.
***REMOVED*** @param {string=} opt_name Optional name, can also get name
***REMOVED***   from the datasource.
***REMOVED***
goog.ds.DataManager.prototype.addDataSource = function(ds, opt_autoload,
    opt_name) {
  var autoload = !!opt_autoload;
  var name = opt_name || ds.getDataName();
  if (!goog.string.startsWith(name, '$')) {
    name = '$' + name;
  }
  ds.setDataName(name);
  this.dataSources_.add(ds);
  this.autoloads_.set(name, autoload);
***REMOVED***


***REMOVED***
***REMOVED*** Create an alias for a data path, very similar to assigning a variable.
***REMOVED*** For example, you can set $CurrentContact -> $Request/Contacts[5], and all
***REMOVED*** references to $CurrentContact will be procesed on $Request/Contacts[5].
***REMOVED***
***REMOVED*** Aliases will hide datasources of the same name.
***REMOVED***
***REMOVED*** @param {string} name Alias name, must be a top level path ($Foo).
***REMOVED*** @param {string} dataPath Data path being aliased.
***REMOVED***
goog.ds.DataManager.prototype.aliasDataSource = function(name, dataPath) {
  if (!this.aliasListener_) {
    this.aliasListener_ = goog.bind(this.listenForAlias_, this);
  }
  if (this.aliases_[name]) {
    var oldPath = this.aliases_[name].getSource();
    this.removeListeners(this.aliasListener_, oldPath + '/...', name);
  }
  this.aliases_[name] = goog.ds.Expr.create(dataPath);
  this.addListener(this.aliasListener_, dataPath + '/...', name);
  this.fireDataChange(name);
***REMOVED***


***REMOVED***
***REMOVED*** Listener function for matches of paths that have been aliased.
***REMOVED*** Fires a data change on the alias as well.
***REMOVED***
***REMOVED*** @param {string} dataPath Path of data event fired.
***REMOVED*** @param {string} name Name of the alias.
***REMOVED*** @private
***REMOVED***
goog.ds.DataManager.prototype.listenForAlias_ = function(dataPath, name) {
  var aliasedExpr = this.aliases_[name];

  if (aliasedExpr) {
    // If it's a subpath, appends the subpath to the alias name
    // otherwise just fires on the top level alias
    var aliasedPath = aliasedExpr.getSource();
    if (dataPath.indexOf(aliasedPath) == 0) {
      this.fireDataChange(name + dataPath.substring(aliasedPath.length));
    } else {
      this.fireDataChange(name);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a named child node of the current node.
***REMOVED***
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {goog.ds.DataNode} The child node,
***REMOVED***   or null if no node of this name exists.
***REMOVED***
goog.ds.DataManager.prototype.getDataSource = function(name) {
  if (this.aliases_[name]) {
    return this.aliases_[name].getNode();
  } else {
    return this.dataSources_.get(name);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the value of the node
***REMOVED*** @return {Object} The value of the node, or null if no value.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.get = function() {
  return this.dataSources_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.DataManager.prototype.set = function(value) {
  throw Error('Can\'t set on DataManager');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.DataManager.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector) {
    return new goog.ds.BasicNodeList(
        [this.getChildNode(***REMOVED*** @type {string}***REMOVED***(opt_selector))]);
  } else {
    return this.dataSources_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a named child node of the current node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {goog.ds.DataNode} The child node,
***REMOVED***     or null if no node of this name exists.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.getChildNode = function(name) {
  return this.getDataSource(name);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.DataManager.prototype.getChildNodeValue = function(name) {
  var ds = this.getDataSource(name);
  return ds ? ds.get() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.getDataName = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the a qualified data path to this node
***REMOVED*** @return {string} The data path.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.getDataPath = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Load or reload the backing data for this node
***REMOVED*** only loads datasources flagged with autoload
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.load = function() {
  var len = this.dataSources_.getCount();
  for (var i = 0; i < len; i++) {
    var ds = this.dataSources_.getByIndex(i);
    var autoload = this.autoloads_.get(ds.getDataName());
    if (autoload) {
      ds.load();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.getLoadState = goog.abstractMethod;


***REMOVED***
***REMOVED*** Whether the value of this node is a homogeneous list of data
***REMOVED*** @return {boolean} True if a list.
***REMOVED*** @override
***REMOVED***
goog.ds.DataManager.prototype.isList = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Get the total count of events fired (mostly for debugging)
***REMOVED*** @return {number} Count of events.
***REMOVED***
goog.ds.DataManager.prototype.getEventCount = function() {
  return this.eventCount_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a listener
***REMOVED*** Listeners should fire when any data with path that has dataPath as substring
***REMOVED*** is changed.
***REMOVED*** TODO(user) Look into better listener handling
***REMOVED***
***REMOVED*** @param {Function} fn Callback function, signature function(dataPath, id).
***REMOVED*** @param {string} dataPath Fully qualified data path.
***REMOVED*** @param {string=} opt_id A value passed back to the listener when the dataPath
***REMOVED***   is matched.
***REMOVED***
goog.ds.DataManager.prototype.addListener = function(fn, dataPath, opt_id) {
  // maxAncestor sets how distant an ancestor you can be of the fired event
  // and still fire (you always fire if you are a descendant).
  // 0 means you don't fire if you are an ancestor
  // 1 means you only fire if you are parent
  // 1000 means you will fire if you are ancestor (effectively infinite)
  var maxAncestors = 0;
  if (goog.string.endsWith(dataPath, '/...')) {
    maxAncestors = 1000;
    dataPath = dataPath.substring(0, dataPath.length - 4);
  } else if (goog.string.endsWith(dataPath, '/*')) {
    maxAncestors = 1;
    dataPath = dataPath.substring(0, dataPath.length - 2);
  }

  opt_id = opt_id || '';
  var key = dataPath + ':' + opt_id + ':' + goog.getUid(fn);
  var listener = {dataPath: dataPath, id: opt_id, fn: fn***REMOVED***
  var expr = goog.ds.Expr.create(dataPath);

  var fnUid = goog.getUid(fn);
  if (!this.listenersByFunction_[fnUid]) {
    this.listenersByFunction_[fnUid] = {***REMOVED***
  }
  this.listenersByFunction_[fnUid][key] = {listener: listener, items: []***REMOVED***

  while (expr) {
    var listenerSpec = {listener: listener, maxAncestors: maxAncestors***REMOVED***
    var matchingListeners = this.listenerMap_[expr.getSource()];
    if (matchingListeners == null) {
      matchingListeners = {***REMOVED***
      this.listenerMap_[expr.getSource()] = matchingListeners;
    }
    matchingListeners[key] = listenerSpec;
    maxAncestors = 0;
    expr = expr.getParent();
    this.listenersByFunction_[fnUid][key].items.push(
        {key: key, obj: matchingListeners});
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds an indexed listener.
***REMOVED***
***REMOVED*** Indexed listeners allow for '*' in data paths. If a***REMOVED*** exists, will match
***REMOVED*** all values and return the matched values in an array to the callback.
***REMOVED***
***REMOVED*** Currently uses a promiscuous match algorithm: Matches everything before the
***REMOVED*** first '*', and then does a regex match for all of the returned events.
***REMOVED*** Although this isn't optimized, it is still an improvement as you can collapse
***REMOVED*** 100's of listeners into a single regex match
***REMOVED***
***REMOVED*** @param {Function} fn Callback function, signature (dataPath, id, indexes).
***REMOVED*** @param {string} dataPath Fully qualified data path.
***REMOVED*** @param {string=} opt_id A value passed back to the listener when the dataPath
***REMOVED***   is matched.
***REMOVED***
goog.ds.DataManager.prototype.addIndexedListener = function(fn, dataPath,
    opt_id) {
  var firstStarPos = dataPath.indexOf('*');
  // Just need a regular listener
  if (firstStarPos == -1) {
    this.addListener(fn, dataPath, opt_id);
    return;
  }

  var listenPath = dataPath.substring(0, firstStarPos) + '...';

  // Create regex that matches***REMOVED*** to any non '\' character
  var ext = '$';
  if (goog.string.endsWith(dataPath, '/...')) {
    dataPath = dataPath.substring(0, dataPath.length - 4);
    ext = '';
  }
  var regExpPath = goog.string.regExpEscape(dataPath);
  var matchRegExp = regExpPath.replace(/\\\*/g, '([^\\\/]+)') + ext;

  // Matcher function applies the regex and calls back the original function
  // if the regex matches, passing in an array of the matched values
  var matchRegExpRe = new RegExp(matchRegExp);
  var matcher = function(path, id) {
    var match = matchRegExpRe.exec(path);
    if (match) {
      match.shift();
      fn(path, opt_id, match);
    }
  }
  this.addListener(matcher, listenPath, opt_id);

  // Add the indexed listener to the map so that we can remove it later.
  var fnUid = goog.getUid(fn);
  if (!this.indexedListenersByFunction_[fnUid]) {
    this.indexedListenersByFunction_[fnUid] = {***REMOVED***
  }
  var key = dataPath + ':' + opt_id;
  this.indexedListenersByFunction_[fnUid][key] = {
    listener: {dataPath: listenPath, fn: matcher, id: opt_id}
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Removes indexed listeners with a given callback function, and optional
***REMOVED*** matching datapath and matching id.
***REMOVED***
***REMOVED*** @param {Function} fn Callback function, signature function(dataPath, id).
***REMOVED*** @param {string=} opt_dataPath Fully qualified data path.
***REMOVED*** @param {string=} opt_id A value passed back to the listener when the dataPath
***REMOVED***   is matched.
***REMOVED***
goog.ds.DataManager.prototype.removeIndexedListeners = function(
    fn, opt_dataPath, opt_id) {
  this.removeListenersByFunction_(
      this.indexedListenersByFunction_, true, fn, opt_dataPath, opt_id);
***REMOVED***


***REMOVED***
***REMOVED*** Removes listeners with a given callback function, and optional
***REMOVED*** matching dataPath and matching id
***REMOVED***
***REMOVED*** @param {Function} fn Callback function, signature function(dataPath, id).
***REMOVED*** @param {string=} opt_dataPath Fully qualified data path.
***REMOVED*** @param {string=} opt_id A value passed back to the listener when the dataPath
***REMOVED***   is matched.
***REMOVED***
goog.ds.DataManager.prototype.removeListeners = function(fn, opt_dataPath,
    opt_id) {

  // Normalize data path root
  if (opt_dataPath && goog.string.endsWith(opt_dataPath, '/...')) {
    opt_dataPath = opt_dataPath.substring(0, opt_dataPath.length - 4);
  } else if (opt_dataPath && goog.string.endsWith(opt_dataPath, '/*')) {
    opt_dataPath = opt_dataPath.substring(0, opt_dataPath.length - 2);
  }

  this.removeListenersByFunction_(
      this.listenersByFunction_, false, fn, opt_dataPath, opt_id);
***REMOVED***


***REMOVED***
***REMOVED*** Removes listeners with a given callback function, and optional
***REMOVED*** matching dataPath and matching id from the given listenersByFunction
***REMOVED*** data structure.
***REMOVED***
***REMOVED*** @param {Object} listenersByFunction The listeners by function.
***REMOVED*** @param {boolean} indexed Indicates whether the listenersByFunction are
***REMOVED***     indexed or not.
***REMOVED*** @param {Function} fn Callback function, signature function(dataPath, id).
***REMOVED*** @param {string=} opt_dataPath Fully qualified data path.
***REMOVED*** @param {string=} opt_id A value passed back to the listener when the dataPath
***REMOVED***   is matched.
***REMOVED*** @private
***REMOVED***
goog.ds.DataManager.prototype.removeListenersByFunction_ = function(
    listenersByFunction, indexed, fn, opt_dataPath, opt_id) {
  var fnUid = goog.getUid(fn);
  var functionMatches = listenersByFunction[fnUid];
  if (functionMatches != null) {
    for (var key in functionMatches) {
      var functionMatch = functionMatches[key];
      var listener = functionMatch.listener;
      if ((!opt_dataPath || opt_dataPath == listener.dataPath) &&
          (!opt_id || opt_id == listener.id)) {
        if (indexed) {
          this.removeListeners(
              listener.fn, listener.dataPath, listener.id);
        }
        if (functionMatch.items) {
          for (var i = 0; i < functionMatch.items.length; i++) {
            var item = functionMatch.items[i];
            delete item.obj[item.key];
          }
        }
        delete functionMatches[key];
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the total number of listeners (per expression listened to, so may be
***REMOVED*** more than number of times addListener() has been called
***REMOVED*** @return {number} Number of listeners.
***REMOVED***
goog.ds.DataManager.prototype.getListenerCount = function() {
  var count = 0;
  goog.structs.forEach(this.listenerMap_, function(matchingListeners) {
    count += goog.structs.getCount(matchingListeners);
  });
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Disables the sending of all data events during the execution of the given
***REMOVED*** callback. This provides a way to avoid useless notifications of small changes
***REMOVED*** when you will eventually send a data event manually that encompasses them
***REMOVED*** all.
***REMOVED***
***REMOVED*** Note that this function can not be called reentrantly.
***REMOVED***
***REMOVED*** @param {Function} callback Zero-arg function to execute.
***REMOVED***
goog.ds.DataManager.prototype.runWithoutFiringDataChanges = function(callback) {
  if (this.disableFiring_) {
    throw Error('Can not nest calls to runWithoutFiringDataChanges');
  }

  this.disableFiring_ = true;
  try {
    callback();
  } finally {
    this.disableFiring_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fire a data change event to all listeners
***REMOVED***
***REMOVED*** If the path matches the path of a listener, the listener will fire
***REMOVED***
***REMOVED*** If your path is the parent of a listener, the listener will fire. I.e.
***REMOVED*** if $Contacts/bob@bob.com changes, then we will fire listener for
***REMOVED*** $Contacts/bob@bob.com/Name as well, as the assumption is that when
***REMOVED*** a parent changes, all children are invalidated.
***REMOVED***
***REMOVED*** If your path is the child of a listener, the listener may fire, depending
***REMOVED*** on the ancestor depth.
***REMOVED***
***REMOVED*** A listener for $Contacts might only be interested if the contact name changes
***REMOVED*** (i.e. $Contacts doesn't fire on $Contacts/bob@bob.com/Name),
***REMOVED*** while a listener for a specific contact might
***REMOVED*** (i.e. $Contacts/bob@bob.com would fire on $Contacts/bob@bob.com/Name).
***REMOVED*** Adding "/..." to a lisetener path listens to all children, and adding "/*" to
***REMOVED*** a listener path listens only to direct children
***REMOVED***
***REMOVED*** @param {string} dataPath Fully qualified data path.
***REMOVED***
goog.ds.DataManager.prototype.fireDataChange = function(dataPath) {
  if (this.disableFiring_) {
    return;
  }

  var expr = goog.ds.Expr.create(dataPath);
  var ancestorDepth = 0;

  // Look for listeners for expression and all its parents.
  // Parents of listener expressions are all added to the listenerMap as well,
  // so this will evaluate inner loop every time the dataPath is a child or
  // an ancestor of the original listener path
  while (expr) {
    var matchingListeners = this.listenerMap_[expr.getSource()];
    if (matchingListeners) {
      for (var id in matchingListeners) {
        var match = matchingListeners[id];
        var listener = match.listener;
        if (ancestorDepth <= match.maxAncestors) {
          listener.fn(dataPath, listener.id);
        }
      }
    }
    ancestorDepth++;
    expr = expr.getParent();
  }
  this.eventCount_++;
***REMOVED***
