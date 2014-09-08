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
***REMOVED*** @fileoverview  Topic-based publish/subscribe channel implementation.
***REMOVED***
***REMOVED***

goog.provide('goog.pubsub.PubSub');

goog.require('goog.Disposable');
goog.require('goog.array');



***REMOVED***
***REMOVED*** Topic-based publish/subscribe channel.  Maintains a map of topics to
***REMOVED*** subscriptions.  When a message is published to a topic, all functions
***REMOVED*** subscribed to that topic are invoked in the order they were added.
***REMOVED*** Uncaught errors abort publishing.
***REMOVED***
***REMOVED*** Topics may be identified by any nonempty string, <strong>except</strong>
***REMOVED*** strings corresponding to native Object properties, e.g. "constructor",
***REMOVED*** "toString", "hasOwnProperty", etc.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.pubsub.PubSub = function() {
  goog.Disposable.call(this);
  this.subscriptions_ = [];
  this.topics_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.pubsub.PubSub, goog.Disposable);


***REMOVED***
***REMOVED*** Sparse array of subscriptions.  Each subscription is represented by a tuple
***REMOVED*** comprising a topic identifier, a function, and an optional context object.
***REMOVED*** Each tuple occupies three consecutive positions in the array, with the topic
***REMOVED*** identifier at index n, the function at index (n + 1), the context object at
***REMOVED*** index (n + 2), the next topic at index (n + 3), etc.  (This representation
***REMOVED*** minimizes the number of object allocations and has been shown to be faster
***REMOVED*** than an array of objects with three key-value pairs or three parallel arrays,
***REMOVED*** especially on IE.)  Once a subscription is removed via {@link #unsubscribe}
***REMOVED*** or {@link #unsubscribeByKey}, the three corresponding array elements are
***REMOVED*** deleted, and never reused.  This means the total number of subscriptions
***REMOVED*** during the lifetime of the pubsub channel is limited by the maximum length
***REMOVED*** of a JavaScript array to (2^32 - 1) / 3 = 1,431,655,765 subscriptions, which
***REMOVED*** should suffice for most applications.
***REMOVED***
***REMOVED*** @type {!Array}
***REMOVED*** @private
***REMOVED***
goog.pubsub.PubSub.prototype.subscriptions_;


***REMOVED***
***REMOVED*** The next available subscription key.  Internally, this is an index into the
***REMOVED*** sparse array of subscriptions.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.pubsub.PubSub.prototype.key_ = 1;


***REMOVED***
***REMOVED*** Map of topics to arrays of subscription keys.
***REMOVED***
***REMOVED*** @type {!Object.<!Array.<number>>}
***REMOVED*** @private
***REMOVED***
goog.pubsub.PubSub.prototype.topics_;


***REMOVED***
***REMOVED*** Array of subscription keys pending removal once publishing is done.
***REMOVED***
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.pubsub.PubSub.prototype.pendingKeys_;


***REMOVED***
***REMOVED*** Lock to prevent the removal of subscriptions during publishing.  Incremented
***REMOVED*** at the beginning of {@link #publish}, and decremented at the end.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.pubsub.PubSub.prototype.publishDepth_ = 0;


***REMOVED***
***REMOVED*** Subscribes a function to a topic.  The function is invoked as a method on
***REMOVED*** the given {@code opt_context} object, or in the global scope if no context
***REMOVED*** is specified.  Subscribing the same function to the same topic multiple
***REMOVED*** times will result in multiple function invocations while publishing.
***REMOVED*** Returns a subscription key that can be used to unsubscribe the function from
***REMOVED*** the topic via {@link #unsubscribeByKey}.
***REMOVED***
***REMOVED*** @param {string} topic Topic to subscribe to.
***REMOVED*** @param {Function} fn Function to be invoked when a message is published to
***REMOVED***     the given topic.
***REMOVED*** @param {Object=} opt_context Object in whose context the function is to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {number} Subscription key.
***REMOVED***
goog.pubsub.PubSub.prototype.subscribe = function(topic, fn, opt_context) {
  var keys = this.topics_[topic];
  if (!keys) {
    // First subscription to this topic; initialize subscription key array.
    keys = this.topics_[topic] = [];
  }

  // Push the tuple representing the subscription onto the subscription array.
  var key = this.key_;
  this.subscriptions_[key] = topic;
  this.subscriptions_[key + 1] = fn;
  this.subscriptions_[key + 2] = opt_context;
  this.key_ = key + 3;

  // Push the subscription key onto the list of subscriptions for the topic.
  keys.push(key);

  // Return the subscription key.
  return key;
***REMOVED***


***REMOVED***
***REMOVED*** Subscribes a single-use function to a topic.  The function is invoked as a
***REMOVED*** method on the given {@code opt_context} object, or in the global scope if
***REMOVED*** no context is specified, and is then unsubscribed.  Returns a subscription
***REMOVED*** key that can be used to unsubscribe the function from the topic via
***REMOVED*** {@link #unsubscribeByKey}.
***REMOVED***
***REMOVED*** @param {string} topic Topic to subscribe to.
***REMOVED*** @param {Function} fn Function to be invoked once and then unsubscribed when
***REMOVED***     a message is published to the given topic.
***REMOVED*** @param {Object=} opt_context Object in whose context the function is to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {number} Subscription key.
***REMOVED***
goog.pubsub.PubSub.prototype.subscribeOnce = function(topic, fn, opt_context) {
  // Behold the power of lexical closures!
  var key = this.subscribe(topic, function(var_args) {
    fn.apply(opt_context, arguments);
    this.unsubscribeByKey(key);
  }, this);
  return key;
***REMOVED***


***REMOVED***
***REMOVED*** Unsubscribes a function from a topic.  Only deletes the first match found.
***REMOVED*** Returns a Boolean indicating whether a subscription was removed.
***REMOVED***
***REMOVED*** @param {string} topic Topic to unsubscribe from.
***REMOVED*** @param {Function} fn Function to unsubscribe.
***REMOVED*** @param {Object=} opt_context Object in whose context the function was to be
***REMOVED***     called (the global scope if none).
***REMOVED*** @return {boolean} Whether a matching subscription was removed.
***REMOVED***
goog.pubsub.PubSub.prototype.unsubscribe = function(topic, fn, opt_context) {
  var keys = this.topics_[topic];
  if (keys) {
    // Find the subscription key for the given combination of topic, function,
    // and context object.
    var subscriptions = this.subscriptions_;
    var key = goog.array.find(keys, function(k) {
      return subscriptions[k + 1] == fn && subscriptions[k + 2] == opt_context;
    });
    // Zero is not a valid key.
    if (key) {
      return this.unsubscribeByKey(***REMOVED*** @type {number}***REMOVED*** (key));
    }
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a subscription based on the key returned by {@link #subscribe}.
***REMOVED*** No-op if no matching subscription is found.  Returns a Boolean indicating
***REMOVED*** whether a subscription was removed.
***REMOVED***
***REMOVED*** @param {number} key Subscription key.
***REMOVED*** @return {boolean} Whether a matching subscription was removed.
***REMOVED***
goog.pubsub.PubSub.prototype.unsubscribeByKey = function(key) {
  if (this.publishDepth_ != 0) {
    // Defer removal until after publishing is complete.
    if (!this.pendingKeys_) {
      this.pendingKeys_ = [];
    }
    this.pendingKeys_.push(key);
    return false;
  }

  var topic = this.subscriptions_[key];
  if (topic) {
    // Subscription tuple found.
    var keys = this.topics_[topic];
    if (keys) {
      goog.array.remove(keys, key);
    }
    delete this.subscriptions_[key];
    delete this.subscriptions_[key + 1];
    delete this.subscriptions_[key + 2];
  }

  return !!topic;
***REMOVED***


***REMOVED***
***REMOVED*** Publishes a message to a topic.  Calls functions subscribed to the topic in
***REMOVED*** the order in which they were added, passing all arguments along.  If any of
***REMOVED*** the functions throws an uncaught error, publishing is aborted.
***REMOVED***
***REMOVED*** @param {string} topic Topic to publish to.
***REMOVED*** @param {...*} var_args Arguments that are applied to each subscription
***REMOVED***     function.
***REMOVED*** @return {boolean} Whether any subscriptions were called.
***REMOVED***
goog.pubsub.PubSub.prototype.publish = function(topic, var_args) {
  var keys = this.topics_[topic];
  if (keys) {
    // We must lock subscriptions and remove them at the end, so we don't
    // adversely affect the performance of the common case by cloning the key
    // array.
    this.publishDepth_++;

    // For each key in the list of subscription keys for the topic, apply the
    // function to the arguments in the appropriate context.  The length of the
    // array mush be fixed during the iteration, since subscribers may add new
    // subscribers during publishing.
    var args = goog.array.slice(arguments, 1);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      this.subscriptions_[key + 1].apply(this.subscriptions_[key + 2], args);
    }

    // Unlock subscriptions.
    this.publishDepth_--;

    if (this.pendingKeys_ && this.publishDepth_ == 0) {
      var pendingKey;
      while ((pendingKey = this.pendingKeys_.pop())) {
        this.unsubscribeByKey(pendingKey);
      }
    }

    // At least one subscriber was called.
    return i != 0;
  }

  // No subscribers were found.
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the subscription list for a topic, or all topics if unspecified.
***REMOVED*** @param {string=} opt_topic Topic to clear (all topics if unspecified).
***REMOVED***
goog.pubsub.PubSub.prototype.clear = function(opt_topic) {
  if (opt_topic) {
    var keys = this.topics_[opt_topic];
    if (keys) {
      goog.array.forEach(keys, this.unsubscribeByKey, this);
      delete this.topics_[opt_topic];
    }
  } else {
    this.subscriptions_.length = 0;
    this.topics_ = {***REMOVED***
    // We don't reset key_ on purpose, because we want subscription keys to be
    // unique throughout the lifetime of the application.  Reusing subscription
    // keys could lead to subtle errors in client code.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of subscriptions to the given topic (or all topics if
***REMOVED*** unspecified).
***REMOVED*** @param {string=} opt_topic The topic (all topics if unspecified).
***REMOVED*** @return {number} Number of subscriptions to the topic.
***REMOVED***
goog.pubsub.PubSub.prototype.getCount = function(opt_topic) {
  if (opt_topic) {
    var keys = this.topics_[opt_topic];
    return keys ? keys.length : 0;
  }

  var count = 0;
  for (var topic in this.topics_) {
    count += this.getCount(topic);
  }

  return count;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.pubsub.PubSub.prototype.disposeInternal = function() {
  goog.pubsub.PubSub.superClass_.disposeInternal.call(this);
  delete this.subscriptions_;
  delete this.topics_;
  delete this.pendingKeys_;
***REMOVED***
