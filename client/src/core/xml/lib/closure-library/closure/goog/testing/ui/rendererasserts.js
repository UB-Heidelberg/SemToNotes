// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Additional asserts for testing ControlRenderers.
***REMOVED***
***REMOVED*** @author mkretzschmar@google.com (Martin Kretzschmar)
***REMOVED***

goog.provide('goog.testing.ui.rendererasserts');

goog.require('goog.testing.asserts');


***REMOVED***
***REMOVED*** Assert that a control renderer constructor doesn't call getCssClass.
***REMOVED***
***REMOVED*** @param {?function(new:goog.ui.ControlRenderer)} rendererClassUnderTest The
***REMOVED***     renderer constructor to test.
***REMOVED***
goog.testing.ui.rendererasserts.assertNoGetCssClassCallsInConstructor =
    function(rendererClassUnderTest) {
  var getCssClassCalls = 0;

 ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***
  ***REMOVED*** @extends {goog.ui.ControlRenderer}
 ***REMOVED*****REMOVED***
  function TestControlRenderer() {
    rendererClassUnderTest.call(this);
  }
  goog.inherits(TestControlRenderer, rendererClassUnderTest);

 ***REMOVED*****REMOVED*** @override***REMOVED***
  TestControlRenderer.prototype.getCssClass = function() {
    getCssClassCalls++;
    return TestControlRenderer.superClass_.getCssClass.call(this);
 ***REMOVED*****REMOVED***

  var testControlRenderer = new TestControlRenderer();

  assertEquals('Constructors should not call getCssClass, ' +
      'getCustomRenderer must be able to override it post construction.',
      0, getCssClassCalls);
***REMOVED***
