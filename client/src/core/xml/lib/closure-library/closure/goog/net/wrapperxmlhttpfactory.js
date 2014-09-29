// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Implementation of XmlHttpFactory which allows construction from
***REMOVED*** simple factory methods.
***REMOVED*** @author dbk@google.com (David Barrett-Kahn)
***REMOVED***

goog.provide('goog.net.WrapperXmlHttpFactory');

goog.require('goog.net.XmlHttpFactory');



***REMOVED***
***REMOVED*** An xhr factory subclass which can be constructed using two factory methods.
***REMOVED*** This exists partly to allow the preservation of goog.net.XmlHttp.setFactory()
***REMOVED*** with an unchanged signature.
***REMOVED*** @param {function() : !(XMLHttpRequest|GearsHttpRequest)} xhrFactory A
***REMOVED***     function which returns a new XHR object.
***REMOVED*** @param {function() : !Object} optionsFactory A function which returns the
***REMOVED***     options associated with xhr objects from this factory.
***REMOVED*** @extends {goog.net.XmlHttpFactory}
***REMOVED***
***REMOVED***
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** XHR factory method.
  ***REMOVED*** @type {function() : !(XMLHttpRequest|GearsHttpRequest)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xhrFactory_ = xhrFactory;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Options factory method.
  ***REMOVED*** @type {function() : !Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.optionsFactory_ = optionsFactory;
***REMOVED***
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);


***REMOVED*** @override***REMOVED***
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
***REMOVED***

