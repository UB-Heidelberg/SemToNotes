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
***REMOVED*** @fileoverview Defines a class for parsing JSON using eval.
***REMOVED***

goog.provide('goog.json.EvalJsonProcessor');

goog.require('goog.json');
goog.require('goog.json.Processor');
goog.require('goog.json.Serializer');



***REMOVED***
***REMOVED*** A class that parses and stringifies JSON using eval (as implemented in
***REMOVED*** goog.json).
***REMOVED*** Adapts {@code goog.json} to the {@code goog.json.Processor} interface.
***REMOVED***
***REMOVED*** @param {?goog.json.Replacer=} opt_replacer An optional replacer to use during
***REMOVED***     serialization.
***REMOVED*** @param {?boolean=} opt_useUnsafeParsing Whether to use goog.json.unsafeParse
***REMOVED***     for parsing. Safe parsing is very slow on large strings. On the other
***REMOVED***     hand, unsafe parsing uses eval() without checking whether the string is
***REMOVED***     valid, so it should only be used if you trust the source of the string.
***REMOVED***
***REMOVED*** @implements {goog.json.Processor}
***REMOVED*** @final
***REMOVED***
goog.json.EvalJsonProcessor = function(opt_replacer, opt_useUnsafeParsing) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.json.Serializer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.serializer_ = new goog.json.Serializer(opt_replacer);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {function(string):***REMOVED***}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parser_ = opt_useUnsafeParsing ? goog.json.unsafeParse : goog.json.parse;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.json.EvalJsonProcessor.prototype.stringify = function(object) {
  return this.serializer_.serialize(object);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.json.EvalJsonProcessor.prototype.parse = function(s) {
  return this.parser_(s);
***REMOVED***
