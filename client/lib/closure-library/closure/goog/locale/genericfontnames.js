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
***REMOVED*** @fileoverview Functions to list locale-specific font list and generic name.
***REMOVED*** Generic name used for a font family would be locale dependant. For example,
***REMOVED*** for 'zh'(Chinese) users, the name for Serif family would be in Chinese.
***REMOVED*** Further documentation at: http://go/genericfontnames.
***REMOVED***

goog.provide('goog.locale.genericFontNames');


***REMOVED***
***REMOVED*** This object maps (resourceName, localeName) to a resourceObj.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.locale.genericFontNames.data_ = {***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given locale id to standard form. eg: zh_Hant_TW.
***REMOVED*** Many a times, input locale would be like: zh-tw, zh-hant-tw.
***REMOVED*** @param {string} locale The locale id to be normalized.
***REMOVED*** @return {string} Normalized locale id.
***REMOVED*** @private
***REMOVED***
goog.locale.genericFontNames.normalize_ = function(locale) {
  locale = locale.replace(/-/g, '_');
  locale = locale.replace(/_[a-z]{2}$/,
      function(str) {
        return str.toUpperCase();
      });

  locale = locale.replace(/[a-z]{4}/,
      function(str) {
        return str.substring(0, 1).toUpperCase() +
               str.substring(1);
      });
  return locale;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the list of fonts and their generic names for the given locale.
***REMOVED*** @param {string} locale The locale for which font lists and font family names
***REMOVED***     to be produced. The expected locale id is as described in
***REMOVED***     http://wiki/Main/IIISynonyms in all lowercase for easy matching.
***REMOVED***     Smallest possible id is expected.
***REMOVED***     Examples: 'zh', 'zh-tw', 'iw' instead of 'zh-CN', 'zh-Hant-TW', 'he'.
***REMOVED*** @return {Array.<Object>} List of objects with generic name as 'caption' and
***REMOVED***     corresponding font name lists as 'value' property.
***REMOVED***
goog.locale.genericFontNames.getList = function(locale) {

  locale = goog.locale.genericFontNames.normalize_(locale);
  if (locale in goog.locale.genericFontNames.data_) {
    return goog.locale.genericFontNames.data_[locale];
  }
  return [];
***REMOVED***
