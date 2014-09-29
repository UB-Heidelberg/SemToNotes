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
***REMOVED*** @fileoverview Provides utility methods to render soy template.
***REMOVED***

goog.provide('goog.soy');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagName');
goog.require('goog.soy.data');


***REMOVED***
***REMOVED*** @define {boolean} Whether to require all Soy templates to be "strict html".
***REMOVED*** Soy templates that use strict autoescaping forbid noAutoescape along with
***REMOVED*** many dangerous directives, and return a runtime type SanitizedContent that
***REMOVED*** marks them as safe.
***REMOVED***
***REMOVED*** If this flag is enabled, Soy templates will fail to render if a template
***REMOVED*** returns plain text -- indicating it is a non-strict template.
***REMOVED***
goog.soy.REQUIRE_STRICT_AUTOESCAPE = false;


***REMOVED***
***REMOVED*** Renders a Soy template and then set the output string as
***REMOVED*** the innerHTML of an element. It is recommended to use this helper function
***REMOVED*** instead of directly setting innerHTML in your hand-written code, so that it
***REMOVED*** will be easier to audit the code for cross-site scripting vulnerabilities.
***REMOVED***
***REMOVED*** @param {Element} element The element whose content we are rendering into.
***REMOVED*** @param {Function} template The Soy template defining the element's content.
***REMOVED*** @param {Object=} opt_templateData The data for the template.
***REMOVED*** @param {Object=} opt_injectedData The injected data for the template.
***REMOVED***
goog.soy.renderElement = function(element, template, opt_templateData,
                                  opt_injectedData) {
  element.innerHTML = goog.soy.verifyTemplateOutputSafe_(template(
      opt_templateData || goog.soy.defaultTemplateData_, undefined,
      opt_injectedData));
***REMOVED***


***REMOVED***
***REMOVED*** Renders a Soy template into a single node or a document
***REMOVED*** fragment. If the rendered HTML string represents a single node, then that
***REMOVED*** node is returned (note that this is***REMOVED***not* a fragment, despite them name of
***REMOVED*** the method). Otherwise a document fragment is returned containing the
***REMOVED*** rendered nodes.
***REMOVED***
***REMOVED*** @param {Function} template The Soy template defining the element's content.
***REMOVED*** @param {Object=} opt_templateData The data for the template.
***REMOVED*** @param {Object=} opt_injectedData The injected data for the template.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper used to
***REMOVED***     create DOM nodes; defaults to {@code goog.dom.getDomHelper}.
***REMOVED*** @return {!Node} The resulting node or document fragment.
***REMOVED***
goog.soy.renderAsFragment = function(template, opt_templateData,
                                     opt_injectedData, opt_domHelper) {
  var dom = opt_domHelper || goog.dom.getDomHelper();
  return dom.htmlToDocumentFragment(goog.soy.verifyTemplateOutputSafe_(
      template(opt_templateData || goog.soy.defaultTemplateData_,
               undefined, opt_injectedData)));
***REMOVED***


***REMOVED***
***REMOVED*** Renders a Soy template into a single node. If the rendered
***REMOVED*** HTML string represents a single node, then that node is returned. Otherwise,
***REMOVED*** a DIV element is returned containing the rendered nodes.
***REMOVED***
***REMOVED*** @param {Function} template The Soy template defining the element's content.
***REMOVED*** @param {Object=} opt_templateData The data for the template.
***REMOVED*** @param {Object=} opt_injectedData The injected data for the template.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper used to
***REMOVED***     create DOM nodes; defaults to {@code goog.dom.getDomHelper}.
***REMOVED*** @return {!Element} Rendered template contents, wrapped in a parent DIV
***REMOVED***     element if necessary.
***REMOVED***
goog.soy.renderAsElement = function(template, opt_templateData,
                                    opt_injectedData, opt_domHelper) {
  var dom = opt_domHelper || goog.dom.getDomHelper();
  var wrapper = dom.createElement(goog.dom.TagName.DIV);
  wrapper.innerHTML = goog.soy.verifyTemplateOutputSafe_(template(
      opt_templateData || goog.soy.defaultTemplateData_,
      undefined, opt_injectedData));

  // If the template renders as a single element, return it.
  if (wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if (firstChild.nodeType == goog.dom.NodeType.ELEMENT) {
      return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (firstChild);
    }
  }

  // Otherwise, return the wrapper DIV.
  return wrapper;
***REMOVED***


***REMOVED***
***REMOVED*** Verifies that a template result is "safe" to insert as HTML.
***REMOVED***
***REMOVED*** Note if the template is non-strict autoescape, the guarantees here are very
***REMOVED*** weak. It is recommended applications switch to requiring strict
***REMOVED*** autoescaping over time.
***REMOVED***
***REMOVED*** @param {*} templateResult The template result.
***REMOVED*** @return {string} The assumed-safe HTML output string.
***REMOVED*** @private
***REMOVED***
goog.soy.verifyTemplateOutputSafe_ = function(templateResult) {
  // Allow strings as long as strict autoescaping is not mandated. Note we
  // allow everything that isn't an object, because some non-escaping templates
  // end up returning non-strings if their only print statement is a
  // non-escaped argument, plus some unit tests spoof templates.
  // TODO(gboyer): Track down and fix these cases.
  if (!goog.soy.REQUIRE_STRICT_AUTOESCAPE && !goog.isObject(templateResult)) {
    return String(templateResult);
  }

  // Allow SanitizedContent of kind HTML.
  if (templateResult instanceof goog.soy.data.SanitizedContent) {
    templateResult =***REMOVED*****REMOVED*** @type {!goog.soy.data.SanitizedContent}***REMOVED*** (
        templateResult);
    var ContentKind = goog.soy.data.SanitizedContentKind;
    if (templateResult.contentKind === ContentKind.HTML ||
        templateResult.contentKind === ContentKind.ATTRIBUTES) {
      return goog.asserts.assertString(templateResult.content);
    }
  }

  goog.asserts.fail('Soy template output is unsafe for use as HTML: ' +
      templateResult);

  // In production, return a safe string, rather than failing hard.
  return 'zSoyz';
***REMOVED***


***REMOVED***
***REMOVED*** Immutable object that is passed into templates that are rendered
***REMOVED*** without any data.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.soy.defaultTemplateData_ = {***REMOVED***
