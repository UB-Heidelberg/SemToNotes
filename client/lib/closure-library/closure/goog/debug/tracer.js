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
***REMOVED*** @fileoverview Definition of the Tracer class and associated classes.
***REMOVED***
***REMOVED*** @see ../demos/tracer.html
***REMOVED***

goog.provide('goog.debug.Trace');

goog.require('goog.array');
goog.require('goog.iter');
goog.require('goog.log');
goog.require('goog.structs.Map');
goog.require('goog.structs.SimplePool');



***REMOVED***
***REMOVED*** Class used for singleton goog.debug.Trace.  Used for timing slow points in
***REMOVED*** the code. Based on the java Tracer class but optimized for javascript.
***REMOVED*** See com.google.common.tracing.Tracer.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_ = function() {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Events in order.
  ***REMOVED*** @type {Array.<goog.debug.Trace_.Event_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.events_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Outstanding events that have started but haven't yet ended. The keys are
  ***REMOVED*** numeric ids and the values are goog.debug.Trace_.Event_ objects.
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.outstandingEvents_ = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Start time of the event trace
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.startTime_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cummulative overhead of calls to startTracer
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tracerOverheadStart_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cummulative overhead of calls to endTracer
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tracerOverheadEnd_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cummulative overhead of calls to addComment
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tracerOverheadComment_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keeps stats on different types of tracers. The keys are strings and the
  ***REMOVED*** values are goog.debug.Stat
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.stats_ = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Total number of traces created in the trace.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tracerCount_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Total number of comments created in the trace.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.commentCount_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Next id to use for the trace.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nextId_ = 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A pool for goog.debug.Trace_.Event_ objects so we don't keep creating and
  ***REMOVED*** garbage collecting these (which is very expensive in IE6).
  ***REMOVED*** @type {goog.structs.SimplePool}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventPool_ = new goog.structs.SimplePool(0, 4000);
  this.eventPool_.createObject = function() {
    return new goog.debug.Trace_.Event_();
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** A pool for goog.debug.Trace_.Stat_ objects so we don't keep creating and
  ***REMOVED*** garbage collecting these (which is very expensive in IE6).
  ***REMOVED*** @type {goog.structs.SimplePool}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.statPool_ = new goog.structs.SimplePool(0, 50);
  this.statPool_.createObject = function() {
    return new goog.debug.Trace_.Stat_();
 ***REMOVED*****REMOVED***

  var that = this;
  this.idPool_ = new goog.structs.SimplePool(0, 2000);

  // TODO(nicksantos): SimplePool is supposed to only return objects.
  // Reconcile this so that we don't have to cast to number below.
  this.idPool_.createObject = function() {
    return String(that.nextId_++);
 ***REMOVED*****REMOVED***
  this.idPool_.disposeObject = function(obj) {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Default threshold below which a tracer shouldn't be reported
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultThreshold_ = 3;
***REMOVED***


***REMOVED***
***REMOVED*** Logger for the tracer
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.prototype.logger_ =
    goog.log.getLogger('goog.debug.Trace');


***REMOVED***
***REMOVED*** Maximum size of the trace before we discard events
***REMOVED*** @type {number}
***REMOVED***
goog.debug.Trace_.prototype.MAX_TRACE_SIZE = 1000;


***REMOVED***
***REMOVED*** Event type supported by tracer
***REMOVED*** @enum {number}
***REMOVED***
goog.debug.Trace_.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Start event type
 ***REMOVED*****REMOVED***
  START: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Stop event type
 ***REMOVED*****REMOVED***
  STOP: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Comment event type
 ***REMOVED*****REMOVED***
  COMMENT: 2
***REMOVED***



***REMOVED***
***REMOVED*** Class to keep track of a stat of a single tracer type. Stores the count
***REMOVED*** and cumulative time.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.Stat_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of tracers
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.count = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cumulative time of traces
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.time = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Total number of allocations for this tracer type
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.varAlloc = 0;
***REMOVED***


***REMOVED***
***REMOVED*** @type {string|null|undefined}
***REMOVED***
goog.debug.Trace_.Stat_.prototype.type;


***REMOVED***
***REMOVED*** @return {string} A string describing the tracer stat.
***REMOVED*** @override
***REMOVED***
goog.debug.Trace_.Stat_.prototype.toString = function() {
  var sb = [];
  sb.push(this.type, ' ', this.count, ' (', Math.round(this.time***REMOVED*** 10) / 10,
      ' ms)');
  if (this.varAlloc) {
    sb.push(' [VarAlloc = ', this.varAlloc, ']');
  }
  return sb.join('');
***REMOVED***



***REMOVED***
***REMOVED*** Private class used to encapsulate a single event, either the start or stop
***REMOVED*** of a tracer.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.Event_ = function() {
  // the fields are different for different events - see usage in code
***REMOVED***


***REMOVED***
***REMOVED*** @type {string|null|undefined}
***REMOVED***
goog.debug.Trace_.Event_.prototype.type;


***REMOVED***
***REMOVED*** Returns a formatted string for the event.
***REMOVED*** @param {number} startTime The start time of the trace to generate relative
***REMOVED*** times.
***REMOVED*** @param {number} prevTime The completion time of the previous event or -1.
***REMOVED*** @param {string} indent Extra indent for the message
***REMOVED***     if there was no previous event.
***REMOVED*** @return {string} The formatted tracer string.
***REMOVED***
goog.debug.Trace_.Event_.prototype.toTraceString = function(startTime, prevTime,
    indent) {
  var sb = [];

  if (prevTime == -1) {
    sb.push('    ');
  } else {
    sb.push(goog.debug.Trace_.longToPaddedString_(this.eventTime - prevTime));
  }

  sb.push(' ', goog.debug.Trace_.formatTime_(this.eventTime - startTime));
  if (this.eventType == goog.debug.Trace_.EventType.START) {
    sb.push(' Start        ');
  } else if (this.eventType == goog.debug.Trace_.EventType.STOP) {
    sb.push(' Done ');
    var delta = this.stopTime - this.startTime;
    sb.push(goog.debug.Trace_.longToPaddedString_(delta), ' ms ');
  } else {
    sb.push(' Comment      ');
  }

  sb.push(indent, this);
  if (this.totalVarAlloc > 0) {
    sb.push('[VarAlloc ', this.totalVarAlloc, '] ');
  }
  return sb.join('');
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} A string describing the tracer event.
***REMOVED*** @override
***REMOVED***
goog.debug.Trace_.Event_.prototype.toString = function() {
  if (this.type == null) {
    return this.comment;
  } else {
    return '[' + this.type + '] ' + this.comment;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Add the ability to explicitly set the start time. This is useful for example
***REMOVED*** for measuring initial load time where you can set a variable as soon as the
***REMOVED*** main page of the app is loaded and then later call this function when the
***REMOVED*** Tracer code has been loaded.
***REMOVED*** @param {number} startTime The start time to set.
***REMOVED***
goog.debug.Trace_.prototype.setStartTime = function(startTime) {
  this.startTime_ = startTime;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes and resets the current trace
***REMOVED*** @param {number} defaultThreshold The default threshold below which the
***REMOVED*** tracer output will be supressed. Can be overridden on a per-Tracer basis.
***REMOVED***
goog.debug.Trace_.prototype.initCurrentTrace = function(defaultThreshold) {
  this.reset(defaultThreshold);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the current trace
***REMOVED***
goog.debug.Trace_.prototype.clearCurrentTrace = function() {
  this.reset(0);
***REMOVED***


***REMOVED***
***REMOVED*** Resets the trace.
***REMOVED*** @param {number} defaultThreshold The default threshold below which the
***REMOVED*** tracer output will be supressed. Can be overridden on a per-Tracer basis.
***REMOVED***
goog.debug.Trace_.prototype.reset = function(defaultThreshold) {
  this.defaultThreshold_ = defaultThreshold;

  for (var i = 0; i < this.events_.length; i++) {
    var id =***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (this.eventPool_).id;
    if (id) {
      this.idPool_.releaseObject(id);
    }
    this.eventPool_.releaseObject(this.events_[i]);
  }

  this.events_.length = 0;
  this.outstandingEvents_.clear();
  this.startTime_ = goog.debug.Trace_.now();
  this.tracerOverheadStart_ = 0;
  this.tracerOverheadEnd_ = 0;
  this.tracerOverheadComment_ = 0;
  this.tracerCount_ = 0;
  this.commentCount_ = 0;

  var keys = this.stats_.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var stat = this.stats_.get(key);
    stat.count = 0;
    stat.time = 0;
    stat.varAlloc = 0;
    this.statPool_.releaseObject(***REMOVED*** @type {Object}***REMOVED*** (stat));
  }
  this.stats_.clear();
***REMOVED***


***REMOVED***
***REMOVED*** Starts a tracer
***REMOVED*** @param {string} comment A comment used to identify the tracer. Does not
***REMOVED***     need to be unique.
***REMOVED*** @param {string=} opt_type Type used to identify the tracer. If a Trace is
***REMOVED***     given a type (the first argument to the constructor) and multiple Traces
***REMOVED***     are done on that type then a "TOTAL line will be produced showing the
***REMOVED***     total number of traces and the sum of the time
***REMOVED***     ("TOTAL Database 2 (37 ms)" in our example). These traces should be
***REMOVED***     mutually exclusive or else the sum won't make sense (the time will
***REMOVED***     be double counted if the second starts before the first ends).
***REMOVED*** @return {number} The identifier for the tracer that should be passed to the
***REMOVED***     the stopTracer method.
***REMOVED***
goog.debug.Trace_.prototype.startTracer = function(comment, opt_type) {
  var tracerStartTime = goog.debug.Trace_.now();
  var varAlloc = this.getTotalVarAlloc();
  var outstandingEventCount = this.outstandingEvents_.getCount();
  if (this.events_.length + outstandingEventCount > this.MAX_TRACE_SIZE) {
    goog.log.warning(this.logger_,
        'Giant thread trace. Clearing to avoid memory leak.');
    // This is the more likely case. This usually means that we
    // either forgot to clear the trace or else we are performing a
    // very large number of events
    if (this.events_.length > this.MAX_TRACE_SIZE / 2) {
      for (var i = 0; i < this.events_.length; i++) {
        var event = this.events_[i];
        if (event.id) {
          this.idPool_.releaseObject(event.id);
        }
        this.eventPool_.releaseObject(event);
      }
      this.events_.length = 0;
    }

    // This is less likely and probably indicates that a lot of traces
    // aren't being closed. We want to avoid unnecessarily clearing
    // this though in case the events do eventually finish.
    if (outstandingEventCount > this.MAX_TRACE_SIZE / 2) {
      this.outstandingEvents_.clear();
    }
  }

  goog.debug.Logger.logToProfilers('Start : ' + comment);

  var event =***REMOVED*****REMOVED*** @type {goog.debug.Trace_.Event_}***REMOVED*** (
      this.eventPool_.getObject());
  event.totalVarAlloc = varAlloc;
  event.eventType = goog.debug.Trace_.EventType.START;
  event.id = Number(this.idPool_.getObject());
  event.comment = comment;
  event.type = opt_type;
  this.events_.push(event);
  this.outstandingEvents_.set(String(event.id), event);
  this.tracerCount_++;
  var now = goog.debug.Trace_.now();
  event.startTime = event.eventTime = now;
  this.tracerOverheadStart_ += now - tracerStartTime;
  return event.id;
***REMOVED***


***REMOVED***
***REMOVED*** Stops a tracer
***REMOVED*** @param {number|undefined|null} id The id of the tracer that is ending.
***REMOVED*** @param {number=} opt_silenceThreshold Threshold below which the tracer is
***REMOVED***    silenced.
***REMOVED*** @return {?number} The elapsed time for the tracer or null if the tracer
***REMOVED***    identitifer was not recognized.
***REMOVED***
goog.debug.Trace_.prototype.stopTracer = function(id, opt_silenceThreshold) {
  // this used to call goog.isDef(opt_silenceThreshold) but that causes an
  // object allocation in IE for some reason (doh!). The following code doesn't
  // cause an allocation
  var now = goog.debug.Trace_.now();
  var silenceThreshold;
  if (opt_silenceThreshold === 0) {
    silenceThreshold = 0;
  } else if (opt_silenceThreshold) {
    silenceThreshold = opt_silenceThreshold;
  } else {
    silenceThreshold = this.defaultThreshold_;
  }

  var startEvent = this.outstandingEvents_.get(String(id));
  if (startEvent == null) {
    return null;
  }

  this.outstandingEvents_.remove(String(id));

  var stopEvent;
  var elapsed = now - startEvent.startTime;
  if (elapsed < silenceThreshold) {
    var count = this.events_.length;
    for (var i = count - 1; i >= 0; i--) {
      var nextEvent = this.events_[i];
      if (nextEvent == startEvent) {
        this.events_.splice(i, 1);
        this.idPool_.releaseObject(startEvent.id);
        this.eventPool_.releaseObject(***REMOVED*** @type {Object}***REMOVED*** (startEvent));
        break;
      }
    }

  } else {
    stopEvent =***REMOVED*****REMOVED*** @type {goog.debug.Trace_.Event_}***REMOVED*** (
        this.eventPool_.getObject());
    stopEvent.eventType = goog.debug.Trace_.EventType.STOP;
    stopEvent.startTime = startEvent.startTime;
    stopEvent.comment = startEvent.comment;
    stopEvent.type = startEvent.type;
    stopEvent.stopTime = stopEvent.eventTime = now;

    this.events_.push(stopEvent);
  }

  var type = startEvent.type;
  var stat = null;
  if (type) {
    stat = this.getStat_(type);
    stat.count++;
    stat.time += elapsed;
  }
  if (stopEvent) {
    goog.debug.Logger.logToProfilers('Stop : ' + stopEvent.comment);

    stopEvent.totalVarAlloc = this.getTotalVarAlloc();

    if (stat) {
      stat.varAlloc += (stopEvent.totalVarAlloc - startEvent.totalVarAlloc);
    }
  }
  var tracerFinishTime = goog.debug.Trace_.now();
  this.tracerOverheadEnd_ += tracerFinishTime - now;
  return elapsed;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the ActiveX object that can be used to get GC tracing in IE6.
***REMOVED*** @param {Object} gcTracer GCTracer ActiveX object.
***REMOVED***
goog.debug.Trace_.prototype.setGcTracer = function(gcTracer) {
  this.gcTracer_ = gcTracer;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the total number of allocations since the GC stats were reset. Only
***REMOVED*** works in IE.
***REMOVED*** @return {number} The number of allocaitons or -1 if not supported.
***REMOVED***
goog.debug.Trace_.prototype.getTotalVarAlloc = function() {
  var gcTracer = this.gcTracer_;
  // isTracing is defined on the ActiveX object.
  if (gcTracer && gcTracer['isTracing']()) {
    return gcTracer['totalVarAlloc'];
  }
  return -1;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a comment to the trace. Makes it possible to see when a specific event
***REMOVED*** happened in relation to the traces.
***REMOVED*** @param {string} comment A comment that is inserted into the trace.
***REMOVED*** @param {?string=} opt_type Type used to identify the tracer. If a comment is
***REMOVED***     given a type and multiple comments are done on that type then a "TOTAL
***REMOVED***     line will be produced showing the total number of comments of that type.
***REMOVED*** @param {?number=} opt_timeStamp The timestamp to insert the comment. If not
***REMOVED***    specified, the current time wil be used.
***REMOVED***
goog.debug.Trace_.prototype.addComment = function(comment, opt_type,
                                                  opt_timeStamp) {
  var now = goog.debug.Trace_.now();
  var timeStamp = opt_timeStamp ? opt_timeStamp : now;

  var eventComment =***REMOVED*****REMOVED*** @type {goog.debug.Trace_.Event_}***REMOVED*** (
      this.eventPool_.getObject());
  eventComment.eventType = goog.debug.Trace_.EventType.COMMENT;
  eventComment.eventTime = timeStamp;
  eventComment.type = opt_type;
  eventComment.comment = comment;
  eventComment.totalVarAlloc = this.getTotalVarAlloc();
  this.commentCount_++;

  if (opt_timeStamp) {
    var numEvents = this.events_.length;
    for (var i = 0; i < numEvents; i++) {
      var event = this.events_[i];
      var eventTime = event.eventTime;

      if (eventTime > timeStamp) {
        goog.array.insertAt(this.events_, eventComment, i);
        break;
      }
    }
    if (i == numEvents) {
      this.events_.push(eventComment);
    }
  } else {
    this.events_.push(eventComment);
  }

  var type = eventComment.type;
  if (type) {
    var stat = this.getStat_(type);
    stat.count++;
  }

  this.tracerOverheadComment_ += goog.debug.Trace_.now() - now;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a stat object for a particular type. The stat object is created if it
***REMOVED*** hasn't yet been.
***REMOVED*** @param {string} type The type of stat.
***REMOVED*** @return {goog.debug.Trace_.Stat_} The stat object.
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.prototype.getStat_ = function(type) {
  var stat = this.stats_.get(type);
  if (!stat) {
    stat =***REMOVED*****REMOVED*** @type {goog.debug.Trace_.Event_}***REMOVED*** (
        this.statPool_.getObject());
    stat.type = type;
    this.stats_.set(type, stat);
  }
  return***REMOVED*****REMOVED*** @type {goog.debug.Trace_.Stat_}***REMOVED***(stat);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a formatted string for the current trace
***REMOVED*** @return {string} A formatted string that shows the timings of the current
***REMOVED***     trace.
***REMOVED***
goog.debug.Trace_.prototype.getFormattedTrace = function() {
  return this.toString();
***REMOVED***


***REMOVED***
***REMOVED*** Returns a formatted string that describes the thread trace.
***REMOVED*** @return {string} A formatted string.
***REMOVED*** @override
***REMOVED***
goog.debug.Trace_.prototype.toString = function() {
  var sb = [];
  var etime = -1;
  var indent = [];
  for (var i = 0; i < this.events_.length; i++) {
    var e = this.events_[i];
    if (e.eventType == goog.debug.Trace_.EventType.STOP) {
      indent.pop();
    }
    sb.push(' ', e.toTraceString(this.startTime_, etime, indent.join('')));
    etime = e.eventTime;
    sb.push('\n');
    if (e.eventType == goog.debug.Trace_.EventType.START) {
      indent.push('|  ');
    }
  }

  if (this.outstandingEvents_.getCount() != 0) {
    var now = goog.debug.Trace_.now();

    sb.push(' Unstopped timers:\n');
    goog.iter.forEach(this.outstandingEvents_, function(startEvent) {
      sb.push('  ', startEvent, ' (', now - startEvent.startTime,
          ' ms, started at ',
          goog.debug.Trace_.formatTime_(startEvent.startTime),
          ')\n');
    });
  }

  var statKeys = this.stats_.getKeys();
  for (var i = 0; i < statKeys.length; i++) {
    var stat = this.stats_.get(statKeys[i]);
    if (stat.count > 1) {
      sb.push(' TOTAL ', stat, '\n');
    }
  }

  sb.push('Total tracers created ', this.tracerCount_, '\n',
      'Total comments created ', this.commentCount_, '\n',
      'Overhead start: ', this.tracerOverheadStart_, ' ms\n',
      'Overhead end: ', this.tracerOverheadEnd_, ' ms\n',
      'Overhead comment: ', this.tracerOverheadComment_, ' ms\n');

  return sb.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Converts 'v' to a string and pads it with up to 3 spaces for
***REMOVED*** improved alignment. TODO there must be a better way
***REMOVED*** @param {number} v A number.
***REMOVED*** @return {string} A padded string.
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.longToPaddedString_ = function(v) {
  v = Math.round(v);
  // todo (pupius) - there should be a generic string in goog.string for this
  var space = '';
  if (v < 1000) space = ' ';
  if (v < 100) space = '  ';
  if (v < 10) space = '   ';
  return space + v;
***REMOVED***


***REMOVED***
***REMOVED*** Return the sec.ms part of time (if time = "20:06:11.566",  "11.566
***REMOVED*** @param {number} time The time in MS.
***REMOVED*** @return {string} A formatted string as sec.ms'.
***REMOVED*** @private
***REMOVED***
goog.debug.Trace_.formatTime_ = function(time) {
  time = Math.round(time);
  var sec = (time / 1000) % 60;
  var ms = time % 1000;

  // TODO their must be a nicer way to get zero padded integers
  return String(100 + sec).substring(1, 3) + '.' +
         String(1000 + ms).substring(1, 4);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current time. Done through a wrapper function so it can be
***REMOVED*** overridden by application code. Gmail has an ActiveX extension that provides
***REMOVED*** higher precision timing info.
***REMOVED*** @return {number} The current time in milliseconds.
***REMOVED***
goog.debug.Trace_.now = function() {
  return goog.now();
***REMOVED***


***REMOVED***
***REMOVED*** Singleton trace object
***REMOVED*** @type {goog.debug.Trace_}
***REMOVED***
goog.debug.Trace = new goog.debug.Trace_();
