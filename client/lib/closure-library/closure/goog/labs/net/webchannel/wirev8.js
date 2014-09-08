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
***REMOVED*** @fileoverview Codec functions of the v8 wire protocol. Eventually we'd want
***REMOVED*** to support pluggable wire-format to improve wire efficiency and to enable
***REMOVED*** binary encoding. Such support will require an interface class, which
***REMOVED*** will be added later.
***REMOVED***
***REMOVED*** @visibility {:internal}
***REMOVED***


goog.provide('goog.labs.net.webChannel.WireV8');

goog.require('goog.asserts');
goog.require('goog.json');
goog.require('goog.json.EvalJsonProcessor');
goog.require('goog.structs');



***REMOVED***
***REMOVED*** The v8 codec class.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED***
goog.labs.net.webChannel.WireV8 = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Parser for a response payload. The parser should return an array.
  ***REMOVED*** @private {!goog.string.Parser}
 ***REMOVED*****REMOVED***
  this.parser_ = new goog.json.EvalJsonProcessor(null, true);
***REMOVED***


goog.scope(function() {
var WireV8 = goog.labs.net.webChannel.WireV8;
var Wire = goog.labs.net.webChannel.Wire;


***REMOVED***
***REMOVED*** Encodes a standalone message into the wire format.
***REMOVED***
***REMOVED*** May throw exception if the message object contains any invalid elements.
***REMOVED***
***REMOVED*** @param {!Object|!goog.structs.Map} message The message data.
***REMOVED***     V8 only support JS objects (or Map).
***REMOVED*** @param {!Array.<string>} buffer The text buffer to write the message to.
***REMOVED*** @param {string=} opt_prefix The prefix for each field of the object.
***REMOVED***
WireV8.prototype.encodeMessage = function(message, buffer, opt_prefix) {
  var prefix = opt_prefix || '';
  try {
    goog.structs.forEach(message, function(value, key) {
      var encodedValue = value;
      if (goog.isObject(value)) {
        encodedValue = goog.json.serialize(value);
      }  // keep the fast-path for primitive types
      buffer.push(prefix + key + '=' + encodeURIComponent(encodedValue));
    });
  } catch (ex) {
    // We send a map here because lots of the retry logic relies on map IDs,
    // so we have to send something (possibly redundant).
    buffer.push(prefix + 'type' + '=' + encodeURIComponent('_badmap'));
    throw ex;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Encodes all the buffered messages of the forward channel.
***REMOVED***
***REMOVED*** @param {!Array.<Wire.QueuedMap>} messageQueue The message data.
***REMOVED***     V8 only support JS objects.
***REMOVED*** @param {number} count The number of messages to be encoded.
***REMOVED*** @param {?function(!Object)} badMapHandler Callback for bad messages.
***REMOVED***
WireV8.prototype.encodeMessageQueue = function(messageQueue, count,
    badMapHandler) {
  var sb = ['count=' + count];
  var offset;
  if (count > 0) {
    // To save a bit of bandwidth, specify the base mapId and the rest as
    // offsets from it.
    offset = messageQueue[0].mapId;
    sb.push('ofs=' + offset);
  } else {
    offset = 0;
  }
  for (var i = 0; i < count; i++) {
    var mapId = messageQueue[i].mapId;
    var map = messageQueue[i].map;
    mapId -= offset;
    try {
      this.encodeMessage(map, sb, 'req' + mapId + '_');
    } catch (ex) {
      if (badMapHandler) {
        badMapHandler(map);
      }
    }
  }
  return sb.join('&');
***REMOVED***


***REMOVED***
***REMOVED*** Decodes a standalone message received from the wire. May throw exception
***REMOVED*** if text is ill-formatted.
***REMOVED***
***REMOVED*** We use eval() to decode as the server may generate JS literals,
***REMOVED*** which don't necessarily comply with the JSON format, such as
***REMOVED*** double quota, null array element.
***REMOVED***
***REMOVED*** Over time we will phase out servers that don't generate JSON formatted
***REMOVED*** messages.
***REMOVED***
***REMOVED*** @param {string} messageText The string content as received from the wire.
***REMOVED*** @return {*} The decoded message object.
***REMOVED***
WireV8.prototype.decodeMessage = function(messageText) {
  var response = this.parser_.parse(messageText);
  goog.asserts.assert(goog.isArray(response));  // throw exception
  return response;
***REMOVED***
});  // goog.scope
