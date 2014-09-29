// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Browser capability checks for the events package.
***REMOVED***
***REMOVED***


goog.provide('goog.events.BrowserFeature');

goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Enum of browser capabilities.
***REMOVED*** @enum {boolean}
***REMOVED***
goog.events.BrowserFeature = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the button attribute of the event is W3C compliant.  False in
  ***REMOVED*** Internet Explorer prior to version 9; document-version dependent.
 ***REMOVED*****REMOVED***
  HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentMode(9),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the browser supports full W3C event model.
 ***REMOVED*****REMOVED***
  HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentMode(9),

 ***REMOVED*****REMOVED***
  ***REMOVED*** To prevent default in IE7-8 for certain keydown events we need set the
  ***REMOVED*** keyCode to -1.
 ***REMOVED*****REMOVED***
  SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE &&
      !goog.userAgent.isVersion('9'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the {@code navigator.onLine} property is supported.
 ***REMOVED*****REMOVED***
  HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT ||
      goog.userAgent.isVersion('528'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether HTML5 network online/offline events are supported.
 ***REMOVED*****REMOVED***
  HAS_HTML5_NETWORK_EVENT_SUPPORT:
      goog.userAgent.GECKO && goog.userAgent.isVersion('1.9b') ||
      goog.userAgent.IE && goog.userAgent.isVersion('8') ||
      goog.userAgent.OPERA && goog.userAgent.isVersion('9.5') ||
      goog.userAgent.WEBKIT && goog.userAgent.isVersion('528'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether HTML5 network events fire on document.body, or otherwise the
  ***REMOVED*** window.
 ***REMOVED*****REMOVED***
  HTML5_NETWORK_EVENTS_FIRE_ON_BODY:
      goog.userAgent.GECKO && !goog.userAgent.isVersion('8') ||
      goog.userAgent.IE && !goog.userAgent.isVersion('9'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether touch is enabled in the browser.
 ***REMOVED*****REMOVED***
  TOUCH_ENABLED:
      ('ontouchstart' in goog.global ||
          !!(goog.global['document'] &&
             document.documentElement &&
             'ontouchstart' in document.documentElement) ||
          // IE10 uses non-standard touch events, so it has a different check.
          !!(goog.global['navigator'] &&
              goog.global['navigator']['msMaxTouchPoints']))
***REMOVED***
