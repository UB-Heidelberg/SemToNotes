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

goog.require('goog.string');


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is IE.
***REMOVED***
goog.userAgent.ASSUME_IE = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is GECKO.
***REMOVED***
goog.userAgent.ASSUME_GECKO = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is WEBKIT.
***REMOVED***
goog.userAgent.ASSUME_WEBKIT = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is a
***REMOVED***     mobile device running WebKit e.g. iPhone or Android.
***REMOVED***
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the browser is OPERA.
***REMOVED***
goog.userAgent.ASSUME_OPERA = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the {@code goog.userAgent.isVersion} function will
***REMOVED***     return true for any version.
***REMOVED***
goog.userAgent.ASSUME_ANY_VERSION = false;


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
***REMOVED*** Some user agents (I'm thinking of you, Gears WorkerPool) do not expose a
***REMOVED*** navigator object off the global scope.  In that case we return null.
***REMOVED***
***REMOVED*** @return {?string} The userAgent string or null if there is none.
***REMOVED***
goog.userAgent.getUserAgentString = function() {
  return goog.global['navigator'] ? goog.global['navigator'].userAgent : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object} The native navigator object.
***REMOVED***
goog.userAgent.getNavigator = function() {
  // Need a local navigator reference instead of using the global one,
  // to avoid the rare case where they reference different objects.
  // (in a WorkerPool, for example).
  return goog.global['navigator'];
***REMOVED***


***REMOVED***
***REMOVED*** Initializer for goog.userAgent.
***REMOVED***
***REMOVED*** This is a named function so that it can be stripped via the jscompiler
***REMOVED*** option for stripping types.
***REMOVED*** @private
***REMOVED***
goog.userAgent.init_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent string denotes Opera.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedOpera_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent string denotes Internet Explorer. This includes
  ***REMOVED*** other browsers using Trident as its rendering engine. For example AOL
  ***REMOVED*** and Netscape 8
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedIe_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent string denotes WebKit. WebKit is the rendering
  ***REMOVED*** engine that Safari, Android and others use.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedWebkit_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent string denotes a mobile device.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedMobile_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent string denotes Gecko. Gecko is the rendering
  ***REMOVED*** engine used by Mozilla, Mozilla Firefox, Camino and many more.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedGecko_ = false;

  var ua;
  if (!goog.userAgent.BROWSER_KNOWN_ &&
      (ua = goog.userAgent.getUserAgentString())) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf('Opera') == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ &&
        ua.indexOf('MSIE') != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ &&
        ua.indexOf('WebKit') != -1;
    // WebKit also gives navigator.product string equal to 'Gecko'.
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ &&
        ua.indexOf('Mobile') != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ &&
        !goog.userAgent.detectedWebkit_ && navigator.product == 'Gecko';
  }
***REMOVED***


if (!goog.userAgent.BROWSER_KNOWN_) {
  goog.userAgent.init_();
}


***REMOVED***
***REMOVED*** Whether the user agent is Opera.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;


***REMOVED***
***REMOVED*** Whether the user agent is Internet Explorer. This includes other browsers
***REMOVED*** using Trident as its rendering engine. For example AOL and Netscape 8
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;


***REMOVED***
***REMOVED*** Whether the user agent is Gecko. Gecko is the rendering engine used by
***REMOVED*** Mozilla, Mozilla Firefox, Camino and many more.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_GECKO :
    goog.userAgent.detectedGecko_;


***REMOVED***
***REMOVED*** Whether the user agent is WebKit. WebKit is the rendering engine that
***REMOVED*** Safari, Android and others use.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ?
    goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT :
    goog.userAgent.detectedWebkit_;


***REMOVED***
***REMOVED*** Whether the user agent is running on a mobile device.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT ||
                        goog.userAgent.detectedMobile_;


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
goog.userAgent.ASSUME_MAC = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a Windows operating
***REMOVED***     system.
***REMOVED***
goog.userAgent.ASSUME_WINDOWS = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a Linux operating
***REMOVED***     system.
***REMOVED***
goog.userAgent.ASSUME_LINUX = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on a X11 windowing
***REMOVED***     system.
***REMOVED***
goog.userAgent.ASSUME_X11 = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on Android.
***REMOVED***
goog.userAgent.ASSUME_ANDROID = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on an iPhone.
***REMOVED***
goog.userAgent.ASSUME_IPHONE = false;


***REMOVED***
***REMOVED*** @define {boolean} Whether the user agent is running on an iPad.
***REMOVED***
goog.userAgent.ASSUME_IPAD = false;


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
  goog.userAgent.detectedAndroid_ = !!ua && ua.indexOf('Android') >= 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on an iPhone.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedIPhone_ = !!ua && ua.indexOf('iPhone') >= 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the user agent is running on an iPad.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.detectedIPad_ = !!ua && ua.indexOf('iPad') >= 0;
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
    version = typeof operaVersion == 'function' ? operaVersion() : operaVersion;
  } else {
    if (goog.userAgent.GECKO) {
      re = /rv\:([^\);]+)(\)|;)/;
    } else if (goog.userAgent.IE) {
      re = /MSIE\s+([^\);]+)(\)|;)/;
    } else if (goog.userAgent.WEBKIT) {
      // WebKit/125.4
      re = /WebKit\/(\S+)/;
    }
    if (re) {
      var arr = re.exec(goog.userAgent.getUserAgentString());
      version = arr ? arr[1] : '';
    }
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
***REMOVED*** Cache for {@link goog.userAgent.isVersion}. Calls to compareVersions are
***REMOVED*** surprisingly expensive and as a browsers version number is unlikely to change
***REMOVED*** during a session we cache the results.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.userAgent.isVersionCache_ = {***REMOVED***


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
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION ||
      goog.userAgent.isVersionCache_[version] ||
      (goog.userAgent.isVersionCache_[version] =
          goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
***REMOVED***


***REMOVED***
***REMOVED*** Whether the IE effective document mode is higher or the same as the given
***REMOVED*** document mode version.
***REMOVED*** NOTE: Only for IE, return false for another browser.
***REMOVED***
***REMOVED*** @param {number} documentMode The document mode version to check.
***REMOVED*** @return {boolean} Whether the IE effective document mode is higher or the
***REMOVED***     same as the given version.
***REMOVED***
goog.userAgent.isDocumentMode = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
***REMOVED***


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
