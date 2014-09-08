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
***REMOVED*** @fileoverview Performance test for goog.structs.Map and
***REMOVED*** goog.labs.structs.Map. To run this test fairly, you would have to
***REMOVED*** compile this via JsCompiler (with --export_test_functions), and
***REMOVED*** pull the compiled JS into an empty HTML file.
***REMOVED***

goog.provide('goog.labs.structs.mapPerf');

goog.require('goog.dom');
goog.require('goog.labs.structs.Map');
goog.require('goog.structs.Map');
goog.require('goog.testing.PerformanceTable');
goog.require('goog.testing.jsunit');

goog.scope(function() {
var mapPerf = goog.labs.structs.mapPerf;


***REMOVED***
***REMOVED*** @typedef {goog.labs.structs.Map|goog.structs.Map}
***REMOVED***
mapPerf.MapType;


***REMOVED***
***REMOVED*** @type {goog.testing.PerformanceTable}
***REMOVED***
mapPerf.perfTable;


***REMOVED***
***REMOVED*** A key list. This maps loop index to key name to be used during
***REMOVED*** benchmark. This ensure that we do not need to pay the cost of
***REMOVED*** string concatenation/GC whenever we derive a key from loop index.
***REMOVED***
***REMOVED*** This is filled once in setUpPage and then remain unchanged for the
***REMOVED*** rest of the test case.
***REMOVED***
***REMOVED*** @type {Array}
***REMOVED***
mapPerf.keyList = [];


***REMOVED***
***REMOVED*** Maxium number of keys in keyList (and, by extension, the map under
***REMOVED*** test).
***REMOVED*** @type {number}
***REMOVED***
mapPerf.MAX_NUM_KEY = 10000;


***REMOVED***
***REMOVED*** Fills the given map with generated key-value pair.
***REMOVED*** @param {mapPerf.MapType} map The map to fill.
***REMOVED*** @param {number} numKeys The number of key-value pair to fill.
***REMOVED***
mapPerf.fillMap = function(map, numKeys) {
  goog.asserts.assert(numKeys <= mapPerf.MAX_NUM_KEY);

  for (var i = 0; i < numKeys; ++i) {
    map.set(mapPerf.keyList[i], i);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Primes the given map with deletion of keys.
***REMOVED*** @param {mapPerf.MapType} map The map to prime.
***REMOVED*** @return {mapPerf.MapType} The primed map (for chaining).
***REMOVED***
mapPerf.primeMapWithDeletion = function(map) {
  for (var i = 0; i < 1000; ++i) {
    map.set(mapPerf.keyList[i], i);
  }
  for (var i = 0; i < 1000; ++i) {
    map.remove(mapPerf.keyList[i]);
  }
  return map;
***REMOVED***


***REMOVED***
***REMOVED*** Runs performance test for Map#get with the given map.
***REMOVED*** @param {mapPerf.MapType} map The map to stress.
***REMOVED*** @param {string} message Message to be put in performance table.
***REMOVED***
mapPerf.runPerformanceTestForMapGet = function(map, message) {
  mapPerf.fillMap(map, 10000);

  mapPerf.perfTable.run(
      function() {
        // Creates local alias for map and keyList.
        var localMap = map;
        var localKeyList = mapPerf.keyList;

        for (var i = 0; i < 500; ++i) {
          var sum = 0;
          for (var j = 0; j < 10000; ++j) {
            sum += localMap.get(localKeyList[j]);
          }
        }
      },
      message);
***REMOVED***


***REMOVED***
***REMOVED*** Runs performance test for Map#set with the given map.
***REMOVED*** @param {mapPerf.MapType} map The map to stress.
***REMOVED*** @param {string} message Message to be put in performance table.
***REMOVED***
mapPerf.runPerformanceTestForMapSet = function(map, message) {
  mapPerf.perfTable.run(
      function() {
        // Creates local alias for map and keyList.
        var localMap = map;
        var localKeyList = mapPerf.keyList;

        for (var i = 0; i < 500; ++i) {
          for (var j = 0; j < 10000; ++j) {
            localMap.set(localKeyList[i], i);
          }
        }
      },
      message);
***REMOVED***


goog.global['setUpPage'] = function() {
  var content = goog.dom.createDom('div');
  goog.dom.insertChildAt(document.body, content, 0);
  var ua = navigator.userAgent;
  content.innerHTML =
      '<h1>Closure Performance Tests - Map</h1>' +
      '<p><strong>User-agent: </strong><span id="ua">' + ua + '</span></p>' +
      '<div id="perf-table"></div>' +
      '<hr>';

  mapPerf.perfTable = new goog.testing.PerformanceTable(
      goog.dom.getElement('perf-table'));

  // Fills keyList.
  for (var i = 0; i < mapPerf.MAX_NUM_KEY; ++i) {
    mapPerf.keyList.push('k' + i);
  }
***REMOVED***


goog.global['testGetFromLabsMap'] = function() {
  mapPerf.runPerformanceTestForMapGet(
      new goog.labs.structs.Map(), '#get: no previous deletion (Labs)');
***REMOVED***


goog.global['testGetFromOriginalMap'] = function() {
  mapPerf.runPerformanceTestForMapGet(
      new goog.structs.Map(), '#get: no previous deletion (Original)');
***REMOVED***


goog.global['testGetWithPreviousDeletionFromLabsMap'] = function() {
  mapPerf.runPerformanceTestForMapGet(
      mapPerf.primeMapWithDeletion(new goog.labs.structs.Map()),
      '#get: with previous deletion (Labs)');
***REMOVED***


goog.global['testGetWithPreviousDeletionFromOriginalMap'] = function() {
  mapPerf.runPerformanceTestForMapGet(
      mapPerf.primeMapWithDeletion(new goog.structs.Map()),
      '#get: with previous deletion (Original)');
***REMOVED***


goog.global['testSetFromLabsMap'] = function() {
  mapPerf.runPerformanceTestForMapSet(
      new goog.labs.structs.Map(), '#set: no previous deletion (Labs)');
***REMOVED***


goog.global['testSetFromOriginalMap'] = function() {
  mapPerf.runPerformanceTestForMapSet(
      new goog.structs.Map(), '#set: no previous deletion (Original)');
***REMOVED***

});  // goog.scope
