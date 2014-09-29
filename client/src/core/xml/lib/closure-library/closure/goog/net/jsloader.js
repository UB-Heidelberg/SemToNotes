// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A utility to load JavaScript files via DOM script tags.
***REMOVED*** Refactored from goog.net.Jsonp. Works cross-domain.
***REMOVED***
***REMOVED***

goog.provide('goog.net.jsloader');
goog.provide('goog.net.jsloader.Error');

goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.debug.Error');
goog.require('goog.dom');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** The name of the property of goog.global under which the JavaScript
***REMOVED*** verification object is stored by the loaded script.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.jsloader.GLOBAL_VERIFY_OBJS_ = 'closure_verification';


***REMOVED***
***REMOVED*** The default length of time, in milliseconds, we are prepared to wait for a
***REMOVED*** load request to complete.
***REMOVED*** @type {number}
***REMOVED***
goog.net.jsloader.DEFAULT_TIMEOUT = 5000;


***REMOVED***
***REMOVED*** Optional parameters for goog.net.jsloader.send.
***REMOVED*** timeout: The length of time, in milliseconds, we are prepared to wait
***REMOVED***     for a load request to complete. Default it 5 seconds.
***REMOVED*** document: The HTML document under which to load the JavaScript. Default is
***REMOVED***     the current document.
***REMOVED*** cleanupWhenDone: If true clean up the script tag after script completes to
***REMOVED***     load. This is important if you just want to read data from the JavaScript
***REMOVED***     and then throw it away. Default is false.
***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   timeout: (number|undefined),
***REMOVED***   document: (HTMLDocument|undefined),
***REMOVED***   cleanupWhenDone: (boolean|undefined)
***REMOVED*** }}
***REMOVED***
goog.net.jsloader.Options;


***REMOVED***
***REMOVED*** Scripts (URIs) waiting to be loaded.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.net.jsloader.scriptsToLoad_ = [];


***REMOVED***
***REMOVED*** Loads and evaluates the JavaScript files at the specified URIs, guaranteeing
***REMOVED*** the order of script loads.
***REMOVED***
***REMOVED*** Because we have to load the scripts in serial (load script 1, exec script 1,
***REMOVED*** load script 2, exec script 2, and so on), this will be slower than doing
***REMOVED*** the network fetches in parallel.
***REMOVED***
***REMOVED*** If you need to load a large number of scripts but dependency order doesn't
***REMOVED*** matter, you should just call goog.net.jsloader.load N times.
***REMOVED***
***REMOVED*** If you need to load a large number of scripts on the same domain,
***REMOVED*** you may want to use goog.module.ModuleLoader.
***REMOVED***
***REMOVED*** @param {Array.<string>} uris The URIs to load.
***REMOVED*** @param {goog.net.jsloader.Options=} opt_options Optional parameters. See
***REMOVED***     goog.net.jsloader.options documentation for details.
***REMOVED***
goog.net.jsloader.loadMany = function(uris, opt_options) {
  // Loading the scripts in serial introduces asynchronosity into the flow.
  // Therefore, there are race conditions where client A can kick off the load
  // sequence for client B, even though client A's scripts haven't all been
  // loaded yet.
  //
  // To work around this issue, all module loads share a queue.
  if (!uris.length) {
    return;
  }

  var isAnotherModuleLoading = goog.net.jsloader.scriptsToLoad_.length;
  goog.array.extend(goog.net.jsloader.scriptsToLoad_, uris);
  if (isAnotherModuleLoading) {
    // jsloader is still loading some other scripts.
    // In order to prevent the race condition noted above, we just add
    // these URIs to the end of the scripts' queue and return.
    return;
  }

  uris = goog.net.jsloader.scriptsToLoad_;
  var popAndLoadNextScript = function() {
    var uri = uris.shift();
    var deferred = goog.net.jsloader.load(uri, opt_options);
    if (uris.length) {
      deferred.addBoth(popAndLoadNextScript);
    }
 ***REMOVED*****REMOVED***
  popAndLoadNextScript();
***REMOVED***


***REMOVED***
***REMOVED*** Loads and evaluates a JavaScript file.
***REMOVED*** When the script loads, a user callback is called.
***REMOVED*** It is the client's responsibility to verify that the script ran successfully.
***REMOVED***
***REMOVED*** @param {string} uri The URI of the JavaScript.
***REMOVED*** @param {goog.net.jsloader.Options=} opt_options Optional parameters. See
***REMOVED***     goog.net.jsloader.Options documentation for details.
***REMOVED*** @return {!goog.async.Deferred} The deferred result, that may be used to add
***REMOVED***     callbacks and/or cancel the transmission.
***REMOVED***     The error callback will be called with a single goog.net.jsloader.Error
***REMOVED***     parameter.
***REMOVED***
goog.net.jsloader.load = function(uri, opt_options) {
  var options = opt_options || {***REMOVED***
  var doc = options.document || document;

  var script = goog.dom.createElement(goog.dom.TagName.SCRIPT);
  var request = {script_: script, timeout_: undefined***REMOVED***
  var deferred = new goog.async.Deferred(goog.net.jsloader.cancel_, request);

  // Set a timeout.
  var timeout = null;
  var timeoutDuration = goog.isDefAndNotNull(options.timeout) ?
      options.timeout : goog.net.jsloader.DEFAULT_TIMEOUT;
  if (timeoutDuration > 0) {
    timeout = window.setTimeout(function() {
      goog.net.jsloader.cleanup_(script, true);
      deferred.errback(new goog.net.jsloader.Error(
          goog.net.jsloader.ErrorCode.TIMEOUT,
          'Timeout reached for loading script ' + uri));
    }, timeoutDuration);
    request.timeout_ = timeout;
  }

  // Hang the user callback to be called when the script completes to load.
  // NOTE(user): This callback will be called in IE even upon error. In any
  // case it is the client's responsibility to verify that the script ran
  // successfully.
  script.onload = script.onreadystatechange = function() {
    if (!script.readyState || script.readyState == 'loaded' ||
        script.readyState == 'complete') {
      var removeScriptNode = options.cleanupWhenDone || false;
      goog.net.jsloader.cleanup_(script, removeScriptNode, timeout);
      deferred.callback(null);
    }
 ***REMOVED*****REMOVED***

  // Add an error callback.
  // NOTE(user): Not supported in IE.
  script.onerror = function() {
    goog.net.jsloader.cleanup_(script, true, timeout);
    deferred.errback(new goog.net.jsloader.Error(
        goog.net.jsloader.ErrorCode.LOAD_ERROR,
        'Error while loading script ' + uri));
 ***REMOVED*****REMOVED***

  // Add the script element to the document.
  goog.dom.setProperties(script, {
    'type': 'text/javascript',
    'charset': 'UTF-8',
    // NOTE(user): Safari never loads the script if we don't set
    // the src attribute before appending.
    'src': uri
  });
  var scriptParent = goog.net.jsloader.getScriptParentElement_(doc);
  scriptParent.appendChild(script);

  return deferred;
***REMOVED***


***REMOVED***
***REMOVED*** Loads a JavaScript file and verifies it was evaluated successfully, using a
***REMOVED*** verification object.
***REMOVED*** The verification object is set by the loaded JavaScript at the end of the
***REMOVED*** script.
***REMOVED*** We verify this object was set and return its value in the success callback.
***REMOVED*** If the object is not defined we trigger an error callback.
***REMOVED***
***REMOVED*** @param {string} uri The URI of the JavaScript.
***REMOVED*** @param {string} verificationObjName The name of the verification object that
***REMOVED***     the loaded script should set.
***REMOVED*** @param {goog.net.jsloader.Options} options Optional parameters. See
***REMOVED***     goog.net.jsloader.Options documentation for details.
***REMOVED*** @return {!goog.async.Deferred} The deferred result, that may be used to add
***REMOVED***     callbacks and/or cancel the transmission.
***REMOVED***     The success callback will be called with a single parameter containing
***REMOVED***     the value of the verification object.
***REMOVED***     The error callback will be called with a single goog.net.jsloader.Error
***REMOVED***     parameter.
***REMOVED***
goog.net.jsloader.loadAndVerify = function(uri, verificationObjName, options) {
  // Define the global objects variable.
  if (!goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_]) {
    goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_] = {***REMOVED***
  }
  var verifyObjs = goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_];

  // Verify that the expected object does not exist yet.
  if (goog.isDef(verifyObjs[verificationObjName])) {
    // TODO(user): Error or reset variable?
    return goog.async.Deferred.fail(new goog.net.jsloader.Error(
        goog.net.jsloader.ErrorCode.VERIFY_OBJECT_ALREADY_EXISTS,
        'Verification object ' + verificationObjName + ' already defined.'));
  }

  // Send request to load the JavaScript.
  var sendDeferred = goog.net.jsloader.load(uri, options);

  // Create a deferred object wrapping the send result.
  var deferred = new goog.async.Deferred(sendDeferred.cancel);

  // Call user back with object that was set by the script.
  sendDeferred.addCallback(function() {
    var result = verifyObjs[verificationObjName];
    if (goog.isDef(result)) {
      deferred.callback(result);
      delete verifyObjs[verificationObjName];
    } else {
      // Error: script was not loaded properly.
      deferred.errback(new goog.net.jsloader.Error(
          goog.net.jsloader.ErrorCode.VERIFY_ERROR,
          'Script ' + uri + ' loaded, but verification object ' +
          verificationObjName + ' was not defined.'));
    }
  });

  // Pass error to new deferred object.
  sendDeferred.addErrback(function(error) {
    if (goog.isDef(verifyObjs[verificationObjName])) {
      delete verifyObjs[verificationObjName];
    }
    deferred.errback(error);
  });

  return deferred;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the DOM element under which we should add new script elements.
***REMOVED*** How? Take the first head element, and if not found take doc.documentElement,
***REMOVED*** which always exists.
***REMOVED***
***REMOVED*** @param {!HTMLDocument} doc The relevant document.
***REMOVED*** @return {!Element} The script parent element.
***REMOVED*** @private
***REMOVED***
goog.net.jsloader.getScriptParentElement_ = function(doc) {
  var headElements = doc.getElementsByTagName(goog.dom.TagName.HEAD);
  if (!headElements || goog.array.isEmpty(headElements)) {
    return doc.documentElement;
  } else {
    return headElements[0];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels a given request.
***REMOVED*** @this {{script_: Element, timeout_: number}} The request context.
***REMOVED*** @private
***REMOVED***
goog.net.jsloader.cancel_ = function() {
  var request = this;
  if (request && request.script_) {
    var scriptNode = request.script_;
    if (scriptNode && scriptNode.tagName == 'SCRIPT') {
      goog.net.jsloader.cleanup_(scriptNode, true, request.timeout_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the script node and the timeout.
***REMOVED***
***REMOVED*** @param {Node} scriptNode The node to be cleaned up.
***REMOVED*** @param {boolean} removeScriptNode If true completely remove the script node.
***REMOVED*** @param {?number=} opt_timeout The timeout handler to cleanup.
***REMOVED*** @private
***REMOVED***
goog.net.jsloader.cleanup_ = function(scriptNode, removeScriptNode,
                                      opt_timeout) {
  if (goog.isDefAndNotNull(opt_timeout)) {
    goog.global.clearTimeout(opt_timeout);
  }

  scriptNode.onload = goog.nullFunction;
  scriptNode.onerror = goog.nullFunction;
  scriptNode.onreadystatechange = goog.nullFunction;

  // Do this after a delay (removing the script node of a running script can
  // confuse older IEs).
  if (removeScriptNode) {
    window.setTimeout(function() {
      goog.dom.removeNode(scriptNode);
    }, 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Possible error codes for jsloader.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.jsloader.ErrorCode = {
  LOAD_ERROR: 0,
  TIMEOUT: 1,
  VERIFY_ERROR: 2,
  VERIFY_OBJECT_ALREADY_EXISTS: 3
***REMOVED***



***REMOVED***
***REMOVED*** A jsloader error.
***REMOVED***
***REMOVED*** @param {goog.net.jsloader.ErrorCode} code The error code.
***REMOVED*** @param {string=} opt_message Additional message.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.net.jsloader.Error = function(code, opt_message) {
  var msg = 'Jsloader error (code #' + code + ')';
  if (opt_message) {
    msg += ': ' + opt_message;
  }
  goog.base(this, msg);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The code for this error.
  ***REMOVED***
  ***REMOVED*** @type {goog.net.jsloader.ErrorCode}
 ***REMOVED*****REMOVED***
  this.code = code;
***REMOVED***
goog.inherits(goog.net.jsloader.Error, goog.debug.Error);
