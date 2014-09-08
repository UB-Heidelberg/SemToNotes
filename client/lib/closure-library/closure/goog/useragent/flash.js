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
***REMOVED*** @fileoverview Flash detection.
***REMOVED*** @see ../demos/useragent.html
***REMOVED***

goog.provide('goog.userAgent.flash');

goog.require('goog.string');


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser doesn't
***REMOVED*** have flash.
***REMOVED***
goog.define('goog.userAgent.flash.ASSUME_NO_FLASH', false);


***REMOVED***
***REMOVED*** Whether we can detect that the browser has flash
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.userAgent.flash.detectedFlash_ = false;


***REMOVED***
***REMOVED*** Full version information of flash installed, in form 7.0.61
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.userAgent.flash.detectedFlashVersion_ = '';


***REMOVED***
***REMOVED*** Initializer for goog.userAgent.flash
***REMOVED***
***REMOVED*** This is a named function so that it can be stripped via the jscompiler if
***REMOVED*** goog.userAgent.flash.ASSUME_NO_FLASH is true.
***REMOVED*** @private
***REMOVED***
goog.userAgent.flash.init_ = function() {
  if (navigator.plugins && navigator.plugins.length) {
    var plugin = navigator.plugins['Shockwave Flash'];
    if (plugin) {
      goog.userAgent.flash.detectedFlash_ = true;
      if (plugin.description) {
        goog.userAgent.flash.detectedFlashVersion_ =
            goog.userAgent.flash.getVersion_(plugin.description);
      }
    }

    if (navigator.plugins['Shockwave Flash 2.0']) {
      goog.userAgent.flash.detectedFlash_ = true;
      goog.userAgent.flash.detectedFlashVersion_ = '2.0.0.11';
    }

  } else if (navigator.mimeTypes && navigator.mimeTypes.length) {
    var mimeType = navigator.mimeTypes['application/x-shockwave-flash'];
    goog.userAgent.flash.detectedFlash_ = mimeType && mimeType.enabledPlugin;
    if (goog.userAgent.flash.detectedFlash_) {
      goog.userAgent.flash.detectedFlashVersion_ =
          goog.userAgent.flash.getVersion_(mimeType.enabledPlugin.description);
    }

  } else {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      // Try 7 first, since we know we can use GetVariable with it
      var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
      goog.userAgent.flash.detectedFlash_ = true;
      goog.userAgent.flash.detectedFlashVersion_ =
          goog.userAgent.flash.getVersion_(ax.GetVariable('$version'));
    } catch (e) {
      // Try 6 next, some versions are known to crash with GetVariable calls
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
        goog.userAgent.flash.detectedFlash_ = true;
        // First public version of Flash 6
        goog.userAgent.flash.detectedFlashVersion_ = '6.0.21';
      } catch (e2) {
       ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
        try {
          // Try the default activeX
          var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
          goog.userAgent.flash.detectedFlash_ = true;
          goog.userAgent.flash.detectedFlashVersion_ =
              goog.userAgent.flash.getVersion_(ax.GetVariable('$version'));
        } catch (e3) {
          // No flash
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Derived from Apple's suggested sniffer.
***REMOVED*** @param {string} desc e.g. Shockwave Flash 7.0 r61.
***REMOVED*** @return {string} 7.0.61.
***REMOVED*** @private
***REMOVED***
goog.userAgent.flash.getVersion_ = function(desc) {
  var matches = desc.match(/[\d]+/g);
  if (!matches) {
    return '';
  }
  matches.length = 3;  // To standardize IE vs FF
  return matches.join('.');
***REMOVED***


if (!goog.userAgent.flash.ASSUME_NO_FLASH) {
  goog.userAgent.flash.init_();
}


***REMOVED***
***REMOVED*** Whether we can detect that the browser has flash
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.flash.HAS_FLASH = goog.userAgent.flash.detectedFlash_;


***REMOVED***
***REMOVED*** Full version information of flash installed, in form 7.0.61
***REMOVED*** @type {string}
***REMOVED***
goog.userAgent.flash.VERSION = goog.userAgent.flash.detectedFlashVersion_;


***REMOVED***
***REMOVED*** Whether the installed flash version is as new or newer than a given version.
***REMOVED*** @param {string} version The version to check.
***REMOVED*** @return {boolean} Whether the installed flash version is as new or newer
***REMOVED***     than a given version.
***REMOVED***
goog.userAgent.flash.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.flash.VERSION,
                                     version) >= 0;
***REMOVED***
