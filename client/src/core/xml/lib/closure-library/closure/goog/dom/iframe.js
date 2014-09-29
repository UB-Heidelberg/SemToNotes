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
***REMOVED*** @fileoverview Utilities for creating and working with iframes
***REMOVED*** cross-browser.
***REMOVED*** @author gboyer@google.com (Garry Boyer)
***REMOVED***


goog.provide('goog.dom.iframe');

goog.require('goog.dom');


***REMOVED***
***REMOVED*** Safe source for a blank iframe.
***REMOVED***
***REMOVED*** Intentionally not about:blank, which gives mixed content warnings in IE6
***REMOVED*** over HTTPS.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.dom.iframe.BLANK_SOURCE = 'javascript:""';


***REMOVED***
***REMOVED*** Styles to help ensure an undecorated iframe.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.dom.iframe.STYLES_ = 'border:0;vertical-align:bottom;';


***REMOVED***
***REMOVED*** Creates a completely blank iframe element.
***REMOVED***
***REMOVED*** The iframe will not caused mixed-content warnings for IE6 under HTTPS.
***REMOVED*** The iframe will also have no borders or padding, so that the styled width
***REMOVED*** and height will be the actual width and height of the iframe.
***REMOVED***
***REMOVED*** This function currently only attempts to create a blank iframe.  There
***REMOVED*** are no guarantees to the contents of the iframe or whether it is rendered
***REMOVED*** in quirks mode.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper} domHelper The dom helper to use.
***REMOVED*** @param {string=} opt_styles CSS styles for the iframe.
***REMOVED*** @return {!HTMLIFrameElement} A completely blank iframe.
***REMOVED***
goog.dom.iframe.createBlank = function(domHelper, opt_styles) {
  return***REMOVED*****REMOVED*** @type {!HTMLIFrameElement}***REMOVED*** (domHelper.createDom('iframe', {
    'frameborder': 0,
    // Since iframes are inline elements, we must align to bottom to
    // compensate for the line descent.
    'style': goog.dom.iframe.STYLES_ + (opt_styles || ''),
    'src': goog.dom.iframe.BLANK_SOURCE
  }));
***REMOVED***


***REMOVED***
***REMOVED*** Writes the contents of a blank iframe that has already been inserted
***REMOVED*** into the document.
***REMOVED*** @param {!HTMLIFrameElement} iframe An iframe with no contents, such as
***REMOVED***     one created by goog.dom.iframe.createBlank, but already appended to
***REMOVED***     a parent document.
***REMOVED*** @param {string} content Content to write to the iframe, from doctype to
***REMOVED***     the HTML close tag.
***REMOVED***
goog.dom.iframe.writeContent = function(iframe, content) {
  var doc = goog.dom.getFrameContentDocument(iframe);
  doc.open();
  doc.write(content);
  doc.close();
***REMOVED***


// TODO(gboyer): Provide a higher-level API for the most common use case, so
// that you can just provide a list of stylesheets and some content HTML.
***REMOVED***
***REMOVED*** Creates a same-domain iframe containing preloaded content.
***REMOVED***
***REMOVED*** This is primarily useful for DOM sandboxing.  One use case is to embed
***REMOVED*** a trusted Javascript app with potentially conflicting CSS styles.  The
***REMOVED*** second case is to reduce the cost of layout passes by the browser -- for
***REMOVED*** example, you can perform sandbox sizing of characters in an iframe while
***REMOVED*** manipulating a heavy DOM in the main window.  The iframe and parent frame
***REMOVED*** can access each others' properties and functions without restriction.
***REMOVED***
***REMOVED*** @param {!Element} parentElement The parent element in which to append the
***REMOVED***     iframe.
***REMOVED*** @param {string=} opt_headContents Contents to go into the iframe's head.
***REMOVED*** @param {string=} opt_bodyContents Contents to go into the iframe's body.
***REMOVED*** @param {string=} opt_styles CSS styles for the iframe itself, before adding
***REMOVED***     to the parent element.
***REMOVED*** @param {boolean=} opt_quirks Whether to use quirks mode (false by default).
***REMOVED*** @return {HTMLIFrameElement} An iframe that has the specified contents.
***REMOVED***
goog.dom.iframe.createWithContent = function(
    parentElement, opt_headContents, opt_bodyContents, opt_styles, opt_quirks) {
  var domHelper = goog.dom.getDomHelper(parentElement);
  // Generate the HTML content.
  var contentBuf = [];

  if (!opt_quirks) {
    contentBuf.push('<!DOCTYPE html>');
  }
  contentBuf.push('<html><head>', opt_headContents, '</head><body>',
      opt_bodyContents, '</body></html>');

  var iframe = goog.dom.iframe.createBlank(domHelper, opt_styles);

  // Cannot manipulate iframe content until it is in a document.
  parentElement.appendChild(iframe);
  goog.dom.iframe.writeContent(iframe, contentBuf.join(''));

  return iframe;
***REMOVED***
