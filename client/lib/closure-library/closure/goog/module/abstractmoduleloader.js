// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An interface for module loading.
***REMOVED***
***REMOVED***

goog.provide('goog.module.AbstractModuleLoader');



***REMOVED***
***REMOVED*** An interface that loads JavaScript modules.
***REMOVED*** @interface
***REMOVED***
goog.module.AbstractModuleLoader = function() {***REMOVED***


***REMOVED***
***REMOVED*** Loads a list of JavaScript modules.
***REMOVED***
***REMOVED*** @param {Array.<string>} ids The module ids in dependency order.
***REMOVED*** @param {Object} moduleInfoMap A mapping from module id to ModuleInfo object.
***REMOVED*** @param {function()?=} opt_successFn The callback if module loading is a
***REMOVED***     success.
***REMOVED*** @param {function(?number)?=} opt_errorFn The callback if module loading is an
***REMOVED***     error.
***REMOVED*** @param {function()?=} opt_timeoutFn The callback if module loading times out.
***REMOVED*** @param {boolean=} opt_forceReload Whether to bypass cache while loading the
***REMOVED***     module.
***REMOVED***
goog.module.AbstractModuleLoader.prototype.loadModules = function(
    ids, moduleInfoMap, opt_successFn, opt_errorFn, opt_timeoutFn,
    opt_forceReload) {***REMOVED***


***REMOVED***
***REMOVED*** Pre-fetches a JavaScript module.
***REMOVED***
***REMOVED*** @param {string} id The module id.
***REMOVED*** @param {!goog.module.ModuleInfo} moduleInfo The module info.
***REMOVED***
goog.module.AbstractModuleLoader.prototype.prefetchModule = function(
    id, moduleInfo) {***REMOVED***
