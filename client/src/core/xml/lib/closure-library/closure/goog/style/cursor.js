// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Functions to create special cursor styles, like "draggable"
***REMOVED*** (open hand) or "dragging" (closed hand).
***REMOVED***
***REMOVED***

goog.provide('goog.style.cursor');

goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** The file name for the open-hand (draggable) cursor.
***REMOVED*** @type {string}
***REMOVED***
goog.style.cursor.OPENHAND_FILE = 'openhand.cur';


***REMOVED***
***REMOVED*** The file name for the close-hand (dragging) cursor.
***REMOVED*** @type {string}
***REMOVED***
goog.style.cursor.CLOSEDHAND_FILE = 'closedhand.cur';


***REMOVED***
***REMOVED*** Create the style for the draggable cursor based on browser and OS.
***REMOVED*** The value can be extended to be '!important' if needed.
***REMOVED***
***REMOVED*** @param {string} absoluteDotCurFilePath The absolute base path of
***REMOVED***     'openhand.cur' file to be used if the browser supports it.
***REMOVED*** @param {boolean=} opt_obsolete Just for compiler backward compatibility.
***REMOVED*** @return {string} The "draggable" mouse cursor style value.
***REMOVED***
goog.style.cursor.getDraggableCursorStyle = function(
    absoluteDotCurFilePath, opt_obsolete) {
  return goog.style.cursor.getCursorStyle_(
      '-moz-grab',
      absoluteDotCurFilePath + goog.style.cursor.OPENHAND_FILE,
      'default');
***REMOVED***


***REMOVED***
***REMOVED*** Create the style for the dragging cursor based on browser and OS.
***REMOVED*** The value can be extended to be '!important' if needed.
***REMOVED***
***REMOVED*** @param {string} absoluteDotCurFilePath The absolute base path of
***REMOVED***     'closedhand.cur' file to be used if the browser supports it.
***REMOVED*** @param {boolean=} opt_obsolete Just for compiler backward compatibility.
***REMOVED*** @return {string} The "dragging" mouse cursor style value.
***REMOVED***
goog.style.cursor.getDraggingCursorStyle = function(
    absoluteDotCurFilePath, opt_obsolete) {
  return goog.style.cursor.getCursorStyle_(
      '-moz-grabbing',
      absoluteDotCurFilePath + goog.style.cursor.CLOSEDHAND_FILE,
      'move');
***REMOVED***


***REMOVED***
***REMOVED*** Create the style for the cursor based on browser and OS.
***REMOVED***
***REMOVED*** @param {string} geckoNonWinBuiltInStyleValue The Gecko on non-Windows OS,
***REMOVED***     built in cursor style.
***REMOVED*** @param {string} absoluteDotCurFilePath The .cur file absolute file to be
***REMOVED***     used if the browser supports it.
***REMOVED*** @param {string} defaultStyle The default fallback cursor style.
***REMOVED*** @return {string} The computed mouse cursor style value.
***REMOVED*** @private
***REMOVED***
goog.style.cursor.getCursorStyle_ = function(geckoNonWinBuiltInStyleValue,
    absoluteDotCurFilePath, defaultStyle) {
  // Use built in cursors for Gecko on non Windows OS.
  // We prefer our custom cursor, but Firefox Mac and Firefox Linux
  // cannot do custom cursors. They do have a built-in hand, so use it:
  if (goog.userAgent.GECKO && !goog.userAgent.WINDOWS) {
    return geckoNonWinBuiltInStyleValue;
  }

  // Use the custom cursor file.
  var cursorStyleValue = 'url("' + absoluteDotCurFilePath + '")';
  // Change hot-spot for Safari.
  if (goog.userAgent.WEBKIT) {
    // Safari seems to ignore the hotspot specified in the .cur file (it uses
    // 0,0 instead).  This causes the cursor to jump as it transitions between
    // openhand and pointer which is especially annoying when trying to hover
    // over the route for draggable routes.  We specify the hotspot here as 7,5
    // in the css - unfortunately ie6 can't understand this and falls back to
    // the builtin cursors so we just do this for safari (but ie DOES correctly
    // use the hotspot specified in the file so this is ok).  The appropriate
    // coordinates were determined by looking at a hex dump and the format
    // description from wikipedia.
    cursorStyleValue += ' 7 5';
  }
  // Add default cursor fallback.
  cursorStyleValue += ', ' + defaultStyle;
  return cursorStyleValue;
***REMOVED***

