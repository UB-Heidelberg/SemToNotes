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

goog.provide('goog.pubsub.TypedPubSub');

goog.require('goog.Disposable');
goog.require('goog.pubsub.PubSub');



***REMOVED***
***REMOVED*** This object is a temporary shim that provides goog.pubsub.TopicId support
***REMOVED*** for goog.pubsub.PubSub.  See b/12477087 for more info.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.pubsub.TypedPubSub = function() {
  goog.pubsub.TypedPubSub.base(this, 'constructor');

  this.pubSub_ = new goog.pubsub.PubSub();
  this.registerDisposable(this.pubSub_);
***REMOVED***
goog.inherits(goog.pubsub.TypedPubSub, goog.Disposable);


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.subscribe}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>} topic Topic to subscribe to.
***REMOVED*** @param {function(this:CONTEXT, PAYLOAD)} fn Function to be invoked when a
***REMOVED***     message is published to the given topic.
***REMOVED*** @param {CONTEXT=} opt_context Object in whose context the function is to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {number} Subscription key.
***REMOVED*** @template PAYLOAD, CONTEXT
***REMOVED***
goog.pubsub.TypedPubSub.prototype.subscribe = function(topic, fn, opt_context) {
  return this.pubSub_.subscribe(topic.toString(), fn, opt_context);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.subscribeOnce}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>} topic Topic to subscribe to.
***REMOVED*** @param {function(this:CONTEXT, PAYLOAD)} fn Function to be invoked once and
***REMOVED***     then unsubscribed when a message is published to the given topic.
***REMOVED*** @param {CONTEXT=} opt_context Object in whose context the function is to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {number} Subscription key.
***REMOVED*** @template PAYLOAD, CONTEXT
***REMOVED***
goog.pubsub.TypedPubSub.prototype.subscribeOnce = function(
    topic, fn, opt_context) {
  return this.pubSub_.subscribeOnce(topic.toString(), fn, opt_context);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.unsubscribe}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>} topic Topic to unsubscribe from.
***REMOVED*** @param {function(this:CONTEXT, PAYLOAD)} fn Function to unsubscribe.
***REMOVED*** @param {CONTEXT=} opt_context Object in whose context the function was to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {boolean} Whether a matching subscription was removed.
***REMOVED*** @template PAYLOAD, CONTEXT
***REMOVED***
goog.pubsub.TypedPubSub.prototype.unsubscribe = function(
    topic, fn, opt_context) {
  return this.pubSub_.unsubscribe(topic.toString(), fn, opt_context);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.unsubscribeByKey}.
***REMOVED*** @param {number} key Subscription key.
***REMOVED*** @return {boolean} Whether a matching subscription was removed.
***REMOVED***
goog.pubsub.TypedPubSub.prototype.unsubscribeByKey = function(key) {
  return this.pubSub_.unsubscribeByKey(key);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.publish}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>} topic Topic to publish to.
***REMOVED*** @param {PAYLOAD} payload Payload passed to each subscription function.
***REMOVED*** @return {boolean} Whether any subscriptions were called.
***REMOVED*** @template PAYLOAD
***REMOVED***
goog.pubsub.TypedPubSub.prototype.publish = function(topic, payload) {
  return this.pubSub_.publish(topic.toString(), payload);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.clear}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>=} opt_topic Topic to clear (all topics
***REMOVED***     if unspecified).
***REMOVED*** @template PAYLOAD
***REMOVED***
goog.pubsub.TypedPubSub.prototype.clear = function(opt_topic) {
  this.pubSub_.clear(goog.isDef(opt_topic) ? opt_topic.toString() : undefined);
***REMOVED***


***REMOVED***
***REMOVED*** See {@code goog.pubsub.PubSub.getCount}.
***REMOVED*** @param {!goog.pubsub.TopicId.<PAYLOAD>=} opt_topic The topic (all topics if
***REMOVED***     unspecified).
***REMOVED*** @return {number} Number of subscriptions to the topic.
***REMOVED*** @template PAYLOAD
***REMOVED***
goog.pubsub.TypedPubSub.prototype.getCount = function(opt_topic) {
  return this.pubSub_.getCount(
      goog.isDef(opt_topic) ? opt_topic.toString() : undefined);
***REMOVED***
