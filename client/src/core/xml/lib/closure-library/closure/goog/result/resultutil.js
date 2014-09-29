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
***REMOVED*** @fileoverview This file provides primitives and tools (wait, transform,
***REMOVED***     chain, combine) that make it easier to work with Results. This section
***REMOVED***     gives an overview of their functionality along with some examples and the
***REMOVED***     actual definitions have detailed descriptions next to them.
***REMOVED***
***REMOVED***

goog.provide('goog.result');

goog.require('goog.array');
goog.require('goog.result.DependentResult');
goog.require('goog.result.Result');
goog.require('goog.result.SimpleResult');


***REMOVED***
***REMOVED*** Returns a successful result containing the provided value.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var value = 'some-value';
***REMOVED*** var result = goog.result.immediateResult(value);
***REMOVED*** assertEquals(goog.result.Result.State.SUCCESS, result.getState());
***REMOVED*** assertEquals(value, result.getValue());
***REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {*} value The value of the result.
***REMOVED*** @return {!goog.result.Result} A Result object that has already been resolved
***REMOVED***     to the supplied value.
***REMOVED***
goog.result.successfulResult = function(value) {
  var result = new goog.result.SimpleResult();
  result.setValue(value);
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a failed result with the optional error slug set.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var error = new Error('something-failed');
***REMOVED*** var result = goog.result.failedResult(error);
***REMOVED*** assertEquals(goog.result.Result.State.ERROR, result.getState());
***REMOVED*** assertEquals(error, result.getError());
***REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {*=} opt_error The error to which the result should resolve.
***REMOVED*** @return {!goog.result.Result} A Result object that has already been resolved
***REMOVED***     to the supplied Error.
***REMOVED***
goog.result.failedResult = function(opt_error) {
  var result = new goog.result.SimpleResult();
  result.setError(opt_error);
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a canceled result.
***REMOVED*** The result will be resolved to an error of type CancelError.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result = goog.result.canceledResult();
***REMOVED*** assertEquals(goog.result.Result.State.ERROR, result.getState());
***REMOVED*** var error = result.getError();
***REMOVED*** assertTrue(error instanceof goog.result.Result.CancelError);
***REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @return {!goog.result.Result} A canceled Result.
***REMOVED***
goog.result.canceledResult = function() {
  var result = new goog.result.SimpleResult();
  result.cancel();
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the handler on resolution of the result (success or failure).
***REMOVED*** The handler is passed the result object as the only parameter. The call will
***REMOVED*** be immediate if the result is no longer pending.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Wait for the result to be resolved and alert it's state.
***REMOVED*** goog.result.wait(result, function(result) {
***REMOVED***   alert('State: ' + result.getState());
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result The result to install the handlers.
***REMOVED*** @param {!function(this:T, !goog.result.Result)} handler The handler to be
***REMOVED***     called. The handler is passed the result object as the only parameter.
***REMOVED*** @param {!T=} opt_scope Optional scope for the handler.
***REMOVED*** @template T
***REMOVED***
goog.result.wait = function(result, handler, opt_scope) {
  result.wait(opt_scope ? goog.bind(handler, opt_scope) : handler);
***REMOVED***


***REMOVED***
***REMOVED*** Calls the handler if the result succeeds. The result object is the only
***REMOVED*** parameter passed to the handler. The call will be immediate if the result
***REMOVED*** has already succeeded.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // attach a success handler.
***REMOVED*** goog.result.waitOnSuccess(result, function(result) {
***REMOVED***   var datavalue = result.getvalue();
***REMOVED***   alert('value : ' + datavalue);
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result The result to install the handlers.
***REMOVED*** @param {!function(this:T, ?, !goog.result.Result)} handler The handler to be
***REMOVED***     called. The handler is passed the result value and the result as
***REMOVED***     parameters.
***REMOVED*** @param {!T=} opt_scope Optional scope for the handler.
***REMOVED*** @template T
***REMOVED***
goog.result.waitOnSuccess = function(result, handler, opt_scope) {
  goog.result.wait(result, function(res) {
    if (res.getState() == goog.result.Result.State.SUCCESS) {
      // 'this' refers to opt_scope
      handler.call(this, res.getValue(), res);
    }
  }, opt_scope);
***REMOVED***


***REMOVED***
***REMOVED*** Calls the handler if the result action errors. The result object is passed as
***REMOVED*** the only parameter to the handler. The call will be immediate if the result
***REMOVED*** object has already resolved to an error.
***REMOVED***
***REMOVED*** Example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Attach a failure handler.
***REMOVED*** goog.result.waitOnError(result, function(error) {
***REMOVED***  // Failed asynchronous call!
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result The result to install the handlers.
***REMOVED*** @param {!function(this:T, !goog.result.Result)} handler The handler to be
***REMOVED***     called. The handler is passed the result object as the only parameter.
***REMOVED*** @param {!T=} opt_scope Optional scope for the handler.
***REMOVED*** @template T
***REMOVED***
goog.result.waitOnError = function(result, handler, opt_scope) {
  goog.result.wait(result, function(res) {
    if (res.getState() == goog.result.Result.State.ERROR) {
      // 'this' refers to opt_scope
      handler.call(this, res);
    }
  }, opt_scope);
***REMOVED***


***REMOVED***
***REMOVED*** Given a result and a transform function, returns a new result whose value,
***REMOVED*** on success, will be the value of the given result after having been passed
***REMOVED*** through the transform function.
***REMOVED***
***REMOVED*** If the given result is an error, the returned result is also an error and the
***REMOVED*** transform will not be called.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result = xhr.getJson('testdata/xhr_test_json.data');
***REMOVED***
***REMOVED*** // Transform contents of returned data using 'processJson' and create a
***REMOVED*** // transformed result to use returned JSON.
***REMOVED*** var transformedResult = goog.result.transform(result, processJson);
***REMOVED***
***REMOVED*** // Attach success and failure handlers to the tranformed result.
***REMOVED*** goog.result.waitOnSuccess(transformedResult, function(result) {
***REMOVED***   var jsonData = result.getValue();
***REMOVED***   assertEquals('ok', jsonData['stat']);
***REMOVED*** });
***REMOVED***
***REMOVED*** goog.result.waitOnError(transformedResult, function(error) {
***REMOVED***   // Failed getJson call
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result The result whose value will be
***REMOVED***     transformed.
***REMOVED*** @param {!function(?):?} transformer The transformer
***REMOVED***     function. The return value of this function will become the value of the
***REMOVED***     returned result.
***REMOVED***
***REMOVED*** @return {!goog.result.DependentResult} A new Result whose eventual value will
***REMOVED***     be the returned value of the transformer function.
***REMOVED***
goog.result.transform = function(result, transformer) {
  var returnedResult = new goog.result.DependentResultImpl_([result]);

  goog.result.wait(result, function(res) {
    if (res.getState() == goog.result.Result.State.SUCCESS) {
      returnedResult.setValue(transformer(res.getValue()));
    } else {
      returnedResult.setError(res.getError());
    }
  });

  return returnedResult;
***REMOVED***


***REMOVED***
***REMOVED*** The chain function aids in chaining of asynchronous Results. This provides a
***REMOVED*** convenience for use cases where asynchronous operations must happen serially
***REMOVED*** i.e. subsequent asynchronous operations are dependent on data returned by
***REMOVED*** prior asynchronous operations.
***REMOVED***
***REMOVED*** It accepts a result and an action callback as arguments and returns a
***REMOVED*** result. The action callback is called when the first result succeeds and is
***REMOVED*** supposed to return a second result. The returned result is resolved when one
***REMOVED*** of both of the results resolve (depending on their success or failure.) The
***REMOVED*** state and value of the returned result in the various cases is documented
***REMOVED*** below:
***REMOVED***
***REMOVED*** First Result State:    Second Result State:    Returned Result State:
***REMOVED*** SUCCESS                SUCCESS                 SUCCESS
***REMOVED*** SUCCESS                ERROR                   ERROR
***REMOVED*** ERROR                  Not created             ERROR
***REMOVED***
***REMOVED*** The value of the returned result, in the case both results succeed, is the
***REMOVED*** value of the second result (the result returned by the action callback.)
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var testDataResult = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Chain this result to perform another asynchronous operation when this
***REMOVED*** // Result is resolved.
***REMOVED*** var chainedResult = goog.result.chain(testDataResult,
***REMOVED***     function(testDataResult) {
***REMOVED***
***REMOVED***       // The result value of testDataResult is the URL for JSON data.
***REMOVED***       var jsonDataUrl = testDataResult.getValue();
***REMOVED***
***REMOVED***       // Create a new Result object when the original result is resolved.
***REMOVED***       var jsonResult = xhr.getJson(jsonDataUrl);
***REMOVED***
***REMOVED***       // Return the newly created Result.
***REMOVED***       return jsonResult;
***REMOVED***     });
***REMOVED***
***REMOVED*** // The chained result resolves to success when both results resolve to
***REMOVED*** // success.
***REMOVED*** goog.result.waitOnSuccess(chainedResult, function(result) {
***REMOVED***
***REMOVED***   // At this point, both results have succeeded and we can use the JSON
***REMOVED***   // data returned by the second asynchronous call.
***REMOVED***   var jsonData = result.getValue();
***REMOVED***   assertEquals('ok', jsonData['stat']);
***REMOVED*** });
***REMOVED***
***REMOVED*** // Attach the error handler to be called when either Result fails.
***REMOVED*** goog.result.waitOnError(chainedResult, function(result) {
***REMOVED***   alert('chained result failed!');
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.result.Result} result The result to chain.
***REMOVED*** @param {!function(!goog.result.Result):!goog.result.Result}
***REMOVED***     actionCallback The callback called when the result is resolved. This
***REMOVED***     callback must return a Result.
***REMOVED***
***REMOVED*** @return {!goog.result.DependentResult} A result that is resolved when both
***REMOVED***     the given Result and the Result returned by the actionCallback have
***REMOVED***     resolved.
***REMOVED***
goog.result.chain = function(result, actionCallback) {
  var dependentResult = new goog.result.DependentResultImpl_([result]);

  // Wait for the first action.
  goog.result.wait(result, function(result) {
    if (result.getState() == goog.result.Result.State.SUCCESS) {

      // The first action succeeded. Chain the contingent action.
      var contingentResult = actionCallback(result);
      dependentResult.addParentResult(contingentResult);
      goog.result.wait(contingentResult, function(contingentResult) {

        // The contingent action completed. Set the dependent result based on
        // the contingent action's outcome.
        if (contingentResult.getState() ==
            goog.result.Result.State.SUCCESS) {
          dependentResult.setValue(contingentResult.getValue());
        } else {
          dependentResult.setError(contingentResult.getError());
        }
      });
    } else {
      // First action failed, the dependent result should also fail.
      dependentResult.setError(result.getError());
    }
  });

  return dependentResult;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a result that waits on all given results to resolve. Once all have
***REMOVED*** resolved, the returned result will succeed (and never error).
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result1 = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Get a second independent Result.
***REMOVED*** var result2 = xhr.getJson('testdata/xhr_test_json.data');
***REMOVED***
***REMOVED*** // Create a Result that resolves when both prior results resolve.
***REMOVED*** var combinedResult = goog.result.combine(result1, result2);
***REMOVED***
***REMOVED*** // Process data after resolution of both results.
***REMOVED*** goog.result.waitOnSuccess(combinedResult, function(results) {
***REMOVED***   goog.array.forEach(results, function(result) {
***REMOVED***       alert(result.getState());
***REMOVED***   });
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {...!goog.result.Result} var_args The results to wait on.
***REMOVED***
***REMOVED*** @return {!goog.result.DependentResult} A new Result whose eventual value will
***REMOVED***     be the resolved given Result objects.
***REMOVED***
goog.result.combine = function(var_args) {
 ***REMOVED*****REMOVED*** @type {!Array.<!goog.result.Result>}***REMOVED***
  var results = goog.array.clone(arguments);
  var combinedResult = new goog.result.DependentResultImpl_(results);

  var isResolved = function(res) {
    return res.getState() != goog.result.Result.State.PENDING;
 ***REMOVED*****REMOVED***

  var checkResults = function() {
    if (combinedResult.getState() == goog.result.Result.State.PENDING &&
        goog.array.every(results, isResolved)) {
      combinedResult.setValue(results);
    }
 ***REMOVED*****REMOVED***

  goog.array.forEach(results, function(result) {
    goog.result.wait(result, checkResults);
  });

  return combinedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a result that waits on all given results to resolve. Once all have
***REMOVED*** resolved, the returned result will succeed if and only if all given results
***REMOVED*** succeeded. Otherwise it will error.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED***
***REMOVED*** var result1 = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Get a second independent Result.
***REMOVED*** var result2 = xhr.getJson('testdata/xhr_test_json.data');
***REMOVED***
***REMOVED*** // Create a Result that resolves when both prior results resolve.
***REMOVED*** var combinedResult = goog.result.combineOnSuccess(result1, result2);
***REMOVED***
***REMOVED*** // Process data after successful resolution of both results.
***REMOVED*** goog.result.waitOnSuccess(combinedResult, function(results) {
***REMOVED***   var textData = results[0].getValue();
***REMOVED***   var jsonData = results[1].getValue();
***REMOVED***   assertEquals('Just some data.', textData);
***REMOVED***   assertEquals('ok', jsonData['stat']);
***REMOVED*** });
***REMOVED***
***REMOVED*** // Handle errors when either or both results failed.
***REMOVED*** goog.result.waitOnError(combinedResult, function(combined) {
***REMOVED***   var results = combined.getError();
***REMOVED***
***REMOVED***   if (results[0].getState() == goog.result.Result.State.ERROR) {
***REMOVED***     alert('result1 failed');
***REMOVED***   }
***REMOVED***
***REMOVED***   if (results[1].getState() == goog.result.Result.State.ERROR) {
***REMOVED***     alert('result2 failed');
***REMOVED***   }
***REMOVED*** });
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {...!goog.result.Result} var_args The results to wait on.
***REMOVED***
***REMOVED*** @return {!goog.result.DependentResult} A new Result whose eventual value will
***REMOVED***     be an array of values of the given Result objects.
***REMOVED***
goog.result.combineOnSuccess = function(var_args) {
  var results = goog.array.clone(arguments);
  var combinedResult = new goog.result.DependentResultImpl_(results);

  var resolvedSuccessfully = function(res) {
    return res.getState() == goog.result.Result.State.SUCCESS;
 ***REMOVED*****REMOVED***

  goog.result.wait(
      goog.result.combine.apply(goog.result.combine, results),
      // The combined result never ERRORs
      function(res) {
        var results =***REMOVED*****REMOVED*** @type {Array.<!goog.result.Result>}***REMOVED*** (
            res.getValue());
        if (goog.array.every(results, resolvedSuccessfully)) {
          combinedResult.setValue(results);
        } else {
          combinedResult.setError(results);
        }
      });

  return combinedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Given a DependentResult, cancels the Results it depends on (that is, the
***REMOVED*** results returned by getParentResults). This function does not recurse,
***REMOVED*** so e.g. parents of parents are not canceled; only the immediate parents of
***REMOVED*** the given Result are canceled.
***REMOVED***
***REMOVED*** Example using @see goog.result.combine:
***REMOVED*** <pre>
***REMOVED*** var result1 = xhr.get('testdata/xhr_test_text.data');
***REMOVED***
***REMOVED*** // Get a second independent Result.
***REMOVED*** var result2 = xhr.getJson('testdata/xhr_test_json.data');
***REMOVED***
***REMOVED*** // Create a Result that resolves when both prior results resolve.
***REMOVED*** var combinedResult = goog.result.combineOnSuccess(result1, result2);
***REMOVED***
***REMOVED*** combinedResult.wait(function() {
***REMOVED***   if (combinedResult.isCanceled()) {
***REMOVED***     goog.result.cancelParentResults(combinedResult);
***REMOVED***   }
***REMOVED*** });
***REMOVED***
***REMOVED*** // Now, canceling combinedResult will cancel both result1 and result2.
***REMOVED*** combinedResult.cancel();
***REMOVED*** </pre>
***REMOVED*** @param {!goog.result.DependentResult} dependentResult A Result that is
***REMOVED***     dependent on the values of other Results (for example the Result of a
***REMOVED***     goog.result.combine, goog.result.chain, or goog.result.transform call).
***REMOVED*** @return {boolean} True if any results were successfully canceled; otherwise
***REMOVED***     false.
***REMOVED*** TODO(user): Implement a recursive version of this that cancels all
***REMOVED*** ancestor results.
***REMOVED***
goog.result.cancelParentResults = function(dependentResult) {
  var anyCanceled = false;
  goog.array.forEach(dependentResult.getParentResults(), function(result) {
    anyCanceled |= result.cancel();
  });
  return !!anyCanceled;
***REMOVED***



***REMOVED***
***REMOVED*** A DependentResult represents a Result whose eventual value depends on the
***REMOVED*** value of one or more other Results. For example, the Result returned by
***REMOVED*** @see goog.result.chain or @see goog.result.combine is dependent on the
***REMOVED*** Results given as arguments.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.result.Result>} parentResults A list of Results that
***REMOVED***     will affect the eventual value of this Result.
***REMOVED***
***REMOVED*** @implements {goog.result.DependentResult}
***REMOVED*** @extends {goog.result.SimpleResult}
***REMOVED*** @private
***REMOVED***
goog.result.DependentResultImpl_ = function(parentResults) {
  goog.base(this);
 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of Results that will affect the eventual value of this Result.
  ***REMOVED*** @type {!Array.<!goog.result.Result>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parentResults_ = parentResults;
***REMOVED***
goog.inherits(goog.result.DependentResultImpl_, goog.result.SimpleResult);


***REMOVED***
***REMOVED*** Adds a Result to the list of Results that affect this one.
***REMOVED*** @param {!goog.result.Result} parentResult A result whose value affects the
***REMOVED***     value of this Result.
***REMOVED***
goog.result.DependentResultImpl_.prototype.addParentResult = function(
    parentResult) {
  this.parentResults_.push(parentResult);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.result.DependentResultImpl_.prototype.getParentResults = function() {
  return this.parentResults_;
***REMOVED***
