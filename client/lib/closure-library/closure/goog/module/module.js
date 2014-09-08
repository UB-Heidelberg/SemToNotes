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
***REMOVED***
***REMOVED*** @fileoverview This class supports the dynamic loading of compiled
***REMOVED*** javascript modules at runtime, as descibed in the designdoc.
***REMOVED***
***REMOVED***   <http://go/js_modules_design>
***REMOVED***
***REMOVED***

goog.provide('goog.module');

goog.require('goog.array');
goog.require('goog.module.Loader');


***REMOVED***
***REMOVED*** Wrapper of goog.module.Loader.require() for use in modules.
***REMOVED*** See method goog.module.Loader.require() for
***REMOVED*** explanation of params.
***REMOVED***
***REMOVED*** @param {string} module The name of the module. Usually, the value
***REMOVED***     is defined as a constant whose name starts with MOD_.
***REMOVED*** @param {number|string} symbol The ID of the symbol. Usually, the value is
***REMOVED***     defined as a constant whose name starts with SYM_.
***REMOVED*** @param {Function} callback This function will be called with the
***REMOVED***     resolved symbol as the argument once the module is loaded.
***REMOVED***
goog.module.require = function(module, symbol, callback) {
  goog.module.Loader.getInstance().require(module, symbol, callback);
***REMOVED***


***REMOVED***
***REMOVED*** Wrapper of goog.module.Loader.provide() for use in modules
***REMOVED*** See method goog.module.Loader.provide() for explanation of params.
***REMOVED***
***REMOVED*** @param {string} module The name of the module. Cf. parameter module
***REMOVED***     of method require().
***REMOVED*** @param {number|string=} opt_symbol The symbol being defined, or nothing
***REMOVED***     when all symbols of the module are defined. Cf. parameter symbol of
***REMOVED***     method require().
***REMOVED*** @param {Object=} opt_object The object bound to the symbol, or nothing when
***REMOVED***     all symbols of the module are defined.
***REMOVED***
goog.module.provide = function(module, opt_symbol, opt_object) {
  goog.module.Loader.getInstance().provide(
      module, opt_symbol, opt_object);
***REMOVED***


***REMOVED***
***REMOVED*** Wrapper of init() so that we only need to export this single
***REMOVED*** identifier instead of three. See method goog.module.Loader.init() for
***REMOVED*** explanation of param.
***REMOVED***
***REMOVED*** @param {string} urlBase The URL of the base library.
***REMOVED*** @param {Function=} opt_urlFunction Function that creates the URL for the
***REMOVED***     module file. It will be passed the base URL for module files and the
***REMOVED***     module name and should return the fully-formed URL to the module file to
***REMOVED***     load.
***REMOVED***
goog.module.initLoader = function(urlBase, opt_urlFunction) {
  goog.module.Loader.getInstance().init(urlBase, opt_urlFunction);
***REMOVED***


***REMOVED***
***REMOVED*** Produces a function that delegates all its arguments to a
***REMOVED*** dynamically loaded function. This is used to export dynamically
***REMOVED*** loaded functions.
***REMOVED***
***REMOVED*** @param {string} module The module to load from.
***REMOVED*** @param {number|string} symbol The ID of the symbol to load from the module.
***REMOVED***     This symbol must resolve to a function.
***REMOVED*** @return {!Function} A function that forwards all its arguments to
***REMOVED***     the dynamically loaded function specified by module and symbol.
***REMOVED***
goog.module.loaderCall = function(module, symbol) {
  return function() {
    var args = arguments;
    goog.module.require(module, symbol, function(f) {
      f.apply(null, args);
    });
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Requires symbols for multiple modules, and invokes a final callback
***REMOVED*** on the condition that all of them are loaded. I.e. a barrier for
***REMOVED*** loading of multiple symbols. If no symbols are required, the
***REMOVED*** final callback is called immediately.
***REMOVED***
***REMOVED*** @param {Array.<Object>} symbolRequests A
***REMOVED***     list of tuples of module, symbol, callback (analog to the arguments
***REMOVED***     to require(), above). These will each be require()d
***REMOVED***     individually. NOTE: This argument will be modified during execution
***REMOVED***     of the function.
***REMOVED*** @param {Function} finalCb A function that is called when all
***REMOVED***     required symbols are loaded.
***REMOVED***
goog.module.requireMultipleSymbols = function(symbolRequests, finalCb) {
  var I = symbolRequests.length;
  if (I == 0) {
    finalCb();
  } else {
    for (var i = 0; i < I; ++i) {
      goog.module.requireMultipleSymbolsHelper_(symbolRequests, i, finalCb);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Used by requireMultipleSymbols() to load each required symbol and
***REMOVED*** keep track how many are loaded, and finally invoke the barrier
***REMOVED*** callback when they are all done.
***REMOVED***
***REMOVED*** @param {Array.<Object>} symbolRequests Same as in
***REMOVED***     requireMultipleSymbols().
***REMOVED*** @param {number} i The single module that is required in this invocation.
***REMOVED*** @param {Function} finalCb Same as in requireMultipleSymbols().
***REMOVED*** @private
***REMOVED***
goog.module.requireMultipleSymbolsHelper_ = function(symbolRequests, i,
                                                     finalCb) {
  var r = symbolRequests[i];
  var module = r[0];
  var symbol = r[1];
  var symbolCb = r[2];
  goog.module.require(module, symbol, function() {
    symbolCb.apply(this, arguments);
    symbolRequests[i] = null;
    if (goog.array.every(symbolRequests, goog.module.isNull_)) {
      finalCb();
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the given element is null.
***REMOVED***
***REMOVED*** @param {Object} el The element to check if null.
***REMOVED*** @param {number} i The index of the element.
***REMOVED*** @param {Array.<Object>} arr The array that contains the element.
***REMOVED*** @return {boolean} TRUE iff the element is null.
***REMOVED*** @private
***REMOVED***
goog.module.isNull_ = function(el, i, arr) {
  return el == null;
***REMOVED***
