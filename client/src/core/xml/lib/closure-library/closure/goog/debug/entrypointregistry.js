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
***REMOVED*** @fileoverview A global registry for entry points into a program,
***REMOVED*** so that they can be instrumented. Each module should register their
***REMOVED*** entry points with this registry. Designed to be compiled out
***REMOVED*** if no instrumentation is requested.
***REMOVED***
***REMOVED*** Entry points may be registered before or after a call to
***REMOVED*** goog.debug.entryPointRegistry.monitorAll. If an entry point is registered
***REMOVED*** later, the existing monitor will instrument the new entry point.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.debug.EntryPointMonitor');
goog.provide('goog.debug.entryPointRegistry');

goog.require('goog.asserts');



***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.debug.EntryPointMonitor = function() {***REMOVED***


***REMOVED***
***REMOVED*** Instruments a function.
***REMOVED***
***REMOVED*** @param {!Function} fn A function to instrument.
***REMOVED*** @return {!Function} The instrumented function.
***REMOVED***
goog.debug.EntryPointMonitor.prototype.wrap;


***REMOVED***
***REMOVED*** Try to remove an instrumentation wrapper created by this monitor.
***REMOVED*** If the function passed to unwrap is not a wrapper created by this
***REMOVED*** monitor, then we will do nothing.
***REMOVED***
***REMOVED*** Notice that some wrappers may not be unwrappable. For example, if other
***REMOVED*** monitors have applied their own wrappers, then it will be impossible to
***REMOVED*** unwrap them because their wrappers will have captured our wrapper.
***REMOVED***
***REMOVED*** So it is important that entry points are unwrapped in the reverse
***REMOVED*** order that they were wrapped.
***REMOVED***
***REMOVED*** @param {!Function} fn A function to unwrap.
***REMOVED*** @return {!Function} The unwrapped function, or {@code fn} if it was not
***REMOVED***     a wrapped function created by this monitor.
***REMOVED***
goog.debug.EntryPointMonitor.prototype.unwrap;


***REMOVED***
***REMOVED*** An array of entry point callbacks.
***REMOVED*** @type {!Array.<function(!Function)>}
***REMOVED*** @private
***REMOVED***
goog.debug.entryPointRegistry.refList_ = [];


***REMOVED***
***REMOVED*** Monitors that should wrap all the entry points.
***REMOVED*** @type {!Array.<!goog.debug.EntryPointMonitor>}
***REMOVED*** @private
***REMOVED***
goog.debug.entryPointRegistry.monitors_ = [];


***REMOVED***
***REMOVED*** Whether goog.debug.entryPointRegistry.monitorAll has ever been called.
***REMOVED*** Checking this allows the compiler to optimize out the registrations.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.debug.entryPointRegistry.monitorsMayExist_ = false;


***REMOVED***
***REMOVED*** Register an entry point with this module.
***REMOVED***
***REMOVED*** The entry point will be instrumented when a monitor is passed to
***REMOVED*** goog.debug.entryPointRegistry.monitorAll. If this has already occurred, the
***REMOVED*** entry point is instrumented immediately.
***REMOVED***
***REMOVED*** @param {function(!Function)} callback A callback function which is called
***REMOVED***     with a transforming function to instrument the entry point. The callback
***REMOVED***     is responsible for wrapping the relevant entry point with the
***REMOVED***     transforming function.
***REMOVED***
goog.debug.entryPointRegistry.register = function(callback) {
  // Don't use push(), so that this can be compiled out.
  goog.debug.entryPointRegistry.refList_[
      goog.debug.entryPointRegistry.refList_.length] = callback;
  // If no one calls monitorAll, this can be compiled out.
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_;
    for (var i = 0; i < monitors.length; i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Configures a monitor to wrap all entry points.
***REMOVED***
***REMOVED*** Entry points that have already been registered are immediately wrapped by
***REMOVED*** the monitor. When an entry point is registered in the future, it will also
***REMOVED*** be wrapped by the monitor when it is registered.
***REMOVED***
***REMOVED*** @param {!goog.debug.EntryPointMonitor} monitor An entry point monitor.
***REMOVED***
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
  var transformer = goog.bind(monitor.wrap, monitor);
  for (var i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
***REMOVED***


***REMOVED***
***REMOVED*** Try to unmonitor all the entry points that have already been registered. If
***REMOVED*** an entry point is registered in the future, it will not be wrapped by the
***REMOVED*** monitor when it is registered. Note that this may fail if the entry points
***REMOVED*** have additional wrapping.
***REMOVED***
***REMOVED*** @param {!goog.debug.EntryPointMonitor} monitor The last monitor to wrap
***REMOVED***     the entry points.
***REMOVED*** @throws {Error} If the monitor is not the most recently configured monitor.
***REMOVED***
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1],
      'Only the most recent monitor can be unwrapped.');
  var transformer = goog.bind(monitor.unwrap, monitor);
  for (var i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
***REMOVED***
