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
***REMOVED*** @fileoverview Generator for unique element IDs.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** Creates a new id generator.
***REMOVED***
***REMOVED***
goog.ui.IdGenerator = function() {
***REMOVED***
goog.addSingletonGetter(goog.ui.IdGenerator);


***REMOVED***
***REMOVED*** Next unique ID to use
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.IdGenerator.prototype.nextId_ = 0;


***REMOVED***
***REMOVED*** Gets the next unique ID.
***REMOVED*** @return {string} The next unique identifier.
***REMOVED***
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return ':' + (this.nextId_++).toString(36);
***REMOVED***


***REMOVED***
***REMOVED*** Default instance for id generation. Done as an instance instead of statics
***REMOVED*** so it's possible to inject a mock for unit testing purposes.
***REMOVED*** @type {goog.ui.IdGenerator}
***REMOVED*** @deprecated Use goog.ui.IdGenerator.getInstance() instead and do not refer
***REMOVED*** to goog.ui.IdGenerator.instance anymore.
***REMOVED***
goog.ui.IdGenerator.instance = goog.ui.IdGenerator.getInstance();
