// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview This class provides a builder for building multipart form data
***REMOVED*** that is to be usef with Gears BlobBuilder and GearsHttpRequest.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***

goog.provide('goog.gears.MultipartFormData');

goog.require('goog.asserts');
goog.require('goog.gears');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Creates a new multipart form data builder.
***REMOVED***
***REMOVED***
goog.gears.MultipartFormData = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The blob builder used to build the blob.
  ***REMOVED*** @type {GearsBlobBuilder}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.blobBuilder_ = goog.gears.getFactory().create('beta.blobbuilder');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The boundary. This should be something that does not occurr in the values.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.boundary_ = '----' + goog.string.getRandomString();
***REMOVED***


***REMOVED***
***REMOVED*** Constant for a carriage return followed by a new line.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.CRLF_ = '\r\n';


***REMOVED***
***REMOVED*** Constant containing two dashes.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.DASHES_ = '--';


***REMOVED***
***REMOVED*** Whether the builder has been closed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.prototype.closed_;


***REMOVED***
***REMOVED*** Whether the builder has any content.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.prototype.hasContent_;


***REMOVED***
***REMOVED*** Adds a Gears file to the multipart.
***REMOVED*** @param {string} name The name of the value.
***REMOVED*** @param {GearsFile} gearsFile The Gears file as returned from openFiles etc.
***REMOVED*** @return {goog.gears.MultipartFormData} The form builder itself.
***REMOVED***
goog.gears.MultipartFormData.prototype.addFile = function(name, gearsFile) {
  return this.addBlob(name, gearsFile.name, gearsFile.blob);
***REMOVED***


***REMOVED***
***REMOVED*** Adds some text to the multipart.
***REMOVED*** @param {string} name The name of the value.
***REMOVED*** @param {*} value The value. This will use toString on the value.
***REMOVED*** @return {goog.gears.MultipartFormData} The form builder itself.
***REMOVED***
goog.gears.MultipartFormData.prototype.addText = function(name, value) {
  this.assertNotClosed_();

  // Also assert that the value does not contain the boundary.
  this.assertNoBoundary_(value);

  this.hasContent_ = true;
  this.blobBuilder_.append(
      goog.gears.MultipartFormData.DASHES_ + this.boundary_ +
      goog.gears.MultipartFormData.CRLF_ +
      'Content-Disposition: form-data; name="' + name + '"' +
      goog.gears.MultipartFormData.CRLF_ +
      // The BlobBuilder uses UTF-8 so ensure that we use that at all times.
      'Content-Type: text/plain; charset=UTF-8' +
      goog.gears.MultipartFormData.CRLF_ +
      goog.gears.MultipartFormData.CRLF_ +
      value +
      goog.gears.MultipartFormData.CRLF_);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a Gears blob as a file to the multipart.
***REMOVED*** @param {string} name The name of the value.
***REMOVED*** @param {string} fileName The name of the file.
***REMOVED*** @param {GearsBlob} blob The blob to add.
***REMOVED*** @return {goog.gears.MultipartFormData} The form builder itself.
***REMOVED***
goog.gears.MultipartFormData.prototype.addBlob = function(name, fileName,
                                                          blob) {
  this.assertNotClosed_();

  this.hasContent_ = true;
  this.blobBuilder_.append(
      goog.gears.MultipartFormData.DASHES_ + this.boundary_ +
      goog.gears.MultipartFormData.CRLF_ +
      'Content-Disposition: form-data; name="' + name + '"' +
      '; filename="' + fileName + '"' +
      goog.gears.MultipartFormData.CRLF_ +
      'Content-Type: application/octet-stream' +
      goog.gears.MultipartFormData.CRLF_ +
      goog.gears.MultipartFormData.CRLF_);
  this.blobBuilder_.append(blob);
  this.blobBuilder_.append(goog.gears.MultipartFormData.CRLF_);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** The content type to set on the GearsHttpRequest.
***REMOVED***
***REMOVED***   var builder = new MultipartFormData;
***REMOVED***   ...
***REMOVED***   ghr.setRequestHeader('Content-Type', builder.getContentType());
***REMOVED***   ghr.send(builder.getAsBlob());
***REMOVED***
***REMOVED*** @return {string} The content type string to be used when posting this with
***REMOVED***   a GearsHttpRequest.
***REMOVED***
goog.gears.MultipartFormData.prototype.getContentType = function() {
  return 'multipart/form-data; boundary=' + this.boundary_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {GearsBlob} The blob to use in the send method of the
***REMOVED***     GearsHttpRequest.
***REMOVED***
goog.gears.MultipartFormData.prototype.getAsBlob = function() {
  if (!this.closed_ && this.hasContent_) {
    this.blobBuilder_.append(
        goog.gears.MultipartFormData.DASHES_ +
        this.boundary_ +
        goog.gears.MultipartFormData.DASHES_ +
        goog.gears.MultipartFormData.CRLF_);
    this.closed_ = true;
  }
  return this.blobBuilder_.getAsBlob();
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that we do not try to add any more data to a closed multipart form
***REMOVED*** builder.
***REMOVED*** @throws {Error} If the multipart form data has already been closed.
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.prototype.assertNotClosed_ = function() {
  goog.asserts.assert(!this.closed_, 'The multipart form builder has been ' +
                      'closed and no more data can be added to it');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the value does not contain the boundary.
***REMOVED*** @param {*} v The value to ensure that the string representation does not
***REMOVED***     contain the boundary token.
***REMOVED*** @throws {Error} If the value contains the boundary.
***REMOVED*** @private
***REMOVED***
goog.gears.MultipartFormData.prototype.assertNoBoundary_ = function(v) {
  goog.asserts.assert(String(v).indexOf(this.boundary_) == -1,
                      'The value cannot contain the boundary');
***REMOVED***
