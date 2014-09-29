// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Object which fetches Unicode codepoint names from a remote data
***REMOVED*** source. This data source should accept two parameters:
***REMOVED*** <ol>
***REMOVED*** <li>c - the list of codepoints in hexadecimal format
***REMOVED*** <li>p - the name property
***REMOVED*** </ol>
***REMOVED*** and return a JSON object representation of the result.
***REMOVED*** For example, calling this data source with the following URL:
***REMOVED*** http://datasource?c=50,ff,102bd&p=name
***REMOVED*** Should return a JSON object which looks like this:
***REMOVED*** <pre>
***REMOVED*** {"50":{"name":"LATIN CAPITAL LETTER P"},
***REMOVED*** "ff":{"name":"LATIN SMALL LETTER Y WITH DIAERESIS"},
***REMOVED*** "102bd":{"name":"CARIAN LETTER K2"}}
***REMOVED*** </pre>.
***REMOVED***

goog.provide('goog.i18n.uChar.RemoteNameFetcher');

goog.require('goog.Disposable');
***REMOVED***
goog.require('goog.debug.Logger');
goog.require('goog.i18n.uChar');
goog.require('goog.i18n.uChar.NameFetcher');
***REMOVED***
goog.require('goog.structs.Map');



***REMOVED***
***REMOVED*** Builds the RemoteNameFetcher object. This object retrieves codepoint names
***REMOVED*** from a remote data source.
***REMOVED***
***REMOVED*** @param {string} dataSourceUri URI to the data source.
***REMOVED***
***REMOVED*** @implements {goog.i18n.uChar.NameFetcher}
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher = function(dataSourceUri) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** XHRIo object for prefetch() asynchronous calls.
  ***REMOVED***
  ***REMOVED*** @type {!goog.net.XhrIo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.prefetchXhrIo_ = new goog.net.XhrIo();

 ***REMOVED*****REMOVED***
  ***REMOVED*** XHRIo object for getName() asynchronous calls.
  ***REMOVED***
  ***REMOVED*** @type {!goog.net.XhrIo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.getNameXhrIo_ = new goog.net.XhrIo();

 ***REMOVED*****REMOVED***
  ***REMOVED*** URI to the data.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dataSourceUri_ = dataSourceUri;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A cache of all the collected names from the server.
  ***REMOVED***
  ***REMOVED*** @type {!goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.charNames_ = new goog.structs.Map();
***REMOVED***
goog.inherits(goog.i18n.uChar.RemoteNameFetcher, goog.Disposable);


***REMOVED***
***REMOVED*** Key to the listener on XHR for prefetch(). Used to clear previous listeners.
***REMOVED***
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.prefetchLastListenerKey_;


***REMOVED***
***REMOVED*** Key to the listener on XHR for getName(). Used to clear previous listeners.
***REMOVED***
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.getNameLastListenerKey_;


***REMOVED***
***REMOVED*** A reference to the RemoteNameFetcher logger.
***REMOVED***
***REMOVED*** @type {!goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.logger_ =
    goog.debug.Logger.getLogger('goog.i18n.uChar.RemoteNameFetcher');




***REMOVED*** @override***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.prefetchXhrIo_.dispose();
  this.getNameXhrIo_.dispose();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.prefetch = function(characters) {
  // Abort the current request if there is one
  if (this.prefetchXhrIo_.isActive()) {
    goog.i18n.uChar.RemoteNameFetcher.logger_.
        info('Aborted previous prefetch() call for new incoming request');
    this.prefetchXhrIo_.abort();
  }
  if (this.prefetchLastListenerKey_) {
    goog.events.unlistenByKey(this.prefetchLastListenerKey_);
  }

  // Set up new listener
  var preFetchCallback = goog.bind(this.prefetchCallback_, this);
  this.prefetchLastListenerKey_ = goog.events.listenOnce(this.prefetchXhrIo_,
      goog.net.EventType.COMPLETE, preFetchCallback);

  this.fetch_(goog.i18n.uChar.RemoteNameFetcher.RequestType_.BASE_88,
      characters, this.prefetchXhrIo_);
***REMOVED***


***REMOVED***
***REMOVED*** Callback on completion of the prefetch operation.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.prefetchCallback_ = function() {
  this.processResponse_(this.prefetchXhrIo_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.getName = function(character,
    callback) {
  var codepoint = goog.i18n.uChar.toCharCode(character).toString(16);

  if (this.charNames_.containsKey(codepoint)) {
    var name =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.charNames_.get(codepoint));
    callback(name);
    return;
  }

  // Abort the current request if there is one
  if (this.getNameXhrIo_.isActive()) {
    goog.i18n.uChar.RemoteNameFetcher.logger_.
        info('Aborted previous getName() call for new incoming request');
    this.getNameXhrIo_.abort();
  }
  if (this.getNameLastListenerKey_) {
    goog.events.unlistenByKey(this.getNameLastListenerKey_);
  }

  // Set up new listener
  var getNameCallback = goog.bind(this.getNameCallback_, this, codepoint,
      callback);
  this.getNameLastListenerKey_ = goog.events.listenOnce(this.getNameXhrIo_,
      goog.net.EventType.COMPLETE, getNameCallback);

  this.fetch_(goog.i18n.uChar.RemoteNameFetcher.RequestType_.CODEPOINT,
      codepoint, this.getNameXhrIo_);
***REMOVED***


***REMOVED***
***REMOVED*** Callback on completion of the getName operation.
***REMOVED***
***REMOVED*** @param {string} codepoint The codepoint in hexadecimal format.
***REMOVED*** @param {function(?string)} callback The callback function called when the
***REMOVED***     name retrieval is complete, contains a single string parameter with the
***REMOVED***     codepoint name, this parameter will be null if the character name is not
***REMOVED***     defined.
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.getNameCallback_ = function(
    codepoint, callback) {
  this.processResponse_(this.getNameXhrIo_);
  var name =***REMOVED*****REMOVED*** @type {?string}***REMOVED*** (this.charNames_.get(codepoint, null));
  callback(name);
***REMOVED***


***REMOVED***
***REMOVED*** Process the response received from the server and store results in the cache.
***REMOVED***
***REMOVED*** @param {!goog.net.XhrIo} xhrIo The XhrIo object used to make the request.
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.processResponse_ = function(xhrIo) {
  if (!xhrIo.isSuccess()) {
    goog.i18n.uChar.RemoteNameFetcher.logger_.severe(
        'Problem with data source: ' + xhrIo.getLastError());
    return;
  }
  var result = xhrIo.getResponseJson();
  for (var codepoint in result) {
    if (result[codepoint].hasOwnProperty('name')) {
      this.charNames_.set(codepoint, result[codepoint]['name']);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enum for the different request types.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.RequestType_ = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Request type that uses a base 88 string containing a set of codepoints to
  ***REMOVED*** be fetched from the server (see goog.i18n.charpickerdata for more
  ***REMOVED*** information on b88).
 ***REMOVED*****REMOVED***
  BASE_88: 'b88',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Request type that uses a a string of comma separated codepoint values.
 ***REMOVED*****REMOVED***
  CODEPOINT: 'c'
***REMOVED***


***REMOVED***
***REMOVED*** Fetches a set of codepoint names from the data source.
***REMOVED***
***REMOVED*** @param {!goog.i18n.uChar.RemoteNameFetcher.RequestType_} requestType The
***REMOVED***     request type of the operation. This parameter specifies how the server is
***REMOVED***     called to fetch a particular set of codepoints.
***REMOVED*** @param {string} requestInput The input to the request, this is the value that
***REMOVED***     is passed onto the server to complete the request.
***REMOVED*** @param {!goog.net.XhrIo} xhrIo The XHRIo object to execute the server call.
***REMOVED*** @private
***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.fetch_ = function(requestType,
    requestInput, xhrIo) {
  var url = new goog.Uri(this.dataSourceUri_);
  url.setParameterValue(requestType, requestInput);
  url.setParameterValue('p', 'name');
  goog.i18n.uChar.RemoteNameFetcher.logger_.info('Request: ' +
      url.toString());
  xhrIo.send(url);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.i18n.uChar.RemoteNameFetcher.prototype.isNameAvailable = function(
    character) {
  return true;
***REMOVED***
