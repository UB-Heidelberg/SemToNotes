// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is dihstributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


***REMOVED***
***REMOVED*** @fileoverview A class that attempts parse/serialize JSON using native JSON,
***REMOVED***     falling back to goog.json if necessary.
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.json.HybridJsonProcessor');

goog.require('goog.json.Processor');
goog.require('goog.json.hybrid');



***REMOVED***
***REMOVED*** Processor form of goog.json.hybrid, which attempts to parse/serialize
***REMOVED*** JSON using native JSON methods, falling back to goog.json if not
***REMOVED*** available.
***REMOVED***
***REMOVED*** @implements {goog.json.Processor}
***REMOVED*** @final
***REMOVED***
goog.json.HybridJsonProcessor = function() {***REMOVED***


***REMOVED*** @override***REMOVED***
goog.json.HybridJsonProcessor.prototype.stringify =
   ***REMOVED*****REMOVED*** @type {function (*): string}***REMOVED*** (goog.json.hybrid.stringify);


***REMOVED*** @override***REMOVED***
goog.json.HybridJsonProcessor.prototype.parse =
   ***REMOVED*****REMOVED*** @type {function (*): !Object}***REMOVED*** (goog.json.hybrid.parse);
