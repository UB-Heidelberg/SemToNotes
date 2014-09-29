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
***REMOVED*** @fileoverview A component that displays the offline status of an app.
***REMOVED*** Currently, it is used to show an icon with a tootip for the status.
***REMOVED***
***REMOVED*** @see ../demos/offline.html
***REMOVED***

goog.provide('goog.ui.OfflineStatusComponent');
goog.provide('goog.ui.OfflineStatusComponent.StatusClassNames');

goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.gears.StatusType');
goog.require('goog.positioning');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.Overflow');
goog.require('goog.ui.Component');
goog.require('goog.ui.OfflineStatusCard.EventType');
goog.require('goog.ui.Popup');



***REMOVED***
***REMOVED*** An offline status component.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.OfflineStatusComponent = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.OfflineStatusComponent, goog.ui.Component);


***REMOVED***
***REMOVED*** The className's to use for the element of the component for each status type.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.OfflineStatusComponent.StatusClassNames = {
  NOT_INSTALLED: goog.getCssName('goog-offlinestatus-notinstalled'),
  INSTALLED: goog.getCssName('goog-offlinestatus-installed'),
  PAUSED: goog.getCssName('goog-offlinestatus-paused'),
  OFFLINE: goog.getCssName('goog-offlinestatus-offline'),
  ONLINE: goog.getCssName('goog-offlinestatus-online'),
  SYNCING: goog.getCssName('goog-offlinestatus-syncing'),
  ERROR: goog.getCssName('goog-offlinestatus-error')
***REMOVED***


***REMOVED***
***REMOVED*** Whether the component is dirty and requires an upate to its display.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.dirty_ = false;


***REMOVED***
***REMOVED*** The status of the component.
***REMOVED*** @type {goog.gears.StatusType}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.status_ =
    goog.gears.StatusType.NOT_INSTALLED;


***REMOVED***
***REMOVED*** The status of the component that is displayed.
***REMOVED*** @type {goog.gears.StatusType?}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.displayedStatus_ = null;


***REMOVED***
***REMOVED*** The dialog that manages the install flow.
***REMOVED*** @type {goog.ui.OfflineInstallDialog?}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.dialog_ = null;


***REMOVED***
***REMOVED*** The card for displaying the detailed status.
***REMOVED*** @type {goog.ui.OfflineStatusCard?}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.card_ = null;


***REMOVED***
***REMOVED*** The popup for the OfflineStatusCard.
***REMOVED*** @type {goog.ui.Popup?}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.popup_ = null;


***REMOVED***
***REMOVED*** CSS class name for the element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.className_ =
    goog.getCssName('goog-offlinestatus');


***REMOVED***
***REMOVED*** @desc New feature text for the offline acces feature.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_NEW_FEATURE_ =
    goog.getMsg('New! Offline Access');


***REMOVED***
***REMOVED*** @desc Connectivity status of the app indicating the app is paused (user
***REMOVED*** initiated offline).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_STATUS_PAUSED_TITLE_ =
    goog.getMsg('Paused (offline). Click to connect.');


***REMOVED***
***REMOVED*** @desc Connectivity status of the app indicating the app is offline.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_STATUS_OFFLINE_TITLE_ =
    goog.getMsg('Offline. No connection available.');


***REMOVED***
***REMOVED*** @desc Connectivity status of the app indicating the app is online.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_STATUS_ONLINE_TITLE_ =
    goog.getMsg('Online. Click for details.');


***REMOVED***
***REMOVED*** @desc Connectivity status of the app indicating the app is synchronizing with
***REMOVED*** the server.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_STATUS_SYNCING_TITLE_ =
    goog.getMsg('Synchronizing. Click for details.');


***REMOVED***
***REMOVED*** @desc Connectivity status of the app indicating errors have been found.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.MSG_OFFLINE_STATUS_ERROR_TITLE_ =
    goog.getMsg('Errors found. Click for details.');


***REMOVED***
***REMOVED*** Gets the status of the offline component of the app.
***REMOVED*** @return {goog.gears.StatusType} The offline status.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getStatus = function() {
  return this.status_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the status of the offline component of the app.
***REMOVED*** @param {goog.gears.StatusType} status The offline
***REMOVED***     status.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.setStatus = function(status) {
  if (this.isStatusDifferent(status)) {
    this.dirty_ = true;
  }

  this.status_ = status;
  if (this.isInDocument()) {
    this.update();
  }

  // Set the status of the card, if necessary.
  if (this.card_) {
    this.card_.setStatus(status);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given status is different from the currently
***REMOVED*** recorded status.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED*** @return {boolean} Whether the status is different.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.isStatusDifferent = function(status) {
  return this.status_ != status;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the install dialog.
***REMOVED*** @param {goog.ui.OfflineInstallDialog} dialog The dialog.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.setInstallDialog = function(dialog) {
  // If there is a current dialog, remove it.
  if (this.dialog_ && this.indexOfChild(this.dialog_) >= 0) {
    this.removeChild(this.dialog_);
  }
  this.dialog_ = dialog;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the install dialog.
***REMOVED*** @return {goog.ui.OfflineInstallDialog} dialog The dialog.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getInstallDialog = function() {
  return this.dialog_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the status card.
***REMOVED*** @param {goog.ui.OfflineStatusCard} card The card.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.setStatusCard = function(card) {
  // If there is a current card, remove it.
  if (this.card_) {
    this.getHandler().unlisten(this.card_,
        goog.ui.OfflineStatusCard.EventType.DISMISS,
        this.performStatusAction, false, this);
    this.popup_.dispose();
    if (this.indexOfChild(this.card_) >= 0) {
      this.removeChild(this.card_);
    }
    this.popup_ = null;
    this.card_ = null;
  }
  this.card_ = card;
  this.getHandler().listen(this.card_,
      goog.ui.OfflineStatusCard.EventType.DISMISS,
      this.performStatusAction, false, this);
  card.setStatus(this.status_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the status card.
***REMOVED*** @return {goog.ui.OfflineStatusCard} The card.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getStatusCard = function() {
  return this.card_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM representation for the component.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.createDom = function() {
  var anchorProps = {
    'class': this.className_,
    'href': '#'
 ***REMOVED*****REMOVED***
  this.setElementInternal(
      this.getDomHelper().createDom('a', anchorProps));
  this.update();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineStatusComponent.prototype.enterDocument = function() {
  goog.ui.OfflineStatusComponent.superClass_.enterDocument.call(this);

  this.getHandler().listen(
      this.getElement(), goog.events.EventType.CLICK, this.handleClick_);

  if (this.dirty_) {
    this.update();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the display of the component.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.update = function() {
  if (this.getElement()) {
    var status = this.getStatus();
    var messageInfo = this.getMessageInfo(status);

    // Set the title.
    var element = this.getElement();
    element.title = messageInfo.title;

    // Set the appropriate class.
    var previousStatus = this.displayStatus_;
    var previousStatusClassName = this.getStatusClassName_(previousStatus);
    var currentStatusClassName = this.getStatusClassName_(status);
    if (previousStatus &&
        goog.dom.classes.has(element, previousStatusClassName)) {
      goog.dom.classes.swap(
          element, previousStatusClassName, currentStatusClassName);
    } else {
      goog.dom.classes.add(element, currentStatusClassName);
    }

    // Set the current display status
    this.displayStatus_ = status;

    // Set the text.
    if (messageInfo.textIsHtml) {
      element.innerHTML = messageInfo.text;
    } else {
      this.getDomHelper().setTextContent(element, messageInfo.text);
    }

    // Clear the dirty state.
    this.dirty_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the messaging info for the given status.
***REMOVED*** @param {goog.gears.StatusType} status Status to get the message info for.
***REMOVED*** @return {Object} Object that has three properties - text (string),
***REMOVED***     textIsHtml (boolean), and title (string).
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getMessageInfo = function(status) {
  var title = '';
  var text = '&nbsp;&nbsp;&nbsp;';
  var textIsHtml = true;

  switch (status) {
    case goog.gears.StatusType.NOT_INSTALLED:
    case goog.gears.StatusType.INSTALLED:
      text = this.MSG_OFFLINE_NEW_FEATURE_;
      textIsHtml = false;
      break;
    case goog.gears.StatusType.PAUSED:
      title = this.MSG_OFFLINE_STATUS_PAUSED_TITLE_;
      break;
    case goog.gears.StatusType.OFFLINE:
      title = this.MSG_OFFLINE_STATUS_OFFLINE_TITLE_;
      break;
    case goog.gears.StatusType.ONLINE:
      title = this.MSG_OFFLINE_STATUS_ONLINE_TITLE_;
      break;
    case goog.gears.StatusType.SYNCING:
      title = this.MSG_OFFLINE_STATUS_SYNCING_TITLE_;
      break;
    case goog.gears.StatusType.ERROR:
      title = this.MSG_OFFLINE_STATUS_ERROR_TITLE_;
      break;
    default:
      break;
  }

  return {text: text, textIsHtml: textIsHtml, title: title***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Gets the CSS className for the given status.
***REMOVED*** @param {goog.gears.StatusType} status Status to get the className for.
***REMOVED*** @return {string} The className.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getStatusClassName_ = function(
    status) {
  var className = '';
  switch (status) {
    case goog.gears.StatusType.NOT_INSTALLED:
      className =
          goog.ui.OfflineStatusComponent.StatusClassNames.NOT_INSTALLED;
      break;
    case goog.gears.StatusType.INSTALLED:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.INSTALLED;
      break;
    case goog.gears.StatusType.PAUSED:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.PAUSED;
      break;
    case goog.gears.StatusType.OFFLINE:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.OFFLINE;
      break;
    case goog.gears.StatusType.ONLINE:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.ONLINE;
      break;
    case goog.gears.StatusType.SYNCING:
    case goog.gears.StatusType.CAPTURING:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.SYNCING;
      break;
    case goog.gears.StatusType.ERROR:
      className = goog.ui.OfflineStatusComponent.StatusClassNames.ERROR;
      break;
    default:
      break;
  }
  return className;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a click on the component. Opens the applicable install dialog or
***REMOVED*** status card.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED*** @return {boolean|undefined} Always false to prevent the anchor navigation.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.handleClick_ = function(e) {
  this.performAction();
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Performs the action as if the component was clicked.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.performAction = function() {
  var status = this.getStatus();

  if (status == goog.gears.StatusType.NOT_INSTALLED ||
      status == goog.gears.StatusType.INSTALLED) {
    this.performEnableAction();
  } else {
    this.performStatusAction();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs the action to start the flow of enabling the offline feature of
***REMOVED*** the application.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.performEnableAction = function() {
  // If Gears is not installed or if it is installed but not enabled, then
  // show the install dialog.
  var dialog = this.dialog_;
  if (dialog) {
    if (!dialog.isInDocument()) {
      this.addChild(dialog);
      dialog.render(this.getDomHelper().getDocument().body);
    }
    dialog.setVisible(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs the action to show the offline status.
***REMOVED*** @param {goog.events.Event=} opt_evt Event.
***REMOVED*** @param {Element=} opt_element Optional element to anchor the card against.
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.performStatusAction = function(opt_evt,
    opt_element) {
  // Shows the offline status card.
  var card = this.card_;
  if (card) {
    if (!this.popup_) {
      if (!card.getElement()) {
        card.createDom();
      }
      this.insertCardElement(card);
      this.addChild(card);
      var popup = this.getPopupInternal();
      var anchorEl = opt_element || this.getElement();
      var pos = new goog.positioning.AnchoredPosition(
          anchorEl, goog.positioning.Corner.BOTTOM_START,
          goog.positioning.Overflow.ADJUST_X);
      popup.setPosition(pos);
      popup.setElement(card.getElement());
    }
    this.popup_.setVisible(!this.popup_.isOrWasRecentlyVisible());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Inserts the card into the document body.
***REMOVED*** @param {goog.ui.OfflineStatusCard} card The offline status card.
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.insertCardElement = function(card) {
  this.getDomHelper().getDocument().body.appendChild(card.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Popup} A popup object, if none exists a new one is created.
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineStatusComponent.prototype.getPopupInternal = function() {
  if (!this.popup_) {
    this.popup_ = new goog.ui.Popup();
    this.popup_.setMargin(3, 0, 0, 0);
  }
  return this.popup_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineStatusComponent.prototype.disposeInternal = function() {
  goog.ui.OfflineStatusComponent.superClass_.disposeInternal.call(this);

  if (this.dialog_) {
    this.dialog_.dispose();
    this.dialog_ = null;
  }

  if (this.card_) {
    this.card_.dispose();
    this.card_ = null;
  }

  if (this.popup_) {
    this.popup_.dispose();
    this.popup_ = null;
  }
***REMOVED***
