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

***REMOVED***
***REMOVED*** @fileoverview goog.dom.animationFrame permits work to be done in-sync with
***REMOVED*** the render refresh rate of the browser and to divide work up globally based
***REMOVED*** on whether the intent is not measure or to mutate the DOM. The latter avoids
***REMOVED*** repeated style recalculation which can be really slow.
***REMOVED***
***REMOVED*** Goals of the API:
***REMOVED*** <ul>
***REMOVED***   <li>Make it easy to schedule work for the next animation frame.
***REMOVED***   <li>Make it easy to only do work once per animation frame, even if two
***REMOVED***       events fire that trigger the same work.
***REMOVED***   <li>Make it easy to do all work in two phases to avoid repeated style
***REMOVED***       recalculation caused by interleaved reads and writes.
***REMOVED***   <li> Avoid creating closures per schedule operation.
***REMOVED*** </ul>
***REMOVED***
***REMOVED***
***REMOVED*** Programmatic:
***REMOVED*** <pre>
***REMOVED*** var animationTask = goog.dom.animationFrame.createTask({
***REMOVED***     measure: function(state) {
***REMOVED***       state.width = goog.style.getSize(elem).width;
***REMOVED***       this.animationTask();
***REMOVED***     },
***REMOVED***     mutate: function(state) {
***REMOVED***       goog.style.setWidth(elem, Math.floor(state.width / 2));
***REMOVED***     }
***REMOVED***   }, this);
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** See also
***REMOVED*** https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
***REMOVED***

goog.provide('goog.dom.animationFrame');
goog.provide('goog.dom.animationFrame.Spec');
goog.provide('goog.dom.animationFrame.State');

goog.require('goog.dom.animationFrame.polyfill');

// Install the polyfill.
goog.dom.animationFrame.polyfill.install();


***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   id: number,
***REMOVED***   fn: !Function,
***REMOVED***   context: (!Object|undefined)
***REMOVED*** }}
***REMOVED*** @private
***REMOVED***
goog.dom.animationFrame.Task_;


***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   measureTask: goog.dom.animationFrame.Task_,
***REMOVED***   mutateTask: goog.dom.animationFrame.Task_,
***REMOVED***   state: (!Object|undefined),
***REMOVED***   args: (!Array|undefined),
***REMOVED***   isScheduled: boolean
***REMOVED*** }}
***REMOVED*** @private
***REMOVED***
goog.dom.animationFrame.TaskSet_;


***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   measure: (!Function|undefined),
***REMOVED***   mutate: (!Function|undefined)
***REMOVED*** }}
***REMOVED***
goog.dom.animationFrame.Spec;



***REMOVED***
***REMOVED*** A type to represent state. Users may add properties as desired.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.dom.animationFrame.State = function() {***REMOVED***


***REMOVED***
***REMOVED*** Saves a set of tasks to be executed in the next requestAnimationFrame phase.
***REMOVED*** This list is initialized once before any event firing occurs. It is not
***REMOVED*** affected by the fired events or the requestAnimationFrame processing (unless
***REMOVED*** a new event is created during the processing).
***REMOVED*** @private {!Array.<!Array.<goog.dom.animationFrame.TaskSet_>>}
***REMOVED***
goog.dom.animationFrame.tasks_ = [[], []];


***REMOVED***
***REMOVED*** Values are 0 or 1, for whether the first or second array should be used to
***REMOVED*** lookup or add tasks.
***REMOVED*** @private {number}
***REMOVED***
goog.dom.animationFrame.doubleBufferIndex_ = 0;


***REMOVED***
***REMOVED*** Whether we have already requested an animation frame that hasn't happened
***REMOVED*** yet.
***REMOVED*** @private {boolean}
***REMOVED***
goog.dom.animationFrame.requestedFrame_ = false;


***REMOVED***
***REMOVED*** Counter to generate IDs for tasks.
***REMOVED*** @private {number}
***REMOVED***
goog.dom.animationFrame.taskId_ = 0;


***REMOVED***
***REMOVED*** Returns a function that schedules the two passed-in functions to be run upon
***REMOVED*** the next animation frame. Calling the function again during the same
***REMOVED*** animation frame does nothing.
***REMOVED***
***REMOVED*** The function under the "measure" key will run first and together with all
***REMOVED*** other functions scheduled under this key and the function under "mutate" will
***REMOVED*** run after that.
***REMOVED***
***REMOVED*** @param {!{
***REMOVED***   measure: (function(this:THIS, !goog.dom.animationFrame.State)|undefined),
***REMOVED***   mutate: (function(this:THIS, !goog.dom.animationFrame.State)|undefined)
***REMOVED*** }} spec
***REMOVED*** @param {THIS=} opt_context Context in which to run the function.
***REMOVED*** @return {function(...[?])}
***REMOVED*** @template THIS
***REMOVED***
goog.dom.animationFrame.createTask = function(spec, opt_context) {
  var genericSpec =***REMOVED*****REMOVED*** @type {!goog.dom.animationFrame.Spec}***REMOVED*** (spec);
  var id = goog.dom.animationFrame.taskId_++;
  var measureTask = {
    id: id,
    fn: spec.measure,
    context: opt_context
 ***REMOVED*****REMOVED***
  var mutateTask = {
    id: id,
    fn: spec.mutate,
    context: opt_context
 ***REMOVED*****REMOVED***

  var taskSet = {
    measureTask: measureTask,
    mutateTask: mutateTask,
    state: {},
    args: undefined,
    isScheduled: false
 ***REMOVED*****REMOVED***

  return function() {
    // Default the context to the one that was used to call the tasks scheduler
    // (this function).
    if (!opt_context) {
      measureTask.context = this;
      mutateTask.context = this;
    }

    // Save args and state.
    if (arguments.length > 0) {
      // The state argument goes last. That is kinda horrible but compatible
      // with {@see wiz.async.method}.
      if (!taskSet.args) {
        taskSet.args = [];
      }
      taskSet.args.length = 0;
      taskSet.args.push.apply(taskSet.args, arguments);
      taskSet.args.push(taskSet.state);
    } else {
      if (!taskSet.args || taskSet.args.length == 0) {
        taskSet.args = [taskSet.state];
      } else {
        taskSet.args[0] = taskSet.state;
        taskSet.args.length = 1;
      }
    }
    if (!taskSet.isScheduled) {
      taskSet.isScheduled = true;
      var tasksArray = goog.dom.animationFrame.tasks_[
          goog.dom.animationFrame.doubleBufferIndex_];
      tasksArray.push(taskSet);
    }
    goog.dom.animationFrame.requestAnimationFrame_();
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Run scheduled tasks.
***REMOVED*** @private
***REMOVED***
goog.dom.animationFrame.runTasks_ = function() {
  goog.dom.animationFrame.requestedFrame_ = false;
  var tasksArray = goog.dom.animationFrame
                       .tasks_[goog.dom.animationFrame.doubleBufferIndex_];
  var taskLength = tasksArray.length;

  // During the runTasks_, if there is a recursive call to queue up more
  // task(s) for the next frame, we use double-buffering for that.
  goog.dom.animationFrame.doubleBufferIndex_ =
      (goog.dom.animationFrame.doubleBufferIndex_ + 1) % 2;

  var task;

  // Run all the measure tasks first.
  for (var i = 0; i < taskLength; ++i) {
    task = tasksArray[i];
    var measureTask = task.measureTask;
    task.isScheduled = false;
    if (measureTask.fn) {
      // TODO (perumaal): Handle any exceptions thrown by the lambda.
      measureTask.fn.apply(measureTask.context, task.args);
    }
  }

  // Run the mutate tasks next.
  for (var i = 0; i < taskLength; ++i) {
    task = tasksArray[i];
    var mutateTask = task.mutateTask;
    task.isScheduled = false;
    if (mutateTask.fn) {
      // TODO (perumaal): Handle any exceptions thrown by the lambda.
      mutateTask.fn.apply(mutateTask.context, task.args);
    }

    // Clear state for next vsync.
    task.state = {***REMOVED***
  }

  // Clear the tasks array as we have finished processing all the tasks.
  tasksArray.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Request {@see goog.dom.animationFrame.runTasks_} to be called upon the
***REMOVED*** next animation frame if we haven't done so already.
***REMOVED*** @private
***REMOVED***
goog.dom.animationFrame.requestAnimationFrame_ = function() {
  if (goog.dom.animationFrame.requestedFrame_) {
    return;
  }
  goog.dom.animationFrame.requestedFrame_ = true;
  window.requestAnimationFrame(goog.dom.animationFrame.runTasks_);
***REMOVED***
