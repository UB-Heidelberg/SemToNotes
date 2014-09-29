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
***REMOVED*** @fileoverview A utility class for managing editable links.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.editor.Link');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.Range');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.Command');
goog.require('goog.editor.node');
goog.require('goog.editor.range');
goog.require('goog.string');
goog.require('goog.string.Unicode');
goog.require('goog.uri.utils');
goog.require('goog.uri.utils.ComponentIndex');



***REMOVED***
***REMOVED*** Wrap an editable link.
***REMOVED*** @param {HTMLAnchorElement} anchor The anchor element.
***REMOVED*** @param {boolean} isNew Whether this is a new link.
***REMOVED***
***REMOVED***
goog.editor.Link = function(anchor, isNew) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The link DOM element.
  ***REMOVED*** @type {HTMLAnchorElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.anchor_ = anchor;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether this link represents a link just added to the document.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isNew_ = isNew;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Any extra anchors created by the browser from a selection in the same
  ***REMOVED*** operation that created the primary link
  ***REMOVED*** @type {!Array.<HTMLAnchorElement>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.extraAnchors_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLAnchorElement} The anchor element.
***REMOVED***
goog.editor.Link.prototype.getAnchor = function() {
  return this.anchor_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<HTMLAnchorElement>} The extra anchor elements, if any,
***REMOVED***     created by the browser from a selection.
***REMOVED***
goog.editor.Link.prototype.getExtraAnchors = function() {
  return this.extraAnchors_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The inner text for the anchor.
***REMOVED***
goog.editor.Link.prototype.getCurrentText = function() {
  if (!this.currentText_) {
    this.currentText_ = goog.dom.getRawTextContent(this.getAnchor());
  }
  return this.currentText_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the link is new.
***REMOVED***
goog.editor.Link.prototype.isNew = function() {
  return this.isNew_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the url without affecting the isNew() status of the link.
***REMOVED*** @param {string} url A URL.
***REMOVED***
goog.editor.Link.prototype.initializeUrl = function(url) {
  this.getAnchor().href = url;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the link, leaving its contents in the document.  Note that this
***REMOVED*** object will no longer be usable/useful after this call.
***REMOVED***
goog.editor.Link.prototype.removeLink = function() {
  goog.dom.flattenElement(this.anchor_);
  this.anchor_ = null;
  while (this.extraAnchors_.length) {
    goog.dom.flattenElement(***REMOVED*** @type {Element}***REMOVED***(this.extraAnchors_.pop()));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Change the link.
***REMOVED*** @param {string} newText New text for the link. If the link contains all its
***REMOVED***     text in one descendent, newText will only replace the text in that
***REMOVED***     one node. Otherwise, we'll change the innerHTML of the whole
***REMOVED***     link to newText.
***REMOVED*** @param {string} newUrl A new URL.
***REMOVED***
goog.editor.Link.prototype.setTextAndUrl = function(newText, newUrl) {
  var anchor = this.getAnchor();
  anchor.href = newUrl;

  // If the text did not change, don't update link text.
  var currentText = this.getCurrentText();
  if (newText != currentText) {
    var leaf = goog.editor.node.getLeftMostLeaf(anchor);
    if (leaf.nodeType == goog.dom.NodeType.TEXT) {
      leaf = leaf.parentNode;
    }

    if (goog.dom.getRawTextContent(leaf) != currentText) {
      leaf = anchor;
    }

    goog.dom.removeChildren(leaf);

    var domHelper = goog.dom.getDomHelper(leaf);
    goog.dom.appendChild(leaf, domHelper.createTextNode(newText));

    // The text changed, so force getCurrentText to recompute.
    this.currentText_ = null;
  }

  this.isNew_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Places the cursor to the right of the anchor.
***REMOVED*** Note that this is different from goog.editor.range's placeCursorNextTo
***REMOVED*** in that it specifically handles the placement of a cursor in browsers
***REMOVED*** that trap you in links, by adding a space when necessary and placing the
***REMOVED*** cursor after that space.
***REMOVED***
goog.editor.Link.prototype.placeCursorRightOf = function() {
  var anchor = this.getAnchor();
  // If the browser gets stuck in a link if we place the cursor next to it,
  // we'll place the cursor after a space instead.
  if (goog.editor.BrowserFeature.GETS_STUCK_IN_LINKS) {
    var spaceNode;
    var nextSibling = anchor.nextSibling;

    // Check if there is already a space after the link.  Only handle the
    // simple case - the next node is a text node that starts with a space.
    if (nextSibling &&
        nextSibling.nodeType == goog.dom.NodeType.TEXT &&
        (goog.string.startsWith(nextSibling.data, goog.string.Unicode.NBSP) ||
         goog.string.startsWith(nextSibling.data, ' '))) {
      spaceNode = nextSibling;
    } else {
      // If there isn't an obvious space to use, create one after the link.
      var dh = goog.dom.getDomHelper(anchor);
      spaceNode = dh.createTextNode(goog.string.Unicode.NBSP);
      goog.dom.insertSiblingAfter(spaceNode, anchor);
    }

    // Move the selection after the space.
    var range = goog.dom.Range.createCaret(spaceNode, 1);
    range.select();
  } else {
    goog.editor.range.placeCursorNextTo(anchor, false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the cursor position and link bubble for this link.
***REMOVED*** @param {goog.editor.Field} field The field in which the link is created.
***REMOVED*** @param {string} url The link url.
***REMOVED*** @private
***REMOVED***
goog.editor.Link.prototype.updateLinkDisplay_ = function(field, url) {
  this.initializeUrl(url);
  this.placeCursorRightOf();
  field.execCommand(goog.editor.Command.UPDATE_LINK_BUBBLE);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string?} The modified string for the link if the link
***REMOVED***     text appears to be a valid link. Returns null if this is not
***REMOVED***     a valid link address.
***REMOVED***
goog.editor.Link.prototype.getValidLinkFromText = function() {
  var text = this.getCurrentText();
  if (goog.editor.Link.isLikelyUrl(text)) {
    if (text.search(/:/) < 0) {
      return 'http://' + goog.string.trimLeft(text);
    }
    return text;
  } else if (goog.editor.Link.isLikelyEmailAddress(text)) {
    return 'mailto:' + text;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** After link creation, finish creating the link depending on the type
***REMOVED*** of link being created.
***REMOVED*** @param {goog.editor.Field} field The field where this link is being created.
***REMOVED***
goog.editor.Link.prototype.finishLinkCreation = function(field) {
  var linkFromText = this.getValidLinkFromText();
  if (linkFromText) {
    this.updateLinkDisplay_(field, linkFromText);
  } else {
    field.execCommand(goog.editor.Command.MODAL_LINK_EDITOR, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Initialize a new link.
***REMOVED*** @param {HTMLAnchorElement} anchor The anchor element.
***REMOVED*** @param {string} url The initial URL.
***REMOVED*** @param {string=} opt_target The target.
***REMOVED*** @param {Array.<HTMLAnchorElement>=} opt_extraAnchors Extra anchors created
***REMOVED***     by the browser when parsing a selection.
***REMOVED*** @return {goog.editor.Link} The link.
***REMOVED***
goog.editor.Link.createNewLink = function(anchor, url, opt_target,
    opt_extraAnchors) {
  var link = new goog.editor.Link(anchor, true);
  link.initializeUrl(url);

  if (opt_target) {
    anchor.target = opt_target;
  }
  if (opt_extraAnchors) {
    link.extraAnchors_ = opt_extraAnchors;
  }

  return link;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if str could be a URL, false otherwise
***REMOVED***
***REMOVED*** Ex: TR_Util.isLikelyUrl_("http://www.google.com") == true
***REMOVED***     TR_Util.isLikelyUrl_("www.google.com") == true
***REMOVED***
***REMOVED*** @param {string} str String to check if it looks like a URL.
***REMOVED*** @return {boolean} Whether str could be a URL.
***REMOVED***
goog.editor.Link.isLikelyUrl = function(str) {
  // Whitespace means this isn't a domain.
  if (/\s/.test(str)) {
    return false;
  }

  if (goog.editor.Link.isLikelyEmailAddress(str)) {
    return false;
  }

  // Add a scheme if the url doesn't have one - this helps the parser.
  var addedScheme = false;
  if (!/^[^:\/?#.]+:/.test(str)) {
    str = 'http://' + str;
    addedScheme = true;
  }

  // Parse the domain.
  var parts = goog.uri.utils.split(str);

  // Relax the rules for special schemes.
  var scheme = parts[goog.uri.utils.ComponentIndex.SCHEME];
  if (goog.array.indexOf(['mailto', 'aim'], scheme) != -1) {
    return true;
  }

  // Require domains to contain a '.', unless the domain is fully qualified and
  // forbids domains from containing invalid characters.
  var domain = parts[goog.uri.utils.ComponentIndex.DOMAIN];
  if (!domain || (addedScheme && domain.indexOf('.') == -1) ||
      (/[^\w\d\-\u0100-\uffff.%]/.test(domain))) {
    return false;
  }

  // Require http and ftp paths to start with '/'.
  var path = parts[goog.uri.utils.ComponentIndex.PATH];
  return !path || path.indexOf('/') == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression that matches strings that could be an email address.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.editor.Link.LIKELY_EMAIL_ADDRESS_ = new RegExp(
    '^' +                     // Test from start of string
    '[\\w-]+(\\.[\\w-]+)*' +  // Dot-delimited alphanumerics and dashes (name)
    '\\@' +                   // @
    '([\\w-]+\\.)+' +         // Alphanumerics, dashes and dots (domain)
    '(\\d+|\\w\\w+)$',        // Domain ends in at least one number or 2 letters
    'i');


***REMOVED***
***REMOVED*** Returns true if str could be an email address, false otherwise
***REMOVED***
***REMOVED*** Ex: goog.editor.Link.isLikelyEmailAddress_("some word") == false
***REMOVED***     goog.editor.Link.isLikelyEmailAddress_("foo@foo.com") == true
***REMOVED***
***REMOVED*** @param {string} str String to test for being email address.
***REMOVED*** @return {boolean} Whether "str" looks like an email address.
***REMOVED***
goog.editor.Link.isLikelyEmailAddress = function(str) {
  return goog.editor.Link.LIKELY_EMAIL_ADDRESS_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether or not a url is an email link.
***REMOVED*** @param {string} url A url.
***REMOVED*** @return {boolean} Whether the url is a mailto link.
***REMOVED***
goog.editor.Link.isMailto = function(url) {
  return !!url && goog.string.startsWith(url, 'mailto:');
***REMOVED***
