// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview This file contain classes that add support for cross-domain XHR
***REMOVED*** requests (see http://www.w3.org/TR/cors/). Most modern browsers are able to
***REMOVED*** use a regular XMLHttpRequest for that, but IE 8 use XDomainRequest object
***REMOVED*** instead. This file provides an adapter from this object to a goog.net.XhrLike
***REMOVED*** and a factory to allow using this with a goog.net.XhrIo instance.
***REMOVED***
***REMOVED*** IE 7 and older versions are not supported (given that they do not support
***REMOVED*** CORS requests).
***REMOVED***
goog.provide('goog.net.CorsXmlHttpFactory');
goog.provide('goog.net.IeCorsXhrAdapter');

goog.require('goog.net.HttpStatus');
goog.require('goog.net.XhrLike');
goog.require('goog.net.XmlHttp');
goog.require('goog.net.XmlHttpFactory');



***REMOVED***
***REMOVED*** A factory of XML http request objects that supports cross domain requests.
***REMOVED*** This class should be instantiated and passed as the parameter of a
***REMOVED*** goog.net.XhrIo constructor to allow cross-domain requests in every browser.
***REMOVED***
***REMOVED*** @extends {goog.net.XmlHttpFactory}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.CorsXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this);
***REMOVED***
goog.inherits(goog.net.CorsXmlHttpFactory, goog.net.XmlHttpFactory);


***REMOVED*** @override***REMOVED***
goog.net.CorsXmlHttpFactory.prototype.createInstance = function() {
  var xhr = new XMLHttpRequest();
  if (('withCredentials' in xhr)) {
    return xhr;
  } else if (typeof XDomainRequest != 'undefined') {
    return new goog.net.IeCorsXhrAdapter();
  } else {
    throw Error('Unsupported browser');
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.CorsXmlHttpFactory.prototype.internalGetOptions = function() {
  return {***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** An adapter around Internet Explorer's XDomainRequest object that makes it
***REMOVED*** look like a standard XMLHttpRequest. This can be used instead of
***REMOVED*** XMLHttpRequest to support CORS.
***REMOVED***
***REMOVED*** @implements {goog.net.XhrLike}
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED***
goog.net.IeCorsXhrAdapter = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying XDomainRequest used to make the HTTP request.
  ***REMOVED*** @type {!XDomainRequest}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xdr_ = new XDomainRequest();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The simulated ready state.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.readyState = goog.net.XmlHttp.ReadyState.UNINITIALIZED;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The simulated ready state change callback function.
  ***REMOVED*** @type {Function}
 ***REMOVED*****REMOVED***
  this.onreadystatechange = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The simulated response text parameter.
  ***REMOVED*** @type {?string}
 ***REMOVED*****REMOVED***
  this.responseText = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The simulated status code
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.status = -1;

 ***REMOVED*****REMOVED*** @override***REMOVED***
  this.responseXML = null;

 ***REMOVED*****REMOVED*** @override***REMOVED***
  this.statusText = null;

  this.xdr_.onload = goog.bind(this.handleLoad_, this);
  this.xdr_.onerror = goog.bind(this.handleError_, this);
  this.xdr_.onprogress = goog.bind(this.handleProgress_, this);
  this.xdr_.ontimeout = goog.bind(this.handleTimeout_, this);
***REMOVED***


***REMOVED***
***REMOVED*** Opens a connection to the provided URL.
***REMOVED*** @param {string} method The HTTP method to use. Valid methods include GET and
***REMOVED***     POST.
***REMOVED*** @param {string} url The URL to contact. The authority of this URL must match
***REMOVED***     the authority of the current page's URL (e.g. http or https).
***REMOVED*** @param {?boolean=} opt_async Whether the request is asynchronous, defaulting
***REMOVED***     to true. XDomainRequest does not support syncronous requests, so setting
***REMOVED***     it to false will actually raise an exception.
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.open = function(method, url, opt_async) {
  if (goog.isDefAndNotNull(opt_async) && (!opt_async)) {
    throw new Error('Only async requests are supported.');
  }
  this.xdr_.open(method, url);
***REMOVED***


***REMOVED***
***REMOVED*** Sends the request to the remote server. Before calling this function, always
***REMOVED*** call {@link open}.
***REMOVED*** @param {(ArrayBuffer|ArrayBufferView|Blob|Document|FormData|null|string)=}
***REMOVED***     opt_content The content to send as POSTDATA, if any. Only string data is
***REMOVED***     supported by this implementation.
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.send = function(opt_content) {
  if (opt_content) {
    if (typeof opt_content == 'string') {
      this.xdr_.send(opt_content);
    } else {
      throw new Error('Only string data is supported');
    }
  } else {
    this.xdr_.send();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.abort = function() {
  this.xdr_.abort();
***REMOVED***


***REMOVED***
***REMOVED*** Sets a request header to send to the remote server. Because this
***REMOVED*** implementation does not support request headers, this function does nothing.
***REMOVED*** @param {string} key The name of the HTTP header to set. Ignored.
***REMOVED*** @param {string} value The value to set for the HTTP header. Ignored.
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.setRequestHeader = function(key, value) {
  // Unsupported; ignore the header.
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the response header identified by key. This
***REMOVED*** implementation only supports the 'content-type' header.
***REMOVED*** @param {string} key The request header to fetch. If this parameter is set to
***REMOVED***     'content-type' (case-insensitive), this function returns the value of
***REMOVED***     the 'content-type' request header. If this parameter is set to any other
***REMOVED***     value, this function always returns an empty string.
***REMOVED*** @return {string} The value of the response header, or an empty string if key
***REMOVED***     is not 'content-type' (case-insensitive).
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.getResponseHeader = function(key) {
  if (key.toLowerCase() == 'content-type') {
    return this.xdr_.contentType;
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Handles a request that has fully loaded successfully.
***REMOVED*** @private
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.handleLoad_ = function() {
  // IE only calls onload if the status is 200, so the status code must be OK.
  this.status = goog.net.HttpStatus.OK;
  this.responseText = this.xdr_.responseText;
  this.setReadyState_(goog.net.XmlHttp.ReadyState.COMPLETE);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a request that has failed to load.
***REMOVED*** @private
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.handleError_ = function() {
  // IE doesn't tell us what the status code actually is (other than the fact
  // that it is not 200), so simulate an INTERNAL_SERVER_ERROR.
  this.status = goog.net.HttpStatus.INTERNAL_SERVER_ERROR;
  this.responseText = null;
  this.setReadyState_(goog.net.XmlHttp.ReadyState.COMPLETE);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a request that timed out.
***REMOVED*** @private
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.handleTimeout_ = function() {
  this.handleError_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles a request that is in the process of loading.
***REMOVED*** @private
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.handleProgress_ = function() {
  // IE only calls onprogress if the status is 200, so the status code must be
  // OK.
  this.status = goog.net.HttpStatus.OK;
  this.setReadyState_(goog.net.XmlHttp.ReadyState.LOADING);
***REMOVED***


***REMOVED***
***REMOVED*** Sets this XHR's ready state and fires the onreadystatechange listener (if one
***REMOVED*** is set).
***REMOVED*** @param {number} readyState The new ready state.
***REMOVED*** @private
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.setReadyState_ = function(readyState) {
  this.readyState = readyState;
  if (this.onreadystatechange) {
    this.onreadystatechange();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the response headers from the server. This implemntation only returns
***REMOVED*** the 'content-type' header.
***REMOVED*** @return {string} The headers returned from the server.
***REMOVED*** @override
***REMOVED***
goog.net.IeCorsXhrAdapter.prototype.getAllResponseHeaders = function() {
  return 'content-type: ' + this.xdr_.contentType;
***REMOVED***
