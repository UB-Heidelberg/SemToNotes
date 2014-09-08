// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Class that retrieves rich autocomplete matches, represented as
***REMOVED*** a structured list of lists, via an ajax call.  The first element of each
***REMOVED*** sublist is the name of a client-side javascript function that converts the
***REMOVED*** remaining sublist elements into rich rows.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ac.RichRemoteArrayMatcher');

goog.require('goog.json');
goog.require('goog.ui.ac.RemoteArrayMatcher');



***REMOVED***
***REMOVED*** An array matcher that requests rich matches via ajax and converts them into
***REMOVED*** rich rows.
***REMOVED*** @param {string} url The Uri which generates the auto complete matches.  The
***REMOVED***     search term is passed to the server as the 'token' query param.
***REMOVED*** @param {boolean=} opt_noSimilar If true, request that the server does not do
***REMOVED***     similarity matches for the input token against the dictionary.
***REMOVED***     The value is sent to the server as the 'use_similar' query param which is
***REMOVED***     either "1" (opt_noSimilar==false) or "0" (opt_noSimilar==true).
***REMOVED***
***REMOVED*** @extends {goog.ui.ac.RemoteArrayMatcher}
***REMOVED***
goog.ui.ac.RichRemoteArrayMatcher = function(url, opt_noSimilar) {
  goog.ui.ac.RemoteArrayMatcher.call(this, url, opt_noSimilar);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A function(rows) that is called before the array matches are returned.
  ***REMOVED*** It runs client-side and filters the results given by the server before
  ***REMOVED*** being rendered by the client.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rowFilter_ = null;

***REMOVED***
goog.inherits(goog.ui.ac.RichRemoteArrayMatcher, goog.ui.ac.RemoteArrayMatcher);


***REMOVED***
***REMOVED*** Set the filter that is called before the array matches are returned.
***REMOVED*** @param {Function} rowFilter A function(rows) that returns an array of rows as
***REMOVED***     a subset of the rows input array.
***REMOVED***
goog.ui.ac.RichRemoteArrayMatcher.prototype.setRowFilter = function(rowFilter) {
  this.rowFilter_ = rowFilter;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve a set of matching rows from the server via ajax and convert them
***REMOVED*** into rich rows.
***REMOVED*** @param {string} token The text that should be matched; passed to the server
***REMOVED***     as the 'token' query param.
***REMOVED*** @param {number} maxMatches The maximum number of matches requested from the
***REMOVED***     server; passed as the 'max_matches' query param. The server is
***REMOVED***     responsible for limiting the number of matches that are returned.
***REMOVED*** @param {Function} matchHandler Callback to execute on the result after
***REMOVED***     matching.
***REMOVED*** @override
***REMOVED***
goog.ui.ac.RichRemoteArrayMatcher.prototype.requestMatchingRows =
    function(token, maxMatches, matchHandler) {
  // The RichRemoteArrayMatcher must map over the results and filter them
  // before calling the request matchHandler.  This is done by passing
  // myMatchHandler to RemoteArrayMatcher.requestMatchingRows which maps,
  // filters, and then calls matchHandler.
  var myMatchHandler = goog.bind(function(token, matches) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      var rows = [];
      for (var i = 0; i < matches.length; i++) {
        var func = ***REMOVED*****REMOVED*** @type {!Function}***REMOVED***
            (goog.json.unsafeParse(matches[i][0]));
        for (var j = 1; j < matches[i].length; j++) {
          var richRow = func(matches[i][j]);
          rows.push(richRow);

          // If no render function was provided, set the node's innerHTML.
          if (typeof richRow.render == 'undefined') {
            richRow.render = function(node, token) {
              node.innerHTML = richRow.toString();
           ***REMOVED*****REMOVED***
          }

          // If no select function was provided, set the text of the input.
          if (typeof richRow.select == 'undefined') {
            richRow.select = function(target) {
              target.value = richRow.toString();
           ***REMOVED*****REMOVED***
          }
        }
      }
      if (this.rowFilter_) {
        rows = this.rowFilter_(rows);
      }
      matchHandler(token, rows);
    } catch (exception) {
      // TODO(user): Is this what we want?
      matchHandler(token, []);
    }
  }, this);

  // Call the super's requestMatchingRows with myMatchHandler
  goog.ui.ac.RichRemoteArrayMatcher.superClass_
      .requestMatchingRows.call(this, token, maxMatches, myMatchHandler);
***REMOVED***
