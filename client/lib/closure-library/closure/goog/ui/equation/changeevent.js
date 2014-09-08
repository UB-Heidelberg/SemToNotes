// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.ui.equation.ChangeEvent');

goog.require('goog.events.Event');



***REMOVED***
***REMOVED*** Event fired when equation changes.
***REMOVED***
***REMOVED*** @param {boolean} isValid Whether the equation is valid.
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.ui.equation.ChangeEvent = function(isValid) {
  goog.events.Event.call(this, 'change');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether equation is valid.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.isValid = isValid;
***REMOVED***
goog.inherits(goog.ui.equation.ChangeEvent, goog.events.Event);

