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
***REMOVED*** @fileoverview Helper class to load a list of URIs in bulk. All URIs
***REMOVED*** must be a successfully loaded in order for the entire load to be considered
***REMOVED*** a success.
***REMOVED***
***REMOVED***

goog.provide('goog.net.BulkLoaderHelper');

goog.require('goog.Disposable');
goog.require('goog.debug.Logger');



***REMOVED***
***REMOVED*** Helper class used to load multiple URIs.
***REMOVED*** @param {Array.<string|goog.Uri>} uris The URIs to load.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.net.BulkLoaderHelper = function(uris) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URIs to load.
  ***REMOVED*** @type {Array.<string|goog.Uri>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.uris_ = uris;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The response from the XHR's.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.responseTexts_ = [];
***REMOVED***
goog.inherits(goog.net.BulkLoaderHelper, goog.Disposable);


***REMOVED***
***REMOVED*** A logger.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.net.BulkLoaderHelper.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.net.BulkLoaderHelper');


***REMOVED***
***REMOVED*** Gets the URI by id.
***REMOVED*** @param {number} id The id.
***REMOVED*** @return {string|goog.Uri} The URI specified by the id.
***REMOVED***
goog.net.BulkLoaderHelper.prototype.getUri = function(id) {
  return this.uris_[id];
***REMOVED***


***REMOVED***
***REMOVED*** Gets the URIs.
***REMOVED*** @return {Array.<string|goog.Uri>} The URIs.
***REMOVED***
goog.net.BulkLoaderHelper.prototype.getUris = function() {
  return this.uris_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the response texts.
***REMOVED*** @return {Array.<string>} The response texts.
***REMOVED***
goog.net.BulkLoaderHelper.prototype.getResponseTexts = function() {
  return this.responseTexts_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the response text by id.
***REMOVED*** @param {number} id The id.
***REMOVED*** @param {string} responseText The response texts.
***REMOVED***
goog.net.BulkLoaderHelper.prototype.setResponseText = function(
    id, responseText) {
  this.responseTexts_[id] = responseText;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the load of the URIs is complete.
***REMOVED*** @return {boolean} TRUE iff the load is complete.
***REMOVED***
goog.net.BulkLoaderHelper.prototype.isLoadComplete = function() {
  var responseTexts = this.responseTexts_;
  if (responseTexts.length == this.uris_.length) {
    for (var i = 0; i < responseTexts.length; i++) {
      if (!goog.isDefAndNotNull(responseTexts[i])) {
        return false;
      }
    }
    return true;
  }
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.BulkLoaderHelper.prototype.disposeInternal = function() {
  goog.net.BulkLoaderHelper.superClass_.disposeInternal.call(this);

  this.uris_ = null;
  this.responseTexts_ = null;
***REMOVED***
