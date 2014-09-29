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
***REMOVED*** @fileoverview Generic immutable node object to be used in collections.
***REMOVED***
***REMOVED***


goog.provide('goog.structs.Node');



***REMOVED***
***REMOVED*** A generic immutable node. This can be used in various collections that
***REMOVED*** require a node object for its item (such as a heap).
***REMOVED*** @param {*} key Key.
***REMOVED*** @param {*} value Vaue.
***REMOVED***
***REMOVED***
goog.structs.Node = function(key, value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The key.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.key_ = key;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The value.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the key.
***REMOVED*** @return {*} The key.
***REMOVED***
goog.structs.Node.prototype.getKey = function() {
  return this.key_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value.
***REMOVED*** @return {*} The value.
***REMOVED***
goog.structs.Node.prototype.getValue = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Clones a node and returns a new node.
***REMOVED*** @return {goog.structs.Node} A new goog.structs.Node with the same key value
***REMOVED***     pair.
***REMOVED***
goog.structs.Node.prototype.clone = function() {
  return new goog.structs.Node(this.key_, this.value_);
***REMOVED***
