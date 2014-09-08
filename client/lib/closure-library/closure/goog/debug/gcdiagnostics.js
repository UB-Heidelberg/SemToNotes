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
***REMOVED*** @fileoverview Definition of the GcDiagnostics class.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.GcDiagnostics');

goog.require('goog.debug.Trace');
goog.require('goog.log');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Class used for singleton goog.debug.GcDiagnostics.  Used to hook into
***REMOVED*** the L2 ActiveX controller to profile garbage collection information in IE.
***REMOVED*** Can be used in combination with tracers (goog.debug.Trace), to provide object
***REMOVED*** allocation counts from within the tracers or used alone by invoking start and
***REMOVED*** stop.
***REMOVED***
***REMOVED*** See http://go/l2binary for the install.
***REMOVED*** TODO(user): Move the L2 installer somewhere more general.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.debug.GcDiagnostics_ = function() {***REMOVED***


***REMOVED***
***REMOVED*** Install the GcDiagnostics tool.
***REMOVED***
goog.debug.GcDiagnostics_.prototype.install = function() {
  if (goog.userAgent.IE) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      var l2Helper = new ActiveXObject('L2.NativeHelper');

      // If using tracers, use the higher precision timer provided by L2.
      if (goog.debug.Trace_) {
        goog.debug.Trace_.now = function() {
          return l2Helper['getMilliSeconds']();
       ***REMOVED*****REMOVED***
      }

      if (l2Helper['gcTracer']) {
        l2Helper['gcTracer']['installGcTracing']();
        this.gcTracer_ = l2Helper['gcTracer'];
        if (goog.debug.Trace) {
          // If tracers are in use, register the gcTracer so that per tracer
          // allocations are recorded.
          goog.debug.Trace.setGcTracer(this.gcTracer_);
        }
      }
      goog.log.info(this.logger_, 'Installed L2 native helper');
    } catch (e) {
      goog.log.info(this.logger_, 'Failed to install L2 native helper: ' + e);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logger for the gcDiagnotics
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.debug.GcDiagnostics_.prototype.logger_ =
    goog.log.getLogger('goog.debug.GcDiagnostics');


***REMOVED***
***REMOVED*** Starts recording garbage collection information.  If a trace is already in
***REMOVED*** progress, it is ended.
***REMOVED***
goog.debug.GcDiagnostics_.prototype.start = function() {
  if (this.gcTracer_) {
    if (this.gcTracer_['isTracing']()) {
      this.gcTracer_['endGcTracing']();
    }
    this.gcTracer_['startGcTracing']();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stops recording garbage collection information.  Logs details on the garbage
***REMOVED*** collections that occurred between start and stop.  If tracers are in use,
***REMOVED*** adds comments where each GC occurs.
***REMOVED***
goog.debug.GcDiagnostics_.prototype.stop = function() {
  if (this.gcTracer_ && this.gcTracer_['isTracing']()) {
    var gcTracer = this.gcTracer_;
    this.gcTracer_['endGcTracing']();

    var numGCs = gcTracer['getNumTraces']();
    goog.log.info(this.logger_, '*********GC TRACE*********');
    goog.log.info(this.logger_, 'GC ran ' + numGCs + ' times.');
    var totalTime = 0;
    for (var i = 0; i < numGCs; i++) {
      var trace = gcTracer['getTrace'](i);

      var msStart = trace['gcStartTime'];
      var msElapsed = trace['gcElapsedTime'];

      var msRounded = Math.round(msElapsed***REMOVED*** 10) / 10;
      var s = 'GC ' + i + ': ' + msRounded + ' ms, ' +
          'numVValAlloc=' + trace['numVValAlloc'] + ', ' +
          'numVarAlloc=' + trace['numVarAlloc'] + ', ' +
          'numBytesSysAlloc=' + trace['numBytesSysAlloc'];
      if (goog.debug.Trace) {
        goog.debug.Trace.addComment(s, null, msStart);
      }
      goog.log.info(this.logger_, s);
      totalTime += msElapsed;
    }
    if (goog.debug.Trace) {
      goog.debug.Trace.addComment('Total GC time was ' + totalTime + ' ms.');
    }
    goog.log.info(this.logger_, 'Total GC time was ' + totalTime + ' ms.');
    goog.log.info(this.logger_, '*********GC TRACE*********');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Singleton GcDiagnostics object
***REMOVED*** @type {goog.debug.GcDiagnostics_}
***REMOVED***
goog.debug.GcDiagnostics = new goog.debug.GcDiagnostics_();
