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
***REMOVED*** @fileoverview Closure user agent platform detection.
***REMOVED*** @see <a href="http://www.useragentstring.com/">User agent strings</a>
***REMOVED*** For more information on browser brand, rendering engine, or device see the
***REMOVED*** other sub-namespaces in goog.labs.userAgent (browser, engine, and device
***REMOVED*** respectively).
***REMOVED***
***REMOVED***

goog.provide('goog.labs.userAgent.platform');

goog.require('goog.labs.userAgent.util');
goog.require('goog.string');


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is Android.
***REMOVED***
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent('Android');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is iPod.
***REMOVED***
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent('iPod');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is iPhone.
***REMOVED***
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent('iPhone') &&
      !goog.labs.userAgent.util.matchUserAgent('iPod');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is iPad.
***REMOVED***
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent('iPad');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is iOS.
***REMOVED***
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() ||
      goog.labs.userAgent.platform.isIpad() ||
      goog.labs.userAgent.platform.isIpod();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is Mac.
***REMOVED***
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent('Macintosh');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is Linux.
***REMOVED***
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent('Linux');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is Windows.
***REMOVED***
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent('Windows');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the platform is ChromeOS.
***REMOVED***
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent('CrOS');
***REMOVED***


***REMOVED***
***REMOVED*** The version of the platform. We only determine the version for Windows,
***REMOVED*** Mac, and Chrome OS. It doesn't make much sense on Linux. For Windows, we only
***REMOVED*** look at the NT version. Non-NT-based versions (e.g. 95, 98, etc.) are given
***REMOVED*** version 0.0.
***REMOVED***
***REMOVED*** @return {string} The platform version or empty string if version cannot be
***REMOVED***     determined.
***REMOVED***
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  var version = '', re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows NT ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = '0.0';
    }
  } else if (goog.labs.userAgent.platform.isIos()) {
    re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
    var match = re.exec(userAgentString);
    // Report the version as x.y.z and not x_y_z
    version = match && match[1].replace(/_/g, '.');
  } else if (goog.labs.userAgent.platform.isMacintosh()) {
    re = /Mac OS X ([0-9_.]+)/;
    var match = re.exec(userAgentString);
    // Note: some old versions of Camino do not report an OSX version.
    // Default to 10.
    version = match ? match[1].replace(/_/g, '.') : '10';
  } else if (goog.labs.userAgent.platform.isAndroid()) {
    re = /Android\s+([^\);]+)(\)|;)/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  } else if (goog.labs.userAgent.platform.isChromeOS()) {
    re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  }
  return version || '';
***REMOVED***


***REMOVED***
***REMOVED*** @param {string|number} version The version to check.
***REMOVED*** @return {boolean} Whether the browser version is higher or the same as the
***REMOVED***     given version.
***REMOVED***
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(),
                                     version) >= 0;
***REMOVED***
