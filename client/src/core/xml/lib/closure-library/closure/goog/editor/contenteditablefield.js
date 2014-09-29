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
***REMOVED*** @fileoverview Class to encapsulate an editable field that blends into the
***REMOVED*** style of the page and never uses an iframe.  The field's height can be
***REMOVED*** controlled by CSS styles like min-height, max-height, and overflow.  This is
***REMOVED*** a goog.editor.Field, but overrides everything iframe related to use
***REMOVED*** contentEditable divs.  This is essentially a much lighter alternative to
***REMOVED*** goog.editor.SeamlessField, but only works in Firefox 3+, and only works
***REMOVED******REMOVED***well* in Firefox 12+ due to
***REMOVED*** https://bugzilla.mozilla.org/show_bug.cgi?id=669026.
***REMOVED***
***REMOVED*** @author gboyer@google.com (Garrett Boyer)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED***


goog.provide('goog.editor.ContentEditableField');

goog.require('goog.asserts');
goog.require('goog.debug.Logger');
goog.require('goog.editor.Field');



***REMOVED***
***REMOVED*** This class encapsulates an editable field that is just a contentEditable
***REMOVED*** div.
***REMOVED***
***REMOVED*** To see events fired by this object, please see the base class.
***REMOVED***
***REMOVED*** @param {string} id An identifer for the field. This is used to find the
***REMOVED***     field and the element associated with this field.
***REMOVED*** @param {Document=} opt_doc The document that the element with the given
***REMOVED***     id can be found it.
***REMOVED***
***REMOVED*** @extends {goog.editor.Field}
***REMOVED***
goog.editor.ContentEditableField = function(id, opt_doc) {
  goog.editor.Field.call(this, id, opt_doc);
***REMOVED***
goog.inherits(goog.editor.ContentEditableField, goog.editor.Field);


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.editor.ContentEditableField.prototype.logger =
    goog.debug.Logger.getLogger('goog.editor.ContentEditableField');


***REMOVED*** @override***REMOVED***
goog.editor.ContentEditableField.prototype.usesIframe = function() {
  // Never uses an iframe in any browser.
  return false;
***REMOVED***


// Overridden to improve dead code elimination only.
***REMOVED*** @override***REMOVED***
goog.editor.ContentEditableField.prototype.turnOnDesignModeGecko =
    goog.nullFunction;


***REMOVED*** @override***REMOVED***
goog.editor.ContentEditableField.prototype.installStyles = function() {
  goog.asserts.assert(!this.cssStyles, 'ContentEditableField does not support' +
      ' CSS styles; instead just write plain old CSS on the main page.');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.ContentEditableField.prototype.makeEditableInternal = function(
    opt_iframeSrc) {
  var field = this.getOriginalElement();
  if (field) {
    this.setupFieldObject(field);
    // TODO(gboyer): Allow clients/plugins to override with 'plaintext-only'
    // for WebKit.
    field.contentEditable = true;

    this.injectContents(field.innerHTML, field);

    this.handleFieldLoad();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
***REMOVED*** ContentEditableField does not make any changes to the DOM when it is made
***REMOVED*** editable other than setting contentEditable to true.
***REMOVED***
goog.editor.ContentEditableField.prototype.restoreDom =
    goog.nullFunction;
