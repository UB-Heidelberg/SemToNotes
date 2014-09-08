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
***REMOVED*** @fileoverview Cross domain RPC library using the <a
***REMOVED*** href="http://go/xd2_design" target="_top">XD2 approach</a>.
***REMOVED***
***REMOVED*** <h5>Protocol</h5>
***REMOVED*** Client sends a request across domain via a form submission.  Server
***REMOVED*** receives these parameters: "xdpe:request-id", "xdpe:dummy-uri" ("xdpe" for
***REMOVED*** "cross domain parameter to echo back") and other user parameters prefixed
***REMOVED*** with "xdp" (for "cross domain parameter").  Headers are passed as parameters
***REMOVED*** prefixed with "xdh" (for "cross domain header").  Only strings are supported
***REMOVED*** for parameters and headers.  A GET method is mapped to a form GET.  All
***REMOVED*** other methods are mapped to a POST.  Server is expected to produce a
***REMOVED*** HTML response such as the following:
***REMOVED*** <pre>
***REMOVED*** &lt;body&gt;
***REMOVED*** &lt;script type="text/javascript"
***REMOVED***     src="path-to-crossdomainrpc.js"&gt;&lt;/script&gt;
***REMOVED*** var currentDirectory = location.href.substring(
***REMOVED***     0, location.href.lastIndexOf('/')
***REMOVED*** );
***REMOVED***
***REMOVED*** // echo all parameters prefixed with "xdpe:"
***REMOVED*** var echo = {***REMOVED***
***REMOVED*** echo[goog.net.CrossDomainRpc.PARAM_ECHO_REQUEST_ID] =
***REMOVED***     &lt;value of parameter "xdpe:request-id"&gt;;
***REMOVED*** echo[goog.net.CrossDomainRpc.PARAM_ECHO_DUMMY_URI] =
***REMOVED***     &lt;value of parameter "xdpe:dummy-uri"&gt;;
***REMOVED***
***REMOVED*** goog.net.CrossDomainRpc.sendResponse(
***REMOVED***     '({"result":"&lt;responseInJSON"})',
***REMOVED***     true,    // is JSON
***REMOVED***     echo,    // parameters to echo back
***REMOVED***     status,  // response status code
***REMOVED***     headers  // response headers
***REMOVED*** );
***REMOVED*** &lt;/script&gt;
***REMOVED*** &lt;/body&gt;
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** <h5>Server Side</h5>
***REMOVED*** For an example of the server side, refer to the following files:
***REMOVED*** <ul>
***REMOVED*** <li>http://go/xdservletfilter.java</li>
***REMOVED*** <li>http://go/xdservletrequest.java</li>
***REMOVED*** <li>http://go/xdservletresponse.java</li>
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** <h5>System Requirements</h5>
***REMOVED*** Tested on IE6, IE7, Firefox 2.0 and Safari nightly r23841.
***REMOVED***
***REMOVED***

goog.provide('goog.net.CrossDomainRpc');

***REMOVED***
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.net.EventType');
goog.require('goog.net.HttpStatus');
goog.require('goog.string');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Creates a new instance of cross domain RPC
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.CrossDomainRpc = function() {
  goog.events.EventTarget.call(this);
***REMOVED***
goog.inherits(goog.net.CrossDomainRpc, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Cross-domain response iframe marker.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.RESPONSE_MARKER_ = 'xdrp';


***REMOVED***
***REMOVED*** Use a fallback dummy resource if none specified or detected.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.useFallBackDummyResource_ = true;


***REMOVED***
***REMOVED*** Checks to see if we are executing inside a response iframe.  This is the
***REMOVED*** case when this page is used as a dummy resource to gain caller's domain.
***REMOVED*** @return {*} True if we are executing inside a response iframe; false
***REMOVED***     otherwise.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.isInResponseIframe_ = function() {
  return window.location && (window.location.hash.indexOf(
      goog.net.CrossDomainRpc.RESPONSE_MARKER_) == 1 ||
      window.location.search.indexOf(
          goog.net.CrossDomainRpc.RESPONSE_MARKER_) == 1);
***REMOVED***


***REMOVED***
***REMOVED*** Stops execution of the rest of the page if this page is loaded inside a
***REMOVED***    response iframe.
***REMOVED***
if (goog.net.CrossDomainRpc.isInResponseIframe_()) {
  if (goog.userAgent.IE) {
    document.execCommand('Stop');
  } else if (goog.userAgent.GECKO) {
    window.stop();
  } else {
    throw Error('stopped');
  }
}


***REMOVED***
***REMOVED*** Sets the URI for a dummy resource on caller's domain.  This function is
***REMOVED*** used for specifying a particular resource to use rather than relying on
***REMOVED*** auto detection.
***REMOVED*** @param {string} dummyResourceUri URI to dummy resource on the same domain
***REMOVED***    of caller's page.
***REMOVED***
goog.net.CrossDomainRpc.setDummyResourceUri = function(dummyResourceUri) {
  goog.net.CrossDomainRpc.dummyResourceUri_ = dummyResourceUri;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a fallback dummy resource ("/robots.txt" on Firefox and Safari
***REMOVED*** and current page on IE) should be used when a suitable dummy resource is
***REMOVED*** not available.
***REMOVED*** @param {boolean} useFallBack Whether to use fallback or not.
***REMOVED***
goog.net.CrossDomainRpc.setUseFallBackDummyResource = function(useFallBack) {
  goog.net.CrossDomainRpc.useFallBackDummyResource_ = useFallBack;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request across domain.
***REMOVED*** @param {string} uri Uri to make request to.
***REMOVED*** @param {Function=} opt_continuation Continuation function to be called
***REMOVED***     when request is completed.  Takes one argument of an event object
***REMOVED***     whose target has the following properties: "status" is the HTTP
***REMOVED***     response status code, "responseText" is the response text,
***REMOVED***     and "headers" is an object with all response headers.  The event
***REMOVED***     target's getResponseJson() method returns a JavaScript object evaluated
***REMOVED***     from the JSON response or undefined if response is not JSON.
***REMOVED*** @param {string=} opt_method Method of request. Default is POST.
***REMOVED*** @param {Object=} opt_params Parameters. Each property is turned into a
***REMOVED***     request parameter.
***REMOVED*** @param {Object=} opt_headers Map of headers of the request.
***REMOVED***
goog.net.CrossDomainRpc.send =
    function(uri, opt_continuation, opt_method, opt_params, opt_headers) {
  var xdrpc = new goog.net.CrossDomainRpc();
  if (opt_continuation) {
  ***REMOVED***xdrpc, goog.net.EventType.COMPLETE, opt_continuation);
  }
***REMOVED***xdrpc, goog.net.EventType.READY, xdrpc.reset);
  xdrpc.sendRequest(uri, opt_method, opt_params, opt_headers);
***REMOVED***


***REMOVED***
***REMOVED*** Sets debug mode to true or false.  When debug mode is on, response iframes
***REMOVED*** are visible and left behind after their use is finished.
***REMOVED*** @param {boolean} flag Flag to indicate intention to turn debug model on
***REMOVED***     (true) or off (false).
***REMOVED***
goog.net.CrossDomainRpc.setDebugMode = function(flag) {
  goog.net.CrossDomainRpc.debugMode_ = flag;
***REMOVED***


***REMOVED***
***REMOVED*** Logger for goog.net.CrossDomainRpc
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.logger_ =
    goog.log.getLogger('goog.net.CrossDomainRpc');


***REMOVED***
***REMOVED*** Creates the HTML of an input element
***REMOVED*** @param {string} name Name of input element.
***REMOVED*** @param {*} value Value of input element.
***REMOVED*** @return {string} HTML of input element with that name and value.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.createInputHtml_ = function(name, value) {
  return '<textarea name="' + name + '">' +
      goog.net.CrossDomainRpc.escapeAmpersand_(value) + '</textarea>';
***REMOVED***


***REMOVED***
***REMOVED*** Escapes ampersand so that XML/HTML entities are submitted as is because
***REMOVED*** browser unescapes them when they are put into a text area.
***REMOVED*** @param {*} value Value to escape.
***REMOVED*** @return {*} Value with ampersand escaped, if value is a string;
***REMOVED***     otherwise the value itself is returned.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.escapeAmpersand_ = function(value) {
  return value && (goog.isString(value) || value.constructor == String) ?
      value.replace(/&/g, '&amp;') : value;
***REMOVED***


***REMOVED***
***REMOVED*** Finds a dummy resource that can be used by response to gain domain of
***REMOVED*** requester's page.
***REMOVED*** @return {string} URI of the resource to use.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.getDummyResourceUri_ = function() {
  if (goog.net.CrossDomainRpc.dummyResourceUri_) {
    return goog.net.CrossDomainRpc.dummyResourceUri_;
  }

  // find a style sheet if not on IE, which will attempt to save style sheet
  if (goog.userAgent.GECKO) {
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      // find a link which is on the same domain as this page
      // cannot use one with '?' or '#' in its URL as it will confuse
      // goog.net.CrossDomainRpc.getFramePayload_()
      if (link.rel == 'stylesheet' &&
          goog.Uri.haveSameDomain(link.href, window.location.href) &&
          link.href.indexOf('?') < 0) {
        return goog.net.CrossDomainRpc.removeHash_(link.href);
      }
    }
  }

  var images = document.getElementsByTagName('img');
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    // find a link which is on the same domain as this page
    // cannot use one with '?' or '#' in its URL as it will confuse
    // goog.net.CrossDomainRpc.getFramePayload_()
    if (goog.Uri.haveSameDomain(image.src, window.location.href) &&
        image.src.indexOf('?') < 0) {
      return goog.net.CrossDomainRpc.removeHash_(image.src);
    }
  }

  if (!goog.net.CrossDomainRpc.useFallBackDummyResource_) {
    throw Error(
        'No suitable dummy resource specified or detected for this page');
  }

  if (goog.userAgent.IE) {
    // use this page as the dummy resource; remove hash from URL if any
    return goog.net.CrossDomainRpc.removeHash_(window.location.href);
  } else {
   ***REMOVED*****REMOVED***
    ***REMOVED*** Try to use "http://<this-domain>/robots.txt" which may exist.  Even if
    ***REMOVED*** it does not, an error page is returned and is a good dummy resource to
    ***REMOVED*** use on Firefox and Safari.  An existing resource is faster because it
    ***REMOVED*** is cached.
   ***REMOVED*****REMOVED***
    var locationHref = window.location.href;
    var rootSlash = locationHref.indexOf('/', locationHref.indexOf('//') + 2);
    var rootHref = locationHref.substring(0, rootSlash);
    return rootHref + '/robots.txt';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes everything at and after hash from URI
***REMOVED*** @param {string} uri Uri to to remove hash.
***REMOVED*** @return {string} Uri with its hash and all characters after removed.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.removeHash_ = function(uri) {
  return uri.split('#')[0];
***REMOVED***


// ------------
// request side


***REMOVED***
***REMOVED*** next request id used to support multiple XD requests at the same time
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.nextRequestId_ = 0;


***REMOVED***
***REMOVED*** Header prefix.
***REMOVED*** @type {string}
***REMOVED***
goog.net.CrossDomainRpc.HEADER = 'xdh:';


***REMOVED***
***REMOVED*** Parameter prefix.
***REMOVED*** @type {string}
***REMOVED***
goog.net.CrossDomainRpc.PARAM = 'xdp:';


***REMOVED***
***REMOVED*** Parameter to echo prefix.
***REMOVED*** @type {string}
***REMOVED***
goog.net.CrossDomainRpc.PARAM_ECHO = 'xdpe:';


***REMOVED***
***REMOVED*** Parameter to echo: request id
***REMOVED*** @type {string}
***REMOVED***
goog.net.CrossDomainRpc.PARAM_ECHO_REQUEST_ID =
    goog.net.CrossDomainRpc.PARAM_ECHO + 'request-id';


***REMOVED***
***REMOVED*** Parameter to echo: dummy resource URI
***REMOVED*** @type {string}
***REMOVED***
goog.net.CrossDomainRpc.PARAM_ECHO_DUMMY_URI =
    goog.net.CrossDomainRpc.PARAM_ECHO + 'dummy-uri';


***REMOVED***
***REMOVED*** Cross-domain request marker.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.REQUEST_MARKER_ = 'xdrq';


***REMOVED***
***REMOVED*** Sends a request across domain.
***REMOVED*** @param {string} uri Uri to make request to.
***REMOVED*** @param {string=} opt_method Method of request. Default is POST.
***REMOVED*** @param {Object=} opt_params Parameters. Each property is turned into a
***REMOVED***     request parameter.
***REMOVED*** @param {Object=} opt_headers Map of headers of the request.
***REMOVED***
goog.net.CrossDomainRpc.prototype.sendRequest =
    function(uri, opt_method, opt_params, opt_headers) {
  // create request frame
  var requestFrame = this.requestFrame_ = document.createElement('iframe');
  var requestId = goog.net.CrossDomainRpc.nextRequestId_++;
  requestFrame.id = goog.net.CrossDomainRpc.REQUEST_MARKER_ + '-' + requestId;
  if (!goog.net.CrossDomainRpc.debugMode_) {
    requestFrame.style.position = 'absolute';
    requestFrame.style.top = '-5000px';
    requestFrame.style.left = '-5000px';
  }
  document.body.appendChild(requestFrame);

  // build inputs
  var inputs = [];

  // add request id
  inputs.push(goog.net.CrossDomainRpc.createInputHtml_(
      goog.net.CrossDomainRpc.PARAM_ECHO_REQUEST_ID, requestId));

  // add dummy resource uri
  var dummyUri = goog.net.CrossDomainRpc.getDummyResourceUri_();
  goog.log.fine(goog.net.CrossDomainRpc.logger_,
      'dummyUri: ' + dummyUri);
  inputs.push(goog.net.CrossDomainRpc.createInputHtml_(
      goog.net.CrossDomainRpc.PARAM_ECHO_DUMMY_URI, dummyUri));

  // add parameters
  if (opt_params) {
    for (var name in opt_params) {
      var value = opt_params[name];
      inputs.push(goog.net.CrossDomainRpc.createInputHtml_(
          goog.net.CrossDomainRpc.PARAM + name, value));
    }
  }

  // add headers
  if (opt_headers) {
    for (var name in opt_headers) {
      var value = opt_headers[name];
      inputs.push(goog.net.CrossDomainRpc.createInputHtml_(
          goog.net.CrossDomainRpc.HEADER + name, value));
    }
  }

  var requestFrameContent = '<body><form method="' +
      (opt_method == 'GET' ? 'GET' : 'POST') + '" action="' +
      uri + '">' + inputs.join('') + '</form></body>';
  var requestFrameDoc = goog.dom.getFrameContentDocument(requestFrame);
  requestFrameDoc.open();
  requestFrameDoc.write(requestFrameContent);
  requestFrameDoc.close();

  requestFrameDoc.forms[0].submit();
  requestFrameDoc = null;

  this.loadListenerKey_ = goog.events.listen(
      requestFrame, goog.events.EventType.LOAD, function() {
        goog.log.fine(goog.net.CrossDomainRpc.logger_, 'response ready');
        this.responseReady_ = true;
      }, false, this);

  this.receiveResponse_();
***REMOVED***


***REMOVED***
***REMOVED*** period of response polling (ms)
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.RESPONSE_POLLING_PERIOD_ = 50;


***REMOVED***
***REMOVED*** timeout from response comes back to sendResponse is called (ms)
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.SEND_RESPONSE_TIME_OUT_ = 500;


***REMOVED***
***REMOVED*** Receives response by polling to check readiness of response and then
***REMOVED***     reads response frames and assembles response data
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.prototype.receiveResponse_ = function() {
  this.timeWaitedAfterResponseReady_ = 0;
  var responseDetectorHandle = window.setInterval(goog.bind(function() {
    this.detectResponse_(responseDetectorHandle);
  }, this), goog.net.CrossDomainRpc.RESPONSE_POLLING_PERIOD_);
***REMOVED***


***REMOVED***
***REMOVED*** Detects response inside request frame
***REMOVED*** @param {number} responseDetectorHandle Handle of detector.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.prototype.detectResponse_ =
    function(responseDetectorHandle) {
  var requestFrameWindow = this.requestFrame_.contentWindow;
  var grandChildrenLength = requestFrameWindow.frames.length;
  var responseInfoFrame = null;
  if (grandChildrenLength > 0 &&
      goog.net.CrossDomainRpc.isResponseInfoFrame_(responseInfoFrame =
      requestFrameWindow.frames[grandChildrenLength - 1])) {
    goog.log.fine(goog.net.CrossDomainRpc.logger_,
        'xd response ready');

    var responseInfoPayload = goog.net.CrossDomainRpc.getFramePayload_(
        responseInfoFrame).substring(1);
    var params = new goog.Uri.QueryData(responseInfoPayload);

    var chunks = [];
    var numChunks = Number(params.get('n'));
    goog.log.fine(goog.net.CrossDomainRpc.logger_,
        'xd response number of chunks: ' + numChunks);
    for (var i = 0; i < numChunks; i++) {
      var responseFrame = requestFrameWindow.frames[i];
      if (!responseFrame || !responseFrame.location ||
          !responseFrame.location.href) {
        // On Safari 3.0, it is sometimes the case that the
        // iframe exists but doesn't have a same domain href yet.
        goog.log.fine(goog.net.CrossDomainRpc.logger_,
            'xd response iframe not ready');
        return;
      }
      var responseChunkPayload =
          goog.net.CrossDomainRpc.getFramePayload_(responseFrame);
      // go past "chunk="
      var chunkIndex = responseChunkPayload.indexOf(
          goog.net.CrossDomainRpc.PARAM_CHUNK_) +
          goog.net.CrossDomainRpc.PARAM_CHUNK_.length + 1;
      var chunk = responseChunkPayload.substring(chunkIndex);
      chunks.push(chunk);
    }

    window.clearInterval(responseDetectorHandle);

    var responseData = chunks.join('');
    // Payload is not encoded to begin with on IE. Decode in other cases only.
    if (!goog.userAgent.IE) {
      responseData = decodeURIComponent(responseData);
    }

    this.status = Number(params.get('status'));
    this.responseText = responseData;
    this.responseTextIsJson_ = params.get('isDataJson') == 'true';
    this.responseHeaders = goog.json.unsafeParse(
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (params.get('headers')));

    this.dispatchEvent(goog.net.EventType.READY);
    this.dispatchEvent(goog.net.EventType.COMPLETE);
  } else {
    if (this.responseReady_) {
      /* The response has come back. But the first response iframe has not
      ***REMOVED*** been created yet. If this lasts long enough, it is an error.
     ***REMOVED*****REMOVED***
      this.timeWaitedAfterResponseReady_ +=
          goog.net.CrossDomainRpc.RESPONSE_POLLING_PERIOD_;
      if (this.timeWaitedAfterResponseReady_ >
          goog.net.CrossDomainRpc.SEND_RESPONSE_TIME_OUT_) {
        goog.log.fine(goog.net.CrossDomainRpc.logger_,
            'xd response timed out');
        window.clearInterval(responseDetectorHandle);

        this.status = goog.net.HttpStatus.INTERNAL_SERVER_ERROR;
        this.responseText = 'response timed out';

        this.dispatchEvent(goog.net.EventType.READY);
        this.dispatchEvent(goog.net.EventType.ERROR);
        this.dispatchEvent(goog.net.EventType.COMPLETE);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether a frame is response info frame.
***REMOVED*** @param {Object} frame Frame to check.
***REMOVED*** @return {boolean} True if frame is a response info frame; false otherwise.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.isResponseInfoFrame_ = function(frame) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return goog.net.CrossDomainRpc.getFramePayload_(frame).indexOf(
        goog.net.CrossDomainRpc.RESPONSE_INFO_MARKER_) == 1;
  } catch (e) {
    // frame not ready for same-domain access yet
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the payload of a frame (value after # or ? on the URL).  This value
***REMOVED*** is URL encoded except IE, where the value is not encoded to begin with.
***REMOVED*** @param {Object} frame Frame.
***REMOVED*** @return {string} Payload of that frame.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.getFramePayload_ = function(frame) {
  var href = frame.location.href;
  var question = href.indexOf('?');
  var hash = href.indexOf('#');
  // On IE, beucase the URL is not encoded, we can have a case where ?
  // is the delimiter before payload and # in payload or # as the delimiter
  // and ? in payload.  So here we treat whoever is the first as the delimiter.
  var delimiter = question < 0 ? hash :
      hash < 0 ? question : Math.min(question, hash);
  return href.substring(delimiter);
***REMOVED***


***REMOVED***
***REMOVED*** If response is JSON, evaluates it to a JavaScript object and
***REMOVED*** returns it; otherwise returns undefined.
***REMOVED*** @return {Object|undefined} JavaScript object if response is in JSON
***REMOVED***     or undefined.
***REMOVED***
goog.net.CrossDomainRpc.prototype.getResponseJson = function() {
  return this.responseTextIsJson_ ?
      goog.json.unsafeParse(this.responseText) : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the request completed with a success.
***REMOVED***
goog.net.CrossDomainRpc.prototype.isSuccess = function() {
  // Definition similar to goog.net.XhrIo.prototype.isSuccess.
  switch (this.status) {
    case goog.net.HttpStatus.OK:
    case goog.net.HttpStatus.NOT_MODIFIED:
      return true;

    default:
      return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes request iframe used.
***REMOVED***
goog.net.CrossDomainRpc.prototype.reset = function() {
  if (!goog.net.CrossDomainRpc.debugMode_) {
    goog.log.fine(goog.net.CrossDomainRpc.logger_,
        'request frame removed: ' + this.requestFrame_.id);
    goog.events.unlistenByKey(this.loadListenerKey_);
    this.requestFrame_.parentNode.removeChild(this.requestFrame_);
  }
  delete this.requestFrame_;
***REMOVED***


// -------------
// response side


***REMOVED***
***REMOVED*** Name of response info iframe.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.RESPONSE_INFO_MARKER_ =
    goog.net.CrossDomainRpc.RESPONSE_MARKER_ + '-info';


***REMOVED***
***REMOVED*** Maximal chunk size.  IE can only handle 4095 bytes on its URL.
***REMOVED*** 16MB has been tested on Firefox.  But 1MB is a practical size.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.MAX_CHUNK_SIZE_ =
    goog.userAgent.IE ? 4095 : 1024***REMOVED*** 1024;


***REMOVED***
***REMOVED*** Query parameter 'chunk'.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.PARAM_CHUNK_ = 'chunk';


***REMOVED***
***REMOVED*** Prefix before data chunk for passing other parameters.
***REMOVED*** type String
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.CHUNK_PREFIX_ =
    goog.net.CrossDomainRpc.RESPONSE_MARKER_ + '=1&' +
    goog.net.CrossDomainRpc.PARAM_CHUNK_ + '=';


***REMOVED***
***REMOVED*** Makes response available for grandparent (requester)'s receiveResponse
***REMOVED*** call to pick up by creating a series of iframes pointed to the dummy URI
***REMOVED*** with a payload (value after either ? or #) carrying a chunk of response
***REMOVED*** data and a response info iframe that tells the grandparent (requester) the
***REMOVED*** readiness of response.
***REMOVED*** @param {string} data Response data (string or JSON string).
***REMOVED*** @param {boolean} isDataJson true if data is a JSON string; false if just a
***REMOVED***     string.
***REMOVED*** @param {Object} echo Parameters to echo back
***REMOVED***     "xdpe:request-id": Server that produces the response needs to
***REMOVED***     copy it here to support multiple current XD requests on the same page.
***REMOVED***     "xdpe:dummy-uri": URI to a dummy resource that response
***REMOVED***     iframes point to to gain the domain of the client.  This can be an
***REMOVED***     image (IE) or a CSS file (FF) found on the requester's page.
***REMOVED***     Server should copy value from request parameter "xdpe:dummy-uri".
***REMOVED*** @param {number} status HTTP response status code.
***REMOVED*** @param {string} headers Response headers in JSON format.
***REMOVED***
goog.net.CrossDomainRpc.sendResponse =
    function(data, isDataJson, echo, status, headers) {
  var dummyUri = echo[goog.net.CrossDomainRpc.PARAM_ECHO_DUMMY_URI];

  // since the dummy-uri can be specified by the user, verify that it doesn't
  // use any other protocols. (Specifically we don't want users to use a
  // dummy-uri beginning with "javascript:").
  if (!goog.string.caseInsensitiveStartsWith(dummyUri, 'http://') &&
      !goog.string.caseInsensitiveStartsWith(dummyUri, 'https://')) {
    dummyUri = 'http://' + dummyUri;
  }

  // usable chunk size is max less dummy URI less chunk prefix length
  // TODO(user): Figure out why we need to do "- 1" below
  var chunkSize = goog.net.CrossDomainRpc.MAX_CHUNK_SIZE_ - dummyUri.length -
      1 - // payload delimiter ('#' or '?')
      goog.net.CrossDomainRpc.CHUNK_PREFIX_.length - 1;

  /*
  ***REMOVED*** Here we used to do URI encoding of data before we divide it into chunks
  ***REMOVED*** and decode on the receiving end.  We don't do this any more on IE for the
  ***REMOVED*** following reasons.
  ***REMOVED***
  ***REMOVED*** 1) On IE, calling decodeURIComponent on a relatively large string is
  ***REMOVED***   extremely slow (~22s for 160KB).  So even a moderate amount of data
  ***REMOVED***   makes this library pretty much useless.  Fortunately, we can actually
  ***REMOVED***   put unencoded data on IE's URL and get it back reliably.  So we are
  ***REMOVED***   completely skipping encoding and decoding on IE.  When we call
  ***REMOVED***   getFrameHash_ to get it back, the value is still intact(*) and unencoded.
  ***REMOVED*** 2) On Firefox, we have to call decodeURIComponent because location.hash
  ***REMOVED***   does decoding by itself.  Fortunately, decodeURIComponent is not slow
  ***REMOVED***   on Firefox.
  ***REMOVED*** 3) Safari automatically encodes everything you put on URL and it does not
  ***REMOVED***   automatically decode when you access it via location.hash or
  ***REMOVED***   location.href.  So we encode it here and decode it in detectResponse_().
  ***REMOVED***
  ***REMOVED*** Note(*): IE actually does encode only space to %20 and decodes that
  ***REMOVED***   automatically when you do location.href or location.hash.
 ***REMOVED*****REMOVED***
  if (!goog.userAgent.IE) {
    data = encodeURIComponent(data);
  }

  var numChunksToSend = Math.ceil(data.length / chunkSize);
  if (numChunksToSend == 0) {
    goog.net.CrossDomainRpc.createResponseInfo_(
        dummyUri, numChunksToSend, isDataJson, status, headers);
  } else {
    var numChunksSent = 0;
    var checkToCreateResponseInfo_ = function() {
      if (++numChunksSent == numChunksToSend) {
        goog.net.CrossDomainRpc.createResponseInfo_(
            dummyUri, numChunksToSend, isDataJson, status, headers);
      }
   ***REMOVED*****REMOVED***

    for (var i = 0; i < numChunksToSend; i++) {
      var chunkStart = i***REMOVED*** chunkSize;
      var chunkEnd = chunkStart + chunkSize;
      var chunk = chunkEnd > data.length ?
          data.substring(chunkStart) :
          data.substring(chunkStart, chunkEnd);

      var responseFrame = document.createElement('iframe');
      responseFrame.src = dummyUri +
          goog.net.CrossDomainRpc.getPayloadDelimiter_(dummyUri) +
          goog.net.CrossDomainRpc.CHUNK_PREFIX_ + chunk;
      document.body.appendChild(responseFrame);

      // We used to call the function below when handling load event of
      // responseFrame.  But that event does not fire on IE when current
      // page is used as the dummy resource (because its loading is stopped?).
      // It also does not fire sometimes on Firefox.  So now we call it
      // directly.
      checkToCreateResponseInfo_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a response info iframe to indicate completion of sendResponse
***REMOVED*** @param {string} dummyUri URI to a dummy resource.
***REMOVED*** @param {number} numChunks Total number of chunks.
***REMOVED*** @param {boolean} isDataJson Whether response is a JSON string or just string.
***REMOVED*** @param {number} status HTTP response status code.
***REMOVED*** @param {string} headers Response headers in JSON format.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.createResponseInfo_ =
    function(dummyUri, numChunks, isDataJson, status, headers) {
  var responseInfoFrame = document.createElement('iframe');
  document.body.appendChild(responseInfoFrame);
  responseInfoFrame.src = dummyUri +
      goog.net.CrossDomainRpc.getPayloadDelimiter_(dummyUri) +
      goog.net.CrossDomainRpc.RESPONSE_INFO_MARKER_ +
      '=1&n=' + numChunks + '&isDataJson=' + isDataJson + '&status=' + status +
      '&headers=' + encodeURIComponent(headers);
***REMOVED***


***REMOVED***
***REMOVED*** Returns payload delimiter, either "#" when caller's page is not used as
***REMOVED*** the dummy resource or "?" when it is, in which case caching issues prevent
***REMOVED*** response frames to gain the caller's domain.
***REMOVED*** @param {string} dummyUri URI to resource being used as dummy resource.
***REMOVED*** @return {string} Either "?" when caller's page is used as dummy resource or
***REMOVED***     "#" if it is not.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.getPayloadDelimiter_ = function(dummyUri) {
  return goog.net.CrossDomainRpc.REFERRER_ == dummyUri ? '?' : '#';
***REMOVED***


***REMOVED***
***REMOVED*** Removes all parameters (after ? or #) from URI.
***REMOVED*** @param {string} uri URI to remove parameters from.
***REMOVED*** @return {string} URI with all parameters removed.
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.removeUriParams_ = function(uri) {
  // remove everything after question mark
  var question = uri.indexOf('?');
  if (question > 0) {
    uri = uri.substring(0, question);
  }

  // remove everything after hash mark
  var hash = uri.indexOf('#');
  if (hash > 0) {
    uri = uri.substring(0, hash);
  }

  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a response header.
***REMOVED*** @param {string} name Name of response header.
***REMOVED*** @return {string|undefined} Value of response header; undefined if not found.
***REMOVED***
goog.net.CrossDomainRpc.prototype.getResponseHeader = function(name) {
  return goog.isObject(this.responseHeaders) ?
      this.responseHeaders[name] : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Referrer of current document with all parameters after "?" and "#" stripped.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.CrossDomainRpc.REFERRER_ =
    goog.net.CrossDomainRpc.removeUriParams_(document.referrer);
