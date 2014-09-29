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
***REMOVED*** @fileoverview This file implements a wrapper around the Gears WorkerPool
***REMOVED*** with some extra features.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***

goog.provide('goog.gears.WorkerPool');
goog.provide('goog.gears.WorkerPool.Event');
goog.provide('goog.gears.WorkerPool.EventType');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.gears');
goog.require('goog.gears.Worker');



***REMOVED***
***REMOVED*** This class implements a wrapper around the Gears Worker Pool.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.gears.WorkerPool = function() {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map from thread id to worker object
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.workers_ = {***REMOVED***

  // If we are in a worker thread we get the global google.gears.workerPool,
  // otherwise we create a new Gears WorkerPool using the factory
  var workerPool =***REMOVED*****REMOVED*** @type {GearsWorkerPool}***REMOVED***
      (goog.getObjectByName('google.gears.workerPool'));
  if (workerPool) {
    this.workerPool_ = workerPool;
  } else {
    // use a protected method to let the sub class override
    this.workerPool_ = this.getGearsWorkerPool();
  }

  this.workerPool_.onmessage = goog.bind(this.handleMessage_, this);
***REMOVED***
goog.inherits(goog.gears.WorkerPool, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum for event types fired by the WorkerPool.
***REMOVED*** @enum {string}
***REMOVED***
goog.gears.WorkerPool.EventType = {
  UNKNOWN_WORKER: 'uknown_worker'
***REMOVED***


***REMOVED***
***REMOVED*** The Gears WorkerPool object.
***REMOVED*** @type {GearsWorkerPool}
***REMOVED*** @private
***REMOVED***
goog.gears.WorkerPool.prototype.workerPool_ = null;


***REMOVED***
***REMOVED*** @return {GearsWorkerPool} A Gears WorkerPool object.
***REMOVED*** @protected
***REMOVED***
goog.gears.WorkerPool.prototype.getGearsWorkerPool = function() {
  var factory = goog.gears.getFactory();
  return factory.create('beta.workerpool');
***REMOVED***


***REMOVED***
***REMOVED*** Sets a last-chance error handler for a worker pool.
***REMOVED*** WARNING: This will only succeed from inside a worker thread. In main thread,
***REMOVED*** use window.onerror handler.
***REMOVED*** @param {function(!GearsErrorObject):boolean} fn An error handler function
***REMOVED***     that gets passed an error object with message and line number attributes.
***REMOVED***     Returns whether the error was handled. If true stops propagation.
***REMOVED*** @param {Object=} opt_handler This object for the function.
***REMOVED***
goog.gears.WorkerPool.prototype.setErrorHandler = function(fn, opt_handler) {
  this.workerPool_.onerror = goog.bind(fn, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new worker.
***REMOVED*** @param {string} code  The code to execute inside the worker.
***REMOVED*** @return {goog.gears.Worker} The worker that was just created.
***REMOVED***
goog.gears.WorkerPool.prototype.createWorker = function(code) {
  var workerId = this.workerPool_.createWorker(code);
  var worker = new goog.gears.Worker(this, workerId);
  this.registerWorker(worker);
  return worker;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new worker from a URL.
***REMOVED*** @param {string} url  URL from which to get the code to execute inside the
***REMOVED***     worker.
***REMOVED*** @return {goog.gears.Worker} The worker that was just created.
***REMOVED***
goog.gears.WorkerPool.prototype.createWorkerFromUrl = function(url) {
  var workerId = this.workerPool_.createWorkerFromUrl(url);
  var worker = new goog.gears.Worker(this, workerId);
  this.registerWorker(worker);
  return worker;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the worker who calls this to be used cross origin.
***REMOVED***
goog.gears.WorkerPool.prototype.allowCrossOrigin = function() {
  this.workerPool_.allowCrossOrigin();
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message to a given worker.
***REMOVED*** @param {*} message The message to send to the worker.
***REMOVED*** @param {goog.gears.Worker} worker The worker to send the message to.
***REMOVED***
goog.gears.WorkerPool.prototype.sendMessage = function(message, worker) {
  this.workerPool_.sendMessage(message, worker.getId());
***REMOVED***


***REMOVED***
***REMOVED*** Callback when this worker recieves a message.
***REMOVED*** @param {string} message  The message that was sent.
***REMOVED*** @param {number} senderId  The ID of the worker that sent the message.
***REMOVED*** @param {GearsMessageObject} messageObject An object containing all
***REMOVED***     information about the message.
***REMOVED*** @private
***REMOVED***
goog.gears.WorkerPool.prototype.handleMessage_ = function(message,
                                                          senderId,
                                                          messageObject) {
  if (!this.isDisposed()) {
    var workers = this.workers_;
    if (!workers[senderId]) {
      // If the worker is unknown, dispatch an event giving users of the class
      // the change to register the worker.
      this.dispatchEvent(new goog.gears.WorkerPool.Event(
          goog.gears.WorkerPool.EventType.UNKNOWN_WORKER,
          senderId,
          messageObject));
    }

    var worker = workers[senderId];
    if (worker) {
      worker.handleMessage(messageObject);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a worker object.
***REMOVED*** @param {goog.gears.Worker} worker  The worker to register.
***REMOVED***
goog.gears.WorkerPool.prototype.registerWorker = function(worker) {
  this.workers_[worker.getId()] = worker;
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters a worker object.
***REMOVED*** @param {goog.gears.Worker} worker  The worker to unregister.
***REMOVED***
goog.gears.WorkerPool.prototype.unregisterWorker = function(worker) {
  delete this.workers_[worker.getId()];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.WorkerPool.prototype.disposeInternal = function() {
  goog.gears.WorkerPool.superClass_.disposeInternal.call(this);
  this.workerPool_ = null;
  delete this.workers_;
***REMOVED***



***REMOVED***
***REMOVED*** Event used when the workerpool recieves a message
***REMOVED*** @param {string} type  The type of event.
***REMOVED*** @param {number} senderId  The id of the sender of the message.
***REMOVED*** @param {GearsMessageObject} messageObject  The message object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.gears.WorkerPool.Event = function(
    type, senderId, messageObject) {
  goog.events.Event.call(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The id of the sender of the message.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.senderId = senderId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The message sent from the worker. This is the same as the
  ***REMOVED*** messageObject.body field and is here for convenience.
  ***REMOVED*** @type {*}
 ***REMOVED*****REMOVED***
  this.message = messageObject.body;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The object containing all information about the message.
  ***REMOVED*** @type {GearsMessageObject}
 ***REMOVED*****REMOVED***
  this.messageObject = messageObject;
***REMOVED***
goog.inherits(goog.gears.WorkerPool.Event, goog.events.Event);
