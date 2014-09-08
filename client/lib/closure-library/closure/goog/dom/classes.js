// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for adding, removing and setting classes.  Prefer
***REMOVED*** {@link goog.dom.classlist} over these utilities since goog.dom.classlist
***REMOVED*** conforms closer to the semantics of Element.classList, is faster (uses
***REMOVED*** native methods rather than parsing strings on every call) and compiles
***REMOVED*** to smaller code as a result.
***REMOVED***
***REMOVED*** Note: these utilities are meant to operate on HTMLElements and
***REMOVED*** will not work on elements with differing interfaces (such as SVGElements).
***REMOVED***
***REMOVED***


goog.provide('goog.dom.classes');

goog.require('goog.array');


***REMOVED***
***REMOVED*** Sets the entire class name of an element.
***REMOVED*** @param {Node} element DOM node to set class of.
***REMOVED*** @param {string} className Class name(s) to apply to element.
***REMOVED***
goog.dom.classes.set = function(element, className) {
  element.className = className;
***REMOVED***


***REMOVED***
***REMOVED*** Gets an array of class names on an element
***REMOVED*** @param {Node} element DOM node to get class of.
***REMOVED*** @return {!Array} Class names on {@code element}. Some browsers add extra
***REMOVED***     properties to the array. Do not depend on any of these!
***REMOVED***
goog.dom.classes.get = function(element) {
  var className = element.className;
  // Some types of elements don't have a className in IE (e.g. iframes).
  // Furthermore, in Firefox, className is not a string when the element is
  // an SVG element.
  return goog.isString(className) && className.match(/\S+/g) || [];
***REMOVED***


***REMOVED***
***REMOVED*** Adds a class or classes to an element. Does not add multiples of class names.
***REMOVED*** @param {Node} element DOM node to add class to.
***REMOVED*** @param {...string} var_args Class names to add.
***REMOVED*** @return {boolean} Whether class was added (or all classes were added).
***REMOVED***
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var expectedCount = classes.length + args.length;
  goog.dom.classes.add_(classes, args);
  goog.dom.classes.set(element, classes.join(' '));
  return classes.length == expectedCount;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a class or classes from an element.
***REMOVED*** @param {Node} element DOM node to remove class from.
***REMOVED*** @param {...string} var_args Class name(s) to remove.
***REMOVED*** @return {boolean} Whether all classes in {@code var_args} were found and
***REMOVED***     removed.
***REMOVED***
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var newClasses = goog.dom.classes.getDifference_(classes, args);
  goog.dom.classes.set(element, newClasses.join(' '));
  return newClasses.length == classes.length - args.length;
***REMOVED***


***REMOVED***
***REMOVED*** Helper method for {@link goog.dom.classes.add} and
***REMOVED*** {@link goog.dom.classes.addRemove}. Adds one or more classes to the supplied
***REMOVED*** classes array.
***REMOVED*** @param {Array.<string>} classes All class names for the element, will be
***REMOVED***     updated to have the classes supplied in {@code args} added.
***REMOVED*** @param {Array.<string>} args Class names to add.
***REMOVED*** @private
***REMOVED***
goog.dom.classes.add_ = function(classes, args) {
  for (var i = 0; i < args.length; i++) {
    if (!goog.array.contains(classes, args[i])) {
      classes.push(args[i]);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method for {@link goog.dom.classes.remove} and
***REMOVED*** {@link goog.dom.classes.addRemove}. Calculates the difference of two arrays.
***REMOVED*** @param {!Array.<string>} arr1 First array.
***REMOVED*** @param {!Array.<string>} arr2 Second array.
***REMOVED*** @return {!Array.<string>} The first array without the elements of the second
***REMOVED***     array.
***REMOVED*** @private
***REMOVED***
goog.dom.classes.getDifference_ = function(arr1, arr2) {
  return goog.array.filter(arr1, function(item) {
    return !goog.array.contains(arr2, item);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Switches a class on an element from one to another without disturbing other
***REMOVED*** classes. If the fromClass isn't removed, the toClass won't be added.
***REMOVED*** @param {Node} element DOM node to swap classes on.
***REMOVED*** @param {string} fromClass Class to remove.
***REMOVED*** @param {string} toClass Class to add.
***REMOVED*** @return {boolean} Whether classes were switched.
***REMOVED***
goog.dom.classes.swap = function(element, fromClass, toClass) {
  var classes = goog.dom.classes.get(element);

  var removed = false;
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] == fromClass) {
      goog.array.splice(classes, i--, 1);
      removed = true;
    }
  }

  if (removed) {
    classes.push(toClass);
    goog.dom.classes.set(element, classes.join(' '));
  }

  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Adds zero or more classes to an element and removes zero or more as a single
***REMOVED*** operation. Unlike calling {@link goog.dom.classes.add} and
***REMOVED*** {@link goog.dom.classes.remove} separately, this is more efficient as it only
***REMOVED*** parses the class property once.
***REMOVED***
***REMOVED*** If a class is in both the remove and add lists, it will be added. Thus,
***REMOVED*** you can use this instead of {@link goog.dom.classes.swap} when you have
***REMOVED*** more than two class names that you want to swap.
***REMOVED***
***REMOVED*** @param {Node} element DOM node to swap classes on.
***REMOVED*** @param {?(string|Array.<string>)} classesToRemove Class or classes to
***REMOVED***     remove, if null no classes are removed.
***REMOVED*** @param {?(string|Array.<string>)} classesToAdd Class or classes to add, if
***REMOVED***     null no classes are added.
***REMOVED***
goog.dom.classes.addRemove = function(element, classesToRemove, classesToAdd) {
  var classes = goog.dom.classes.get(element);
  if (goog.isString(classesToRemove)) {
    goog.array.remove(classes, classesToRemove);
  } else if (goog.isArray(classesToRemove)) {
    classes = goog.dom.classes.getDifference_(classes, classesToRemove);
  }

  if (goog.isString(classesToAdd) &&
      !goog.array.contains(classes, classesToAdd)) {
    classes.push(classesToAdd);
  } else if (goog.isArray(classesToAdd)) {
    goog.dom.classes.add_(classes, classesToAdd);
  }

  goog.dom.classes.set(element, classes.join(' '));
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if an element has a class.
***REMOVED*** @param {Node} element DOM node to test.
***REMOVED*** @param {string} className Class name to test for.
***REMOVED*** @return {boolean} Whether element has the class.
***REMOVED***
goog.dom.classes.has = function(element, className) {
  return goog.array.contains(goog.dom.classes.get(element), className);
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes a class depending on the enabled argument.
***REMOVED*** @param {Node} element DOM node to add or remove the class on.
***REMOVED*** @param {string} className Class name to add or remove.
***REMOVED*** @param {boolean} enabled Whether to add or remove the class (true adds,
***REMOVED***     false removes).
***REMOVED***
goog.dom.classes.enable = function(element, className, enabled) {
  if (enabled) {
    goog.dom.classes.add(element, className);
  } else {
    goog.dom.classes.remove(element, className);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a class if an element has it, and adds it the element doesn't have
***REMOVED*** it.  Won't affect other classes on the node.
***REMOVED*** @param {Node} element DOM node to toggle class on.
***REMOVED*** @param {string} className Class to toggle.
***REMOVED*** @return {boolean} True if class was added, false if it was removed
***REMOVED***     (in other words, whether element has the class after this function has
***REMOVED***     been called).
***REMOVED***
goog.dom.classes.toggle = function(element, className) {
  var add = !goog.dom.classes.has(element, className);
  goog.dom.classes.enable(element, className, add);
  return add;
***REMOVED***
