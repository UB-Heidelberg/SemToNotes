// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Simple wrapper around a Gears ManagedResourceStore.
***REMOVED***
***REMOVED***

goog.provide('goog.gears.ManagedResourceStore');
goog.provide('goog.gears.ManagedResourceStore.EventType');
goog.provide('goog.gears.ManagedResourceStore.UpdateStatus');
goog.provide('goog.gears.ManagedResourceStoreEvent');

goog.require('goog.debug.Logger');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.gears');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Creates a ManagedResourceStore with the specified name and update.  This
***REMOVED*** follows the Closure event model so the COMPLETE event will fire both for
***REMOVED*** SUCCESS and for ERROR.  You can use {@code isSuccess} in UPDATE to see if the
***REMOVED*** capture was successful or you can just listen to the different events.
***REMOVED***
***REMOVED*** This supports PROGRESS events, which are fired any time {@code filesComplete}
***REMOVED*** or {@code filesTotal} changes.  If the Gears version is 0.3.6 or newer this
***REMOVED*** will reflect the numbers returned by the underlying Gears MRS but for older
***REMOVED*** Gears versions this will just be {@code 0} or {@code 1}.
***REMOVED***
***REMOVED*** NOTE: This relies on at least the 0.2 version of gears (for timer).
***REMOVED***
***REMOVED*** @param {string} name  The name of the managed store.
***REMOVED*** @param {?string} requiredCookie  A cookie that must be present for the
***REMOVED***     managed store to be active. Should have the form "foo=bar". Can be null
***REMOVED***     if not required.
***REMOVED*** @param {GearsLocalServer=} opt_localServer  Gears local server -- if not set,
***REMOVED***     create a new one internally.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.gears.ManagedResourceStore = function(name, requiredCookie,
    opt_localServer) {
  goog.base(this);

  this.localServer_ = opt_localServer ||
                      goog.gears.getFactory().create('beta.localserver', '1.0');

  this.name_ = goog.gears.makeSafeFileName(name);
  if (name != this.name_) {
    this.logger_.info(
        'managed resource store name ' + name + '->' + this.name_);
  }

  this.requiredCookie_ = requiredCookie ? String(requiredCookie) : null;

  // Whether Gears natively has "events" on the MRS.  If it does not we treat
  // the progress as 0 to 1
  this.supportsEvents_ = goog.string.compareVersions(
      goog.gears.getFactory().version, '0.3.6') >= 0;
***REMOVED***
goog.inherits(goog.gears.ManagedResourceStore, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The amount of time between status checks during an update
***REMOVED*** @type {number}
***REMOVED***
goog.gears.ManagedResourceStore.UPDATE_INTERVAL_MS = 500;


***REMOVED***
***REMOVED*** Enum for possible values of Gears ManagedResourceStore.updatedStatus
***REMOVED*** @enum
***REMOVED***
goog.gears.ManagedResourceStore.UpdateStatus = {
  OK: 0,
  CHECKING: 1,
  DOWNLOADING: 2,
  FAILURE: 3
***REMOVED***


***REMOVED***
***REMOVED*** Logger.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.gears.ManagedResourceStore');


***REMOVED***
***REMOVED*** The Gears local server object.
***REMOVED*** @type {GearsLocalServer}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.localServer_;


***REMOVED***
***REMOVED*** The name of the managed store.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.name_;


***REMOVED***
***REMOVED*** A cookie that must be present for the managed store to be active.
***REMOVED*** Should have the form "foo=bar". String cast is a safety measure since
***REMOVED*** Gears behaves very badly when it gets an unexpected data type.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.requiredCookie_;


***REMOVED***
***REMOVED*** The required cookie, if any, for the managed store.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.supportsEvents_;


***REMOVED***
***REMOVED*** The Gears ManagedResourceStore instance we are wrapping.
***REMOVED*** @type {GearsManagedResourceStore}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.gearsStore_;


***REMOVED***
***REMOVED*** The id of the check status timer.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.timerId_ = null;


***REMOVED***
***REMOVED*** The check status timer.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.timer_ = null;


***REMOVED***
***REMOVED*** Whether we already have an active update check.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.active_ = false;


***REMOVED***
***REMOVED*** Number of files completed.  This is 0 or 1 if the Gears version does not
***REMOVED*** support progress events.  If the Gears version supports progress events
***REMOVED*** this will reflect the number of files that have been completed.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.filesComplete_ = 0;


***REMOVED***
***REMOVED*** Number of total files to load.  This is 1 if the Gears version does not
***REMOVED*** support progress events.  If the Gears version supports progress events
***REMOVED*** this will reflect the number of files that needs to be loaded.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.filesTotal_ = 0;


***REMOVED***
***REMOVED*** @return {boolean} Whether there is an active request.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.isActive = function() {
  return this.active_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the update has completed.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.isComplete = function() {
  return this.filesComplete_ == this.filesTotal_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the update completed with a success.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.isSuccess = function() {
  return this.getStatus() == goog.gears.ManagedResourceStore.UpdateStatus.OK;
***REMOVED***


***REMOVED***
***REMOVED*** Number of total files to load.  This is always 1 if the Gears version does
***REMOVED*** not support progress events.  If the Gears version supports progress events
***REMOVED*** this will reflect the number of files that needs to be loaded.
***REMOVED*** @return {number} The number of files to load.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getFilesTotal = function() {
  return this.filesTotal_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the last error message.
***REMOVED*** @return {string} Last error message.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getLastError = function() {
  return this.gearsStore_ ? this.gearsStore_.lastErrorMessage : '';
***REMOVED***


***REMOVED***
***REMOVED*** Number of files completed.  This is 0 or 1 if the Gears version does not
***REMOVED*** support progress events.  If the Gears version supports progress events
***REMOVED*** this will reflect the number of files that have been completed.
***REMOVED*** @return {number} The number of completed files.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getFilesComplete = function() {
  return this.filesComplete_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the filesComplete and the filesTotal and dispathces an event when
***REMOVED*** either changes.
***REMOVED*** @param {number} complete The count of the downloaded files.
***REMOVED*** @param {number} total The total number of files.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.setFilesCounts_ = function(complete,
                                                                     total) {
  if (this.filesComplete_ != complete || this.filesTotal_ != total) {
    this.filesComplete_ = complete;
    this.filesTotal_ = total;
    this.dispatchEvent(goog.gears.ManagedResourceStore.EventType.PROGRESS);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determine if the ManagedResourceStore has been created in Gears yet
***REMOVED*** @return {boolean}  true if it has been created.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.exists = function() {
  if (!this.gearsStore_) {
    this.gearsStore_ = this.localServer_.openManagedStore(
        this.name_, this.requiredCookie_);
  }

  return !!this.gearsStore_;
***REMOVED***


***REMOVED***
***REMOVED*** Throws an error if the store has not yet been created via create().
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.assertExists_ = function() {
  if (!this.exists()) {
    throw Error('Store not yet created');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Throws an error if the store has already been created via create().
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.assertNotExists_ = function() {
  if (this.exists()) {
    throw Error('Store already created');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Create the ManagedResourceStore in gears
***REMOVED*** @param {string=} opt_manifestUrl  The url of the manifest to associate.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.create = function(opt_manifestUrl) {
  if (!this.exists()) {
    this.gearsStore_ = this.localServer_.createManagedStore(
        this.name_, this.requiredCookie_);
    this.assertExists_();
  }

  if (opt_manifestUrl) {
    // String cast is a safety measure since Gears behaves very badly if it
    // gets an unexpected data type (e.g., goog.Uri).
    this.gearsStore_.manifestUrl = String(opt_manifestUrl);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Starts an asynchronous process to update the ManagedResourcStore
***REMOVED***
goog.gears.ManagedResourceStore.prototype.update = function() {
  if (this.active_) {
    // Update already in progress.
    return;
  }

  this.assertExists_();


  if (this.supportsEvents_) {
    this.gearsStore_.onprogress = goog.bind(this.handleProgress_, this);
    this.gearsStore_.oncomplete = goog.bind(this.handleComplete_, this);
    this.gearsStore_.onerror = goog.bind(this.handleError_, this);
  } else {
    this.timer_ = goog.gears.getFactory().create('beta.timer', '1.0');
    this.timerId_ = this.timer_.setInterval(
        goog.bind(this.checkUpdateStatus_, this),
        goog.gears.ManagedResourceStore.UPDATE_INTERVAL_MS);
    this.setFilesCounts_(0, 1);
  }

  this.gearsStore_.checkForUpdate();

  this.active_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} Store's current manifest URL.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getManifestUrl = function() {
  this.assertExists_();
  return this.gearsStore_.manifestUrl;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} url  Store's new manifest URL.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.setManifestUrl = function(url) {
  this.assertExists_();

  // Safety measure since Gears behaves very badly if it gets an unexpected
  // data type (e.g., goog.Uri).
  this.gearsStore_.manifestUrl = String(url);
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The version of the managed store that is currently being
***REMOVED***     served.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getVersion = function() {
  return this.exists() ? this.gearsStore_.currentVersion : null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.gears.ManagedResourceStore.UpdateStatus} The current update
***REMOVED***     status.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.getStatus = function() {
  this.assertExists_();
  return***REMOVED*****REMOVED*** @type {goog.gears.ManagedResourceStore.UpdateStatus}***REMOVED*** (
      this.gearsStore_.updateStatus);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the store is currently enabled to serve local
***REMOVED***     content.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.isEnabled = function() {
  this.assertExists_();
  return this.gearsStore_.enabled;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the store is currently enabled to serve local content.
***REMOVED*** @param {boolean} isEnabled True if the store is enabled and false otherwise.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.setEnabled = function(isEnabled) {
  this.assertExists_();
  // !! is a safety measure since Gears behaves very badly if it gets an
  //  unexpected data type.
  this.gearsStore_.enabled = !!isEnabled;
***REMOVED***


***REMOVED***
***REMOVED*** Remove managed store.
***REMOVED***
goog.gears.ManagedResourceStore.prototype.remove = function() {
  this.assertExists_();
  this.localServer_.removeManagedStore(this.name_, this.requiredCookie_);
  this.gearsStore_ = null;
  this.assertNotExists_();
***REMOVED***


***REMOVED***
***REMOVED*** Called periodically as the update proceeds. If it has completed, fire an
***REMOVED*** approproiate event and cancel further checks.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.checkUpdateStatus_ = function() {
  var e;

  if (this.gearsStore_.updateStatus ==
      goog.gears.ManagedResourceStore.UpdateStatus.FAILURE) {
    e = new goog.gears.ManagedResourceStoreEvent(
        goog.gears.ManagedResourceStore.EventType.ERROR,
        this.gearsStore_.lastErrorMessage);
    this.setFilesCounts_(0, 1);
  } else if (this.gearsStore_.updateStatus ==
             goog.gears.ManagedResourceStore.UpdateStatus.OK) {
    e = new goog.gears.ManagedResourceStoreEvent(
        goog.gears.ManagedResourceStore.EventType.SUCCESS);
    this.setFilesCounts_(1, 1);
  }

  if (e) {
    this.cancelStatusCheck_();
    this.dispatchEvent(e);
    // Fire complete after both error and success
    this.dispatchEvent(goog.gears.ManagedResourceStore.EventType.COMPLETE);
    this.active_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancel periodic status checks.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.cancelStatusCheck_ = function() {
  if (!this.supportsEvents_ && this.timerId_ != null) {
    this.timer_.clearInterval(this.timerId_);
    this.timerId_ = null;
    this.timer_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback for when the Gears managed resource store fires a progress event.
***REMOVED*** @param {Object} details An object containg two fields, {@code filesComplete}
***REMOVED***     and {@code filesTotal}.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.handleProgress_ = function(details) {
  // setFilesCounts_ will dispatch the progress event as needed
  this.setFilesCounts_(details['filesComplete'], details['filesTotal']);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for when the Gears managed resource store fires a complete event.
***REMOVED*** @param {Object} details An object containg one field called
***REMOVED***     {@code newVersion}.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.handleComplete_ = function(details) {
  this.dispatchEvent(goog.gears.ManagedResourceStore.EventType.SUCCESS);
  this.dispatchEvent(goog.gears.ManagedResourceStore.EventType.COMPLETE);
  this.active_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Callback for when the Gears managed resource store fires an error event.
***REMOVED*** @param {Object} error An object containg one field called
***REMOVED***     {@code message}.
***REMOVED*** @private
***REMOVED***
goog.gears.ManagedResourceStore.prototype.handleError_ = function(error) {
  this.dispatchEvent(new goog.gears.ManagedResourceStoreEvent(
      goog.gears.ManagedResourceStore.EventType.ERROR, error.message));
  this.dispatchEvent(goog.gears.ManagedResourceStore.EventType.COMPLETE);
  this.active_ = false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.ManagedResourceStore.prototype.disposeInternal = function() {
  goog.gears.ManagedResourceStore.superClass_.disposeInternal.call(this);
  if (this.supportsEvents_ && this.gearsStore_) {
    this.gearsStore_.onprogress = null;
    this.gearsStore_.oncomplete = null;
    this.gearsStore_.onerror = null;
  }
  this.cancelStatusCheck_();
  this.localServer_ = null;
  this.gearsStore_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Enum for event types fired by ManagedResourceStore.
***REMOVED*** @enum {string}
***REMOVED***
goog.gears.ManagedResourceStore.EventType = {
  COMPLETE: 'complete',
  ERROR: 'error',
  PROGRESS: 'progress',
  SUCCESS: 'success'
***REMOVED***



***REMOVED***
***REMOVED*** Event used when a ManagedResourceStore update is complete
***REMOVED*** @param {string} type  The type of the event.
***REMOVED*** @param {string=} opt_errorMessage  The error message if failure.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.gears.ManagedResourceStoreEvent = function(type, opt_errorMessage) {
  goog.events.Event.call(this, type);

  if (opt_errorMessage) {
    this.errorMessage = opt_errorMessage;
  }
***REMOVED***
goog.inherits(goog.gears.ManagedResourceStoreEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Error message in the case of a failure event.
***REMOVED*** @type {?string}
***REMOVED***
goog.gears.ManagedResourceStoreEvent.prototype.errorMessage = null;
