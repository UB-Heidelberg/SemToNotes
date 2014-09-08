// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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


goog.provide('goog.labs.html.AttributeRewriter');
goog.provide('goog.labs.html.AttributeValue');
goog.provide('goog.labs.html.attributeRewriterPresubmitWorkaround');


***REMOVED***
***REMOVED*** The type of an attribute value.
***REMOVED*** <p>
***REMOVED*** Many HTML attributes contain structured data like URLs, CSS, or even entire
***REMOVED*** HTML documents, so the type is a union of several variants.
***REMOVED***
***REMOVED*** @typedef {(string |
***REMOVED***            goog.html.SafeHtml | goog.html.SafeStyle | goog.html.SafeUrl)}
***REMOVED***
goog.labs.html.AttributeValue;


***REMOVED***
***REMOVED*** A function that takes an attribute value, and returns a safe value.
***REMOVED*** <p>
***REMOVED*** Since rewriters can be chained, a rewriter must be able to accept the output
***REMOVED*** of another rewriter, instead of just a string though a rewriter that coerces
***REMOVED*** its input to a string before checking its safety will fail safe.
***REMOVED*** <p>
***REMOVED*** The meaning of the result is:
***REMOVED*** <table>
***REMOVED***   <tr><td>{@code null}</td>
***REMOVED***       <td>Unsafe.  The attribute should not be output.</tr>
***REMOVED***   <tr><td>a string</td>
***REMOVED***       <td>The plain text (not HTML-entity encoded) of a safe attribute
***REMOVED***           value.</td>
***REMOVED***   <tr><td>a {@link goog.html.SafeHtml}</td>
***REMOVED***       <td>A fragment that is safe to be included as embedded HTML as in
***REMOVED***           {@code <iframe srchtml="...">}.</td></tr>
***REMOVED***   <tr><td>a {@link goog.html.SafeUrl}</td>
***REMOVED***       <td>A URL that does not need to be further checked against the URL
***REMOVED***           white-list.</td></tr>
***REMOVED***   <tr><td>a {@link goog.html.SafeStyle}</td>
***REMOVED***       <td>A safe value for a <code>style="..."</code> attribute.</td></tr>
***REMOVED*** </table>
***REMOVED*** <p>
***REMOVED*** Implementations are responsible for making sure that "safe" complies with
***REMOVED*** the contract established by the safe string types in {@link goog.html}.
***REMOVED*** </p>
***REMOVED***
***REMOVED*** @typedef {function(goog.labs.html.AttributeValue) :
***REMOVED***           goog.labs.html.AttributeValue}
***REMOVED***
goog.labs.html.AttributeRewriter;


***REMOVED***
***REMOVED*** g4 presubmit complains about requires of this file because its clients
***REMOVED*** don't use any symbols from it outside JSCompiler comment annotations.
***REMOVED*** genjsdeps.sh doesn't generate the right dependency graph unless this
***REMOVED*** file is required.
***REMOVED*** Clients can mention this noop.
***REMOVED***
goog.labs.html.attributeRewriterPresubmitWorkaround = function() {***REMOVED***
