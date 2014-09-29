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
***REMOVED*** @fileoverview A plugin for the LinkDialog.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED*** @author marcosalmeida@google.com (Marcos Almeida)
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.editor.plugins.LinkDialogPlugin');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.AbstractDialogPlugin');
goog.require('goog.events.EventHandler');
goog.require('goog.functions');
goog.require('goog.ui.editor.AbstractDialog.EventType');
goog.require('goog.ui.editor.LinkDialog');
goog.require('goog.ui.editor.LinkDialog.EventType');
goog.require('goog.ui.editor.LinkDialog.OkEvent');
goog.require('goog.uri.utils');



***REMOVED***
***REMOVED*** A plugin that opens the link dialog.
***REMOVED***
***REMOVED*** @extends {goog.editor.plugins.AbstractDialogPlugin}
***REMOVED***
goog.editor.plugins.LinkDialogPlugin = function() {
  goog.base(this, goog.editor.Command.MODAL_LINK_EDITOR);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for this object.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);


 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of whitelisted URL schemes which are safe to open.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.safeToOpenSchemes_ = ['http', 'https', 'ftp'];
***REMOVED***
goog.inherits(goog.editor.plugins.LinkDialogPlugin,
    goog.editor.plugins.AbstractDialogPlugin);


***REMOVED***
***REMOVED*** Link object that the dialog is editing.
***REMOVED*** @type {goog.editor.Link}
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.currentLink_;


***REMOVED***
***REMOVED*** Optional warning to show about email addresses.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.emailWarning_;


***REMOVED***
***REMOVED*** Whether to show a checkbox where the user can choose to have the link open in
***REMOVED*** a new window.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.showOpenLinkInNewWindow_ = false;


***REMOVED***
***REMOVED*** Whether the "open link in new window" checkbox should be checked when the
***REMOVED*** dialog is shown, and also whether it was checked last time the dialog was
***REMOVED*** closed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.isOpenLinkInNewWindowChecked_ =
    false;


***REMOVED***
***REMOVED*** Weather to show a checkbox where the user can choose to add 'rel=nofollow'
***REMOVED*** attribute added to the link.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.showRelNoFollow_ = false;


***REMOVED***
***REMOVED*** Whether to stop referrer leaks.  Defaults to false.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.stopReferrerLeaks_ = false;


***REMOVED***
***REMOVED*** Whether to block opening links with a non-whitelisted URL scheme.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.blockOpeningUnsafeSchemes_ =
    true;


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.getTrogClassId =
    goog.functions.constant('LinkDialogPlugin');


***REMOVED***
***REMOVED*** Tells the plugin whether to block URLs with schemes not in the whitelist.
***REMOVED*** If blocking is enabled, this plugin will stop the 'Test Link' popup
***REMOVED*** window from being created. Blocking doesn't affect link creation--if the
***REMOVED*** user clicks the 'OK' button with an unsafe URL, the link will still be
***REMOVED*** created as normal.
***REMOVED*** @param {boolean} blockOpeningUnsafeSchemes Whether to block non-whitelisted
***REMOVED***     schemes.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.setBlockOpeningUnsafeSchemes =
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
goog.editor.plugins.LinkDialogPlugin.prototype.setSafeToOpenSchemes =
    function(schemes) {
  this.safeToOpenSchemes_ = schemes;
***REMOVED***


***REMOVED***
***REMOVED*** Tells the dialog to show a checkbox where the user can choose to have the
***REMOVED*** link open in a new window.
***REMOVED*** @param {boolean} startChecked Whether to check the checkbox the first
***REMOVED***     time the dialog is shown. Subesquent times the checkbox will remember its
***REMOVED***     previous state.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.showOpenLinkInNewWindow =
    function(startChecked) {
  this.showOpenLinkInNewWindow_ = true;
  this.isOpenLinkInNewWindowChecked_ = startChecked;
***REMOVED***


***REMOVED***
***REMOVED*** Tells the dialog to show a checkbox where the user can choose to have
***REMOVED*** 'rel=nofollow' attribute added to the link.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.showRelNoFollow = function() {
  this.showRelNoFollow_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the"open link in new window" checkbox was checked last time
***REMOVED*** the dialog was closed.
***REMOVED*** @return {boolean} Whether the"open link in new window" checkbox was checked
***REMOVED***     last time the dialog was closed.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.
    getOpenLinkInNewWindowCheckedState = function() {
  return this.isOpenLinkInNewWindowChecked_;
***REMOVED***


***REMOVED***
***REMOVED*** Tells the plugin to stop leaking the page's url via the referrer header when
***REMOVED*** the "test this link" link is clicked. When the user clicks on a link, the
***REMOVED*** browser makes a request for the link url, passing the url of the current page
***REMOVED*** in the request headers. If the user wants the current url to be kept secret
***REMOVED*** (e.g. an unpublished document), the owner of the url that was clicked will
***REMOVED*** see the secret url in the request headers, and it will no longer be a secret.
***REMOVED*** Calling this method will not send a referrer header in the request, just as
***REMOVED*** if the user had opened a blank window and typed the url in themselves.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.stopReferrerLeaks = function() {
  this.stopReferrerLeaks_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the warning message to show to users about including email addresses on
***REMOVED*** public web pages.
***REMOVED*** @param {string} emailWarning Warning message to show users about including
***REMOVED***     email addresses on the web.
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.setEmailWarning = function(
    emailWarning) {
  this.emailWarning_ = emailWarning;
***REMOVED***


***REMOVED***
***REMOVED*** Handles execCommand by opening the dialog.
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {*=} opt_arg {@link A goog.editor.Link} object representing the link
***REMOVED***     being edited.
***REMOVED*** @return {*} Always returns true, indicating the dialog was shown.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.execCommandInternal = function(
    command, opt_arg) {
  this.currentLink_ =***REMOVED*****REMOVED*** @type {goog.editor.Link}***REMOVED***(opt_arg);
  return goog.base(this, 'execCommandInternal', command, opt_arg);
***REMOVED***


***REMOVED***
***REMOVED*** Handles when the dialog closes.
***REMOVED*** @param {goog.events.Event} e The AFTER_HIDE event object.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.handleAfterHide = function(e) {
  goog.base(this, 'handleAfterHide', e);
  this.currentLink_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.events.EventHandler} The event handler.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.getEventHandler = function() {
  return this.eventHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.editor.Link} The link being edited.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.getCurrentLink = function() {
  return this.currentLink_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new instance of the dialog and registers for the relevant events.
***REMOVED*** @param {goog.dom.DomHelper} dialogDomHelper The dom helper to be used to
***REMOVED***     create the dialog.
***REMOVED*** @param {*=} opt_link The target link (should be a goog.editor.Link).
***REMOVED*** @return {goog.ui.editor.LinkDialog} The dialog.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.createDialog = function(
    dialogDomHelper, opt_link) {
  var dialog = new goog.ui.editor.LinkDialog(dialogDomHelper,
     ***REMOVED*****REMOVED*** @type {goog.editor.Link}***REMOVED*** (opt_link));
  if (this.emailWarning_) {
    dialog.setEmailWarning(this.emailWarning_);
  }
  if (this.showOpenLinkInNewWindow_) {
    dialog.showOpenLinkInNewWindow(this.isOpenLinkInNewWindowChecked_);
  }
  if (this.showRelNoFollow_) {
    dialog.showRelNoFollow();
  }
  dialog.setStopReferrerLeaks(this.stopReferrerLeaks_);
  this.eventHandler_.
      listen(dialog, goog.ui.editor.AbstractDialog.EventType.OK,
          this.handleOk).
      listen(dialog, goog.ui.editor.AbstractDialog.EventType.CANCEL,
          this.handleCancel_).
      listen(dialog, goog.ui.editor.LinkDialog.EventType.BEFORE_TEST_LINK,
          this.handleBeforeTestLink);
  return dialog;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.eventHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the OK event from the dialog by updating the link in the field.
***REMOVED*** @param {goog.ui.editor.LinkDialog.OkEvent} e OK event object.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.handleOk = function(e) {
  // We're not restoring the original selection, so clear it out.
  this.disposeOriginalSelection();

  this.currentLink_.setTextAndUrl(e.linkText, e.linkUrl);
  if (this.showOpenLinkInNewWindow_) {
    // Save checkbox state for next time.
    this.isOpenLinkInNewWindowChecked_ = e.openInNewWindow;
  }

  var anchor = this.currentLink_.getAnchor();
  this.touchUpAnchorOnOk_(anchor, e);
  var extraAnchors = this.currentLink_.getExtraAnchors();
  for (var i = 0; i < extraAnchors.length; ++i) {
    extraAnchors[i].href = anchor.href;
    this.touchUpAnchorOnOk_(extraAnchors[i], e);
  }

  // Place cursor to the right of the modified link.
  this.currentLink_.placeCursorRightOf();

  this.getFieldObject().focus();

  this.getFieldObject().dispatchSelectionChangeEvent();
  this.getFieldObject().dispatchChange();

  this.eventHandler_.removeAll();
***REMOVED***


***REMOVED***
***REMOVED*** Apply the necessary properties to a link upon Ok being clicked in the dialog.
***REMOVED*** @param {HTMLAnchorElement} anchor The anchor to set properties on.
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.touchUpAnchorOnOk_ =
    function(anchor, e) {
  if (this.showOpenLinkInNewWindow_) {
    if (e.openInNewWindow) {
      anchor.target = '_blank';
    } else {
      if (anchor.target == '_blank') {
        anchor.target = '';
      }
      // If user didn't indicate to open in a new window but the link already
      // had a target other than '_blank', let's leave what they had before.
    }
  }

  if (this.showRelNoFollow_) {
    var alreadyPresent = goog.ui.editor.LinkDialog.hasNoFollow(anchor.rel);
    if (alreadyPresent && !e.noFollow) {
      anchor.rel = goog.ui.editor.LinkDialog.removeNoFollow(anchor.rel);
    } else if (!alreadyPresent && e.noFollow) {
      anchor.rel = anchor.rel ? anchor.rel + ' nofollow' : 'nofollow';
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the CANCEL event from the dialog by clearing the anchor if needed.
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.handleCancel_ = function(e) {
  if (this.currentLink_.isNew()) {
    goog.dom.flattenElement(this.currentLink_.getAnchor());
    var extraAnchors = this.currentLink_.getExtraAnchors();
    for (var i = 0; i < extraAnchors.length; ++i) {
      goog.dom.flattenElement(extraAnchors[i]);
    }
    // Make sure listeners know the anchor was flattened out.
    this.getFieldObject().dispatchChange();
  }

  this.eventHandler_.removeAll();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the BeforeTestLink event fired when the 'test' link is clicked.
***REMOVED*** @param {goog.ui.editor.LinkDialog.BeforeTestLinkEvent} e BeforeTestLink event
***REMOVED***     object.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.handleBeforeTestLink =
    function(e) {
  if (!this.shouldOpenUrl(e.url)) {
   ***REMOVED*****REMOVED*** @desc Message when the user tries to test (preview) a link, but the
    ***REMOVED*** link cannot be tested.***REMOVED***
    var MSG_UNSAFE_LINK = goog.getMsg('This link cannot be tested.');
    alert(MSG_UNSAFE_LINK);
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the plugin should open the given url in a new window.
***REMOVED*** @param {string} url The url to check.
***REMOVED*** @return {boolean} If the plugin should open the given url in a new window.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.shouldOpenUrl = function(url) {
  return !this.blockOpeningUnsafeSchemes_ || this.isSafeSchemeToOpen_(url);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether or not a url has a scheme which is safe to open.
***REMOVED*** Schemes like javascript are unsafe due to the possibility of XSS.
***REMOVED*** @param {string} url A url.
***REMOVED*** @return {boolean} Whether the url has a safe scheme.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LinkDialogPlugin.prototype.isSafeSchemeToOpen_ =
    function(url) {
  var scheme = goog.uri.utils.getScheme(url) || 'http';
  return goog.array.contains(this.safeToOpenSchemes_, scheme.toLowerCase());
***REMOVED***
