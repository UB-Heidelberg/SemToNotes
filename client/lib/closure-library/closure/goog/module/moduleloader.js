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
***REMOVED*** @fileoverview The module loader for loading modules across the network.
***REMOVED***
***REMOVED*** Browsers do not guarantee that scripts appended to the document
***REMOVED*** are executed in the order they are added. For production mode, we use
***REMOVED*** XHRs to load scripts, because they do not have this problem and they
***REMOVED*** have superior mechanisms for handling failure. However, XHR-evaled
***REMOVED*** scripts are harder to debug.
***REMOVED***
***REMOVED*** In debugging mode, we use normal script tags. In order to make this work,
***REMOVED*** we load the scripts in serial: we do not execute script B to the document
***REMOVED*** until we are certain that script A is finished loading.
***REMOVED***
***REMOVED***

goog.provide('goog.module.ModuleLoader');

goog.require('goog.Timer');
goog.require('goog.array');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.module.AbstractModuleLoader');
goog.require('goog.net.BulkLoader');
goog.require('goog.net.EventType');
goog.require('goog.net.jsloader');
goog.require('goog.userAgent.product');



***REMOVED***
***REMOVED*** A class that loads Javascript modules.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @implements {goog.module.AbstractModuleLoader}
***REMOVED***
goog.module.ModuleLoader = function() {
  goog.module.ModuleLoader.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for managing handling events.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.module.ModuleLoader>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map from module IDs to goog.module.ModuleLoader.LoadStatus.
  ***REMOVED*** @type {!Object.<Array.<string>, goog.module.ModuleLoader.LoadStatus>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.loadingModulesStatus_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.module.ModuleLoader, goog.events.EventTarget);


***REMOVED***
***REMOVED*** A logger.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED***
goog.module.ModuleLoader.prototype.logger = goog.log.getLogger(
    'goog.module.ModuleLoader');


***REMOVED***
***REMOVED*** Whether debug mode is enabled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.debugMode_ = false;


***REMOVED***
***REMOVED*** Whether source url injection is enabled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.sourceUrlInjection_ = false;


***REMOVED***
***REMOVED*** @return {boolean} Whether sourceURL affects stack traces.
***REMOVED***     Chrome is currently the only browser that does this, but
***REMOVED***     we believe other browsers are working on this.
***REMOVED*** @see http://bugzilla.mozilla.org/show_bug.cgi?id=583083
***REMOVED***
goog.module.ModuleLoader.supportsSourceUrlStackTraces = function() {
  return goog.userAgent.product.CHROME;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether sourceURL affects the debugger.
***REMOVED***
goog.module.ModuleLoader.supportsSourceUrlDebugger = function() {
  return goog.userAgent.product.CHROME || goog.userAgent.GECKO;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the debug mode for the loader.
***REMOVED*** @return {boolean} Whether the debug mode is enabled.
***REMOVED***
goog.module.ModuleLoader.prototype.getDebugMode = function() {
  return this.debugMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the debug mode for the loader.
***REMOVED*** @param {boolean} debugMode Whether the debug mode is enabled.
***REMOVED***
goog.module.ModuleLoader.prototype.setDebugMode = function(debugMode) {
  this.debugMode_ = debugMode;
***REMOVED***


***REMOVED***
***REMOVED*** When enabled, we will add a sourceURL comment to the end of all scripts
***REMOVED*** to mark their origin.
***REMOVED***
***REMOVED*** On WebKit, stack traces will refect the sourceURL comment, so this is
***REMOVED*** useful for debugging webkit stack traces in production.
***REMOVED***
***REMOVED*** Notice that in debug mode, we will use source url injection + eval rather
***REMOVED*** then appending script nodes to the DOM, because the scripts will load far
***REMOVED*** faster.  (Appending script nodes is very slow, because we can't parallelize
***REMOVED*** the downloading and evaling of the script).
***REMOVED***
***REMOVED*** The cost of appending sourceURL information is negligible when compared to
***REMOVED*** the cost of evaling the script. Almost all clients will want this on.
***REMOVED***
***REMOVED*** TODO(nicksantos): Turn this on by default. We may want to turn this off
***REMOVED*** for clients that inject their own sourceURL.
***REMOVED***
***REMOVED*** @param {boolean} enabled Whether source url injection is enabled.
***REMOVED***
goog.module.ModuleLoader.prototype.setSourceUrlInjection = function(enabled) {
  this.sourceUrlInjection_ = enabled;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether we're using source url injection.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.usingSourceUrlInjection_ = function() {
  return this.sourceUrlInjection_ ||
      (this.getDebugMode() &&
       goog.module.ModuleLoader.supportsSourceUrlStackTraces());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.module.ModuleLoader.prototype.loadModules = function(
    ids, moduleInfoMap, opt_successFn, opt_errorFn, opt_timeoutFn,
    opt_forceReload) {
  var loadStatus = this.loadingModulesStatus_[ids] ||
      new goog.module.ModuleLoader.LoadStatus();
  loadStatus.loadRequested = true;
  loadStatus.successFn = opt_successFn || null;
  loadStatus.errorFn = opt_errorFn || null;

  if (!this.loadingModulesStatus_[ids]) {
    // Modules were not prefetched.
    this.loadingModulesStatus_[ids] = loadStatus;
    this.downloadModules_(ids, moduleInfoMap);
    // TODO(user): Need to handle timeouts in the module loading code.
  } else if (goog.isDefAndNotNull(loadStatus.responseTexts)) {
    // Modules prefetch is complete.
    this.evaluateCode_(ids);
  }
  // Otherwise modules prefetch is in progress, and these modules will be
  // executed after the prefetch is complete.
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate the JS code.
***REMOVED*** @param {Array.<string>} moduleIds The module ids.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.evaluateCode_ = function(moduleIds) {
  this.dispatchEvent(new goog.module.ModuleLoader.Event(
      goog.module.ModuleLoader.EventType.REQUEST_SUCCESS, moduleIds));

  goog.log.info(this.logger, 'evaluateCode ids:' + moduleIds);
  var success = true;
  var loadStatus = this.loadingModulesStatus_[moduleIds];
  var uris = loadStatus.requestUris;
  var texts = loadStatus.responseTexts;
  try {
    if (this.usingSourceUrlInjection_()) {
      for (var i = 0; i < uris.length; i++) {
        var uri = uris[i];
        goog.globalEval(texts[i] + ' //@ sourceURL=' + uri);
      }
    } else {
      goog.globalEval(texts.join('\n'));
    }
  } catch (e) {
    success = false;
    // TODO(user): Consider throwing an exception here.
    goog.log.warning(this.logger, 'Loaded incomplete code for module(s): ' +
        moduleIds, e);
  }

  this.dispatchEvent(
      new goog.module.ModuleLoader.Event(
          goog.module.ModuleLoader.EventType.EVALUATE_CODE, moduleIds));

  if (!success) {
    this.handleErrorHelper_(moduleIds, loadStatus.errorFn, null /* status***REMOVED***);
  } else if (loadStatus.successFn) {
    loadStatus.successFn();
  }
  delete this.loadingModulesStatus_[moduleIds];
***REMOVED***


***REMOVED***
***REMOVED*** Handles a successful response to a request for prefetch or load one or more
***REMOVED*** modules.
***REMOVED***
***REMOVED*** @param {goog.net.BulkLoader} bulkLoader The bulk loader.
***REMOVED*** @param {Array.<string>} moduleIds The ids of the modules requested.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.handleSuccess_ = function(
    bulkLoader, moduleIds) {
  goog.log.info(this.logger, 'Code loaded for module(s): ' + moduleIds);

  var loadStatus = this.loadingModulesStatus_[moduleIds];
  loadStatus.responseTexts = bulkLoader.getResponseTexts();

  if (loadStatus.loadRequested) {
    this.evaluateCode_(moduleIds);
  }

  // NOTE: A bulk loader instance is used for loading a set of module ids.
  // Once these modules have been loaded successfully or in error the bulk
  // loader should be disposed as it is not needed anymore. A new bulk loader
  // is instantiated for any new modules to be loaded. The dispose is called
  // on a timer so that the bulkloader has a chance to release its
  // objects.
  goog.Timer.callOnce(bulkLoader.dispose, 5, bulkLoader);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.module.ModuleLoader.prototype.prefetchModule = function(
    id, moduleInfo) {
  // Do not prefetch in debug mode.
  if (this.getDebugMode()) {
    return;
  }
  var loadStatus = this.loadingModulesStatus_[[id]];
  if (loadStatus) {
    return;
  }

  var moduleInfoMap = {***REMOVED***
  moduleInfoMap[id] = moduleInfo;
  this.loadingModulesStatus_[[id]] = new goog.module.ModuleLoader.LoadStatus();
  this.downloadModules_([id], moduleInfoMap);
***REMOVED***


***REMOVED***
***REMOVED*** Downloads a list of JavaScript modules.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The module ids in dependency order.
***REMOVED*** @param {Object} moduleInfoMap A mapping from module id to ModuleInfo object.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.downloadModules_ = function(
    ids, moduleInfoMap) {
  var uris = [];
  for (var i = 0; i < ids.length; i++) {
    goog.array.extend(uris, moduleInfoMap[ids[i]].getUris());
  }
  goog.log.info(this.logger, 'downloadModules ids:' + ids + ' uris:' + uris);

  if (this.getDebugMode() &&
      !this.usingSourceUrlInjection_()) {
    // In debug mode use <script> tags rather than XHRs to load the files.
    // This makes it possible to debug and inspect stack traces more easily.
    // It's also possible to use it to load JavaScript files that are hosted on
    // another domain.
    // The scripts need to load serially, so this is much slower than parallel
    // script loads with source url injection.
    goog.net.jsloader.loadMany(uris);
  } else {
    var loadStatus = this.loadingModulesStatus_[ids];
    loadStatus.requestUris = uris;

    var bulkLoader = new goog.net.BulkLoader(uris);

    var eventHandler = this.eventHandler_;
    eventHandler.listen(
        bulkLoader,
    ***REMOVED***
        goog.bind(this.handleSuccess_, this, bulkLoader, ids));
    eventHandler.listen(
        bulkLoader,
        goog.net.EventType.ERROR,
        goog.bind(this.handleError_, this, bulkLoader, ids));
    bulkLoader.load();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles an error during a request for one or more modules.
***REMOVED*** @param {goog.net.BulkLoader} bulkLoader The bulk loader.
***REMOVED*** @param {Array.<string>} moduleIds The ids of the modules requested.
***REMOVED*** @param {number} status The response status.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.handleError_ = function(
    bulkLoader, moduleIds, status) {
  var loadStatus = this.loadingModulesStatus_[moduleIds];
  // The bulk loader doesn't cancel other requests when a request fails. We will
  // delete the loadStatus in the first failure, so it will be undefined in
  // subsequent errors.
  if (loadStatus) {
    delete this.loadingModulesStatus_[moduleIds];
    this.handleErrorHelper_(moduleIds, loadStatus.errorFn, status);
  }

  // NOTE: A bulk loader instance is used for loading a set of module ids. Once
  // these modules have been loaded successfully or in error the bulk loader
  // should be disposed as it is not needed anymore. A new bulk loader is
  // instantiated for any new modules to be loaded. The dispose is called
  // on another thread so that the bulkloader has a chance to release its
  // objects.
  goog.Timer.callOnce(bulkLoader.dispose, 5, bulkLoader);
***REMOVED***


***REMOVED***
***REMOVED*** Handles an error during a request for one or more modules.
***REMOVED*** @param {Array.<string>} moduleIds The ids of the modules requested.
***REMOVED*** @param {?function(?number)} errorFn The function to call on failure.
***REMOVED*** @param {?number} status The response status.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleLoader.prototype.handleErrorHelper_ = function(
    moduleIds, errorFn, status) {
  this.dispatchEvent(
      new goog.module.ModuleLoader.Event(
          goog.module.ModuleLoader.EventType.REQUEST_ERROR, moduleIds));

  goog.log.warning(this.logger, 'Request failed for module(s): ' + moduleIds);

  if (errorFn) {
    errorFn(status);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.module.ModuleLoader.prototype.disposeInternal = function() {
  goog.module.ModuleLoader.superClass_.disposeInternal.call(this);

  this.eventHandler_.dispose();
  this.eventHandler_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.module.ModuleLoader.EventType = {
 ***REMOVED*****REMOVED*** Called after the code for a module is evaluated.***REMOVED***
  EVALUATE_CODE: goog.events.getUniqueId('evaluateCode'),

 ***REMOVED*****REMOVED*** Called when the BulkLoader finishes successfully.***REMOVED***
  REQUEST_SUCCESS: goog.events.getUniqueId('requestSuccess'),

 ***REMOVED*****REMOVED*** Called when the BulkLoader fails, or code loading fails.***REMOVED***
  REQUEST_ERROR: goog.events.getUniqueId('requestError')
***REMOVED***



***REMOVED***
***REMOVED*** @param {goog.module.ModuleLoader.EventType} type The type.
***REMOVED*** @param {Array.<string>} moduleIds The ids of the modules being evaluated.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.module.ModuleLoader.Event = function(type, moduleIds) {
  goog.module.ModuleLoader.Event.base(this, 'constructor', type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Array.<string>}
 ***REMOVED*****REMOVED***
  this.moduleIds = moduleIds;
***REMOVED***
goog.inherits(goog.module.ModuleLoader.Event, goog.events.Event);



***REMOVED***
***REMOVED*** A class that keeps the state of the module during the loading process. It is
***REMOVED*** used to save loading information between modules download and evaluation.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.module.ModuleLoader.LoadStatus = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The request uris.
  ***REMOVED*** @type {Array.<string>}
 ***REMOVED*****REMOVED***
  this.requestUris = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The response texts.
  ***REMOVED*** @type {Array.<string>}
 ***REMOVED*****REMOVED***
  this.responseTexts = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether loadModules was called for the set of modules referred by this
  ***REMOVED*** status.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.loadRequested = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Success callback.
  ***REMOVED*** @type {?function()}
 ***REMOVED*****REMOVED***
  this.successFn = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error callback.
  ***REMOVED*** @type {?function(?number)}
 ***REMOVED*****REMOVED***
  this.errorFn = null;
***REMOVED***
