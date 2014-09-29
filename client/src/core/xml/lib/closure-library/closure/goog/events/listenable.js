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
***REMOVED*** WARNING(chrishenry): DO NOT USE! SUPPORT NOT FULLY IMPLEMENTED.
***REMOVED***

goog.provide('goog.events.Listenable');
goog.provide('goog.events.ListenableKey');

goog.require('goog.events.EventLike');



***REMOVED***
***REMOVED*** A listenable interface. Also see goog.events.EventTarget.
***REMOVED*** @interface
***REMOVED***
goog.events.Listenable = function() {***REMOVED***


***REMOVED***
***REMOVED*** Whether to use the new listenable interface and mechanism in
***REMOVED*** goog.events and goog.events.EventTarget.
***REMOVED***
***REMOVED*** TODO(user): Remove this once launched and stable.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.Listenable.USE_LISTENABLE_INTERFACE = false;


***REMOVED***
***REMOVED*** An expando property to indicate that an object implements
***REMOVED*** goog.events.Listenable.
***REMOVED***
***REMOVED*** See addImplementation/isImplementedBy.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.events.Listenable.IMPLEMENTED_BY_PROP_ = '__closure_listenable';


***REMOVED***
***REMOVED*** Marks a given class (constructor) as an implementation of
***REMOVED*** Listenable, do that we can query that fact at runtime. The class
***REMOVED*** must have already implemented the interface.
***REMOVED*** @param {!Function} cls The class constructor. The corresponding
***REMOVED***     class must have already implemented the interface.
***REMOVED***
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP_] = true;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Object} obj The object to check.
***REMOVED*** @return {boolean} Whether a given instance implements
***REMOVED***     Listenable. The class/superclass of the instance must call
***REMOVED***     addImplementation.
***REMOVED***
goog.events.Listenable.isImplementedBy = function(obj) {
  return !!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP_]);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener. A listener can only be added once to an
***REMOVED*** object and if it is added again the key for the listener is
***REMOVED*** returned. Note that if the existing listener is a one-off listener
***REMOVED*** (registered via listenOnce), it will no longer be a one-off
***REMOVED*** listener after a call to listen().
***REMOVED***
***REMOVED*** @param {string} type Event type or array of event types.
***REMOVED*** @param {!Function} listener Callback method, or an object
***REMOVED***     with a handleEvent function.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
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
***REMOVED*** @param {string} type Event type or array of event types.
***REMOVED*** @param {!Function} listener Callback method, or an object
***REMOVED***     with a handleEvent function.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED***
goog.events.Listenable.prototype.listenOnce;


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen() or listenOnce().
***REMOVED***
***REMOVED*** Implementation needs to call goog.events.cleanUp.
***REMOVED***
***REMOVED*** @param {string} type Event type or array of event types.
***REMOVED*** @param {!Function} listener Callback method, or an object
***REMOVED***     with a handleEvent function. TODO(user): Consider whether
***REMOVED***     we can remove Object.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED*** @return {boolean} Whether any listener was removed.
***REMOVED***
goog.events.Listenable.prototype.unlisten;


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen() by the key
***REMOVED*** returned by listen().
***REMOVED***
***REMOVED*** Implementation needs to call goog.events.cleanUp.
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
***REMOVED***     if any of the listeners returns false this will also return false.
***REMOVED***
goog.events.Listenable.prototype.dispatchEvent;


***REMOVED***
***REMOVED*** Removes all listeners from this listenable. If type is specified,
***REMOVED*** it will only remove listeners of the particular type. otherwise all
***REMOVED*** registered listeners will be removed.
***REMOVED***
***REMOVED*** Implementation needs to call goog.events.cleanUp for each removed
***REMOVED*** listener.
***REMOVED***
***REMOVED*** @param {string=} opt_type Type of event to remove, default is to
***REMOVED***     remove all types.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED***
goog.events.Listenable.prototype.removeAllListeners;


***REMOVED***
***REMOVED*** Fires all registered listeners in this listenable for the given
***REMOVED*** type and capture mode, passing them the given eventObject. This
***REMOVED*** does not perform actual capture/bubble. Only implementors of the
***REMOVED*** interface should be using this.
***REMOVED***
***REMOVED*** @param {string} type The type of the listeners to fire.
***REMOVED*** @param {boolean} capture The capture mode of the listeners to fire.
***REMOVED*** @param {goog.events.Event} eventObject The event object to fire.
***REMOVED*** @return {boolean} Whether all listeners succeeded without
***REMOVED***     attempting to prevent default behavior. If any listener returns
***REMOVED***     false or called goog.events.Event#preventDefault, this returns
***REMOVED***     false.
***REMOVED***
goog.events.Listenable.prototype.fireListeners;


***REMOVED***
***REMOVED*** Gets all listeners in this listenable for the given type and
***REMOVED*** capture mode.
***REMOVED***
***REMOVED*** @param {string} type The type of the listeners to fire.
***REMOVED*** @param {boolean} capture The capture mode of the listeners to fire.
***REMOVED*** @return {!Array.<goog.events.ListenableKey>} An array of registered
***REMOVED***     listeners.
***REMOVED***
goog.events.Listenable.prototype.getListeners;


***REMOVED***
***REMOVED*** Gets the goog.events.ListenableKey for the event or null if no such
***REMOVED*** listener is in use.
***REMOVED***
***REMOVED*** @param {string} type The name of the event without the 'on' prefix.
***REMOVED*** @param {!Function} listener The listener function to get.
***REMOVED*** @param {boolean=} capture Whether the listener is a capturing listener.
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} the found listener or null if not found.
***REMOVED***
goog.events.Listenable.prototype.getListener;



***REMOVED***
***REMOVED*** Whether there is any active listeners matching the specified
***REMOVED*** signature. If either the type or capture parameters are
***REMOVED*** unspecified, the function will match on the remaining criteria.
***REMOVED***
***REMOVED*** @param {string=} opt_type Event type.
***REMOVED*** @param {boolean=} opt_capture Whether to check for capture or bubble
***REMOVED***     listeners.
***REMOVED*** @return {boolean} Whether there is any active listeners matching
***REMOVED***     the requested type and/or capture phase.
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
***REMOVED*** TODO(user): Narrow the type if possible.
***REMOVED*** @type {Function|Object}
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
