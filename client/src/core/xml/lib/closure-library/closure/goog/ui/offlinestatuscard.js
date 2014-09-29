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
***REMOVED*** @fileoverview A card that displays the offline status of an app. It contains
***REMOVED*** detailed information such as a progress bar the indicates the status of
***REMOVED*** syncing and allows you to perform actions (such as manually go offline).
***REMOVED***
***REMOVED*** @see ../demos/offline.html
***REMOVED***

goog.provide('goog.ui.OfflineStatusCard');
goog.provide('goog.ui.OfflineStatusCard.EventType');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.gears.StatusType');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ProgressBar');



***REMOVED***
***REMOVED*** A offline status card.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.OfflineStatusCard = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The progress bar for showing the status of syncing.
  ***REMOVED*** @type {goog.ui.ProgressBar}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.progressBar_ = new goog.ui.ProgressBar(opt_domHelper);
  this.addChild(this.progressBar_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of action element uid/action event type pairs.
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.actionMap_ = new goog.structs.Map();
***REMOVED***
goog.inherits(goog.ui.OfflineStatusCard, goog.ui.Component);


***REMOVED***
***REMOVED*** Event types dispatched by the component.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.OfflineStatusCard.EventType = {
 ***REMOVED*****REMOVED*** Dispatched when the user wants the card to be dismissed.***REMOVED***
  DISMISS: 'dismiss'
***REMOVED***


***REMOVED***
***REMOVED*** Whether the component is dirty and requires an upate to its display.
***REMOVED*** @type {boolean}
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineStatusCard.prototype.dirty = false;


***REMOVED***
***REMOVED*** The status of the component.
***REMOVED*** @type {goog.gears.StatusType}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.status_ =
    goog.gears.StatusType.NOT_INSTALLED;


***REMOVED***
***REMOVED*** The element that holds the status message.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.statusEl_ = null;


***REMOVED***
***REMOVED*** The element that, when clicked, performs the appropriate action (such as
***REMOVED*** pausing synchronization).
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.actionEl_ = null;


***REMOVED***
***REMOVED*** The element that displays additional messaging.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.messageEl_ = null;


***REMOVED***
***REMOVED*** The element that holds the progress bar and progress status.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.progressEl_ = null;


***REMOVED***
***REMOVED*** The element that holds the progress status.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.progressStatusEl_ = null;


***REMOVED***
***REMOVED*** The element that holds the close button.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.closeEl_ = null;


***REMOVED***
***REMOVED*** CSS class name for the element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.className_ =
    goog.getCssName('goog-offlinestatuscard');


***REMOVED***
***REMOVED*** CSS class name for the shadow element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.shadowClassName_ =
    goog.getCssName('goog-offlinestatuscard-shadow');


***REMOVED***
***REMOVED*** CSS class name for the content element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.contentClassName_ =
    goog.getCssName('goog-offlinestatuscard-content');


***REMOVED***
***REMOVED*** CSS class name for the status element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.statusClassName_ =
    goog.getCssName('goog-offlinestatuscard-status');


***REMOVED***
***REMOVED*** CSS class name for the action element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.actionClassName_ =
    goog.getCssName('goog-offlinestatuscard-action');


***REMOVED***
***REMOVED*** CSS class name for each action item contained in the action element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.actionItemClassName_ =
    goog.getCssName('goog-offlinestatuscard-action-item');


***REMOVED***
***REMOVED*** CSS class name for the last action item contained in the action element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.lastActionItemClassName_ =
    goog.getCssName('goog-offlinestatuscard-action-item-last');


***REMOVED***
***REMOVED*** CSS class name for the message element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.messageClassName_ =
    goog.getCssName('goog-offlinestatuscard-message');


***REMOVED***
***REMOVED*** CSS class name for the progress bar status element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.progressBarStatusClassName_ =
    goog.getCssName('goog-offlinestatuscard-progressbarstatus');


***REMOVED***
***REMOVED*** CSS class name for the close card element.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.closeCardClassName_ =
    goog.getCssName('goog-offlinestatuscard-closecard');


***REMOVED***
***REMOVED*** Gets the progress bar.
***REMOVED*** @return {goog.ui.ProgressBar} The progress bar.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getProgressBar = function() {
  return this.progressBar_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the status of the offline component of the app.
***REMOVED*** @return {goog.gears.StatusType} The offline status.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getStatus = function() {
  return this.status_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the status of the offline component of the app.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.setStatus = function(status) {
  if (this.status_ != status) {
    this.dirty = true;
  }
  this.status_ = status;
  if (this.isInDocument()) {
    this.update();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM representation for the component.
***REMOVED*** @override
***REMOVED***
goog.ui.OfflineStatusCard.prototype.createDom = function() {
  var dom = this.getDomHelper();
  this.setElementInternal(dom.createDom('div', this.className_,
      dom.createDom('div', this.shadowClassName_,
          dom.createDom('div', this.contentClassName_,
              this.closeEl_ = dom.createDom('div', this.closeCardClassName_),
              this.statusEl_ = dom.createDom('div', this.statusClassName_),
              this.progressEl_ = dom.createDom('div', null,
                  this.progressBarStatusEl_ =
                      dom.createDom('div', this.progressBarStatusClassName_)),
              this.actionEl_ = dom.createDom('div', this.actionClassName_),
              this.messageEl_ = dom.createDom('div',
                  this.messageClassName_)))));

  // Create and append the DOM of the progress bar.
  this.progressBar_.createDom();
  dom.insertSiblingBefore(
      this.progressBar_.getElement(), this.progressBarStatusEl_);

  this.createAdditionalDom();

  this.update();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineStatusCard.prototype.enterDocument = function() {
  goog.ui.OfflineStatusCard.superClass_.enterDocument.call(this);

  // Listen for changes to the progress bar.
  var handler = this.getHandler();
  handler.listen(this.progressBar_, goog.ui.Component.EventType.CHANGE,
      this.handleProgressChange_);

  // Listen for a click on the action element.
  handler.listen(
      this.actionEl_, goog.events.EventType.CLICK, this.handleActionClick_);

  // Listen for the click on the close element.
  handler.listen(this.closeEl_, goog.events.EventType.CLICK, this.closePopup_);

  // Update the component if it is dirty.
  if (this.dirty) {
    this.update();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Allows subclasses to initialize additional DOM structures during createDom.
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineStatusCard.prototype.createAdditionalDom = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Sends an event to OfflineStatusComponent to dismiss the popup.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.closePopup_ = function() {
  this.dispatchEvent(goog.ui.OfflineStatusCard.EventType.DISMISS);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the display of the component.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.update = function() {
  if (this.getElement()) {
    var status = this.getStatus();
    var dom = this.getDomHelper();

    this.configureStatusElement(status);
    this.configureActionLinks(status);
    this.configureProgressElement(status);

    // Configure the message element.
    var message = this.getAdditionalMessage(status);
    var messageEl = this.messageEl_;
    goog.style.showElement(messageEl, message);
    if (message) {
      dom.setTextContent(messageEl, message);
    }

    // Clear the dirty state.
    this.dirty = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set the message to display in the status portion of the card.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.configureStatusElement = function(status) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc Tell the user whether they are online, offline, or syncing to
  ***REMOVED***     Gears.
 ***REMOVED*****REMOVED***
  var MSG_OFFLINE_STATUS = goog.getMsg(
      'Status: {$msg}', {'msg': this.getStatusMessage(status)});
  this.getDomHelper().setTextContent(this.statusEl_, MSG_OFFLINE_STATUS);
***REMOVED***


***REMOVED***
***REMOVED*** Set the action element to show correct action(s) for a particular status.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.configureActionLinks = function(status) {
  // Configure the action element.
  var actions = this.getActions(status);
  goog.dom.removeChildren(this.actionEl_);
  this.actionMap_.clear();

  if (actions) {
    var lastIdx = actions.length - 1;
    for (var i = 0; i <= lastIdx; i++) {
      // Ensure there is no padding to the right of the last action link.
      this.createLinkNode_(actions[i], i == lastIdx ?
          this.lastActionItemClassName_ : this.actionItemClassName_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates an action link element and styles it.
***REMOVED*** @param {Object} action An action object with message and event type.
***REMOVED*** @param {string} className The css class name to style the link with.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.createLinkNode_ = function(
    action, className) {
  var actionEl = this.actionEl_;
  var dom = this.getDomHelper();
  var a = dom.createDom('span', className);
  dom.appendChild(actionEl, a);
  // A text node is needed here in order for links to wrap.
  dom.appendChild(actionEl, dom.createTextNode(' '));
  this.actionMap_.set(goog.getUid(a), action.eventType);
  goog.style.showElement(a, true);
  dom.setTextContent(a, action.message);
***REMOVED***


***REMOVED***
***REMOVED*** Configure the progress bar element.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.configureProgressElement =
    function(status) {
  var showProgress = this.shouldShowProgressBar(status);
  goog.style.showElement(this.progressEl_, showProgress);
  if (showProgress) {
    this.updateProgressStatus();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if we want to display a progress bar.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED*** @return {boolean} Whether we want to display a progress bar.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.shouldShowProgressBar = function(status) {
  return status == goog.gears.StatusType.SYNCING ||
      status == goog.gears.StatusType.CAPTURING;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a CHANGE event of the progress bar. Updates the status.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.handleProgressChange_ = function(e) {
  this.updateProgressStatus();
***REMOVED***


***REMOVED***
***REMOVED*** Handles a CLICK event on the action element. Dispatches the appropriate
***REMOVED*** action event type.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.OfflineStatusCard.prototype.handleActionClick_ = function(e) {
  var actionEventType =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.actionMap_.get(
      goog.getUid(e.target)));
  if (actionEventType) {
    this.dispatchEvent(actionEventType);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the status of the progress bar.
***REMOVED*** @protected
***REMOVED***
goog.ui.OfflineStatusCard.prototype.updateProgressStatus = function() {
  this.getDomHelper().setTextContent(
      this.progressBarStatusEl_, this.getProgressStatusMessage());
***REMOVED***


***REMOVED***
***REMOVED*** Gets the status message for the progress bar.
***REMOVED*** @return {string} The status message for the progress bar.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getProgressStatusMessage = function() {
  var pb = this.progressBar_;
  var percentValue = Math.round((pb.getValue() - pb.getMinimum()) /
                                (pb.getMaximum() - pb.getMinimum())***REMOVED*** 100);
 ***REMOVED*****REMOVED*** @desc The percent complete status of the syncing.***REMOVED***
  var MSG_OFFLINE_PERCENT_COMPLETE = goog.getMsg(
      '{$num}% complete.', {'num': percentValue});
  return MSG_OFFLINE_PERCENT_COMPLETE;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the status message for the given status.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED*** @return {string} The status message.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getStatusMessage = function(status) {
  var message = '';

  switch (status) {
    case goog.gears.StatusType.OFFLINE:
     ***REMOVED*****REMOVED*** @desc Status shown when the app is offline.***REMOVED***
      var MSG_OFFLINE_STATUS_OFFLINE_MESSAGE = goog.getMsg(
          'Offline. No connection available.');
      message = MSG_OFFLINE_STATUS_OFFLINE_MESSAGE;
      break;
    case goog.gears.StatusType.ONLINE:
     ***REMOVED*****REMOVED*** @desc Status shown when the app is online.***REMOVED***
      var MSG_OFFLINE_STATUS_ONLINE_MESSAGE = goog.getMsg('Online');
      message = MSG_OFFLINE_STATUS_ONLINE_MESSAGE;
      break;
    case goog.gears.StatusType.SYNCING:
     ***REMOVED*****REMOVED*** @desc Status shown when the app is synchronizing.***REMOVED***
      var MSG_OFFLINE_STATUS_SYNCING_MESSAGE = goog.getMsg('Synchronizing...');
      message = MSG_OFFLINE_STATUS_SYNCING_MESSAGE;
      break;
    case goog.gears.StatusType.CAPTURING:
     ***REMOVED*****REMOVED*** @desc Status shown when the app is capturing resources.***REMOVED***
      var MSG_OFFLINE_STATUS_CAPTURING_MESSAGE = goog.getMsg(
          'Updating software...');
      message = MSG_OFFLINE_STATUS_CAPTURING_MESSAGE;
      break;
    case goog.gears.StatusType.ERROR:
     ***REMOVED*****REMOVED*** @desc Status shown when an error has occured.***REMOVED***
      var MSG_OFFLINE_STATUS_ERROR_MESSAGE = goog.getMsg(
          'Errors have been found.');
      message = MSG_OFFLINE_STATUS_ERROR_MESSAGE;
      break;
    default:
      break;
  }
  return message;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the action to display for the given status.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED*** @return {Array.<Object>?} An array of action objects to display.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getActions = function(status) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an action object containing a message for the action and event
***REMOVED*** type to dispatch if the action occurs.
***REMOVED*** @param {string} actionMessage The action message.
***REMOVED*** @param {string} actionEventType The action event type.
***REMOVED*** @return {Object} An object containing message and eventType properties.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.createActionObject = function(
    actionMessage, actionEventType) {
  return {message: actionMessage, eventType: actionEventType***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Gets the additional message to display for the given status.
***REMOVED*** @param {goog.gears.StatusType} status The offline status.
***REMOVED*** @return {string} The additional message.
***REMOVED***
goog.ui.OfflineStatusCard.prototype.getAdditionalMessage = function(status) {
  return '';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.OfflineStatusCard.prototype.disposeInternal = function() {
  goog.ui.OfflineStatusCard.superClass_.disposeInternal.call(this);

  this.progressBar_.dispose();
  this.progressBar_ = null;

  this.actionMap_.clear();
  this.actionMap_ = null;

  this.statusEl_ = null;
  this.actionEl_ = null;
  this.messageEl_ = null;
  this.progressEl_ = null;
  this.progressStatusEl_ = null;
***REMOVED***
