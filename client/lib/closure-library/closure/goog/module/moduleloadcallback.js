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
***REMOVED*** @fileoverview A simple callback mechanism for notification about module
***REMOVED*** loads. Should be considered package-private to goog.module.
***REMOVED***
***REMOVED***

goog.provide('goog.module.ModuleLoadCallback');

goog.require('goog.debug.entryPointRegistry');
goog.require('goog.debug.errorHandlerWeakDep');



***REMOVED***
***REMOVED*** Class used to encapsulate the callbacks to be called when a module loads.
***REMOVED*** @param {Function} fn Callback function.
***REMOVED*** @param {Object=} opt_handler Optional handler under whose scope to execute
***REMOVED***     the callback.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.module.ModuleLoadCallback = function(fn, opt_handler) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Callback function.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fn_ = fn;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional handler under whose scope to execute the callback.
  ***REMOVED*** @type {Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = opt_handler;
***REMOVED***


***REMOVED***
***REMOVED*** Completes the operation and calls the callback function if appropriate.
***REMOVED*** @param {*} context The module context.
***REMOVED***
goog.module.ModuleLoadCallback.prototype.execute = function(context) {
  if (this.fn_) {
    this.fn_.call(this.handler_ || null, context);
    this.handler_ = null;
    this.fn_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Abort the callback, but not the actual module load.
***REMOVED***
goog.module.ModuleLoadCallback.prototype.abort = function() {
  this.fn_ = null;
  this.handler_ = null;
***REMOVED***


// Register the browser event handler as an entry point, so that
// it can be monitored for exception handling, etc.
goog.debug.entryPointRegistry.register(
   ***REMOVED*****REMOVED***
    ***REMOVED*** @param {function(!Function): !Function} transformer The transforming
    ***REMOVED***     function.
   ***REMOVED*****REMOVED***
    function(transformer) {
      goog.module.ModuleLoadCallback.prototype.execute =
          transformer(goog.module.ModuleLoadCallback.prototype.execute);
    });
