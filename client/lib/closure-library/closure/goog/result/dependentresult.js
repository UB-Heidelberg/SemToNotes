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
***REMOVED*** @fileoverview An interface for Results whose eventual value depends on the
***REMOVED***     value of one or more other Results.
***REMOVED***

goog.provide('goog.result.DependentResult');

goog.require('goog.result.Result');



***REMOVED***
***REMOVED*** A DependentResult represents a Result whose eventual value depends on the
***REMOVED*** value of one or more other Results. For example, the Result returned by
***REMOVED*** @see goog.result.chain or @see goog.result.combine is dependent on the
***REMOVED*** Results given as arguments.
***REMOVED*** @interface
***REMOVED*** @extends {goog.result.Result}
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.DependentResult = function() {***REMOVED***


***REMOVED***
***REMOVED***
***REMOVED*** @return {!Array.<!goog.result.Result>} A list of Results which will affect
***REMOVED***     the eventual value of this Result. The returned Results may themselves
***REMOVED***     have parent results, which would be grandparents of this Result;
***REMOVED***     grandparents (and any other ancestors) are not included in this list.
***REMOVED***
goog.result.DependentResult.prototype.getParentResults = function() {***REMOVED***
