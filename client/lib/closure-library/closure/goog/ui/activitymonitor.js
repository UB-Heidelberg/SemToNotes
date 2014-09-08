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
***REMOVED*** @fileoverview Activity Monitor.
***REMOVED***
***REMOVED*** Fires throttled events when a user interacts with the specified document.
***REMOVED*** This class also exposes the amount of time since the last user event.
***REMOVED***
***REMOVED*** If you would prefer to get BECOME_ACTIVE and BECOME_IDLE events when the
***REMOVED*** user changes states, then you should use the IdleTimer class instead.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ActivityMonitor');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***



***REMOVED***
***REMOVED*** Once initialized with a document, the activity monitor can be queried for
***REMOVED*** the current idle time.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper|Array.<goog.dom.DomHelper>=} opt_domHelper
***REMOVED***     DomHelper which contains the document(s) to listen to.  If null, the
***REMOVED***     default document is usedinstead.
***REMOVED*** @param {boolean=} opt_useBubble Whether to use the bubble phase to listen for
***REMOVED***     events. By default listens on the capture phase so that it won't miss
***REMOVED***     events that get stopPropagation/cancelBubble'd. However, this can cause
***REMOVED***     problems in IE8 if the page loads multiple scripts that include the
***REMOVED***     closure event handling code.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.ActivityMonitor = function(opt_domHelper, opt_useBubble) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of documents that are being listened to.
  ***REMOVED*** @type {Array.<Document>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.documents_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to use the bubble phase to listen for events.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.useBubble_ = !!opt_useBubble;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event handler.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.ActivityMonitor>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the current window is an iframe.
  ***REMOVED*** TODO(user): Move to goog.dom.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isIframe_ = window.parent != window;

  if (!opt_domHelper) {
    this.addDocument(goog.dom.getDomHelper().getDocument());
  } else if (goog.isArray(opt_domHelper)) {
    for (var i = 0; i < opt_domHelper.length; i++) {
      this.addDocument(opt_domHelper[i].getDocument());
    }
  } else {
    this.addDocument(opt_domHelper.getDocument());
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time (in milliseconds) of the last user event.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastEventTime_ = goog.now();

***REMOVED***
goog.inherits(goog.ui.ActivityMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The last event type that was detected.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.prototype.lastEventType_ = '';


***REMOVED***
***REMOVED*** The mouse x-position after the last user event.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.prototype.lastMouseX_;


***REMOVED***
***REMOVED*** The mouse y-position after the last user event.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.prototype.lastMouseY_;


***REMOVED***
***REMOVED*** The earliest time that another throttled ACTIVITY event will be dispatched
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.prototype.minEventTime_ = 0;


***REMOVED***
***REMOVED*** Minimum amount of time in ms between throttled ACTIVITY events
***REMOVED*** @type {number}
***REMOVED***
goog.ui.ActivityMonitor.MIN_EVENT_SPACING = 3***REMOVED*** 1000;


***REMOVED***
***REMOVED*** If a user executes one of these events, s/he is considered not idle.
***REMOVED*** @type {Array.<goog.events.EventType>}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.userEventTypesBody_ = [
  goog.events.EventType.CLICK,
  goog.events.EventType.DBLCLICK,
  goog.events.EventType.MOUSEDOWN,
  goog.events.EventType.MOUSEMOVE,
  goog.events.EventType.MOUSEUP
];


***REMOVED***
***REMOVED*** If a user executes one of these events, s/he is considered not idle.
***REMOVED*** Note: monitoring touch events within iframe cause problems in iOS.
***REMOVED*** @type {Array.<goog.events.EventType>}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.userTouchEventTypesBody_ = [
  goog.events.EventType.TOUCHEND,
  goog.events.EventType.TOUCHMOVE,
  goog.events.EventType.TOUCHSTART
];


***REMOVED***
***REMOVED*** If a user executes one of these events, s/he is considered not idle.
***REMOVED*** @type {Array.<goog.events.EventType>}
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.userEventTypesDocuments_ =
    [goog.events.EventType.KEYDOWN, goog.events.EventType.KEYUP];


***REMOVED***
***REMOVED*** Event constants for the activity monitor.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.ActivityMonitor.Event = {
 ***REMOVED*****REMOVED*** Event fired when the user does something interactive***REMOVED***
  ACTIVITY: 'activity'
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ActivityMonitor.prototype.disposeInternal = function() {
  goog.ui.ActivityMonitor.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.eventHandler_ = null;
  delete this.documents_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a document to those being monitored by this class.
***REMOVED***
***REMOVED*** @param {Document} doc Document to monitor.
***REMOVED***
goog.ui.ActivityMonitor.prototype.addDocument = function(doc) {
  if (goog.array.contains(this.documents_, doc)) {
    return;
  }
  this.documents_.push(doc);
  var useCapture = !this.useBubble_;

  var eventsToListenTo = goog.array.concat(
      goog.ui.ActivityMonitor.userEventTypesDocuments_,
      goog.ui.ActivityMonitor.userEventTypesBody_);

  if (!this.isIframe_) {
    // Monitoring touch events in iframe causes problems interacting with text
    // fields in iOS (input text, textarea, contenteditable, select/copy/paste),
    // so just ignore these events. This shouldn't matter much given that a
    // touchstart event followed by touchend event produces a click event,
    // which is being monitored correctly.
    goog.array.extend(eventsToListenTo,
        goog.ui.ActivityMonitor.userTouchEventTypesBody_);
  }

  this.eventHandler_.listen(doc, eventsToListenTo, this.handleEvent_,
      useCapture);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a document from those being monitored by this class.
***REMOVED***
***REMOVED*** @param {Document} doc Document to monitor.
***REMOVED***
goog.ui.ActivityMonitor.prototype.removeDocument = function(doc) {
  if (this.isDisposed()) {
    return;
  }
  goog.array.remove(this.documents_, doc);
  var useCapture = !this.useBubble_;

  var eventsToUnlistenTo = goog.array.concat(
      goog.ui.ActivityMonitor.userEventTypesDocuments_,
      goog.ui.ActivityMonitor.userEventTypesBody_);

  if (!this.isIframe_) {
    // See note above about monitoring touch events in iframe.
    goog.array.extend(eventsToUnlistenTo,
        goog.ui.ActivityMonitor.userTouchEventTypesBody_);
  }

  this.eventHandler_.unlisten(doc, eventsToUnlistenTo, this.handleEvent_,
      useCapture);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the last event time when a user action occurs.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @private
***REMOVED***
goog.ui.ActivityMonitor.prototype.handleEvent_ = function(e) {
  var update = false;
  switch (e.type) {
    case goog.events.EventType.MOUSEMOVE:
      // In FF 1.5, we get spurious mouseover and mouseout events when the UI
      // redraws. We only want to update the idle time if the mouse has moved.
      if (typeof this.lastMouseX_ == 'number' &&
          this.lastMouseX_ != e.clientX ||
          typeof this.lastMouseY_ == 'number' &&
          this.lastMouseY_ != e.clientY) {
        update = true;
      }
      this.lastMouseX_ = e.clientX;
      this.lastMouseY_ = e.clientY;
      break;
    default:
      update = true;
  }

  if (update) {
    var type = goog.asserts.assertString(e.type);
    this.updateIdleTime(goog.now(), type);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the last event time to be the present time, useful for non-DOM
***REMOVED*** events that should update idle time.
***REMOVED***
goog.ui.ActivityMonitor.prototype.resetTimer = function() {
  this.updateIdleTime(goog.now(), 'manual');
***REMOVED***


***REMOVED***
***REMOVED*** Updates the idle time and fires an event if time has elapsed since
***REMOVED*** the last update.
***REMOVED*** @param {number} eventTime Time (in MS) of the event that cleared the idle
***REMOVED***     timer.
***REMOVED*** @param {string} eventType Type of the event, used only for debugging.
***REMOVED*** @protected
***REMOVED***
goog.ui.ActivityMonitor.prototype.updateIdleTime = function(
    eventTime, eventType) {
  // update internal state noting whether the user was idle
  this.lastEventTime_ = eventTime;
  this.lastEventType_ = eventType;

  // dispatch event
  if (eventTime > this.minEventTime_) {
    this.dispatchEvent(goog.ui.ActivityMonitor.Event.ACTIVITY);
    this.minEventTime_ = eventTime + goog.ui.ActivityMonitor.MIN_EVENT_SPACING;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the amount of time the user has been idle.
***REMOVED*** @param {number=} opt_now The current time can optionally be passed in for the
***REMOVED***     computation to avoid an extra Date allocation.
***REMOVED*** @return {number} The amount of time in ms that the user has been idle.
***REMOVED***
goog.ui.ActivityMonitor.prototype.getIdleTime = function(opt_now) {
  var now = opt_now || goog.now();
  return now - this.lastEventTime_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the type of the last user event.
***REMOVED*** @return {string} event type.
***REMOVED***
goog.ui.ActivityMonitor.prototype.getLastEventType = function() {
  return this.lastEventType_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the time of the last event
***REMOVED*** @return {number} last event time.
***REMOVED***
goog.ui.ActivityMonitor.prototype.getLastEventTime = function() {
  return this.lastEventTime_;
***REMOVED***
