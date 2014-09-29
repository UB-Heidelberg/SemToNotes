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
***REMOVED*** @fileoverview This file contains a class to provide a unified mechanism for
***REMOVED*** CLICK and enter KEYDOWN events. This provides better accessibility by
***REMOVED*** providing the given functionality to a keyboard user which is otherwise
***REMOVED*** would be available only via a mouse click.
***REMOVED***
***REMOVED*** If there is an existing CLICK listener or planning to be added as below -
***REMOVED***
***REMOVED*** <code>this.eventHandler_.listen(el, CLICK, this.onClick_);<code>
***REMOVED***
***REMOVED*** it can be replaced with an ACTION listener as follows:
***REMOVED***
***REMOVED*** <code>this.eventHandler_.listen(
***REMOVED***    new goog.events.ActionHandler(el),
***REMOVED***    ACTION,
***REMOVED***    this.onAction_);<code>
***REMOVED***
***REMOVED***

goog.provide('goog.events.ActionEvent');
goog.provide('goog.events.ActionHandler');
goog.provide('goog.events.ActionHandler.EventType');
goog.provide('goog.events.BeforeActionEvent');

***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A wrapper around an element that you want to listen to ACTION events on.
***REMOVED*** @param {Element|Document} element The element or document to listen on.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.ActionHandler = function(element) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** This is the element that we will listen to events on.
  ***REMOVED*** @type {Element|Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

***REMOVED***element, goog.events.ActionHandler.KEY_EVENT_TYPE_,
      this.handleKeyDown_, false, this);
***REMOVED***element, goog.events.EventType.CLICK,
      this.handleClick_, false, this);
***REMOVED***
goog.inherits(goog.events.ActionHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum type for the events fired by the action handler
***REMOVED*** @enum {string}
***REMOVED***
goog.events.ActionHandler.EventType = {
  ACTION: 'action',
  BEFOREACTION: 'beforeaction'
***REMOVED***


***REMOVED***
***REMOVED*** Key event type to listen for.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.events.ActionHandler.KEY_EVENT_TYPE_ = goog.userAgent.GECKO ?
    goog.events.EventType.KEYPRESS :
    goog.events.EventType.KEYDOWN;


***REMOVED***
***REMOVED*** Handles key press events.
***REMOVED*** @param {!goog.events.BrowserEvent} e The key press event.
***REMOVED*** @private
***REMOVED***
goog.events.ActionHandler.prototype.handleKeyDown_ = function(e) {
  if (e.keyCode == goog.events.KeyCodes.ENTER ||
      goog.userAgent.WEBKIT && e.keyCode == goog.events.KeyCodes.MAC_ENTER) {
    this.dispatchEvents_(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse events.
***REMOVED*** @param {!goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.events.ActionHandler.prototype.handleClick_ = function(e) {
  this.dispatchEvents_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches BeforeAction and Action events to the element
***REMOVED*** @param {!goog.events.BrowserEvent} e The event causing dispatches.
***REMOVED*** @private
***REMOVED***
goog.events.ActionHandler.prototype.dispatchEvents_ = function(e) {
  var beforeActionEvent = new goog.events.BeforeActionEvent(e);

  // Allow application specific logic here before the ACTION event.
  // For example, Gmail uses this event to restore keyboard focus
  if (!this.dispatchEvent(beforeActionEvent)) {
    // If the listener swallowed the BEFOREACTION event, don't dispatch the
    // ACTION event.
    return;
  }


  // Wrap up original event and send it off
  var actionEvent = new goog.events.ActionEvent(e);
  try {
    this.dispatchEvent(actionEvent);
  } finally {
    // Stop propagating the event
    e.stopPropagation();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.ActionHandler.prototype.disposeInternal = function() {
  goog.events.ActionHandler.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.element_, goog.events.ActionHandler.KEY_EVENT_TYPE_,
      this.handleKeyDown_, false, this);
  goog.events.unlisten(this.element_, goog.events.EventType.CLICK,
      this.handleClick_, false, this);
  delete this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** This class is used for the goog.events.ActionHandler.EventType.ACTION event.
***REMOVED*** @param {!goog.events.BrowserEvent} browserEvent Browser event object.
***REMOVED***
***REMOVED*** @extends {goog.events.BrowserEvent}
***REMOVED***
goog.events.ActionEvent = function(browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent.getBrowserEvent());
  this.type = goog.events.ActionHandler.EventType.ACTION;
***REMOVED***
goog.inherits(goog.events.ActionEvent, goog.events.BrowserEvent);



***REMOVED***
***REMOVED*** This class is used for the goog.events.ActionHandler.EventType.BEFOREACTION
***REMOVED*** event. BEFOREACTION gives a chance to the application so the keyboard focus
***REMOVED*** can be restored back, if required.
***REMOVED*** @param {!goog.events.BrowserEvent} browserEvent Browser event object.
***REMOVED***
***REMOVED*** @extends {goog.events.BrowserEvent}
***REMOVED***
goog.events.BeforeActionEvent = function(browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent.getBrowserEvent());
  this.type = goog.events.ActionHandler.EventType.BEFOREACTION;
***REMOVED***
goog.inherits(goog.events.BeforeActionEvent, goog.events.BrowserEvent);
