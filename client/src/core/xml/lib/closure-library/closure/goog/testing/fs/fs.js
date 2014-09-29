// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Mock implementations of the Closure HTML5 FileSystem wrapper
***REMOVED*** classes. These implementations are designed to be usable in any browser, so
***REMOVED*** they use none of the native FileSystem-related objects.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.fs');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.fs');
goog.require('goog.testing.fs.Blob');
goog.require('goog.testing.fs.FileSystem');


***REMOVED***
***REMOVED*** Get a filesystem object. Since these are mocks, there's no difference between
***REMOVED*** temporary and persistent filesystems.
***REMOVED***
***REMOVED*** @param {number} size Ignored.
***REMOVED*** @return {!goog.async.Deferred} The deferred
***REMOVED***     {@link goog.testing.fs.FileSystem}.
***REMOVED***
goog.testing.fs.getTemporary = function(size) {
  var d = new goog.async.Deferred();
  goog.Timer.callOnce(
      goog.bind(d.callback, d, new goog.testing.fs.FileSystem()));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Get a filesystem object. Since these are mocks, there's no difference between
***REMOVED*** temporary and persistent filesystems.
***REMOVED***
***REMOVED*** @param {number} size Ignored.
***REMOVED*** @return {!goog.async.Deferred} The deferred
***REMOVED***     {@link goog.testing.fs.FileSystem}.
***REMOVED***
goog.testing.fs.getPersistent = function(size) {
  return goog.testing.fs.getTemporary(size);
***REMOVED***


***REMOVED***
***REMOVED*** Which object URLs have been granted for fake blobs.
***REMOVED*** @type {!Object.<boolean>}
***REMOVED*** @private
***REMOVED***
goog.testing.fs.objectUrls_ = {***REMOVED***


***REMOVED***
***REMOVED*** Create a fake object URL for a given fake blob. This can be used as a real
***REMOVED*** URL, and it can be created and revoked normally.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob for which to create the URL.
***REMOVED*** @return {string} The URL.
***REMOVED***
goog.testing.fs.createObjectUrl = function(blob) {
  var url = blob.toDataUrl();
  goog.testing.fs.objectUrls_[url] = true;
  return url;
***REMOVED***


***REMOVED***
***REMOVED*** Remove a URL that was created for a fake blob.
***REMOVED***
***REMOVED*** @param {string} url The URL to revoke.
***REMOVED***
goog.testing.fs.revokeObjectUrl = function(url) {
  delete goog.testing.fs.objectUrls_[url];
***REMOVED***


***REMOVED***
***REMOVED*** Return whether or not a URL has been granted for the given blob.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to check.
***REMOVED*** @return {boolean} Whether a URL has been granted.
***REMOVED***
goog.testing.fs.isObjectUrlGranted = function(blob) {
  return (blob.toDataUrl()) in goog.testing.fs.objectUrls_;
***REMOVED***


***REMOVED***
***REMOVED*** Concatenates one or more values together and converts them to a fake blob.
***REMOVED***
***REMOVED*** @param {...(string|!goog.testing.fs.Blob)} var_args The values that will make
***REMOVED***     up the resulting blob.
***REMOVED*** @return {!goog.testing.fs.Blob} The blob.
***REMOVED***
goog.testing.fs.getBlob = function(var_args) {
  return new goog.testing.fs.Blob(goog.array.map(arguments, String).join(''));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the string value of a fake blob.
***REMOVED***
***REMOVED*** @param {!goog.testing.fs.Blob} blob The blob to convert to a string.
***REMOVED*** @param {string=} opt_encoding Ignored.
***REMOVED*** @return {!goog.async.Deferred} The deferred string value of the blob.
***REMOVED***
goog.testing.fs.blobToString = function(blob, opt_encoding) {
  var d = new goog.async.Deferred();
  goog.Timer.callOnce(goog.bind(d.callback, d, blob.toString()));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Installs goog.testing.fs in place of the standard goog.fs. After calling
***REMOVED*** this, code that uses goog.fs should work without issue using goog.testing.fs.
***REMOVED***
***REMOVED*** @param {!goog.testing.PropertyReplacer} stubs The property replacer for
***REMOVED***     stubbing out the original goog.fs functions.
***REMOVED***
goog.testing.fs.install = function(stubs) {
  // Prevent warnings that goog.fs may get optimized away. It's true this is
  // unsafe in compiled code, but it's only meant for tests.
  var fs = goog.getObjectByName('goog.fs');
  stubs.replace(fs, 'getTemporary', goog.testing.fs.getTemporary);
  stubs.replace(fs, 'getPersistent', goog.testing.fs.getPersistent);
  stubs.replace(fs, 'createObjectUrl', goog.testing.fs.createObjectUrl);
  stubs.replace(fs, 'revokeObjectUrl', goog.testing.fs.revokeObjectUrl);
  stubs.replace(fs, 'getBlob', goog.testing.fs.getBlob);
  stubs.replace(fs, 'blobToString', goog.testing.fs.blobToString);
***REMOVED***
