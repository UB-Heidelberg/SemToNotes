// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility class that monitors pixel density ratio changes.
***REMOVED***
***REMOVED*** @see ../demos/pixeldensitymonitor.html
***REMOVED***

goog.provide('goog.labs.style.PixelDensityMonitor');
goog.provide('goog.labs.style.PixelDensityMonitor.Density');
goog.provide('goog.labs.style.PixelDensityMonitor.EventType');

***REMOVED***
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Monitors the window for changes to the ratio between device and screen
***REMOVED*** pixels, e.g. when the user moves the window from a high density screen to a
***REMOVED*** screen with normal density. Dispatches
***REMOVED*** goog.labs.style.PixelDensityMonitor.EventType.CHANGE events when the density
***REMOVED*** changes between the two predefined values NORMAL and HIGH.
***REMOVED***
***REMOVED*** This class uses the window.devicePixelRatio value which is supported in
***REMOVED*** WebKit and FF18. If the value does not exist, it will always return a
***REMOVED*** NORMAL density. It requires support for MediaQueryList to detect changes to
***REMOVED*** the devicePixelRatio.
***REMOVED***
***REMOVED*** @param {!goog.dom.DomHelper=} opt_domHelper The DomHelper which contains the
***REMOVED***     document associated with the window to listen to. Defaults to the one in
***REMOVED***     which this code is executing.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.labs.style.PixelDensityMonitor = function(opt_domHelper) {
  goog.labs.style.PixelDensityMonitor.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Window}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.window_ = opt_domHelper ? opt_domHelper.getWindow() : window;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last density that was reported so that changes can be detected.
  ***REMOVED*** @type {goog.labs.style.PixelDensityMonitor.Density}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastDensity_ = this.getDensity();

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {function (MediaQueryList)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listener_ = goog.bind(this.handleMediaQueryChange_, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The media query list for a query that detects high density, if supported
  ***REMOVED*** by the browser. Because matchMedia returns a new object for every call, it
  ***REMOVED*** needs to be saved here so the listener can be removed when disposing.
  ***REMOVED*** @type {?MediaQueryList}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mediaQueryList_ = this.window_.matchMedia ? this.window_.matchMedia(
      goog.labs.style.PixelDensityMonitor.HIGH_DENSITY_QUERY_) : null;
***REMOVED***
goog.inherits(goog.labs.style.PixelDensityMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The two different pixel density modes on which the various ratios between
***REMOVED*** physical and device pixels are mapped.
***REMOVED*** @enum {number}
***REMOVED***
goog.labs.style.PixelDensityMonitor.Density = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Mode for older portable devices and desktop screens, defined as having a
  ***REMOVED*** device pixel ratio of less than 1.5.
 ***REMOVED*****REMOVED***
  NORMAL: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Mode for newer portable devices with a high resolution screen, defined as
  ***REMOVED*** having a device pixel ratio of more than 1.5.
 ***REMOVED*****REMOVED***
  HIGH: 2
***REMOVED***


***REMOVED***
***REMOVED*** The events fired by the PixelDensityMonitor.
***REMOVED*** @enum {string}
***REMOVED***
goog.labs.style.PixelDensityMonitor.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when density changes between NORMAL and HIGH.
 ***REMOVED*****REMOVED***
  CHANGE: goog.events.getUniqueId('change')
***REMOVED***


***REMOVED***
***REMOVED*** Minimum ratio between device and screen pixel needed for high density mode.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.labs.style.PixelDensityMonitor.HIGH_DENSITY_RATIO_ = 1.5;


***REMOVED***
***REMOVED*** Media query that matches for high density.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.labs.style.PixelDensityMonitor.HIGH_DENSITY_QUERY_ =
    '(min-resolution: 1.5dppx), (-webkit-min-device-pixel-ratio: 1.5)';


***REMOVED***
***REMOVED*** Starts monitoring for changes in pixel density.
***REMOVED***
goog.labs.style.PixelDensityMonitor.prototype.start = function() {
  if (this.mediaQueryList_) {
    this.mediaQueryList_.addListener(this.listener_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.labs.style.PixelDensityMonitor.Density} The density for the
***REMOVED***     window.
***REMOVED***
goog.labs.style.PixelDensityMonitor.prototype.getDensity = function() {
  if (this.window_.devicePixelRatio >=
      goog.labs.style.PixelDensityMonitor.HIGH_DENSITY_RATIO_) {
    return goog.labs.style.PixelDensityMonitor.Density.HIGH;
  } else {
    return goog.labs.style.PixelDensityMonitor.Density.NORMAL;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a change to the media query and checks whether the density has
***REMOVED*** changed since the last call.
***REMOVED*** @param {MediaQueryList} mql The list of changed media queries.
***REMOVED*** @private
***REMOVED***
goog.labs.style.PixelDensityMonitor.prototype.handleMediaQueryChange_ =
    function(mql) {
  var newDensity = this.getDensity();
  if (this.lastDensity_ != newDensity) {
    this.lastDensity_ = newDensity;
    this.dispatchEvent(goog.labs.style.PixelDensityMonitor.EventType.CHANGE);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.style.PixelDensityMonitor.prototype.disposeInternal = function() {
  if (this.mediaQueryList_) {
    this.mediaQueryList_.removeListener(this.listener_);
  }
  goog.labs.style.PixelDensityMonitor.base(this, 'disposeInternal');
***REMOVED***
