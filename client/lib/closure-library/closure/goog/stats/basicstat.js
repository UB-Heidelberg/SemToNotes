// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A basic statistics tracker.
***REMOVED***
***REMOVED***

goog.provide('goog.stats.BasicStat');

goog.require('goog.array');
goog.require('goog.iter');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string.format');
goog.require('goog.structs.CircularBuffer');



***REMOVED***
***REMOVED*** Tracks basic statistics over a specified time interval.
***REMOVED***
***REMOVED*** Statistics are kept in a fixed number of slots, each representing
***REMOVED*** an equal portion of the time interval.
***REMOVED***
***REMOVED*** Most methods optionally allow passing in the current time, so that
***REMOVED*** higher level stats can synchronize operations on multiple child
***REMOVED*** objects.  Under normal usage, the default of goog.now() should be
***REMOVED*** sufficient.
***REMOVED***
***REMOVED*** @param {number} interval The stat interval, in milliseconds.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.stats.BasicStat = function(interval) {
  goog.asserts.assert(interval > 50);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time interval that this statistic aggregates over.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.interval_ = interval;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of milliseconds in each slot.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.slotInterval_ = Math.floor(interval / goog.stats.BasicStat.NUM_SLOTS_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The array of slots.
  ***REMOVED*** @type {goog.structs.CircularBuffer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.slots_ =
      new goog.structs.CircularBuffer(goog.stats.BasicStat.NUM_SLOTS_);
***REMOVED***


***REMOVED***
***REMOVED*** The number of slots. This value limits the accuracy of the get()
***REMOVED*** method to (this.interval_ / NUM_SLOTS).  A 1-minute statistic would
***REMOVED*** be accurate to within 2 seconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.NUM_SLOTS_ = 50;


***REMOVED***
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.prototype.logger_ =
    goog.log.getLogger('goog.stats.BasicStat');


***REMOVED***
***REMOVED*** @return {number} The interval which over statistics are being
***REMOVED***     accumulated, in milliseconds.
***REMOVED***
goog.stats.BasicStat.prototype.getInterval = function() {
  return this.interval_;
***REMOVED***


***REMOVED***
***REMOVED*** Increments the count of this statistic by the specified amount.
***REMOVED***
***REMOVED*** @param {number} amt The amount to increase the count by.
***REMOVED*** @param {number=} opt_now The time, in milliseconds, to be treated
***REMOVED***     as the "current" time.  The current time must always be greater
***REMOVED***     than or equal to the last time recorded by this stat tracker.
***REMOVED***
goog.stats.BasicStat.prototype.incBy = function(amt, opt_now) {
  var now = opt_now ? opt_now : goog.now();
  this.checkForTimeTravel_(now);
  var slot =***REMOVED*****REMOVED*** @type {goog.stats.BasicStat.Slot_}***REMOVED*** (this.slots_.getLast());
  if (!slot || now >= slot.end) {
    slot = new goog.stats.BasicStat.Slot_(this.getSlotBoundary_(now));
    this.slots_.add(slot);
  }
  slot.count += amt;
  slot.min = Math.min(amt, slot.min);
  slot.max = Math.max(amt, slot.max);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the count of the statistic over its configured time
***REMOVED*** interval.
***REMOVED*** @param {number=} opt_now The time, in milliseconds, to be treated
***REMOVED***     as the "current" time.  The current time must always be greater
***REMOVED***     than or equal to the last time recorded by this stat tracker.
***REMOVED*** @return {number} The total count over the tracked interval.
***REMOVED***
goog.stats.BasicStat.prototype.get = function(opt_now) {
  return this.reduceSlots_(opt_now,
      function(sum, slot) { return sum + slot.count; },
      0);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitute of the largest atomic increment that occurred
***REMOVED*** during the watched time interval.
***REMOVED*** @param {number=} opt_now The time, in milliseconds, to be treated
***REMOVED***     as the "current" time.  The current time must always be greater
***REMOVED***     than or equal to the last time recorded by this stat tracker.
***REMOVED*** @return {number} The maximum count of this statistic.
***REMOVED***
goog.stats.BasicStat.prototype.getMax = function(opt_now) {
  return this.reduceSlots_(opt_now,
      function(max, slot) { return Math.max(max, slot.max); },
      Number.MIN_VALUE);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the magnitute of the smallest atomic increment that
***REMOVED*** occurred during the watched time interval.
***REMOVED*** @param {number=} opt_now The time, in milliseconds, to be treated
***REMOVED***     as the "current" time.  The current time must always be greater
***REMOVED***     than or equal to the last time recorded by this stat tracker.
***REMOVED*** @return {number} The minimum count of this statistic.
***REMOVED***
goog.stats.BasicStat.prototype.getMin = function(opt_now) {
  return this.reduceSlots_(opt_now,
      function(min, slot) { return Math.min(min, slot.min); },
      Number.MAX_VALUE);
***REMOVED***


***REMOVED***
***REMOVED*** Passes each active slot into a function and accumulates the result.
***REMOVED***
***REMOVED*** @param {number|undefined} now The current time, in milliseconds.
***REMOVED*** @param {function(number, goog.stats.BasicStat.Slot_): number} func
***REMOVED***     The function to call for every active slot.  This function
***REMOVED***     takes two arguments: the previous result and the new slot to
***REMOVED***     include in the reduction.
***REMOVED*** @param {number} val The initial value for the reduction.
***REMOVED*** @return {number} The result of the reduction.
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.prototype.reduceSlots_ = function(now, func, val) {
  now = now || goog.now();
  this.checkForTimeTravel_(now);
  var rval = val;
  var start = this.getSlotBoundary_(now) - this.interval_;
  for (var i = this.slots_.getCount() - 1; i >= 0; --i) {
    var slot =***REMOVED*****REMOVED*** @type {goog.stats.BasicStat.Slot_}***REMOVED*** (this.slots_.get(i));
    if (slot.end <= start) {
      break;
    }
    rval = func(rval, slot);
  }
  return rval;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the end time for the slot that should contain the count
***REMOVED*** around the given time.  This method ensures that every bucket is
***REMOVED*** aligned on a "this.slotInterval_" millisecond boundary.
***REMOVED*** @param {number} time The time to compute a boundary for.
***REMOVED*** @return {number} The computed boundary.
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.prototype.getSlotBoundary_ = function(time) {
  return this.slotInterval_***REMOVED*** (Math.floor(time / this.slotInterval_) + 1);
***REMOVED***


***REMOVED***
***REMOVED*** Checks that time never goes backwards.  If it does (for example,
***REMOVED*** the user changes their system clock), the object state is cleared.
***REMOVED*** @param {number} now The current time, in milliseconds.
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.prototype.checkForTimeTravel_ = function(now) {
  var slot =***REMOVED*****REMOVED*** @type {goog.stats.BasicStat.Slot_}***REMOVED*** (this.slots_.getLast());
  if (slot) {
    var slotStart = slot.end - this.slotInterval_;
    if (now < slotStart) {
      goog.log.warning(this.logger_, goog.string.format(
          'Went backwards in time: now=%d, slotStart=%d.  Resetting state.',
          now, slotStart));
      this.reset_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears any statistics tracked by this object, as though it were
***REMOVED*** freshly created.
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.prototype.reset_ = function() {
  this.slots_.clear();
***REMOVED***



***REMOVED***
***REMOVED*** A struct containing information for each sub-interval.
***REMOVED*** @param {number} end The end time for this slot, in milliseconds.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.stats.BasicStat.Slot_ = function(end) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** End time of this slot, exclusive.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.end = end;
***REMOVED***


***REMOVED***
***REMOVED*** Aggregated count within this slot.
***REMOVED*** @type {number}
***REMOVED***
goog.stats.BasicStat.Slot_.prototype.count = 0;


***REMOVED***
***REMOVED*** The smallest atomic increment of the count within this slot.
***REMOVED*** @type {number}
***REMOVED***
goog.stats.BasicStat.Slot_.prototype.min = Number.MAX_VALUE;


***REMOVED***
***REMOVED*** The largest atomic increment of the count within this slot.
***REMOVED*** @type {number}
***REMOVED***
goog.stats.BasicStat.Slot_.prototype.max = Number.MIN_VALUE;
