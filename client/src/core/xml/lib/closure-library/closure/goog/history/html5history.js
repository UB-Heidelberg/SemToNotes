// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview HTML5 based history implementation, compatible with
***REMOVED*** goog.History.
***REMOVED***
***REMOVED*** TODO(user): There should really be a history interface and multiple
***REMOVED*** implementations.
***REMOVED***
***REMOVED***


goog.provide('goog.history.Html5History');
goog.provide('goog.history.Html5History.TokenTransformer');

goog.require('goog.asserts');
***REMOVED***
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.history.Event');
goog.require('goog.history.EventType');



***REMOVED***
***REMOVED*** An implementation compatible with goog.History that uses the HTML5
***REMOVED*** history APIs.
***REMOVED***
***REMOVED*** @param {Window=} opt_win The window to listen/dispatch history events on.
***REMOVED*** @param {goog.history.Html5History.TokenTransformer=} opt_transformer
***REMOVED***     The token transformer that is used to create URL from the token
***REMOVED***     when storing token without using hash fragment.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.history.Html5History = function(opt_win, opt_transformer) {
  goog.events.EventTarget.call(this);
  goog.asserts.assert(goog.history.Html5History.isSupported(opt_win),
      'HTML5 history is not supported.');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The window object to use for history tokens.  Typically the top window.
  ***REMOVED*** @type {Window}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.window_ = opt_win || window;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The token transformer that is used to create URL from the token
  ***REMOVED*** when storing token without using hash fragment.
  ***REMOVED*** @type {goog.history.Html5History.TokenTransformer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.transformer_ = opt_transformer || null;

***REMOVED***this.window_, goog.events.EventType.POPSTATE,
      this.onHistoryEvent_, false, this);
***REMOVED***this.window_, goog.events.EventType.HASHCHANGE,
      this.onHistoryEvent_, false, this);
***REMOVED***
goog.inherits(goog.history.Html5History, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Returns whether Html5History is supported.
***REMOVED*** @param {Window=} opt_win Optional window to check.
***REMOVED*** @return {boolean} Whether html5 history is supported.
***REMOVED***
goog.history.Html5History.isSupported = function(opt_win) {
  var win = opt_win || window;
  return !!(win.history && win.history.pushState);
***REMOVED***


***REMOVED***
***REMOVED*** Status of when the object is active and dispatching events.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.history.Html5History.prototype.enabled_ = false;


***REMOVED***
***REMOVED*** Whether to use the fragment to store the token, defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.history.Html5History.prototype.useFragment_ = true;


***REMOVED***
***REMOVED*** If useFragment is false the path will be used, the path prefix will be
***REMOVED*** prepended to all tokens. Defaults to '/'.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.history.Html5History.prototype.pathPrefix_ = '/';


***REMOVED***
***REMOVED*** Starts or stops the History.  When enabled, the History object
***REMOVED*** will immediately fire an event for the current location. The caller can set
***REMOVED*** up event listeners between the call to the constructor and the call to
***REMOVED*** setEnabled.
***REMOVED***
***REMOVED*** @param {boolean} enable Whether to enable history.
***REMOVED***
goog.history.Html5History.prototype.setEnabled = function(enable) {
  if (enable == this.enabled_) {
    return;
  }

  this.enabled_ = enable;

  if (enable) {
    this.dispatchEvent(new goog.history.Event(this.getToken(), false));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current token.
***REMOVED*** @return {string} The current token.
***REMOVED***
goog.history.Html5History.prototype.getToken = function() {
  if (this.useFragment_) {
    var loc = this.window_.location.href;
    var index = loc.indexOf('#');
    return index < 0 ? '' : loc.substring(index + 1);
  } else {
    return this.transformer_ ?
        this.transformer_.retrieveToken(
            this.pathPrefix_, this.window_.location) :
        this.window_.location.pathname.substr(this.pathPrefix_.length);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the history state.
***REMOVED*** @param {string} token The history state identifier.
***REMOVED*** @param {string=} opt_title Optional title to associate with history entry.
***REMOVED***
goog.history.Html5History.prototype.setToken = function(token, opt_title) {
  if (token == this.getToken()) {
    return;
  }

  // Per externs/gecko_dom.js document.title can be null.
  this.window_.history.pushState(null,
      opt_title || this.window_.document.title || '', this.getUrl_(token));
  this.dispatchEvent(new goog.history.Event(token, false));
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the current history state without affecting the rest of the history
***REMOVED*** stack.
***REMOVED*** @param {string} token The history state identifier.
***REMOVED*** @param {string=} opt_title Optional title to associate with history entry.
***REMOVED***
goog.history.Html5History.prototype.replaceToken = function(token, opt_title) {
  // Per externs/gecko_dom.js document.title can be null.
  this.window_.history.replaceState(null,
      opt_title || this.window_.document.title || '', this.getUrl_(token));
  this.dispatchEvent(new goog.history.Event(token, false));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.history.Html5History.prototype.disposeInternal = function() {
  goog.events.unlisten(this.window_, goog.events.EventType.POPSTATE,
      this.onHistoryEvent_, false, this);
  if (this.useFragment_) {
    goog.events.unlisten(this.window_, goog.events.EventType.HASHCHANGE,
        this.onHistoryEvent_, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to use the fragment to store tokens.
***REMOVED*** @param {boolean} useFragment Whether to use the fragment.
***REMOVED***
goog.history.Html5History.prototype.setUseFragment = function(useFragment) {
  if (this.useFragment_ != useFragment) {
    if (useFragment) {
    ***REMOVED***this.window_, goog.events.EventType.HASHCHANGE,
          this.onHistoryEvent_, false, this);
    } else {
      goog.events.unlisten(this.window_, goog.events.EventType.HASHCHANGE,
          this.onHistoryEvent_, false, this);
    }
    this.useFragment_ = useFragment;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the path prefix to use if storing tokens in the path. The path
***REMOVED*** prefix should start and end with slash.
***REMOVED*** @param {string} pathPrefix Sets the path prefix.
***REMOVED***
goog.history.Html5History.prototype.setPathPrefix = function(pathPrefix) {
  this.pathPrefix_ = pathPrefix;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the path prefix.
***REMOVED*** @return {string} The path prefix.
***REMOVED***
goog.history.Html5History.prototype.getPathPrefix = function() {
  return this.pathPrefix_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the URL to set when calling history.pushState
***REMOVED*** @param {string} token The history token.
***REMOVED*** @return {string} The URL.
***REMOVED*** @private
***REMOVED***
goog.history.Html5History.prototype.getUrl_ = function(token) {
  if (this.useFragment_) {
    return '#' + token;
  } else {
    return this.transformer_ ?
        this.transformer_.createUrl(
            token, this.pathPrefix_, this.window_.location) :
        this.pathPrefix_ + token + this.window_.location.search;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles history events dispatched by the browser.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event object.
***REMOVED*** @private
***REMOVED***
goog.history.Html5History.prototype.onHistoryEvent_ = function(e) {
  if (this.enabled_) {
    this.dispatchEvent(new goog.history.Event(this.getToken(), true));
  }
***REMOVED***



***REMOVED***
***REMOVED*** A token transformer that can create a URL from a history
***REMOVED*** token. This is used by {@code goog.history.Html5History} to create
***REMOVED*** URL when storing token without the hash fragment.
***REMOVED***
***REMOVED*** Given a {@code window.location} object containing the location
***REMOVED*** created by {@code createUrl}, the token transformer allows
***REMOVED*** retrieval of the token back via {@code retrieveToken}.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.history.Html5History.TokenTransformer = function() {***REMOVED***


***REMOVED***
***REMOVED*** Retrieves a history token given the path prefix and
***REMOVED*** {@code window.location} object.
***REMOVED***
***REMOVED*** @param {string} pathPrefix The path prefix to use when storing token
***REMOVED***     in a path; always begin with a slash.
***REMOVED*** @param {Location} location The {@code window.location} object.
***REMOVED***     Treat this object as read-only.
***REMOVED*** @return {string} token The history token.
***REMOVED***
goog.history.Html5History.TokenTransformer.prototype.retrieveToken = function(
    pathPrefix, location) {***REMOVED***


***REMOVED***
***REMOVED*** Creates a URL to be pushed into HTML5 history stack when storing
***REMOVED*** token without using hash fragment.
***REMOVED***
***REMOVED*** @param {string} token The history token.
***REMOVED*** @param {string} pathPrefix The path prefix to use when storing token
***REMOVED***     in a path; always begin with a slash.
***REMOVED*** @param {Location} location The {@code window.location} object.
***REMOVED***     Treat this object as read-only.
***REMOVED*** @return {string} url The complete URL string from path onwards
***REMOVED***     (without {@code protocol://host:port} part); must begin with a
***REMOVED***     slash.
***REMOVED***
goog.history.Html5History.TokenTransformer.prototype.createUrl = function(
    token, pathPrefix, location) {***REMOVED***
