// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Enum for button side constants. In its own file so as to not
***REMOVED*** cause a circular dependency with {@link goog.ui.ButtonRenderer}.
***REMOVED***
***REMOVED*** @author doughtie@google.com (Gavin Doughtie)
***REMOVED***

goog.provide('goog.ui.ButtonSide');


***REMOVED***
***REMOVED*** Constants for button sides, see {@link goog.ui.Button.prototype.setCollapsed}
***REMOVED*** for details.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.ButtonSide = {
 ***REMOVED*****REMOVED*** Neither side.***REMOVED***
  NONE: 0,
 ***REMOVED*****REMOVED*** Left for LTR, right for RTL.***REMOVED***
  START: 1,
 ***REMOVED*****REMOVED*** Right for LTR, left for RTL.***REMOVED***
  END: 2,
 ***REMOVED*****REMOVED*** Both sides.***REMOVED***
  BOTH: 3
***REMOVED***


