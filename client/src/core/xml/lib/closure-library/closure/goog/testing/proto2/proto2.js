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
***REMOVED*** @fileoverview Test helpers to compare goog.proto2.Messages.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.proto2');

goog.require('goog.proto2.Message');
goog.require('goog.testing.asserts');


***REMOVED***
***REMOVED*** Compares two goog.proto2.Message instances of the same type.
***REMOVED*** @param {!goog.proto2.Message} expected First message.
***REMOVED*** @param {!goog.proto2.Message} actual Second message.
***REMOVED*** @param {string} path Path to the messages.
***REMOVED*** @return {string} A string describing where they differ. Empty string if they
***REMOVED***     are equal.
***REMOVED*** @private
***REMOVED***
goog.testing.proto2.findDifferences_ = function(expected, actual, path) {
  var fields = expected.getDescriptor().getFields();
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var newPath = (path ? path + '/' : '') + field.getName();

    if (expected.has(field) && !actual.has(field)) {
      return newPath + ' should be present';
    }
    if (!expected.has(field) && actual.has(field)) {
      return newPath + ' should not be present';
    }

    if (expected.has(field)) {
      var isComposite = field.isCompositeType();

      if (field.isRepeated()) {
        var expectedCount = expected.countOf(field);
        var actualCount = actual.countOf(field);
        if (expectedCount != actualCount) {
          return newPath + ' should have ' + expectedCount + ' items, ' +
              'but has ' + actualCount;
        }

        for (var j = 0; j < expectedCount; j++) {
          var expectedItem = expected.get(field, j);
          var actualItem = actual.get(field, j);
          if (isComposite) {
            var itemDiff = goog.testing.proto2.findDifferences_(
               ***REMOVED*****REMOVED*** @type {!goog.proto2.Message}***REMOVED*** (expectedItem),
               ***REMOVED*****REMOVED*** @type {!goog.proto2.Message}***REMOVED*** (actualItem),
                newPath + '[' + j + ']');
            if (itemDiff) {
              return itemDiff;
            }
          } else {
            if (expectedItem != actualItem) {
              return newPath + '[' + j + '] should be ' + expectedItem +
                  ', but was ' + actualItem;
            }
          }
        }
      } else {
        var expectedValue = expected.get(field);
        var actualValue = actual.get(field);
        if (isComposite) {
          var diff = goog.testing.proto2.findDifferences_(
             ***REMOVED*****REMOVED*** @type {!goog.proto2.Message}***REMOVED*** (expectedValue),
             ***REMOVED*****REMOVED*** @type {!goog.proto2.Message}***REMOVED*** (actualValue),
              newPath);
          if (diff) {
            return diff;
          }
        } else {
          if (expectedValue != actualValue) {
            return newPath + ' should be ' + expectedValue + ', but was ' +
                actualValue;
          }
        }
      }
    }
  }

  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Compares two goog.proto2.Message objects. Gives more readable output than
***REMOVED*** assertObjectEquals on mismatch.
***REMOVED*** @param {!goog.proto2.Message} expected Expected proto2 message.
***REMOVED*** @param {!goog.proto2.Message} actual Actual proto2 message.
***REMOVED*** @param {string=} opt_failureMessage Failure message when the values don't
***REMOVED***     match.
***REMOVED***
goog.testing.proto2.assertEquals = function(expected, actual,
    opt_failureMessage) {
  var failureSummary = opt_failureMessage || '';
  if (!(expected instanceof goog.proto2.Message) ||
      !(actual instanceof goog.proto2.Message)) {
    goog.testing.asserts.raiseException(failureSummary,
        'Bad arguments were passed to goog.testing.proto2.assertEquals');
  }
  if (expected.constructor != actual.constructor) {
    goog.testing.asserts.raiseException(failureSummary,
        'Message type mismatch: ' + expected.getDescriptor().getFullName() +
        ' != ' + actual.getDescriptor().getFullName());
  }
  var diff = goog.testing.proto2.findDifferences_(expected, actual, '');
  if (diff) {
    goog.testing.asserts.raiseException(failureSummary, diff);
  }
***REMOVED***
