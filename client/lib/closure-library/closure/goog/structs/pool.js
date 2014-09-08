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
***REMOVED*** @fileoverview Datastructure: Pool.
***REMOVED***
***REMOVED***
***REMOVED*** A generic class for handling pools of objects.
***REMOVED*** When an object is released, it is attempted to be reused.
***REMOVED***


goog.provide('goog.structs.Pool');

goog.require('goog.Disposable');
goog.require('goog.structs.Queue');
goog.require('goog.structs.Set');



***REMOVED***
***REMOVED*** A generic pool class. If min is greater than max, an error is thrown.
***REMOVED*** @param {number=} opt_minCount Min. number of objects (Default: 1).
***REMOVED*** @param {number=} opt_maxCount Max. number of objects (Default: 10).
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @template T
***REMOVED***
goog.structs.Pool = function(opt_minCount, opt_maxCount) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Minimum number of objects allowed
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.minCount_ = opt_minCount || 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maximum number of objects allowed
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.maxCount_ = opt_maxCount || 10;

  // Make sure that the max and min constraints are valid.
  if (this.minCount_ > this.maxCount_) {
    throw Error(goog.structs.Pool.ERROR_MIN_MAX_);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Set used to store objects that are currently in the pool and available
  ***REMOVED*** to be used.
  ***REMOVED*** @private {goog.structs.Queue.<T>}
 ***REMOVED*****REMOVED***
  this.freeQueue_ = new goog.structs.Queue();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Set used to store objects that are currently in the pool and in use.
  ***REMOVED*** @private {goog.structs.Set.<T>}
 ***REMOVED*****REMOVED***
  this.inUseSet_ = new goog.structs.Set();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The minimum delay between objects being made available, in milliseconds. If
  ***REMOVED*** this is 0, no minimum delay is enforced.
  ***REMOVED*** @protected {number}
 ***REMOVED*****REMOVED***
  this.delay = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time of the last object being made available, in milliseconds since the
  ***REMOVED*** epoch (i.e., the result of Date#toTime). If this is null, no access has
  ***REMOVED*** occurred yet.
  ***REMOVED*** @protected {number?}
 ***REMOVED*****REMOVED***
  this.lastAccess = null;

  // Make sure that the minCount constraint is satisfied.
  this.adjustForMinMax();


  // TODO(user): Remove once JSCompiler's undefined properties warnings
  // don't error for guarded properties.
  var magicProps = {canBeReused: 0***REMOVED***
***REMOVED***
goog.inherits(goog.structs.Pool, goog.Disposable);


***REMOVED***
***REMOVED*** Error to throw when the max/min constraint is attempted to be invalidated.
***REMOVED*** I.e., when it is attempted for maxCount to be less than minCount.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.structs.Pool.ERROR_MIN_MAX_ =
    '[goog.structs.Pool] Min can not be greater than max';


***REMOVED***
***REMOVED*** Error to throw when the Pool is attempted to be disposed and it is asked to
***REMOVED*** make sure that there are no objects that are in use (i.e., haven't been
***REMOVED*** released).
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.structs.Pool.ERROR_DISPOSE_UNRELEASED_OBJS_ =
    '[goog.structs.Pool] Objects not released';


***REMOVED***
***REMOVED*** Sets the minimum count of the pool.
***REMOVED*** If min is greater than the max count of the pool, an error is thrown.
***REMOVED*** @param {number} min The minimum count of the pool.
***REMOVED***
goog.structs.Pool.prototype.setMinimumCount = function(min) {
  // Check count constraints.
  if (min > this.maxCount_) {
    throw Error(goog.structs.Pool.ERROR_MIN_MAX_);
  }
  this.minCount_ = min;

  // Adjust the objects in the pool as needed.
  this.adjustForMinMax();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum count of the pool.
***REMOVED*** If max is less than the max count of the pool, an error is thrown.
***REMOVED*** @param {number} max The maximum count of the pool.
***REMOVED***
goog.structs.Pool.prototype.setMaximumCount = function(max) {
  // Check count constraints.
  if (max < this.minCount_) {
    throw Error(goog.structs.Pool.ERROR_MIN_MAX_);
  }
  this.maxCount_ = max;

  // Adjust the objects in the pool as needed.
  this.adjustForMinMax();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum delay between objects being returned by getObject, in
***REMOVED*** milliseconds. This defaults to zero, meaning that no minimum delay is
***REMOVED*** enforced and objects may be used as soon as they're available.
***REMOVED*** @param {number} delay The minimum delay, in milliseconds.
***REMOVED***
goog.structs.Pool.prototype.setDelay = function(delay) {
  this.delay = delay;
***REMOVED***


***REMOVED***
***REMOVED*** @return {T|undefined} A new object from the pool if there is one available,
***REMOVED***     otherwise undefined.
***REMOVED***
goog.structs.Pool.prototype.getObject = function() {
  var time = goog.now();
  if (goog.isDefAndNotNull(this.lastAccess) &&
      time - this.lastAccess < this.delay) {
    return undefined;
  }

  var obj = this.removeFreeObject_();
  if (obj) {
    this.lastAccess = time;
    this.inUseSet_.add(obj);
  }

  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an object to the pool of available objects so that it can be reused.
***REMOVED*** @param {T} obj The object to return to the pool of free objects.
***REMOVED*** @return {boolean} Whether the object was found in the Pool's set of in-use
***REMOVED***     objects (in other words, whether any action was taken).
***REMOVED***
goog.structs.Pool.prototype.releaseObject = function(obj) {
  if (this.inUseSet_.remove(obj)) {
    this.addFreeObject(obj);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a free object from the collection of objects that are free so that it
***REMOVED*** can be used.
***REMOVED***
***REMOVED*** NOTE: This method does not mark the returned object as in use.
***REMOVED***
***REMOVED*** @return {T|undefined} The object removed from the free collection, if there
***REMOVED***     is one available. Otherwise, undefined.
***REMOVED*** @private
***REMOVED***
goog.structs.Pool.prototype.removeFreeObject_ = function() {
  var obj;
  while (this.getFreeCount() > 0) {
    obj = this.freeQueue_.dequeue();

    if (!this.objectCanBeReused(obj)) {
      this.adjustForMinMax();
    } else {
      break;
    }
  }

  if (!obj && this.getCount() < this.maxCount_) {
    obj = this.createObject();
  }

  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an object to the collection of objects that are free. If the object can
***REMOVED*** not be added, then it is disposed.
***REMOVED***
***REMOVED*** @param {T} obj The object to add to collection of free objects.
***REMOVED***
goog.structs.Pool.prototype.addFreeObject = function(obj) {
  this.inUseSet_.remove(obj);
  if (this.objectCanBeReused(obj) && this.getCount() < this.maxCount_) {
    this.freeQueue_.enqueue(obj);
  } else {
    this.disposeObject(obj);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adjusts the objects held in the pool to be within the min/max constraints.
***REMOVED***
***REMOVED*** NOTE: It is possible that the number of objects in the pool will still be
***REMOVED*** greater than the maximum count of objects allowed. This will be the case
***REMOVED*** if no more free objects can be disposed of to get below the minimum count
***REMOVED*** (i.e., all objects are in use).
***REMOVED***
goog.structs.Pool.prototype.adjustForMinMax = function() {
  var freeQueue = this.freeQueue_;

  // Make sure the at least the minimum number of objects are created.
  while (this.getCount() < this.minCount_) {
    freeQueue.enqueue(this.createObject());
  }

  // Make sure no more than the maximum number of objects are created.
  while (this.getCount() > this.maxCount_ && this.getFreeCount() > 0) {
    this.disposeObject(freeQueue.dequeue());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Should be overridden by sub-classes to return an instance of the object type
***REMOVED*** that is expected in the pool.
***REMOVED*** @return {T} The created object.
***REMOVED***
goog.structs.Pool.prototype.createObject = function() {
  return {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Should be overridden to dispose of an object. Default implementation is to
***REMOVED*** remove all its members, which should render it useless. Calls the object's
***REMOVED*** {@code dispose()} method, if available.
***REMOVED*** @param {T} obj The object to dispose.
***REMOVED***
goog.structs.Pool.prototype.disposeObject = function(obj) {
  if (typeof obj.dispose == 'function') {
    obj.dispose();
  } else {
    for (var i in obj) {
      obj[i] = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Should be overridden to determine whether an object has become unusable and
***REMOVED*** should not be returned by getObject(). Calls the object's
***REMOVED*** {@code canBeReused()}  method, if available.
***REMOVED*** @param {T} obj The object to test.
***REMOVED*** @return {boolean} Whether the object can be reused.
***REMOVED***
goog.structs.Pool.prototype.objectCanBeReused = function(obj) {
  if (typeof obj.canBeReused == 'function') {
    return obj.canBeReused();
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given object is in the pool.
***REMOVED*** @param {T} obj The object to check the pool for.
***REMOVED*** @return {boolean} Whether the pool contains the object.
***REMOVED***
goog.structs.Pool.prototype.contains = function(obj) {
  return this.freeQueue_.contains(obj) || this.inUseSet_.contains(obj);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of objects currently in the pool.
***REMOVED*** @return {number} Number of objects currently in the pool.
***REMOVED***
goog.structs.Pool.prototype.getCount = function() {
  return this.freeQueue_.getCount() + this.inUseSet_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of objects currently in use in the pool.
***REMOVED*** @return {number} Number of objects currently in use in the pool.
***REMOVED***
goog.structs.Pool.prototype.getInUseCount = function() {
  return this.inUseSet_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of objects currently free in the pool.
***REMOVED*** @return {number} Number of objects currently free in the pool.
***REMOVED***
goog.structs.Pool.prototype.getFreeCount = function() {
  return this.freeQueue_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the pool contains no objects.
***REMOVED*** @return {boolean} Whether the pool contains no objects.
***REMOVED***
goog.structs.Pool.prototype.isEmpty = function() {
  return this.freeQueue_.isEmpty() && this.inUseSet_.isEmpty();
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the pool and all objects currently held in the pool.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.structs.Pool.prototype.disposeInternal = function() {
  goog.structs.Pool.superClass_.disposeInternal.call(this);
  if (this.getInUseCount() > 0) {
    throw Error(goog.structs.Pool.ERROR_DISPOSE_UNRELEASED_OBJS_);
  }
  delete this.inUseSet_;

  // Call disposeObject on each object held by the pool.
  var freeQueue = this.freeQueue_;
  while (!freeQueue.isEmpty()) {
    this.disposeObject(freeQueue.dequeue());
  }
  delete this.freeQueue_;
***REMOVED***
