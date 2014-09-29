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
***REMOVED*** @fileoverview Detection of JScript version.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.userAgent.jscript');

goog.require('goog.string');


***REMOVED***
***REMOVED*** @define {boolean} True if it is known at compile time that the runtime
***REMOVED***     environment will not be using JScript.
***REMOVED***
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;


***REMOVED***
***REMOVED*** Initializer for goog.userAgent.jscript.  Detects if the user agent is using
***REMOVED*** Microsoft JScript and which version of it.
***REMOVED***
***REMOVED*** This is a named function so that it can be stripped via the jscompiler
***REMOVED*** option for stripping types.
***REMOVED*** @private
***REMOVED***
goog.userAgent.jscript.init_ = function() {
  var hasScriptEngine = 'ScriptEngine' in goog.global;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ =
      hasScriptEngine && goog.global['ScriptEngine']() == 'JScript';

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.userAgent.jscript.DETECTED_VERSION_ =
      goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ?
      (goog.global['ScriptEngineMajorVersion']() + '.' +
       goog.global['ScriptEngineMinorVersion']() + '.' +
       goog.global['ScriptEngineBuildVersion']()) :
      '0';
***REMOVED***

if (!goog.userAgent.jscript.ASSUME_NO_JSCRIPT) {
  goog.userAgent.jscript.init_();
}


***REMOVED***
***REMOVED*** Whether we detect that the user agent is using Microsoft JScript.
***REMOVED*** @type {boolean}
***REMOVED***
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ?
    false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;


***REMOVED***
***REMOVED*** The installed version of JScript.
***REMOVED*** @type {string}
***REMOVED***
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ?
    '0' : goog.userAgent.jscript.DETECTED_VERSION_;


***REMOVED***
***REMOVED*** Whether the installed version of JScript is as new or newer than a given
***REMOVED*** version.
***REMOVED*** @param {string} version The version to check.
***REMOVED*** @return {boolean} Whether the installed version of JScript is as new or
***REMOVED***     newer than the given version.
***REMOVED***
goog.userAgent.jscript.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION,
                                     version) >= 0;
***REMOVED***
