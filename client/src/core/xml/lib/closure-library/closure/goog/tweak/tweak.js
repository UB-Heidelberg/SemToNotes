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
***REMOVED*** @fileoverview Provides facilities for creating and querying tweaks.
***REMOVED*** @see http://code.google.com/p/closure-library/wiki/UsingTweaks
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.tweak');
goog.provide('goog.tweak.ConfigParams');

goog.require('goog.asserts');
goog.require('goog.tweak.BooleanGroup');
goog.require('goog.tweak.BooleanInGroupSetting');
goog.require('goog.tweak.BooleanSetting');
goog.require('goog.tweak.ButtonAction');
goog.require('goog.tweak.NumericSetting');
goog.require('goog.tweak.Registry');
goog.require('goog.tweak.StringSetting');


***REMOVED***
***REMOVED*** Calls to this function are overridden by the compiler by the processTweaks
***REMOVED*** pass. It returns the overrides to default values for tweaks set by compiler
***REMOVED*** options.
***REMOVED*** @return {!Object.<number|string|boolean>} A map of tweakId -> defaultValue.
***REMOVED*** @private
***REMOVED***
goog.tweak.getCompilerOverrides_ = function() {
  return {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** The global reference to the registry, if it exists.
***REMOVED*** @type {goog.tweak.Registry}
***REMOVED*** @private
***REMOVED***
goog.tweak.registry_ = null;


***REMOVED***
***REMOVED*** The boolean group set by beginBooleanGroup and cleared by endBooleanGroup.
***REMOVED*** @type {goog.tweak.BooleanGroup}
***REMOVED*** @private
***REMOVED***
goog.tweak.activeBooleanGroup_ = null;


***REMOVED***
***REMOVED*** Returns/creates the registry singleton.
***REMOVED*** @return {!goog.tweak.Registry} The tweak registry.
***REMOVED***
goog.tweak.getRegistry = function() {
  if (!goog.tweak.registry_) {
    var queryString = window.location.search;
    var overrides = goog.tweak.getCompilerOverrides_();
    goog.tweak.registry_ = new goog.tweak.Registry(queryString, overrides);
  }
  return goog.tweak.registry_;
***REMOVED***


***REMOVED***
***REMOVED*** Type for configParams.
***REMOVED*** TODO(agrieve): Remove |Object when optional fields in struct types are
***REMOVED***     implemented.
***REMOVED*** @typedef {{
***REMOVED***     label:(string|undefined),
***REMOVED***     validValues:(!Array.<string>|!Array.<number>|undefined),
***REMOVED***     paramName:(string|undefined),
***REMOVED***     restartRequired:(boolean|undefined),
***REMOVED***     callback:(Function|undefined),
***REMOVED***     token:(string|undefined)
***REMOVED***     }|!Object}
***REMOVED***
goog.tweak.ConfigParams;


***REMOVED***
***REMOVED*** Silences warning about properties on ConfigParams never being set when
***REMOVED*** running JsLibTest.
***REMOVED*** @return {goog.tweak.ConfigParams} Dummy return.
***REMOVED*** @private
***REMOVED***
goog.tweak.configParamsNeverCompilerWarningWorkAround_ = function() {
  return {
    label: '',
    validValues: [],
    paramName: '',
    restartRequired: true,
    callback: goog.nullFunction,
    token: ''
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Applies all extra configuration parameters in configParams.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry to apply them to.
***REMOVED*** @param {!goog.tweak.ConfigParams} configParams Extra configuration
***REMOVED***     parameters.
***REMOVED*** @private
***REMOVED***
goog.tweak.applyConfigParams_ = function(entry, configParams) {
  if (configParams.label) {
    entry.label = configParams.label;
    delete configParams.label;
  }
  if (configParams.validValues) {
    goog.asserts.assert(entry instanceof goog.tweak.StringSetting ||
        entry instanceof goog.tweak.NumericSetting,
        'Cannot set validValues on tweak: %s', entry.getId());
    entry.setValidValues(configParams.validValues);
    delete configParams.validValues;
  }
  if (goog.isDef(configParams.paramName)) {
    goog.asserts.assertInstanceof(entry, goog.tweak.BaseSetting,
        'Cannot set paramName on tweak: %s', entry.getId());
    entry.setParamName(configParams.paramName);
    delete configParams.paramName;
  }
  if (goog.isDef(configParams.restartRequired)) {
    entry.setRestartRequired(configParams.restartRequired);
    delete configParams.restartRequired;
  }
  if (configParams.callback) {
    entry.addCallback(configParams.callback);
    delete configParams.callback;
    goog.asserts.assert(
        !entry.isRestartRequired() || (configParams.restartRequired == false),
        'Tweak %s should set restartRequired: false, when adding a callback.',
        entry.getId());
  }
  if (configParams.token) {
    goog.asserts.assertInstanceof(entry, goog.tweak.BooleanInGroupSetting,
        'Cannot set token on tweak: %s', entry.getId());
    entry.setToken(configParams.token);
    delete configParams.token;
  }
  for (var key in configParams) {
    goog.asserts.fail('Unknown config options (' + key + '=' +
        configParams[key] + ') for tweak ' + entry.getId());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a tweak using the given factoryFunc.
***REMOVED*** @param {!goog.tweak.BaseEntry} entry The entry to register.
***REMOVED*** @param {boolean|string|number=} opt_defaultValue Default value.
***REMOVED*** @param {goog.tweak.ConfigParams=} opt_configParams Extra
***REMOVED***     configuration parameters.
***REMOVED*** @private
***REMOVED***
goog.tweak.doRegister_ = function(entry, opt_defaultValue, opt_configParams) {
  if (opt_configParams) {
    goog.tweak.applyConfigParams_(entry, opt_configParams);
  }
  if (opt_defaultValue != undefined) {
    entry.setDefaultValue(opt_defaultValue);
  }
  if (goog.tweak.activeBooleanGroup_) {
    goog.asserts.assertInstanceof(entry, goog.tweak.BooleanInGroupSetting,
        'Forgot to end Boolean Group: %s',
        goog.tweak.activeBooleanGroup_.getId());
    goog.tweak.activeBooleanGroup_.addChild(
       ***REMOVED*****REMOVED*** @type {!goog.tweak.BooleanInGroupSetting}***REMOVED*** (entry));
  }
  goog.tweak.getRegistry().register(entry);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and registers a group of BooleanSettings that are all set by a
***REMOVED*** single query parameter. A call to goog.tweak.endBooleanGroup() must be used
***REMOVED*** to close this group. Only goog.tweak.registerBoolean() calls are allowed with
***REMOVED*** the beginBooleanGroup()/endBooleanGroup().
***REMOVED*** @param {string} id The unique ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {goog.tweak.ConfigParams=} opt_configParams Extra configuration
***REMOVED***     parameters.
***REMOVED***
goog.tweak.beginBooleanGroup = function(id, description, opt_configParams) {
  var entry = new goog.tweak.BooleanGroup(id, description);
  goog.tweak.doRegister_(entry, undefined, opt_configParams);
  goog.tweak.activeBooleanGroup_ = entry;
***REMOVED***


***REMOVED***
***REMOVED*** Stops adding boolean entries to the active boolean group.
***REMOVED***
goog.tweak.endBooleanGroup = function() {
  goog.tweak.activeBooleanGroup_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates and registers a BooleanSetting.
***REMOVED*** @param {string} id The unique ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {boolean=} opt_defaultValue The default value for the setting.
***REMOVED*** @param {goog.tweak.ConfigParams=} opt_configParams Extra configuration
***REMOVED***     parameters.
***REMOVED***
goog.tweak.registerBoolean =
    function(id, description, opt_defaultValue, opt_configParams) {
  // TODO(agrieve): There is a bug in the compiler that causes these calls not
  //     to be stripped without this outer if. Might be Issue #90.
  if (goog.tweak.activeBooleanGroup_) {
    var entry = new goog.tweak.BooleanInGroupSetting(id, description,
        goog.tweak.activeBooleanGroup_);
  } else {
    entry = new goog.tweak.BooleanSetting(id, description);
  }
  goog.tweak.doRegister_(entry, opt_defaultValue, opt_configParams);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and registers a StringSetting.
***REMOVED*** @param {string} id The unique ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {string=} opt_defaultValue The default value for the setting.
***REMOVED*** @param {goog.tweak.ConfigParams=} opt_configParams Extra configuration
***REMOVED***     parameters.
***REMOVED***
goog.tweak.registerString =
    function(id, description, opt_defaultValue, opt_configParams) {
  goog.tweak.doRegister_(new goog.tweak.StringSetting(id, description),
                         opt_defaultValue, opt_configParams);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and registers a NumericSetting.
***REMOVED*** @param {string} id The unique ID for the setting.
***REMOVED*** @param {string} description A description of what the setting does.
***REMOVED*** @param {number=} opt_defaultValue The default value for the setting.
***REMOVED*** @param {goog.tweak.ConfigParams=} opt_configParams Extra configuration
***REMOVED***     parameters.
***REMOVED***
goog.tweak.registerNumber =
    function(id, description, opt_defaultValue, opt_configParams) {
  goog.tweak.doRegister_(new goog.tweak.NumericSetting(id, description),
                         opt_defaultValue, opt_configParams);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and registers a ButtonAction.
***REMOVED*** @param {string} id The unique ID for the setting.
***REMOVED*** @param {string} description A description of what the action does.
***REMOVED*** @param {!Function} callback Function to call when the button is clicked.
***REMOVED*** @param {string=} opt_label The button text (instead of the ID).
***REMOVED***
goog.tweak.registerButton = function(id, description, callback, opt_label) {
  var tweak = new goog.tweak.ButtonAction(id, description, callback);
  tweak.label = opt_label || tweak.label;
  goog.tweak.doRegister_(tweak);
***REMOVED***


***REMOVED***
***REMOVED*** Sets a default value to use for the given tweak instead of the one passed
***REMOVED*** to the register* function. This function must be called before the tweak is
***REMOVED*** registered.
***REMOVED*** @param {string} id The unique string that identifies the entry.
***REMOVED*** @param {string|number|boolean} value The new default value for the tweak.
***REMOVED***
goog.tweak.overrideDefaultValue = function(id, value) {
  goog.tweak.getRegistry().overrideDefaultValue(id, value);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the boolean setting with the given ID.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {boolean} The value of the tweak.
***REMOVED***
goog.tweak.getBoolean = function(id) {
  return goog.tweak.getRegistry().getBooleanSetting(id).getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the string setting with the given ID,
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {string} The value of the tweak.
***REMOVED***
goog.tweak.getString = function(id) {
  return goog.tweak.getRegistry().getStringSetting(id).getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the numeric setting with the given ID.
***REMOVED*** @param {string} id The unique string that identifies this entry.
***REMOVED*** @return {number} The value of the tweak.
***REMOVED***
goog.tweak.getNumber = function(id) {
  return goog.tweak.getRegistry().getNumericSetting(id).getValue();
***REMOVED***

