// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Implements the disposable interface. The dispose method is used
***REMOVED*** to clean up references and resources.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.Disposable');
goog.provide('goog.dispose');

goog.require('goog.disposable.IDisposable');



***REMOVED***
***REMOVED*** Class that provides the basic implementation for disposable objects. If your
***REMOVED*** class holds one or more references to COM objects, DOM nodes, or other
***REMOVED*** disposable objects, it should extend this class or implement the disposable
***REMOVED*** interface (defined in goog.disposable.IDisposable).
***REMOVED***
***REMOVED*** @implements {goog.disposable.IDisposable}
***REMOVED***
goog.Disposable = function() {
  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    this.creationStack = new Error().stack;
    goog.Disposable.instances_[goog.getUid(this)] = this;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @enum {number} Different monitoring modes for Disposable.
***REMOVED***
goog.Disposable.MonitoringMode = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** No monitoring.
 ***REMOVED*****REMOVED***
  OFF: 0,
 ***REMOVED*****REMOVED***
  ***REMOVED*** Creating and disposing the goog.Disposable instances is monitored. All
  ***REMOVED*** disposable objects need to call the {@code goog.Disposable} base
  ***REMOVED*** constructor. The PERMANENT mode must bet switched on before creating any
  ***REMOVED*** goog.Disposable instances.
 ***REMOVED*****REMOVED***
  PERMANENT: 1,
 ***REMOVED*****REMOVED***
  ***REMOVED*** INTERACTIVE mode can be switched on and off on the fly without producing
  ***REMOVED*** errors. It also doesn't warn if the disposable objects don't call the
  ***REMOVED*** {@code goog.Disposable} base constructor.
 ***REMOVED*****REMOVED***
  INTERACTIVE: 2
***REMOVED***


***REMOVED***
***REMOVED*** @define {number} The monitoring mode of the goog.Disposable
***REMOVED***     instances. Default is OFF. Switching on the monitoring is only
***REMOVED***     recommended for debugging because it has a significant impact on
***REMOVED***     performance and memory usage. If switched off, the monitoring code
***REMOVED***     compiles down to 0 bytes.
***REMOVED***
goog.Disposable.MONITORING_MODE = 0;


***REMOVED***
***REMOVED*** Maps the unique ID of every undisposed {@code goog.Disposable} object to
***REMOVED*** the object itself.
***REMOVED*** @type {!Object.<number, !goog.Disposable>}
***REMOVED*** @private
***REMOVED***
goog.Disposable.instances_ = {***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<!goog.Disposable>} All {@code goog.Disposable} objects that
***REMOVED***     haven't been disposed of.
***REMOVED***
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for (var id in goog.Disposable.instances_) {
    if (goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)]);
    }
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the registry of undisposed objects but doesn't dispose of them.
***REMOVED***
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object has been disposed of.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.Disposable.prototype.disposed_ = false;


***REMOVED***
***REMOVED*** Callbacks to invoke when this object is disposed.
***REMOVED*** @type {Array.<!Function>}
***REMOVED*** @private
***REMOVED***
goog.Disposable.prototype.onDisposeCallbacks_;


***REMOVED***
***REMOVED*** If monitoring the goog.Disposable instances is enabled, stores the creation
***REMOVED*** stack trace of the Disposable instance.
***REMOVED*** @type {string}
***REMOVED***
goog.Disposable.prototype.creationStack;


***REMOVED***
***REMOVED*** @return {boolean} Whether the object has been disposed of.
***REMOVED*** @override
***REMOVED***
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the object has been disposed of.
***REMOVED*** @deprecated Use {@link #isDisposed} instead.
***REMOVED***
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;


***REMOVED***
***REMOVED*** Disposes of the object. If the object hasn't already been disposed of, calls
***REMOVED*** {@link #disposeInternal}. Classes that extend {@code goog.Disposable} should
***REMOVED*** override {@link #disposeInternal} in order to delete references to COM
***REMOVED*** objects, DOM nodes, and other disposable objects. Reentrant.
***REMOVED***
***REMOVED*** @return {void} Nothing.
***REMOVED*** @override
***REMOVED***
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    // Set disposed_ to true first, in case during the chain of disposal this
    // gets disposed recursively.
    this.disposed_ = true;
    this.disposeInternal();
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this);
      if (goog.Disposable.MONITORING_MODE ==
          goog.Disposable.MonitoringMode.PERMANENT &&
          !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + ' did not call the goog.Disposable base ' +
            'constructor or was disposed of after a clearUndisposedObjects ' +
            'call');
      }
      delete goog.Disposable.instances_[uid];
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Associates a disposable object with this object so that they will be disposed
***REMOVED*** together.
***REMOVED*** @param {goog.disposable.IDisposable} disposable that will be disposed when
***REMOVED***     this object is disposed.
***REMOVED***
goog.Disposable.prototype.registerDisposable = function(disposable) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));
***REMOVED***


***REMOVED***
***REMOVED*** Invokes a callback function when this object is disposed. Callbacks are
***REMOVED*** invoked in the order in which they were added.
***REMOVED*** @param {function(this:T):?} callback The callback function.
***REMOVED*** @param {T=} opt_scope An optional scope to call the callback in.
***REMOVED*** @template T
***REMOVED***
goog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {
  if (!this.onDisposeCallbacks_) {
    this.onDisposeCallbacks_ = [];
  }
  this.onDisposeCallbacks_.push(goog.bind(callback, opt_scope));
***REMOVED***


***REMOVED***
***REMOVED*** Deletes or nulls out any references to COM objects, DOM nodes, or other
***REMOVED*** disposable objects. Classes that extend {@code goog.Disposable} should
***REMOVED*** override this method.
***REMOVED*** Not reentrant. To avoid calling it twice, it must only be called from the
***REMOVED*** subclass' {@code disposeInternal} method. Everywhere else the public
***REMOVED*** {@code dispose} method must be used.
***REMOVED*** For example:
***REMOVED*** <pre>
***REMOVED***   mypackage.MyClass = function() {
***REMOVED***     goog.base(this);
***REMOVED***     // Constructor logic specific to MyClass.
***REMOVED***     ...
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED***   goog.inherits(mypackage.MyClass, goog.Disposable);
***REMOVED***
***REMOVED***   mypackage.MyClass.prototype.disposeInternal = function() {
***REMOVED***     // Dispose logic specific to MyClass.
***REMOVED***     ...
***REMOVED***     // Call superclass's disposeInternal at the end of the subclass's, like
***REMOVED***     // in C++, to avoid hard-to-catch issues.
***REMOVED***     goog.base(this, 'disposeInternal');
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED*** </pre>
***REMOVED*** @protected
***REMOVED***
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    while (this.onDisposeCallbacks_.length) {
      this.onDisposeCallbacks_.shift()();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns True if we can verify the object is disposed.
***REMOVED*** Calls {@code isDisposed} on the argument if it supports it.  If obj
***REMOVED*** is not an object with an isDisposed() method, return false.
***REMOVED*** @param {*} obj The object to investigate.
***REMOVED*** @return {boolean} True if we can verify the object is disposed.
***REMOVED***
goog.Disposable.isDisposed = function(obj) {
  if (obj && typeof obj.isDisposed == 'function') {
    return obj.isDisposed();
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls {@code dispose} on the argument if it supports it. If obj is not an
***REMOVED***     object with a dispose() method, this is a no-op.
***REMOVED*** @param {*} obj The object to dispose of.
***REMOVED***
goog.dispose = function(obj) {
  if (obj && typeof obj.dispose == 'function') {
    obj.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls {@code dispose} on each member of the list that supports it. (If the
***REMOVED*** member is an ArrayLike, then {@code goog.disposeAll()} will be called
***REMOVED*** recursively on each of its members.) If the member is not an object with a
***REMOVED*** {@code dispose()} method, then it is ignored.
***REMOVED*** @param {...*} var_args The list.
***REMOVED***
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    var disposable = arguments[i];
    if (goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable);
    } else {
      goog.dispose(disposable);
    }
  }
***REMOVED***
