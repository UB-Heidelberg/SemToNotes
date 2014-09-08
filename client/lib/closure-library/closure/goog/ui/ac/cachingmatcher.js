// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Matcher which maintains a client-side cache on top of some
***REMOVED*** other matcher.
***REMOVED*** @author reinerp@google.com (Reiner Pope)
***REMOVED***


goog.provide('goog.ui.ac.CachingMatcher');

goog.require('goog.array');
goog.require('goog.async.Throttle');
goog.require('goog.ui.ac.ArrayMatcher');
goog.require('goog.ui.ac.RenderOptions');



***REMOVED***
***REMOVED*** A matcher which wraps another (typically slow) matcher and
***REMOVED*** keeps a client-side cache of the results. For instance, you can use this to
***REMOVED*** wrap a RemoteArrayMatcher to hide the latency of the underlying matcher
***REMOVED*** having to make ajax request.
***REMOVED***
***REMOVED*** Objects in the cache are deduped on their stringified forms.
***REMOVED***
***REMOVED*** Note - when the user types a character, they will instantly get a set of
***REMOVED*** local results, and then some time later, the results from the server will
***REMOVED*** show up.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!Object} baseMatcher The underlying matcher to use. Must implement
***REMOVED***     requestMatchingRows.
***REMOVED*** @final
***REMOVED***
goog.ui.ac.CachingMatcher = function(baseMatcher) {
 ***REMOVED*****REMOVED*** @private {!Array.<!Object>}} The cache.***REMOVED***
  this.rows_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Set of stringified rows, for fast deduping. Each element of this.rows_
  ***REMOVED*** is stored in rowStrings_ as (' ' + row) to ensure we avoid builtin
  ***REMOVED*** properties like 'toString'.
  ***REMOVED*** @private {Object.<string, boolean>}
 ***REMOVED*****REMOVED***
  this.rowStrings_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maximum number of rows in the cache. If the cache grows larger than this,
  ***REMOVED*** the entire cache will be emptied.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.maxCacheSize_ = 1000;

 ***REMOVED*****REMOVED*** @private {!Object} The underlying matcher to use.***REMOVED***
  this.baseMatcher_ = baseMatcher;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Local matching function.
  ***REMOVED*** @private {function(string, number, !Array.<!Object>): !Array.<!Object>}
 ***REMOVED*****REMOVED***
  this.getMatchesForRows_ = goog.ui.ac.ArrayMatcher.getMatchesForRows;

 ***REMOVED*****REMOVED*** @private {number} Number of matches to request from the base matcher.***REMOVED***
  this.baseMatcherMaxMatches_ = 100;

 ***REMOVED*****REMOVED*** @private {goog.async.Throttle}***REMOVED***
  this.throttledTriggerBaseMatch_ =
      new goog.async.Throttle(this.triggerBaseMatch_, 150, this);

 ***REMOVED*****REMOVED*** @private {string}***REMOVED***
  this.mostRecentToken_ = '';

 ***REMOVED*****REMOVED*** @private {Function}***REMOVED***
  this.mostRecentMatchHandler_ = null;

 ***REMOVED*****REMOVED*** @private {number}***REMOVED***
  this.mostRecentMaxMatches_ = 10;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The set of rows which we last displayed.
  ***REMOVED***
  ***REMOVED*** NOTE(reinerp): The need for this is subtle. When a server result comes
  ***REMOVED*** back, we don't want to suddenly change the list of results without the user
  ***REMOVED*** doing anything. So we make sure to add the new server results to the end of
  ***REMOVED*** the currently displayed list.
  ***REMOVED***
  ***REMOVED*** We need to keep track of the last rows we displayed, because the "similar
  ***REMOVED*** matcher" we use locally might otherwise reorder results.
  ***REMOVED***
  ***REMOVED*** @private {Array.<!Object>}
 ***REMOVED*****REMOVED***
  this.mostRecentMatches_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds with which to throttle the match requests
***REMOVED*** on the underlying matcher.
***REMOVED***
***REMOVED*** Default value: 150.
***REMOVED***
***REMOVED*** @param {number} throttleTime .
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.setThrottleTime = function(throttleTime) {
  this.throttledTriggerBaseMatch_ =
      new goog.async.Throttle(this.triggerBaseMatch_, throttleTime, this);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maxMatches to use for the base matcher. If the base matcher makes
***REMOVED*** AJAX requests, it may help to make this a large number so that the local
***REMOVED*** cache gets populated quickly.
***REMOVED***
***REMOVED*** Default value: 100.
***REMOVED***
***REMOVED*** @param {number} maxMatches The value to set.
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.setBaseMatcherMaxMatches =
    function(maxMatches) {
  this.baseMatcherMaxMatches_ = maxMatches;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum size of the local cache. If the local cache grows larger
***REMOVED*** than this size, it will be emptied.
***REMOVED***
***REMOVED*** Default value: 1000.
***REMOVED***
***REMOVED*** @param {number} maxCacheSize .
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.setMaxCacheSize = function(maxCacheSize) {
  this.maxCacheSize_ = maxCacheSize;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the local matcher to use.
***REMOVED***
***REMOVED*** The local matcher should be a function with the same signature as
***REMOVED*** {@link goog.ui.ac.ArrayMatcher.getMatchesForRows}, i.e. its arguments are
***REMOVED*** searchToken, maxMatches, rowsToSearch; and it returns a list of matching
***REMOVED*** rows.
***REMOVED***
***REMOVED*** Default value: {@link goog.ui.ac.ArrayMatcher.getMatchesForRows}.
***REMOVED***
***REMOVED*** @param {function(string, number, !Array.<!Object>): !Array.<!Object>}
***REMOVED***     localMatcher
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.setLocalMatcher = function(localMatcher) {
  this.getMatchesForRows_ = localMatcher;
***REMOVED***


***REMOVED***
***REMOVED*** Function used to pass matches to the autocomplete.
***REMOVED*** @param {string} token Token to match.
***REMOVED*** @param {number} maxMatches Max number of matches to return.
***REMOVED*** @param {Function} matchHandler callback to execute after matching.
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.requestMatchingRows =
    function(token, maxMatches, matchHandler) {
  this.mostRecentMaxMatches_ = maxMatches;
  this.mostRecentToken_ = token;
  this.mostRecentMatchHandler_ = matchHandler;
  this.throttledTriggerBaseMatch_.fire();

  var matches = this.getMatchesForRows_(token, maxMatches, this.rows_);
  matchHandler(token, matches);
  this.mostRecentMatches_ = matches;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the specified rows to the cache.
***REMOVED*** @param {!Array.<!Object>} rows .
***REMOVED*** @private
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.addRows_ = function(rows) {
  goog.array.forEach(rows, function(row) {
    // The ' ' prefix is to avoid colliding with builtins like toString.
    if (!this.rowStrings_[' ' + row]) {
      this.rows_.push(row);
      this.rowStrings_[' ' + row] = true;
    }
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the cache is larger than the maximum cache size. If so clears it.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.clearCacheIfTooLarge_ = function() {
  if (this.rows_.length > this.maxCacheSize_) {
    this.rows_ = [];
    this.rowStrings_ = {***REMOVED***
  }
***REMOVED***


***REMOVED***
***REMOVED*** Triggers a match request against the base matcher. This function is
***REMOVED*** unthrottled, so don't call it directly; instead use
***REMOVED*** this.throttledTriggerBaseMatch_.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.triggerBaseMatch_ = function() {
  this.baseMatcher_.requestMatchingRows(this.mostRecentToken_,
      this.baseMatcherMaxMatches_, goog.bind(this.onBaseMatch_, this));
***REMOVED***


***REMOVED***
***REMOVED*** Handles a match response from the base matcher.
***REMOVED*** @param {string} token The token against which the base match was called.
***REMOVED*** @param {!Array.<!Object>} matches The matches returned by the base matcher.
***REMOVED*** @private
***REMOVED***
goog.ui.ac.CachingMatcher.prototype.onBaseMatch_ = function(token, matches) {
  // NOTE(reinerp): The user might have typed some more characters since the
  // base matcher request was sent out, which manifests in that token might be
  // older than this.mostRecentToken_. We make sure to do our local matches
  // using this.mostRecentToken_ rather than token so that we display results
  // relevant to what the user is seeing right now.

  // NOTE(reinerp): We compute a diff between the currently displayed results
  // and the new results we would get now that the server results have come
  // back. Using this diff, we make sure the new results are only added to the
  // end of the list of results. See the documentation on
  // this.mostRecentMatches_ for details

  this.addRows_(matches);

  var oldMatchesSet = {***REMOVED***
  goog.array.forEach(this.mostRecentMatches_, function(match) {
    // The ' ' prefix is to avoid colliding with builtins like toString.
    oldMatchesSet[' ' + match] = true;
  });
  var newMatches = this.getMatchesForRows_(this.mostRecentToken_,
      this.mostRecentMaxMatches_, this.rows_);
  newMatches = goog.array.filter(newMatches, function(match) {
    return !(oldMatchesSet[' ' + match]);
  });
  newMatches = this.mostRecentMatches_.concat(newMatches)
      .slice(0, this.mostRecentMaxMatches_);

  this.mostRecentMatches_ = newMatches;

  // We've gone to the effort of keeping the existing rows as before, so let's
  // make sure to keep them highlighted.
  var options = new goog.ui.ac.RenderOptions();
  options.setPreserveHilited(true);
  this.mostRecentMatchHandler_(this.mostRecentToken_, newMatches, options);

  // We clear the cache***REMOVED***after* running the local match, so we don't
  // suddenly remove results just because the remote match came back.
  this.clearCacheIfTooLarge_();
***REMOVED***
