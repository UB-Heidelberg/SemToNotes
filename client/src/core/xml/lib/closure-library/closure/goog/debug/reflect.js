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
***REMOVED*** @fileoverview JavaScript reflection tools. They should only be used for
***REMOVED*** debugging non-compiled code or tests, because there is no guarantee that
***REMOVED*** they work consistently in all browsers.
***REMOVED***
***REMOVED***

goog.provide('goog.debug.reflect');


***REMOVED***
***REMOVED*** Maps the unique id of the known constructors to their full names.
***REMOVED*** Initialized lazily.
***REMOVED*** @type {Object.<number, string>}
***REMOVED*** @private
***REMOVED***
goog.debug.reflect.typeMap_ = null;


***REMOVED***
***REMOVED*** List of all known constructors. Initialized lazily.
***REMOVED*** @type {Array.<!Function>}
***REMOVED*** @private
***REMOVED***
goog.debug.reflect.constructors_ = null;


***REMOVED***
***REMOVED*** Copy of {@code Object.prototype.toString} to use if it is overridden later.
***REMOVED*** Although saving the original {@code toString} somewhat protects against
***REMOVED*** third-party libraries which touch {@code Object.prototype}, the actual goal
***REMOVED*** of this assignment is to allow overriding that method, thus more debug
***REMOVED*** information can be exposed about objects.
***REMOVED*** See {@link goog.debug.reflect.typeOf}.
***REMOVED*** @private
***REMOVED***
goog.debug.reflect.toString_ = Object.prototype.toString;


***REMOVED***
***REMOVED*** Registers a type which will be recognized by goog.debug.reflect.typeOf.
***REMOVED*** @param {string} name Full name of the type.
***REMOVED*** @param {!Function} ctor The constructor.
***REMOVED*** @private
***REMOVED***
goog.debug.reflect.registerType_ = function(name, ctor) {
  goog.debug.reflect.constructors_.push(ctor);
  goog.debug.reflect.typeMap_[goog.getUid(ctor)] = name;
***REMOVED***


***REMOVED***
***REMOVED*** Adds all known constructors to the type registry.
***REMOVED*** @private
***REMOVED***
goog.debug.reflect.init_ = function() {
  if (goog.debug.reflect.typeMap_) {
    return;
  }

  goog.debug.reflect.typeMap_ = {***REMOVED***
  goog.debug.reflect.constructors_ = [];
  var implicitNs = goog.getObjectByName('goog.implicitNamespaces_') || {***REMOVED***

  for (var ns in implicitNs) {
    if (implicitNs.hasOwnProperty(ns)) {
      var nsObj = goog.getObjectByName(ns);
      for (var name in nsObj) {
        if (nsObj.hasOwnProperty(name) && goog.isFunction(nsObj[name])) {
          goog.debug.reflect.registerType_(ns + '.' + name, nsObj[name]);
        }
      }
    }
  }

  goog.debug.reflect.registerType_('Array', Array);
  goog.debug.reflect.registerType_('Boolean', Boolean);
  goog.debug.reflect.registerType_('Date', Date);
  goog.debug.reflect.registerType_('Error', Error);
  goog.debug.reflect.registerType_('Function', Function);
  goog.debug.reflect.registerType_('Number', Number);
  goog.debug.reflect.registerType_('Object', Object);
  goog.debug.reflect.registerType_('String', String);

  // The compiler gets upset if we alias regexp directly, because
  // then it can't optimize regexps as well. Just be sneaky about it,
  // because this is only for debugging.
  goog.debug.reflect.registerType_('RegExp', goog.global['RegExp']);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of a type of object.
***REMOVED*** @param {!Function} classConstructor A object constructor to get the name of.
***REMOVED*** @return {string|undefined} The string name of the class.
***REMOVED***
goog.debug.reflect.className = function(classConstructor) {
  goog.debug.reflect.init_();
  if (goog.isDefAndNotNull(classConstructor)) {
    return goog.debug.reflect.typeMap_[goog.getUid(classConstructor)];
  } else {
    return undefined;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Guesses the real type of the object, even if its {@code toString} method is
***REMOVED*** overridden. Gives exact result for all goog.provided classes in non-compiled
***REMOVED*** code, and some often used native classes in compiled code too. Not tested in
***REMOVED*** multi-frame environment.
***REMOVED***
***REMOVED*** Example use case to get better type information in the Watch tab of FireBug:
***REMOVED*** <pre>
***REMOVED*** Object.prototype.toString = function() {
***REMOVED***   return goog.debug.reflect.typeOf(this);
***REMOVED******REMOVED*****REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {*} obj An arbitrary variable to get the type of.
***REMOVED*** @return {string} The namespaced type of the argument or 'Object' if didn't
***REMOVED***     manage to determine it. Warning: in IE7 ActiveX (including DOM) objects
***REMOVED***     don't expose their type to JavaScript. Their {@code constructor}
***REMOVED***     property is undefined and they are not even the instances of the
***REMOVED***     {@code Object} type. This method will recognize them as 'ActiveXObject'.
***REMOVED***
goog.debug.reflect.typeOf = function(obj) {
  // Check primitive types.
  if (!obj || goog.isNumber(obj) || goog.isString(obj) || goog.isBoolean(obj)) {
    return goog.typeOf(obj);
  }

  // Check if the type is present in the registry.
  goog.debug.reflect.init_();
  if (obj.constructor) {
    // Some DOM objects such as document don't have constructor in IE7.
    var type = goog.debug.reflect.typeMap_[goog.getUid(obj.constructor)];
    if (type) {
      return type;
    }
  }

  // In IE8 the internal 'class' property of ActiveXObjects is Object, but
  // String(obj) tells their real type.
  var isActiveXObject = goog.global.ActiveXObject &&
      obj instanceof ActiveXObject;
  var typeString = isActiveXObject ? String(obj) :
      goog.debug.reflect.toString_.call(***REMOVED*** @type {Object}***REMOVED*** (obj));
  var match = typeString.match(/^\[object (\w+)\]$/);
  if (match) {
    var name = match[1];
    var ctor = goog.global[name];
    try {
      if (obj instanceof ctor) {
        return name;
      }
    } catch (e) {
      // instanceof may fail if the guessed name is not a real type.
    }
  }

  // Fall back to Object or ActiveXObject.
  return isActiveXObject ? 'ActiveXObject' : 'Object';
***REMOVED***
