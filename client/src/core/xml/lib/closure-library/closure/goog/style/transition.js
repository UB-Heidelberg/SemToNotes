// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility methods to deal with CSS3 transitions
***REMOVED*** programmatically.
***REMOVED***

goog.provide('goog.style.transition');
goog.provide('goog.style.transition.Css3Property');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom.vendor');
goog.require('goog.style');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** A typedef to represent a CSS3 transition property. Duration and delay
***REMOVED*** are both in seconds. Timing is CSS3 timing function string, such as
***REMOVED*** 'easein', 'linear'.
***REMOVED***
***REMOVED*** Alternatively, specifying string in the form of '[property] [duration]
***REMOVED*** [timing] [delay]' as specified in CSS3 transition is fine too.
***REMOVED***
***REMOVED*** @typedef { {
***REMOVED***   property: string,
***REMOVED***   duration: number,
***REMOVED***   timing: string,
***REMOVED***   delay: number
***REMOVED*** } | string }
***REMOVED***
goog.style.transition.Css3Property;


***REMOVED***
***REMOVED*** Sets the element CSS3 transition to properties.
***REMOVED*** @param {Element} element The element to set transition on.
***REMOVED*** @param {goog.style.transition.Css3Property|
***REMOVED***     Array.<goog.style.transition.Css3Property>} properties A single CSS3
***REMOVED***     transition property or array of properties.
***REMOVED***
goog.style.transition.set = function(element, properties) {
  if (!goog.isArray(properties)) {
    properties = [properties];
  }
  goog.asserts.assert(
      properties.length > 0, 'At least one Css3Property should be specified.');

  var values = goog.array.map(
      properties, function(p) {
        if (goog.isString(p)) {
          return p;
        } else {
          goog.asserts.assertObject(p,
              'Expected css3 property to be an object.');
          var propString = p.property + ' ' + p.duration + 's ' + p.timing +
              ' ' + p.delay + 's';
          goog.asserts.assert(p.property && goog.isNumber(p.duration) &&
              p.timing && goog.isNumber(p.delay),
              'Unexpected css3 property value: %s', propString);
          return propString;
        }
      });
  goog.style.transition.setPropertyValue_(element, values.join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Removes any programmatically-added CSS3 transition in the given element.
***REMOVED*** @param {Element} element The element to remove transition from.
***REMOVED***
goog.style.transition.removeAll = function(element) {
  goog.style.transition.setPropertyValue_(element, '');
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether CSS3 transition is supported.
***REMOVED***
goog.style.transition.isSupported = function() {
  if (!goog.isDef(goog.style.transition.css3TransitionSupported_)) {
    // Since IE would allow any attribute, we need to explicitly check the
    // browser version here instead.
    if (goog.userAgent.IE) {
      goog.style.transition.css3TransitionSupported_ =
          goog.userAgent.isVersion('10.0');
    } else {
      // We create a test element with style=-vendor-transition
      // We then detect whether those style properties are recognized and
      // available from js.
      var el = document.createElement('div');
      var transition = 'transition:opacity 1s linear;';
      var vendorPrefix = goog.dom.vendor.getVendorPrefix();
      var vendorTransition =
          vendorPrefix ? vendorPrefix + '-' + transition : '';
      el.innerHTML = '<div style="' + vendorTransition + transition + '">';

      var testElement =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.firstChild);
      goog.asserts.assert(testElement.nodeType == Node.ELEMENT_NODE);

      goog.style.transition.css3TransitionSupported_ =
          goog.style.getStyle(testElement, 'transition') != '';
    }
  }
  return goog.style.transition.css3TransitionSupported_;
***REMOVED***


***REMOVED***
***REMOVED*** Whether CSS3 transition is supported.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.style.transition.css3TransitionSupported_;


***REMOVED***
***REMOVED*** Sets CSS3 transition property value to the given value.
***REMOVED*** @param {Element} element The element to set transition on.
***REMOVED*** @param {string} transitionValue The CSS3 transition property value.
***REMOVED*** @private
***REMOVED***
goog.style.transition.setPropertyValue_ = function(element, transitionValue) {
  goog.style.setStyle(element, 'transition', transitionValue);
***REMOVED***
