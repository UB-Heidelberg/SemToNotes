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
***REMOVED*** @fileoverview Functions for listing timezone names.
***REMOVED*** @suppress {deprecated} Use goog.i18n instead.
***REMOVED***

***REMOVED*** @suppress {extraProvide}***REMOVED***
goog.provide('goog.locale.TimeZoneList');

goog.require('goog.locale');


***REMOVED***
***REMOVED*** Returns the displayable list of short timezone names paired with its id for
***REMOVED*** the current locale, selected based on the region or language provided.
***REMOVED***
***REMOVED*** This method depends on goog.locale.TimeZone*__<locale> available
***REMOVED*** from http://go/js_locale_data. Users of this method must add a dependency on
***REMOVED*** this.
***REMOVED***
***REMOVED*** @param {string=} opt_regionOrLang If region tag is provided, timezone ids
***REMOVED***    specific this region are considered. If language is provided, all regions
***REMOVED***    for which this language is defacto official is considered. If
***REMOVED***    this parameter is not speficied, current locale is used to
***REMOVED***    extract this information.
***REMOVED***
***REMOVED*** @return {!Array.<Object>} Localized and relevant list of timezone names
***REMOVED***    and ids.
***REMOVED***
goog.locale.getTimeZoneSelectedShortNames = function(opt_regionOrLang) {
  return goog.locale.getTimeZoneNameList_('TimeZoneSelectedShortNames',
      opt_regionOrLang);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the displayable list of long timezone names paired with its id for
***REMOVED*** the current locale, selected based on the region or language provided.
***REMOVED***
***REMOVED*** This method depends on goog.locale.TimeZone*__<locale> available
***REMOVED*** from http://go/js_locale_data. Users of this method must add a dependency on
***REMOVED*** this.
***REMOVED***
***REMOVED*** @param {string=} opt_regionOrLang If region tag is provided, timezone ids
***REMOVED***    specific this region are considered. If language is provided, all regions
***REMOVED***    for which this language is defacto official is considered. If
***REMOVED***    this parameter is not speficied, current locale is used to
***REMOVED***    extract this information.
***REMOVED***
***REMOVED*** @return {!Array.<Object>} Localized and relevant list of timezone names
***REMOVED***    and ids.
***REMOVED***
goog.locale.getTimeZoneSelectedLongNames = function(opt_regionOrLang) {
  return goog.locale.getTimeZoneNameList_('TimeZoneSelectedLongNames',
      opt_regionOrLang);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the displayable list of long timezone names paired with its id for
***REMOVED*** the current locale.
***REMOVED***
***REMOVED*** This method depends on goog.locale.TimeZoneAllLongNames__<locale> available
***REMOVED*** from http://go/js_locale_data. Users of this method must add a dependency on
***REMOVED*** this.
***REMOVED***
***REMOVED*** @return {Array.<Object>} localized and relevant list of timezone names
***REMOVED***    and ids.
***REMOVED***
goog.locale.getTimeZoneAllLongNames = function() {
  var locale = goog.locale.getLocale();
  return***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (
      goog.locale.getResource('TimeZoneAllLongNames', locale));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the displayable list of timezone names paired with its id for
***REMOVED*** the current locale, selected based on the region or language provided.
***REMOVED***
***REMOVED*** This method depends on goog.locale.TimeZone*__<locale> available
***REMOVED*** from http://go/js_locale_data. Users of this method must add a dependency on
***REMOVED*** this.
***REMOVED***
***REMOVED*** @param {string} nameType Resource name to be loaded to get the names.
***REMOVED***
***REMOVED*** @param {string=} opt_resource If resource is region tag, timezone ids
***REMOVED***    specific this region are considered. If it is language, all regions
***REMOVED***    for which this language is defacto official is considered. If it is
***REMOVED***    undefined, current locale is used to extract this information.
***REMOVED***
***REMOVED*** @return {!Array.<Object>} Localized and relevant list of timezone names
***REMOVED***    and ids.
***REMOVED*** @private
***REMOVED***
goog.locale.getTimeZoneNameList_ = function(nameType, opt_resource) {
  var locale = goog.locale.getLocale();

  if (!opt_resource) {
    opt_resource = goog.locale.getRegionSubTag(locale);
  }
  // if there is no region subtag, use the language itself as the resource
  if (!opt_resource) {
    opt_resource = locale;
  }

  var names = goog.locale.getResource(nameType, locale);
  var ids = goog.locale.getResource('TimeZoneSelectedIds', opt_resource);
  var len = ids.length;
  var result = [];

  for (var i = 0; i < len; i++) {
    var id = ids[i];
    result.push({'id': id, 'name': names[id]});
  }
  return result;
***REMOVED***

