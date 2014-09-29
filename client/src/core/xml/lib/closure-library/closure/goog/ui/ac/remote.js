// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Factory class to create a simple autocomplete that will match
***REMOVED*** from an array of data provided via ajax.
***REMOVED***
***REMOVED*** @see ../../demos/autocompleteremote.html
***REMOVED***

goog.provide('goog.ui.ac.Remote');

goog.require('goog.ui.ac.AutoComplete');
goog.require('goog.ui.ac.InputHandler');
goog.require('goog.ui.ac.RemoteArrayMatcher');
goog.require('goog.ui.ac.Renderer');



***REMOVED***
***REMOVED*** Factory class for building a remote autocomplete widget that autocompletes
***REMOVED*** an inputbox or text area from a data array provided via ajax.
***REMOVED*** @param {string} url The Uri which generates the auto complete matches.
***REMOVED*** @param {Element} input Input element or text area.
***REMOVED*** @param {boolean=} opt_multi Whether to allow multiple entries; defaults
***REMOVED***     to false.
***REMOVED*** @param {boolean=} opt_useSimilar Whether to use similar matches; e.g.
***REMOVED***     "gost" => "ghost".
***REMOVED***
***REMOVED*** @extends {goog.ui.ac.AutoComplete}
***REMOVED***
goog.ui.ac.Remote = function(url, input, opt_multi, opt_useSimilar) {
  var matcher = new goog.ui.ac.RemoteArrayMatcher(url, !opt_useSimilar);
  this.matcher_ = matcher;

  var renderer = new goog.ui.ac.Renderer();

  var inputhandler = new goog.ui.ac.InputHandler(null, null, !!opt_multi, 300);

  goog.ui.ac.AutoComplete.call(this, matcher, renderer, inputhandler);

  inputhandler.attachAutoComplete(this);
  inputhandler.attachInputs(input);
***REMOVED***
goog.inherits(goog.ui.ac.Remote, goog.ui.ac.AutoComplete);


***REMOVED***
***REMOVED*** Set whether or not standard highlighting should be used when rendering rows.
***REMOVED*** @param {boolean} useStandardHighlighting true if standard highlighting used.
***REMOVED***
goog.ui.ac.Remote.prototype.setUseStandardHighlighting =
    function(useStandardHighlighting) {
  this.renderer_.setUseStandardHighlighting(useStandardHighlighting);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the attached InputHandler object.
***REMOVED*** @return {goog.ui.ac.InputHandler} The input handler.
***REMOVED***
goog.ui.ac.Remote.prototype.getInputHandler = function() {
  return***REMOVED*****REMOVED*** @type {goog.ui.ac.InputHandler}***REMOVED*** (
      this.selectionHandler_);
***REMOVED***


***REMOVED***
***REMOVED*** Set the send method ("GET", "POST") for the matcher.
***REMOVED*** @param {string} method The send method; default: GET.
***REMOVED***
goog.ui.ac.Remote.prototype.setMethod = function(method) {
  this.matcher_.setMethod(method);
***REMOVED***


***REMOVED***
***REMOVED*** Set the post data for the matcher.
***REMOVED*** @param {string} content Post data.
***REMOVED***
goog.ui.ac.Remote.prototype.setContent = function(content) {
  this.matcher_.setContent(content);
***REMOVED***


***REMOVED***
***REMOVED*** Set the HTTP headers for the matcher.
***REMOVED*** @param {Object|goog.structs.Map} headers Map of headers to add to the
***REMOVED***     request.
***REMOVED***
goog.ui.ac.Remote.prototype.setHeaders = function(headers) {
  this.matcher_.setHeaders(headers);
***REMOVED***


***REMOVED***
***REMOVED*** Set the timeout interval for the matcher.
***REMOVED*** @param {number} interval Number of milliseconds after which an
***REMOVED***     incomplete request will be aborted; 0 means no timeout is set.
***REMOVED***
goog.ui.ac.Remote.prototype.setTimeoutInterval = function(interval) {
  this.matcher_.setTimeoutInterval(interval);
***REMOVED***
