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
***REMOVED*** @fileoverview Defines the goog.module.ModuleInfo class.
***REMOVED***
***REMOVED***

goog.provide('goog.module.ModuleInfo');

goog.require('goog.Disposable');
goog.require('goog.functions');
goog.require('goog.module.BaseModule');
goog.require('goog.module.ModuleLoadCallback');



***REMOVED***
***REMOVED*** A ModuleInfo object is used by the ModuleManager to hold information about a
***REMOVED*** module of js code that may or may not yet be loaded into the environment.
***REMOVED***
***REMOVED*** @param {Array.<string>} deps Ids of the modules that must be loaded before
***REMOVED***     this one. The ids must be in dependency order (i.e. if the ith module
***REMOVED***     depends on the jth module, then i > j).
***REMOVED*** @param {string} id The module's ID.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.module.ModuleInfo = function(deps, id) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of the ids of the modules that must be loaded before this module.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deps_ = deps;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The module's ID.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.id_ = id;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Callbacks to execute once this module is loaded.
  ***REMOVED*** @type {Array.<goog.module.ModuleLoadCallback>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.onloadCallbacks_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Callbacks to execute if the module load errors.
  ***REMOVED*** @type {Array.<goog.module.ModuleLoadCallback>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.onErrorCallbacks_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Early callbacks to execute once this module is loaded. Called after
  ***REMOVED*** module initialization but before regular onload callbacks.
  ***REMOVED*** @type {Array.<goog.module.ModuleLoadCallback>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.earlyOnloadCallbacks_ = [];
***REMOVED***
goog.inherits(goog.module.ModuleInfo, goog.Disposable);


***REMOVED***
***REMOVED*** The uris that can be used to retrieve this module's code.
***REMOVED*** @type {Array.<string>?}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleInfo.prototype.uris_ = null;


***REMOVED***
***REMOVED*** The constructor to use to instantiate the module object after the module
***REMOVED*** code is loaded. This must be either goog.module.BaseModule or a subclass of
***REMOVED*** it.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleInfo.prototype.moduleConstructor_ = goog.module.BaseModule;


***REMOVED***
***REMOVED*** The module object. This will be null until the module is loaded.
***REMOVED*** @type {goog.module.BaseModule?}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleInfo.prototype.module_ = null;


***REMOVED***
***REMOVED*** Gets the dependencies of this module.
***REMOVED*** @return {Array.<string>} The ids of the modules that this module depends on.
***REMOVED***
goog.module.ModuleInfo.prototype.getDependencies = function() {
  return this.deps_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the ID of this module.
***REMOVED*** @return {string} The ID.
***REMOVED***
goog.module.ModuleInfo.prototype.getId = function() {
  return this.id_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the uris of this module.
***REMOVED*** @param {Array.<string>} uris Uris for this module's code.
***REMOVED***
goog.module.ModuleInfo.prototype.setUris = function(uris) {
  this.uris_ = uris;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the uris of this module.
***REMOVED*** @return {Array.<string>?} Uris for this module's code.
***REMOVED***
goog.module.ModuleInfo.prototype.getUris = function() {
  return this.uris_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the constructor to use to instantiate the module object after the
***REMOVED*** module code is loaded.
***REMOVED*** @param {Function} constructor The constructor of a goog.module.BaseModule
***REMOVED***     subclass.
***REMOVED***
goog.module.ModuleInfo.prototype.setModuleConstructor = function(
    constructor) {
  if (this.moduleConstructor_ === goog.module.BaseModule) {
    this.moduleConstructor_ = constructor;
  } else {
    throw Error('Cannot set module constructor more than once.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a function that should be called after the module is loaded. These
***REMOVED*** early callbacks are called after {@link Module#initialize} is called but
***REMOVED*** before the other callbacks are called.
***REMOVED*** @param {Function} fn A callback function that takes a single argument which
***REMOVED***    is the module context.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED*** @return {goog.module.ModuleLoadCallback} Reference to the callback
***REMOVED***     object.
***REMOVED***
goog.module.ModuleInfo.prototype.registerEarlyCallback = function(
    fn, opt_handler) {
  return this.registerCallback_(this.earlyOnloadCallbacks_, fn, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Registers a function that should be called after the module is loaded.
***REMOVED*** @param {Function} fn A callback function that takes a single argument which
***REMOVED***    is the module context.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED*** @return {goog.module.ModuleLoadCallback} Reference to the callback
***REMOVED***     object.
***REMOVED***
goog.module.ModuleInfo.prototype.registerCallback = function(
    fn, opt_handler) {
  return this.registerCallback_(this.onloadCallbacks_, fn, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Registers a function that should be called if the module load fails.
***REMOVED*** @param {Function} fn A callback function that takes a single argument which
***REMOVED***    is the failure type.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED*** @return {goog.module.ModuleLoadCallback} Reference to the callback
***REMOVED***     object.
***REMOVED***
goog.module.ModuleInfo.prototype.registerErrback = function(
    fn, opt_handler) {
  return this.registerCallback_(this.onErrorCallbacks_, fn, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Registers a function that should be called after the module is loaded.
***REMOVED*** @param {Array.<goog.module.ModuleLoadCallback>} callbacks The array to
***REMOVED***     add the callback to.
***REMOVED*** @param {Function} fn A callback function that takes a single argument which
***REMOVED***     is the module context.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED*** @return {goog.module.ModuleLoadCallback} Reference to the callback
***REMOVED***     object.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleInfo.prototype.registerCallback_ = function(
    callbacks, fn, opt_handler) {
  var callback = new goog.module.ModuleLoadCallback(fn, opt_handler);
  callbacks.push(callback);
  return callback;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the module has been loaded.
***REMOVED*** @return {boolean} Whether the module has been loaded.
***REMOVED***
goog.module.ModuleInfo.prototype.isLoaded = function() {
  return !!this.module_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the module.
***REMOVED*** @return {goog.module.BaseModule?} The module if it has been loaded.
***REMOVED***     Otherwise, null.
***REMOVED***
goog.module.ModuleInfo.prototype.getModule = function() {
  return this.module_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets this module as loaded.
***REMOVED*** @param {function() : Object} contextProvider A function that provides the
***REMOVED***     module context.
***REMOVED*** @return {boolean} Whether any errors occurred while executing the onload
***REMOVED***     callbacks.
***REMOVED***
goog.module.ModuleInfo.prototype.onLoad = function(contextProvider) {
  // Instantiate and initialize the module object.
  var module = new this.moduleConstructor_;
  module.initialize(contextProvider());

  // Keep an internal reference to the module.
  this.module_ = module;

  // Fire any early callbacks that were waiting for the module to be loaded.
  var errors =
      !!this.callCallbacks_(this.earlyOnloadCallbacks_, contextProvider());

  // Fire any callbacks that were waiting for the module to be loaded.
  errors = errors ||
      !!this.callCallbacks_(this.onloadCallbacks_, contextProvider());

  if (!errors) {
    // Clear the errbacks.
    this.onErrorCallbacks_.length = 0;
  }

  return errors;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the error callbacks for the module.
***REMOVED*** @param {goog.module.ModuleManager.FailureType} cause What caused the error.
***REMOVED***
goog.module.ModuleInfo.prototype.onError = function(cause) {
  var result = this.callCallbacks_(this.onErrorCallbacks_, cause);
  if (result) {
    // Throw an exception asynchronously. Do not let the exception leak
    // up to the caller, or it will blow up the module loading framework.
    window.setTimeout(
        goog.functions.error('Module errback failures: ' + result), 0);
  }
  this.earlyOnloadCallbacks_.length = 0;
  this.onloadCallbacks_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Helper to call the callbacks after module load.
***REMOVED*** @param {Array.<goog.module.ModuleLoadCallback>} callbacks The callbacks
***REMOVED***     to call and then clear.
***REMOVED*** @param {*} context The module context.
***REMOVED*** @return {Array.<*>} Any errors encountered while calling the callbacks,
***REMOVED***     or null if there were no errors.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleInfo.prototype.callCallbacks_ = function(callbacks, context) {
  // NOTE(nicksantos):
  // In practice, there are two error-handling scenarios:
  // 1) The callback does some mandatory initialization of the module.
  // 2) The callback is for completion of some optional UI event.
  // There's no good way to handle both scenarios.
  //
  // Our strategy here is to protect module manager from exceptions, so that
  // the failure of one module doesn't affect the loading of other modules.
  // Then, we try to report the exception as best we can.

  // Call each callback in the order they were registered
  var errors = [];
  for (var i = 0; i < callbacks.length; i++) {
    try {
      callbacks[i].execute(context);
    } catch (e) {
      errors.push(e);
    }
  }

  // Clear the list of callbacks.
  callbacks.length = 0;
  return errors.length ? errors : null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.module.ModuleInfo.prototype.disposeInternal = function() {
  goog.module.ModuleInfo.superClass_.disposeInternal.call(this);
  goog.dispose(this.module_);
***REMOVED***
