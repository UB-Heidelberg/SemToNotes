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
***REMOVED*** @fileoverview This module simplifies testing code which uses stateful
***REMOVED*** singletons. {@code goog.testing.singleton.reset} resets all instances, so
***REMOVED*** next time when {@code getInstance} is called, a new instance is created.
***REMOVED*** It's recommended to reset the singletons in {@code tearDown} to prevent
***REMOVED*** interference between subsequent tests.
***REMOVED***
***REMOVED*** The {@code goog.testing.singleton} functions expect that the goog.DEBUG flag
***REMOVED*** is enabled, and the tests are either uncompiled or compiled without renaming.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.singleton');


***REMOVED***
***REMOVED*** Deletes all singleton instances, so {@code getInstance} will return a new
***REMOVED*** instance on next call.
***REMOVED***
goog.testing.singleton.reset = function() {
  var singletons = goog.getObjectByName('goog.instantiatedSingletons_');
  var ctor;
  while (ctor = singletons.pop()) {
    delete ctor.instance_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Please use {@code goog.addSingletonGetter}.
***REMOVED***
goog.testing.singleton.addSingletonGetter = goog.addSingletonGetter;
