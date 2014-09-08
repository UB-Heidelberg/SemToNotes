// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for manipulating a form and elements.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author jonp@google.com (Jon Perlow)
***REMOVED*** @author elsigh@google.com (Lindsey Simon)
***REMOVED***

goog.provide('goog.dom.forms');

goog.require('goog.structs.Map');


***REMOVED***
***REMOVED*** Returns form data as a map of name to value arrays. This doesn't
***REMOVED*** support file inputs.
***REMOVED*** @param {HTMLFormElement} form The form.
***REMOVED*** @return {!goog.structs.Map} A map of the form data as form name to arrays of
***REMOVED***     values.
***REMOVED***
goog.dom.forms.getFormDataMap = function(form) {
  var map = new goog.structs.Map();
  goog.dom.forms.getFormDataHelper_(form, map,
      goog.dom.forms.addFormDataToMap_);
  return map;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the form data as an application/x-www-url-encoded string. This
***REMOVED*** doesn't support file inputs.
***REMOVED*** @param {HTMLFormElement} form The form.
***REMOVED*** @return {string} An application/x-www-url-encoded string.
***REMOVED***
goog.dom.forms.getFormDataString = function(form) {
  var sb = [];
  goog.dom.forms.getFormDataHelper_(form, sb,
      goog.dom.forms.addFormDataToStringBuffer_);
  return sb.join('&');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the form data as a map or an application/x-www-url-encoded
***REMOVED*** string. This doesn't support file inputs.
***REMOVED*** @param {HTMLFormElement} form The form.
***REMOVED*** @param {Object} result The object form data is being put in.
***REMOVED*** @param {Function} fnAppend Function that takes {@code result}, an element
***REMOVED***     name, and an element value, and adds the name/value pair to the result
***REMOVED***     object.
***REMOVED*** @private
***REMOVED***
goog.dom.forms.getFormDataHelper_ = function(form, result, fnAppend) {
  var els = form.elements;
  for (var el, i = 0; el = els[i]; i++) {
    if (// Make sure we don't include elements that are not part of the form.
        // Some browsers include non-form elements. Check for 'form' property.
        // See http://code.google.com/p/closure-library/issues/detail?id=227
        // and
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#the-input-element
        (el.form != form) ||
        el.disabled ||
        // HTMLFieldSetElement has a form property but no value.
        el.tagName.toLowerCase() == 'fieldset') {
      continue;
    }

    var name = el.name;
    switch (el.type.toLowerCase()) {
      case 'file':
        // file inputs are not supported
      case 'submit':
      case 'reset':
      case 'button':
        // don't submit these
        break;
      case 'select-multiple':
        var values = goog.dom.forms.getValue(el);
        if (values != null) {
          for (var value, j = 0; value = values[j]; j++) {
            fnAppend(result, name, value);
          }
        }
        break;
      default:
        var value = goog.dom.forms.getValue(el);
        if (value != null) {
          fnAppend(result, name, value);
        }
    }
  }

  // input[type=image] are not included in the elements collection
  var inputs = form.getElementsByTagName('input');
  for (var input, i = 0; input = inputs[i]; i++) {
    if (input.form == form && input.type.toLowerCase() == 'image') {
      name = input.name;
      fnAppend(result, name, input.value);
      fnAppend(result, name + '.x', '0');
      fnAppend(result, name + '.y', '0');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds the name/value pair to the map.
***REMOVED*** @param {goog.structs.Map} map The map to add to.
***REMOVED*** @param {string} name The name.
***REMOVED*** @param {string} value The value.
***REMOVED*** @private
***REMOVED***
goog.dom.forms.addFormDataToMap_ = function(map, name, value) {
  var array = map.get(name);
  if (!array) {
    array = [];
    map.set(name, array);
  }
  array.push(value);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a name/value pair to an string buffer array in the form 'name=value'.
***REMOVED*** @param {Array} sb The string buffer array for storing data.
***REMOVED*** @param {string} name The name.
***REMOVED*** @param {string} value The value.
***REMOVED*** @private
***REMOVED***
goog.dom.forms.addFormDataToStringBuffer_ = function(sb, name, value) {
  sb.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
***REMOVED***


***REMOVED***
***REMOVED*** Whether the form has a file input.
***REMOVED*** @param {HTMLFormElement} form The form.
***REMOVED*** @return {boolean} Whether the form has a file input.
***REMOVED***
goog.dom.forms.hasFileInput = function(form) {
  var els = form.elements;
  for (var el, i = 0; el = els[i]; i++) {
    if (!el.disabled && el.type && el.type.toLowerCase() == 'file') {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables either all elements in a form or a single form element.
***REMOVED*** @param {Element} el The element, either a form or an element within a form.
***REMOVED*** @param {boolean} disabled Whether the element should be disabled.
***REMOVED***
goog.dom.forms.setDisabled = function(el, disabled) {
  // disable all elements in a form
  if (el.tagName == 'FORM') {
    var els = el.elements;
    for (var i = 0; el = els[i]; i++) {
      goog.dom.forms.setDisabled(el, disabled);
    }
  } else {
    // makes sure to blur buttons, multi-selects, and any elements which
    // maintain keyboard/accessibility focus when disabled
    if (disabled == true) {
      el.blur();
    }
    el.disabled = disabled;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Focuses, and optionally selects the content of, a form element.
***REMOVED*** @param {Element} el The form element.
***REMOVED***
goog.dom.forms.focusAndSelect = function(el) {
  el.focus();
  if (el.select) {
    el.select();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether a form element has a value.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @return {boolean} Whether the form has a value.
***REMOVED***
goog.dom.forms.hasValue = function(el) {
  var value = goog.dom.forms.getValue(el);
  return !!value;
***REMOVED***


***REMOVED***
***REMOVED*** Whether a named form field has a value.
***REMOVED*** @param {HTMLFormElement} form The form element.
***REMOVED*** @param {string} name Name of an input to the form.
***REMOVED*** @return {boolean} Whether the form has a value.
***REMOVED***
goog.dom.forms.hasValueByName = function(form, name) {
  var value = goog.dom.forms.getValueByName(form, name);
  return !!value;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current value of any element with a type.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @return {string|Array.<string>|null} The current value of the element
***REMOVED***     (or null).
***REMOVED***
goog.dom.forms.getValue = function(el) {
  var type = el.type;
  if (!goog.isDef(type)) {
    return null;
  }
  switch (type.toLowerCase()) {
    case 'checkbox':
    case 'radio':
      return goog.dom.forms.getInputChecked_(el);
    case 'select-one':
      return goog.dom.forms.getSelectSingle_(el);
    case 'select-multiple':
      return goog.dom.forms.getSelectMultiple_(el);
    default:
      return goog.isDef(el.value) ? el.value : null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alias for goog.dom.form.element.getValue
***REMOVED*** @type {Function}
***REMOVED*** @deprecated Use {@link goog.dom.forms.getValue} instead.
***REMOVED***
goog.dom.$F = goog.dom.forms.getValue;


***REMOVED***
***REMOVED*** Returns the value of the named form field. In the case of radio buttons,
***REMOVED*** returns the value of the checked button with the given name.
***REMOVED***
***REMOVED*** @param {HTMLFormElement} form The form element.
***REMOVED*** @param {string} name Name of an input to the form.
***REMOVED***
***REMOVED*** @return {Array.<string>|string|null} The value of the form element, or
***REMOVED***     null if the form element does not exist or has no value.
***REMOVED***
goog.dom.forms.getValueByName = function(form, name) {
  var els = form.elements[name];

  if (els) {
    if (els.type) {
      return goog.dom.forms.getValue(els);
    } else {
      for (var i = 0; i < els.length; i++) {
        var val = goog.dom.forms.getValue(els[i]);
        if (val) {
          return val;
        }
      }
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current value of a checkable input element.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @return {?string} The value of the form element (or null).
***REMOVED*** @private
***REMOVED***
goog.dom.forms.getInputChecked_ = function(el) {
  return el.checked ? el.value : null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current value of a select-one element.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @return {?string} The value of the form element (or null).
***REMOVED*** @private
***REMOVED***
goog.dom.forms.getSelectSingle_ = function(el) {
  var selectedIndex = el.selectedIndex;
  return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current value of a select-multiple element.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @return {Array.<string>?} The value of the form element (or null).
***REMOVED*** @private
***REMOVED***
goog.dom.forms.getSelectMultiple_ = function(el) {
  var values = [];
  for (var option, i = 0; option = el.options[i]; i++) {
    if (option.selected) {
      values.push(option.value);
    }
  }
  return values.length ? values : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current value of any element with a type.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @param {*=} opt_value The value to give to the element, which will be coerced
***REMOVED***     by the browser in the default case using toString. This value should be
***REMOVED***     an array for setting the value of select multiple elements.
***REMOVED***
goog.dom.forms.setValue = function(el, opt_value) {
  var type = el.type;
  if (goog.isDef(type)) {
    switch (type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        goog.dom.forms.setInputChecked_(el,
           ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (opt_value));
        break;
      case 'select-one':
        goog.dom.forms.setSelectSingle_(el,
           ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (opt_value));
        break;
      case 'select-multiple':
        goog.dom.forms.setSelectMultiple_(el,
           ***REMOVED*****REMOVED*** @type {Array}***REMOVED*** (opt_value));
        break;
      default:
        el.value = goog.isDefAndNotNull(opt_value) ? opt_value : '';
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a checkable input element's checked property.
***REMOVED*** #TODO(user): This seems potentially unintuitive since it doesn't set
***REMOVED*** the value property but my hunch is that the primary use case is to check a
***REMOVED*** checkbox, not to reset its value property.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @param {string|boolean=} opt_value The value, sets the element checked if
***REMOVED***     val is set.
***REMOVED*** @private
***REMOVED***
goog.dom.forms.setInputChecked_ = function(el, opt_value) {
  el.checked = opt_value ? 'checked' : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of a select-one element.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @param {string=} opt_value The value of the selected option element.
***REMOVED*** @private
***REMOVED***
goog.dom.forms.setSelectSingle_ = function(el, opt_value) {
  // unset any prior selections
  el.selectedIndex = -1;
  if (goog.isString(opt_value)) {
    for (var option, i = 0; option = el.options[i]; i++) {
      if (option.value == opt_value) {
        option.selected = true;
        break;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of a select-multiple element.
***REMOVED*** @param {Element} el The element.
***REMOVED*** @param {Array.<string>|string=} opt_value The value of the selected option
***REMOVED***     element(s).
***REMOVED*** @private
***REMOVED***
goog.dom.forms.setSelectMultiple_ = function(el, opt_value) {
  // reset string opt_values as an array
  if (goog.isString(opt_value)) {
    opt_value = [opt_value];
  }
  for (var option, i = 0; option = el.options[i]; i++) {
    // we have to reset the other options to false for select-multiple
    option.selected = false;
    if (opt_value) {
      for (var value, j = 0; value = opt_value[j]; j++) {
        if (option.value == value) {
          option.selected = true;
        }
      }
    }
  }
***REMOVED***
