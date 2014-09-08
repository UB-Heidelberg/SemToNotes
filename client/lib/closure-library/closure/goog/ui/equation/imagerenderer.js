// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Functions for rendering the equation images.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.equation.ImageRenderer');

goog.require('goog.asserts');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.string');
goog.require('goog.uri.utils');


***REMOVED***
***REMOVED*** The server name which renders the equations.
***REMOVED*** We use https as equations may be embedded in https pages
***REMOVED*** and using https prevents mixed content warnings. Note that
***REMOVED*** https equations work only on google.com domains.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.equation.ImageRenderer.SERVER_NAME_ =
    'https://www.google.com';


***REMOVED***
***REMOVED*** The longest equation which may be displayed, in characters.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.equation.ImageRenderer.MAX_EQUATION_LENGTH = 200;


***REMOVED***
***REMOVED*** Class to put on our equations IMG elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.EE_IMG_CLASS = 'ee_img';


***REMOVED***
***REMOVED*** Non-standard to put on our equations IMG elements. Useful when classes need
***REMOVED*** to be scrubbed from the user-generated HTML, but non-standard attributes
***REMOVED*** can be white-listed.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.EE_IMG_ATTR = 'eeimg';


***REMOVED***
***REMOVED*** Vertical alignment for the equations IMG elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.EE_IMG_VERTICAL_ALIGN = 'middle';


***REMOVED***
***REMOVED*** The default background color as used in the img url, which is fully
***REMOVED*** transparent white.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.BACKGROUND_COLOR = 'FFFFFF00';


***REMOVED***
***REMOVED*** The default foreground color as used in the img url, which is black.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.FOREGROUND_COLOR = '000000';


***REMOVED***
***REMOVED*** Class to put on IMG elements to keep the resize property bubble from
***REMOVED*** appearing. This is different from PLACEHOLDER_IMG_CLASS because it's
***REMOVED*** reasonable in some cases to be able to resize a placeholder (which should
***REMOVED*** be reflected when the placeholder is replaced with the other content).
***REMOVED*** @type {string}
***REMOVED***
goog.ui.equation.ImageRenderer.NO_RESIZE_IMG_CLASS =
    goog.getCssName('tr_noresize');


***REMOVED***
***REMOVED*** Returns the equation image src url given the equation.
***REMOVED*** @param {string} equation The equation.
***REMOVED*** @return {string} The equation image src url (empty string in case the
***REMOVED***   equation was empty).
***REMOVED***
goog.ui.equation.ImageRenderer.getImageUrl = function(equation) {
  if (!equation) {
    return '';
  }

  var url = goog.ui.equation.ImageRenderer.SERVER_NAME_ +
      '/chart?cht=tx' +
      '&chf=bg,s,' +
      goog.ui.equation.ImageRenderer.BACKGROUND_COLOR +
      '&chco=' +
      goog.ui.equation.ImageRenderer.FOREGROUND_COLOR +
      '&chl=' +
      encodeURIComponent(equation);
  return url;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the equation string src for given image url.
***REMOVED*** @param {string} imageUrl The image url.
***REMOVED*** @return {string?} The equation string, null if imageUrl cannot be parsed.
***REMOVED***
goog.ui.equation.ImageRenderer.getEquationFromImageUrl = function(imageUrl) {
  return goog.uri.utils.getParamValue(imageUrl, 'chl');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the equation string from the given equation IMG node. Returns empty
***REMOVED*** string if the src attribute of the is not a valid equation url.
***REMOVED*** @param {Element} equationNode The equation IMG element.
***REMOVED*** @return {string} The equation string.
***REMOVED***
goog.ui.equation.ImageRenderer.getEquationFromImage = function(equationNode) {
  var url = equationNode.getAttribute('src');
  if (!url) {
    // Should never happen.
    return '';
  }
  return goog.ui.equation.ImageRenderer.getEquationFromImageUrl(
      url) || '';
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether given node is an equation element.
***REMOVED*** @param {Node} node The node to check, must be an Element.
***REMOVED*** @return {boolean} Whether given node is an equation element.
***REMOVED***
goog.ui.equation.ImageRenderer.isEquationElement = function(node) {
  var elem = goog.asserts.assertElement(node);
  return elem.nodeName == goog.dom.TagName.IMG &&
      (!!elem.getAttribute(
      goog.ui.equation.ImageRenderer.EE_IMG_ATTR) ||
          goog.dom.classlist.contains(elem,
              goog.ui.equation.ImageRenderer.EE_IMG_CLASS));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the html for the html image tag for the given equation.
***REMOVED*** @param {string} equation The equation.
***REMOVED*** @return {string} The html code to embed in the document.
***REMOVED***
goog.ui.equation.ImageRenderer.getHtml = function(equation) {
  var imageSrc =
      goog.ui.equation.ImageRenderer.getImageUrl(equation);
  if (!imageSrc) {
    return '';
  }
  return '<img src="' + imageSrc + '" ' +
      'alt="' + goog.string.htmlEscape(equation) + '" ' +
      'class="' + goog.ui.equation.ImageRenderer.EE_IMG_CLASS +
      ' ' + goog.ui.equation.ImageRenderer.NO_RESIZE_IMG_CLASS +
      '" ' + goog.ui.equation.ImageRenderer.EE_IMG_ATTR + '="1" ' +
      'style="vertical-align: ' +
      goog.ui.equation.ImageRenderer.EE_IMG_VERTICAL_ALIGN + '">';
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether equation is too long to be displayed.
***REMOVED*** @param {string} equation The equation to test.
***REMOVED*** @return {boolean} Whether the equation is too long.
***REMOVED***
goog.ui.equation.ImageRenderer.isEquationTooLong = function(equation) {
  return equation.length >
      goog.ui.equation.ImageRenderer.MAX_EQUATION_LENGTH;
***REMOVED***
