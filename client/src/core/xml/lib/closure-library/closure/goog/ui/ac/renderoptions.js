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
***REMOVED*** @fileoverview Options for rendering matches.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ac.RenderOptions');



***REMOVED***
***REMOVED*** A simple class that contains options for rendering a set of autocomplete
***REMOVED*** matches.  Used as an optional argument in the callback from the matcher.
***REMOVED***
***REMOVED***
goog.ui.ac.RenderOptions = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Whether the current highlighting is to be preserved when displaying the new
***REMOVED*** set of matches.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RenderOptions.prototype.preserveHilited_ = false;


***REMOVED***
***REMOVED*** Whether the first match is to be highlighted.  When undefined the autoHilite
***REMOVED*** flag of the autocomplete is used.
***REMOVED*** @type {boolean|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RenderOptions.prototype.autoHilite_;


***REMOVED***
***REMOVED*** @param {boolean} flag The new value for the preserveHilited_ flag.
***REMOVED***
goog.ui.ac.RenderOptions.prototype.setPreserveHilited = function(flag) {
  this.preserveHilited_ = flag;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} The value of the preserveHilited_ flag.
***REMOVED***
goog.ui.ac.RenderOptions.prototype.getPreserveHilited = function() {
  return this.preserveHilited_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {boolean} flag The new value for the autoHilite_ flag.
***REMOVED***
goog.ui.ac.RenderOptions.prototype.setAutoHilite = function(flag) {
  this.autoHilite_ = flag;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean|undefined} The value of the autoHilite_ flag.
***REMOVED***
goog.ui.ac.RenderOptions.prototype.getAutoHilite = function() {
  return this.autoHilite_;
***REMOVED***
