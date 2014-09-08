// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A utility to get better currency format pattern.
***REMOVED***
***REMOVED*** This module implements a new currency format representation model. It
***REMOVED*** provides 3 currency representation forms: global, portable and local. Local
***REMOVED*** format is the most popular format people use to represent currency in its
***REMOVED*** circulating country without worrying about how it should be distinguished
***REMOVED*** from other currencies.  Global format is a formal representation in context
***REMOVED*** of multiple currencies in same page, it is ISO 4217 currency code. Portable
***REMOVED*** format is a compromise between global and local. It looks similar to how
***REMOVED*** people would like to see how their currency is being represented in other
***REMOVED*** media. While at the same time, it should be distinguishable to world's
***REMOVED*** popular currencies (like USD, EUR) and currencies somewhat relevant in the
***REMOVED*** area (like CNY in HK, though native currency is HKD). There is no guarantee
***REMOVED*** of uniqueness.
***REMOVED***
***REMOVED***


goog.provide('goog.i18n.currency');
goog.provide('goog.i18n.currency.CurrencyInfo');
goog.provide('goog.i18n.currency.CurrencyInfoTier2');


***REMOVED***
***REMOVED*** The mask of precision field.
***REMOVED*** @private
***REMOVED***
goog.i18n.currency.PRECISION_MASK_ = 0x07;


***REMOVED***
***REMOVED*** Whether the currency sign should be positioned after the number.
***REMOVED*** @private
***REMOVED***
goog.i18n.currency.POSITION_FLAG_ = 0x10;


***REMOVED***
***REMOVED*** Whether a space should be inserted between the number and currency sign.
***REMOVED*** @private
***REMOVED***
goog.i18n.currency.SPACE_FLAG_ = 0x20;


***REMOVED***
***REMOVED*** Whether tier2 was enabled already by calling addTier2Support().
***REMOVED*** @private
***REMOVED***
goog.i18n.currency.tier2Enabled_ = false;


***REMOVED***
***REMOVED*** This function will add tier2 currency support. Be default, only tier1
***REMOVED*** (most popular currencies) are supported. If an application really needs
***REMOVED*** to support some of the rarely used currencies, it should call this function
***REMOVED*** before any other functions in this namespace.
***REMOVED***
goog.i18n.currency.addTier2Support = function() {
  // Protection from executing this these again and again.
  if (!goog.i18n.currency.tier2Enabled_) {
    for (var key in goog.i18n.currency.CurrencyInfoTier2) {
      goog.i18n.currency.CurrencyInfo[key] =
          goog.i18n.currency.CurrencyInfoTier2[key];
    }
    goog.i18n.currency.tier2Enabled_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Global currency pattern always uses ISO-4217 currency code as prefix. Local
***REMOVED*** currency sign is added if it is different from currency code. Each currency
***REMOVED*** is unique in this form. The negative side is that ISO code looks weird in
***REMOVED*** some countries as people normally do not use it. Local currency sign
***REMOVED*** alleviates the problem, but also makes it a little verbose.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Global currency pattern string for given currency.
***REMOVED***
goog.i18n.currency.getGlobalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  var patternNum = info[0];
  if (currencyCode == info[1]) {
    return goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]);
  }
  return currencyCode + ' ' +
      goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]);
***REMOVED***


***REMOVED***
***REMOVED*** Return global currency sign string for those applications
***REMOVED*** that want to handle currency sign themselves.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Global currency sign for given currency.
***REMOVED***
goog.i18n.currency.getGlobalCurrencySign = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return (currencyCode == info[1]) ? currencyCode :
      currencyCode + ' ' + info[1];
***REMOVED***


***REMOVED***
***REMOVED*** Local currency pattern is the most frequently used pattern in currency's
***REMOVED*** native region. It does not care about how it is distinguished from other
***REMOVED*** currencies.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Local currency pattern string for given currency.
***REMOVED***
goog.i18n.currency.getLocalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[1]);
***REMOVED***


***REMOVED***
***REMOVED*** Returns local currency sign string for those applications that need to
***REMOVED*** handle currency sign separately.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Local currency sign for given currency.
***REMOVED***
goog.i18n.currency.getLocalCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][1];
***REMOVED***


***REMOVED***
***REMOVED*** Portable currency pattern is a compromise between local and global. It is
***REMOVED*** not a mere blend or mid-way between the two. Currency sign is chosen so that
***REMOVED*** it looks familiar to native users. It also has enough information to
***REMOVED*** distinguish itself from other popular currencies in its native region.
***REMOVED*** In this pattern, currency sign symbols that has availability problem in
***REMOVED*** popular fonts are also avoided.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Portable currency pattern string for given currency.
***REMOVED***
goog.i18n.currency.getPortableCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Return portable currency sign string for those applications that need to
***REMOVED*** handle currency sign themselves.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {string} Portable currency sign for given currency.
***REMOVED***
goog.i18n.currency.getPortableCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][2];
***REMOVED***


***REMOVED***
***REMOVED*** This function returns the default currency sign position. Some applications
***REMOVED*** may want to handle currency sign and currency amount separately. This
***REMOVED*** function can be used in such situations to correctly position the currency
***REMOVED*** sign relative to the amount.
***REMOVED***
***REMOVED*** To match the behavior of ICU, position is not determined by display locale.
***REMOVED***
***REMOVED*** @param {string} currencyCode ISO-4217 3-letter currency code.
***REMOVED*** @return {boolean} true if currency should be positioned before amount field.
***REMOVED***
goog.i18n.currency.isPrefixSignPosition = function(currencyCode) {
  return (goog.i18n.currency.CurrencyInfo[currencyCode][0] &
          goog.i18n.currency.POSITION_FLAG_) == 0;
***REMOVED***


***REMOVED***
***REMOVED*** This function constructs the currency pattern. Currency sign is provided. The
***REMOVED*** pattern information is encoded in patternNum.
***REMOVED***
***REMOVED*** @param {number} patternNum Encoded pattern number that has
***REMOVED***     currency pattern information.
***REMOVED*** @param {string} sign The currency sign that will be used in pattern.
***REMOVED*** @return {string} currency pattern string.
***REMOVED*** @private
***REMOVED***
goog.i18n.currency.getCurrencyPattern_ = function(patternNum, sign) {
  var strParts = ['#,##0'];
  var precision = patternNum & goog.i18n.currency.PRECISION_MASK_;
  if (precision > 0) {
    strParts.push('.');
    for (var i = 0; i < precision; i++) {
      strParts.push('0');
    }
  }
  if ((patternNum & goog.i18n.currency.POSITION_FLAG_) == 0) {
    strParts.unshift((patternNum & goog.i18n.currency.SPACE_FLAG_) ?
                     "' " : "'");
    strParts.unshift(sign);
    strParts.unshift("'");
  } else {
    strParts.push((patternNum & goog.i18n.currency.SPACE_FLAG_) ? " '" : "'",
                  sign, "'");
  }
  return strParts.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Modify currency pattern string by adjusting precision for given currency.
***REMOVED*** Standard currency pattern will have 2 digit after decimal point.
***REMOVED*** Examples:
***REMOVED***   $#,##0.00 ->  $#,##0    (precision == 0)
***REMOVED***   $#,##0.00 ->  $#,##0.0  (precision == 1)
***REMOVED***   $#,##0.00 ->  $#,##0.000  (precision == 3)
***REMOVED***
***REMOVED*** @param {string} pattern currency pattern string.
***REMOVED*** @param {string} currencyCode 3-letter currency code.
***REMOVED*** @return {string} modified currency pattern string.
***REMOVED***
goog.i18n.currency.adjustPrecision = function(pattern, currencyCode) {
  var strParts = ['0'];
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  var precision = info[0] & goog.i18n.currency.PRECISION_MASK_;
  if (precision > 0) {
    strParts.push('.');
    for (var i = 0; i < precision; i++) {
      strParts.push('0');
    }
  }
  return pattern.replace(/0.00/g, strParts.join(''));
***REMOVED***


***REMOVED***
***REMOVED*** Tier 1 currency information.
***REMOVED***
***REMOVED*** The first number in the array is a combination of the precision mask and
***REMOVED*** other flags. The precision mask indicates how many decimal places to show for
***REMOVED*** the currency. Valid values are [0..7]. The position flag indicates whether
***REMOVED*** the currency sign should be positioned after the number. Valid values are 0
***REMOVED*** (before the number) or 16 (after the number). The space flag indicates
***REMOVED*** whether a space should be inserted between the currency sign and number.
***REMOVED*** Valid values are 0 (no space) and 32 (space).
***REMOVED***
***REMOVED*** The number in the array is calculated by adding together the mask and flag
***REMOVED*** values. For example:
***REMOVED***
***REMOVED*** 0: no precision (0), currency sign first (0), no space (0)
***REMOVED*** 2: two decimals precision (2), currency sign first (0), no space (0)
***REMOVED*** 18: two decimals precision (2), currency sign last (16), no space (0)
***REMOVED*** 50: two decimals precision (2), currency sign last (16), space (32)
***REMOVED***
***REMOVED*** @type {!Object.<!Array>}
***REMOVED***
goog.i18n.currency.CurrencyInfo = {
  'AED': [2, 'dh', '\u062f.\u0625.', 'DH'],
  'ALL': [0, 'Lek', 'Lek'],
  'AUD': [2, '$', 'AU$'],
  'BDT': [2, '\u09F3', 'Tk'],
  'BGN': [2, 'lev', 'lev'],
  'BRL': [2, 'R$', 'R$'],
  'CAD': [2, '$', 'C$'],
  'CDF': [2, 'FrCD', 'CDF'],
  'CHF': [2, 'CHF', 'CHF'],
  'CLP': [0, '$', 'CL$'],
  'CNY': [2, '¥', 'RMB¥'],
  'COP': [0, '$', 'COL$'],
  'CRC': [0, '\u20a1', 'CR\u20a1'],
  'CZK': [50, 'K\u010d', 'K\u010d'],
  'DKK': [18, 'kr', 'kr'],
  'DOP': [2, '$', 'RD$'],
  'EGP': [2, '£', 'LE'],
  'ETB': [2, 'Birr', 'Birr'],
  'EUR': [2, '€', '€'],
  'GBP': [2, '£', 'GB£'],
  'HKD': [2, '$', 'HK$'],
  'HRK': [2, 'kn', 'kn'],
  'HUF': [0, 'Ft', 'Ft'],
  'IDR': [0, 'Rp', 'Rp'],
  'ILS': [2, '\u20AA', 'IL\u20AA'],
  'INR': [2, '\u20B9', 'Rs'],
  'IRR': [0, 'Rial', 'IRR'],
  'ISK': [0, 'kr', 'kr'],
  'JMD': [2, '$', 'JA$'],
  'JPY': [0, '¥', 'JP¥'],
  'KRW': [0, '\u20A9', 'KR₩'],
  'LKR': [2, 'Rs', 'SLRs'],
  'LTL': [2, 'Lt', 'Lt'],
  'LVL': [2, 'Ls', 'Ls'],
  'MNT': [0, '\u20AE', 'MN₮'],
  'MXN': [2, '$', 'Mex$'],
  'MYR': [2, 'RM', 'RM'],
  'NOK': [50, 'kr', 'NOkr'],
  'PAB': [2, 'B/.', 'B/.'],
  'PEN': [2, 'S/.', 'S/.'],
  'PHP': [2, '\u20B1', 'Php'],
  'PKR': [0, 'Rs', 'PKRs.'],
  'PLN': [50, 'z\u0142', 'z\u0142'],
  'RON': [2, 'RON', 'RON'],
  'RSD': [0, 'din', 'RSD'],
  'RUB': [50, 'руб.', 'руб.'],
  'SAR': [2, 'Rial', 'Rial'],
  'SEK': [2, 'kr', 'kr'],
  'SGD': [2, '$', 'S$'],
  'THB': [2, '\u0e3f', 'THB'],
  'TRY': [2, 'TL', 'YTL'],
  'TWD': [2, 'NT$', 'NT$'],
  'TZS': [0, 'TSh', 'TSh'],
  'UAH': [2, '\u20B4', 'UAH'],
  'USD': [2, '$', 'US$'],
  'UYU': [2, '$', '$U'],
  'VND': [0, '\u20AB', 'VN\u20AB'],
  'YER': [0, 'Rial', 'Rial'],
  'ZAR': [2, 'R', 'ZAR']
***REMOVED***


***REMOVED***
***REMOVED*** Tier 2 currency information.
***REMOVED*** @type {!Object.<!Array>}
***REMOVED***
goog.i18n.currency.CurrencyInfoTier2 = {
  'AFN': [48, 'Af.', 'AFN'],
  'AMD': [0, 'Dram', 'dram'],
  'AOA': [2, 'Kz', 'Kz'],
  'ARS': [2, '$', 'AR$'],
  'AWG': [2, 'Afl.', 'Afl.'],
  'AZN': [2, 'man.', 'man.'],
  'BAM': [2, 'KM', 'KM'],
  'BBD': [2, '$', 'Bds$'],
  'BHD': [3, 'din', 'din'],
  'BIF': [0, 'FBu', 'FBu'],
  'BMD': [2, '$', 'BD$'],
  'BND': [2, '$', 'B$'],
  'BOB': [2, 'Bs', 'Bs'],
  'BSD': [2, '$', 'BS$'],
  'BTN': [2, 'Nu.', 'Nu.'],
  'BWP': [2, 'P', 'pula'],
  'BYR': [0, 'BYR', 'BYR'],
  'BZD': [2, '$', 'BZ$'],
  'CUC': [1, '$', 'CUC$'],
  'CUP': [2, '$', 'CU$'],
  'CVE': [2, 'CVE', 'Esc'],
  'DJF': [0, 'Fdj', 'Fdj'],
  'DZD': [2, 'din', 'din'],
  'ERN': [2, 'Nfk', 'Nfk'],
  'FJD': [2, '$', 'FJ$'],
  'FKP': [2, '£', 'FK£'],
  'GEL': [2, 'GEL', 'GEL'],
  'GHS': [2, 'GHS', 'GHS'],
  'GIP': [2, '£', 'GI£'],
  'GMD': [2, 'GMD', 'GMD'],
  'GNF': [0, 'FG', 'FG'],
  'GTQ': [2, 'Q', 'GTQ'],
  'GYD': [0, '$', 'GY$'],
  'HNL': [2, 'L', 'HNL'],
  'HTG': [2, 'HTG', 'HTG'],
  'IQD': [0, 'din', 'IQD'],
  'JOD': [3, 'din', 'JOD'],
  'KES': [2, 'Ksh', 'Ksh'],
  'KGS': [2, 'KGS', 'KGS'],
  'KHR': [2, 'Riel', 'KHR'],
  'KMF': [0, 'CF', 'KMF'],
  'KPW': [0, '\u20A9KP', 'KPW'],
  'KWD': [3, 'din', 'KWD'],
  'KYD': [2, '$', 'KY$'],
  'KZT': [2, '\u20B8', 'KZT'],
  'LAK': [0, '\u20AD', '\u20AD'],
  'LBP': [0, 'L£', 'LBP'],
  'LRD': [2, '$', 'L$'],
  'LSL': [2, 'LSL', 'LSL'],
  'LYD': [3, 'din', 'LD'],
  'MAD': [2, 'dh', 'MAD'],
  'MDL': [2, 'MDL', 'MDL'],
  'MGA': [0, 'Ar', 'MGA'],
  'MKD': [2, 'din', 'MKD'],
  'MMK': [0, 'K', 'MMK'],
  'MOP': [2, 'MOP', 'MOP$'],
  'MRO': [0, 'MRO', 'MRO'],
  'MUR': [0, 'MURs', 'MURs'],
  'MWK': [2, 'MWK', 'MWK'],
  'MZN': [2, 'MTn', 'MTn'],
  'NAD': [2, '$', 'N$'],
  'NGN': [2, '\u20A6', 'NG\u20A6'],
  'NIO': [2, 'C$', 'C$'],
  'NPR': [2, 'Rs', 'NPRs'],
  'NZD': [2, '$', 'NZ$'],
  'OMR': [3, 'Rial', 'OMR'],
  'PGK': [2, 'PGK', 'PGK'],
  'PYG': [0, 'Gs', 'PYG'],
  'QAR': [2, 'Rial', 'QR'],
  'RWF': [0, 'RF', 'RF'],
  'SBD': [2, '$', 'SI$'],
  'SCR': [2, 'SCR', 'SCR'],
  'SDG': [2, 'SDG', 'SDG'],
  'SHP': [2, '£', 'SH£'],
  'SLL': [0, 'SLL', 'SLL'],
  'SOS': [0, 'SOS', 'SOS'],
  'SRD': [2, '$', 'SR$'],
  'STD': [0, 'Db', 'Db'],
  'SYP': [0, '£', 'SY£'],
  'SZL': [2, 'SZL', 'SZL'],
  'TJS': [2, 'Som', 'TJS'],
  'TND': [3, 'din', 'DT'],
  'TOP': [2, 'T$', 'T$'],
  'TTD': [2, '$', 'TT$'],
  'UGX': [0, 'UGX', 'UGX'],
  'UZS': [0, 'so\u02bcm', 'UZS'],
  'VEF': [2, 'Bs', 'Bs'],
  'VUV': [0, 'VUV', 'VUV'],
  'WST': [2, 'WST', 'WST'],
  'XAF': [0, 'FCFA', 'FCFA'],
  'XCD': [2, '$', 'EC$'],
  'XOF': [0, 'CFA', 'CFA'],
  'XPF': [0, 'FCFP', 'FCFP'],
  'ZMK': [0, 'ZMK', 'ZMK']
***REMOVED***
