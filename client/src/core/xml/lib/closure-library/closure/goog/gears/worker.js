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
***REMOVED*** @fileoverview This represents a Gears worker (background process).
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***

goog.provide('goog.gears.Worker');
goog.provide('goog.gears.Worker.EventType');
goog.provide('goog.gears.WorkerEvent');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** This is an absctraction of workers that can be used with Gears WorkerPool.
***REMOVED***
***REMOVED*** @param {goog.gears.WorkerPool} workerPool  WorkerPool object.
***REMOVED*** @param {number=} opt_id  The id of the worker this represents.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.gears.Worker = function(workerPool, opt_id) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the worker pool.
  ***REMOVED*** @type {goog.gears.WorkerPool}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.workerPool_ = workerPool;

  if (opt_id != null) {
    this.init(opt_id);
  }
***REMOVED***
goog.inherits(goog.gears.Worker, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Called when we receive a message from this worker. The message will
***REMOVED*** first be dispatched as a WorkerEvent with type {@code EventType.MESSAGE} and
***REMOVED*** then a {@code EventType.COMMAND}. An EventTarget may call
***REMOVED*** {@code WorkerEvent.preventDefault()} to stop further dispatches.
***REMOVED*** @param {GearsMessageObject} messageObject An object containing all
***REMOVED***     information about the message.
***REMOVED***
goog.gears.Worker.prototype.handleMessage = function(messageObject) {
  // First dispatch a message event.
  var messageEvent = new goog.gears.WorkerEvent(
      goog.gears.Worker.EventType.MESSAGE,
      messageObject);

  // Allow the user to call prevent default to not process the COMMAND.
  if (this.dispatchEvent(messageEvent)) {
    if (goog.gears.Worker.isCommandLike(messageObject.body)) {
      this.dispatchEvent(new goog.gears.WorkerEvent(
          goog.gears.Worker.EventType.COMMAND,
          messageObject));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** The ID of the worker we are communicating with.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.gears.Worker.prototype.id_ = null;


***REMOVED***
***REMOVED*** Initializes the worker object with a worker id.
***REMOVED*** @param {number} id  The id of the worker this represents.
***REMOVED***
goog.gears.Worker.prototype.init = function(id) {
  if (this.id_ != null) {
    throw Error('Can only set the worker id once');
  }

  this.id_ = id;
  this.workerPool_.registerWorker(this);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a command to the worker.
***REMOVED*** @param {number} commandId  The ID of the command to
***REMOVED***     send.
***REMOVED*** @param {Object} params An object to send as the parameters. This object
***REMOVED***     must be something that Gears can serialize. This includes JSON as well
***REMOVED***     as Gears blobs.
***REMOVED***
goog.gears.Worker.prototype.sendCommand = function(commandId, params) {
  this.sendMessage([commandId, params]);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message to the worker.
***REMOVED*** @param {*} message The message to send to the target worker.
***REMOVED***
goog.gears.Worker.prototype.sendMessage = function(message) {
  this.workerPool_.sendMessage(message, this);
***REMOVED***


***REMOVED***
***REMOVED*** Gets an ID that uniquely identifies this worker. The ID is unique among all
***REMOVED*** worker from the same WorkerPool.
***REMOVED***
***REMOVED*** @return {number} The ID of the worker. This might be null if the
***REMOVED***     worker has not been initialized yet.
***REMOVED***
goog.gears.Worker.prototype.getId = function() {
  if (this.id_ == null) {
    throw Error('The worker has not yet been initialized');
  }
  return this.id_;
***REMOVED***


***REMOVED***
***REMOVED*** Whether an object looks like a command. A command is an array with length 2
***REMOVED*** where the first element is a number.
***REMOVED*** @param {*} obj The object to test.
***REMOVED*** @return {boolean} true if the object looks like a command.
***REMOVED***
goog.gears.Worker.isCommandLike = function(obj) {
  return goog.isArray(obj) && obj.length == 2 &&
      goog.isNumber(***REMOVED*** @type {Array}***REMOVED*** (obj)[0]);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.Worker.prototype.disposeInternal = function() {
  goog.gears.Worker.superClass_.disposeInternal.call(this);
  this.workerPool_.unregisterWorker(this);
  this.workerPool_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Enum for event types fired by the worker.
***REMOVED*** @enum {string}
***REMOVED***
goog.gears.Worker.EventType = {
  MESSAGE: 'message',
  COMMAND: 'command'
***REMOVED***



***REMOVED***
***REMOVED*** Event used when the worker recieves a message
***REMOVED*** @param {string} type  The type of event.
***REMOVED*** @param {GearsMessageObject} messageObject  The message object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.gears.WorkerEvent = function(type, messageObject) {
  goog.events.Event.call(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The message sent from the worker.
  ***REMOVED*** @type {*}
 ***REMOVED*****REMOVED***
  this.message = messageObject.body;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The JSON object sent from the worker.
  ***REMOVED*** @type {*}
  ***REMOVED*** @deprecated Use message instead.
 ***REMOVED*****REMOVED***
  this.json = this.message;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The object containing all information about the message.
  ***REMOVED*** @type {GearsMessageObject}
 ***REMOVED*****REMOVED***
  this.messageObject = messageObject;
***REMOVED***
goog.inherits(goog.gears.WorkerEvent, goog.events.Event);
