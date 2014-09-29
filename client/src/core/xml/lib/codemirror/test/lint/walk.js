// AST walker module for Mozilla Parser API compatible trees

(function(exports) {
  "use strict";

  // A simple walk is one where you simply specify callbacks to be
  // called on specific nodes. The last two arguments are optional. A
  // simple use would be
  //
  //     walk.simple(myTree, {
  //         Expression: function(node) { ... }
  //     });
  //
  // to do something with all expressions. All Parser API node types
  // can be used to identify node types, as well as Expression,
  // Statement, and ScopeBody, which denote categories of nodes.
  //
  // The base argument can be used to pass a custom (recursive)
  // walker, and state can be used to give this walked an initial
  // state.
  exports.simple = function(node, visitors, base, state) {
    if (!base) base = exports;
    function c(node, st, override) {
      var type = override || node.type, found = visitors[type];
      if (found) found(node, st);
      base[type](node, st, c);
    }
    c(node, state);
 ***REMOVED*****REMOVED***

  // A recursive walk is one where your functions override the default
  // walkers. They can modify and replace the state parameter that's
  // threaded through the walk, and can opt how and whether to walk
  // their child nodes (by calling their third argument on these
  // nodes).
  exports.recursive = function(node, state, funcs, base) {
    var visitor = exports.make(funcs, base);
    function c(node, st, override) {
      visitor[override || node.type](node, st, c);
    }
    c(node, state);
 ***REMOVED*****REMOVED***

  // Used to create a custom walker. Will fill in all missing node
  // type properties with the defaults.
  exports.make = function(funcs, base) {
    if (!base) base = exports;
    var visitor = {***REMOVED***
    for (var type in base)
      visitor[type] = funcs.hasOwnProperty(type) ? funcs[type] : base[type];
    return visitor;
 ***REMOVED*****REMOVED***

  function skipThrough(node, st, c) { c(node, st); }
  function ignore(node, st, c) {}

  // Node walkers.

  exports.Program = exports.BlockStatement = function(node, st, c) {
    for (var i = 0; i < node.body.length; ++i)
      c(node.body[i], st, "Statement");
 ***REMOVED*****REMOVED***
  exports.Statement = skipThrough;
  exports.EmptyStatement = ignore;
  exports.ExpressionStatement = function(node, st, c) {
    c(node.expression, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.IfStatement = function(node, st, c) {
    c(node.test, st, "Expression");
    c(node.consequent, st, "Statement");
    if (node.alternate) c(node.alternate, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.LabeledStatement = function(node, st, c) {
    c(node.body, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.BreakStatement = exports.ContinueStatement = ignore;
  exports.WithStatement = function(node, st, c) {
    c(node.object, st, "Expression");
    c(node.body, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.SwitchStatement = function(node, st, c) {
    c(node.discriminant, st, "Expression");
    for (var i = 0; i < node.cases.length; ++i) {
      var cs = node.cases[i];
      if (cs.test) c(cs.test, st, "Expression");
      for (var j = 0; j < cs.consequent.length; ++j)
        c(cs.consequent[j], st, "Statement");
    }
 ***REMOVED*****REMOVED***
  exports.ReturnStatement = function(node, st, c) {
    if (node.argument) c(node.argument, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.ThrowStatement = function(node, st, c) {
    c(node.argument, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.TryStatement = function(node, st, c) {
    c(node.block, st, "Statement");
    for (var i = 0; i < node.handlers.length; ++i)
      c(node.handlers[i].body, st, "ScopeBody");
    if (node.finalizer) c(node.finalizer, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.WhileStatement = function(node, st, c) {
    c(node.test, st, "Expression");
    c(node.body, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.DoWhileStatement = exports.WhileStatement;
  exports.ForStatement = function(node, st, c) {
    if (node.init) c(node.init, st, "ForInit");
    if (node.test) c(node.test, st, "Expression");
    if (node.update) c(node.update, st, "Expression");
    c(node.body, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.ForInStatement = function(node, st, c) {
    c(node.left, st, "ForInit");
    c(node.right, st, "Expression");
    c(node.body, st, "Statement");
 ***REMOVED*****REMOVED***
  exports.ForInit = function(node, st, c) {
    if (node.type == "VariableDeclaration") c(node, st);
    else c(node, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.DebuggerStatement = ignore;

  exports.FunctionDeclaration = function(node, st, c) {
    c(node, st, "Function");
 ***REMOVED*****REMOVED***
  exports.VariableDeclaration = function(node, st, c) {
    for (var i = 0; i < node.declarations.length; ++i) {
      var decl = node.declarations[i];
      if (decl.init) c(decl.init, st, "Expression");
    }
 ***REMOVED*****REMOVED***

  exports.Function = function(node, st, c) {
    c(node.body, st, "ScopeBody");
 ***REMOVED*****REMOVED***
  exports.ScopeBody = function(node, st, c) {
    c(node, st, "Statement");
 ***REMOVED*****REMOVED***

  exports.Expression = skipThrough;
  exports.ThisExpression = ignore;
  exports.ArrayExpression = function(node, st, c) {
    for (var i = 0; i < node.elements.length; ++i) {
      var elt = node.elements[i];
      if (elt) c(elt, st, "Expression");
    }
 ***REMOVED*****REMOVED***
  exports.ObjectExpression = function(node, st, c) {
    for (var i = 0; i < node.properties.length; ++i)
      c(node.properties[i].value, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.FunctionExpression = exports.FunctionDeclaration;
  exports.SequenceExpression = function(node, st, c) {
    for (var i = 0; i < node.expressions.length; ++i)
      c(node.expressions[i], st, "Expression");
 ***REMOVED*****REMOVED***
  exports.UnaryExpression = exports.UpdateExpression = function(node, st, c) {
    c(node.argument, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.BinaryExpression = exports.AssignmentExpression = exports.LogicalExpression = function(node, st, c) {
    c(node.left, st, "Expression");
    c(node.right, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.ConditionalExpression = function(node, st, c) {
    c(node.test, st, "Expression");
    c(node.consequent, st, "Expression");
    c(node.alternate, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.NewExpression = exports.CallExpression = function(node, st, c) {
    c(node.callee, st, "Expression");
    if (node.arguments) for (var i = 0; i < node.arguments.length; ++i)
      c(node.arguments[i], st, "Expression");
 ***REMOVED*****REMOVED***
  exports.MemberExpression = function(node, st, c) {
    c(node.object, st, "Expression");
    if (node.computed) c(node.property, st, "Expression");
 ***REMOVED*****REMOVED***
  exports.Identifier = exports.Literal = ignore;

  // A custom walker that keeps track of the scope chain and the
  // variables defined in it.
  function makeScope(prev) {
    return {vars: Object.create(null), prev: prev***REMOVED***
  }
  exports.scopeVisitor = exports.make({
    Function: function(node, scope, c) {
      var inner = makeScope(scope);
      for (var i = 0; i < node.params.length; ++i)
        inner.vars[node.params[i].name] = {type: "argument", node: node.params[i]***REMOVED***
      if (node.id) {
        var decl = node.type == "FunctionDeclaration";
        (decl ? scope : inner).vars[node.id.name] =
          {type: decl ? "function" : "function name", node: node.id***REMOVED***
      }
      c(node.body, inner, "ScopeBody");
    },
    TryStatement: function(node, scope, c) {
      c(node.block, scope, "Statement");
      for (var i = 0; i < node.handlers.length; ++i) {
        var handler = node.handlers[i], inner = makeScope(scope);
        inner.vars[handler.param.name] = {type: "catch clause", node: handler.param***REMOVED***
        c(handler.body, inner, "ScopeBody");
      }
      if (node.finalizer) c(node.finalizer, scope, "Statement");
    },
    VariableDeclaration: function(node, scope, c) {
      for (var i = 0; i < node.declarations.length; ++i) {
        var decl = node.declarations[i];
        scope.vars[decl.id.name] = {type: "var", node: decl.id***REMOVED***
        if (decl.init) c(decl.init, scope, "Expression");
      }
    }
  });

})(typeof exports == "undefined" ? acorn.walk = {} : exports);
