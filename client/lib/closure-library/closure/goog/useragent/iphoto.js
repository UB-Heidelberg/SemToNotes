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
***REMOVED*** @fileoverview Newer versions of iPhoto include a Safari plugin which allows
***REMOVED*** the browser to detect if iPhoto is installed. Adapted from detection code
***REMOVED*** built into the Mac.com Gallery RSS feeds.
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED*** @see ../demos/useragent.html
***REMOVED***


goog.provide('goog.userAgent.iphoto');

goog.require('goog.string');
goog.require('goog.userAgent');


(function() {
  var hasIphoto = false;
  var version = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The plugin description string contains the version number as in the form
  ***REMOVED*** 'iPhoto 700'. This returns just the version number as a dotted string,
  ***REMOVED*** e.g., '7.0.0', compatible with {@code goog.string.compareVersions}.
  ***REMOVED*** @param {string} desc The version string.
  ***REMOVED*** @return {string} The dotted version.
 ***REMOVED*****REMOVED***
  function getIphotoVersion(desc) {
    var matches = desc.match(/\d/g);
    return matches.join('.');
  }

  if (goog.userAgent.WEBKIT &&
      navigator.mimeTypes &&
      navigator.mimeTypes.length > 0) {
    var iphoto = navigator.mimeTypes['application/photo'];

    if (iphoto) {
      hasIphoto = true;
      var description = iphoto['description'];

      if (description) {
        version = getIphotoVersion(description);
      }
    }
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we can detect that the user has iPhoto installed.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  goog.userAgent.iphoto.HAS_IPHOTO = hasIphoto;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The version of iPhoto installed if found.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  goog.userAgent.iphoto.VERSION = version;

})();


***REMOVED***
***REMOVED*** Whether the installed version of iPhoto is as new or newer than a given
***REMOVED*** version.
***REMOVED*** @param {string} version The version to check.
***REMOVED*** @return {boolean} Whether the installed version of iPhoto is as new or newer
***REMOVED***     than a given version.
***REMOVED***
goog.userAgent.iphoto.isVersion = function(version) {
  return goog.string.compareVersions(
      goog.userAgent.iphoto.VERSION, version) >= 0;
***REMOVED***
