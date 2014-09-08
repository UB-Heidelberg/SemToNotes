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
***REMOVED*** @fileoverview Rendering engine detection.
***REMOVED*** @see <a href="http://www.useragentstring.com/">User agent strings</a>
***REMOVED*** For information on the browser brand (such as Safari versus Chrome), see
***REMOVED*** goog.userAgent.product.
***REMOVED*** @see ../demos/useragent.html
***REMOVED***

goog.provide('goog.userAgent');

goog.require('goog.labs.userAgent.browser');
goog.require('goog.labs.userAgent.engine');
goog.require('goog.labs.userAgent.util');
goog.require('goog.string');


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is IE.
***REMOVED***
goog.define('goog.userAgent.ASSUME_IE', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is GECKO.
***REMOVED***
goog.define('goog.userAgent.ASSUME_GECKO', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is WEBKIT.
***REMOVED***
goog.define('goog.userAgent.ASSUME_WEBKIT', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is a
***REMOVED***     mobile device running WebKit e.g. iPhone or Android.
***REMOVED***
goog.define('goog.userAgent.ASSUME_MOBILE_WEBKIT', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is OPERA.
***REMOVED***
goog.define('goog.userAgent.ASSUME_OPERA', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the
***REMOVED***     {@code goog.userAgent.isVersionOrHigher}
***REMOVED***     function will return true for any version.
***REMOVED***
goog.define('goog.userAgent.ASSUME_ANY_VERSION', false);


***REMOVED***
***REMOVED*** Whether we know the browser engine at compile-time.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.userAgent.BROWSER_KNOWN_ =
    goog.userAgent.ASSUME_IE ||
    goog.userAgent.ASSUME_GECKO ||
    goog.userAgent.ASSUME_MOBILE_WEBKIT ||
    goog.userAgent.ASSUME_WEBKIT ||
    goog.userAgent.ASSUME_OPERA;


***REMOVED***
***REMOVED*** Returns the userAgent string for the current browser.
***REMOVED***
***REMOVED*** @return {string} The userAgent string.
***REMOVED***
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
***REMOVED***


***REMOVED***
***REMOVED*** TODO(nnaze): Change type to "Navigator" and update compilation targets.
***REMOVED*** @return {Object} The native navigator object.
***REMOVED***
goog.userAgent.getNavigator = function() {
  // Need a local navigator reference instead of using the global one,
  // to avoid the rare case where they reference different objects.
  // (in a WorkerPool, for example).
  return goog.global['navigator'] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the user agent is Opera.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_OPERA :
    goog.labs.userAgent.browser.isOpera();


***REMOVED***
***REMOVED*** Whether the user agent is Internet Explorer.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_IE :
    goog.labs.userAgent.browser.isIE();


***REMOVED***
***REMOVED*** Whether the user agent is Gecko. Gecko is the rendering engine used by
***REMOVED*** Mozilla, Firefox, and others.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_GECKO :
    goog.labs.userAgent.engine.isGecko();


***REMOVED***
***REMOVED*** Whether the user agent is WebKit. WebKit is the rendering engine that
***REMOVED*** Safari, Android and others use.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT :
    goog.labs.userAgent.engine.isWebKit();


***REMOVED***
***REMOVED*** Whether the user agent is running on a mobile device.
***REMOVED***
***REMOVED*** This is a separate function so that the logic can be tested.
***REMOVED***
***REMOVED*** TODO(nnaze): Investigate swapping in goog.labs.userAgent.device.isMobile().
***REMOVED***
***REMOVED*** @return {boolean} Whether the user agent is running on a mobile device.
***REMOVED*** @private
***REMOVED***
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT &&
         goog.labs.userAgent.util.matchUserAgent('Mobile');
***REMOVED***


***REMOVED***
***REMOVED*** Whether the user agent is running on a mobile device.
***REMOVED***
***REMOVED*** TODO(nnaze): Consider deprecating MOBILE when labs.userAgent
***REMOVED***   is promoted as the gecko/webkit logic is likely inaccurate.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT ||
                        goog.userAgent.isMobile_();


***REMOVED***
***REMOVED*** Used while transitioning code to use WEBKIT instead.
***REMOVED*** @type {boolean}
***REMOVED*** @deprecated Use {@link goog.userAgent.product.SAFARI} instead.
***REMOVED*** TODO(nicksantos): Delete this from goog.userAgent.
***REMOVED***
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;


***REMOVED***
***REMOVED*** @return {string} the platform (operating system) the user agent is running
***REMOVED***     on. Default to empty string because navigator.platform may not be defined
***REMOVED***     (on Rhino, for example).
***REMOVED*** @private
***REMOVED***
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || '';
***REMOVED***


***REMOVED***
***REMOVED*** The platform (operating system) the user agent is running on. Default to
***REMOVED*** empty string because navigator.platform may not be defined (on Rhino, for
***REMOVED*** example).
***REMOVED*** @type {string}
***REMOVED***
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a Macintosh operating
***REMOVED***     system.
***REMOVED***
goog.define('goog.userAgent.ASSUME_MAC', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a Windows operating
***REMOVED***     system.
***REMOVED***
goog.define('goog.userAgent.ASSUME_WINDOWS', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a Linux operating
***REMOVED***     system.
***REMOVED***
goog.define('goog.userAgent.ASSUME_LINUX', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a X11 windowing
***REMOVED***     system.
***REMOVED***
goog.define('goog.userAgent.ASSUME_X11', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on Android.
***REMOVED***
goog.define('goog.userAgent.ASSUME_ANDROID', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on an iPhone.
***REMOVED***
goog.define('goog.userAgent.ASSUME_IPHONE', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on an iPad.
***REMOVED***
goog.define('goog.userAgent.ASSUME_IPAD', false);


***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.userAgent.PLATFORM_KNOWN_ =
    goog.userAgent.ASSUME_MAC ||
    goog.userAgent.ASSUME_WINDOWS ||
    goog.userAgent.ASSUME_LINUX ||
    goog.userAgent.ASSUME_X11 ||
    goog.userAgent.ASSUME_ANDROID ||
    goog.userAgent.ASSUME_IPHONE ||
    goog.userAgent.ASSUME_IPAD;


***REMOVED***
***REMOVED*** Initialize the goog.userAgent constants that define which platform the user
***REMOVED*** agent is running on.
***REMOVED*** @private
***REMOVED***
goog.userAgent.initPlatform_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on a Macintosh operating system.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM,
      'Mac');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on a Windows operating system.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedWindows_ = goog.string.contains(
      goog.userAgent.PLATFORM, 'Win');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on a Linux operating system.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM,
      'Linux');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on a X11 windowing system.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() &&
      goog.string.contains(goog.userAgent.getNavigator()['appVersion'] || '',
          'X11');

  // Need user agent string for Android/IOS detection
  var ua = goog.userAgent.getUserAgentString();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on Android.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedAndroid_ = !!ua &&
      goog.string.contains(ua, 'Android');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on an iPhone.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedIPhone_ = !!ua && goog.string.contains(ua, 'iPhone');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on an iPad.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedIPad_ = !!ua && goog.string.contains(ua, 'iPad');
***REMOVED***


if (!goog.userAgent.PLATFORM_KNOWN_) {
  goog.userAgent.initPlatform_();
}


***REMOVED***
***REMOVED*** Whether the user agent is running on a Macintosh operating system.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;


***REMOVED***
***REMOVED*** Whether the user agent is running on a Windows operating system.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;


***REMOVED***
***REMOVED*** Whether the user agent is running on a Linux operating system.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;


***REMOVED***
***REMOVED*** Whether the user agent is running on a X11 windowing system.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;


***REMOVED***
***REMOVED*** Whether the user agent is running on Android.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;


***REMOVED***
***REMOVED*** Whether the user agent is running on an iPhone.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;


***REMOVED***
***REMOVED*** Whether the user agent is running on an iPad.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ?
    goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;


***REMOVED***
***REMOVED*** @return {string} The string that describes the version number of the user
***REMOVED***     agent.
***REMOVED*** @private
***REMOVED***
goog.userAgent.determineVersion_ = function() {
  // All browsers have different ways to detect the version and they all have
  // different naming schemes.

  // version is a string rather than a number because it may contain 'b', 'a',
  // and so on.
  var version = '', re;

  if (goog.userAgent.OPERA && goog.global['opera']) {
    var operaVersion = goog.global['opera'].version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }

  if (goog.userAgent.GECKO) {
    re = /rv\:([^\);]+)(\)|;)/;
  } else if (goog.userAgent.IE) {
    re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/;
  } else if (goog.userAgent.WEBKIT) {
    // WebKit/125.4
    re = /WebKit\/(\S+)/;
  }

  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString());
    version = arr ? arr[1] : '';
  }

  if (goog.userAgent.IE) {
    // IE9 can be in document mode 9 but be reporting an inconsistent user agent
    // version.  If it is identifying as a version lower than 9 we take the
    // documentMode as the version instead.  IE8 has similar behavior.
    // It is recommended to set the X-UA-Compatible header to ensure that IE9
    // uses documentMode 9.
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }

  return version;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number|undefined} Returns the document mode (for testing).
***REMOVED*** @private
***REMOVED***
goog.userAgent.getDocumentMode_ = function() {
  // NOTE(user): goog.userAgent may be used in context where there is no DOM.
  var doc = goog.global['document'];
  return doc ? doc['documentMode'] : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** The version of the user agent. This is a string because it might contain
***REMOVED*** 'b' (as in beta) as well as multiple dots.
***REMOVED*** @type {string}
***REMOVED***
goog.userAgent.VERSION = goog.userAgent.determineVersion_();


***REMOVED***
***REMOVED*** Compares two version numbers.
***REMOVED***
***REMOVED*** @param {string} v1 Version of first item.
***REMOVED*** @param {string} v2 Version of second item.
***REMOVED***
***REMOVED*** @return {number}  1 if first argument is higher
***REMOVED***                   0 if arguments are equal
***REMOVED***                  -1 if second argument is higher.
***REMOVED*** @deprecated Use goog.string.compareVersions.
***REMOVED***
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
***REMOVED***


***REMOVED***
***REMOVED*** Cache for {@link goog.userAgent.isVersionOrHigher}.
***REMOVED*** Calls to compareVersions are surprisingly expensive and, as a browser's
***REMOVED*** version number is unlikely to change during a session, we cache the results.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.userAgent.isVersionOrHigherCache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Whether the user agent version is higher or the same as the given version.
***REMOVED*** NOTE: When checking the version numbers for Firefox and Safari, be sure to
***REMOVED*** use the engine's version, not the browser's version number.  For example,
***REMOVED*** Firefox 3.0 corresponds to Gecko 1.9 and Safari 3.0 to Webkit 522.11.
***REMOVED*** Opera and Internet Explorer versions match the product release number.<br>
***REMOVED*** @see <a href="http://en.wikipedia.org/wiki/Safari_version_history">
***REMOVED***     Webkit</a>
***REMOVED*** @see <a href="http://en.wikipedia.org/wiki/Gecko_engine">Gecko</a>
***REMOVED***
***REMOVED*** @param {string|number} version The version to check.
***REMOVED*** @return {boolean} Whether the user agent version is higher or the same as
***REMOVED***     the given version.
***REMOVED***
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION ||
      goog.userAgent.isVersionOrHigherCache_[version] ||
      (goog.userAgent.isVersionOrHigherCache_[version] =
          goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
***REMOVED***


***REMOVED***
***REMOVED*** Deprecated alias to {@code goog.userAgent.isVersionOrHigher}.
***REMOVED*** @param {string|number} version The version to check.
***REMOVED*** @return {boolean} Whether the user agent version is higher or the same as
***REMOVED***     the given version.
***REMOVED*** @deprecated Use goog.userAgent.isVersionOrHigher().
***REMOVED***
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;


***REMOVED***
***REMOVED*** Whether the IE effective document mode is higher or the same as the given
***REMOVED*** document mode version.
***REMOVED*** NOTE: Only for IE, return false for another browser.
***REMOVED***
***REMOVED*** @param {number} documentMode The document mode version to check.
***REMOVED*** @return {boolean} Whether the IE effective document mode is higher or the
***REMOVED***     same as the given version.
***REMOVED***
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
***REMOVED***


***REMOVED***
***REMOVED*** Deprecated alias to {@code goog.userAgent.isDocumentModeOrHigher}.
***REMOVED*** @param {number} version The version to check.
***REMOVED*** @return {boolean} Whether the IE effective document mode is higher or the
***REMOVED***      same as the given version.
***REMOVED*** @deprecated Use goog.userAgent.isDocumentModeOrHigher().
***REMOVED***
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;


***REMOVED***
***REMOVED*** For IE version < 7, documentMode is undefined, so attempt to use the
***REMOVED*** CSS1Compat property to see if we are in standards mode. If we are in
***REMOVED*** standards mode, treat the browser version as the document mode. Otherwise,
***REMOVED*** IE is emulating version 5.
***REMOVED*** @type {number|undefined}
***REMOVED*** @const
***REMOVED***
goog.userAgent.DOCUMENT_MODE = (function() {
  var doc = goog.global['document'];
  if (!doc || !goog.userAgent.IE) {
    return undefined;
  }
  var mode = goog.userAgent.getDocumentMode_();
  return mode || (doc['compatMode'] == 'CSS1Compat' ?
      parseInt(goog.userAgent.VERSION, 10) : 5);
})();
