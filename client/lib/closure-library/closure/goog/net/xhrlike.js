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

goog.provide('goog.net.XhrLike');



***REMOVED***
***REMOVED*** Interface for the common parts of XMLHttpRequest.
***REMOVED***
***REMOVED*** Mostly copied from externs/w3c_xml.js.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/
***REMOVED***
goog.net.XhrLike = function() {***REMOVED***


***REMOVED***
***REMOVED*** Typedef that refers to either native or custom-implemented XHR objects.
***REMOVED*** @typedef {!goog.net.XhrLike|!XMLHttpRequest}
***REMOVED***
goog.net.XhrLike.OrNative;


***REMOVED***
***REMOVED*** @type {function()|null|undefined}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#handler-xhr-onreadystatechange
***REMOVED***
goog.net.XhrLike.prototype.onreadystatechange;


***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
***REMOVED***
goog.net.XhrLike.prototype.responseText;


***REMOVED***
***REMOVED*** @type {Document}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-responsexml-attribute
***REMOVED***
goog.net.XhrLike.prototype.responseXML;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#readystate
***REMOVED***
goog.net.XhrLike.prototype.readyState;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#status
***REMOVED***
goog.net.XhrLike.prototype.status;


***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#statustext
***REMOVED***
goog.net.XhrLike.prototype.statusText;


***REMOVED***
***REMOVED*** @param {string} method
***REMOVED*** @param {string} url
***REMOVED*** @param {?boolean=} opt_async
***REMOVED*** @param {?string=} opt_user
***REMOVED*** @param {?string=} opt_password
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-open()-method
***REMOVED***
goog.net.XhrLike.prototype.open = function(method, url, opt_async, opt_user,
    opt_password) {***REMOVED***


***REMOVED***
***REMOVED*** @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=} opt_data
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-send()-method
***REMOVED***
goog.net.XhrLike.prototype.send = function(opt_data) {***REMOVED***


***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-abort()-method
***REMOVED***
goog.net.XhrLike.prototype.abort = function() {***REMOVED***


***REMOVED***
***REMOVED*** @param {string} header
***REMOVED*** @param {string} value
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader()-method
***REMOVED***
goog.net.XhrLike.prototype.setRequestHeader = function(header, value) {***REMOVED***


***REMOVED***
***REMOVED*** @param {string} header
***REMOVED*** @return {string}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
***REMOVED***
goog.net.XhrLike.prototype.getResponseHeader = function(header) {***REMOVED***


***REMOVED***
***REMOVED*** @return {string}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
***REMOVED***
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {***REMOVED***
