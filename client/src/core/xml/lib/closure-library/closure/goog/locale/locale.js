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
***REMOVED*** @fileoverview Functions for dealing with Date formatting & Parsing,
***REMOVED*** County and language name, TimeZone list.
***REMOVED*** @suppress {deprecated} Use goog.i18n instead.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for locale related functions.
***REMOVED***
goog.provide('goog.locale');

goog.require('goog.locale.nativeNameConstants');


***REMOVED***
***REMOVED*** Set currnet locale to the specified one.
***REMOVED*** @param {string} localeName Locale name string. We are following the usage
***REMOVED***     in CLDR, but can make a few compromise for existing name compatibility.
***REMOVED***
goog.locale.setLocale = function(localeName) {
  // it is common to see people use '-' as locale part separator, normalize it.
  localeName = localeName.replace(/-/g, '_');
  goog.locale.activeLocale_ = localeName;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve the currnet locale
***REMOVED*** @return {string} Current locale name string.
***REMOVED*** @deprecated Use goog.LOCALE and goog.i18n instead.
***REMOVED***
goog.locale.getLocale = function() {
  if (!goog.locale.activeLocale_) {
    goog.locale.activeLocale_ = 'en';
  }
  return goog.locale.activeLocale_;
***REMOVED***


// Couple of constants to represent predefined Date/Time format type.
***REMOVED***
***REMOVED*** Enum of resources that can be registered.
***REMOVED*** @enum {string}
***REMOVED***
goog.locale.Resource = {
  DATE_TIME_CONSTANTS: 'DateTimeConstants',
  NUMBER_FORMAT_CONSTANTS: 'NumberFormatConstants',
  TIME_ZONE_CONSTANTS: 'TimeZoneConstants',
  LOCAL_NAME_CONSTANTS: 'LocaleNameConstants',

  TIME_ZONE_SELECTED_IDS: 'TimeZoneSelectedIds',
  TIME_ZONE_SELECTED_SHORT_NAMES: 'TimeZoneSelectedShortNames',
  TIME_ZONE_SELECTED_LONG_NAMES: 'TimeZoneSelectedLongNames',
  TIME_ZONE_ALL_LONG_NAMES: 'TimeZoneAllLongNames'
***REMOVED***


// BCP 47 language code:
//
// LanguageCode := LanguageSubtag
//                ("-" ScriptSubtag)?
//                ("-" RegionSubtag)?
//                ("-" VariantSubtag)?
//                ("@" Keyword "=" Value ("," Keyword "=" Value)* )?
//
// e.g. en-Latn-GB
//
// NOTICE:
// No special format checking is performed. If you pass a none valid
// language code as parameter to the following functions,
// you might get an unexpected result.


***REMOVED***
***REMOVED*** Returns the language-subtag of the given language code.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to extract language subtag from.
***REMOVED*** @return {string} Language subtag (in lowercase).
***REMOVED***
goog.locale.getLanguageSubTag = function(languageCode) {
  var result = languageCode.match(/^\w{2,3}([-_]|$)/);
  return result ? result[0].replace(/[_-]/g, '') : '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the region-sub-tag of the given language code.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to extract region subtag from.
***REMOVED*** @return {string} Region sub-tag (in uppercase).
***REMOVED***
goog.locale.getRegionSubTag = function(languageCode) {
  var result = languageCode.match(/[-_]([a-zA-Z]{2}|\d{3})([-_]|$)/);
  return result ? result[0].replace(/[_-]/g, '') : '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the script subtag of the locale with the first alphabet in uppercase
***REMOVED*** and the rest 3 characters in lower case.
***REMOVED***
***REMOVED*** @param {string} languageCode Language Code to extract script subtag from.
***REMOVED*** @return {string} Script subtag.
***REMOVED***
goog.locale.getScriptSubTag = function(languageCode) {
  var result = languageCode.split(/[-_]/g);
  return result.length > 1 && result[1].match(/^[a-zA-Z]{4}$/) ?
      result[1] : '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the variant-sub-tag of the given language code.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to extract variant subtag from.
***REMOVED*** @return {string} Variant sub-tag.
***REMOVED***
goog.locale.getVariantSubTag = function(languageCode) {
  var result = languageCode.match(/[-_]([a-z]{2,})/);
  return result ? result[1] : '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the country name of the provided language code in its native
***REMOVED*** language.
***REMOVED***
***REMOVED*** This method depends on goog.locale.nativeNameConstants available from
***REMOVED*** nativenameconstants.js. User of this method has to add dependency to this.
***REMOVED***
***REMOVED*** @param {string} countryCode Code to lookup the country name for.
***REMOVED***
***REMOVED*** @return {string} Country name for the provided language code.
***REMOVED***
goog.locale.getNativeCountryName = function(countryCode) {
  var key = goog.locale.getLanguageSubTag(countryCode) + '_' +
            goog.locale.getRegionSubTag(countryCode);
  return key in goog.locale.nativeNameConstants['COUNTRY'] ?
      goog.locale.nativeNameConstants['COUNTRY'][key] : countryCode;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the localized country name for the provided language code in the
***REMOVED*** current or provided locale symbols set.
***REMOVED***
***REMOVED*** This method depends on goog.locale.LocaleNameConstants__<locale> available
***REMOVED*** from http://go/js_locale_data. User of this method has to add dependency to
***REMOVED*** this.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to lookup the country name for.
***REMOVED*** @param {Object=} opt_localeSymbols If omitted the current locale symbol
***REMOVED***     set is used.
***REMOVED***
***REMOVED*** @return {string} Localized country name.
***REMOVED***
goog.locale.getLocalizedCountryName = function(languageCode,
                                               opt_localeSymbols) {
  if (!opt_localeSymbols) {
    opt_localeSymbols = goog.locale.getResource('LocaleNameConstants',
        goog.locale.getLocale());
  }
  var code = goog.locale.getRegionSubTag(languageCode);
  return code in opt_localeSymbols['COUNTRY'] ?
      opt_localeSymbols['COUNTRY'][code] : languageCode;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the language name of the provided language code in its native
***REMOVED*** language.
***REMOVED***
***REMOVED*** This method depends on goog.locale.nativeNameConstants available from
***REMOVED*** nativenameconstants.js. User of this method has to add dependency to this.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to lookup the language name for.
***REMOVED***
***REMOVED*** @return {string} Language name for the provided language code.
***REMOVED***
goog.locale.getNativeLanguageName = function(languageCode) {
  if (languageCode in goog.locale.nativeNameConstants['LANGUAGE'])
    return goog.locale.nativeNameConstants['LANGUAGE'][languageCode];
  var code = goog.locale.getLanguageSubTag(languageCode);
  return code in goog.locale.nativeNameConstants['LANGUAGE'] ?
      goog.locale.nativeNameConstants['LANGUAGE'][code] : languageCode;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the localized language name for the provided language code in
***REMOVED*** the current or provided locale symbols set.
***REMOVED***
***REMOVED*** This method depends on goog.locale.LocaleNameConstants__<locale> available
***REMOVED*** from http://go/js_locale_data. User of this method has to add dependency to
***REMOVED*** this.
***REMOVED***
***REMOVED*** @param {string} languageCode Language code to lookup the language name for.
***REMOVED*** @param {Object=} opt_localeSymbols locale symbol set if given.
***REMOVED***
***REMOVED*** @return {string} Localized language name of the provided language code.
***REMOVED***
goog.locale.getLocalizedLanguageName = function(languageCode,
                                                opt_localeSymbols) {
  if (!opt_localeSymbols) {
    opt_localeSymbols = goog.locale.getResource('LocaleNameConstants',
        goog.locale.getLocale());
  }
  if (languageCode in opt_localeSymbols['LANGUAGE'])
    return opt_localeSymbols['LANGUAGE'][languageCode];
  var code = goog.locale.getLanguageSubTag(languageCode);
  return code in opt_localeSymbols['LANGUAGE'] ?
      opt_localeSymbols['LANGUAGE'][code] : languageCode;
***REMOVED***


***REMOVED***
***REMOVED*** Register a resource object for certain locale.
***REMOVED*** @param {Object} dataObj The resource object being registered.
***REMOVED*** @param {goog.locale.Resource|string} resourceName String that represents
***REMOVED***     the type of resource.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerResource = function(dataObj, resourceName, localeName) {
  if (!goog.locale.resourceRegistry_[resourceName]) {
    goog.locale.resourceRegistry_[resourceName] = {***REMOVED***
  }
  goog.locale.resourceRegistry_[resourceName][localeName] = dataObj;
  // the first registered locale becomes active one. Usually there will be
  // only one locale per js binary bundle.
  if (!goog.locale.activeLocale_) {
    goog.locale.activeLocale_ = localeName;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the required resource has already been registered.
***REMOVED*** @param {goog.locale.Resource|string} resourceName String that represents
***REMOVED***     the type of resource.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED*** @return {boolean} Whether the required resource has already been registered.
***REMOVED***
goog.locale.isResourceRegistered = function(resourceName, localeName) {
  return resourceName in goog.locale.resourceRegistry_ &&
      localeName in goog.locale.resourceRegistry_[resourceName];
***REMOVED***


***REMOVED***
***REMOVED*** This object maps (resourceName, localeName) to a resourceObj.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.locale.resourceRegistry_ = {***REMOVED***


***REMOVED***
***REMOVED*** Registers the timezone constants object for a given locale name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED*** @deprecated Use goog.i18n.TimeZone, no longer need this.
***REMOVED***
goog.locale.registerTimeZoneConstants = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.TIME_ZONE_CONSTANTS, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Registers the LocaleNameConstants constants object for a given locale name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerLocaleNameConstants = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.LOCAL_NAME_CONSTANTS, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Registers the TimeZoneSelectedIds constants object for a given locale name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerTimeZoneSelectedIds = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.TIME_ZONE_SELECTED_IDS, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Registers the TimeZoneSelectedShortNames constants object for a given
***REMOVED***     locale name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerTimeZoneSelectedShortNames = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.TIME_ZONE_SELECTED_SHORT_NAMES, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Registers the TimeZoneSelectedLongNames constants object for a given locale
***REMOVED***     name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerTimeZoneSelectedLongNames = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.TIME_ZONE_SELECTED_LONG_NAMES, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Registers the TimeZoneAllLongNames constants object for a given locale name.
***REMOVED*** @param {Object} dataObj The resource object.
***REMOVED*** @param {string} localeName Locale ID.
***REMOVED***
goog.locale.registerTimeZoneAllLongNames = function(dataObj, localeName) {
  goog.locale.registerResource(
      dataObj, goog.locale.Resource.TIME_ZONE_ALL_LONG_NAMES, localeName);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve specified resource for certain locale.
***REMOVED*** @param {string} resourceName String that represents the type of resource.
***REMOVED*** @param {string=} opt_locale Locale ID, if not given, current locale
***REMOVED***     will be assumed.
***REMOVED*** @return {Object|undefined} The resource object that hold all the resource
***REMOVED***     data, or undefined if not available.
***REMOVED***
goog.locale.getResource = function(resourceName, opt_locale) {
  var locale = opt_locale ? opt_locale : goog.locale.getLocale();

  if (!(resourceName in goog.locale.resourceRegistry_)) {
    return undefined;
  }
  return goog.locale.resourceRegistry_[resourceName][locale];
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve specified resource for certain locale with fallback. For example,
***REMOVED*** request of 'zh_CN' will be resolved in following order: zh_CN, zh, en.
***REMOVED*** If none of the above succeeds, of if the resource as indicated by
***REMOVED*** resourceName does not exist at all, undefined will be returned.
***REMOVED***
***REMOVED*** @param {string} resourceName String that represents the type of resource.
***REMOVED*** @param {string=} opt_locale locale ID, if not given, current locale
***REMOVED***     will be assumed.
***REMOVED*** @return {Object|undefined} The resource object for desired locale.
***REMOVED***
goog.locale.getResourceWithFallback = function(resourceName, opt_locale) {
  var locale = opt_locale ? opt_locale : goog.locale.getLocale();

  if (!(resourceName in goog.locale.resourceRegistry_)) {
    return undefined;
  }

  if (locale in goog.locale.resourceRegistry_[resourceName]) {
    return goog.locale.resourceRegistry_[resourceName][locale];
  }

  // if locale has multiple parts (2 atmost in reality), fallback to base part.
  var locale_parts = locale.split('_');
  if (locale_parts.length > 1 &&
      locale_parts[0] in goog.locale.resourceRegistry_[resourceName]) {
    return goog.locale.resourceRegistry_[resourceName][locale_parts[0]];
  }

  // otherwise, fallback to 'en'
  return goog.locale.resourceRegistry_[resourceName]['en'];
***REMOVED***


// Export global functions that are used by the date time constants files.
// See http://go/js_locale_data
var registerLocalNameConstants = goog.locale.registerLocaleNameConstants;

var registerTimeZoneSelectedIds = goog.locale.registerTimeZoneSelectedIds;
var registerTimeZoneSelectedShortNames =
    goog.locale.registerTimeZoneSelectedShortNames;
var registerTimeZoneSelectedLongNames =
    goog.locale.registerTimeZoneSelectedLongNames;
var registerTimeZoneAllLongNames = goog.locale.registerTimeZoneAllLongNames;

