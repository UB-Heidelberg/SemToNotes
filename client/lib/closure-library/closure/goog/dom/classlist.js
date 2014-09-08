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
***REMOVED*** @fileoverview Utilities for detecting, adding and removing classes.  Prefer
***REMOVED*** this over goog.dom.classes for new code since it attempts to use classList
***REMOVED*** (DOMTokenList: http://dom.spec.whatwg.org/#domtokenlist) which is faster
***REMOVED*** and requires less code.
***REMOVED***
***REMOVED*** Note: these utilities are meant to operate on HTMLElements
***REMOVED*** and may have unexpected behavior on elements with differing interfaces
***REMOVED*** (such as SVGElements).
***REMOVED***


goog.provide('goog.dom.classlist');

goog.require('goog.array');


***REMOVED***
***REMOVED*** Override this define at build-time if you know your target supports it.
***REMOVED*** @define {boolean} Whether to use the classList property (DOMTokenList).
***REMOVED***
goog.define('goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST', false);


***REMOVED***
***REMOVED*** Gets an array-like object of class names on an element.
***REMOVED*** @param {Element} element DOM node to get the classes of.
***REMOVED*** @return {!goog.array.ArrayLike} Class names on {@code element}.
***REMOVED***
goog.dom.classlist.get = function(element) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList;
  }

  var className = element.className;
  // Some types of elements don't have a className in IE (e.g. iframes).
  // Furthermore, in Firefox, className is not a string when the element is
  // an SVG element.
  return goog.isString(className) && className.match(/\S+/g) || [];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the entire class name of an element.
***REMOVED*** @param {Element} element DOM node to set class of.
***REMOVED*** @param {string} className Class name(s) to apply to element.
***REMOVED***
goog.dom.classlist.set = function(element, className) {
  element.className = className;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if an element has a class.  This method may throw a DOM
***REMOVED*** exception for an invalid or empty class name if DOMTokenList is used.
***REMOVED*** @param {Element} element DOM node to test.
***REMOVED*** @param {string} className Class name to test for.
***REMOVED*** @return {boolean} Whether element has the class.
***REMOVED***
goog.dom.classlist.contains = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList.contains(className);
  }
  return goog.array.contains(goog.dom.classlist.get(element), className);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a class to an element.  Does not add multiples of class names.  This
***REMOVED*** method may throw a DOM exception for an invalid or empty class name if
***REMOVED*** DOMTokenList is used.
***REMOVED*** @param {Element} element DOM node to add class to.
***REMOVED*** @param {string} className Class name to add.
***REMOVED***
goog.dom.classlist.add = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.add(className);
    return;
  }

  if (!goog.dom.classlist.contains(element, className)) {
    // Ensure we add a space if this is not the first class name added.
    element.className += element.className.length > 0 ?
        (' ' + className) : className;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method to add a number of class names at once.
***REMOVED*** @param {Element} element The element to which to add classes.
***REMOVED*** @param {goog.array.ArrayLike.<string>} classesToAdd An array-like object
***REMOVED*** containing a collection of class names to add to the element.
***REMOVED*** This method may throw a DOM exception if classesToAdd contains invalid
***REMOVED*** or empty class names.
***REMOVED***
goog.dom.classlist.addAll = function(element, classesToAdd) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToAdd, function(className) {
      goog.dom.classlist.add(element, className);
    });
    return;
  }

  var classMap = {***REMOVED***

  // Get all current class names into a map.
  goog.array.forEach(goog.dom.classlist.get(element),
      function(className) {
        classMap[className] = true;
      });

  // Add new class names to the map.
  goog.array.forEach(classesToAdd,
      function(className) {
        classMap[className] = true;
      });

  // Flatten the keys of the map into the className.
  element.className = '';
  for (var className in classMap) {
    element.className += element.className.length > 0 ?
        (' ' + className) : className;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a class from an element.  This method may throw a DOM exception
***REMOVED*** for an invalid or empty class name if DOMTokenList is used.
***REMOVED*** @param {Element} element DOM node to remove class from.
***REMOVED*** @param {string} className Class name to remove.
***REMOVED***
goog.dom.classlist.remove = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.remove(className);
    return;
  }

  if (goog.dom.classlist.contains(element, className)) {
    // Filter out the class name.
    element.className = goog.array.filter(
        goog.dom.classlist.get(element),
        function(c) {
          return c != className;
        }).join(' ');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a set of classes from an element.  Prefer this call to
***REMOVED*** repeatedly calling {@code goog.dom.classlist.remove} if you want to remove
***REMOVED*** a large set of class names at once.
***REMOVED*** @param {Element} element The element from which to remove classes.
***REMOVED*** @param {goog.array.ArrayLike.<string>} classesToRemove An array-like object
***REMOVED*** containing a collection of class names to remove from the element.
***REMOVED*** This method may throw a DOM exception if classesToRemove contains invalid
***REMOVED*** or empty class names.
***REMOVED***
goog.dom.classlist.removeAll = function(element, classesToRemove) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToRemove, function(className) {
      goog.dom.classlist.remove(element, className);
    });
    return;
  }
  // Filter out those classes in classesToRemove.
  element.className = goog.array.filter(
      goog.dom.classlist.get(element),
      function(className) {
        // If this class is not one we are trying to remove,
        // add it to the array of new class names.
        return !goog.array.contains(classesToRemove, className);
      }).join(' ');
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes a class depending on the enabled argument.  This method
***REMOVED*** may throw a DOM exception for an invalid or empty class name if DOMTokenList
***REMOVED*** is used.
***REMOVED*** @param {Element} element DOM node to add or remove the class on.
***REMOVED*** @param {string} className Class name to add or remove.
***REMOVED*** @param {boolean} enabled Whether to add or remove the class (true adds,
***REMOVED***     false removes).
***REMOVED***
goog.dom.classlist.enable = function(element, className, enabled) {
  if (enabled) {
    goog.dom.classlist.add(element, className);
  } else {
    goog.dom.classlist.remove(element, className);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes a set of classes depending on the enabled argument.  This
***REMOVED*** method may throw a DOM exception for an invalid or empty class name if
***REMOVED*** DOMTokenList is used.
***REMOVED*** @param {!Element} element DOM node to add or remove the class on.
***REMOVED*** @param {goog.array.ArrayLike.<string>} classesToEnable An array-like object
***REMOVED***     containing a collection of class names to add or remove from the element.
***REMOVED*** @param {boolean} enabled Whether to add or remove the classes (true adds,
***REMOVED***     false removes).
***REMOVED***
goog.dom.classlist.enableAll = function(element, classesToEnable, enabled) {
  var f = enabled ? goog.dom.classlist.addAll :
      goog.dom.classlist.removeAll;
  f(element, classesToEnable);
***REMOVED***


***REMOVED***
***REMOVED*** Switches a class on an element from one to another without disturbing other
***REMOVED*** classes. If the fromClass isn't removed, the toClass won't be added.  This
***REMOVED*** method may throw a DOM exception if the class names are empty or invalid.
***REMOVED*** @param {Element} element DOM node to swap classes on.
***REMOVED*** @param {string} fromClass Class to remove.
***REMOVED*** @param {string} toClass Class to add.
***REMOVED*** @return {boolean} Whether classes were switched.
***REMOVED***
goog.dom.classlist.swap = function(element, fromClass, toClass) {
  if (goog.dom.classlist.contains(element, fromClass)) {
    goog.dom.classlist.remove(element, fromClass);
    goog.dom.classlist.add(element, toClass);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a class if an element has it, and adds it the element doesn't have
***REMOVED*** it.  Won't affect other classes on the node.  This method may throw a DOM
***REMOVED*** exception if the class name is empty or invalid.
***REMOVED*** @param {Element} element DOM node to toggle class on.
***REMOVED*** @param {string} className Class to toggle.
***REMOVED*** @return {boolean} True if class was added, false if it was removed
***REMOVED***     (in other words, whether element has the class after this function has
***REMOVED***     been called).
***REMOVED***
goog.dom.classlist.toggle = function(element, className) {
  var add = !goog.dom.classlist.contains(element, className);
  goog.dom.classlist.enable(element, className, add);
  return add;
***REMOVED***


***REMOVED***
***REMOVED*** Adds and removes a class of an element.  Unlike
***REMOVED*** {@link goog.dom.classlist.swap}, this method adds the classToAdd regardless
***REMOVED*** of whether the classToRemove was present and had been removed.  This method
***REMOVED*** may throw a DOM exception if the class names are empty or invalid.
***REMOVED***
***REMOVED*** @param {Element} element DOM node to swap classes on.
***REMOVED*** @param {string} classToRemove Class to remove.
***REMOVED*** @param {string} classToAdd Class to add.
***REMOVED***
goog.dom.classlist.addRemove = function(element, classToRemove, classToAdd) {
  goog.dom.classlist.remove(element, classToRemove);
  goog.dom.classlist.add(element, classToAdd);
***REMOVED***
