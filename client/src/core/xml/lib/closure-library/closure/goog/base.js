// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Bootstrap for the Google JS Library (Closure).
***REMOVED***
***REMOVED*** In uncompiled mode base.js will write out Closure's deps file, unless the
***REMOVED*** global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
***REMOVED*** include their own deps file(s) from different locations.
***REMOVED***
***REMOVED***
***REMOVED*** @provideGoog
***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Overridden to true by the compiler when --closure_pass
***REMOVED***     or --mark_as_compiled is specified.
***REMOVED***
var COMPILED = false;


***REMOVED***
***REMOVED*** Base namespace for the Closure library.  Checks to see goog is
***REMOVED*** already defined in the current scope before assigning to prevent
***REMOVED*** clobbering if base.js is loaded more than once.
***REMOVED***
***REMOVED*** @const
***REMOVED***
var goog = goog || {***REMOVED*** // Identifies this file as the Closure base.


***REMOVED***
***REMOVED*** Reference to the global context.  In most cases this will be 'window'.
***REMOVED***
goog.global = this;


***REMOVED***
***REMOVED*** @define {boolean} DEBUG is provided as a convenience so that debugging code
***REMOVED*** that should not be included in a production js_binary can be easily stripped
***REMOVED*** by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
***REMOVED*** toString() methods should be declared inside an "if (goog.DEBUG)" conditional
***REMOVED*** because they are generally used for debugging purposes and it is difficult
***REMOVED*** for the JSCompiler to statically determine whether they are used.
***REMOVED***
goog.DEBUG = true;


***REMOVED***
***REMOVED*** @define {string} LOCALE defines the locale being used for compilation. It is
***REMOVED*** used to select locale specific data to be compiled in js binary. BUILD rule
***REMOVED*** can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
***REMOVED*** option.
***REMOVED***
***REMOVED*** Take into account that the locale code format is important. You should use
***REMOVED*** the canonical Unicode format with hyphen as a delimiter. Language must be
***REMOVED*** lowercase, Language Script - Capitalized, Region - UPPERCASE.
***REMOVED*** There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
***REMOVED***
***REMOVED*** See more info about locale codes here:
***REMOVED*** http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
***REMOVED***
***REMOVED*** For language codes you should use values defined by ISO 693-1. See it here
***REMOVED*** http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
***REMOVED*** this rule: the Hebrew language. For legacy reasons the old code (iw) should
***REMOVED*** be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
***REMOVED***
goog.LOCALE = 'en';  // default to en


***REMOVED***
***REMOVED*** @define {boolean} Whether this code is running on trusted sites.
***REMOVED***
***REMOVED*** On untrusted sites, several native functions can be defined or overridden by
***REMOVED*** external libraries like Prototype, Datejs, and JQuery and setting this flag
***REMOVED*** to false forces closure to use its own implementations when possible.
***REMOVED***
***REMOVED*** If your javascript can be loaded by a third party site and you are wary about
***REMOVED*** relying on non-standard implementations, specify
***REMOVED*** "--define goog.TRUSTED_SITE=false" to the JSCompiler.
***REMOVED***
goog.TRUSTED_SITE = true;


***REMOVED***
***REMOVED*** Creates object stubs for a namespace.  The presence of one or more
***REMOVED*** goog.provide() calls indicate that the file defines the given
***REMOVED*** objects/namespaces.  Build tools also scan for provide/require statements
***REMOVED*** to discern dependencies, build dependency files (see deps.js), etc.
***REMOVED*** @see goog.require
***REMOVED*** @param {string} name Namespace provided by this file in the form
***REMOVED***     "goog.package.part".
***REMOVED***
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice. This is intended
    // to teach new developers that 'goog.provide' is effectively a variable
    // declaration. And when JSCompiler transforms goog.provide into a real
    // variable declaration, the compiled JS should work the same as the raw
    // JS--even when the raw JS uses goog.provide incorrectly.
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name);
***REMOVED***


***REMOVED***
***REMOVED*** Marks that the current file should only be used for testing, and never for
***REMOVED*** live code in production.
***REMOVED*** @param {string=} opt_message Optional message to add to the error that's
***REMOVED***     raised when used in production code.
***REMOVED***
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
***REMOVED***


if (!COMPILED) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Check if the given name has been goog.provided. This will return false for
  ***REMOVED*** names that are available only as implicit namespaces.
  ***REMOVED*** @param {string} name name of the object to look for.
  ***REMOVED*** @return {boolean} Whether the name has been provided.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Namespaces implicitly defined by goog.provide. For example,
  ***REMOVED*** goog.provide('goog.events.Event') implicitly declares
  ***REMOVED*** that 'goog' and 'goog.events' must be namespaces.
  ***REMOVED***
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.implicitNamespaces_ = {***REMOVED***
}


***REMOVED***
***REMOVED*** Builds an object structure for the provided namespace path,
***REMOVED*** ensuring that names that already exist are not overwritten. For
***REMOVED*** example:
***REMOVED*** "a.b.c" -> a = {***REMOVED***a.b={***REMOVED***a.b.c={***REMOVED***
***REMOVED*** Used by goog.provide and goog.exportSymbol.
***REMOVED*** @param {string} name name of the object that this file defines.
***REMOVED*** @param {*=} opt_object the object to expose at the end of the path.
***REMOVED*** @param {Object=} opt_objectToExportTo The object to add the path to; default
***REMOVED***     is |goog.global|.
***REMOVED*** @private
***REMOVED***
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {***REMOVED***
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns an object based on its fully qualified external name.  If you are
***REMOVED*** using a compilation pass that renames property names beware that using this
***REMOVED*** function will not find renamed properties.
***REMOVED***
***REMOVED*** @param {string} name The fully qualified name.
***REMOVED*** @param {Object=} opt_obj The object within which to look; default is
***REMOVED***     |goog.global|.
***REMOVED*** @return {?} The value (object or primitive) or, if not found, null.
***REMOVED***
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
***REMOVED***


***REMOVED***
***REMOVED*** Globalizes a whole namespace, such as goog or goog.lang.
***REMOVED***
***REMOVED*** @param {Object} obj The namespace to globalize.
***REMOVED*** @param {Object=} opt_global The object to add the properties to.
***REMOVED*** @deprecated Properties may be explicitly exported to the global scope, but
***REMOVED***     this should no longer be done in bulk.
***REMOVED***
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a dependency from a file to the files it requires.
***REMOVED*** @param {string} relPath The path to the js file.
***REMOVED*** @param {Array} provides An array of strings with the names of the objects
***REMOVED***                         this file provides.
***REMOVED*** @param {Array} requires An array of strings with the names of the objects
***REMOVED***                         this file requires.
***REMOVED***
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {***REMOVED***
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {***REMOVED***
      }
      deps.requires[path][require] = true;
    }
  }
***REMOVED***




// NOTE(nnaze): The debug DOM loader was included in base.js as an orignal
// way to do "debug-mode" development.  The dependency system can sometimes
// be confusing, as can the debug DOM loader's asyncronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the
// script will not load until some point after the current script.  If a
// namespace is needed at runtime, it needs to be defined in a previous
// script, or loaded via require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// http://code.google.com/closure/library/docs/depswriter.html
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


***REMOVED***
***REMOVED*** @define {boolean} Whether to enable the debug loader.
***REMOVED***
***REMOVED*** If enabled, a call to goog.require() will attempt to load the namespace by
***REMOVED*** appending a script tag to the DOM (if the namespace has been registered).
***REMOVED***
***REMOVED*** If disabled, goog.require() will simply assert that the namespace has been
***REMOVED*** provided (and depend on the fact that some outside tool correctly ordered
***REMOVED*** the script).
***REMOVED***
goog.ENABLE_DEBUG_LOADER = true;


***REMOVED***
***REMOVED*** Implements a system for the dynamic resolution of dependencies
***REMOVED*** that works in parallel with the BUILD system. Note that all calls
***REMOVED*** to goog.require will be stripped by the JSCompiler when the
***REMOVED*** --closure_pass option is used.
***REMOVED*** @see goog.provide
***REMOVED*** @param {string} name Namespace to include (as was given in goog.provide())
***REMOVED***     in the form "goog.package.part".
***REMOVED***
goog.require = function(name) {

  // if the object already exists we do not need do do anything
  // TODO(arv): If we start to support require based on file name this has
  //            to change
  // TODO(arv): If we allow goog.foo.* this has to change
  // TODO(arv): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }


      throw Error(errorMessage);

  }
***REMOVED***


***REMOVED***
***REMOVED*** Path for included scripts
***REMOVED*** @type {string}
***REMOVED***
goog.basePath = '';


***REMOVED***
***REMOVED*** A hook for overriding the base path.
***REMOVED*** @type {string|undefined}
***REMOVED***
goog.global.CLOSURE_BASE_PATH;


***REMOVED***
***REMOVED*** Whether to write out Closure's deps file. By default,
***REMOVED*** the deps are written.
***REMOVED*** @type {boolean|undefined}
***REMOVED***
goog.global.CLOSURE_NO_DEPS;


***REMOVED***
***REMOVED*** A function to import a single script. This is meant to be overridden when
***REMOVED*** Closure is being run in non-HTML contexts, such as web workers. It's defined
***REMOVED*** in the global scope so that it can be set before base.js is loaded, which
***REMOVED*** allows deps.js to be imported properly.
***REMOVED***
***REMOVED*** The function is passed the script source, which is a relative URI. It should
***REMOVED*** return true if the script was imported, false otherwise.
***REMOVED***
goog.global.CLOSURE_IMPORT_SCRIPT;


***REMOVED***
***REMOVED*** Null function used for default values of callbacks, etc.
***REMOVED*** @return {void} Nothing.
***REMOVED***
goog.nullFunction = function() {***REMOVED***


***REMOVED***
***REMOVED*** The identity function. Returns its first argument.
***REMOVED***
***REMOVED*** @param {*=} opt_returnValue The single value that will be returned.
***REMOVED*** @param {...*} var_args Optional trailing arguments. These are ignored.
***REMOVED*** @return {?} The first argument. We can't know the type -- just pass it along
***REMOVED***      without type.
***REMOVED*** @deprecated Use goog.functions.identity instead.
***REMOVED***
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
***REMOVED***


***REMOVED***
***REMOVED*** When defining a class Foo with an abstract method bar(), you can do:
***REMOVED***
***REMOVED*** Foo.prototype.bar = goog.abstractMethod
***REMOVED***
***REMOVED*** Now if a subclass of Foo fails to override bar(), an error
***REMOVED*** will be thrown when bar() is invoked.
***REMOVED***
***REMOVED*** Note: This does not take the name of the function to override as
***REMOVED*** an argument because that would make it more difficult to obfuscate
***REMOVED*** our JavaScript code.
***REMOVED***
***REMOVED*** @type {!Function}
***REMOVED*** @throws {Error} when invoked to indicate the method should be
***REMOVED***   overridden.
***REMOVED***
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
***REMOVED***


***REMOVED***
***REMOVED*** Adds a {@code getInstance} static method that always return the same instance
***REMOVED*** object.
***REMOVED*** @param {!Function} ctor The constructor for the class to add the static
***REMOVED***     method to.
***REMOVED***
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** All singleton classes that have been instantiated, for testing. Don't read
***REMOVED*** it directly, use the {@code goog.testing.singleton} module. The compiler
***REMOVED*** removes this variable if unused.
***REMOVED*** @type {!Array.<!Function>}
***REMOVED*** @private
***REMOVED***
goog.instantiatedSingletons_ = [];


if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Object used to keep track of urls that have already been added. This
  ***REMOVED*** record allows the prevention of circular dependencies.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.included_ = {***REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** This object is used to keep track of dependencies and other data that is
  ***REMOVED*** used for loading scripts
  ***REMOVED*** @private
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    // used when resolving dependencies to prevent us from
    // visiting the file twice
    visited: {},
    written: {} // used to keep track of script files we have written
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Tries to detect whether is in the context of an HTML document.
  ***REMOVED*** @return {boolean} True if it looks like HTML document.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;  // XULDocument misses write.
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Tries to detect the base path of the base.js script that bootstraps Closure
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Imports a script if, and only if, that script hasn't already been imported.
  ***REMOVED*** (Must be called at execution time)
  ***REMOVED*** @param {string} src Script source.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** The default implementation of the import function. Writes a script tag to
  ***REMOVED*** import the script.
  ***REMOVED***
  ***REMOVED*** @param {string} src The script source.
  ***REMOVED*** @return {boolean} True if the script was imported, false otherwise.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;

      // If the user tries to require a new symbol after document load,
      // something has gone terribly wrong. Doing a document.write would
      // wipe out the page.
      if (doc.readyState == 'complete') {
        // Certain test frameworks load base.js multiple times, which tries
        // to write deps.js each time. If that happens, just fail silently.
        // These frameworks wipe the page between each load of base.js, so this
        // is OK.
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }

      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Resolves dependencies based on the dependencies added using addDependency
  ***REMOVED*** and calls importScript_ in the correct order.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = [];
    var seenScript = {***REMOVED***
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
 ***REMOVED*****REMOVED***


 ***REMOVED*****REMOVED***
  ***REMOVED*** Looks at the dependency rules and tries to determine the script file that
  ***REMOVED*** fulfills a particular rule.
  ***REMOVED*** @param {string} rule In the form goog.namespace.Class or project.script.
  ***REMOVED*** @return {?string} Url corresponding to the rule, or null.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
 ***REMOVED*****REMOVED***

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}



//==============================================================================
// Language Enhancements
//==============================================================================


***REMOVED***
***REMOVED*** This is a "fixed" version of the typeof operator.  It differs from the typeof
***REMOVED*** operator in such a way that null returns 'null' and arrays return 'array'.
***REMOVED*** @param {*} value The value to get the type of.
***REMOVED*** @return {string} The name of the type.
***REMOVED***
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
         ***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is not |undefined|.
***REMOVED*** WARNING: Do not use this to test if an object has a property. Use the in
***REMOVED*** operator instead.  Additionally, this function assumes that the global
***REMOVED*** undefined variable has not been redefined.
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is defined.
***REMOVED***
goog.isDef = function(val) {
  return val !== undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is |null|
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is null.
***REMOVED***
goog.isNull = function(val) {
  return val === null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is defined and not null
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is defined and not null.
***REMOVED***
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is an array
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is an array.
***REMOVED***
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the object looks like an array. To qualify as array like
***REMOVED*** the value needs to be either a NodeList or an object with a Number length
***REMOVED*** property.
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is an array.
***REMOVED***
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the object looks like a Date. To qualify as Date-like
***REMOVED*** the value needs to be an object and have a getFullYear() function.
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is a like a Date.
***REMOVED***
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is a string
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is a string.
***REMOVED***
goog.isString = function(val) {
  return typeof val == 'string';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is a boolean
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is boolean.
***REMOVED***
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is a number
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is a number.
***REMOVED***
goog.isNumber = function(val) {
  return typeof val == 'number';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is a function
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is a function.
***REMOVED***
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the specified value is an object.  This includes arrays
***REMOVED*** and functions.
***REMOVED*** @param {*} val Variable to test.
***REMOVED*** @return {boolean} Whether variable is an object.
***REMOVED***
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
***REMOVED***


***REMOVED***
***REMOVED*** Gets a unique ID for an object. This mutates the object so that further
***REMOVED*** calls with the same object as a parameter returns the same value. The unique
***REMOVED*** ID is guaranteed to be unique across the current session amongst objects that
***REMOVED*** are passed into {@code getUid}. There is no guarantee that the ID is unique
***REMOVED*** or consistent across sessions. It is unsafe to generate unique ID for
***REMOVED*** function prototypes.
***REMOVED***
***REMOVED*** @param {Object} obj The object to get the unique ID for.
***REMOVED*** @return {number} The unique ID for the object.
***REMOVED***
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the unique ID from an object. This is useful if the object was
***REMOVED*** previously mutated using {@code goog.getUid} in which case the mutation is
***REMOVED*** undone.
***REMOVED*** @param {Object} obj The object to remove the unique ID field from.
***REMOVED***
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // DOM nodes in IE are not instance of Object and throws exception
  // for delete. Instead we try to use removeAttribute
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
***REMOVED***


***REMOVED***
***REMOVED*** Name for unique ID property. Initialized in a way to help avoid collisions
***REMOVED*** with other closure javascript on the same page.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.UID_PROPERTY_ = 'closure_uid_' + ((Math.random()***REMOVED*** 1e9) >>> 0);


***REMOVED***
***REMOVED*** Counter for UID.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.uidCounter_ = 0;


***REMOVED***
***REMOVED*** Adds a hash code field to an object. The hash code is unique for the
***REMOVED*** given object.
***REMOVED*** @param {Object} obj The object to get the hash code for.
***REMOVED*** @return {number} The hash code for the object.
***REMOVED*** @deprecated Use goog.getUid instead.
***REMOVED***
goog.getHashCode = goog.getUid;


***REMOVED***
***REMOVED*** Removes the hash code field from an object.
***REMOVED*** @param {Object} obj The object to remove the field from.
***REMOVED*** @deprecated Use goog.removeUid instead.
***REMOVED***
goog.removeHashCode = goog.removeUid;


***REMOVED***
***REMOVED*** Clones a value. The input may be an Object, Array, or basic type. Objects and
***REMOVED*** arrays will be cloned recursively.
***REMOVED***
***REMOVED*** WARNINGS:
***REMOVED*** <code>goog.cloneObject</code> does not detect reference loops. Objects that
***REMOVED*** refer to themselves will cause infinite recursion.
***REMOVED***
***REMOVED*** <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
***REMOVED*** UIDs created by <code>getUid</code> into cloned results.
***REMOVED***
***REMOVED*** @param {*} obj The value to clone.
***REMOVED*** @return {*} A clone of the input value.
***REMOVED*** @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
***REMOVED***
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {***REMOVED***
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** A native implementation of goog.bind.
***REMOVED*** @param {Function} fn A function to partially apply.
***REMOVED*** @param {Object|undefined} selfObj Specifies the object which |this| should
***REMOVED***     point to when the function is run.
***REMOVED*** @param {...*} var_args Additional arguments that are partially
***REMOVED***     applied to the function.
***REMOVED*** @return {!Function} A partially-applied form of the function bind() was
***REMOVED***     invoked as a method of.
***REMOVED*** @private
***REMOVED*** @suppress {deprecated} The compiler thinks that Function.prototype.bind
***REMOVED***     is deprecated because some people have declared a pure-JS version.
***REMOVED***     Only the pure-JS version is truly deprecated.
***REMOVED***
goog.bindNative_ = function(fn, selfObj, var_args) {
  return***REMOVED*****REMOVED*** @type {!Function}***REMOVED*** (fn.call.apply(fn.bind, arguments));
***REMOVED***


***REMOVED***
***REMOVED*** A pure-JS implementation of goog.bind.
***REMOVED*** @param {Function} fn A function to partially apply.
***REMOVED*** @param {Object|undefined} selfObj Specifies the object which |this| should
***REMOVED***     point to when the function is run.
***REMOVED*** @param {...*} var_args Additional arguments that are partially
***REMOVED***     applied to the function.
***REMOVED*** @return {!Function} A partially-applied form of the function bind() was
***REMOVED***     invoked as a method of.
***REMOVED*** @private
***REMOVED***
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
   ***REMOVED*****REMOVED***

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
   ***REMOVED*****REMOVED***
  }
***REMOVED***


***REMOVED***
***REMOVED*** Partially applies this function to a particular 'this object' and zero or
***REMOVED*** more arguments. The result is a new function with some arguments of the first
***REMOVED*** function pre-filled and the value of |this| 'pre-specified'.<br><br>
***REMOVED***
***REMOVED*** Remaining arguments specified at call-time are appended to the pre-
***REMOVED*** specified ones.<br><br>
***REMOVED***
***REMOVED*** Also see: {@link #partial}.<br><br>
***REMOVED***
***REMOVED*** Usage:
***REMOVED*** <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
***REMOVED*** barMethBound('arg3', 'arg4');</pre>
***REMOVED***
***REMOVED*** @param {Function} fn A function to partially apply.
***REMOVED*** @param {Object|undefined} selfObj Specifies the object which |this| should
***REMOVED***     point to when the function is run.
***REMOVED*** @param {...*} var_args Additional arguments that are partially
***REMOVED***     applied to the function.
***REMOVED*** @return {!Function} A partially-applied form of the function bind() was
***REMOVED***     invoked as a method of.
***REMOVED*** @suppress {deprecated} See above.
***REMOVED***
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default
      // Chrome extension environment. This means that for Chrome extensions,
      // they get the implementation of Function.prototype.bind that
      // calls goog.bind instead of the native one. Even worse, we don't want
      // to introduce a circular dependency between goog.bind and
      // Function.prototype.bind, so we have to hack this to make sure it
      // works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Like bind(), except that a 'this object' is not required. Useful when the
***REMOVED*** target function is already bound.
***REMOVED***
***REMOVED*** Usage:
***REMOVED*** var g = partial(f, arg1, arg2);
***REMOVED*** g(arg3, arg4);
***REMOVED***
***REMOVED*** @param {Function} fn A function to partially apply.
***REMOVED*** @param {...*} var_args Additional arguments that are partially
***REMOVED***     applied to fn.
***REMOVED*** @return {!Function} A partially-applied form of the function bind() was
***REMOVED***     invoked as a method of.
***REMOVED***
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Copies all the members of a source object to a target object. This method
***REMOVED*** does not work on all browsers for all objects that contain keys such as
***REMOVED*** toString or hasOwnProperty. Use goog.object.extend for this purpose.
***REMOVED*** @param {Object} target Target.
***REMOVED*** @param {Object} source Source.
***REMOVED***
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} An integer value representing the number of milliseconds
***REMOVED***     between midnight, January 1, 1970 and the current time.
***REMOVED***
goog.now = (goog.TRUSTED_SITE && Date.now) || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


***REMOVED***
***REMOVED*** Evals javascript in the global scope.  In IE this uses execScript, other
***REMOVED*** browsers use goog.global.eval. If goog.global.eval does not evaluate in the
***REMOVED*** global scope (for example, in Safari), appends a script tag instead.
***REMOVED*** Throws an exception if neither execScript or eval is defined.
***REMOVED*** @param {string} script JavaScript string.
***REMOVED***
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Indicates whether or not we can call 'eval' directly to eval code in the
***REMOVED*** global scope. Set to a Boolean by the first call to goog.globalEval (which
***REMOVED*** empirically tests whether eval works for globals). @see goog.globalEval
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.evalWorksForGlobals_ = null;


***REMOVED***
***REMOVED*** Optional map of CSS class names to obfuscated names used with
***REMOVED*** goog.getCssName().
***REMOVED*** @type {Object|undefined}
***REMOVED*** @private
***REMOVED*** @see goog.setCssNameMapping
***REMOVED***
goog.cssNameMapping_;


***REMOVED***
***REMOVED*** Optional obfuscation style for CSS class names. Should be set to either
***REMOVED*** 'BY_WHOLE' or 'BY_PART' if defined.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED*** @see goog.setCssNameMapping
***REMOVED***
goog.cssNameMappingStyle_;


***REMOVED***
***REMOVED*** Handles strings that are intended to be used as CSS class names.
***REMOVED***
***REMOVED*** This function works in tandem with @see goog.setCssNameMapping.
***REMOVED***
***REMOVED*** Without any mapping set, the arguments are simple joined with a
***REMOVED*** hyphen and passed through unaltered.
***REMOVED***
***REMOVED*** When there is a mapping, there are two possible styles in which
***REMOVED*** these mappings are used. In the BY_PART style, each part (i.e. in
***REMOVED*** between hyphens) of the passed in css name is rewritten according
***REMOVED*** to the map. In the BY_WHOLE style, the full css name is looked up in
***REMOVED*** the map directly. If a rewrite is not specified by the map, the
***REMOVED*** compiler will output a warning.
***REMOVED***
***REMOVED*** When the mapping is passed to the compiler, it will replace calls
***REMOVED*** to goog.getCssName with the strings from the mapping, e.g.
***REMOVED***     var x = goog.getCssName('foo');
***REMOVED***     var y = goog.getCssName(this.baseClass, 'active');
***REMOVED***  becomes:
***REMOVED***     var x= 'foo';
***REMOVED***     var y = this.baseClass + '-active';
***REMOVED***
***REMOVED*** If one argument is passed it will be processed, if two are passed
***REMOVED*** only the modifier will be processed, as it is assumed the first
***REMOVED*** argument was generated as a result of calling goog.getCssName.
***REMOVED***
***REMOVED*** @param {string} className The class name.
***REMOVED*** @param {string=} opt_modifier A modifier to be appended to the class name.
***REMOVED*** @return {string} The class name or the concatenation of the class name and
***REMOVED***     the modifier.
***REMOVED***
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
 ***REMOVED*****REMOVED***

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
 ***REMOVED*****REMOVED***

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
   ***REMOVED*****REMOVED***
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the map to check when returning a value from goog.getCssName(). Example:
***REMOVED*** <pre>
***REMOVED*** goog.setCssNameMapping({
***REMOVED***   "goog": "a",
***REMOVED***   "disabled": "b",
***REMOVED*** });
***REMOVED***
***REMOVED*** var x = goog.getCssName('goog');
***REMOVED*** // The following evaluates to: "a a-b".
***REMOVED*** goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
***REMOVED*** </pre>
***REMOVED*** When declared as a map of string literals to string literals, the JSCompiler
***REMOVED*** will replace all calls to goog.getCssName() using the supplied map if the
***REMOVED*** --closure_pass flag is set.
***REMOVED***
***REMOVED*** @param {!Object} mapping A map of strings to strings where keys are possible
***REMOVED***     arguments to goog.getCssName() and values are the corresponding values
***REMOVED***     that should be returned.
***REMOVED*** @param {string=} opt_style The style of css name mapping. There are two valid
***REMOVED***     options: 'BY_PART', and 'BY_WHOLE'.
***REMOVED*** @see goog.getCssName for a description.
***REMOVED***
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
***REMOVED***


***REMOVED***
***REMOVED*** To use CSS renaming in compiled mode, one of the input files should have a
***REMOVED*** call to goog.setCssNameMapping() with an object literal that the JSCompiler
***REMOVED*** can extract and use to replace all calls to goog.getCssName(). In uncompiled
***REMOVED*** mode, JavaScript code should be loaded before this base.js file that declares
***REMOVED*** a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
***REMOVED*** to ensure that the mapping is loaded before any calls to goog.getCssName()
***REMOVED*** are made in uncompiled mode.
***REMOVED***
***REMOVED*** A hook for overriding the CSS name mapping.
***REMOVED*** @type {Object|undefined}
***REMOVED***
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


***REMOVED***
***REMOVED*** Gets a localized message.
***REMOVED***
***REMOVED*** This function is a compiler primitive. If you give the compiler a localized
***REMOVED*** message bundle, it will replace the string at compile-time with a localized
***REMOVED*** version, and expand goog.getMsg call to a concatenated string.
***REMOVED***
***REMOVED*** Messages must be initialized in the form:
***REMOVED*** <code>
***REMOVED*** var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
***REMOVED*** </code>
***REMOVED***
***REMOVED*** @param {string} str Translatable string, places holders in the form {$foo}.
***REMOVED*** @param {Object=} opt_values Map of place holder name to value.
***REMOVED*** @return {string} message with placeholders filled.
***REMOVED***
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {***REMOVED***
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a localized message. If the message does not have a translation, gives a
***REMOVED*** fallback message.
***REMOVED***
***REMOVED*** This is useful when introducing a new message that has not yet been
***REMOVED*** translated into all languages.
***REMOVED***
***REMOVED*** This function is a compiler primtive. Must be used in the form:
***REMOVED*** <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
***REMOVED*** where MSG_A and MSG_B were initialized with goog.getMsg.
***REMOVED***
***REMOVED*** @param {string} a The preferred message.
***REMOVED*** @param {string} b The fallback message.
***REMOVED*** @return {string} The best translated message.
***REMOVED***
goog.getMsgWithFallback = function(a, b) {
  return a;
***REMOVED***


***REMOVED***
***REMOVED*** Exposes an unobfuscated global namespace path for the given object.
***REMOVED*** Note that fields of the exported object***REMOVED***will* be obfuscated,
***REMOVED*** unless they are exported in turn via this function or
***REMOVED*** goog.exportProperty
***REMOVED***
***REMOVED*** <p>Also handy for making public items that are defined in anonymous
***REMOVED*** closures.
***REMOVED***
***REMOVED*** ex. goog.exportSymbol('public.path.Foo', Foo);
***REMOVED***
***REMOVED*** ex. goog.exportSymbol('public.path.Foo.staticFunction',
***REMOVED***                       Foo.staticFunction);
***REMOVED***     public.path.Foo.staticFunction();
***REMOVED***
***REMOVED*** ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
***REMOVED***                       Foo.prototype.myMethod);
***REMOVED***     new public.path.Foo().myMethod();
***REMOVED***
***REMOVED*** @param {string} publicPath Unobfuscated name to export.
***REMOVED*** @param {*} object Object the name should point to.
***REMOVED*** @param {Object=} opt_objectToExportTo The object to add the path to; default
***REMOVED***     is |goog.global|.
***REMOVED***
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
***REMOVED***


***REMOVED***
***REMOVED*** Exports a property unobfuscated into the object's namespace.
***REMOVED*** ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
***REMOVED*** ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
***REMOVED*** @param {Object} object Object whose static property is being exported.
***REMOVED*** @param {string} publicName Unobfuscated name to export.
***REMOVED*** @param {*} symbol Object the name should point to.
***REMOVED***
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
***REMOVED***


***REMOVED***
***REMOVED*** Inherit the prototype methods from one constructor into another.
***REMOVED***
***REMOVED*** Usage:
***REMOVED*** <pre>
***REMOVED*** function ParentClass(a, b) { }
***REMOVED*** ParentClass.prototype.foo = function(a) { }
***REMOVED***
***REMOVED*** function ChildClass(a, b, c) {
***REMOVED***   goog.base(this, a, b);
***REMOVED*** }
***REMOVED*** goog.inherits(ChildClass, ParentClass);
***REMOVED***
***REMOVED*** var child = new ChildClass('a', 'b', 'see');
***REMOVED*** child.foo(); // works
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** In addition, a superclass' implementation of a method can be invoked
***REMOVED*** as follows:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** ChildClass.prototype.foo = function(a) {
***REMOVED***   ChildClass.superClass_.foo.call(this, a);
***REMOVED***   // other code
***REMOVED******REMOVED*****REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {Function} childCtor Child class.
***REMOVED*** @param {Function} parentCtor Parent class.
***REMOVED***
goog.inherits = function(childCtor, parentCtor) {
 ***REMOVED*****REMOVED*** @constructor***REMOVED***
  function tempCtor() {***REMOVED***
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
 ***REMOVED*****REMOVED*** @override***REMOVED***
  childCtor.prototype.constructor = childCtor;
***REMOVED***


***REMOVED***
***REMOVED*** Call up to the superclass.
***REMOVED***
***REMOVED*** If this is called from a constructor, then this calls the superclass
***REMOVED*** contructor with arguments 1-N.
***REMOVED***
***REMOVED*** If this is called from a prototype method, then you must pass
***REMOVED*** the name of the method as the second argument to this function. If
***REMOVED*** you do not, you will get a runtime error. This calls the superclass'
***REMOVED*** method with arguments 2-N.
***REMOVED***
***REMOVED*** This function only works if you use goog.inherits to express
***REMOVED*** inheritance relationships between your classes.
***REMOVED***
***REMOVED*** This function is a compiler primitive. At compile-time, the
***REMOVED*** compiler will do macro expansion to remove a lot of
***REMOVED*** the extra overhead that this function introduces. The compiler
***REMOVED*** will also enforce a lot of the assumptions that this function
***REMOVED*** makes, and treat it as a compiler error if you break them.
***REMOVED***
***REMOVED*** @param {!Object} me Should always be "this".
***REMOVED*** @param {*=} opt_methodName The method name if calling a super method.
***REMOVED*** @param {...*} var_args The rest of the arguments.
***REMOVED*** @return {*} The return value of the superclass method.
***REMOVED***
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Allow for aliasing within scope functions.  This function exists for
***REMOVED*** uncompiled code - in compiled code the calls will be inlined and the
***REMOVED*** aliases applied.  In uncompiled code the function is simply run since the
***REMOVED*** aliases as written are valid JavaScript.
***REMOVED*** @param {function()} fn Function to call.  This function can contain aliases
***REMOVED***     to namespaces (e.g. "var dom = goog.dom") or classes
***REMOVED***    (e.g. "var Timer = goog.Timer").
***REMOVED***
goog.scope = function(fn) {
  fn.call(goog.global);
***REMOVED***


