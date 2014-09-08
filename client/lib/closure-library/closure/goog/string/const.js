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

goog.provide('goog.string.Const');

goog.require('goog.asserts');
goog.require('goog.string.TypedString');



***REMOVED***
***REMOVED*** Wrapper for compile-time-constant strings.
***REMOVED***
***REMOVED*** Const is a wrapper for strings that can only be created from program
***REMOVED*** constants (i.e., string literals).  This property relies on a custom Closure
***REMOVED*** compiler check that {@code goog.string.Const.from} is only invoked on
***REMOVED*** compile-time-constant expressions.
***REMOVED***
***REMOVED*** Const is useful in APIs whose correct and secure use requires that certain
***REMOVED*** arguments are not attacker controlled: Compile-time constants are inherently
***REMOVED*** under the control of the application and not under control of external
***REMOVED*** attackers, and hence are safe to use in such contexts.
***REMOVED***
***REMOVED*** Instances of this type must be created via its factory method
***REMOVED*** {@code goog.string.Const.from} and not by invoking its constructor.  The
***REMOVED*** constructor intentionally takes no parameters and the type is immutable;
***REMOVED*** hence only a default instance corresponding to the empty string can be
***REMOVED*** obtained via constructor invocation.
***REMOVED***
***REMOVED*** @see goog.string.Const#from
***REMOVED***
***REMOVED*** @final
***REMOVED*** @struct
***REMOVED*** @implements {goog.string.TypedString}
***REMOVED***
goog.string.Const = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The wrapped value of this Const object.  The field has a purposely ugly
  ***REMOVED*** name to make (non-compiled) code that attempts to directly access this
  ***REMOVED*** field stand out.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** A type marker used to implement additional run-time type checking.
  ***REMOVED*** @see goog.string.Const#unwrap
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ =
      goog.string.Const.TYPE_MARKER_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @const
***REMOVED***
goog.string.Const.prototype.implementsGoogStringTypedString = true;


***REMOVED***
***REMOVED*** Returns this Const's value a string.
***REMOVED***
***REMOVED*** IMPORTANT: In code where it is security-relevant that an object's type is
***REMOVED*** indeed {@code goog.string.Const}, use {@code goog.string.Const.unwrap}
***REMOVED*** instead of this method.
***REMOVED***
***REMOVED*** @see goog.string.Const#unwrap
***REMOVED*** @override
***REMOVED***
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a debug-string representation of this value.
***REMOVED***
***REMOVED*** To obtain the actual string value wrapped inside an object of this type,
***REMOVED*** use {@code goog.string.Const.unwrap}.
***REMOVED***
***REMOVED*** @see goog.string.Const#unwrap
***REMOVED*** @override
***REMOVED***
goog.string.Const.prototype.toString = function() {
  return 'Const{' +
         this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ +
         '}';
***REMOVED***


***REMOVED***
***REMOVED*** Performs a runtime check that the provided object is indeed an instance
***REMOVED*** of {@code goog.string.Const}, and returns its value.
***REMOVED*** @param {!goog.string.Const} stringConst The object to extract from.
***REMOVED*** @return {string} The Const object's contained string, unless the run-time
***REMOVED***     type check fails. In that case, {@code unwrap} returns an innocuous
***REMOVED***     string, or, if assertions are enabled, throws
***REMOVED***     {@code goog.asserts.AssertionError}.
***REMOVED***
goog.string.Const.unwrap = function(stringConst) {
  // Perform additional run-time type-checking to ensure that stringConst is
  // indeed an instance of the expected type.  This provides some additional
  // protection against security bugs due to application code that disables type
  // checks.
  if (stringConst instanceof goog.string.Const &&
      stringConst.constructor === goog.string.Const &&
      stringConst.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ ===
          goog.string.Const.TYPE_MARKER_) {
    return stringConst.
        stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  } else {
    goog.asserts.fail('expected object of type Const, got \'' +
                      stringConst + '\'');
    return 'type_error:Const';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Const object from a compile-time constant string.
***REMOVED***
***REMOVED*** It is illegal to invoke this function on an expression whose
***REMOVED*** compile-time-contant value cannot be determined by the Closure compiler.
***REMOVED***
***REMOVED*** Correct invocations include,
***REMOVED*** <pre>
***REMOVED***   var s = goog.string.Const.from('hello');
***REMOVED***   var t = goog.string.Const.from('hello' + 'world');
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** In contrast, the following are illegal:
***REMOVED*** <pre>
***REMOVED***   var s = goog.string.Const.from(getHello());
***REMOVED***   var t = goog.string.Const.from('hello' + world);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** TODO(user): Compile-time checks that this function is only called
***REMOVED*** with compile-time constant expressions.
***REMOVED***
***REMOVED*** @param {string} s A constant string from which to create a Const.
***REMOVED*** @return {!goog.string.Const} A Const object initialized to stringConst.
***REMOVED***
goog.string.Const.from = function(s) {
  return goog.string.Const.create__googStringSecurityPrivate_(s);
***REMOVED***


***REMOVED***
***REMOVED*** Type marker for the Const type, used to implement additional run-time
***REMOVED*** type checking.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.string.Const.TYPE_MARKER_ = {***REMOVED***


***REMOVED***
***REMOVED*** Utility method to create Const instances.
***REMOVED*** @param {string} s The string to initialize the Const object with.
***REMOVED*** @return {!goog.string.Const} The initialized Const object.
***REMOVED*** @private
***REMOVED***
goog.string.Const.create__googStringSecurityPrivate_ = function(s) {
  var stringConst = new goog.string.Const();
  stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_ =
      s;
  return stringConst;
***REMOVED***
