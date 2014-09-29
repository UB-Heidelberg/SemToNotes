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
***REMOVED*** @fileoverview A singleton object for managing Javascript code modules.
***REMOVED***
***REMOVED***

goog.provide('goog.module.ModuleManager');
goog.provide('goog.module.ModuleManager.CallbackType');
goog.provide('goog.module.ModuleManager.FailureType');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Trace');
goog.require('goog.dispose');
goog.require('goog.module.ModuleInfo');
goog.require('goog.module.ModuleLoadCallback');
goog.require('goog.object');



***REMOVED***
***REMOVED*** The ModuleManager keeps track of all modules in the environment.
***REMOVED*** Since modules may not have their code loaded, we must keep track of them.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.module.ModuleManager = function() {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A mapping from module id to ModuleInfo object.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.moduleInfoMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The ids of the currently loading modules. If batch mode is disabled, then
  ***REMOVED*** this array will never contain more than one element at a time.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.loadingModuleIds_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The requested ids of the currently loading modules. This does not include
  ***REMOVED*** module dependencies that may also be loading.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.requestedLoadingModuleIds_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A queue of the ids of requested but not-yet-loaded modules. The zero
  ***REMOVED*** position is the front of the queue. This is a 2-D array to group modules
  ***REMOVED*** together with other modules that should be batch loaded with them, if
  ***REMOVED*** batch loading is enabled.
  ***REMOVED*** @type {Array.<Array.<string>>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.requestedModuleIdsQueue_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The ids of the currently loading modules which have been initiated by user
  ***REMOVED*** actions.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userInitiatedLoadingModuleIds_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of callback types to the functions to call for the specified
  ***REMOVED*** callback type.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callbackMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Module info for the base module (the one that contains the module
  ***REMOVED*** manager code), which we set as the loading module so one can
  ***REMOVED*** register initialization callbacks in the base module.
  ***REMOVED***
  ***REMOVED*** The base module is considered loaded when #setAllModuleInfo is called or
  ***REMOVED*** #setModuleContext is called, whichever comes first.
  ***REMOVED***
  ***REMOVED*** @type {goog.module.ModuleInfo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.baseModuleInfo_ = new goog.module.ModuleInfo([], '');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The module that is currently loading, or null if not loading anything.
  ***REMOVED*** @type {goog.module.ModuleInfo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.currentlyLoadingModule_ = this.baseModuleInfo_;
***REMOVED***
goog.inherits(goog.module.ModuleManager, goog.Disposable);
goog.addSingletonGetter(goog.module.ModuleManager);


***REMOVED***
* The type of callbacks that can be registered with the module manager,.
* @enum {string}
*/
goog.module.ModuleManager.CallbackType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when an error has occurred.
 ***REMOVED*****REMOVED***
  ERROR: 'error',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when it becomes idle and has no more module loads to process.
 ***REMOVED*****REMOVED***
  IDLE: 'idle',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when it becomes active and has module loads to process.
 ***REMOVED*****REMOVED***
  ACTIVE: 'active',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when it becomes idle and has no more user-initiated module loads to
  ***REMOVED*** process.
 ***REMOVED*****REMOVED***
  USER_IDLE: 'userIdle',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fired when it becomes active and has user-initiated module loads to
  ***REMOVED*** process.
 ***REMOVED*****REMOVED***
  USER_ACTIVE: 'userActive'
***REMOVED***


***REMOVED***
***REMOVED*** A non-HTTP status code indicating a corruption in loaded module.
***REMOVED*** This should be used by a ModuleLoader as a replacement for the HTTP code
***REMOVED*** given to the error handler function to indicated that the module was
***REMOVED*** corrupted.
***REMOVED*** This will set the forceReload flag on the loadModules method when retrying
***REMOVED*** module loading.
***REMOVED*** @type {number}
***REMOVED***
goog.module.ModuleManager.CORRUPT_RESPONSE_STATUS_CODE = 8001;


***REMOVED***
***REMOVED*** A logger.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.logger_ = goog.debug.Logger.getLogger(
    'goog.module.ModuleManager');


***REMOVED***
***REMOVED*** Whether the batch mode (i.e. the loading of multiple modules with just one
***REMOVED*** request) has been enabled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.batchModeEnabled_ = false;


***REMOVED***
***REMOVED*** A loader for the modules that implements loadModules(ids, moduleInfoMap,
***REMOVED*** opt_successFn, opt_errorFn, opt_timeoutFn, opt_forceReload) method.
***REMOVED*** @type {goog.module.AbstractModuleLoader}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loader_ = null;


// TODO(user): Remove tracer.
***REMOVED***
***REMOVED*** Tracer that measures how long it takes to load a module.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loadTracer_ = null;


***REMOVED***
***REMOVED*** The number of consecutive failures that have happened upon module load
***REMOVED*** requests.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.consecutiveFailures_ = 0;


***REMOVED***
***REMOVED*** Determines if the module manager was just active before the processing of
***REMOVED*** the last data.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.lastActive_ = false;


***REMOVED***
***REMOVED*** Determines if the module manager was just user active before the processing
***REMOVED*** of the last data. The module manager is user active if any of the
***REMOVED*** user-initiated modules are loading or queued up to load.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.userLastActive_ = false;


***REMOVED***
***REMOVED*** The module context needed for module initialization.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.moduleContext_ = null;


***REMOVED***
***REMOVED*** Sets the batch mode as enabled or disabled for the module manager.
***REMOVED*** @param {boolean} enabled Whether the batch mode is to be enabled or not.
***REMOVED***
goog.module.ModuleManager.prototype.setBatchModeEnabled = function(
    enabled) {
  this.batchModeEnabled_ = enabled;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the module info for all modules. Should only be called once.
***REMOVED***
***REMOVED*** @param {Object.<Array.<string>>} infoMap An object that contains a mapping
***REMOVED***    from module id (String) to list of required module ids (Array).
***REMOVED***
goog.module.ModuleManager.prototype.setAllModuleInfo = function(infoMap) {
  for (var id in infoMap) {
    this.moduleInfoMap_[id] = new goog.module.ModuleInfo(infoMap[id], id);
  }
  this.maybeFinishBaseLoad_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the module info for all modules. Should only be called once. Also
***REMOVED*** marks modules that are currently being loaded.
***REMOVED***
***REMOVED*** @param {string=} opt_info A string representation of the module dependency
***REMOVED***      graph, in the form: module1:dep1,dep2/module2:dep1,dep2 etc.
***REMOVED***     Where depX is the base-36 encoded position of the dep in the module list.
***REMOVED*** @param {Array.<string>=} opt_loadingModuleIds A list of moduleIds that
***REMOVED***     are currently being loaded.
***REMOVED***
goog.module.ModuleManager.prototype.setAllModuleInfoString = function(
    opt_info, opt_loadingModuleIds) {
  if (!goog.isString(opt_info)) {
    // The call to this method is generated in two steps, the argument is added
    // after some of the compilation passes.  This means that the initial code
    // doesn't have any arguments and causes compiler errors.  We make it
    // optional to satisfy this constraint.
    return;
  }

  var modules = opt_info.split('/');
  var moduleIds = [];

  // Split the string into the infoMap of id->deps
  for (var i = 0; i < modules.length; i++) {
    var parts = modules[i].split(':');
    var id = parts[0];
    var deps;
    if (parts[1]) {
      deps = parts[1].split(',');
      for (var j = 0; j < deps.length; j++) {
        var index = parseInt(deps[j], 36);
        goog.asserts.assert(
            moduleIds[index], 'No module @ %s, dep of %s @ %s', index, id, i);
        deps[j] = moduleIds[index];
      }
    } else {
      deps = [];
    }
    moduleIds.push(id);
    this.moduleInfoMap_[id] = new goog.module.ModuleInfo(deps, id);
  }
  if (opt_loadingModuleIds) {
    goog.array.extend(this.loadingModuleIds_, opt_loadingModuleIds);
  }
  this.maybeFinishBaseLoad_();
***REMOVED***


***REMOVED***
***REMOVED*** Gets a module info object by id.
***REMOVED*** @param {string} id A module identifier.
***REMOVED*** @return {goog.module.ModuleInfo} The module info.
***REMOVED***
goog.module.ModuleManager.prototype.getModuleInfo = function(id) {
  return this.moduleInfoMap_[id];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the module uris.
***REMOVED***
***REMOVED*** @param {Object} moduleUriMap The map of id/uris pairs for each module.
***REMOVED***
goog.module.ModuleManager.prototype.setModuleUris = function(moduleUriMap) {
  for (var id in moduleUriMap) {
    this.moduleInfoMap_[id].setUris(moduleUriMap[id]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the application-specific module loader.
***REMOVED*** @return {goog.module.AbstractModuleLoader} An object that has a
***REMOVED***     loadModules(ids, moduleInfoMap, opt_successFn, opt_errFn,
***REMOVED***         opt_timeoutFn, opt_forceReload) method.
***REMOVED***
goog.module.ModuleManager.prototype.getLoader = function() {
  return this.loader_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the application-specific module loader.
***REMOVED*** @param {goog.module.AbstractModuleLoader} loader An object that has a
***REMOVED***     loadModules(ids, moduleInfoMap, opt_successFn, opt_errFn,
***REMOVED***         opt_timeoutFn, opt_forceReload) method.
***REMOVED***
goog.module.ModuleManager.prototype.setLoader = function(loader) {
  this.loader_ = loader;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the module context to use to initialize the module.
***REMOVED*** @return {Object} The context.
***REMOVED***
goog.module.ModuleManager.prototype.getModuleContext = function() {
  return this.moduleContext_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the module context to use to initialize the module.
***REMOVED*** @param {Object} context The context.
***REMOVED***
goog.module.ModuleManager.prototype.setModuleContext = function(context) {
  this.moduleContext_ = context;
  this.maybeFinishBaseLoad_();
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the ModuleManager is active
***REMOVED*** @return {boolean} TRUE iff the ModuleManager is active (i.e., not idle).
***REMOVED***
goog.module.ModuleManager.prototype.isActive = function() {
  return this.loadingModuleIds_.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the ModuleManager is user active
***REMOVED*** @return {boolean} TRUE iff the ModuleManager is user active (i.e., not idle).
***REMOVED***
goog.module.ModuleManager.prototype.isUserActive = function() {
  return this.userInitiatedLoadingModuleIds_.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches an ACTIVE or IDLE event if necessary.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.dispatchActiveIdleChangeIfNeeded_ =
    function() {
  var lastActive = this.lastActive_;
  var active = this.isActive();
  if (active != lastActive) {
    this.executeCallbacks_(active ?
        goog.module.ModuleManager.CallbackType.ACTIVE :
        goog.module.ModuleManager.CallbackType.IDLE);

    // Flip the last active value.
    this.lastActive_ = active;
  }

  // Check if the module manager is user active i.e., there are user initiated
  // modules being loaded or queued up to be loaded.
  var userLastActive = this.userLastActive_;
  var userActive = this.isUserActive();
  if (userActive != userLastActive) {
    this.executeCallbacks_(userActive ?
        goog.module.ModuleManager.CallbackType.USER_ACTIVE :
        goog.module.ModuleManager.CallbackType.USER_IDLE);

    // Flip the last user active value.
    this.userLastActive_ = userActive;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Preloads a module after a short delay.
***REMOVED***
***REMOVED*** @param {string} id The id of the module to preload.
***REMOVED*** @param {number=} opt_timeout The number of ms to wait before adding the
***REMOVED***     module id to the loading queue (defaults to 0 ms). Note that the module
***REMOVED***     will be loaded asynchronously regardless of the value of this parameter.
***REMOVED*** @return {goog.async.Deferred} A deferred object.
***REMOVED***
goog.module.ModuleManager.prototype.preloadModule = function(
    id, opt_timeout) {
  var d = new goog.async.Deferred();
  window.setTimeout(
      goog.bind(this.addLoadModule_, this, id, d),
      opt_timeout || 0);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Prefetches a JavaScript module and its dependencies, which means that the
***REMOVED*** module will be downloaded, but not evaluated. To complete the module load,
***REMOVED*** the caller should also call load or execOnLoad after prefetching the module.
***REMOVED***
***REMOVED*** @param {string} id The id of the module to prefetch.
***REMOVED***
goog.module.ModuleManager.prototype.prefetchModule = function(id) {
  var moduleInfo = this.getModuleInfo(id);
  if (moduleInfo.isLoaded() || this.isModuleLoading(id)) {
    throw Error('Module load already requested: ' + id);
  } else if (this.batchModeEnabled_) {
    throw Error('Modules prefetching is not supported in batch mode');
  } else {
    var idWithDeps = this.getNotYetLoadedTransitiveDepIds_(id);
    for (var i = 0; i < idWithDeps.length; i++) {
      this.loader_.prefetchModule(idWithDeps[i],
          this.moduleInfoMap_[idWithDeps[i]]);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Loads a single module for use with a given deferred.
***REMOVED***
***REMOVED*** @param {string} id The id of the module to load.
***REMOVED*** @param {goog.async.Deferred} d A deferred object.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.addLoadModule_ = function(id, d) {
  var moduleInfo = this.getModuleInfo(id);
  if (moduleInfo.isLoaded()) {
    d.callback(this.moduleContext_);
    return;
  }

  this.registerModuleLoadCallbacks_(id, moduleInfo, false, d);
  if (!this.isModuleLoading(id)) {
    this.loadModulesOrEnqueue_([id]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Loads a list of modules or, if some other module is currently being loaded,
***REMOVED*** appends the ids to the queue of requested module ids. Registers callbacks a
***REMOVED*** module that is currently loading and returns a fired deferred for a module
***REMOVED*** that is already loaded.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The id of the module to load.
***REMOVED*** @param {boolean=} opt_userInitiated If the load is a result of a user action.
***REMOVED*** @return {Object.<!goog.async.Deferred>} A mapping from id (String) to
***REMOVED***     deferred objects that will callback or errback when the load for that
***REMOVED***     id is finished.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loadModulesOrEnqueueIfNotLoadedOrLoading_ =
    function(ids, opt_userInitiated) {
  var uniqueIds = [];
  goog.array.removeDuplicates(ids, uniqueIds);
  var idsToLoad = [];
  var deferredMap = {***REMOVED***
  for (var i = 0; i < uniqueIds.length; i++) {
    var id = uniqueIds[i];
    var moduleInfo = this.getModuleInfo(id);
    var d = new goog.async.Deferred();
    deferredMap[id] = d;
    if (moduleInfo.isLoaded()) {
      d.callback(this.moduleContext_);
    } else {
      this.registerModuleLoadCallbacks_(id, moduleInfo, !!opt_userInitiated, d);
      if (!this.isModuleLoading(id)) {
        idsToLoad.push(id);
      }
    }
  }

  // If there are ids to load, load them, otherwise, they are all loading or
  // loaded.
  if (idsToLoad.length > 0) {
    this.loadModulesOrEnqueue_(idsToLoad);
  }
  return deferredMap;
***REMOVED***


***REMOVED***
***REMOVED*** Registers the callbacks and handles logic if it is a user initiated module
***REMOVED*** load.
***REMOVED***
***REMOVED*** @param {string} id The id of the module to possibly load.
***REMOVED*** @param {!goog.module.ModuleInfo} moduleInfo The module identifier for the
***REMOVED***     given id.
***REMOVED*** @param {boolean} userInitiated If the load was user initiated.
***REMOVED*** @param {goog.async.Deferred} d A deferred object.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.registerModuleLoadCallbacks_ =
    function(id, moduleInfo, userInitiated, d) {
  moduleInfo.registerCallback(d.callback, d);
  moduleInfo.registerErrback(function(err) { d.errback(Error(err)); });
  // If it's already loading, we don't have to do anything besides handle
  // if it was user initiated
  if (this.isModuleLoading(id)) {
    if (userInitiated) {
      this.logger_.info('User initiated module already loading: ' + id);
      this.addUserInitiatedLoadingModule_(id);
      this.dispatchActiveIdleChangeIfNeeded_();
    }
  } else {
    if (userInitiated) {
      this.logger_.info('User initiated module load: ' + id);
      this.addUserInitiatedLoadingModule_(id);
    } else {
      this.logger_.info('Initiating module load: ' + id);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Initiates loading of a list of modules or, if a module is currently being
***REMOVED*** loaded, appends the modules to the queue of requested module ids.
***REMOVED***
***REMOVED*** The caller should verify that the requested modules are not already loaded or
***REMOVED*** loading. {@link #loadModulesOrEnqueueIfNotLoadedOrLoading_} is a more lenient
***REMOVED*** alternative to this method.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The ids of the modules to load.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loadModulesOrEnqueue_ = function(ids) {
  if (goog.array.isEmpty(this.loadingModuleIds_)) {
    this.loadModules_(ids);
  } else {
    this.requestedModuleIdsQueue_.push(ids);
    this.dispatchActiveIdleChangeIfNeeded_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the amount of delay to wait before sending a request for more modules.
***REMOVED*** If a certain module request fails, we backoff a little bit and try again.
***REMOVED*** @return {number} Delay, in ms.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.getBackOff_ = function() {
  // 5 seconds after one error, 20 seconds after 2.
  return Math.pow(this.consecutiveFailures_, 2)***REMOVED*** 5000;
***REMOVED***


***REMOVED***
***REMOVED*** Loads a list of modules and any of their not-yet-loaded prerequisites.
***REMOVED*** If batch mode is enabled, the prerequisites will be loaded together with the
***REMOVED*** requested modules and all requested modules will be loaded at the same time.
***REMOVED***
***REMOVED*** The caller should verify that the requested modules are not already loaded
***REMOVED*** and that no modules are currently loading before calling this method.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The ids of the modules to load.
***REMOVED*** @param {boolean=} opt_isRetry If the load is a retry of a previous load
***REMOVED***     attempt.
***REMOVED*** @param {boolean=} opt_forceReload Whether to bypass cache while loading the
***REMOVED***     module.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loadModules_ = function(
    ids, opt_isRetry, opt_forceReload) {
  if (!opt_isRetry) {
    this.consecutiveFailures_ = 0;
  }

  // Not all modules may be loaded immediately if batch mode is not enabled.
  var idsToLoadImmediately = this.processModulesForLoad_(ids);

  this.logger_.info('Loading module(s): ' + idsToLoadImmediately);
  this.loadingModuleIds_ = idsToLoadImmediately;

  if (this.batchModeEnabled_) {
    this.requestedLoadingModuleIds_ = ids;
  } else {
    // If batch mode is disabled, we treat each dependency load as a separate
    // load.
    this.requestedLoadingModuleIds_ = goog.array.clone(idsToLoadImmediately);
  }

  // Dispatch an active/idle change if needed.
  this.dispatchActiveIdleChangeIfNeeded_();

  var loadFn = goog.bind(this.loader_.loadModules, this.loader_,
      goog.array.clone(idsToLoadImmediately),
      this.moduleInfoMap_,
      null,
      goog.bind(this.handleLoadError_, this),
      goog.bind(this.handleLoadTimeout_, this),
      !!opt_forceReload);

  var delay = this.getBackOff_();
  if (delay) {
    window.setTimeout(loadFn, delay);
  } else {
    loadFn();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Processes a list of module ids for loading. Checks if any of the modules are
***REMOVED*** already loaded and then gets transitive deps. Queues any necessary modules
***REMOVED*** if batch mode is not enabled. Returns the list of ids that should be loaded.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The ids that need to be loaded.
***REMOVED*** @return {Array.<string>} The ids to load, including dependencies.
***REMOVED*** @throws {Error} If the module is already loaded.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.processModulesForLoad_ = function(ids) {
  for (var i = 0; i < ids.length; i++) {
    var moduleInfo = this.moduleInfoMap_[ids[i]];
    if (moduleInfo.isLoaded()) {
      throw Error('Module already loaded: ' + ids[i]);
    }
  }

  // Build a list of the ids of this module and any of its not-yet-loaded
  // prerequisite modules in dependency order.
  var idsWithDeps = [];
  for (var i = 0; i < ids.length; i++) {
    idsWithDeps = idsWithDeps.concat(
        this.getNotYetLoadedTransitiveDepIds_(ids[i]));
  }
  goog.array.removeDuplicates(idsWithDeps);

  if (!this.batchModeEnabled_ && idsWithDeps.length > 1) {
    var idToLoad = idsWithDeps.shift();
    this.logger_.info('Must load ' + idToLoad + ' module before ' + ids);

    // Insert the requested module id and any other not-yet-loaded prereqs
    // that it has at the front of the queue.
    var queuedModules = goog.array.map(idsWithDeps, function(id) {
      return [id];
    });
    this.requestedModuleIdsQueue_ = queuedModules.concat(
        this.requestedModuleIdsQueue_);
    return [idToLoad];
  } else {
    return idsWithDeps;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Builds a list of the ids of the not-yet-loaded modules that a particular
***REMOVED*** module transitively depends on, including itself.
***REMOVED***
***REMOVED*** @param {string} id The id of a not-yet-loaded module.
***REMOVED*** @return {Array.<string>} An array of module ids in dependency order that's
***REMOVED***     guaranteed to end with the provided module id.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.getNotYetLoadedTransitiveDepIds_ =
    function(id) {
  // NOTE(user): We want the earliest occurrance of a module, not the first
  // dependency we find. Therefore we strip duplicates at the end rather than
  // during.  See the tests for concrete examples.
  var ids = [id];
  var depIds = goog.array.clone(this.getModuleInfo(id).getDependencies());
  while (depIds.length) {
    var depId = depIds.pop();
    if (!this.getModuleInfo(depId).isLoaded()) {
      ids.unshift(depId);
      // We need to process direct dependencies first.
      Array.prototype.unshift.apply(depIds,
          this.getModuleInfo(depId).getDependencies());
    }
  }
  goog.array.removeDuplicates(ids);
  return ids;
***REMOVED***


***REMOVED***
***REMOVED*** If we are still loading the base module, consider the load complete.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.maybeFinishBaseLoad_ = function() {
  if (this.currentlyLoadingModule_ == this.baseModuleInfo_) {
    this.currentlyLoadingModule_ = null;
    var error = this.baseModuleInfo_.onLoad(
        goog.bind(this.getModuleContext, this));
    if (error) {
      this.dispatchModuleLoadFailed_(
          goog.module.ModuleManager.FailureType.INIT_ERROR);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Records that a module was loaded. Also initiates loading the next module if
***REMOVED*** any module requests are queued. This method is called by code that is
***REMOVED*** generated and appended to each dynamic module's code at compilation time.
***REMOVED***
***REMOVED*** @param {string} id A module id.
***REMOVED***
goog.module.ModuleManager.prototype.setLoaded = function(id) {
  if (this.isDisposed()) {
    this.logger_.warning(
        'Module loaded after module manager was disposed: ' + id);
    return;
  }

  this.logger_.info('Module loaded: ' + id);

  var error = this.moduleInfoMap_[id].onLoad(
      goog.bind(this.getModuleContext, this));
  if (error) {
    this.dispatchModuleLoadFailed_(
        goog.module.ModuleManager.FailureType.INIT_ERROR);
  }

  // Remove the module id from the user initiated set if it existed there.
  goog.array.remove(this.userInitiatedLoadingModuleIds_, id);

  // Remove the module id from the loading modules if it exists there.
  goog.array.remove(this.loadingModuleIds_, id);

  if (goog.array.isEmpty(this.loadingModuleIds_)) {
    // No more modules are currently being loaded (e.g. arriving later in the
    // same HTTP response), so proceed to load the next module in the queue.
    this.loadNextModules_();
  }

  // Dispatch an active/idle change if needed.
  this.dispatchActiveIdleChangeIfNeeded_();
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether a module is currently loading or in the queue, waiting to be
***REMOVED*** loaded.
***REMOVED*** @param {string} id A module id.
***REMOVED*** @return {boolean} TRUE iff the module is loading.
***REMOVED***
goog.module.ModuleManager.prototype.isModuleLoading = function(id) {
  if (goog.array.contains(this.loadingModuleIds_, id)) {
    return true;
  }
  for (var i = 0; i < this.requestedModuleIdsQueue_.length; i++) {
    if (goog.array.contains(this.requestedModuleIdsQueue_[i], id)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Requests that a function be called once a particular module is loaded.
***REMOVED*** Client code can use this method to safely call into modules that may not yet
***REMOVED*** be loaded. For consistency, this method always calls the function
***REMOVED*** asynchronously -- even if the module is already loaded. Initiates loading of
***REMOVED*** the module if necessary, unless opt_noLoad is true.
***REMOVED***
***REMOVED*** @param {string} moduleId A module id.
***REMOVED*** @param {Function} fn Function to execute when the module has loaded.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED*** @param {boolean=} opt_noLoad TRUE iff not to initiate loading of the module.
***REMOVED*** @param {boolean=} opt_userInitiated TRUE iff the loading of the module was
***REMOVED***     user initiated.
***REMOVED*** @param {boolean=} opt_preferSynchronous TRUE iff the function should be
***REMOVED***     executed synchronously if the module has already been loaded.
***REMOVED*** @return {goog.module.ModuleLoadCallback} A callback wrapper that exposes
***REMOVED***     an abort and execute method.
***REMOVED***
goog.module.ModuleManager.prototype.execOnLoad = function(
    moduleId, fn, opt_handler, opt_noLoad,
    opt_userInitiated, opt_preferSynchronous) {
  var moduleInfo = this.moduleInfoMap_[moduleId];
  var callbackWrapper;

  if (moduleInfo.isLoaded()) {
    this.logger_.info(moduleId + ' module already loaded');
    // Call async so that code paths don't change between loaded and unloaded
    // cases.
    callbackWrapper = new goog.module.ModuleLoadCallback(fn, opt_handler);
    if (opt_preferSynchronous) {
      callbackWrapper.execute(this.moduleContext_);
    } else {
      window.setTimeout(
          goog.bind(callbackWrapper.execute, callbackWrapper), 0);
    }
  } else if (this.isModuleLoading(moduleId)) {
    this.logger_.info(moduleId + ' module already loading');
    callbackWrapper = moduleInfo.registerCallback(fn, opt_handler);
    if (opt_userInitiated) {
      this.logger_.info('User initiated module already loading: ' + moduleId);
      this.addUserInitiatedLoadingModule_(moduleId);
      this.dispatchActiveIdleChangeIfNeeded_();
    }
  } else {
    this.logger_.info('Registering callback for module: ' + moduleId);
    callbackWrapper = moduleInfo.registerCallback(fn, opt_handler);
    if (!opt_noLoad) {
      if (opt_userInitiated) {
        this.logger_.info('User initiated module load: ' + moduleId);
        this.addUserInitiatedLoadingModule_(moduleId);
      }
      this.logger_.info('Initiating module load: ' + moduleId);
      this.loadModulesOrEnqueue_([moduleId]);
    }
  }
  return callbackWrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Loads a module, returning a goog.async.Deferred for keeping track of the
***REMOVED*** result.
***REMOVED***
***REMOVED*** @param {string} moduleId A module id.
***REMOVED*** @param {boolean=} opt_userInitiated If the load is a result of a user action.
***REMOVED*** @return {goog.async.Deferred} A deferred object.
***REMOVED***
goog.module.ModuleManager.prototype.load = function(
    moduleId, opt_userInitiated) {
  return this.loadModulesOrEnqueueIfNotLoadedOrLoading_(
      [moduleId], opt_userInitiated)[moduleId];
***REMOVED***


***REMOVED***
***REMOVED*** Loads a list of modules, returning a goog.async.Deferred for keeping track of
***REMOVED*** the result.
***REMOVED***
***REMOVED*** @param {Array.<string>} moduleIds A list of module ids.
***REMOVED*** @param {boolean=} opt_userInitiated If the load is a result of a user action.
***REMOVED*** @return {Object.<!goog.async.Deferred>} A mapping from id (String) to
***REMOVED***     deferred objects that will callback or errback when the load for that
***REMOVED***     id is finished.
***REMOVED***
goog.module.ModuleManager.prototype.loadMultiple = function(
    moduleIds, opt_userInitiated) {
  return this.loadModulesOrEnqueueIfNotLoadedOrLoading_(
      moduleIds, opt_userInitiated);
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that the module with the given id is listed as a user-initiated
***REMOVED*** module that is being loaded. This method guarantees that a module will never
***REMOVED*** get listed more than once.
***REMOVED*** @param {string} id Identifier of the module.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.addUserInitiatedLoadingModule_ = function(
    id) {
  if (!goog.array.contains(this.userInitiatedLoadingModuleIds_, id)) {
    this.userInitiatedLoadingModuleIds_.push(id);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Method called just before a module code is loaded.
***REMOVED*** @param {string} id Identifier of the module.
***REMOVED***
goog.module.ModuleManager.prototype.beforeLoadModuleCode = function(id) {
  this.loadTracer_ = goog.debug.Trace.startTracer('Module Load: ' + id,
      'Module Load');
  if (this.currentlyLoadingModule_) {
    this.logger_.severe('beforeLoadModuleCode called with module "' + id +
                        '" while module "' +
                        this.currentlyLoadingModule_.getId() +
                        '" is loading');
  }
  this.currentlyLoadingModule_ = this.getModuleInfo(id);
***REMOVED***


***REMOVED***
***REMOVED*** Method called just after module code is loaded
***REMOVED*** @param {string} id Identifier of the module.
***REMOVED***
goog.module.ModuleManager.prototype.afterLoadModuleCode = function(id) {
  if (!this.currentlyLoadingModule_ ||
      id != this.currentlyLoadingModule_.getId()) {
    this.logger_.severe('afterLoadModuleCode called with module "' + id +
                        '" while loading module "' +
                        (this.currentlyLoadingModule_ &&
                         this.currentlyLoadingModule_.getId()) + '"');

  }
  this.currentlyLoadingModule_ = null;
  goog.debug.Trace.stopTracer(this.loadTracer_);
***REMOVED***


***REMOVED***
***REMOVED*** Register an initialization callback for the currently loading module. This
***REMOVED*** should only be called by script that is executed during the evaluation of
***REMOVED*** a module's javascript. This is almost equivalent to calling the function
***REMOVED*** inline, but ensures that all the code from the currently loading module
***REMOVED*** has been loaded. This makes it cleaner and more robust than calling the
***REMOVED*** function inline.
***REMOVED***
***REMOVED*** If this function is called from the base module (the one that contains
***REMOVED*** the module manager code), the callback is held until #setAllModuleInfo
***REMOVED*** is called, or until #setModuleContext is called, whichever happens first.
***REMOVED***
***REMOVED*** @param {Function} fn A callback function that takes a single argument
***REMOVED***    which is the module context.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED***
goog.module.ModuleManager.prototype.registerInitializationCallback = function(
    fn, opt_handler) {
  if (!this.currentlyLoadingModule_) {
    this.logger_.severe('No module is currently loading');
  } else {
    this.currentlyLoadingModule_.registerEarlyCallback(fn, opt_handler);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Register a late initialization callback for the currently loading module.
***REMOVED*** Callbacks registered via this function are executed similar to
***REMOVED*** {@see registerInitializationCallback}, but they are fired after all
***REMOVED*** initialization callbacks are called.
***REMOVED***
***REMOVED*** @param {Function} fn A callback function that takes a single argument
***REMOVED***    which is the module context.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED***
goog.module.ModuleManager.prototype.registerLateInitializationCallback =
    function(fn, opt_handler) {
  if (!this.currentlyLoadingModule_) {
    this.logger_.severe('No module is currently loading');
  } else {
    this.currentlyLoadingModule_.registerCallback(fn, opt_handler);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the constructor to use for the module object for the currently
***REMOVED*** loading module. The constructor should derive from {@see
***REMOVED*** goog.module.BaseModule}.
***REMOVED*** @param {Function} fn The constructor function.
***REMOVED***
goog.module.ModuleManager.prototype.setModuleConstructor = function(fn) {
  if (!this.currentlyLoadingModule_) {
    this.logger_.severe('No module is currently loading');
    return;
  }
  this.currentlyLoadingModule_.setModuleConstructor(fn);
***REMOVED***


***REMOVED***
***REMOVED*** The possible reasons for a module load failure callback being fired.
***REMOVED*** @enum {number}
***REMOVED***
goog.module.ModuleManager.FailureType = {
 ***REMOVED*****REMOVED*** 401 Status.***REMOVED***
  UNAUTHORIZED: 0,

 ***REMOVED*****REMOVED*** Error status (not 401) returned multiple times.***REMOVED***
  CONSECUTIVE_FAILURES: 1,

 ***REMOVED*****REMOVED*** Request timeout.***REMOVED***
  TIMEOUT: 2,

 ***REMOVED*****REMOVED*** 410 status, old code gone.***REMOVED***
  OLD_CODE_GONE: 3,

 ***REMOVED*****REMOVED*** The onLoad callbacks failed.***REMOVED***
  INIT_ERROR: 4
***REMOVED***


***REMOVED***
***REMOVED*** Handles a module load failure.
***REMOVED***
***REMOVED*** @param {?number} status The error status.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.handleLoadError_ = function(status) {
  this.consecutiveFailures_++;
  if (status == 401) {
    // The user is not logged in. They've cleared their cookies or logged out
    // from another window.
    this.logger_.info('Module loading unauthorized');
    this.dispatchModuleLoadFailed_(
        goog.module.ModuleManager.FailureType.UNAUTHORIZED);
    // Drop any additional module requests.
    this.requestedModuleIdsQueue_.length = 0;
  } else if (status == 410) {
    // The requested module js is old and not available.
    this.requeueBatchOrDispatchFailure_(
        goog.module.ModuleManager.FailureType.OLD_CODE_GONE);
    this.loadNextModules_();
  } else if (this.consecutiveFailures_ >= 3) {
    this.logger_.info('Aborting after failure to load: ' +
                      this.loadingModuleIds_);
    this.requeueBatchOrDispatchFailure_(
        goog.module.ModuleManager.FailureType.CONSECUTIVE_FAILURES);
    this.loadNextModules_();
  } else {
    this.logger_.info('Retrying after failure to load: ' +
                      this.loadingModuleIds_);
    var forceReload =
        status == goog.module.ModuleManager.CORRUPT_RESPONSE_STATUS_CODE;
    this.loadModules_(this.requestedLoadingModuleIds_, true, forceReload);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a module load timeout.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.handleLoadTimeout_ = function() {
  this.logger_.info('Aborting after timeout: ' + this.loadingModuleIds_);
  this.requeueBatchOrDispatchFailure_(
      goog.module.ModuleManager.FailureType.TIMEOUT);
  this.loadNextModules_();
***REMOVED***


***REMOVED***
***REMOVED*** Requeues batch loads that had more than one requested module
***REMOVED*** (i.e. modules that were not included as dependencies) as separate loads or
***REMOVED*** if there was only one requested module, fails that module with the received
***REMOVED*** cause.
***REMOVED*** @param {goog.module.ModuleManager.FailureType} cause The reason for the
***REMOVED***     failure.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.requeueBatchOrDispatchFailure_ =
    function(cause) {
  // The load failed, so if there are more than one requested modules, then we
  // need to retry each one as a separate load. Otherwise, if there is only one
  // requested module, remove it and its dependencies from the queue.
  if (this.requestedLoadingModuleIds_.length > 1) {
    var queuedModules = goog.array.map(this.requestedLoadingModuleIds_,
        function(id) {
          return [id];
        });
    this.requestedModuleIdsQueue_ = queuedModules.concat(
        this.requestedModuleIdsQueue_);
  } else {
    this.dispatchModuleLoadFailed_(cause);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles when a module load failed.
***REMOVED*** @param {goog.module.ModuleManager.FailureType} cause The reason for the
***REMOVED***     failure.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.dispatchModuleLoadFailed_ = function(
    cause) {
  var failedIds = this.requestedLoadingModuleIds_;
  this.loadingModuleIds_.length = 0;
  // If any pending modules depend on the id that failed,
  // they need to be removed from the queue.
  var idsToCancel = [];
  for (var i = 0; i < this.requestedModuleIdsQueue_.length; i++) {
    var dependentModules = goog.array.filter(
        this.requestedModuleIdsQueue_[i],
       ***REMOVED*****REMOVED***
        ***REMOVED*** Returns true if the requestedId has dependencies on the modules that
        ***REMOVED*** just failed to load.
        ***REMOVED*** @param {string} requestedId The module to check for dependencies.
        ***REMOVED*** @return {boolean} True if the module depends on failed modules.
       ***REMOVED*****REMOVED***
        function(requestedId) {
          var requestedDeps = this.getNotYetLoadedTransitiveDepIds_(
              requestedId);
          return goog.array.some(failedIds, function(id) {
            return goog.array.contains(requestedDeps, id);
          });
        }, this);
    goog.array.extend(idsToCancel, dependentModules);
  }

  // Also insert the ids that failed to load as ids to cancel.
  for (var i = 0; i < failedIds.length; i++) {
    goog.array.insert(idsToCancel, failedIds[i]);
  }

  // Remove ids to cancel from the queues.
  for (var i = 0; i < idsToCancel.length; i++) {
    for (var j = 0; j < this.requestedModuleIdsQueue_.length; j++) {
      goog.array.remove(this.requestedModuleIdsQueue_[j], idsToCancel[i]);
    }
    goog.array.remove(this.userInitiatedLoadingModuleIds_, idsToCancel[i]);
  }

  // Call the functions for error notification.
  var errorCallbacks = this.callbackMap_[
      goog.module.ModuleManager.CallbackType.ERROR];
  if (errorCallbacks) {
    for (var i = 0; i < errorCallbacks.length; i++) {
      var callback = errorCallbacks[i];
      for (var j = 0; j < idsToCancel.length; j++) {
        callback(goog.module.ModuleManager.CallbackType.ERROR, idsToCancel[j],
            cause);
      }
    }
  }

  // Call the errbacks on the module info.
  for (var i = 0; i < failedIds.length; i++) {
    if (this.moduleInfoMap_[failedIds[i]]) {
      this.moduleInfoMap_[failedIds[i]].onError(cause);
    }
  }

  // Clear the requested loading module ids.
  this.requestedLoadingModuleIds_.length = 0;

  this.dispatchActiveIdleChangeIfNeeded_();
***REMOVED***


***REMOVED***
***REMOVED*** Loads the next modules on the queue.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.loadNextModules_ = function() {
  while (this.requestedModuleIdsQueue_.length) {
    // Remove modules that are already loaded.
    var nextIds = goog.array.filter(this.requestedModuleIdsQueue_.shift(),
       ***REMOVED*****REMOVED*** @param {string} id The module id.***REMOVED***
        function(id) {
          return !this.getModuleInfo(id).isLoaded();
        }, this);
    if (nextIds.length > 0) {
      this.loadModules_(nextIds);
      return;
    }
  }

  // Dispatch an active/idle change if needed.
  this.dispatchActiveIdleChangeIfNeeded_();
***REMOVED***


***REMOVED***
***REMOVED*** The function to call if the module manager is in error.
***REMOVED*** @param {goog.module.ModuleManager.CallbackType|Array.<goog.module.ModuleManager.CallbackType>} types
***REMOVED***  The callback type.
***REMOVED*** @param {Function} fn The function to register as a callback.
***REMOVED***
goog.module.ModuleManager.prototype.registerCallback = function(
    types, fn) {
  if (!goog.isArray(types)) {
    types = [types];
  }

  for (var i = 0; i < types.length; i++) {
    this.registerCallback_(types[i], fn);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Register a callback for the specified callback type.
***REMOVED*** @param {goog.module.ModuleManager.CallbackType} type The callback type.
***REMOVED*** @param {Function} fn The callback function.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.registerCallback_ = function(type, fn) {
  var callbackMap = this.callbackMap_;
  if (!callbackMap[type]) {
    callbackMap[type] = [];
  }
  callbackMap[type].push(fn);
***REMOVED***


***REMOVED***
***REMOVED*** Call the callback functions of the specified type.
***REMOVED*** @param {goog.module.ModuleManager.CallbackType} type The callback type.
***REMOVED*** @private
***REMOVED***
goog.module.ModuleManager.prototype.executeCallbacks_ = function(type) {
  var callbacks = this.callbackMap_[type];
  for (var i = 0; callbacks && i < callbacks.length; i++) {
    callbacks[i](type);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.module.ModuleManager.prototype.disposeInternal = function() {
  goog.module.ModuleManager.superClass_.disposeInternal.call(this);

  // Dispose of each ModuleInfo object.
  goog.disposeAll(
      goog.object.getValues(this.moduleInfoMap_), this.baseModuleInfo_);
  this.moduleInfoMap_ = null;
  this.loadingModuleIds_ = null;
  this.requestedLoadingModuleIds_ = null;
  this.userInitiatedLoadingModuleIds_ = null;
  this.requestedModuleIdsQueue_ = null;
  this.callbackMap_ = null;
***REMOVED***
