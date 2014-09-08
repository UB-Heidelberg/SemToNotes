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
***REMOVED*** @fileoverview Easing functions for animations.
***REMOVED***
***REMOVED***

goog.provide('goog.fx.easing');


***REMOVED***
***REMOVED*** Ease in - Start slow and speed up.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED***
goog.fx.easing.easeIn = function(t) {
  return goog.fx.easing.easeInInternal_(t, 3);
***REMOVED***


***REMOVED***
***REMOVED*** Ease in with specifiable exponent.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @param {number} exp Ease exponent.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED*** @private
***REMOVED***
goog.fx.easing.easeInInternal_ = function(t, exp) {
  return Math.pow(t, exp);
***REMOVED***


***REMOVED***
***REMOVED*** Ease out - Start fastest and slows to a stop.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED***
goog.fx.easing.easeOut = function(t) {
  return goog.fx.easing.easeOutInternal_(t, 3);
***REMOVED***


***REMOVED***
***REMOVED*** Ease out with specifiable exponent.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @param {number} exp Ease exponent.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED*** @private
***REMOVED***
goog.fx.easing.easeOutInternal_ = function(t, exp) {
  return 1 - goog.fx.easing.easeInInternal_(1 - t, exp);
***REMOVED***


***REMOVED***
***REMOVED*** Ease out long - Start fastest and slows to a stop with a long ease.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED***
goog.fx.easing.easeOutLong = function(t) {
  return goog.fx.easing.easeOutInternal_(t, 4);
***REMOVED***


***REMOVED***
***REMOVED*** Ease in and out - Start slow, speed up, then slow down.
***REMOVED*** @param {number} t Input between 0 and 1.
***REMOVED*** @return {number} Output between 0 and 1.
***REMOVED***
goog.fx.easing.inAndOut = function(t) {
  return 3***REMOVED*** t***REMOVED*** t - 2***REMOVED*** t***REMOVED*** t***REMOVED*** t;
***REMOVED***
