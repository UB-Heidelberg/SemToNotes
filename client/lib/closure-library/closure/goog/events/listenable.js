// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An interface for a listenable JavaScript object.
***REMOVED***

goog.provide('goog.events.Listenable');
goog.provide('goog.events.ListenableKey');

***REMOVED*** @suppress {extraRequire}***REMOVED***
goog.require('goog.events.EventId');



***REMOVED***
***REMOVED*** A listenable interface. A listenable is an object with the ability
***REMOVED*** to dispatch/broadcast events to "event listeners" registered via
***REMOVED*** listen/listenOnce.
***REMOVED***
***REMOVED*** The interface allows for an event propagation mechanism similar
***REMOVED*** to one offered by native browser event targets, such as
***REMOVED*** capture/bubble mechanism, stopping propagation, and preventing
***REMOVED*** default actions. Capture/bubble mechanism depends on the ancestor
***REMOVED*** tree constructed via {@code #getParentEventTarget***REMOVED*** this tree
***REMOVED*** must be directed acyclic graph. The meaning of default action(s)
***REMOVED*** in preventDefault is specific to a particular use case.
***REMOVED***
***REMOVED*** Implementations that do not support capture/bubble or can not have
***REMOVED*** a parent listenable can simply not implement any ability to set the
***REMOVED*** parent listenable (and have {@code #getParentEventTarget} return
***REMOVED*** null).
***REMOVED***
***REMOVED*** Implementation of this class can be used with or independently from
***REMOVED*** goog.events.
***REMOVED***
***REMOVED*** Implementation must call {@code #addImplementation(implClass)}.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @see goog.events
***REMOVED*** @see http://www.w3.org/TR/DOM-Level-2-Events/events.html
***REMOVED***
goog.events.Listenable = function() {***REMOVED***


***REMOVED***
***REMOVED*** An expando property to indicate that an object implements
***REMOVED*** goog.events.Listenable.
***REMOVED***
***REMOVED*** See addImplementation/isImplementedBy.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.events.Listenable.IMPLEMENTED_BY_PROP =
    'closure_listenable_' + ((Math.random()***REMOVED*** 1e6) | 0);


***REMOVED***
***REMOVED*** Marks a given class (constructor) as an implementation of
***REMOVED*** Listenable, do that we can query that fact at runtime. The class
***REMOVED*** must have already implemented the interface.
***REMOVED*** @param {!Function} cls The class constructor. The corresponding
***REMOVED***     class must have already implemented the interface.
***REMOVED***
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = true;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Object} obj The object to check.
***REMOVED*** @return {boolean} Whether a given instance implements Listenable. The
***REMOVED***     class/superclass of the instance must call addImplementation.
***REMOVED***
goog.events.Listenable.isImplementedBy = function(obj) {
  return !!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener. A listener can only be added once to an
***REMOVED*** object and if it is added again the key for the listener is
***REMOVED*** returned. Note that if the existing listener is a one-off listener
***REMOVED*** (registered via listenOnce), it will no longer be a one-off
***REMOVED*** listener after a call to listen().
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
***REMOVED***     method.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {SCOPE=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED*** @template SCOPE,EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.listen;


***REMOVED***
***REMOVED*** Adds an event listener that is removed automatically after the
***REMOVED*** listener fired once.
***REMOVED***
***REMOVED*** If an existing listener already exists, listenOnce will do
***REMOVED*** nothing. In particular, if the listener was previously registered
***REMOVED*** via listen(), listenOnce() will not turn the listener into a
***REMOVED*** one-off listener. Similarly, if there is already an existing
***REMOVED*** one-off listener, listenOnce does not modify the listeners (it is
***REMOVED*** still a once listener).
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
***REMOVED***     method.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {SCOPE=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED*** @template SCOPE,EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.listenOnce;


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen() or listenOnce().
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
***REMOVED***     method.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {SCOPE=} opt_listenerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED*** @return {boolean} Whether any listener was removed.
***REMOVED*** @template SCOPE,EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.unlisten;


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen() by the key
***REMOVED*** returned by listen().
***REMOVED***
***REMOVED*** @param {goog.events.ListenableKey} key The key returned by
***REMOVED***     listen() or listenOnce().
***REMOVED*** @return {boolean} Whether any listener was removed.
***REMOVED***
goog.events.Listenable.prototype.unlistenByKey;


***REMOVED***
***REMOVED*** Dispatches an event (or event like object) and calls all listeners
***REMOVED*** listening for events of this type. The type of the event is decided by the
***REMOVED*** type property on the event object.
***REMOVED***
***REMOVED*** If any of the listeners returns false OR calls preventDefault then this
***REMOVED*** function will return false.  If one of the capture listeners calls
***REMOVED*** stopPropagation, then the bubble listeners won't fire.
***REMOVED***
***REMOVED*** @param {goog.events.EventLike} e Event object.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the listeners returns false) this will also return false.
***REMOVED***
goog.events.Listenable.prototype.dispatchEvent;


***REMOVED***
***REMOVED*** Removes all listeners from this listenable. If type is specified,
***REMOVED*** it will only remove listeners of the particular type. otherwise all
***REMOVED*** registered listeners will be removed.
***REMOVED***
***REMOVED*** @param {string=} opt_type Type of event to remove, default is to
***REMOVED***     remove all types.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED***
goog.events.Listenable.prototype.removeAllListeners;


***REMOVED***
***REMOVED*** Returns the parent of this event target to use for capture/bubble
***REMOVED*** mechanism.
***REMOVED***
***REMOVED*** NOTE(user): The name reflects the original implementation of
***REMOVED*** custom event target ({@code goog.events.EventTarget}). We decided
***REMOVED*** that changing the name is not worth it.
***REMOVED***
***REMOVED*** @return {goog.events.Listenable} The parent EventTarget or null if
***REMOVED***     there is no parent.
***REMOVED***
goog.events.Listenable.prototype.getParentEventTarget;


***REMOVED***
***REMOVED*** Fires all registered listeners in this listenable for the given
***REMOVED*** type and capture mode, passing them the given eventObject. This
***REMOVED*** does not perform actual capture/bubble. Only implementors of the
***REMOVED*** interface should be using this.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>} type The type of the
***REMOVED***     listeners to fire.
***REMOVED*** @param {boolean} capture The capture mode of the listeners to fire.
***REMOVED*** @param {EVENTOBJ} eventObject The event object to fire.
***REMOVED*** @return {boolean} Whether all listeners succeeded without
***REMOVED***     attempting to prevent default behavior. If any listener returns
***REMOVED***     false or called goog.events.Event#preventDefault, this returns
***REMOVED***     false.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.fireListeners;


***REMOVED***
***REMOVED*** Gets all listeners in this listenable for the given type and
***REMOVED*** capture mode.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId} type The type of the listeners to fire.
***REMOVED*** @param {boolean} capture The capture mode of the listeners to fire.
***REMOVED*** @return {!Array.<goog.events.ListenableKey>} An array of registered
***REMOVED***     listeners.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.getListeners;


***REMOVED***
***REMOVED*** Gets the goog.events.ListenableKey for the event or null if no such
***REMOVED*** listener is in use.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>} type The name of the event
***REMOVED***     without the 'on' prefix.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener The
***REMOVED***     listener function to get.
***REMOVED*** @param {boolean} capture Whether the listener is a capturing listener.
***REMOVED*** @param {SCOPE=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} the found listener or null if not found.
***REMOVED*** @template SCOPE,EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.getListener;


***REMOVED***
***REMOVED*** Whether there is any active listeners matching the specified
***REMOVED*** signature. If either the type or capture parameters are
***REMOVED*** unspecified, the function will match on the remaining criteria.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId.<EVENTOBJ>=} opt_type Event type.
***REMOVED*** @param {boolean=} opt_capture Whether to check for capture or bubble
***REMOVED***     listeners.
***REMOVED*** @return {boolean} Whether there is any active listeners matching
***REMOVED***     the requested type and/or capture phase.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.Listenable.prototype.hasListener;



***REMOVED***
***REMOVED*** An interface that describes a single registered listener.
***REMOVED*** @interface
***REMOVED***
goog.events.ListenableKey = function() {***REMOVED***


***REMOVED***
***REMOVED*** Counter used to create a unique key
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.ListenableKey.counter_ = 0;


***REMOVED***
***REMOVED*** Reserves a key to be used for ListenableKey#key field.
***REMOVED*** @return {number} A number to be used to fill ListenableKey#key
***REMOVED***     field.
***REMOVED***
goog.events.ListenableKey.reserveKey = function() {
  return ++goog.events.ListenableKey.counter_;
***REMOVED***


***REMOVED***
***REMOVED*** The source event target.
***REMOVED*** @type {!(Object|goog.events.Listenable|goog.events.EventTarget)}
***REMOVED***
goog.events.ListenableKey.prototype.src;


***REMOVED***
***REMOVED*** The event type the listener is listening to.
***REMOVED*** @type {string}
***REMOVED***
goog.events.ListenableKey.prototype.type;


***REMOVED***
***REMOVED*** The listener function.
***REMOVED*** @type {function(?):?|{handleEvent:function(?):?}|null}
***REMOVED***
goog.events.ListenableKey.prototype.listener;


***REMOVED***
***REMOVED*** Whether the listener works on capture phase.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.ListenableKey.prototype.capture;


***REMOVED***
***REMOVED*** The 'this' object for the listener function's scope.
***REMOVED*** @type {Object}
***REMOVED***
goog.events.ListenableKey.prototype.handler;


***REMOVED***
***REMOVED*** A globally unique number to identify the key.
***REMOVED*** @type {number}
***REMOVED***
goog.events.ListenableKey.prototype.key;
