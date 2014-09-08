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
***REMOVED*** @fileoverview Class for managing requests via iFrames.  Supports a number of
***REMOVED*** methods of transfer.
***REMOVED***
***REMOVED*** Gets and Posts can be performed and the resultant page read in as text,
***REMOVED*** JSON, or from the HTML DOM.
***REMOVED***
***REMOVED*** Using an iframe causes the throbber to spin, this is good for providing
***REMOVED*** feedback to the user that an action has occurred.
***REMOVED***
***REMOVED*** Requests do not affect the history stack, see goog.History if you require
***REMOVED*** this behavior.
***REMOVED***
***REMOVED*** The responseText and responseJson methods assume the response is plain,
***REMOVED*** text.  You can access the Iframe's DOM through responseXml if you need
***REMOVED*** access to the raw HTML.
***REMOVED***
***REMOVED*** Tested:
***REMOVED***    + FF2.0 (Win Linux)
***REMOVED***    + IE6, IE7
***REMOVED***    + Opera 9.1,
***REMOVED***    + Chrome
***REMOVED***    - Opera 8.5 fails because of no textContent and buggy innerText support
***REMOVED***
***REMOVED*** NOTE: Safari doesn't fire the onload handler when loading plain text files
***REMOVED***
***REMOVED*** This has been tested with Drip in IE to ensure memory usage is as constant
***REMOVED*** as possible. When making making thousands of requests, memory usage stays
***REMOVED*** constant for a while but then starts increasing (<500k for 2000
***REMOVED*** requests) -- this hasn't yet been tracked down yet, though it is cleared up
***REMOVED*** after a refresh.
***REMOVED***
***REMOVED***
***REMOVED*** BACKGROUND FILE UPLOAD:
***REMOVED*** By posting an arbitrary form through an IframeIo object, it is possible to
***REMOVED*** implement background file uploads.  Here's how to do it:
***REMOVED***
***REMOVED*** - Create a form:
***REMOVED***   <pre>
***REMOVED***   &lt;form id="form" enctype="multipart/form-data" method="POST"&gt;
***REMOVED***      &lt;input name="userfile" type="file" /&gt;
***REMOVED***   &lt;/form&gt;
***REMOVED***   </pre>
***REMOVED***
***REMOVED*** - Have the user click the file input
***REMOVED*** - Create an IframeIo instance
***REMOVED***   <pre>
***REMOVED***   var io = new goog.net.IframeIo;
***REMOVED*** ***REMOVED***io, goog.net.EventType.COMPLETE,
***REMOVED***       function() { alert('Sent'); });
***REMOVED***   io.sendFromForm(document.getElementById('form'));
***REMOVED***   </pre>
***REMOVED***
***REMOVED***
***REMOVED*** INCREMENTAL LOADING:
***REMOVED*** Gmail sends down multiple script blocks which get executed as they are
***REMOVED*** received by the client. This allows incremental rendering of the thread
***REMOVED*** list and conversations.
***REMOVED***
***REMOVED*** This requires collaboration with the server that is sending the requested
***REMOVED*** page back.  To set incremental loading up, you should:
***REMOVED***
***REMOVED*** A) In the application code there should be an externed reference to
***REMOVED*** <code>handleIncrementalData()</code>.  e.g.
***REMOVED*** goog.exportSymbol('GG_iframeFn', goog.net.IframeIo.handleIncrementalData);
***REMOVED***
***REMOVED*** B) The response page should them call this method directly, an example
***REMOVED*** response would look something like this:
***REMOVED*** <pre>
***REMOVED***   &lt;html&gt;
***REMOVED***   &lt;head&gt;
***REMOVED***     &lt;meta content="text/html;charset=UTF-8" http-equiv="content-type"&gt;
***REMOVED***   &lt;/head&gt;
***REMOVED***   &lt;body&gt;
***REMOVED***     &lt;script&gt;
***REMOVED***       D = top.P ? function(d) { top.GG_iframeFn(window, d) } : function() {***REMOVED***
***REMOVED***     &lt;/script&gt;
***REMOVED***
***REMOVED***     &lt;script&gt;D([1, 2, 3, 4, 5]);&lt;/script&gt;
***REMOVED***     &lt;script&gt;D([6, 7, 8, 9, 10]);&lt;/script&gt;
***REMOVED***     &lt;script&gt;D([11, 12, 13, 14, 15]);&lt;/script&gt;
***REMOVED***   &lt;/body&gt;
***REMOVED***   &lt;/html&gt;
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Your application should then listen, on the IframeIo instance, to the event
***REMOVED*** goog.net.EventType.INCREMENTAL_DATA.  The event object contains a
***REMOVED*** 'data' member which is the content from the D() calls above.
***REMOVED***
***REMOVED*** NOTE: There can be problems if you save a reference to the data object in IE.
***REMOVED*** If you save an array, and the iframe is dispose, then the array looses its
***REMOVED*** prototype and thus array methods like .join().  You can get around this by
***REMOVED*** creating arrays using the parent window's Array constructor, or you can
***REMOVED*** clone the array.
***REMOVED***
***REMOVED***
***REMOVED*** EVENT MODEL:
***REMOVED*** The various send methods work asynchronously. You can be notified about
***REMOVED*** the current status of the request (completed, success or error) by
***REMOVED*** listening for events on the IframeIo object itself. The following events
***REMOVED*** will be sent:
***REMOVED*** - goog.net.EventType.COMPLETE: when the request is completed
***REMOVED***   (either sucessfully or unsuccessfully). You can find out about the result
***REMOVED***   using the isSuccess() and getLastError
***REMOVED***   methods.
***REMOVED*** - goog.net.EventType.SUCCESS</code>: when the request was completed
***REMOVED***   successfully
***REMOVED*** - goog.net.EventType.ERROR: when the request failed
***REMOVED*** - goog.net.EventType.ABORT: when the request has been aborted
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED*** var io = new goog.net.IframeIo();
***REMOVED*** goog.events.listen(io, goog.net.EventType.COMPLETE,
***REMOVED***   function() { alert('request complete'); });
***REMOVED*** io.sendFromForm(...);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***

goog.provide('goog.net.IframeIo');
goog.provide('goog.net.IframeIo.IncrementalDataEvent');

goog.require('goog.Timer');
***REMOVED***
goog.require('goog.debug');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.reflect');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Class for managing requests via iFrames.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.IframeIo = function() {
  goog.net.IframeIo.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Name for this IframeIo and frame
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = goog.net.IframeIo.getNextName_();

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of iframes that have been finished with.  We need them to be
  ***REMOVED*** disposed async, so we don't confuse the browser (see below).
  ***REMOVED*** @type {Array.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.iframesForDisposal_ = [];

  // Create a lookup from names to instances of IframeIo.  This is a helper
  // function to be used in conjunction with goog.net.IframeIo.getInstanceByName
  // to find the IframeIo object associated with a particular iframe.  Used in
  // incremental scripts etc.
  goog.net.IframeIo.instances_[this.name_] = this;

***REMOVED***
goog.inherits(goog.net.IframeIo, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Object used as a map to lookup instances of IframeIo objects by name.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.instances_ = {***REMOVED***


***REMOVED***
***REMOVED*** Prefix for frame names
***REMOVED*** @type {string}
***REMOVED***
goog.net.IframeIo.FRAME_NAME_PREFIX = 'closure_frame';


***REMOVED***
***REMOVED*** Suffix that is added to inner frames used for sending requests in non-IE
***REMOVED*** browsers
***REMOVED*** @type {string}
***REMOVED***
goog.net.IframeIo.INNER_FRAME_SUFFIX = '_inner';


***REMOVED***
***REMOVED*** The number of milliseconds after a request is completed to dispose the
***REMOVED*** iframes.  This can be done lazily so we wait long enough for any processing
***REMOVED*** that occurred as a result of the response to finish.
***REMOVED*** @type {number}
***REMOVED***
goog.net.IframeIo.IFRAME_DISPOSE_DELAY_MS = 2000;


***REMOVED***
***REMOVED*** Counter used when creating iframes
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.counter_ = 0;


***REMOVED***
***REMOVED*** Form element to post to.
***REMOVED*** @type {HTMLFormElement}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.form_;


***REMOVED***
***REMOVED*** Static send that creates a short lived instance of IframeIo to send the
***REMOVED*** request.
***REMOVED*** @param {goog.Uri|string} uri Uri of the request, it is up the caller to
***REMOVED***     manage query string params.
***REMOVED*** @param {Function=} opt_callback Event handler for when request is completed.
***REMOVED*** @param {string=} opt_method Default is GET, POST uses a form to submit the
***REMOVED***     request.
***REMOVED*** @param {boolean=} opt_noCache Append a timestamp to the request to avoid
***REMOVED***     caching.
***REMOVED*** @param {Object|goog.structs.Map=} opt_data Map of key-value pairs that
***REMOVED***     will be posted to the server via the iframe's form.
***REMOVED***
goog.net.IframeIo.send = function(
    uri, opt_callback, opt_method, opt_noCache, opt_data) {

  var io = new goog.net.IframeIo();
***REMOVED***io, goog.net.EventType.READY, io.dispose, false, io);
  if (opt_callback) {
  ***REMOVED***io, goog.net.EventType.COMPLETE, opt_callback);
  }
  io.send(uri, opt_method, opt_noCache, opt_data);
***REMOVED***


***REMOVED***
***REMOVED*** Find an iframe by name (assumes the context is goog.global since that is
***REMOVED*** where IframeIo's iframes are kept).
***REMOVED*** @param {string} fname The name to find.
***REMOVED*** @return {HTMLIFrameElement} The iframe element with that name.
***REMOVED***
goog.net.IframeIo.getIframeByName = function(fname) {
  return window.frames[fname];
***REMOVED***


***REMOVED***
***REMOVED*** Find an instance of the IframeIo object by name.
***REMOVED*** @param {string} fname The name to find.
***REMOVED*** @return {goog.net.IframeIo} The instance of IframeIo.
***REMOVED***
goog.net.IframeIo.getInstanceByName = function(fname) {
  return goog.net.IframeIo.instances_[fname];
***REMOVED***


***REMOVED***
***REMOVED*** Handles incremental data and routes it to the correct iframeIo instance.
***REMOVED*** The HTML page requested by the IframeIo instance should contain script blocks
***REMOVED*** that call an externed reference to this method.
***REMOVED*** @param {Window} win The window object.
***REMOVED*** @param {Object} data The data object.
***REMOVED***
goog.net.IframeIo.handleIncrementalData = function(win, data) {
  // If this is the inner-frame, then we need to use the parent instead.
  var iframeName = goog.string.endsWith(win.name,
      goog.net.IframeIo.INNER_FRAME_SUFFIX) ? win.parent.name : win.name;

  var iframeIoName = iframeName.substring(0, iframeName.lastIndexOf('_'));
  var iframeIo = goog.net.IframeIo.getInstanceByName(iframeIoName);
  if (iframeIo && iframeName == iframeIo.iframeName_) {
    iframeIo.handleIncrementalData_(data);
  } else {
    var logger = goog.log.getLogger('goog.net.IframeIo');
    goog.log.info(logger,
        'Incremental iframe data routed for unknown iframe');
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The next iframe name.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.getNextName_ = function() {
  return goog.net.IframeIo.FRAME_NAME_PREFIX + goog.net.IframeIo.counter_++;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a static form, one for all instances of IframeIo since IE6 leaks form
***REMOVED*** nodes that are created/removed from the document.
***REMOVED*** @return {!HTMLFormElement} The static form.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.getForm_ = function() {
  if (!goog.net.IframeIo.form_) {
    goog.net.IframeIo.form_ =
       ***REMOVED*****REMOVED*** @type {HTMLFormElement}***REMOVED***(goog.dom.createDom('form'));
    goog.net.IframeIo.form_.acceptCharset = 'utf-8';

    // Hide the form and move it off screen
    var s = goog.net.IframeIo.form_.style;
    s.position = 'absolute';
    s.visibility = 'hidden';
    s.top = s.left = '-10px';
    s.width = s.height = '10px';
    s.overflow = 'hidden';

    goog.dom.getDocument().body.appendChild(goog.net.IframeIo.form_);
  }
  return goog.net.IframeIo.form_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the key value pairs from a map like data structure to a form
***REMOVED*** @param {HTMLFormElement} form The form to add to.
***REMOVED*** @param {Object|goog.structs.Map|goog.Uri.QueryData} data The data to add.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.addFormInputs_ = function(form, data) {
  var helper = goog.dom.getDomHelper(form);
  goog.structs.forEach(data, function(value, key) {
    var inp = helper.createDom('input',
        {'type': 'hidden', 'name': key, 'value': value});
    form.appendChild(inp);
  });
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether we can use readyState to monitor iframe loading.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.useIeReadyStateCodePath_ = function() {
  // ReadyState is only available on iframes up to IE10.
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('11');
***REMOVED***


***REMOVED***
***REMOVED*** Reference to a logger for the IframeIo objects
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.logger_ =
    goog.log.getLogger('goog.net.IframeIo');


***REMOVED***
***REMOVED*** Reference to form element that gets reused for requests to the iframe.
***REMOVED*** @type {HTMLFormElement}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.form_ = null;


***REMOVED***
***REMOVED*** Reference to the iframe being used for the current request, or null if no
***REMOVED*** request is currently active.
***REMOVED*** @type {HTMLIFrameElement}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.iframe_ = null;


***REMOVED***
***REMOVED*** Name of the iframe being used for the current request, or null if no
***REMOVED*** request is currently active.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.iframeName_ = null;


***REMOVED***
***REMOVED*** Next id so that iframe names are unique.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.nextIframeId_ = 0;


***REMOVED***
***REMOVED*** Whether the object is currently active with a request.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.active_ = false;


***REMOVED***
***REMOVED*** Whether the last request is complete.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.complete_ = false;


***REMOVED***
***REMOVED*** Whether the last request was a success.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.success_ = false;


***REMOVED***
***REMOVED*** The URI for the last request.
***REMOVED*** @type {goog.Uri}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.lastUri_ = null;


***REMOVED***
***REMOVED*** The text content of the last request.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.lastContent_ = null;


***REMOVED***
***REMOVED*** Last error code
***REMOVED*** @type {goog.net.ErrorCode}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;


***REMOVED***
***REMOVED*** Number of milliseconds after which an incomplete request will be aborted and
***REMOVED*** a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout is set.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.timeoutInterval_ = 0;


***REMOVED***
***REMOVED*** Window timeout ID used to cancel the timeout event handler if the request
***REMOVED*** completes successfully.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.timeoutId_ = null;


***REMOVED***
***REMOVED*** Window timeout ID used to detect when firefox silently fails.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.firefoxSilentErrorTimeout_ = null;


***REMOVED***
***REMOVED*** Window timeout ID used by the timer that disposes the iframes.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.iframeDisposalTimer_ = null;


***REMOVED***
***REMOVED*** This is used to ensure that we don't handle errors twice for the same error.
***REMOVED*** We can reach the {@link #handleError_} method twice in IE if the form is
***REMOVED*** submitted while IE is offline and the URL is not available.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.errorHandled_;


***REMOVED***
***REMOVED*** Whether to suppress the listeners that determine when the iframe loads.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.ignoreResponse_ = false;


***REMOVED***
***REMOVED*** Sends a request via an iframe.
***REMOVED***
***REMOVED*** A HTML form is used and submitted to the iframe, this simplifies the
***REMOVED*** difference between GET and POST requests. The iframe needs to be created and
***REMOVED*** destroyed for each request otherwise the request will contribute to the
***REMOVED*** history stack.
***REMOVED***
***REMOVED*** sendFromForm does some clever trickery (thanks jlim) in non-IE browsers to
***REMOVED*** stop a history entry being added for POST requests.
***REMOVED***
***REMOVED*** @param {goog.Uri|string} uri Uri of the request.
***REMOVED*** @param {string=} opt_method Default is GET, POST uses a form to submit the
***REMOVED***     request.
***REMOVED*** @param {boolean=} opt_noCache Append a timestamp to the request to avoid
***REMOVED***     caching.
***REMOVED*** @param {Object|goog.structs.Map=} opt_data Map of key-value pairs.
***REMOVED***
goog.net.IframeIo.prototype.send = function(
    uri, opt_method, opt_noCache, opt_data) {

  if (this.active_) {
    throw Error('[goog.net.IframeIo] Unable to send, already active.');
  }

  var uriObj = new goog.Uri(uri);
  this.lastUri_ = uriObj;
  var method = opt_method ? opt_method.toUpperCase() : 'GET';

  if (opt_noCache) {
    uriObj.makeUnique();
  }

  goog.log.info(this.logger_,
      'Sending iframe request: ' + uriObj + ' [' + method + ']');

  // Build a form for this request
  this.form_ = goog.net.IframeIo.getForm_();

  if (method == 'GET') {
    // For GET requests, we assume that the caller didn't want the queryparams
    // already specified in the URI to be clobbered by the form, so we add the
    // params here.
    goog.net.IframeIo.addFormInputs_(this.form_, uriObj.getQueryData());
  }

  if (opt_data) {
    // Create form fields for each of the data values
    goog.net.IframeIo.addFormInputs_(this.form_, opt_data);
  }

  // Set the URI that the form will be posted
  this.form_.action = uriObj.toString();
  this.form_.method = method;

  this.sendFormInternal_();
  this.clearForm_();
***REMOVED***


***REMOVED***
***REMOVED*** Sends the data stored in an existing form to the server. The HTTP method
***REMOVED*** should be specified on the form, the action can also be specified but can
***REMOVED*** be overridden by the optional URI param.
***REMOVED***
***REMOVED*** This can be used in conjunction will a file-upload input to upload a file in
***REMOVED*** the background without affecting history.
***REMOVED***
***REMOVED*** Example form:
***REMOVED*** <pre>
***REMOVED***   &lt;form action="/server/" enctype="multipart/form-data" method="POST"&gt;
***REMOVED***     &lt;input name="userfile" type="file"&gt;
***REMOVED***   &lt;/form&gt;
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {HTMLFormElement} form Form element used to send the request to the
***REMOVED***     server.
***REMOVED*** @param {string=} opt_uri Uri to set for the destination of the request, by
***REMOVED***     default the uri will come from the form.
***REMOVED*** @param {boolean=} opt_noCache Append a timestamp to the request to avoid
***REMOVED***     caching.
***REMOVED***
goog.net.IframeIo.prototype.sendFromForm = function(form, opt_uri,
    opt_noCache) {
  if (this.active_) {
    throw Error('[goog.net.IframeIo] Unable to send, already active.');
  }

  var uri = new goog.Uri(opt_uri || form.action);
  if (opt_noCache) {
    uri.makeUnique();
  }

  goog.log.info(this.logger_, 'Sending iframe request from form: ' + uri);

  this.lastUri_ = uri;
  this.form_ = form;
  this.form_.action = uri.toString();
  this.sendFormInternal_();
***REMOVED***


***REMOVED***
***REMOVED*** Abort the current Iframe request
***REMOVED*** @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
***REMOVED***     defaults to ABORT.
***REMOVED***
goog.net.IframeIo.prototype.abort = function(opt_failureCode) {
  if (this.active_) {
    goog.log.info(this.logger_, 'Request aborted');
    goog.events.removeAll(this.getRequestIframe());
    this.complete_ = false;
    this.active_ = false;
    this.success_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;

    this.dispatchEvent(goog.net.EventType.ABORT);

    this.makeReady_();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.IframeIo.prototype.disposeInternal = function() {
  goog.log.fine(this.logger_, 'Disposing iframeIo instance');

  // If there is an active request, abort it
  if (this.active_) {
    goog.log.fine(this.logger_, 'Aborting active request');
    this.abort();
  }

  // Call super-classes implementation (remove listeners)
  goog.net.IframeIo.superClass_.disposeInternal.call(this);

  // Add the current iframe to the list of iframes for disposal.
  if (this.iframe_) {
    this.scheduleIframeDisposal_();
  }

  // Disposes of the form
  this.disposeForm_();

  // Nullify anything that might cause problems and clear state
  delete this.errorChecker_;
  this.form_ = null;
  this.lastCustomError_ = this.lastContent_ = this.lastContentHtml_ = null;
  this.lastUri_ = null;
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;

  delete goog.net.IframeIo.instances_[this.name_];
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if transfer is complete.
***REMOVED***
goog.net.IframeIo.prototype.isComplete = function() {
  return this.complete_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if transfer was successful.
***REMOVED***
goog.net.IframeIo.prototype.isSuccess = function() {
  return this.success_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if a transfer is in progress.
***REMOVED***
goog.net.IframeIo.prototype.isActive = function() {
  return this.active_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last response text (i.e. the text content of the iframe).
***REMOVED*** Assumes plain text!
***REMOVED*** @return {?string} Result from the server.
***REMOVED***
goog.net.IframeIo.prototype.getResponseText = function() {
  return this.lastContent_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last response html (i.e. the innerHtml of the iframe).
***REMOVED*** @return {?string} Result from the server.
***REMOVED***
goog.net.IframeIo.prototype.getResponseHtml = function() {
  return this.lastContentHtml_;
***REMOVED***


***REMOVED***
***REMOVED*** Parses the content as JSON. This is a safe parse and may throw an error
***REMOVED*** if the response is malformed.
***REMOVED*** Use goog.json.unsafeparse(this.getResponseText()) if you are sure of the
***REMOVED*** state of the returned content.
***REMOVED*** @return {Object} The parsed content.
***REMOVED***
goog.net.IframeIo.prototype.getResponseJson = function() {
  return goog.json.parse(this.lastContent_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the document object from the last request.  Not truely XML, but
***REMOVED*** used to mirror the XhrIo interface.
***REMOVED*** @return {HTMLDocument} The document object from the last request.
***REMOVED***
goog.net.IframeIo.prototype.getResponseXml = function() {
  if (!this.iframe_) return null;

  return this.getContentDocument_();
***REMOVED***


***REMOVED***
***REMOVED*** Get the uri of the last request.
***REMOVED*** @return {goog.Uri} Uri of last request.
***REMOVED***
goog.net.IframeIo.prototype.getLastUri = function() {
  return this.lastUri_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error code.
***REMOVED*** @return {goog.net.ErrorCode} Last error code.
***REMOVED***
goog.net.IframeIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error message.
***REMOVED*** @return {string} Last error message.
***REMOVED***
goog.net.IframeIo.prototype.getLastError = function() {
  return goog.net.ErrorCode.getDebugMessage(this.lastErrorCode_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last custom error.
***REMOVED*** @return {Object} Last custom error.
***REMOVED***
goog.net.IframeIo.prototype.getLastCustomError = function() {
  return this.lastCustomError_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the callback function used to check if a loaded IFrame is in an error
***REMOVED*** state.
***REMOVED*** @param {Function} fn Callback that expects a document object as it's single
***REMOVED***     argument.
***REMOVED***
goog.net.IframeIo.prototype.setErrorChecker = function(fn) {
  this.errorChecker_ = fn;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the callback function used to check if a loaded IFrame is in an error
***REMOVED*** state.
***REMOVED*** @return {Function} A callback that expects a document object as it's single
***REMOVED***     argument.
***REMOVED***
goog.net.IframeIo.prototype.getErrorChecker = function() {
  return this.errorChecker_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted, or 0 if no timeout is set.
***REMOVED*** @return {number} Timeout interval in milliseconds.
***REMOVED***
goog.net.IframeIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
***REMOVED*** timeout is set.
***REMOVED*** @param {number} ms Timeout interval in milliseconds; 0 means none.
***REMOVED***
goog.net.IframeIo.prototype.setTimeoutInterval = function(ms) {
  // TODO (pupius) - never used - doesn't look like timeouts were implemented
  this.timeoutInterval_ = Math.max(0, ms);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the server response is being ignored.
***REMOVED***
goog.net.IframeIo.prototype.isIgnoringResponse = function() {
  return this.ignoreResponse_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to ignore the response from the server by not adding any event
***REMOVED*** handlers to fire when the iframe loads. This is necessary when using IframeIo
***REMOVED*** to submit to a server on another domain, to avoid same-origin violations when
***REMOVED*** trying to access the response. If this is set to true, the IframeIo instance
***REMOVED*** will be a single-use instance that is only usable for one request.  It will
***REMOVED*** only clean up its resources (iframes and forms) when it is disposed.
***REMOVED*** @param {boolean} ignore Whether to ignore the server response.
***REMOVED***
goog.net.IframeIo.prototype.setIgnoreResponse = function(ignore) {
  this.ignoreResponse_ = ignore;
***REMOVED***


***REMOVED***
***REMOVED*** Submits the internal form to the iframe.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.sendFormInternal_ = function() {
  this.active_ = true;
  this.complete_ = false;
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;

  // Make Iframe
  this.createIframe_();

  if (goog.net.IframeIo.useIeReadyStateCodePath_()) {
    // In IE<11 we simply create the frame, wait until it is ready, then post
    // the form to the iframe and wait for the readystate to change to
    // 'complete'

    // Set the target to the iframe's name
    this.form_.target = this.iframeName_ || '';
    this.appendIframe_();
    if (!this.ignoreResponse_) {
    ***REMOVED***this.iframe_, goog.events.EventType.READYSTATECHANGE,
          this.onIeReadyStateChange_, false, this);
    }

   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      this.errorHandled_ = false;
      this.form_.submit();
    } catch (e) {
      // If submit threw an exception then it probably means the page that the
      // code is running on the local file system and the form's action was
      // pointing to a file that doesn't exist, causing the browser to fire an
      // exception.  IE also throws an exception when it is working offline and
      // the URL is not available.

      if (!this.ignoreResponse_) {
        goog.events.unlisten(
            this.iframe_,
            goog.events.EventType.READYSTATECHANGE,
            this.onIeReadyStateChange_,
            false,
            this);
      }

      this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
    }

  } else {
    // For all other browsers we do some trickery to ensure that there is no
    // entry on the history stack. Thanks go to jlim for the prototype for this

    goog.log.fine(this.logger_, 'Setting up iframes and cloning form');

    this.appendIframe_();

    var innerFrameName = this.iframeName_ +
                         goog.net.IframeIo.INNER_FRAME_SUFFIX;

    // Open and document.write another iframe into the iframe
    var doc = goog.dom.getFrameContentDocument(this.iframe_);
    var html = '<body><iframe id=' + innerFrameName +
               ' name=' + innerFrameName + '></iframe>';
    if (document.baseURI) {
      // On Safari 4 and 5 the new iframe doesn't inherit the current baseURI.
      html = '<head><base href="' + goog.string.htmlEscape(document.baseURI) +
             '"></head>' + html;
    }
    if (goog.userAgent.OPERA) {
      // Opera adds a history entry when document.write is used.
      // Change the innerHTML of the page instead.
      doc.documentElement.innerHTML = html;
    } else {
      doc.write(html);
    }

    // Listen for the iframe's load
    if (!this.ignoreResponse_) {
    ***REMOVED***doc.getElementById(innerFrameName),
          goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
    }

    // Fix text areas, since importNode won't clone changes to the value
    var textareas = this.form_.getElementsByTagName('textarea');
    for (var i = 0, n = textareas.length; i < n; i++) {
      // The childnodes represent the initial child nodes for the text area
      // appending a text node essentially resets the initial value ready for
      // it to be clones - while maintaining HTML escaping.
      var value = textareas[i].value;
      if (goog.dom.getRawTextContent(textareas[i]) != value) {
        goog.dom.setTextContent(textareas[i], value);
        textareas[i].value = value;
      }
    }

    // Append a cloned form to the iframe
    var clone = doc.importNode(this.form_, true);
    clone.target = innerFrameName;
    // Work around crbug.com/66987
    clone.action = this.form_.action;
    doc.body.appendChild(clone);

    // Fix select boxes, importNode won't override the default value
    var selects = this.form_.getElementsByTagName('select');
    var clones = clone.getElementsByTagName('select');
    for (var i = 0, n = selects.length; i < n; i++) {
      var selectsOptions = selects[i].getElementsByTagName('option');
      var clonesOptions = clones[i].getElementsByTagName('option');
      for (var j = 0, m = selectsOptions.length; j < m; j++) {
        clonesOptions[j].selected = selectsOptions[j].selected;
      }
    }

    // IE and some versions of Firefox (1.5 - 1.5.07?) fail to clone the value
    // attribute for <input type="file"> nodes, which results in an empty
    // upload if the clone is submitted.  Check, and if the clone failed, submit
    // using the original form instead.
    var inputs = this.form_.getElementsByTagName('input');
    var inputClones = clone.getElementsByTagName('input');
    for (var i = 0, n = inputs.length; i < n; i++) {
      if (inputs[i].type == 'file') {
        if (inputs[i].value != inputClones[i].value) {
          goog.log.fine(this.logger_,
              'File input value not cloned properly.  Will ' +
              'submit using original form.');
          this.form_.target = innerFrameName;
          clone = this.form_;
          break;
        }
      }
    }

    goog.log.fine(this.logger_, 'Submitting form');

   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      this.errorHandled_ = false;
      clone.submit();
      doc.close();

      if (goog.userAgent.GECKO) {
        // This tests if firefox silently fails, this can happen, for example,
        // when the server resets the connection because of a large file upload
        this.firefoxSilentErrorTimeout_ =
            goog.Timer.callOnce(this.testForFirefoxSilentError_, 250, this);
      }

    } catch (e) {
      // If submit threw an exception then it probably means the page that the
      // code is running on the local file system and the form's action was
      // pointing to a file that doesn't exist, causing the browser to fire an
      // exception.

      goog.log.error(this.logger_,
          'Error when submitting form: ' + goog.debug.exposeException(e));

      if (!this.ignoreResponse_) {
        goog.events.unlisten(doc.getElementById(innerFrameName),
            goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
      }

      doc.close();

      this.handleError_(goog.net.ErrorCode.FILE_NOT_FOUND);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the load event of the iframe for IE, determines if the request was
***REMOVED*** successful or not, handles clean up and dispatching of appropriate events.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.onIeReadyStateChange_ = function(e) {
  if (this.iframe_.readyState == 'complete') {
    goog.events.unlisten(this.iframe_, goog.events.EventType.READYSTATECHANGE,
        this.onIeReadyStateChange_, false, this);
    var doc;
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      doc = goog.dom.getFrameContentDocument(this.iframe_);

      // IE serves about:blank when it cannot load the resource while offline.
      if (goog.userAgent.IE && doc.location == 'about:blank' &&
          !navigator.onLine) {
        this.handleError_(goog.net.ErrorCode.OFFLINE);
        return;
      }
    } catch (ex) {
      this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
      return;
    }
    this.handleLoad_(***REMOVED*** @type {HTMLDocument}***REMOVED***(doc));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the load event of the iframe for non-IE browsers.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.onIframeLoaded_ = function(e) {
  // In Opera, the default "about:blank" page of iframes fires an onload
  // event that we'd like to ignore.
  if (goog.userAgent.OPERA &&
      this.getContentDocument_().location == 'about:blank') {
    return;
  }
  goog.events.unlisten(this.getRequestIframe(),
      goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
  try {
    this.handleLoad_(this.getContentDocument_());
  } catch (ex) {
    this.handleError_(goog.net.ErrorCode.ACCESS_DENIED);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles generic post-load
***REMOVED*** @param {HTMLDocument} contentDocument The frame's document.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.handleLoad_ = function(contentDocument) {
  goog.log.fine(this.logger_, 'Iframe loaded');

  this.complete_ = true;
  this.active_ = false;

  var errorCode;

  // Try to get the innerHTML.  If this fails then it can be an access denied
  // error or the document may just not have a body, typical case is if there
  // is an IE's default 404.
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    var body = contentDocument.body;
    this.lastContent_ = body.textContent || body.innerText;
    this.lastContentHtml_ = body.innerHTML;
  } catch (ex) {
    errorCode = goog.net.ErrorCode.ACCESS_DENIED;
  }

  // Use a callback function, defined by the application, to analyse the
  // contentDocument and determine if it is an error page.  Applications
  // may send down markers in the document, define JS vars, or some other test.
  var customError;
  if (!errorCode && typeof this.errorChecker_ == 'function') {
    customError = this.errorChecker_(contentDocument);
    if (customError) {
      errorCode = goog.net.ErrorCode.CUSTOM_ERROR;
    }
  }

  goog.log.log(this.logger_, goog.log.Level.FINER,
      'Last content: ' + this.lastContent_);
  goog.log.log(this.logger_, goog.log.Level.FINER,
      'Last uri: ' + this.lastUri_);

  if (errorCode) {
    goog.log.fine(this.logger_, 'Load event occurred but failed');
    this.handleError_(errorCode, customError);

  } else {
    goog.log.fine(this.logger_, 'Load succeeded');
    this.success_ = true;
    this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.SUCCESS);

    this.makeReady_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles errors.
***REMOVED*** @param {goog.net.ErrorCode} errorCode Error code.
***REMOVED*** @param {Object=} opt_customError If error is CUSTOM_ERROR, this is the
***REMOVED***     client-provided custom error.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.handleError_ = function(errorCode,
                                                    opt_customError) {
  if (!this.errorHandled_) {
    this.success_ = false;
    this.active_ = false;
    this.complete_ = true;
    this.lastErrorCode_ = errorCode;
    if (errorCode == goog.net.ErrorCode.CUSTOM_ERROR) {
      this.lastCustomError_ = opt_customError;
    }
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);

    this.makeReady_();

    this.errorHandled_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches an event indicating that the IframeIo instance has received a data
***REMOVED*** packet via incremental loading.  The event object has a 'data' member.
***REMOVED*** @param {Object} data Data.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.handleIncrementalData_ = function(data) {
  this.dispatchEvent(new goog.net.IframeIo.IncrementalDataEvent(data));
***REMOVED***


***REMOVED***
***REMOVED*** Finalizes the request, schedules the iframe for disposal, and maybe disposes
***REMOVED*** the form.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.makeReady_ = function() {
  goog.log.info(this.logger_, 'Ready for new requests');
  var iframe = this.iframe_;
  this.scheduleIframeDisposal_();
  this.disposeForm_();
  this.dispatchEvent(goog.net.EventType.READY);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iframe to be used with a request.  We use a new iframe for each
***REMOVED*** request so that requests don't create history entries.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.createIframe_ = function() {
  goog.log.fine(this.logger_, 'Creating iframe');

  this.iframeName_ = this.name_ + '_' + (this.nextIframeId_++).toString(36);

  var iframeAttributes = {'name': this.iframeName_, 'id': this.iframeName_***REMOVED***
  // Setting the source to javascript:"" is a fix to remove IE6 mixed content
  // warnings when being used in an https page.
  if (goog.userAgent.IE && goog.userAgent.VERSION < 7) {
    iframeAttributes.src = 'javascript:""';
  }

  this.iframe_ =***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED***(
      goog.dom.getDomHelper(this.form_).createDom('iframe', iframeAttributes));

  var s = this.iframe_.style;
  s.visibility = 'hidden';
  s.width = s.height = '10px';
  // Chrome sometimes shows scrollbars when visibility is hidden, but not when
  // display is none.
  s.display = 'none';

  // There are reports that safari 2.0.3 has a bug where absolutely positioned
  // iframes can't have their src set.
  if (!goog.userAgent.WEBKIT) {
    s.position = 'absolute';
    s.top = s.left = '-10px';
  } else {
    s.marginTop = s.marginLeft = '-10px';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Appends the Iframe to the document body.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.appendIframe_ = function() {
  goog.dom.getDomHelper(this.form_).getDocument().body.appendChild(
      this.iframe_);
***REMOVED***


***REMOVED***
***REMOVED*** Schedules an iframe for disposal, async.  We can't remove the iframes in the
***REMOVED*** same execution context as the response, otherwise some versions of Firefox
***REMOVED*** will not detect that the response has correctly finished and the loading bar
***REMOVED*** will stay active forever.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.scheduleIframeDisposal_ = function() {
  var iframe = this.iframe_;

  // There shouldn't be a case where the iframe is null and we get to this
  // stage, but the error reports in http://b/909448 indicate it is possible.
  if (iframe) {
    // NOTE(user): Stops Internet Explorer leaking the iframe object. This
    // shouldn't be needed, since the events have all been removed, which
    // should in theory clean up references.  Oh well...
    iframe.onreadystatechange = null;
    iframe.onload = null;
    iframe.onerror = null;

    this.iframesForDisposal_.push(iframe);
  }

  if (this.iframeDisposalTimer_) {
    goog.Timer.clear(this.iframeDisposalTimer_);
    this.iframeDisposalTimer_ = null;
  }

  if (goog.userAgent.GECKO || goog.userAgent.OPERA) {
    // For FF and Opera, we must dispose the iframe async,
    // but it doesn't need to be done as soon as possible.
    // We therefore schedule it for 2s out, so as not to
    // affect any other actions that may have been triggered by the request.
    this.iframeDisposalTimer_ = goog.Timer.callOnce(
        this.disposeIframes_, goog.net.IframeIo.IFRAME_DISPOSE_DELAY_MS, this);

  } else {
    // For non-Gecko browsers we dispose straight away.
    this.disposeIframes_();
  }

  // Nullify reference
  this.iframe_ = null;
  this.iframeName_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Disposes any iframes.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.disposeIframes_ = function() {
  if (this.iframeDisposalTimer_) {
    // Clear the timer
    goog.Timer.clear(this.iframeDisposalTimer_);
    this.iframeDisposalTimer_ = null;
  }

  while (this.iframesForDisposal_.length != 0) {
    var iframe = this.iframesForDisposal_.pop();
    goog.log.info(this.logger_, 'Disposing iframe');
    goog.dom.removeNode(iframe);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all the child nodes from the static form so it can be reused again.
***REMOVED*** This should happen right after sending a request. Otherwise, there can be
***REMOVED*** issues when another iframe uses this form right after the first iframe.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.clearForm_ = function() {
  if (this.form_ && this.form_ == goog.net.IframeIo.form_) {
    goog.dom.removeChildren(this.form_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the Form.  Since IE6 leaks form nodes, this just cleans up the
***REMOVED*** DOM and nullifies the instances reference so the form can be used for another
***REMOVED*** request.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.disposeForm_ = function() {
  this.clearForm_();
  this.form_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLDocument} The appropriate content document.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.getContentDocument_ = function() {
  if (this.iframe_) {
    return***REMOVED*****REMOVED*** @type {HTMLDocument}***REMOVED***(goog.dom.getFrameContentDocument(
        this.getRequestIframe()));
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLIFrameElement} The appropriate iframe to use for requests
***REMOVED***     (created in sendForm_).
***REMOVED***
goog.net.IframeIo.prototype.getRequestIframe = function() {
  if (this.iframe_) {
    return***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED***(
        goog.net.IframeIo.useIeReadyStateCodePath_() ?
            this.iframe_ :
            goog.dom.getFrameContentDocument(this.iframe_).getElementById(
                this.iframeName_ + goog.net.IframeIo.INNER_FRAME_SUFFIX));
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Tests for a silent failure by firefox that can occur when the connection is
***REMOVED*** reset by the server or is made to an illegal URL.
***REMOVED*** @private
***REMOVED***
goog.net.IframeIo.prototype.testForFirefoxSilentError_ = function() {
  if (this.active_) {
    var doc = this.getContentDocument_();

    // This is a hack to test of the document has loaded with a page that
    // we can't access, such as a network error, that won't report onload
    // or onerror events.
    if (doc && !goog.reflect.canAccessProperty(doc, 'documentUri')) {
      if (!this.ignoreResponse_) {
        goog.events.unlisten(this.getRequestIframe(),
            goog.events.EventType.LOAD, this.onIframeLoaded_, false, this);
      }

      if (navigator.onLine) {
        goog.log.warning(this.logger_, 'Silent Firefox error detected');
        this.handleError_(goog.net.ErrorCode.FF_SILENT_ERROR);
      } else {
        goog.log.warning(this.logger_,
            'Firefox is offline so report offline error ' +
            'instead of silent error');
        this.handleError_(goog.net.ErrorCode.OFFLINE);
      }
      return;
    }
    this.firefoxSilentErrorTimeout_ =
        goog.Timer.callOnce(this.testForFirefoxSilentError_, 250, this);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Class for representing incremental data events.
***REMOVED*** @param {Object} data The data associated with the event.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.IframeIo.IncrementalDataEvent = function(data) {
  goog.events.Event.call(this, goog.net.EventType.INCREMENTAL_DATA);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The data associated with the event.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.data = data;
***REMOVED***
goog.inherits(goog.net.IframeIo.IncrementalDataEvent, goog.events.Event);
