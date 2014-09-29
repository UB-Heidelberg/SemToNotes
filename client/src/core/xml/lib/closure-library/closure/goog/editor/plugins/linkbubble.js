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
***REMOVED*** @fileoverview Base class for bubble plugins.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.plugins.LinkBubble');
goog.provide('goog.editor.plugins.LinkBubble.Action');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.Command');
goog.require('goog.editor.Link');
goog.require('goog.editor.plugins.AbstractBubblePlugin');
goog.require('goog.editor.range');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.editor.messages');
goog.require('goog.uri.utils');
goog.require('goog.window');



***REMOVED***
***REMOVED*** Property bubble plugin for links.
***REMOVED*** @param {...!goog.editor.plugins.LinkBubble.Action} var_args List of
***REMOVED***     extra actions supported by the bubble.
***REMOVED***
***REMOVED*** @extends {goog.editor.plugins.AbstractBubblePlugin}
***REMOVED***
goog.editor.plugins.LinkBubble = function(var_args) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of extra actions supported by the bubble.
  ***REMOVED*** @type {Array.<!goog.editor.plugins.LinkBubble.Action>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.extraActions_ = goog.array.toArray(arguments);

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of spans corresponding to the extra actions.
  ***REMOVED*** @type {Array.<!Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.actionSpans_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of whitelisted URL schemes which are safe to open.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.safeToOpenSchemes_ = ['http', 'https', 'ftp'];
***REMOVED***
goog.inherits(goog.editor.plugins.LinkBubble,
    goog.editor.plugins.AbstractBubblePlugin);


***REMOVED***
***REMOVED*** Element id for the link text.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.LINK_TEXT_ID_ = 'tr_link-text';


***REMOVED***
***REMOVED*** Element id for the test link span.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.TEST_LINK_SPAN_ID_ = 'tr_test-link-span';


***REMOVED***
***REMOVED*** Element id for the test link.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.TEST_LINK_ID_ = 'tr_test-link';


***REMOVED***
***REMOVED*** Element id for the change link span.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.CHANGE_LINK_SPAN_ID_ = 'tr_change-link-span';


***REMOVED***
***REMOVED*** Element id for the link.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.CHANGE_LINK_ID_ = 'tr_change-link';


***REMOVED***
***REMOVED*** Element id for the delete link span.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.DELETE_LINK_SPAN_ID_ = 'tr_delete-link-span';


***REMOVED***
***REMOVED*** Element id for the delete link.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.DELETE_LINK_ID_ = 'tr_delete-link';


***REMOVED***
***REMOVED*** Element id for the link bubble wrapper div.
***REMOVED*** type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.LINK_DIV_ID_ = 'tr_link-div';


***REMOVED***
***REMOVED*** @desc Text label for link that lets the user click it to see where the link
***REMOVED***     this bubble is for point to.
***REMOVED***
var MSG_LINK_BUBBLE_TEST_LINK = goog.getMsg('Go to link: ');


***REMOVED***
***REMOVED*** @desc Label that pops up a dialog to change the link.
***REMOVED***
var MSG_LINK_BUBBLE_CHANGE = goog.getMsg('Change');


***REMOVED***
***REMOVED*** @desc Label that allow the user to remove this link.
***REMOVED***
var MSG_LINK_BUBBLE_REMOVE = goog.getMsg('Remove');


***REMOVED***
***REMOVED*** Whether to stop leaking the page's url via the referrer header when the
***REMOVED*** link text link is clicked.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.stopReferrerLeaks_ = false;


***REMOVED***
***REMOVED*** Whether to block opening links with a non-whitelisted URL scheme.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.blockOpeningUnsafeSchemes_ =
    true;


***REMOVED***
***REMOVED*** Tells the plugin to stop leaking the page's url via the referrer header when
***REMOVED*** the link text link is clicked. When the user clicks on a link, the
***REMOVED*** browser makes a request for the link url, passing the url of the current page
***REMOVED*** in the request headers. If the user wants the current url to be kept secret
***REMOVED*** (e.g. an unpublished document), the owner of the url that was clicked will
***REMOVED*** see the secret url in the request headers, and it will no longer be a secret.
***REMOVED*** Calling this method will not send a referrer header in the request, just as
***REMOVED*** if the user had opened a blank window and typed the url in themselves.
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.stopReferrerLeaks = function() {
  // TODO(user): Right now only 2 plugins have this API to stop
  // referrer leaks. If more plugins need to do this, come up with a way to
  // enable the functionality in all plugins at once. Same thing for
  // setBlockOpeningUnsafeSchemes and associated functionality.
  this.stopReferrerLeaks_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Tells the plugin whether to block URLs with schemes not in the whitelist.
***REMOVED*** If blocking is enabled, this plugin will not linkify the link in the bubble
***REMOVED*** popup.
***REMOVED*** @param {boolean} blockOpeningUnsafeSchemes Whether to block non-whitelisted
***REMOVED***     schemes.
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.setBlockOpeningUnsafeSchemes =
    function(blockOpeningUnsafeSchemes) {
  this.blockOpeningUnsafeSchemes_ = blockOpeningUnsafeSchemes;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a whitelist of allowed URL schemes that are safe to open.
***REMOVED*** Schemes should all be in lowercase. If the plugin is set to block opening
***REMOVED*** unsafe schemes, user-entered URLs will be converted to lowercase and checked
***REMOVED*** against this list. The whitelist has no effect if blocking is not enabled.
***REMOVED*** @param {Array.<string>} schemes String array of URL schemes to allow (http,
***REMOVED***     https, etc.).
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.setSafeToOpenSchemes =
    function(schemes) {
  this.safeToOpenSchemes_ = schemes;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getTrogClassId = function() {
  return 'LinkBubble';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.isSupportedCommand =
    function(command) {
  return command == goog.editor.Command.UPDATE_LINK_BUBBLE;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.execCommandInternal =
    function(command, var_args) {
  if (command == goog.editor.Command.UPDATE_LINK_BUBBLE) {
    this.updateLink_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the href in the link bubble with a new link.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.updateLink_ = function() {
  var targetEl = this.getTargetElement();
  this.closeBubble();
  this.createBubble(targetEl);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getBubbleTargetFromSelection =
    function(selectedElement) {
  var bubbleTarget = goog.dom.getAncestorByTagNameAndClass(selectedElement,
      goog.dom.TagName.A);

  if (!bubbleTarget) {
    // See if the selection is touching the right side of a link, and if so,
    // show a bubble for that link.  The check for "touching" is very brittle,
    // and currently only guarantees that it will pop up a bubble at the
    // position the cursor is placed at after the link dialog is closed.
    // NOTE(robbyw): This assumes this method is always called with
    // selected element = range.getContainerElement().  Right now this is true,
    // but attempts to re-use this method for other purposes could cause issues.
    // TODO(robbyw): Refactor this method to also take a range, and use that.
    var range = this.getFieldObject().getRange();
    if (range && range.isCollapsed() && range.getStartOffset() == 0) {
      var startNode = range.getStartNode();
      var previous = startNode.previousSibling;
      if (previous && previous.tagName == goog.dom.TagName.A) {
        bubbleTarget = previous;
      }
    }
  }

  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (bubbleTarget);
***REMOVED***


***REMOVED***
***REMOVED*** Set the optional function for getting the "test" link of a url.
***REMOVED*** @param {function(string) : string} func The function to use.
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.setTestLinkUrlFn = function(func) {
  this.testLinkUrlFn_ = func;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the target element url for the bubble.
***REMOVED*** @return {string} The url href.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getTargetUrl = function() {
  // Get the href-attribute through getAttribute() rather than the href property
  // because Google-Toolbar on Firefox with "Send with Gmail" turned on
  // modifies the href-property of 'mailto:' links but leaves the attribute
  // untouched.
  return this.getTargetElement().getAttribute('href') || '';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getBubbleType = function() {
  return goog.dom.TagName.A;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getBubbleTitle = function() {
  return goog.ui.editor.messages.MSG_LINK_CAPTION;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkBubble.prototype.createBubbleContents = function(
    bubbleContainer) {
  var linkObj = this.getLinkToTextObj_();

  // Create linkTextSpan, show plain text for e-mail address or truncate the
  // text to <= 48 characters so that property bubbles don't grow too wide and
  // create a link if URL.  Only linkify valid links.
  // TODO(robbyw): Repalce this color with a CSS class.
  var color = linkObj.valid ? 'black' : 'red';
  var shouldOpenUrl = this.shouldOpenUrl(linkObj.linkText);
  var linkTextSpan;
  if (goog.editor.Link.isLikelyEmailAddress(linkObj.linkText) ||
      !linkObj.valid || !shouldOpenUrl) {
    linkTextSpan = this.dom_.createDom(goog.dom.TagName.SPAN,
        {
          id: goog.editor.plugins.LinkBubble.LINK_TEXT_ID_,
          style: 'color:' + color
        }, this.dom_.createTextNode(linkObj.linkText));
  } else {
    var testMsgSpan = this.dom_.createDom(goog.dom.TagName.SPAN,
        {id: goog.editor.plugins.LinkBubble.TEST_LINK_SPAN_ID_},
        MSG_LINK_BUBBLE_TEST_LINK);
    linkTextSpan = this.dom_.createDom(goog.dom.TagName.SPAN,
        {
          id: goog.editor.plugins.LinkBubble.LINK_TEXT_ID_,
          style: 'color:' + color
        }, '');
    var linkText = goog.string.truncateMiddle(linkObj.linkText, 48);
    // Actually creates a pseudo-link that can't be right-clicked to open in a
    // new tab, because that would avoid the logic to stop referrer leaks.
    this.createLink(goog.editor.plugins.LinkBubble.TEST_LINK_ID_,
                    this.dom_.createTextNode(linkText).data,
                    this.testLink,
                    linkTextSpan);
  }

  var changeLinkSpan = this.createLinkOption(
      goog.editor.plugins.LinkBubble.CHANGE_LINK_SPAN_ID_);
  this.createLink(goog.editor.plugins.LinkBubble.CHANGE_LINK_ID_,
      MSG_LINK_BUBBLE_CHANGE, this.showLinkDialog_, changeLinkSpan);

  // This function is called multiple times - we have to reset the array.
  this.actionSpans_ = [];
  for (var i = 0; i < this.extraActions_.length; i++) {
    var action = this.extraActions_[i];
    var actionSpan = this.createLinkOption(action.spanId_);
    this.actionSpans_.push(actionSpan);
    this.createLink(action.linkId_, action.message_,
        function() {
          action.actionFn_(this.getTargetUrl());
        },
        actionSpan);
  }

  var removeLinkSpan = this.createLinkOption(
      goog.editor.plugins.LinkBubble.DELETE_LINK_SPAN_ID_);
  this.createLink(goog.editor.plugins.LinkBubble.DELETE_LINK_ID_,
      MSG_LINK_BUBBLE_REMOVE, this.deleteLink_, removeLinkSpan);

  this.onShow();

  var bubbleContents = this.dom_.createDom(goog.dom.TagName.DIV,
      {id: goog.editor.plugins.LinkBubble.LINK_DIV_ID_},
      testMsgSpan || '', linkTextSpan, changeLinkSpan);

  for (i = 0; i < this.actionSpans_.length; i++) {
    bubbleContents.appendChild(this.actionSpans_[i]);
  }
  bubbleContents.appendChild(removeLinkSpan);

  goog.dom.appendChild(bubbleContainer, bubbleContents);
***REMOVED***


***REMOVED***
***REMOVED*** Tests the link by opening it in a new tab/window. Should be used as the
***REMOVED*** click event handler for the test pseudo-link.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.testLink = function() {
  goog.window.open(this.getTestLinkAction_(),
      {
        'target': '_blank',
        'noreferrer': this.stopReferrerLeaks_
      }, this.getFieldObject().getAppWindow());
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the URL should be considered invalid.  This always returns
***REMOVED*** false in the base class, and should be overridden by subclasses that wish
***REMOVED*** to impose validity rules on URLs.
***REMOVED*** @param {string} url The url to check.
***REMOVED*** @return {boolean} Whether the URL should be considered invalid.
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.isInvalidUrl = goog.functions.FALSE;


***REMOVED***
***REMOVED*** Gets the text to display for a link, based on the type of link
***REMOVED*** @return {Object} Returns an object of the form:
***REMOVED***     {linkText: displayTextForLinkTarget, valid: ifTheLinkIsValid}.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getLinkToTextObj_ = function() {
  var isError;
  var targetUrl = this.getTargetUrl();

  if (this.isInvalidUrl(targetUrl)) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Message shown in a link bubble when the link is not a valid url.
   ***REMOVED*****REMOVED***
    var MSG_INVALID_URL_LINK_BUBBLE = goog.getMsg('invalid url');
    targetUrl = MSG_INVALID_URL_LINK_BUBBLE;
    isError = true;
  } else if (goog.editor.Link.isMailto(targetUrl)) {
    targetUrl = targetUrl.substring(7); // 7 == "mailto:".length
  }

  return {linkText: targetUrl, valid: !isError***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Shows the link dialog.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.showLinkDialog_ = function(e) {
  // Needed when this occurs due to an ENTER key event, else the newly created
  // dialog manages to have its OK button pressed, causing it to disappear.
  e.preventDefault();

  this.getFieldObject().execCommand(goog.editor.Command.MODAL_LINK_EDITOR,
      new goog.editor.Link(
         ***REMOVED*****REMOVED*** @type {HTMLAnchorElement}***REMOVED*** (this.getTargetElement()),
          false));
  this.closeBubble();
***REMOVED***


***REMOVED***
***REMOVED*** Deletes the link associated with the bubble
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.deleteLink_ = function() {
  this.getFieldObject().dispatchBeforeChange();

  var link = this.getTargetElement();
  var child = link.lastChild;
  goog.dom.flattenElement(link);
  goog.editor.range.placeCursorNextTo(child, false);

  this.closeBubble();

  this.getFieldObject().dispatchChange();
  this.getFieldObject().focus();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the proper state for the action links.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.onShow = function() {
  var linkDiv = this.dom_.getElement(
      goog.editor.plugins.LinkBubble.LINK_DIV_ID_);
  if (linkDiv) {
    var testLinkSpan = this.dom_.getElement(
        goog.editor.plugins.LinkBubble.TEST_LINK_SPAN_ID_);
    if (testLinkSpan) {
      var url = this.getTargetUrl();
      goog.style.showElement(testLinkSpan, !goog.editor.Link.isMailto(url));
    }

    for (var i = 0; i < this.extraActions_.length; i++) {
      var action = this.extraActions_[i];
      var actionSpan = this.dom_.getElement(action.spanId_);
      if (actionSpan) {
        goog.style.showElement(actionSpan, action.toShowFn_(
            this.getTargetUrl()));
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the url for the bubble test link.  The test link is the link in the
***REMOVED*** bubble the user can click on to make sure the link they entered is correct.
***REMOVED*** @return {string} The url for the bubble link href.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.getTestLinkAction_ = function() {
  var targetUrl = this.getTargetUrl();
  return this.testLinkUrlFn_ ? this.testLinkUrlFn_(targetUrl) : targetUrl;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the plugin should open the given url in a new window.
***REMOVED*** @param {string} url The url to check.
***REMOVED*** @return {boolean} If the plugin should open the given url in a new window.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.shouldOpenUrl = function(url) {
  return !this.blockOpeningUnsafeSchemes_ || this.isSafeSchemeToOpen_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether or not a url has a scheme which is safe to open.
***REMOVED*** Schemes like javascript are unsafe due to the possibility of XSS.
***REMOVED*** @param {string} url A url.
***REMOVED*** @return {boolean} Whether the url has a safe scheme.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkBubble.prototype.isSafeSchemeToOpen_ =
    function(url) {
  var scheme = goog.uri.utils.getScheme(url) || 'http';
  return goog.array.contains(this.safeToOpenSchemes_, scheme.toLowerCase());
***REMOVED***



***REMOVED***
***REMOVED*** Constructor for extra actions that can be added to the link bubble.
***REMOVED*** @param {string} spanId The ID for the span showing the action.
***REMOVED*** @param {string} linkId The ID for the link showing the action.
***REMOVED*** @param {string} message The text for the link showing the action.
***REMOVED*** @param {function(string):boolean} toShowFn Test function to determine whether
***REMOVED***     to show the action for the given URL.
***REMOVED*** @param {function(string):void} actionFn Action function to run when the
***REMOVED***     action is clicked.  Takes the current target URL as a parameter.
***REMOVED***
***REMOVED***
goog.editor.plugins.LinkBubble.Action = function(spanId, linkId, message,
    toShowFn, actionFn) {
  this.spanId_ = spanId;
  this.linkId_ = linkId;
  this.message_ = message;
  this.toShowFn_ = toShowFn;
  this.actionFn_ = actionFn;
***REMOVED***
