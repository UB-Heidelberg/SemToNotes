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
***REMOVED*** @fileoverview tmpnetwork.js contains some temporary networking functions
***REMOVED*** for browserchannel which will be moved at a later date.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for BrowserChannel
***REMOVED***
goog.provide('goog.net.tmpnetwork');

***REMOVED***
goog.require('goog.net.ChannelDebug');


***REMOVED***
***REMOVED*** Default timeout to allow for google.com pings.
***REMOVED*** @type {number}
***REMOVED***
goog.net.tmpnetwork.GOOGLECOM_TIMEOUT = 10000;


***REMOVED***
***REMOVED*** Pings the network to check if an error is a server error or user's network
***REMOVED*** error.
***REMOVED***
***REMOVED*** @param {Function} callback The function to call back with results.
***REMOVED*** @param {goog.Uri?=} opt_imageUri The URI of an image to use for the network
***REMOVED***     test. You***REMOVED***must* provide an image URI; the default behavior is provided
***REMOVED***     for compatibility with existing code, but the search team does not want
***REMOVED***     people using images served off of google.com for this purpose. The
***REMOVED***     default will go away when all usages have been changed.
***REMOVED***
goog.net.tmpnetwork.testGoogleCom = function(callback, opt_imageUri) {
  // We need to add a 'rand' to make sure the response is not fulfilled
  // by browser cache.
  var uri = opt_imageUri;
  if (!uri) {
    uri = new goog.Uri('//www.google.com/images/cleardot.gif');
    uri.makeUnique();
  }
  goog.net.tmpnetwork.testLoadImage(uri.toString(),
      goog.net.tmpnetwork.GOOGLECOM_TIMEOUT, callback);
***REMOVED***


***REMOVED***
***REMOVED*** Test loading the given image, retrying if necessary.
***REMOVED*** @param {string} url URL to the iamge.
***REMOVED*** @param {number} timeout Milliseconds before giving up.
***REMOVED*** @param {Function} callback Function to call with results.
***REMOVED*** @param {number} retries The number of times to retry.
***REMOVED*** @param {number=} opt_pauseBetweenRetriesMS Optional number of milliseconds
***REMOVED***     between retries - defaults to 0.
***REMOVED***
goog.net.tmpnetwork.testLoadImageWithRetries = function(url, timeout, callback,
    retries, opt_pauseBetweenRetriesMS) {
  var channelDebug = new goog.net.ChannelDebug();
  channelDebug.debug('TestLoadImageWithRetries: ' + opt_pauseBetweenRetriesMS);
  if (retries == 0) {
    // no more retries, give up
    callback(false);
    return;
  }

  var pauseBetweenRetries = opt_pauseBetweenRetriesMS || 0;
  retries--;
  goog.net.tmpnetwork.testLoadImage(url, timeout, function(succeeded) {
    if (succeeded) {
      callback(true);
    } else {
      // try again
      goog.global.setTimeout(function() {
        goog.net.tmpnetwork.testLoadImageWithRetries(url, timeout, callback,
            retries, pauseBetweenRetries);
      }, pauseBetweenRetries);
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Test loading the given image.
***REMOVED*** @param {string} url URL to the iamge.
***REMOVED*** @param {number} timeout Milliseconds before giving up.
***REMOVED*** @param {Function} callback Function to call with results.
***REMOVED***
goog.net.tmpnetwork.testLoadImage = function(url, timeout, callback) {
  var channelDebug = new goog.net.ChannelDebug();
  channelDebug.debug('TestLoadImage: loading ' + url);
  var img = new Image();
  img.onload = function() {
    try {
      channelDebug.debug('TestLoadImage: loaded');
      goog.net.tmpnetwork.clearImageCallbacks_(img);
      callback(true);
    } catch (e) {
      channelDebug.dumpException(e);
    }
 ***REMOVED*****REMOVED***
  img.onerror = function() {
    try {
      channelDebug.debug('TestLoadImage: error');
      goog.net.tmpnetwork.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      channelDebug.dumpException(e);
    }
 ***REMOVED*****REMOVED***
  img.onabort = function() {
    try {
      channelDebug.debug('TestLoadImage: abort');
      goog.net.tmpnetwork.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      channelDebug.dumpException(e);
    }
 ***REMOVED*****REMOVED***
  img.ontimeout = function() {
    try {
      channelDebug.debug('TestLoadImage: timeout');
      goog.net.tmpnetwork.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      channelDebug.dumpException(e);
    }
 ***REMOVED*****REMOVED***

  goog.global.setTimeout(function() {
    if (img.ontimeout) {
      img.ontimeout();
    }
  }, timeout);
  img.src = url;
***REMOVED***


***REMOVED***
***REMOVED*** Clear handlers to avoid memory leaks.
***REMOVED*** @param {Image} img The image to clear handlers from.
***REMOVED*** @private
***REMOVED***
goog.net.tmpnetwork.clearImageCallbacks_ = function(img) {
  // NOTE(user): Nullified individually to avoid compiler warnings
  // (BUG 658126)
  img.onload = null;
  img.onerror = null;
  img.onabort = null;
  img.ontimeout = null;
***REMOVED***
