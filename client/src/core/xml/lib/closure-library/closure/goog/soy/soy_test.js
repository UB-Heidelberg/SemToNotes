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
***REMOVED*** @fileoverview Provides test helpers for Soy tests.
***REMOVED***

goog.provide('goog.soy.testHelper');
goog.setTestOnly('goog.soy.testHelper');

goog.require('goog.dom');
goog.require('goog.soy.data.SanitizedContent');
goog.require('goog.soy.data.SanitizedContentKind');
goog.require('goog.string');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Instantiable subclass of SanitizedContent.
***REMOVED***
***REMOVED*** This is a spoof for sanitized content that isn't robust enough to get
***REMOVED*** through Soy's escaping functions but is good enough for the checks here.
***REMOVED***
***REMOVED*** @param {string} content The text.
***REMOVED*** @param {goog.soy.data.SanitizedContentKind} kind The kind of safe content.
***REMOVED*** @extends {goog.soy.data.SanitizedContent}
***REMOVED***
function SanitizedContentSubclass(content, kind) {
  // IMPORTANT! No superclass chaining to avoid exception being thrown.
  this.content = content;
  this.contentKind = kind;
***REMOVED***
goog.inherits(SanitizedContentSubclass, goog.soy.data.SanitizedContent);


function makeSanitizedContent(content, kind) {
  return new SanitizedContentSubclass(content, kind);
}



//
// Fake Soy-generated template functions.
//

var example = {***REMOVED***


example.textNodeTemplate = function(opt_data, opt_sb, opt_injectedData) {
  assertNotNull(opt_data);
  assertNotUndefined(opt_data);
  return goog.string.htmlEscape(opt_data.name);
***REMOVED***


example.singleRootTemplate = function(opt_data, opt_sb, opt_injectedData) {
  assertNotNull(opt_data);
  assertNotUndefined(opt_data);
  return '<span>' + goog.string.htmlEscape(opt_data.name) + '</span>';
***REMOVED***


example.multiRootTemplate = function(opt_data, opt_sb, opt_injectedData) {
  assertNotNull(opt_data);
  assertNotUndefined(opt_data);
  return '<div>Hello</div><div>' + goog.string.htmlEscape(opt_data.name) +
      '</div>';
***REMOVED***


example.injectedDataTemplate = function(opt_data, opt_sb, opt_injectedData) {
  assertNotNull(opt_data);
  assertNotUndefined(opt_data);
  return goog.string.htmlEscape(opt_data.name) +
      goog.string.htmlEscape(opt_injectedData.name);
***REMOVED***


example.noDataTemplate = function(opt_data, opt_sb, opt_injectedData) {
  assertNotNull(opt_data);
  assertNotUndefined(opt_data);
  return '<div>Hello</div>';
***REMOVED***


example.sanitizedHtmlTemplate = function(opt_data, opt_sb, opt_injectedData) {
  // Test the SanitizedContent constructor.
  return makeSanitizedContent('Hello World',
      goog.soy.data.SanitizedContentKind.HTML);
***REMOVED***


example.sanitizedHtmlAttributeTemplate =
    function(opt_data, opt_sb, opt_injectedData) {
  return makeSanitizedContent('Hello World',
      goog.soy.data.SanitizedContentKind.ATTRIBUTES);
***REMOVED***


example.sanitizedCssTemplate =
    function(opt_data, opt_sb, opt_injectedData) {
  return makeSanitizedContent('display:none',
      goog.soy.data.SanitizedContentKind.CSS);
***REMOVED***


example.unsanitizedTextTemplate =
    function(opt_data, opt_sb, opt_injectedData) {
  return makeSanitizedContent('Hello World',
      goog.soy.data.SanitizedContentKind.TEXT);
***REMOVED***


example.templateSpoofingSanitizedContentString =
    function(opt_data, opt_sb, opt_injectedData) {
  return makeSanitizedContent('Hello World',
    // This is to ensure we're using triple-equals against a unique Javascript
    // object.  For example, in Javascript, consider ({}) == '[Object object]'
    // is true.
    goog.soy.data.SanitizedContentKind.HTML.toString());
***REMOVED***


//
// Test helper functions.
//

***REMOVED***
***REMOVED*** Retrieves the content of document fragment as HTML.
***REMOVED*** @param {Node} fragment The document fragment.
***REMOVED*** @return {string} Content of the document fragment as HTML.
***REMOVED***
function fragmentToHtml(fragment) {
  var testDiv = goog.dom.createElement(goog.dom.TagName.DIV);
  testDiv.appendChild(fragment);
  return elementToInnerHtml(testDiv);
}


***REMOVED***
***REMOVED*** Retrieves the content of an element as HTML.
***REMOVED*** @param {Element} elem The element.
***REMOVED*** @return {string} Content of the element as HTML.
***REMOVED***
function elementToInnerHtml(elem) {
  var innerHtml = elem.innerHTML;
  if (goog.userAgent.IE) {
    innerHtml = innerHtml.replace(/DIV/g, 'div').replace(/\s/g, '');
  }
  return innerHtml;
}
