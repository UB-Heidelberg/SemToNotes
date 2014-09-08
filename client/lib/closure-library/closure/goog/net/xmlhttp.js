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
***REMOVED*** @fileoverview Low level handling of XMLHttpRequest.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author dbk@google.com (David Barrett-Kahn)
***REMOVED***

goog.provide('goog.net.DefaultXmlHttpFactory');
goog.provide('goog.net.XmlHttp');
goog.provide('goog.net.XmlHttp.OptionType');
goog.provide('goog.net.XmlHttp.ReadyState');
goog.provide('goog.net.XmlHttpDefines');

goog.require('goog.asserts');
goog.require('goog.net.WrapperXmlHttpFactory');
goog.require('goog.net.XmlHttpFactory');


***REMOVED***
***REMOVED*** Static class for creating XMLHttpRequest objects.
***REMOVED*** @return {!goog.net.XhrLike.OrNative} A new XMLHttpRequest object.
***REMOVED***
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Whether to assume XMLHttpRequest exists. Setting this to
***REMOVED***     true bypasses the ActiveX probing code.
***REMOVED*** NOTE(user): Due to the way JSCompiler works, this define***REMOVED***will not* strip
***REMOVED*** out the ActiveX probing code from binaries.  To achieve this, use
***REMOVED*** {@code goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR} instead.
***REMOVED*** TODO(user): Collapse both defines.
***REMOVED***
goog.define('goog.net.XmlHttp.ASSUME_NATIVE_XHR', false);


***REMOVED*** @const***REMOVED***
goog.net.XmlHttpDefines = {***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Whether to assume XMLHttpRequest exists. Setting this to
***REMOVED***     true eliminates the ActiveX probing code.
***REMOVED***
goog.define('goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR', false);


***REMOVED***
***REMOVED*** Gets the options to use with the XMLHttpRequest objects obtained using
***REMOVED*** the static methods.
***REMOVED*** @return {Object} The options.
***REMOVED***
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
***REMOVED***


***REMOVED***
***REMOVED*** Type of options that an XmlHttp object can have.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.XmlHttp.OptionType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether a goog.nullFunction should be used to clear the onreadystatechange
  ***REMOVED*** handler instead of null.
 ***REMOVED*****REMOVED***
  USE_NULL_FUNCTION: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** NOTE(user): In IE if send() errors on a***REMOVED***local* request the readystate
  ***REMOVED*** is still changed to COMPLETE.  We need to ignore it and allow the
  ***REMOVED*** try/catch around send() to pick up the error.
 ***REMOVED*****REMOVED***
  LOCAL_REQUEST_ERROR: 1
***REMOVED***


***REMOVED***
***REMOVED*** Status constants for XMLHTTP, matches:
***REMOVED*** http://msdn.microsoft.com/library/default.asp?url=/library/
***REMOVED***   en-us/xmlsdk/html/0e6a34e4-f90c-489d-acff-cb44242fafc6.asp
***REMOVED*** @enum {number}
***REMOVED***
goog.net.XmlHttp.ReadyState = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Constant for when xmlhttprequest.readyState is uninitialized
 ***REMOVED*****REMOVED***
  UNINITIALIZED: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Constant for when xmlhttprequest.readyState is loading.
 ***REMOVED*****REMOVED***
  LOADING: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Constant for when xmlhttprequest.readyState is loaded.
 ***REMOVED*****REMOVED***
  LOADED: 2,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Constant for when xmlhttprequest.readyState is in an interactive state.
 ***REMOVED*****REMOVED***
  INTERACTIVE: 3,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Constant for when xmlhttprequest.readyState is completed
 ***REMOVED*****REMOVED***
  COMPLETE: 4
***REMOVED***


***REMOVED***
***REMOVED*** The global factory instance for creating XMLHttpRequest objects.
***REMOVED*** @type {goog.net.XmlHttpFactory}
***REMOVED*** @private
***REMOVED***
goog.net.XmlHttp.factory_;


***REMOVED***
***REMOVED*** Sets the factories for creating XMLHttpRequest objects and their options.
***REMOVED*** @param {Function} factory The factory for XMLHttpRequest objects.
***REMOVED*** @param {Function} optionsFactory The factory for options.
***REMOVED*** @deprecated Use setGlobalFactory instead.
***REMOVED***
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(
      goog.asserts.assert(factory),
      goog.asserts.assert(optionsFactory)));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the global factory object.
***REMOVED*** @param {!goog.net.XmlHttpFactory} factory New global factory object.
***REMOVED***
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
***REMOVED***



***REMOVED***
***REMOVED*** Default factory to use when creating xhr objects.  You probably shouldn't be
***REMOVED*** instantiating this directly, but rather using it via goog.net.XmlHttp.
***REMOVED*** @extends {goog.net.XmlHttpFactory}
***REMOVED***
***REMOVED***
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this);
***REMOVED***
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);


***REMOVED*** @override***REMOVED***
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  if (progId) {
    return new ActiveXObject(progId);
  } else {
    return new XMLHttpRequest();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_();
  var options = {***REMOVED***
  if (progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true;
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true;
  }
  return options;
***REMOVED***


***REMOVED***
***REMOVED*** The ActiveX PROG ID string to use to create xhr's in IE. Lazily initialized.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_;


***REMOVED***
***REMOVED*** Initialize the private state used by other functions.
***REMOVED*** @return {string} The ActiveX PROG ID string to use to create xhr's in IE.
***REMOVED*** @private
***REMOVED***
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR ||
      goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return '';
  }

  // The following blog post describes what PROG IDs to use to create the
  // XMLHTTP object in Internet Explorer:
  // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
  // However we do not (yet) fully trust that this will be OK for old versions
  // of IE on Win9x so we therefore keep the last 2.
  if (!this.ieProgId_ && typeof XMLHttpRequest == 'undefined' &&
      typeof ActiveXObject != 'undefined') {
    // Candidate Active X types.
    var ACTIVE_X_IDENTS = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0',
                           'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
    for (var i = 0; i < ACTIVE_X_IDENTS.length; i++) {
      var candidate = ACTIVE_X_IDENTS[i];
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        new ActiveXObject(candidate);
        // NOTE(user): cannot assign progid and return candidate in one line
        // because JSCompiler complaings: BUG 658126
        this.ieProgId_ = candidate;
        return candidate;
      } catch (e) {
        // do nothing; try next choice
      }
    }

    // couldn't find any matches
    throw Error('Could not create ActiveXObject. ActiveX might be disabled,' +
                ' or MSXML might not be installed');
  }

  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.ieProgId_);
***REMOVED***


//Set the global factory to an instance of the default factory.
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory());
