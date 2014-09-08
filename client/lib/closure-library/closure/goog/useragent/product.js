// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Detects the specific browser and not just the rendering engine.
***REMOVED***
***REMOVED***

goog.provide('goog.userAgent.product');

goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** @define {boolean} Whether the code is running on the Firefox web browser.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_FIREFOX', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the code is running on the Camino web browser.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_CAMINO', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the product is an
***REMOVED***     iPhone.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_IPHONE', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the product is an
***REMOVED***     iPad.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_IPAD', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether we know at compile-time that the product is an
***REMOVED***     Android phone.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_ANDROID', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the code is running on the Chrome web browser.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_CHROME', false);


***REMOVED***
***REMOVED*** @define {boolean} Whether the code is running on the Safari web browser.
***REMOVED***
goog.define('goog.userAgent.product.ASSUME_SAFARI', false);


***REMOVED***
***REMOVED*** Whether we know the product type at compile-time.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.userAgent.product.PRODUCT_KNOWN_ =
    goog.userAgent.ASSUME_IE ||
    goog.userAgent.ASSUME_OPERA ||
    goog.userAgent.product.ASSUME_FIREFOX ||
    goog.userAgent.product.ASSUME_CAMINO ||
    goog.userAgent.product.ASSUME_IPHONE ||
    goog.userAgent.product.ASSUME_IPAD ||
    goog.userAgent.product.ASSUME_ANDROID ||
    goog.userAgent.product.ASSUME_CHROME ||
    goog.userAgent.product.ASSUME_SAFARI;


***REMOVED***
***REMOVED*** Right now we just focus on Tier 1-3 browsers at:
***REMOVED*** http://wiki/Nonconf/ProductPlatformGuidelines
***REMOVED*** As well as the YUI grade A browsers at:
***REMOVED*** http://developer.yahoo.com/yui/articles/gbs/
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.userAgent.product.init_ = function() {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on the Firefox web browser.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedFirefox_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on the Camino web browser.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedCamino_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on an iPhone or iPod touch.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedIphone_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on an iPad
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedIpad_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on the default browser on an Android phone.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedAndroid_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on the Chrome web browser.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedChrome_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the code is running on the Safari web browser.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.product.detectedSafari_ = false;

  var ua = goog.userAgent.getUserAgentString();
  if (!ua) {
    return;
  }

  // The order of the if-statements in the following code is important.
  // For example, in the WebKit section, we put Chrome in front of Safari
  // because the string 'Safari' is present on both of those browsers'
  // userAgent strings as well as the string we are looking for.
  // The idea is to prevent accidental detection of more than one client.

  if (ua.indexOf('Firefox') != -1) {
    goog.userAgent.product.detectedFirefox_ = true;
  } else if (ua.indexOf('Camino') != -1) {
    goog.userAgent.product.detectedCamino_ = true;
  } else if (ua.indexOf('iPhone') != -1 || ua.indexOf('iPod') != -1) {
    goog.userAgent.product.detectedIphone_ = true;
  } else if (ua.indexOf('iPad') != -1) {
    goog.userAgent.product.detectedIpad_ = true;
  } else if (ua.indexOf('Chrome') != -1) {
    goog.userAgent.product.detectedChrome_ = true;
  } else if (ua.indexOf('Android') != -1) {
    goog.userAgent.product.detectedAndroid_ = true;
  } else if (ua.indexOf('Safari') != -1) {
    goog.userAgent.product.detectedSafari_ = true;
  }
***REMOVED***

if (!goog.userAgent.product.PRODUCT_KNOWN_) {
  goog.userAgent.product.init_();
}


***REMOVED***
***REMOVED*** Whether the code is running on the Opera web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.OPERA = goog.userAgent.OPERA;


***REMOVED***
***REMOVED*** Whether the code is running on an IE web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.IE = goog.userAgent.IE;


***REMOVED***
***REMOVED*** Whether the code is running on the Firefox web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_FIREFOX :
    goog.userAgent.product.detectedFirefox_;


***REMOVED***
***REMOVED*** Whether the code is running on the Camino web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_CAMINO :
    goog.userAgent.product.detectedCamino_;


***REMOVED***
***REMOVED*** Whether the code is running on an iPhone or iPod touch.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_IPHONE :
    goog.userAgent.product.detectedIphone_;


***REMOVED***
***REMOVED*** Whether the code is running on an iPad.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_IPAD :
    goog.userAgent.product.detectedIpad_;


***REMOVED***
***REMOVED*** Whether the code is running on the default browser on an Android phone.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_ANDROID :
    goog.userAgent.product.detectedAndroid_;


***REMOVED***
***REMOVED*** Whether the code is running on the Chrome web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_CHROME :
    goog.userAgent.product.detectedChrome_;


***REMOVED***
***REMOVED*** Whether the code is running on the Safari web browser.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ?
    goog.userAgent.product.ASSUME_SAFARI :
    goog.userAgent.product.detectedSafari_;
