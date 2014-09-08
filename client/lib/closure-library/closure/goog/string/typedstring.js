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

goog.provide('goog.string.TypedString');



***REMOVED***
***REMOVED*** Wrapper for strings that conform to a data type or language.
***REMOVED***
***REMOVED*** Implementations of this interface are wrappers for strings, and typically
***REMOVED*** associate a type contract with the wrapped string.  Concrete implementations
***REMOVED*** of this interface may choose to implement additional run-time type checking,
***REMOVED*** see for example {@code goog.html.SafeHtml}. If available, client code that
***REMOVED*** needs to ensure type membership of an object should use the type's function
***REMOVED*** to assert type membership, such as {@code goog.html.SafeHtml.unwrap}.
***REMOVED*** @interface
***REMOVED***
goog.string.TypedString = function() {***REMOVED***


***REMOVED***
***REMOVED*** Interface marker of the TypedString interface.
***REMOVED***
***REMOVED*** This property can be used to determine at runtime whether or not an object
***REMOVED*** implements this interface.  All implementations of this interface set this
***REMOVED*** property to {@code true}.
***REMOVED*** @type {boolean}
***REMOVED***
goog.string.TypedString.prototype.implementsGoogStringTypedString;


***REMOVED***
***REMOVED*** Retrieves this wrapped string's value.
***REMOVED*** @return {!string} The wrapped string's value.
***REMOVED***
goog.string.TypedString.prototype.getTypedStringValue;
