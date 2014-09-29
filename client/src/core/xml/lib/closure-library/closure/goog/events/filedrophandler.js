// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a files drag and drop event detector. It works on
***REMOVED*** HTML5 browsers.
***REMOVED***
***REMOVED*** @see ../demos/filedrophandler.html
***REMOVED***

goog.provide('goog.events.FileDropHandler');
goog.provide('goog.events.FileDropHandler.EventType');

goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***



***REMOVED***
***REMOVED*** A files drag and drop event detector. Gets an {@code element} as parameter
***REMOVED*** and fires {@code goog.events.FileDropHandler.EventType.DROP} event when files
***REMOVED*** are dropped in the {@code element}.
***REMOVED***
***REMOVED*** @param {Element|Document} element The element or document to listen on.
***REMOVED*** @param {boolean=} opt_preventDropOutside Whether to prevent a drop on the
***REMOVED***     area outside the {@code element}. Default false.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.FileDropHandler = function(element, opt_preventDropOutside) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler for drag/drop events.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  var doc = element;
  if (opt_preventDropOutside) {
    doc = goog.dom.getOwnerDocument(element);
  }

  // Add dragenter listener to the owner document of the element.
  this.eventHandler_.listen(doc,
                            goog.events.EventType.DRAGENTER,
                            this.onDocDragEnter_);

  // Add dragover listener to the owner document of the element only if the
  // document is not the element itself.
  if (doc != element) {
    this.eventHandler_.listen(doc,
                              goog.events.EventType.DRAGOVER,
                              this.onDocDragOver_);
  }

  // Add dragover and drop listeners to the element.
  this.eventHandler_.listen(element,
                            goog.events.EventType.DRAGOVER,
                            this.onElemDragOver_);
  this.eventHandler_.listen(element,
                            goog.events.EventType.DROP,
                            this.onElemDrop_);
***REMOVED***
goog.inherits(goog.events.FileDropHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Whether the drag event contains files. It is initialized only in the
***REMOVED*** dragenter event. It is used in all the drag events to prevent default actions
***REMOVED*** only if the drag contains files. Preventing default actions is necessary to
***REMOVED*** go from dragenter to dragover and from dragover to drop. However we do not
***REMOVED*** always want to prevent default actions, e.g. when the user drags text or
***REMOVED*** links on a text area we should not prevent the browser default action that
***REMOVED*** inserts the text in the text area. It is also necessary to stop propagation
***REMOVED*** when handling drag events on the element to prevent them from propagating
***REMOVED*** to the document.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.FileDropHandler.prototype.dndContainsFiles_ = false;


***REMOVED***
***REMOVED*** A logger, used to help us debug the algorithm.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.events.FileDropHandler');


***REMOVED***
***REMOVED*** The types of events fired by this class.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.FileDropHandler.EventType = {
  DROP: goog.events.EventType.DROP
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.FileDropHandler.prototype.disposeInternal = function() {
  goog.events.FileDropHandler.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the DROP event.
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.dispatch_ = function(e) {
  this.logger_.fine('Firing DROP event...');
  var event = new goog.events.BrowserEvent(e.getBrowserEvent());
  event.type = goog.events.FileDropHandler.EventType.DROP;
  this.dispatchEvent(event);
***REMOVED***


***REMOVED***
***REMOVED*** Handles dragenter on the document.
***REMOVED*** @param {goog.events.BrowserEvent} e The dragenter event.
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.onDocDragEnter_ = function(e) {
  this.logger_.finer('"' + e.target.id + '" (' + e.target + ') dispatched: ' +
                     e.type);
  var dt = e.getBrowserEvent().dataTransfer;
  // Check whether the drag event contains files.
  this.dndContainsFiles_ = !!(dt &&
      ((dt.types &&
          (goog.array.contains(dt.types, 'Files') ||
          goog.array.contains(dt.types, 'public.file-url'))) ||
      (dt.files && dt.files.length > 0)));
  // If it does
  if (this.dndContainsFiles_) {
    // Prevent default actions.
    e.preventDefault();
  }
  this.logger_.finer('dndContainsFiles_: ' + this.dndContainsFiles_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles dragging something over the document.
***REMOVED*** @param {goog.events.BrowserEvent} e The dragover event.
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.onDocDragOver_ = function(e) {
  this.logger_.finest('"' + e.target.id + '" (' + e.target + ') dispatched: ' +
                      e.type);
  if (this.dndContainsFiles_) {
    // Prevent default actions.
    e.preventDefault();
    // Disable the drop on the document outside the drop zone.
    var dt = e.getBrowserEvent().dataTransfer;
    dt.dropEffect = 'none';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles dragging something over the element (drop zone).
***REMOVED*** @param {goog.events.BrowserEvent} e The dragover event.
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.onElemDragOver_ = function(e) {
  this.logger_.finest('"' + e.target.id + '" (' + e.target + ') dispatched: ' +
                      e.type);
  if (this.dndContainsFiles_) {
    // Prevent default actions and stop the event from propagating further to
    // the document. Both lines are needed! (See comment above).
    e.preventDefault();
    e.stopPropagation();
    // Allow the drop on the drop zone.
    var dt = e.getBrowserEvent().dataTransfer;
    dt.effectAllowed = 'all';
    dt.dropEffect = 'copy';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles dropping something onto the element (drop zone).
***REMOVED*** @param {goog.events.BrowserEvent} e The drop event.
***REMOVED*** @private
***REMOVED***
goog.events.FileDropHandler.prototype.onElemDrop_ = function(e) {
  this.logger_.finer('"' + e.target.id + '" (' + e.target + ') dispatched: ' +
                     e.type);
  // If the drag and drop event contains files.
  if (this.dndContainsFiles_) {
    // Prevent default actions and stop the event from propagating further to
    // the document. Both lines are needed! (See comment above).
    e.preventDefault();
    e.stopPropagation();
    // Dispatch DROP event.
    this.dispatch_(e);
  }
***REMOVED***
