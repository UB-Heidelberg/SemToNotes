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
***REMOVED*** @fileoverview A message channel between Gears workers. This is meant to work
***REMOVED*** even when the Gears worker has other message listeners. GearsWorkerChannel
***REMOVED*** adds a specific prefix to its messages, and handles messages with that
***REMOVED*** prefix.
***REMOVED***
***REMOVED***


goog.provide('goog.gears.WorkerChannel');

goog.require('goog.Disposable');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
***REMOVED***
goog.require('goog.gears.Worker');
goog.require('goog.gears.Worker.EventType');
goog.require('goog.gears.WorkerEvent');
goog.require('goog.json');
goog.require('goog.messaging.AbstractChannel');



***REMOVED***
***REMOVED*** Creates a message channel for the given Gears worker.
***REMOVED***
***REMOVED*** @param {goog.gears.Worker} worker The Gears worker to communicate with. This
***REMOVED***     should already be initialized.
***REMOVED***
***REMOVED*** @extends {goog.messaging.AbstractChannel}
***REMOVED***
goog.gears.WorkerChannel = function(worker) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Gears worker to communicate with.
  ***REMOVED*** @type {goog.gears.Worker}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.worker_ = worker;

***REMOVED***this.worker_, goog.gears.Worker.EventType.MESSAGE,
                     this.deliver_, false, this);
***REMOVED***
goog.inherits(goog.gears.WorkerChannel, goog.messaging.AbstractChannel);


***REMOVED***
***REMOVED*** The flag added to messages that are sent by a GearsWorkerChannel, and are
***REMOVED*** meant to be handled by one on the other side.
***REMOVED*** @type {string}
***REMOVED***
goog.gears.WorkerChannel.FLAG = '--goog.gears.WorkerChannel';


***REMOVED***
***REMOVED*** The expected origin of the other end of the worker channel, represented as a
***REMOVED*** string of the form SCHEME://DOMAIN[:PORT]. The port may be omitted for
***REMOVED*** standard ports (http port 80, https port 443).
***REMOVED***
***REMOVED*** If this is set, all GearsWorkerChannel messages are validated to come from
***REMOVED*** this origin, and ignored (with a warning) if they don't. Messages that aren't
***REMOVED*** in the GearsWorkerChannel format are not validated.
***REMOVED***
***REMOVED*** If more complex origin validation is required, the checkMessageOrigin method
***REMOVED*** can be overridden.
***REMOVED***
***REMOVED*** @type {?string}
***REMOVED***
goog.gears.WorkerChannel.prototype.peerOrigin;


***REMOVED***
***REMOVED*** Logger for this class.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.gears.WorkerChannel.prototype.logger =
    goog.debug.Logger.getLogger('goog.gears.WorkerChannel');


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.gears.WorkerChannel.prototype.send =
    function(serviceName, payload) {
  var message = {'serviceName': serviceName, 'payload': payload***REMOVED***
  message[goog.gears.WorkerChannel.FLAG] = true;
  this.worker_.sendMessage(message);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.WorkerChannel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.worker_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Delivers a message to the appropriate service handler. If this message isn't
***REMOVED*** a GearsWorkerChannel message, it's ignored and passed on to other handlers.
***REMOVED***
***REMOVED*** @param {goog.gears.WorkerEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.gears.WorkerChannel.prototype.deliver_ = function(e) {
  var messageObject = e.messageObject || {***REMOVED***
  var body = messageObject.body;
  if (!goog.isObject(body) || !body[goog.gears.WorkerChannel.FLAG]) {
    return;
  }

  if (!this.checkMessageOrigin(messageObject.origin)) {
    return;
  }

  if (this.validateMessage_(body)) {
    this.deliver(body['serviceName'], body['payload']);
  }

  e.preventDefault();
  e.stopPropagation();
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the message is invalid in some way.
***REMOVED***
***REMOVED*** @param {Object} body The contents of the message.
***REMOVED*** @return {boolean} True if the message is valid, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.gears.WorkerChannel.prototype.validateMessage_ = function(body) {
  if (!('serviceName' in body)) {
    this.logger.warning('GearsWorkerChannel::deliver_(): ' +
                        'Message object doesn\'t contain service name: ' +
                        goog.debug.deepExpose(body));
    return false;
  }

  if (!('payload' in body)) {
    this.logger.warning('GearsWorkerChannel::deliver_(): ' +
                        'Message object doesn\'t contain payload: ' +
                        goog.debug.deepExpose(body));
    return false;
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the origin for a given message is the expected origin. If it's
***REMOVED*** not, a warning is logged and the message is ignored.
***REMOVED***
***REMOVED*** This checks that the origin matches the peerOrigin property. It can be
***REMOVED*** overridden if more complex origin detection is necessary.
***REMOVED***
***REMOVED*** @param {string} messageOrigin The origin of the message, of the form
***REMOVED***     SCHEME://HOST[:PORT]. The port is omitted for standard ports (http port
***REMOVED***     80, https port 443).
***REMOVED*** @return {boolean} True if the origin is acceptable, false otherwise.
***REMOVED*** @protected
***REMOVED***
goog.gears.WorkerChannel.prototype.checkMessageOrigin = function(
    messageOrigin) {
  if (!this.peerOrigin) {
    return true;
  }

  // Gears doesn't include standard port numbers, but we want to let the user
  // include them, so we'll just edit them out.
  var peerOrigin = this.peerOrigin;
  if (/^http:/.test(peerOrigin)) {
    peerOrigin = peerOrigin.replace(/\:80$/, '');
  } else if (/^https:/.test(peerOrigin)) {
    peerOrigin = peerOrigin.replace(/\:443$/, '');
  }

  if (messageOrigin === peerOrigin) {
    return true;
  }

  this.logger.warning('Message from unexpected origin "' + messageOrigin +
                      '"; expected only messages from origin "' + peerOrigin +
                      '"');
  return false;
***REMOVED***
