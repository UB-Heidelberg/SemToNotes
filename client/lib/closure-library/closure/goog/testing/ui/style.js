// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Tools for testing Closure renderers against static markup
***REMOVED*** spec pages.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.ui.style');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.testing.asserts');


***REMOVED***
***REMOVED*** Uses document.write to add an iFrame to the page with the reference path in
***REMOVED*** the src attribute. Used for loading an html file containing reference
***REMOVED*** structures to test against into the page. Should be called within the body of
***REMOVED*** the jsunit test page.
***REMOVED*** @param {string} referencePath A path to a reference HTML file.
***REMOVED***
goog.testing.ui.style.writeReferenceFrame = function(referencePath) {
  document.write('<iframe id="reference" name="reference" ' +
      'src="' + referencePath + '"></iframe>');
***REMOVED***


***REMOVED***
***REMOVED*** Returns a reference to the first element child of a node with the given id
***REMOVED*** from the page loaded into the reference iFrame. Used to retrieve a particular
***REMOVED*** reference DOM structure to test against.
***REMOVED*** @param {string} referenceId The id of a container element for a reference
***REMOVED***   structure in the reference page.
***REMOVED*** @return {Node} The root element of the reference structure.
***REMOVED***
goog.testing.ui.style.getReferenceNode = function(referenceId) {
  return goog.dom.getFirstElementChild(
      window.frames['reference'].document.getElementById(referenceId));
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of all element children of a given node.
***REMOVED*** @param {Node} element The node to get element children of.
***REMOVED*** @return {!Array.<!Node>} An array of all the element children.
***REMOVED***
goog.testing.ui.style.getElementChildren = function(element) {
  var first = goog.dom.getFirstElementChild(element);
  if (!first) {
    return [];
  }
  var children = [first], next;
  while (next = goog.dom.getNextElementSibling(children[children.length - 1])) {
    children.push(next);
  }
  return children;
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether a given node is a "content" node of a reference structure,
***REMOVED*** which means it is allowed to have arbitrary children.
***REMOVED*** @param {Node} element The node to test.
***REMOVED*** @return {boolean} Whether the given node is a content node or not.
***REMOVED***
goog.testing.ui.style.isContentNode = function(element) {
  return element.className.indexOf('content') != -1;
***REMOVED***


***REMOVED***
***REMOVED*** Tests that the structure, node names, and classes of the given element are
***REMOVED*** the same as the reference structure with the given id. Throws an error if the
***REMOVED*** element doesn't have the same nodes at each level of the DOM with the same
***REMOVED*** classes on each. The test ignores all DOM structure within content nodes.
***REMOVED*** @param {Node} element The root node of the DOM structure to test.
***REMOVED*** @param {string} referenceId The id of the container for the reference
***REMOVED***   structure to test against.
***REMOVED***
goog.testing.ui.style.assertStructureMatchesReference = function(element,
    referenceId) {
  goog.testing.ui.style.assertStructureMatchesReferenceInner_(element,
      goog.testing.ui.style.getReferenceNode(referenceId));
***REMOVED***


***REMOVED***
***REMOVED*** A recursive function for comparing structure, node names, and classes between
***REMOVED*** a test and reference DOM structure. Throws an error if one of these things
***REMOVED*** doesn't match. Used internally by
***REMOVED*** {@link goog.testing.ui.style.assertStructureMatchesReference}.
***REMOVED*** @param {Node} element DOM element to test.
***REMOVED*** @param {Node} reference DOM element to use as a reference (test against).
***REMOVED*** @private
***REMOVED***
goog.testing.ui.style.assertStructureMatchesReferenceInner_ = function(element,
    reference) {
  if (!element && !reference) {
    return;
  }
  assertTrue('Expected two elements.', !!element && !!reference);
  assertEquals('Expected nodes to have the same nodeName.',
      element.nodeName, reference.nodeName);
  var testElem = goog.asserts.assertElement(element);
  var refElem = goog.asserts.assertElement(reference);
  var elementClasses = goog.dom.classlist.get(testElem);
  goog.array.forEach(goog.dom.classlist.get(refElem), function(referenceClass) {
    assertContains('Expected test node to have all reference classes.',
        referenceClass, elementClasses);
  });
  // Call assertStructureMatchesReferenceInner_ on all element children
  // unless this is a content node
  var elChildren = goog.testing.ui.style.getElementChildren(element),
      refChildren = goog.testing.ui.style.getElementChildren(reference);
  if (!goog.testing.ui.style.isContentNode(reference)) {
    if (elChildren.length != refChildren.length) {
      assertEquals('Expected same number of children for a non-content node.',
          elChildren.length, refChildren.length);
    }
    for (var i = 0; i < elChildren.length; i++) {
      goog.testing.ui.style.assertStructureMatchesReferenceInner_(elChildren[i],
          refChildren[i]);
    }
  }
***REMOVED***
