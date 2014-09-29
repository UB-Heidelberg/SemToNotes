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
***REMOVED*** @fileoverview Defines the base class for a module. This is used to allow the
***REMOVED*** code to be modularized, giving the benefits of lazy loading and loading on
***REMOVED*** demand.
***REMOVED***
***REMOVED***

goog.provide('goog.module.BaseModule');

goog.require('goog.Disposable');



***REMOVED***
***REMOVED*** A basic module object that represents a module of Javascript code that can
***REMOVED*** be dynamically loaded.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.module.BaseModule = function() {
  goog.Disposable.call(this);
***REMOVED***
goog.inherits(goog.module.BaseModule, goog.Disposable);


***REMOVED***
***REMOVED*** Performs any load-time initialization that the module requires.
***REMOVED*** @param {Object} context The module context.
***REMOVED***
goog.module.BaseModule.prototype.initialize = function(context) {***REMOVED***
