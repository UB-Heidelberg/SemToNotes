// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of the goog.i18n.CharNameFetcher interface. This
***REMOVED*** interface is used to retrieve individual character names.
***REMOVED***

goog.provide('goog.i18n.uChar.NameFetcher');



***REMOVED***
***REMOVED*** NameFetcher interface. Implementations of this interface are used to retrieve
***REMOVED*** Unicode character names.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.i18n.uChar.NameFetcher = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the names of a given set of characters and stores them in a cache
***REMOVED*** for fast retrieval. Offline implementations can simply provide an empty
***REMOVED*** implementation.
***REMOVED***
***REMOVED*** @param {string} characters The list of characters in base 88 to fetch. These
***REMOVED***     lists are stored by category and subcategory in the
***REMOVED***     goog.i18n.charpickerdata class.
***REMOVED***
goog.i18n.uChar.NameFetcher.prototype.prefetch = function(characters) {
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the name of a particular character.
***REMOVED***
***REMOVED*** @param {string} character The character to retrieve.
***REMOVED*** @param {function(?string)} callback The callback function called when the
***REMOVED***     name retrieval is complete, contains a single string parameter with the
***REMOVED***     codepoint name, this parameter will be null if the character name is not
***REMOVED***     defined.
***REMOVED***
goog.i18n.uChar.NameFetcher.prototype.getName = function(character, callback) {
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the name of a given character is available to be retrieved by
***REMOVED*** the getName() function.
***REMOVED***
***REMOVED*** @param {string} character The character to test.
***REMOVED*** @return {boolean} True if the fetcher can retrieve or has a name available
***REMOVED***     for the given character.
***REMOVED***
goog.i18n.uChar.NameFetcher.prototype.isNameAvailable = function(character) {
***REMOVED***

