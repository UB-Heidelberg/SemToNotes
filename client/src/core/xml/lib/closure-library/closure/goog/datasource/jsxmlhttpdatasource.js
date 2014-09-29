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
***REMOVED*** @fileoverview
***REMOVED*** DataSource implementation that uses XMLHttpRequest as transport, with
***REMOVED*** response as serialized JS object (not required to be JSON) that can
***REMOVED*** be evaluated and set to a variable.
***REMOVED***
***REMOVED*** Response can have unexecutable starting/ending text to prevent inclusion
***REMOVED*** using <script src="...">
***REMOVED***
***REMOVED***


goog.provide('goog.ds.JsXmlHttpDataSource');

***REMOVED***
goog.require('goog.ds.DataManager');
goog.require('goog.ds.FastDataNode');
goog.require('goog.ds.LoadState');
goog.require('goog.ds.logger');
***REMOVED***
goog.require('goog.net.EventType');
***REMOVED***



***REMOVED***
***REMOVED*** Similar to JsonDataSource, with using XMLHttpRequest for transport
***REMOVED*** Currently requires the result be a JS object that can be evaluated and
***REMOVED*** set to a variable and doesn't require strict JSON notation.
***REMOVED***
***REMOVED*** @param {string || goog.Uri} uri URI for the request.
***REMOVED*** @param {string} name Name of the datasource.
***REMOVED*** @param {string=} opt_startText Text to expect/strip before JS response.
***REMOVED*** @param {string=} opt_endText Text to expect/strip after JS response.
***REMOVED*** @param {boolean=} opt_usePost If true, use POST. Defaults to false (GET).
***REMOVED***
***REMOVED*** @extends {goog.ds.FastDataNode}
***REMOVED***
***REMOVED***
goog.ds.JsXmlHttpDataSource = function(uri, name, opt_startText, opt_endText,
                                       opt_usePost) {
  goog.ds.FastDataNode.call(this, {}, name, null);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
    this.xhr_ = new goog.net.XhrIo();
    this.usePost_ = !!opt_usePost;

  ***REMOVED***this.xhr_, goog.net.EventType.COMPLETE,
        this.completed_, false, this);
  } else {
    this.uri_ = null;
  }
  this.startText_ = opt_startText;
  this.endText_ = opt_endText;
***REMOVED***
goog.inherits(goog.ds.JsXmlHttpDataSource, goog.ds.FastDataNode);


***REMOVED***
***REMOVED*** Delimiter for start of JSON data in response.
***REMOVED*** null = starts at first character of response
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.startText_;


***REMOVED***
***REMOVED*** Delimiter for end of JSON data in response.
***REMOVED*** null = ends at last character of response
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.endText_;


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED*** @override
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.getLoadState = function() {
  return this.loadState_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the request data. This can be used if it is required to
***REMOVED*** send a specific body rather than build the body from the query
***REMOVED*** parameters. Only used in POST requests.
***REMOVED*** @param {string} data The data to send in the request body.
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.setQueryData = function(data) {
  this.queryData_ = data;
***REMOVED***


***REMOVED***
***REMOVED*** Load or reload the backing data for this node.
***REMOVED*** Fires the JsonDataSource
***REMOVED*** @override
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.load = function() {
  goog.ds.logger.info('Sending JS request for DataSource ' +
      this.getDataName() + ' to ' + this.uri_);

  if (this.uri_) {
    if (this.usePost_) {

      var queryData;
      if (!this.queryData_) {
        queryData = this.uri_.getQueryData().toString();
      } else {
        queryData = this.queryData_;
      }

      var uriNoQuery = this.uri_.clone();
      uriNoQuery.setQueryData(null);
      this.xhr_.send(String(uriNoQuery), 'POST', queryData);
    } else {
      this.xhr_.send(String(this.uri_));
    }
  } else {
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called on successful request.
***REMOVED*** @private
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.success_ = function()  {
  goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
***REMOVED***


***REMOVED***
***REMOVED*** Completed callback. Loads data if successful, otherwise sets
***REMOVED*** state to FAILED
***REMOVED*** @param {goog.events.Event} e Event object, Xhr is target.
***REMOVED*** @private
***REMOVED***
goog.ds.JsXmlHttpDataSource.prototype.completed_ = function(e) {
  if (this.xhr_.isSuccess()) {
    goog.ds.logger.info('Got data for DataSource ' + this.getDataName());
    var text = this.xhr_.getResponseText();

    // Look for start and end token and trim text
    if (this.startText_) {
      var startpos = text.indexOf(this.startText_);
      text = text.substring(startpos + this.startText_.length);
    }
    if (this.endText_) {
      var endpos = text.lastIndexOf(this.endText_);
      text = text.substring(0, endpos);
    }

    // Eval result
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      var jsonObj =***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (eval('[' + text + '][0]'));
      this.extendWith_(jsonObj);
      this.loadState_ = goog.ds.LoadState.LOADED;
    }
    catch (ex) {
      // Invalid JS
      this.loadState_ = goog.ds.LoadState.FAILED;
      goog.ds.logger.severe('Failed to parse data: ' + ex.message);
    }

    // Call on a timer to avoid threading issues on IE.
    goog.global.setTimeout(goog.bind(this.success_, this), 0);
  } else {
    goog.ds.logger.info('Data retrieve failed for DataSource ' +
        this.getDataName());
    this.loadState_ = goog.ds.LoadState.FAILED;
  }
***REMOVED***
