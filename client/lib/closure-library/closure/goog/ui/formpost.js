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
***REMOVED*** @fileoverview Utility for making the browser submit a hidden form, which can
***REMOVED*** be used to effect a POST from JavaScript.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.FormPost');

goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.safe');
goog.require('goog.html.SafeHtml');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Creates a formpost object.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED*** @param {goog.dom.DomHelper=} opt_dom The DOM helper.
***REMOVED*** @final
***REMOVED***
goog.ui.FormPost = function(opt_dom) {
  goog.ui.Component.call(this, opt_dom);
***REMOVED***
goog.inherits(goog.ui.FormPost, goog.ui.Component);


***REMOVED*** @override***REMOVED***
goog.ui.FormPost.prototype.createDom = function() {
  this.setElementInternal(this.getDomHelper().createDom(goog.dom.TagName.FORM,
      {'method': 'POST', 'style': 'display:none'}));
***REMOVED***


***REMOVED***
***REMOVED*** Constructs a POST request and directs the browser as if a form were
***REMOVED*** submitted.
***REMOVED*** @param {Object} parameters Object with parameter values. Values can be
***REMOVED***     strings, numbers, or arrays of strings or numbers.
***REMOVED*** @param {string=} opt_url The destination URL. If not specified, uses the
***REMOVED***     current URL for window for the DOM specified in the constructor.
***REMOVED*** @param {string=} opt_target An optional name of a window in which to open the
***REMOVED***     URL. If not specified, uses the window for the DOM specified in the
***REMOVED***     constructor.
***REMOVED***
goog.ui.FormPost.prototype.post = function(parameters, opt_url, opt_target) {
  var form = this.getElement();
  if (!form) {
    this.render();
    form = this.getElement();
  }
  form.action = opt_url || '';
  form.target = opt_target || '';
  this.setParameters_(form, parameters);
  form.submit();
***REMOVED***


***REMOVED***
***REMOVED*** Creates hidden inputs in a form to match parameters.
***REMOVED*** @param {!Element} form The form element.
***REMOVED*** @param {Object} parameters Object with parameter values. Values can be
***REMOVED***     strings, numbers, or arrays of strings or numbers.
***REMOVED*** @private
***REMOVED***
goog.ui.FormPost.prototype.setParameters_ = function(form, parameters) {
  var name, value, html = [];
  for (name in parameters) {
    value = parameters[name];
    if (goog.isArrayLike(value)) {
      goog.array.forEach(value, goog.bind(function(innerValue) {
        html.push(this.createInput_(name, String(innerValue)));
      }, this));
    } else {
      html.push(this.createInput_(name, String(value)));
    }
  }
  goog.dom.safe.setInnerHtml(form, goog.html.SafeHtml.concat(html));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a hidden <input> tag.
***REMOVED*** @param {string} name The name of the input.
***REMOVED*** @param {string} value The value of the input.
***REMOVED*** @return {!goog.html.SafeHtml}
***REMOVED*** @private
***REMOVED***
goog.ui.FormPost.prototype.createInput_ = function(name, value) {
  return goog.html.SafeHtml.create('input',
      {'type': 'hidden', 'name': name, 'value': value});
***REMOVED***
