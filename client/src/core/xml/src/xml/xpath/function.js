***REMOVED***
***REMOVED*** @fileoverview An abstract class which allows
***REMOVED*** custom functions for the XPath processor.
***REMOVED***

goog.provide('xrx.xpath.Function');



***REMOVED***
***REMOVED*** A function in a function call expression.
***REMOVED***
***REMOVED***
***REMOVED*** @param {string} name Name of the function.
***REMOVED*** @param {xrx.xpath.DataType} dataType Datatype of the function return value.
***REMOVED*** @param {boolean} needContextPosition Whether the function needs a context
***REMOVED***     position.
***REMOVED*** @param {boolean} needContextNodeWithoutArgs Whether the function needs a
***REMOVED***     context node when not given arguments.
***REMOVED*** @param {boolean} needContextNodeWithArgs Whether the function needs a context
***REMOVED***     node when the function is given arguments.
***REMOVED*** @param {function(!xrx.xpath.Context, ...[!xrx.xpath.Expr]):*} evaluate
***REMOVED***     Evaluates the function in a context with any number of expression
***REMOVED***     arguments.
***REMOVED*** @param {number} minArgs Minimum number of arguments accepted by the function.
***REMOVED*** @param {?number=} opt_maxArgs Maximum number of arguments accepted by the
***REMOVED***     function; null means there is no max; defaults to minArgs.
***REMOVED*** @param {boolean=} opt_nodesetsRequired Whether the args must be nodesets.
***REMOVED*** @private
***REMOVED***
xrx.xpath.Function = function(name, returnType, needContextPosition,
    needContextNodeWithoutArgs, needContextNodeWithArgs, evaluate, minArgs,
    opt_maxArgs, opt_nodesetsRequired) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.DataType}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.returnType = returnType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.needContextPosition_ = needContextPosition;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.needContextNodeWithoutArgs_ = needContextNodeWithoutArgs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.needContextNodeWithArgs_ = needContextNodeWithArgs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {function(!xrx.xpath.Context, ...[!xrx.xpath.Expr]):*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.evaluate = evaluate;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.minArgs = minArgs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxArgs = goog.isDef(opt_maxArgs) ? opt_maxArgs : minArgs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nodesetsRequired_ = !!opt_nodesetsRequired;
***REMOVED***



xrx.xpath.Function.prototype.toString = function() {
  return this.name_;
***REMOVED***