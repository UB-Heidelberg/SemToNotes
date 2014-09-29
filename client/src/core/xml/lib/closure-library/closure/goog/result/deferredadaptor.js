// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An adaptor from a Result to a Deferred.
***REMOVED***
***REMOVED*** TODO (vbhasin): cancel() support.
***REMOVED*** TODO (vbhasin): See if we can make this a static.
***REMOVED*** TODO (gboyer, vbhasin): Rename to "Adapter" once this graduates; this is the
***REMOVED*** proper programmer spelling.
***REMOVED***


goog.provide('goog.result.DeferredAdaptor');

goog.require('goog.async.Deferred');
goog.require('goog.result');
goog.require('goog.result.Result');



***REMOVED***
***REMOVED*** An adaptor from Result to a Deferred, for use with existing Deferred chains.
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result A result.
***REMOVED***
***REMOVED*** @extends {goog.async.Deferred}
***REMOVED***
goog.result.DeferredAdaptor = function(result) {
  goog.base(this);
  goog.result.wait(result, function(result) {
    if (this.hasFired()) {
      return;
    }
    if (result.getState() == goog.result.Result.State.SUCCESS) {
      this.callback(result.getValue());
    } else if (result.getState() == goog.result.Result.State.ERROR) {
      if (result.getError() instanceof goog.result.Result.CancelError) {
        this.cancel();
      } else {
        this.errback(result.getError());
      }
    }
  }, this);
***REMOVED***
goog.inherits(goog.result.DeferredAdaptor, goog.async.Deferred);
