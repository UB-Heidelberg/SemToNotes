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
***REMOVED*** @fileoverview Browser capability checks for the dom package.
***REMOVED***
***REMOVED***


goog.provide('goog.dom.BrowserFeature');

goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Enum of browser capabilities.
***REMOVED*** @enum {boolean}
***REMOVED***
goog.dom.BrowserFeature = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether attributes 'name' and 'type' can be added to an element after it's
  ***REMOVED*** created. False in Internet Explorer prior to version 9.
 ***REMOVED*****REMOVED***
  CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE ||
      goog.userAgent.isDocumentMode(9),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we can use element.children to access an element's Element
  ***REMOVED*** children. Available since Gecko 1.9.1, IE 9. (IE<9 also includes comment
  ***REMOVED*** nodes in the collection.)
 ***REMOVED*****REMOVED***
  CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE ||
      goog.userAgent.IE && goog.userAgent.isDocumentMode(9) ||
      goog.userAgent.GECKO && goog.userAgent.isVersion('1.9.1'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** Opera, Safari 3, and Internet Explorer 9 all support innerText but they
  ***REMOVED*** include text nodes in script and style tags. Not document-mode-dependent.
 ***REMOVED*****REMOVED***
  CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersion('9'),

 ***REMOVED*****REMOVED***
  ***REMOVED*** MSIE, Opera, and Safari>=4 support element.parentElement to access an
  ***REMOVED*** element's parent if it is an Element.
 ***REMOVED*****REMOVED***
  CAN_USE_PARENT_ELEMENT_PROPERTY: goog.userAgent.IE || goog.userAgent.OPERA ||
      goog.userAgent.WEBKIT,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether NoScope elements need a scoped element written before them in
  ***REMOVED*** innerHTML.
  ***REMOVED*** MSDN: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx#1
 ***REMOVED*****REMOVED***
  INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE
***REMOVED***
