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
***REMOVED*** @fileoverview Definitions for all tweak entries.
***REMOVED*** The class hierarchy is as follows (abstract entries are denoted with a***REMOVED***):
***REMOVED*** BaseEntry(id, description)***REMOVED***
***REMOVED***   -> ButtonAction(buttons in the UI)
***REMOVED***   -> BaseSetting(query parameter)***REMOVED***
***REMOVED***     -> BooleanGroup(child booleans)
***REMOVED***     -> BasePrimitiveSetting(value, defaultValue)***REMOVED***
***REMOVED***       -> BooleanSetting
***REMOVED***       -> StringSetting
***REMOVED***       -> NumericSetting
***REMOVED***       -> BooleanInGroupSetting(token)
***REMOVED*** Most clients should not use these classes directly, but instead use the API
***REMOVED*** defined in tweak.js. One possible use case for directly using them is to
***REMOVED*** register tweaks that are not known at compile time.
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.tweak.BaseEntry');
goog.provide('goog.tweak.BasePrimitiveSetting');
goog.provide('goog.tweak.BaseSetting');
goog.provide('goog.tweak.BooleanGroup');
goog.provide('goog.tweak.BooleanInGroupSetting');
goog.provide('goog.tweak.BooleanSetting');
goog.provide('goog.tweak.ButtonAction');
goog.provide('goog.tweak.NumericSetting');
goog.provide('goog.tweak.StringSetting');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.object');



***REMOVED***
***REMOVED*** Base class for all Registry entries.
***REMOVED*** @param {string} id The ID for the entry. Must contain only letters,
***REMOVED***     numbers, underscores and periods.
***REMOVED*** @param {string} description A description of what the entry does.
***REMOVED***
***REMOVED***
goog.tweak.BaseEntry = function(id, description) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** An ID to uniquely identify the entry.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.id_ = id;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A descriptive label for the entry.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.label = id;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A description of what this entry does.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.description = description;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Functions to be called whenever a setting is changed or a button is
  ***REMOVED*** clicked.
  ***REMOVED*** @type {!Array.<!Function>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callbacks_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED***
goog.tweak.BaseEntry.prototype.logger =
    goog.log.getLogger('goog.tweak.BaseEntry');


***REMOVED***
***REMOVED*** Whether a restart is required for changes to the setting to take effect.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.tweak.BaseEntry.prototype.restartRequired_ = true;


***REMOVED***
***REMOVED*** @return {string} Returns the entry's ID.
***REMOVED***
goog.tweak.BaseEntry.prototype.getId = function() {
  return this.id_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether a restart is required for changes to the setting to take
***REMOVED*** effect.
***REMOVED*** @return {boolean} The value.
***REMOVED***
goog.tweak.BaseEntry.prototype.isRestartRequired = function() {
  return this.restartRequired_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a restart is required for changes to the setting to take
***REMOVED*** effect.
***REMOVED*** @param {boolean} value The new value.
***REMOVED***
goog.tweak.BaseEntry.prototype.setRestartRequired = function(value) {
  this.restartRequired_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a callback that should be called when the setting has changed (or when
***REMOVED*** an action has been clicked).
***REMOVED*** @param {!Function} callback The callback to add.
***REMOVED***
goog.tweak.BaseEntry.prototype.addCallback = function(callback) {
  this.callbacks_.push(callback);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a callback that was added by addCallback.
***REMOVED*** @param {!Function} callback The callback to add.
***REMOVED***
goog.tweak.BaseEntry.prototype.removeCallback = function(callback) {
  goog.array.remove(this.callbacks_, callback);
***REMOVED***


***REMOVED***
***REMOVED*** Calls all registered callbacks.
***REMOVED***
goog.tweak.BaseEntry.prototype.fireCallbacks = function() {
  for (var i = 0, callback; callback = this.callbacks_[i]; ++i) {
    callback(this);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Base class for all tweak entries that are settings. Settings are entries
***REMOVED*** that are associated with a query parameter.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BaseEntry}
***REMOVED***
goog.tweak.BaseSetting = function(id, description) {
  goog.tweak.BaseEntry.call(this, id, description);
  // Apply this restriction for settings since they turn in to query
  // parameters. For buttons, it's not really important.
  goog.asserts.assert(!/[^A-Za-z0-9._]/.test(id),
      'Tweak id contains illegal characters: ', id);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The value of this setting's query parameter.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.initialQueryParamValue;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The query parameter that controls this setting.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.paramName_ = this.getId().toLowerCase();
***REMOVED***
goog.inherits(goog.tweak.BaseSetting, goog.tweak.BaseEntry);


***REMOVED***
***REMOVED*** States of initialization. Entries are initialized lazily in order to allow
***REMOVED*** their initialization to happen in multiple statements.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.tweak.BaseSetting.InitializeState_ = {
  // The start state for all settings.
  NOT_INITIALIZED: 0,
  // This is used to allow concrete classes to call assertNotInitialized()
  // during their initialize() function.
  INITIALIZING: 1,
  // One a setting is initialized, it may no longer change its configuration
  // settings (associated query parameter, token, etc).
  INITIALIZED: 2
***REMOVED***


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.BaseSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.BaseSetting');


***REMOVED***
***REMOVED*** Whether initialize() has been called (or is in the middle of being called).
***REMOVED*** @type {goog.tweak.BaseSetting.InitializeState_}
***REMOVED*** @private
***REMOVED***
goog.tweak.BaseSetting.prototype.initializeState_ =
    goog.tweak.BaseSetting.InitializeState_.NOT_INITIALIZED;


***REMOVED***
***REMOVED*** Sets the value of the entry based on the value of the query parameter. Once
***REMOVED*** this is called, configuration settings (associated query parameter, token,
***REMOVED*** etc) may not be changed.
***REMOVED*** @param {?string} value The part of the query param for this setting after
***REMOVED***     the '='. Null if it is not present.
***REMOVED*** @protected
***REMOVED***
goog.tweak.BaseSetting.prototype.initialize = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the value to be used in the query parameter for this tweak.
***REMOVED*** @return {?string} The encoded value. Null if the value is set to its
***REMOVED***     default.
***REMOVED***
goog.tweak.BaseSetting.prototype.getNewValueEncoded = goog.abstractMethod;


***REMOVED***
***REMOVED*** Asserts that this tweak has not been initialized yet.
***REMOVED*** @param {string} funcName Function name to use in the assertion message.
***REMOVED*** @protected
***REMOVED***
goog.tweak.BaseSetting.prototype.assertNotInitialized = function(funcName) {
  goog.asserts.assert(this.initializeState_ !=
      goog.tweak.BaseSetting.InitializeState_.INITIALIZED,
      'Cannot call ' + funcName + ' after the tweak as been initialized.');
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the setting is currently being initialized.
***REMOVED*** @return {boolean} Whether the setting is currently being initialized.
***REMOVED*** @protected
***REMOVED***
goog.tweak.BaseSetting.prototype.isInitializing = function() {
  return this.initializeState_ ==
      goog.tweak.BaseSetting.InitializeState_.INITIALIZING;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the initial query parameter value for this setting. May not be called
***REMOVED*** after the setting has been initialized.
***REMOVED*** @param {string} value The inital query parameter value for this setting.
***REMOVED***
goog.tweak.BaseSetting.prototype.setInitialQueryParamValue = function(value) {
  this.assertNotInitialized('setInitialQueryParamValue');
  this.initialQueryParamValue = value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of the query parameter used for this setting.
***REMOVED*** @return {?string} The param name. Null if no query parameter is directly
***REMOVED***     associated with the setting.
***REMOVED***
goog.tweak.BaseSetting.prototype.getParamName = function() {
  return this.paramName_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the name of the query parameter used for this setting. If null is
***REMOVED*** passed the the setting will not appear in the top-level query string.
***REMOVED*** @param {?string} value The new value.
***REMOVED***
goog.tweak.BaseSetting.prototype.setParamName = function(value) {
  this.assertNotInitialized('setParamName');
  this.paramName_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Applies the default value or query param value if this is the first time
***REMOVED*** that the function has been called.
***REMOVED*** @protected
***REMOVED***
goog.tweak.BaseSetting.prototype.ensureInitialized = function() {
  if (this.initializeState_ ==
      goog.tweak.BaseSetting.InitializeState_.NOT_INITIALIZED) {
    // Instead of having only initialized / not initialized, there is a
    // separate in-between state so that functions that call
    // assertNotInitialized() will not fail when called inside of the
    // initialize().
    this.initializeState_ =
        goog.tweak.BaseSetting.InitializeState_.INITIALIZING;
    var value = this.initialQueryParamValue == undefined ? null :
        this.initialQueryParamValue;
    this.initialize(value);
    this.initializeState_ =
        goog.tweak.BaseSetting.InitializeState_.INITIALIZED;
  }
***REMOVED***



***REMOVED***
***REMOVED*** Base class for all settings that wrap primitive values.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {*} defaultValue The default value for this setting.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BaseSetting}
***REMOVED***
goog.tweak.BasePrimitiveSetting = function(id, description, defaultValue) {
  goog.tweak.BaseSetting.call(this, id, description);
 ***REMOVED*****REMOVED***
  ***REMOVED*** The default value of the setting.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultValue_ = defaultValue;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The value of the tweak.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The value of the tweak once "Apply Tweaks" is pressed.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.newValue_;
***REMOVED***
goog.inherits(goog.tweak.BasePrimitiveSetting, goog.tweak.BaseSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.BasePrimitiveSetting');


***REMOVED***
***REMOVED*** Returns the query param encoded representation of the setting's value.
***REMOVED*** @return {string} The encoded value.
***REMOVED*** @protected
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.encodeNewValue =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** If the setting has the restartRequired option, then returns its inital
***REMOVED*** value. Otherwise, returns its current value.
***REMOVED*** @return {*} The value.
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.getValue = function() {
  this.ensureInitialized();
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the setting to use once "Apply Tweaks" is clicked.
***REMOVED*** @return {*} The value.
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.getNewValue = function() {
  this.ensureInitialized();
  return this.newValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the setting. If the setting has the restartRequired
***REMOVED*** option, then the value will not be changed until the "Apply Tweaks" button
***REMOVED*** is clicked. If it does not have the option, the value will be update
***REMOVED*** immediately and all registered callbacks will be called.
***REMOVED*** @param {*} value The value.
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.setValue = function(value) {
  this.ensureInitialized();
  var changed = this.newValue_ != value;
  this.newValue_ = value;
  // Don't fire callbacks if we are currently in the initialize() method.
  if (this.isInitializing()) {
    this.value_ = value;
  } else {
    if (!this.isRestartRequired()) {
      // Update the current value only if the tweak has been marked as not
      // needing a restart.
      this.value_ = value;
    }
    if (changed) {
      this.fireCallbacks();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default value for this setting.
***REMOVED*** @return {*} The default value.
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.getDefaultValue = function() {
  return this.defaultValue_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default value for the tweak.
***REMOVED*** @param {*} value The new value.
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.setDefaultValue =
    function(value) {
  this.assertNotInitialized('setDefaultValue');
  this.defaultValue_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BasePrimitiveSetting.prototype.getNewValueEncoded = function() {
  this.ensureInitialized();
  return this.newValue_ == this.defaultValue_ ? null : this.encodeNewValue();
***REMOVED***



***REMOVED***
***REMOVED*** A registry setting for string values.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BasePrimitiveSetting}
***REMOVED*** @final
***REMOVED***
goog.tweak.StringSetting = function(id, description) {
  goog.tweak.BasePrimitiveSetting.call(this, id, description, '');
 ***REMOVED*****REMOVED***
  ***REMOVED*** Valid values for the setting.
  ***REMOVED*** @type {Array.<string>|undefined}
 ***REMOVED*****REMOVED***
  this.validValues_;
***REMOVED***
goog.inherits(goog.tweak.StringSetting, goog.tweak.BasePrimitiveSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.StringSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.StringSetting');


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {string} The tweaks's value.
***REMOVED***
goog.tweak.StringSetting.prototype.getValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {string} The tweaks's new value.
***REMOVED***
goog.tweak.StringSetting.prototype.getNewValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {string} value The tweaks's value.
***REMOVED***
goog.tweak.StringSetting.prototype.setValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {string} value The default value.
***REMOVED***
goog.tweak.StringSetting.prototype.setDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {string} The default value.
***REMOVED***
goog.tweak.StringSetting.prototype.getDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.StringSetting.prototype.encodeNewValue = function() {
  return this.getNewValue();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the valid values for the setting.
***REMOVED*** @param {Array.<string>|undefined} values Valid values.
***REMOVED***
goog.tweak.StringSetting.prototype.setValidValues = function(values) {
  this.assertNotInitialized('setValidValues');
  this.validValues_ = values;
  // Set the default value to the first value in the list if the current
  // default value is not within it.
  if (values && !goog.array.contains(values, this.getDefaultValue())) {
    this.setDefaultValue(values[0]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the valid values for the setting.
***REMOVED*** @return {Array.<string>|undefined} Valid values.
***REMOVED***
goog.tweak.StringSetting.prototype.getValidValues = function() {
  return this.validValues_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.StringSetting.prototype.initialize = function(value) {
  if (value == null) {
    this.setValue(this.getDefaultValue());
  } else {
    var validValues = this.validValues_;
    if (validValues) {
      // Make the query parameter values case-insensitive since users might
      // type them by hand. Make the capitalization that is actual used come
      // from the list of valid values.
      value = value.toLowerCase();
      for (var i = 0, il = validValues.length; i < il; ++i) {
        if (value == validValues[i].toLowerCase()) {
          this.setValue(validValues[i]);
          return;
        }
      }
      // Warn if the value is not in the list of allowed values.
      goog.log.warning(this.logger, 'Tweak ' + this.getId() +
          ' has value outside of expected range:' + value);
    }
    this.setValue(value);
  }
***REMOVED***



***REMOVED***
***REMOVED*** A registry setting for numeric values.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BasePrimitiveSetting}
***REMOVED*** @final
***REMOVED***
goog.tweak.NumericSetting = function(id, description) {
  goog.tweak.BasePrimitiveSetting.call(this, id, description, 0);
 ***REMOVED*****REMOVED***
  ***REMOVED*** Valid values for the setting.
  ***REMOVED*** @type {Array.<number>|undefined}
 ***REMOVED*****REMOVED***
  this.validValues_;
***REMOVED***
goog.inherits(goog.tweak.NumericSetting, goog.tweak.BasePrimitiveSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.NumericSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.NumericSetting');


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {number} The tweaks's value.
***REMOVED***
goog.tweak.NumericSetting.prototype.getValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {number} The tweaks's new value.
***REMOVED***
goog.tweak.NumericSetting.prototype.getNewValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {number} value The tweaks's value.
***REMOVED***
goog.tweak.NumericSetting.prototype.setValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {number} value The default value.
***REMOVED***
goog.tweak.NumericSetting.prototype.setDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {number} The default value.
***REMOVED***
goog.tweak.NumericSetting.prototype.getDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.NumericSetting.prototype.encodeNewValue = function() {
  return '' + this.getNewValue();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the valid values for the setting.
***REMOVED*** @param {Array.<number>|undefined} values Valid values.
***REMOVED***
goog.tweak.NumericSetting.prototype.setValidValues =
    function(values) {
  this.assertNotInitialized('setValidValues');
  this.validValues_ = values;
  // Set the default value to the first value in the list if the current
  // default value is not within it.
  if (values && !goog.array.contains(values, this.getDefaultValue())) {
    this.setDefaultValue(values[0]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the valid values for the setting.
***REMOVED*** @return {Array.<number>|undefined} Valid values.
***REMOVED***
goog.tweak.NumericSetting.prototype.getValidValues = function() {
  return this.validValues_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.NumericSetting.prototype.initialize = function(value) {
  if (value == null) {
    this.setValue(this.getDefaultValue());
  } else {
    var coercedValue = +value;
    // Warn if the value is not in the list of allowed values.
    if (this.validValues_ &&
        !goog.array.contains(this.validValues_, coercedValue)) {
      goog.log.warning(this.logger, 'Tweak ' + this.getId() +
          ' has value outside of expected range: ' + value);
    }

    if (isNaN(coercedValue)) {
      goog.log.warning(this.logger, 'Tweak ' + this.getId() +
          ' has value of NaN, resetting to ' + this.getDefaultValue());
      this.setValue(this.getDefaultValue());
    } else {
      this.setValue(coercedValue);
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** A registry setting that can be either true of false.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BasePrimitiveSetting}
***REMOVED***
goog.tweak.BooleanSetting = function(id, description) {
  goog.tweak.BasePrimitiveSetting.call(this, id, description, false);
***REMOVED***
goog.inherits(goog.tweak.BooleanSetting, goog.tweak.BasePrimitiveSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.BooleanSetting');


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {boolean} The tweaks's value.
***REMOVED***
goog.tweak.BooleanSetting.prototype.getValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {boolean} The tweaks's new value.
***REMOVED***
goog.tweak.BooleanSetting.prototype.getNewValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {boolean} value The tweaks's value.
***REMOVED***
goog.tweak.BooleanSetting.prototype.setValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {boolean} value The default value.
***REMOVED***
goog.tweak.BooleanSetting.prototype.setDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {boolean} The default value.
***REMOVED***
goog.tweak.BooleanSetting.prototype.getDefaultValue;


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanSetting.prototype.encodeNewValue = function() {
  return this.getNewValue() ? '1' : '0';
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanSetting.prototype.initialize = function(value) {
  if (value == null) {
    this.setValue(this.getDefaultValue());
  } else {
    value = value.toLowerCase();
    this.setValue(value == 'true' || value == '1');
  }
***REMOVED***



***REMOVED***
***REMOVED*** An entry in a BooleanGroup.
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {!goog.tweak.BooleanGroup} group The group that this entry belongs
***REMOVED***     to.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BooleanSetting}
***REMOVED*** @final
***REMOVED***
goog.tweak.BooleanInGroupSetting = function(id, description, group) {
  goog.tweak.BooleanSetting.call(this, id, description);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The token to use in the query parameter.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.token_ = this.getId().toLowerCase();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The BooleanGroup that this setting belongs to.
  ***REMOVED*** @type {!goog.tweak.BooleanGroup}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.group_ = group;

  // Take setting out of top-level query parameter list.
  goog.tweak.BooleanInGroupSetting.superClass_.setParamName.call(this,
      null);
***REMOVED***
goog.inherits(goog.tweak.BooleanInGroupSetting, goog.tweak.BooleanSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanInGroupSetting.prototype.logger =
    goog.log.getLogger('goog.tweak.BooleanInGroupSetting');


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanInGroupSetting.prototype.setParamName = function(value) {
  goog.asserts.fail('Use setToken() for BooleanInGroupSetting.');
***REMOVED***


***REMOVED***
***REMOVED*** Sets the token to use in the query parameter.
***REMOVED*** @param {string} value The value.
***REMOVED***
goog.tweak.BooleanInGroupSetting.prototype.setToken = function(value) {
  this.token_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the token to use in the query parameter.
***REMOVED*** @return {string} The value.
***REMOVED***
goog.tweak.BooleanInGroupSetting.prototype.getToken = function() {
  return this.token_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the BooleanGroup that this setting belongs to.
***REMOVED*** @return {!goog.tweak.BooleanGroup} The BooleanGroup that this setting
***REMOVED***     belongs to.
***REMOVED***
goog.tweak.BooleanInGroupSetting.prototype.getGroup = function() {
  return this.group_;
***REMOVED***



***REMOVED***
***REMOVED*** A registry setting that contains a group of boolean subfield, where all
***REMOVED*** entries modify the same query parameter. For example:
***REMOVED***     ?foo=setting1,-setting2
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BaseSetting}
***REMOVED*** @final
***REMOVED***
goog.tweak.BooleanGroup = function(id, description) {
  goog.tweak.BaseSetting.call(this, id, description);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of token->child entry.
  ***REMOVED*** @type {!Object.<!goog.tweak.BooleanSetting>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entriesByToken_ = {***REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of token->true/false for all tokens that appeared in the query
  ***REMOVED*** parameter.
  ***REMOVED*** @type {!Object.<boolean>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.queryParamValues_ = {***REMOVED***

***REMOVED***
goog.inherits(goog.tweak.BooleanGroup, goog.tweak.BaseSetting);


***REMOVED***
***REMOVED*** The logger for this class.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanGroup.prototype.logger =
    goog.log.getLogger('goog.tweak.BooleanGroup');


***REMOVED***
***REMOVED*** Returns the map of token->boolean settings.
***REMOVED*** @return {!Object.<!goog.tweak.BooleanSetting>} The child settings.
***REMOVED***
goog.tweak.BooleanGroup.prototype.getChildEntries = function() {
  return this.entriesByToken_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the given BooleanSetting to the group.
***REMOVED*** @param {goog.tweak.BooleanInGroupSetting} boolEntry The entry.
***REMOVED***
goog.tweak.BooleanGroup.prototype.addChild = function(boolEntry) {
  this.ensureInitialized();

  var token = boolEntry.getToken();
  var lcToken = token.toLowerCase();
  goog.asserts.assert(!this.entriesByToken_[lcToken],
      'Multiple bools registered with token "%s" in group: %s', token,
      this.getId());
  this.entriesByToken_[lcToken] = boolEntry;

  // Initialize from query param.
  var value = this.queryParamValues_[lcToken];
  if (value != undefined) {
    boolEntry.initialQueryParamValue = value ? '1' : '0';
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanGroup.prototype.initialize = function(value) {
  var queryParamValues = {***REMOVED***

  if (value) {
    var tokens = value.split(/\s*,\s*/);
    for (var i = 0; i < tokens.length; ++i) {
      var token = tokens[i].toLowerCase();
      var negative = token.charAt(0) == '-';
      if (negative) {
        token = token.substr(1);
      }
      queryParamValues[token] = !negative;
    }
  }
  this.queryParamValues_ = queryParamValues;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.tweak.BooleanGroup.prototype.getNewValueEncoded = function() {
  this.ensureInitialized();
  var nonDefaultValues = [];
  // Sort the keys so that the generate value is stable.
  var keys = goog.object.getKeys(this.entriesByToken_);
  keys.sort();
  for (var i = 0, entry; entry = this.entriesByToken_[keys[i]]; ++i) {
    var encodedValue = entry.getNewValueEncoded();
    if (encodedValue != null) {
      nonDefaultValues.push((entry.getNewValue() ? '' : '-') +
          entry.getToken());
    }
  }
  return nonDefaultValues.length ? nonDefaultValues.join(',') : null;
***REMOVED***



***REMOVED***
***REMOVED*** A registry action (a button).
***REMOVED*** @param {string} id The ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {!Function} callback Function to call when the button is clicked.
***REMOVED***
***REMOVED*** @extends {goog.tweak.BaseEntry}
***REMOVED*** @final
***REMOVED***
goog.tweak.ButtonAction = function(id, description, callback) {
  goog.tweak.BaseEntry.call(this, id, description);
  this.addCallback(callback);
  this.setRestartRequired(false);
***REMOVED***
goog.inherits(goog.tweak.ButtonAction, goog.tweak.BaseEntry);

