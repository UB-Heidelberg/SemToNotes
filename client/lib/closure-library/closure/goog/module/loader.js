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

goog.provide('goog.module.Loader');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.object');



***REMOVED***
***REMOVED*** The dynamic loading functionality is defined as a class. The class
***REMOVED*** will be used as singleton. There is, however, a two step
***REMOVED*** initialization procedure because parameters need to be passed to
***REMOVED*** the goog.module.Loader instance.
***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.module.Loader = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of module name/array of {symbol name, callback} pairs that are pending
  ***REMOVED*** to be loaded.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pending_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Provides associative access to each module and the symbols of each module
  ***REMOVED*** that have aready been loaded (one lookup for the module, another lookup
  ***REMOVED*** on the module for the symbol).
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.modules_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of module name to module url. Used to avoid fetching the same URL
  ***REMOVED*** twice by keeping track of in-flight URLs.
  ***REMOVED*** Note: this allows two modules to be bundled into the same file.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pendingModuleUrls_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The base url to load modules from. This property will be set in init().
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.urlBase_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of modules that have been requested before init() was called.
  ***REMOVED*** If require() is called before init() was called, the required
  ***REMOVED*** modules can obviously not yet be loaded, because their URL is
  ***REMOVED*** unknown. The modules that are requested before init() are
  ***REMOVED*** therefore stored in this array, and they are loaded at init()
  ***REMOVED*** time.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pendingBeforeInit_ = [];
***REMOVED***
goog.addSingletonGetter(goog.module.Loader);


***REMOVED***
***REMOVED*** Creates a full URL to the compiled module code given a base URL and a
***REMOVED*** module name. By default it's urlBase + '_' + module + '.js'.
***REMOVED*** @param {string} urlBase URL to the module files.
***REMOVED*** @param {string} module Module name.
***REMOVED*** @return {string} The full url to the module binary.
***REMOVED*** @private
***REMOVED***
goog.module.Loader.prototype.getModuleUrl_ = function(urlBase, module) {
  return urlBase + '_' + module + '.js';
***REMOVED***


***REMOVED***
***REMOVED*** The globally exported name of the load callback. Matches the
***REMOVED*** definition in the js_modular_binary() BUILD rule.
***REMOVED*** @type {string}
***REMOVED***
goog.module.Loader.LOAD_CALLBACK = '__gjsload__';


***REMOVED***
***REMOVED*** Loads the module by evaluating the javascript text in the current
***REMOVED*** scope. Uncompiled, base identifiers are visible in the global scope;
***REMOVED*** when compiled they are visible in the closure of the anonymous
***REMOVED*** namespace. Notice that this cannot be replaced by the global eval,
***REMOVED*** because the global eval isn't in the scope of the anonymous
***REMOVED*** namespace function that the jscompiled code lives in.
***REMOVED***
***REMOVED*** @param {string} t_ The javascript text to evaluate. IMPORTANT: The
***REMOVED***   name of the identifier is chosen so that it isn't compiled and
***REMOVED***   hence cannot shadow compiled identifiers in the surrounding scope.
***REMOVED*** @private
***REMOVED***
goog.module.Loader.loaderEval_ = function(t_) {
  eval(t_);
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the Loader to be fully functional. Also executes load
***REMOVED*** requests that were received before initialization. Must be called
***REMOVED*** exactly once, with the URL of the base library. Module URLs are
***REMOVED*** derived from the URL of the base library by inserting the module
***REMOVED*** name, preceded by a period, before the .js prefix of the base URL.
***REMOVED***
***REMOVED*** @param {string} baseUrl The URL of the base library.
***REMOVED*** @param {Function=} opt_urlFunction Function that creates the URL for the
***REMOVED***     module file. It will be passed the base URL for module files and the
***REMOVED***     module name and should return the fully-formed URL to the module file to
***REMOVED***     load.
***REMOVED***
goog.module.Loader.prototype.init = function(baseUrl, opt_urlFunction) {
  // For the use by the module wrappers, loaderEval_ is exported to
  // the page. Note that, despite the name, this is not part of the
  // API, so it is here and not in api_app.js. Cf. BUILD. Note this is
  // done before the first load requests are sent.
  goog.exportSymbol(goog.module.Loader.LOAD_CALLBACK,
      goog.module.Loader.loaderEval_);

  this.urlBase_ = baseUrl.replace(/\.js$/, '');
  if (opt_urlFunction) {
    this.getModuleUrl_ = opt_urlFunction;
  }

  goog.array.forEach(this.pendingBeforeInit_, function(module) {
    this.load_(module);
  }, this);
  goog.array.clear(this.pendingBeforeInit_);
***REMOVED***


***REMOVED***
***REMOVED*** Requests the loading of a symbol from a module. When the module is
***REMOVED*** loaded, the requested symbol will be passed as argument to the
***REMOVED*** function callback.
***REMOVED***
***REMOVED*** @param {string} module The name of the module. Usually, the value
***REMOVED***     is defined as a constant whose name starts with MOD_.
***REMOVED*** @param {number|string} symbol The ID of the symbol. Usually, the value is
***REMOVED***     defined as a constant whose name starts with SYM_.
***REMOVED*** @param {Function} callback This function will be called with the
***REMOVED***     resolved symbol as the argument once the module is loaded.
***REMOVED***
goog.module.Loader.prototype.require = function(module, symbol, callback) {
  var pending = this.pending_;
  var modules = this.modules_;
  if (modules[module]) {
    // already loaded
    callback(modules[module][symbol]);
  } else if (pending[module]) {
    // loading is pending from another require of the same module
    pending[module].push([symbol, callback]);
  } else {
    // not loaded, and not requested
    pending[module] = [[symbol, callback]];  // Yes, really [[ ]].
    // Defer loading to initialization if Loader is not yet
    // initialized, otherwise load the module.
    if (goog.isString(this.urlBase_)) {
      this.load_(module);
    } else {
      this.pendingBeforeInit_.push(module);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a symbol in a loaded module. When called without symbol,
***REMOVED*** registers the module to be fully loaded and executes all callbacks
***REMOVED*** from pending require() callbacks for this module.
***REMOVED***
***REMOVED*** @param {string} module The name of the module. Cf. parameter module
***REMOVED***     of method require().
***REMOVED*** @param {number|string=} opt_symbol The symbol being defined, or nothing when
***REMOVED***     all symbols of the module are defined. Cf. parameter symbol of method
***REMOVED***     require().
***REMOVED*** @param {Object=} opt_object The object bound to the symbol, or nothing when
***REMOVED***     all symbols of the module are defined.
***REMOVED***
goog.module.Loader.prototype.provide = function(
    module, opt_symbol, opt_object) {
  var modules = this.modules_;
  var pending = this.pending_;
  if (!modules[module]) {
    modules[module] = {***REMOVED***
  }
  if (opt_object) {
    // When an object is provided, just register it.
    modules[module][opt_symbol] = opt_object;
  } else if (pending[module]) {
    // When no object is provided, and there are pending require()
    // callbacks for this module, execute them.
    for (var i = 0; i < pending[module].length; ++i) {
      var symbol = pending[module][i][0];
      var callback = pending[module][i][1];
      callback(modules[module][symbol]);
    }
    delete pending[module];
    delete this.pendingModuleUrls_[module];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Starts to load a module. Assumes that init() was called.
***REMOVED***
***REMOVED*** @param {string} module The name of the module.
***REMOVED*** @private
***REMOVED***
goog.module.Loader.prototype.load_ = function(module) {
  // NOTE(user): If the module request happens inside a click handler
  // (presumably inside any user event handler, but the onload event
  // handler is fine), IE will load the script but not execute
  // it. Thus we break out of the current flow of control before we do
  // the load. For the record, for IE it would have been enough to
  // just defer the assignment to src. Safari doesn't execute the
  // script if the assignment to src happens***REMOVED***after* the script
  // element is inserted into the DOM.
  goog.Timer.callOnce(function() {
    // The module might have been registered in the interim (if fetched as part
    // of another module fetch because they share the same url)
    if (this.modules_[module]) {
      return;
    }

    goog.asserts.assertString(this.urlBase_);
    var url = this.getModuleUrl_(this.urlBase_, module);

    // Check if specified URL is already in flight
    var urlInFlight = goog.object.containsValue(this.pendingModuleUrls_, url);
    this.pendingModuleUrls_[module] = url;
    if (urlInFlight) {
      return;
    }

    var s = goog.dom.createDom('script',
        {'type': 'text/javascript', 'src': url});
    document.body.appendChild(s);
  }, 0, this);
***REMOVED***
