***REMOVED***
***REMOVED*** @license
***REMOVED*** Licensed to the Apache Software Foundation (ASF) under one
***REMOVED*** or more contributor license agreements. See the NOTICE file
***REMOVED*** distributed with this work for additional information
***REMOVED*** regarding copyright ownership. The ASF licenses this file
***REMOVED*** to you under the Apache License, Version 2.0 (the
***REMOVED*** "License"); you may not use this file except in compliance
***REMOVED*** with the License. You may obtain a copy of the License at
***REMOVED*** http://www.apache.org/licenses/LICENSE-2.0
***REMOVED*** Unless required by applicable law or agreed to in writing,
***REMOVED*** software distributed under the License is distributed on an
***REMOVED*** "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
***REMOVED*** KIND, either express or implied. See the License for the
***REMOVED*** specific language governing permissions and limitations under the License.
***REMOVED***

***REMOVED***
***REMOVED*** @fileoverview Base OSAPI binding.
***REMOVED*** This file was copied from
***REMOVED*** http://svn.apache.org/repos/asf/shindig/trunk/features/src/main/javascript/features/shindig.container/osapi.js
***REMOVED*** and it's slightly modified for Closure.
***REMOVED***

goog.provide('goog.osapi');


// Expose osapi from container side.
var osapi = osapi || {***REMOVED***
goog.exportSymbol('osapi', osapi);


***REMOVED*** @type {Function}***REMOVED***
osapi.callback;


***REMOVED***
***REMOVED*** Dispatch a JSON-RPC batch request to services defined in the osapi namespace
***REMOVED*** @param {Array.<Object>} requests an array of rpc requests.
***REMOVED***
goog.osapi.handleGadgetRpcMethod = function(requests) {
  var responses = new Array(requests.length);
  var callCount = 0;
  var callback = osapi.callback;
  var dummy = function(params, apiCallback) {
    apiCallback({});
 ***REMOVED*****REMOVED***
  for (var i = 0; i < requests.length; i++) {
    // Don't allow underscores in any part of the method name as a
    // convention for restricted methods
    var current = osapi;
    if (requests[i]['method'].indexOf('_') == -1) {
      var path = requests[i]['method'].split('.');
      for (var j = 0; j < path.length; j++) {
        if (current.hasOwnProperty(path[j])) {
          current = current[path[j]];
        } else {
          // No matching api
          current = dummy;
          break;
        }
      }
    } else {
      current = dummy;
    }

    // Execute the call and latch the rpc callback until all
    // complete
    current(requests[i]['params'], function(i) {
      return function(response) {
        // Put back in json-rpc format
        responses[i] = {'id': requests[i].id, 'data': response***REMOVED***
        callCount++;
        if (callCount == requests.length) {
          callback(responses);
        }
     ***REMOVED*****REMOVED***
    }(i));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Initializes container side osapi binding.
***REMOVED***
goog.osapi.init = function() {
   // Container-side binding for the gadgetsrpctransport used by osapi.
   // Containers add services to the client-side osapi implementation by
   // defining them in the osapi namespace
  if (gadgets && gadgets.rpc) { // Only define if gadgets rpc exists.
    // Register the osapi RPC dispatcher.
    gadgets.rpc.register('osapi._handleGadgetRpcMethod',
       ***REMOVED*****REMOVED*** @type {!Function}***REMOVED*** (goog.osapi.handleGadgetRpcMethod));
  }
***REMOVED***
