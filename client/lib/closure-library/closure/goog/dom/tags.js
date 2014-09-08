// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for HTML element tag names.
***REMOVED***
goog.provide('goog.dom.tags');

goog.require('goog.object');


***REMOVED***
***REMOVED*** The void elements specified by
***REMOVED*** http://www.w3.org/TR/html-markup/syntax.html#void-elements.
***REMOVED*** @const
***REMOVED*** @type {!Object}
***REMOVED*** @private
***REMOVED***
goog.dom.tags.VOID_TAGS_ = goog.object.createSet(('area,base,br,col,command,' +
    'embed,hr,img,input,keygen,link,meta,param,source,track,wbr').split(','));


***REMOVED***
***REMOVED*** Checks whether the tag is void (with no contents allowed and no legal end
***REMOVED*** tag), for example 'br'.
***REMOVED*** @param {string} tagName The tag name in lower case.
***REMOVED*** @return {boolean}
***REMOVED***
goog.dom.tags.isVoidTag = function(tagName) {
  return goog.dom.tags.VOID_TAGS_[tagName] === true;
***REMOVED***
