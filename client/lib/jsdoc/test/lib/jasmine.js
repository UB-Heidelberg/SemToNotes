var isCommonJS = typeof window == "undefined";

***REMOVED***
***REMOVED*** Top level namespace for Jasmine, a lightweight JavaScript BDD/spec/testing framework.
***REMOVED***
***REMOVED*** @namespace
***REMOVED***
var jasmine = {***REMOVED***
if (isCommonJS){exports.jasmine = jasmine;}
***REMOVED***
***REMOVED*** @private
***REMOVED***
jasmine.unimplementedMethod_ = function() {
  throw new Error("unimplemented method");
***REMOVED***

***REMOVED***
***REMOVED*** Use <code>jasmine.undefined</code> instead of <code>undefined</code>, since <code>undefined</code> is just
***REMOVED*** a plain old variable and may be redefined by somebody else.
***REMOVED***
***REMOVED*** @private
***REMOVED***
jasmine.undefined = jasmine.___undefined___;

***REMOVED***
***REMOVED*** Show diagnostic messages in the console if set to true
***REMOVED***
***REMOVED***
jasmine.VERBOSE = false;

***REMOVED***
***REMOVED*** Default interval in milliseconds for event loop yields (e.g. to allow network activity or to refresh the screen with the HTML-based runner). Small values here may result in slow test running. Zero means no updates until all tests have completed.
***REMOVED***
***REMOVED***
jasmine.DEFAULT_UPDATE_INTERVAL = 250;

***REMOVED***
***REMOVED*** Default timeout interval in milliseconds for waitsFor() blocks.
***REMOVED***
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

jasmine.getGlobal = function() {
  function getGlobal() {
    return this;
  }

  return getGlobal();
***REMOVED***

***REMOVED***
***REMOVED*** Allows for bound functions to be compared.  Internal use only.
***REMOVED***
***REMOVED*** @ignore
***REMOVED*** @private
***REMOVED*** @param base {Object} bound 'this' for the function
***REMOVED*** @param name {Function} function to find
***REMOVED***
jasmine.bindOriginal_ = function(base, name) {
  var original = base[name];
  if (original.apply) {
    return function() {
      return original.apply(base, arguments);
   ***REMOVED*****REMOVED***
  } else {
    // IE support
    return jasmine.getGlobal()[name];
  }
***REMOVED***

jasmine.setTimeout = jasmine.bindOriginal_(jasmine.getGlobal(), 'setTimeout');
jasmine.clearTimeout = jasmine.bindOriginal_(jasmine.getGlobal(), 'clearTimeout');
jasmine.setInterval = jasmine.bindOriginal_(jasmine.getGlobal(), 'setInterval');
jasmine.clearInterval = jasmine.bindOriginal_(jasmine.getGlobal(), 'clearInterval');

jasmine.MessageResult = function(values) {
  this.type = 'log';
  this.values = values;
  this.trace = new Error(); // todo: test better
***REMOVED***

jasmine.MessageResult.prototype.toString = function() {
  var text = "";
  for (var i = 0; i < this.values.length; i++) {
    if (i > 0){text += " ";}
    if (jasmine.isString_(this.values[i])) {
      text += this.values[i];
    } else {
      text += jasmine.pp(this.values[i]);
    }
  }
  return text;
***REMOVED***

jasmine.ExpectationResult = function(params) {
  this.type = 'expect';
  this.matcherName = params.matcherName;
  this.passed_ = params.passed;
  this.expected = params.expected;
  this.actual = params.actual;
  this.message = this.passed_ ? 'Passed.' : params.message;

  var trace = (params.trace || new Error(this.message));
  this.trace = this.passed_ ? '' : trace;
***REMOVED***

jasmine.ExpectationResult.prototype.toString = function () {
  return this.message;
***REMOVED***

jasmine.ExpectationResult.prototype.passed = function () {
  return this.passed_;
***REMOVED***

***REMOVED***
***REMOVED*** Getter for the Jasmine environment. Ensures one gets created
***REMOVED***
jasmine.getEnv = function() {
  var env = jasmine.currentEnv_ = jasmine.currentEnv_ || new jasmine.Env();
  return env;
***REMOVED***

***REMOVED***
***REMOVED*** @ignore
***REMOVED*** @private
***REMOVED*** @param value
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isArray_ = function(value) {
  return jasmine.isA_("Array", value);
***REMOVED***

***REMOVED***
***REMOVED*** @ignore
***REMOVED*** @private
***REMOVED*** @param value
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isString_ = function(value) {
  return jasmine.isA_("String", value);
***REMOVED***

***REMOVED***
***REMOVED*** @ignore
***REMOVED*** @private
***REMOVED*** @param value
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isNumber_ = function(value) {
  return jasmine.isA_("Number", value);
***REMOVED***

***REMOVED***
***REMOVED*** @ignore
***REMOVED*** @private
***REMOVED*** @param {String} typeName
***REMOVED*** @param value
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isA_ = function(typeName, value) {
  return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
***REMOVED***

***REMOVED***
***REMOVED*** Pretty printer for expecations.  Takes any object and turns it into a human-readable string.
***REMOVED***
***REMOVED*** @param value {Object} an object to be outputted
***REMOVED*** @returns {String}
***REMOVED***
jasmine.pp = function(value) {
  var stringPrettyPrinter = new jasmine.StringPrettyPrinter();
  stringPrettyPrinter.format(value);
  return stringPrettyPrinter.string;
***REMOVED***

***REMOVED***
***REMOVED*** Returns true if the object is a DOM Node.
***REMOVED***
***REMOVED*** @param {Object} obj object to check
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isDomNode = function(obj) {
  return obj.nodeType > 0;
***REMOVED***

***REMOVED***
***REMOVED*** Returns a matchable 'generic' object of the class type.  For use in expecations of type when values don't matter.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // don't care about which function is passed in, as long as it's a function
***REMOVED*** expect(mySpy).toHaveBeenCalledWith(jasmine.any(Function));
***REMOVED***
***REMOVED*** @param {Class} clazz
***REMOVED*** @returns matchable object of the type clazz
***REMOVED***
jasmine.any = function(clazz) {
  return new jasmine.Matchers.Any(clazz);
***REMOVED***

***REMOVED***
***REMOVED*** Returns a matchable subset of a JSON object. For use in expectations when you don't care about all of the
***REMOVED*** attributes on the object.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // don't care about any other attributes than foo.
***REMOVED*** expect(mySpy).toHaveBeenCalledWith(jasmine.objectContaining({foo: "bar"});
***REMOVED***
***REMOVED*** @param sample {Object} sample
***REMOVED*** @returns matchable object for the sample
***REMOVED***
jasmine.objectContaining = function (sample) {
    return new jasmine.Matchers.ObjectContaining(sample);
***REMOVED***

***REMOVED***
***REMOVED*** Jasmine Spies are test doubles that can act as stubs, spies, fakes or when used in an expecation, mocks.
***REMOVED***
***REMOVED*** Spies should be created in test setup, before expectations.  They can then be checked, using the standard Jasmine
***REMOVED*** expectation syntax. Spies can be checked if they were called or not and what the calling params were.
***REMOVED***
***REMOVED*** A Spy has the following fields: wasCalled, callCount, mostRecentCall, and argsForCall (see docs).
***REMOVED***
***REMOVED*** Spies are torn down at the end of every spec.
***REMOVED***
***REMOVED*** Note: Do <b>not</b> call new jasmine.Spy() directly - a spy must be created using spyOn, jasmine.createSpy or jasmine.createSpyObj.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // a stub
***REMOVED*** var myStub = jasmine.createSpy('myStub');  // can be used anywhere
***REMOVED***
***REMOVED*** // spy example
***REMOVED*** var foo = {
***REMOVED***   not: function(bool) { return !bool; }
***REMOVED*** }
***REMOVED***
***REMOVED*** // actual foo.not will not be called, execution stops
***REMOVED*** spyOn(foo, 'not');

 // foo.not spied upon, execution will continue to implementation
***REMOVED*** spyOn(foo, 'not').andCallThrough();
***REMOVED***
***REMOVED*** // fake example
***REMOVED*** var foo = {
***REMOVED***   not: function(bool) { return !bool; }
***REMOVED*** }
***REMOVED***
***REMOVED*** // foo.not(val) will return val
***REMOVED*** spyOn(foo, 'not').andCallFake(function(value) {return value;});
***REMOVED***
***REMOVED*** // mock example
***REMOVED*** foo.not(7 == 7);
***REMOVED*** expect(foo.not).toHaveBeenCalled();
***REMOVED*** expect(foo.not).toHaveBeenCalledWith(true);
***REMOVED***
***REMOVED***
***REMOVED*** @see spyOn, jasmine.createSpy, jasmine.createSpyObj
***REMOVED*** @param {String} name
***REMOVED***
jasmine.Spy = function(name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the spy, if provided.
 ***REMOVED*****REMOVED***
  this.identity = name || 'unknown';
 ***REMOVED*****REMOVED***
  ***REMOVED***  Is this Object a spy?
 ***REMOVED*****REMOVED***
  this.isSpy = true;
 ***REMOVED*****REMOVED***
  ***REMOVED*** The actual function this spy stubs.
 ***REMOVED*****REMOVED***
  this.plan = function() {
 ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***
  ***REMOVED*** Tracking of the most recent call to the spy.
  ***REMOVED*** @example
  ***REMOVED*** var mySpy = jasmine.createSpy('foo');
  ***REMOVED*** mySpy(1, 2);
  ***REMOVED*** mySpy.mostRecentCall.args = [1, 2];
 ***REMOVED*****REMOVED***
  this.mostRecentCall = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Holds arguments for each call to the spy, indexed by call count
  ***REMOVED*** @example
  ***REMOVED*** var mySpy = jasmine.createSpy('foo');
  ***REMOVED*** mySpy(1, 2);
  ***REMOVED*** mySpy(7, 8);
  ***REMOVED*** mySpy.mostRecentCall.args = [7, 8];
  ***REMOVED*** mySpy.argsForCall[0] = [1, 2];
  ***REMOVED*** mySpy.argsForCall[1] = [7, 8];
 ***REMOVED*****REMOVED***
  this.argsForCall = [];
  this.calls = [];
***REMOVED***

***REMOVED***
***REMOVED*** Tells a spy to call through to the actual implemenatation.
***REMOVED***
***REMOVED*** @example
***REMOVED*** var foo = {
***REMOVED***   bar: function() { // do some stuff }
***REMOVED*** }
***REMOVED***
***REMOVED*** // defining a spy on an existing property: foo.bar
***REMOVED*** spyOn(foo, 'bar').andCallThrough();
***REMOVED***
jasmine.Spy.prototype.andCallThrough = function() {
  this.plan = this.originalValue;
  return this;
***REMOVED***

***REMOVED***
***REMOVED*** For setting the return value of a spy.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // defining a spy from scratch: foo() returns 'baz'
***REMOVED*** var foo = jasmine.createSpy('spy on foo').andReturn('baz');
***REMOVED***
***REMOVED*** // defining a spy on an existing property: foo.bar() returns 'baz'
***REMOVED*** spyOn(foo, 'bar').andReturn('baz');
***REMOVED***
***REMOVED*** @param {Object} value
***REMOVED***
jasmine.Spy.prototype.andReturn = function(value) {
  this.plan = function() {
    return value;
 ***REMOVED*****REMOVED***
  return this;
***REMOVED***

***REMOVED***
***REMOVED*** For throwing an exception when a spy is called.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // defining a spy from scratch: foo() throws an exception w/ message 'ouch'
***REMOVED*** var foo = jasmine.createSpy('spy on foo').andThrow('baz');
***REMOVED***
***REMOVED*** // defining a spy on an existing property: foo.bar() throws an exception w/ message 'ouch'
***REMOVED*** spyOn(foo, 'bar').andThrow('baz');
***REMOVED***
***REMOVED*** @param {String} exceptionMsg
***REMOVED***
jasmine.Spy.prototype.andThrow = function(exceptionMsg) {
  this.plan = function() {
    throw exceptionMsg;
 ***REMOVED*****REMOVED***
  return this;
***REMOVED***

***REMOVED***
***REMOVED*** Calls an alternate implementation when a spy is called.
***REMOVED***
***REMOVED*** @example
***REMOVED*** var baz = function() {
***REMOVED***   // do some stuff, return something
***REMOVED*** }
***REMOVED*** // defining a spy from scratch: foo() calls the function baz
***REMOVED*** var foo = jasmine.createSpy('spy on foo').andCall(baz);
***REMOVED***
***REMOVED*** // defining a spy on an existing property: foo.bar() calls an anonymnous function
***REMOVED*** spyOn(foo, 'bar').andCall(function() { return 'baz';} );
***REMOVED***
***REMOVED*** @param {Function} fakeFunc
***REMOVED***
jasmine.Spy.prototype.andCallFake = function(fakeFunc) {
  this.plan = fakeFunc;
  return this;
***REMOVED***

***REMOVED***
***REMOVED*** Resets all of a spy's the tracking variables so that it can be used again.
***REMOVED***
***REMOVED*** @example
***REMOVED*** spyOn(foo, 'bar');
***REMOVED***
***REMOVED*** foo.bar();
***REMOVED***
***REMOVED*** expect(foo.bar.callCount).toEqual(1);
***REMOVED***
***REMOVED*** foo.bar.reset();
***REMOVED***
***REMOVED*** expect(foo.bar.callCount).toEqual(0);
***REMOVED***
jasmine.Spy.prototype.reset = function() {
  this.wasCalled = false;
  this.callCount = 0;
  this.argsForCall = [];
  this.calls = [];
  this.mostRecentCall = {***REMOVED***
***REMOVED***

jasmine.createSpy = function(name) {

  var spyObj = function() {
    spyObj.wasCalled = true;
    spyObj.callCount++;
    var args = jasmine.util.argsToArray(arguments);
    spyObj.mostRecentCall.object = this;
    spyObj.mostRecentCall.args = args;
    spyObj.argsForCall.push(args);
    spyObj.calls.push({object: this, args: args});
    return spyObj.plan.apply(this, arguments);
 ***REMOVED*****REMOVED***

  var spy = new jasmine.Spy(name);

  for (var prop in spy) {
    spyObj[prop] = spy[prop];
  }

  spyObj.reset();

  return spyObj;
***REMOVED***

***REMOVED***
***REMOVED*** Determines whether an object is a spy.
***REMOVED***
***REMOVED*** @param {jasmine.Spy|Object} putativeSpy
***REMOVED*** @returns {Boolean}
***REMOVED***
jasmine.isSpy = function(putativeSpy) {
  return putativeSpy && putativeSpy.isSpy;
***REMOVED***

***REMOVED***
***REMOVED*** Creates a more complicated spy: an Object that has every property a function that is a spy.  Used for stubbing something
***REMOVED*** large in one call.
***REMOVED***
***REMOVED*** @param {String} baseName name of spy class
***REMOVED*** @param {Array} methodNames array of names of methods to make spies
***REMOVED***
jasmine.createSpyObj = function(baseName, methodNames) {
  if (!jasmine.isArray_(methodNames) || methodNames.length === 0) {
    throw new Error('createSpyObj requires a non-empty array of method names to create spies for');
  }
  var obj = {***REMOVED***
  for (var i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jasmine.createSpy(baseName + '.' + methodNames[i]);
  }
  return obj;
***REMOVED***

***REMOVED***
***REMOVED*** All parameters are pretty-printed and concatenated together, then written to the current spec's output.
***REMOVED***
***REMOVED*** Be careful not to leave calls to <code>jasmine.log</code> in production code.
***REMOVED***
jasmine.log = function() {
  var spec = jasmine.getEnv().currentSpec;
  spec.log.apply(spec, arguments);
***REMOVED***

***REMOVED***
***REMOVED*** Function that installs a spy on an existing object's method name.  Used within a Spec to create a spy.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // spy example
***REMOVED*** var foo = {
***REMOVED***   not: function(bool) { return !bool; }
***REMOVED*** }
***REMOVED*** spyOn(foo, 'not'); // actual foo.not will not be called, execution stops
***REMOVED***
***REMOVED*** @see jasmine.createSpy
***REMOVED*** @param obj
***REMOVED*** @param methodName
***REMOVED*** @returns a Jasmine spy that can be chained with all spy methods
***REMOVED***
var spyOn = function(obj, methodName) {
  return jasmine.getEnv().currentSpec.spyOn(obj, methodName);
***REMOVED***
if (isCommonJS){exports.spyOn = spyOn;}

***REMOVED***
***REMOVED*** Creates a Jasmine spec that will be added to the current suite.
***REMOVED***
***REMOVED*** // TODO: pending tests
***REMOVED***
***REMOVED*** @example
***REMOVED*** it('should be true', function() {
***REMOVED***   expect(true).toEqual(true);
***REMOVED*** });
***REMOVED***
***REMOVED*** @param {String} desc description of this specification
***REMOVED*** @param {Function} func defines the preconditions and expectations of the spec
***REMOVED***
var it = function(desc, func) {
  return jasmine.getEnv().it(desc, func);
***REMOVED***
if (isCommonJS){exports.it = it;}

***REMOVED***
***REMOVED*** Creates a <em>disabled</em> Jasmine spec.
***REMOVED***
***REMOVED*** A convenience method that allows existing specs to be disabled temporarily during development.
***REMOVED***
***REMOVED*** @param {String} desc description of this specification
***REMOVED*** @param {Function} func defines the preconditions and expectations of the spec
***REMOVED***
var xit = function(desc, func) {
  return jasmine.getEnv().xit(desc, func);
***REMOVED***
if (isCommonJS){exports.xit = xit;}

***REMOVED***
***REMOVED*** Starts a chain for a Jasmine expectation.
***REMOVED***
***REMOVED*** It is passed an Object that is the actual value and should chain to one of the many
***REMOVED*** jasmine.Matchers functions.
***REMOVED***
***REMOVED*** @param {Object} actual Actual value to test against and expected value
***REMOVED***
var expect = function(actual) {
  return jasmine.getEnv().currentSpec.expect(actual);
***REMOVED***
if (isCommonJS){exports.expect = expect;}

***REMOVED***
***REMOVED*** Defines part of a jasmine spec.  Used in cominbination with waits or waitsFor in asynchrnous specs.
***REMOVED***
***REMOVED*** @param {Function} func Function that defines part of a jasmine spec.
***REMOVED***
var runs = function(func) {
  jasmine.getEnv().currentSpec.runs(func);
***REMOVED***
if (isCommonJS){exports.runs = runs;}

***REMOVED***
***REMOVED*** Waits a fixed time period before moving to the next block.
***REMOVED***
***REMOVED*** @deprecated Use waitsFor() instead
***REMOVED*** @param {Number} timeout milliseconds to wait
***REMOVED***
var waits = function(timeout) {
  jasmine.getEnv().currentSpec.waits(timeout);
***REMOVED***
if (isCommonJS){exports.waits = waits;}

***REMOVED***
***REMOVED*** Waits for the latchFunction to return true before proceeding to the next block.
***REMOVED***
***REMOVED*** @param {Function} latchFunction
***REMOVED*** @param {String} optional_timeoutMessage
***REMOVED*** @param {Number} optional_timeout
***REMOVED***
var waitsFor = function(latchFunction, optional_timeoutMessage, optional_timeout) {
  jasmine.getEnv().currentSpec.waitsFor.apply(jasmine.getEnv().currentSpec, arguments);
***REMOVED***
if (isCommonJS){exports.waitsFor = waitsFor;}

***REMOVED***
***REMOVED*** A function that is called before each spec in a suite.
***REMOVED***
***REMOVED*** Used for spec setup, including validating assumptions.
***REMOVED***
***REMOVED*** @param {Function} beforeEachFunction
***REMOVED***
var beforeEach = function(beforeEachFunction) {
  jasmine.getEnv().beforeEach(beforeEachFunction);
***REMOVED***
if (isCommonJS){exports.beforeEach = beforeEach;}

***REMOVED***
***REMOVED*** A function that is called after each spec in a suite.
***REMOVED***
***REMOVED*** Used for restoring any state that is hijacked during spec execution.
***REMOVED***
***REMOVED*** @param {Function} afterEachFunction
***REMOVED***
var afterEach = function(afterEachFunction) {
  jasmine.getEnv().afterEach(afterEachFunction);
***REMOVED***
if (isCommonJS){exports.afterEach = afterEach;}

***REMOVED***
***REMOVED*** Defines a suite of specifications.
***REMOVED***
***REMOVED*** Stores the description and all defined specs in the Jasmine environment as one suite of specs. Variables declared
***REMOVED*** are accessible by calls to beforeEach, it, and afterEach. Describe blocks can be nested, allowing for specialization
***REMOVED*** of setup in some tests.
***REMOVED***
***REMOVED*** @example
***REMOVED*** // TODO: a simple suite
***REMOVED***
***REMOVED*** // TODO: a simple suite with a nested describe block
***REMOVED***
***REMOVED*** @param {String} description A string, usually the class under test.
***REMOVED*** @param {Function} specDefinitions function that defines several specs.
***REMOVED***
var describe = function(description, specDefinitions) {
  return jasmine.getEnv().describe(description, specDefinitions);
***REMOVED***
if (isCommonJS){exports.describe = describe;}

***REMOVED***
***REMOVED*** Disables a suite of specifications.  Used to disable some suites in a file, or files, temporarily during development.
***REMOVED***
***REMOVED*** @param {String} description A string, usually the class under test.
***REMOVED*** @param {Function} specDefinitions function that defines several specs.
***REMOVED***
var xdescribe = function(description, specDefinitions) {
  return jasmine.getEnv().xdescribe(description, specDefinitions);
***REMOVED***
if (isCommonJS){exports.xdescribe = xdescribe;}

// Provide the XMLHttpRequest class for IE 5.x-6.x:
jasmine.XmlHttpRequest = (typeof XMLHttpRequest == "undefined") ? function() {
  function tryIt(f) {
    try {
      return f();
    } catch(e) {
    }
    return null;
  }

  var xhr = tryIt(function() {
    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
  }) ||
    tryIt(function() {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }) ||
    tryIt(function() {
      return new ActiveXObject("Msxml2.XMLHTTP");
    }) ||
    tryIt(function() {
      return new ActiveXObject("Microsoft.XMLHTTP");
    });

  if (!xhr) {
    throw new Error("This browser does not support XMLHttpRequest.");
}

  return xhr;
} : XMLHttpRequest;
***REMOVED***
***REMOVED*** @namespace
***REMOVED***
jasmine.util = {***REMOVED***

***REMOVED***
***REMOVED*** Declare that a child class inherit it's prototype from the parent class.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {Function} childClass
***REMOVED*** @param {Function} parentClass
***REMOVED***
jasmine.util.inherit = function(childClass, parentClass) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  var subclass = function() {
 ***REMOVED*****REMOVED***
  subclass.prototype = parentClass.prototype;
  childClass.prototype = new subclass();
***REMOVED***

jasmine.util.formatException = function(e) {
  var lineNumber;
  if (e.line) {
    lineNumber = e.line;
  }
  else if (e.lineNumber) {
    lineNumber = e.lineNumber;
  }

  var file;

  if (e.sourceURL) {
    file = e.sourceURL;
  }
  else if (e.fileName) {
    file = e.fileName;
  }

  var message = (e.name && e.message) ? (e.name + ': ' + e.message) : e.toString();

  if (file && lineNumber) {
    message += ' in ' + file + ' (line ' + lineNumber + ')';
  }

  return message;
***REMOVED***

jasmine.util.htmlEscape = function(str) {
  if (!str) {
    return str;
}
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
***REMOVED***

jasmine.util.argsToArray = function(args) {
  var arrayOfArgs = [];
  for (var i = 0; i < args.length; i++) {arrayOfArgs.push(args[i]);}
  return arrayOfArgs;
***REMOVED***

jasmine.util.extend = function(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
***REMOVED***

***REMOVED***
***REMOVED*** Environment for Jasmine
***REMOVED***
***REMOVED***
***REMOVED***
jasmine.Env = function() {
  this.currentSpec = null;
  this.currentSuite = null;
  this.currentRunner_ = new jasmine.Runner(this);

  this.reporter = new jasmine.MultiReporter();

  this.updateInterval = jasmine.DEFAULT_UPDATE_INTERVAL;
  this.defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  this.lastUpdate = 0;
  this.specFilter = function() {
    return true;
 ***REMOVED*****REMOVED***

  this.nextSpecId_ = 0;
  this.nextSuiteId_ = 0;
  this.equalityTesters_ = [];

  // wrap matchers
  this.matchersClass = function() {
    jasmine.Matchers.apply(this, arguments);
 ***REMOVED*****REMOVED***
  jasmine.util.inherit(this.matchersClass, jasmine.Matchers);

  jasmine.Matchers.wrapInto_(jasmine.Matchers.prototype, this.matchersClass);
***REMOVED***

jasmine.Env.prototype.setTimeout = jasmine.setTimeout;
jasmine.Env.prototype.clearTimeout = jasmine.clearTimeout;
jasmine.Env.prototype.setInterval = jasmine.setInterval;
jasmine.Env.prototype.clearInterval = jasmine.clearInterval;

***REMOVED***
***REMOVED*** @returns an object containing jasmine version build info, if set.
***REMOVED***
jasmine.Env.prototype.version = function () {
  if (jasmine.version_) {
    return jasmine.version_;
  } else {
    throw new Error('Version not set');
  }
***REMOVED***

***REMOVED***
***REMOVED*** @returns string containing jasmine version build info, if set.
***REMOVED***
jasmine.Env.prototype.versionString = function() {
  if (!jasmine.version_) {
    return "version unknown";
  }

  var version = this.version();
  var versionString = version.major + "." + version.minor + "." + version.build;
  if (version.release_candidate) {
    versionString += ".rc" + version.release_candidate;
  }
  versionString += " revision " + version.revision;
  return versionString;
***REMOVED***

***REMOVED***
***REMOVED*** @returns a sequential integer starting at 0
***REMOVED***
jasmine.Env.prototype.nextSpecId = function () {
  return this.nextSpecId_++;
***REMOVED***

***REMOVED***
***REMOVED*** @returns a sequential integer starting at 0
***REMOVED***
jasmine.Env.prototype.nextSuiteId = function () {
  return this.nextSuiteId_++;
***REMOVED***

***REMOVED***
***REMOVED*** Register a reporter to receive status updates from Jasmine.
***REMOVED*** @param {jasmine.Reporter} reporter An object which will receive status updates.
***REMOVED***
jasmine.Env.prototype.addReporter = function(reporter) {
  this.reporter.addReporter(reporter);
***REMOVED***

jasmine.Env.prototype.execute = function() {
  this.currentRunner_.execute();
***REMOVED***

jasmine.Env.prototype.describe = function(description, specDefinitions) {
  var suite = new jasmine.Suite(this, description, specDefinitions, this.currentSuite);

  var parentSuite = this.currentSuite;
  if (parentSuite) {
    parentSuite.add(suite);
  } else {
    this.currentRunner_.add(suite);
  }

  this.currentSuite = suite;

  var declarationError = null;
  try {
    specDefinitions.call(suite);
  } catch(e) {
    declarationError = e;
  }

  if (declarationError) {
    this.it("encountered a declaration exception", function() {
      throw declarationError;
    });
  }

  this.currentSuite = parentSuite;

  return suite;
***REMOVED***

jasmine.Env.prototype.beforeEach = function(beforeEachFunction) {
  if (this.currentSuite) {
    this.currentSuite.beforeEach(beforeEachFunction);
  } else {
    this.currentRunner_.beforeEach(beforeEachFunction);
  }
***REMOVED***

jasmine.Env.prototype.currentRunner = function () {
  return this.currentRunner_;
***REMOVED***

jasmine.Env.prototype.afterEach = function(afterEachFunction) {
  if (this.currentSuite) {
    this.currentSuite.afterEach(afterEachFunction);
  } else {
    this.currentRunner_.afterEach(afterEachFunction);
  }

***REMOVED***

jasmine.Env.prototype.xdescribe = function(desc, specDefinitions) {
  return {
    execute: function() {
    }
 ***REMOVED*****REMOVED***
***REMOVED***

jasmine.Env.prototype.it = function(description, func) {
  var spec = new jasmine.Spec(this, this.currentSuite, description);
  this.currentSuite.add(spec);
  this.currentSpec = spec;

  if (func) {
    spec.runs(func);
  }

  return spec;
***REMOVED***

jasmine.Env.prototype.xit = function(desc, func) {
  return {
    id: this.nextSpecId(),
    runs: function() {
    }
 ***REMOVED*****REMOVED***
***REMOVED***

jasmine.Env.prototype.compareObjects_ = function(a, b, mismatchKeys, mismatchValues) {
  if (a.__Jasmine_been_here_before__ === b && b.__Jasmine_been_here_before__ === a) {
    return true;
  }

  a.__Jasmine_been_here_before__ = b;
  b.__Jasmine_been_here_before__ = a;

  var hasKey = function(obj, keyName) {
    return obj !== null && obj[keyName] !== jasmine.undefined;
 ***REMOVED*****REMOVED***

  for (var property in b) {
    if (!hasKey(a, property) && hasKey(b, property)) {
      mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
    }
  }
  for (property in a) {
    if (!hasKey(b, property) && hasKey(a, property)) {
      mismatchKeys.push("expected missing key '" + property + "', but present in actual.");
    }
  }
  for (property in b) {
    if (property == '__Jasmine_been_here_before__') {
        continue;
    }
    if (!this.equals_(a[property], b[property], mismatchKeys, mismatchValues)) {
      mismatchValues.push("'" + property + "' was '" + (b[property] ? jasmine.util.htmlEscape(b[property].toString()) : b[property]) + "' in expected, but was '" + (a[property] ? jasmine.util.htmlEscape(a[property].toString()) : a[property]) + "' in actual.");
    }
  }

  if (jasmine.isArray_(a) && jasmine.isArray_(b) && a.length != b.length) {
    mismatchValues.push("arrays were not the same length");
  }

  delete a.__Jasmine_been_here_before__;
  delete b.__Jasmine_been_here_before__;
  return (mismatchKeys.length === 0 && mismatchValues.length === 0);
***REMOVED***

jasmine.Env.prototype.equals_ = function(a, b, mismatchKeys, mismatchValues) {
  mismatchKeys = mismatchKeys || [];
  mismatchValues = mismatchValues || [];

  for (var i = 0; i < this.equalityTesters_.length; i++) {
    var equalityTester = this.equalityTesters_[i];
    var result = equalityTester(a, b, this, mismatchKeys, mismatchValues);
    if (result !== jasmine.undefined) {
        return result;
    }
  }

  if (a === b) {
    return true;
}

  if (a === jasmine.undefined || a === null || b === jasmine.undefined || b === null) {
    return (a == jasmine.undefined && b == jasmine.undefined);
  }

  if (jasmine.isDomNode(a) && jasmine.isDomNode(b)) {
    return a === b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() == b.getTime();
  }

  if (a.jasmineMatches) {
    return a.jasmineMatches(b);
  }

  if (b.jasmineMatches) {
    return b.jasmineMatches(a);
  }

  if (a instanceof jasmine.Matchers.ObjectContaining) {
    return a.matches(b);
  }

  if (b instanceof jasmine.Matchers.ObjectContaining) {
    return b.matches(a);
  }

  if (jasmine.isString_(a) && jasmine.isString_(b)) {
    return (a == b);
  }

  if (jasmine.isNumber_(a) && jasmine.isNumber_(b)) {
    return (a == b);
  }

  if (typeof a === "object" && typeof b === "object") {
    return this.compareObjects_(a, b, mismatchKeys, mismatchValues);
  }

  //Straight check
  return (a === b);
***REMOVED***

jasmine.Env.prototype.contains_ = function(haystack, needle) {
  if (jasmine.isArray_(haystack)) {
    for (var i = 0; i < haystack.length; i++) {
      if (this.equals_(haystack[i], needle)) {
        return true;
    }
    }
    return false;
  }
  return haystack.indexOf(needle) >= 0;
***REMOVED***

jasmine.Env.prototype.addEqualityTester = function(equalityTester) {
  this.equalityTesters_.push(equalityTester);
***REMOVED***
***REMOVED*** No-op base class for Jasmine reporters.
***REMOVED***
***REMOVED***
***REMOVED***
jasmine.Reporter = function() {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.reportRunnerStarting = function(runner) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.reportRunnerResults = function(runner) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.reportSuiteResults = function(suite) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.reportSpecStarting = function(spec) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.reportSpecResults = function(spec) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.Reporter.prototype.log = function(str) {
***REMOVED***

***REMOVED***
***REMOVED*** Blocks are functions with executable code that make up a spec.
***REMOVED***
***REMOVED***
***REMOVED*** @param {jasmine.Env} env
***REMOVED*** @param {Function} func
***REMOVED*** @param {jasmine.Spec} spec
***REMOVED***
jasmine.Block = function(env, func, spec) {
  this.env = env;
  this.func = func;
  this.spec = spec;
***REMOVED***

jasmine.Block.prototype.execute = function(onComplete) {
  try {
    this.func.apply(this.spec);
  } catch (e) {
    this.spec.fail(e);
  }
  onComplete();
***REMOVED***
***REMOVED*** JavaScript API reporter.
***REMOVED***
***REMOVED***
***REMOVED***
jasmine.JsApiReporter = function() {
  this.started = false;
  this.finished = false;
  this.suites_ = [];
  this.results_ = {***REMOVED***
***REMOVED***

jasmine.JsApiReporter.prototype.reportRunnerStarting = function(runner) {
  this.started = true;
  var suites = runner.topLevelSuites();
  for (var i = 0; i < suites.length; i++) {
    var suite = suites[i];
    this.suites_.push(this.summarize_(suite));
  }
***REMOVED***

jasmine.JsApiReporter.prototype.suites = function() {
  return this.suites_;
***REMOVED***

jasmine.JsApiReporter.prototype.summarize_ = function(suiteOrSpec) {
  var isSuite = suiteOrSpec instanceof jasmine.Suite;
  var summary = {
    id: suiteOrSpec.id,
    name: suiteOrSpec.description,
    type: isSuite ? 'suite' : 'spec',
    children: []
 ***REMOVED*****REMOVED***

  if (isSuite) {
    var children = suiteOrSpec.children();
    for (var i = 0; i < children.length; i++) {
      summary.children.push(this.summarize_(children[i]));
    }
  }
  return summary;
***REMOVED***

jasmine.JsApiReporter.prototype.results = function() {
  return this.results_;
***REMOVED***

jasmine.JsApiReporter.prototype.resultsForSpec = function(specId) {
  return this.results_[specId];
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportRunnerResults = function(runner) {
  this.finished = true;
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportSuiteResults = function(suite) {
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportSpecResults = function(spec) {
  this.results_[spec.id] = {
    messages: spec.results().getItems(),
    result: spec.results().failedCount > 0 ? "failed" : "passed"
 ***REMOVED*****REMOVED***
***REMOVED***

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.log = function(str) {
***REMOVED***

jasmine.JsApiReporter.prototype.resultsForSpecs = function(specIds){
  var results = {***REMOVED***
  for (var i = 0; i < specIds.length; i++) {
    var specId = specIds[i];
    results[specId] = this.summarizeResult_(this.results_[specId]);
  }
  return results;
***REMOVED***

jasmine.JsApiReporter.prototype.summarizeResult_ = function(result){
  var summaryMessages = [];
  var messagesLength = result.messages.length;
  for (var messageIndex = 0; messageIndex < messagesLength; messageIndex++) {
    var resultMessage = result.messages[messageIndex];
    summaryMessages.push({
      text: resultMessage.type == 'log' ? resultMessage.toString() : jasmine.undefined,
      passed: resultMessage.passed ? resultMessage.passed() : true,
      type: resultMessage.type,
      message: resultMessage.message,
      trace: {
        stack: resultMessage.passed && !resultMessage.passed() ? resultMessage.trace.stack : jasmine.undefined
      }
    });
  }

  return {
    result : result.result,
    messages : summaryMessages
 ***REMOVED*****REMOVED***
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED*** @param {jasmine.Env} env
***REMOVED*** @param actual
***REMOVED*** @param {jasmine.Spec} spec
***REMOVED***
jasmine.Matchers = function(env, actual, spec, opt_isNot) {
  this.env = env;
  this.actual = actual;
  this.spec = spec;
  this.isNot = opt_isNot || false;
  this.reportWasCalled_ = false;
***REMOVED***

// todo: @deprecated as of Jasmine 0.11, remove soon [xw]
jasmine.Matchers.pp = function(str) {
  throw new Error("jasmine.Matchers.pp() is no longer supported, please use jasmine.pp() instead!");
***REMOVED***

// todo: @deprecated Deprecated as of Jasmine 0.10. Rewrite your custom matchers to return true or false. [xw]
jasmine.Matchers.prototype.report = function(result, failing_message, details) {
  throw new Error("As of jasmine 0.11, custom matchers must be implemented differently -- please see jasmine docs");
***REMOVED***

jasmine.Matchers.wrapInto_ = function(prototype, matchersClass) {
  for (var methodName in prototype) {
    if (methodName == 'report') {
        continue;
    }
    var orig = prototype[methodName];
    matchersClass.prototype[methodName] = jasmine.Matchers.matcherFn_(methodName, orig);
  }
***REMOVED***

jasmine.Matchers.matcherFn_ = function(matcherName, matcherFunction) {
  return function() {
    var matcherArgs = jasmine.util.argsToArray(arguments);
    var result = matcherFunction.apply(this, arguments);

    if (this.isNot) {
      result = !result;
    }

    if (this.reportWasCalled_) {
        return result;
    }

    var message;
    if (!result) {
      if (this.message) {
        message = this.message.apply(this, arguments);
        if (jasmine.isArray_(message)) {
          message = message[this.isNot ? 1 : 0];
        }
      } else {
        var englishyPredicate = matcherName.replace(/[A-Z]/g, function(s) { return ' ' + s.toLowerCase(); });
        message = "Expected " + jasmine.pp(this.actual) + (this.isNot ? " not " : " ") + englishyPredicate;
        if (matcherArgs.length > 0) {
          for (var i = 0; i < matcherArgs.length; i++) {
            if (i > 0){message += ",";}
            message += " " + jasmine.pp(matcherArgs[i]);
          }
        }
        message += ".";
      }
    }
    var expectationResult = new jasmine.ExpectationResult({
      matcherName: matcherName,
      passed: result,
      expected: matcherArgs.length > 1 ? matcherArgs : matcherArgs[0],
      actual: this.actual,
      message: message
    });
    this.spec.addMatcherResult(expectationResult);
    return jasmine.undefined;
 ***REMOVED*****REMOVED***
***REMOVED***

***REMOVED***
***REMOVED*** toBe: compares the actual to the expected using ===
***REMOVED*** @param expected
***REMOVED***
jasmine.Matchers.prototype.toBe = function(expected) {
  return this.actual === expected;
***REMOVED***

***REMOVED***
***REMOVED*** toNotBe: compares the actual to the expected using !==
***REMOVED*** @param expected
***REMOVED*** @deprecated as of 1.0. Use not.toBe() instead.
***REMOVED***
jasmine.Matchers.prototype.toNotBe = function(expected) {
  return this.actual !== expected;
***REMOVED***

***REMOVED***
***REMOVED*** toEqual: compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc.
***REMOVED***
***REMOVED*** @param expected
***REMOVED***
jasmine.Matchers.prototype.toEqual = function(expected) {
  return this.env.equals_(this.actual, expected);
***REMOVED***

***REMOVED***
***REMOVED*** toNotEqual: compares the actual to the expected using the ! of jasmine.Matchers.toEqual
***REMOVED*** @param expected
***REMOVED*** @deprecated as of 1.0. Use not.toEqual() instead.
***REMOVED***
jasmine.Matchers.prototype.toNotEqual = function(expected) {
  return !this.env.equals_(this.actual, expected);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that compares the actual to the expected using a regular expression.  Constructs a RegExp, so takes
***REMOVED*** a pattern or a String.
***REMOVED***
***REMOVED*** @param expected
***REMOVED***
jasmine.Matchers.prototype.toMatch = function(expected) {
  return new RegExp(expected).test(this.actual);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that compares the actual to the expected using the boolean inverse of jasmine.Matchers.toMatch
***REMOVED*** @param expected
***REMOVED*** @deprecated as of 1.0. Use not.toMatch() instead.
***REMOVED***
jasmine.Matchers.prototype.toNotMatch = function(expected) {
  return !(new RegExp(expected).test(this.actual));
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that compares the actual to jasmine.undefined.
***REMOVED***
jasmine.Matchers.prototype.toBeDefined = function() {
  return (this.actual !== jasmine.undefined);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that compares the actual to jasmine.undefined.
***REMOVED***
jasmine.Matchers.prototype.toBeUndefined = function() {
  return (this.actual === jasmine.undefined);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that compares the actual to null.
***REMOVED***
jasmine.Matchers.prototype.toBeNull = function() {
  return (this.actual === null);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that boolean not-nots the actual.
***REMOVED***
jasmine.Matchers.prototype.toBeTruthy = function() {
  return !!this.actual;
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that boolean nots the actual.
***REMOVED***
jasmine.Matchers.prototype.toBeFalsy = function() {
  return !this.actual;
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks to see if the actual, a Jasmine spy, was called.
***REMOVED***
jasmine.Matchers.prototype.toHaveBeenCalled = function() {
  if (arguments.length > 0) {
    throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
  }

  if (!jasmine.isSpy(this.actual)) {
    throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
  }

  this.message = function() {
    return [
      "Expected spy " + this.actual.identity + " to have been called.",
      "Expected spy " + this.actual.identity + " not to have been called."
    ];
 ***REMOVED*****REMOVED***

  return this.actual.wasCalled;
***REMOVED***

***REMOVED*** @deprecated Use expect(xxx).toHaveBeenCalled() instead***REMOVED***
jasmine.Matchers.prototype.wasCalled = jasmine.Matchers.prototype.toHaveBeenCalled;

***REMOVED***
***REMOVED*** Matcher that checks to see if the actual, a Jasmine spy, was not called.
***REMOVED***
***REMOVED*** @deprecated Use expect(xxx).not.toHaveBeenCalled() instead
***REMOVED***
jasmine.Matchers.prototype.wasNotCalled = function() {
  if (arguments.length > 0) {
    throw new Error('wasNotCalled does not take arguments');
  }

  if (!jasmine.isSpy(this.actual)) {
    throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
  }

  this.message = function() {
    return [
      "Expected spy " + this.actual.identity + " to not have been called.",
      "Expected spy " + this.actual.identity + " to have been called."
    ];
 ***REMOVED*****REMOVED***

  return !this.actual.wasCalled;
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks to see if the actual, a Jasmine spy, was called with a set of parameters.
***REMOVED***
***REMOVED*** @example
***REMOVED***
***REMOVED***
jasmine.Matchers.prototype.toHaveBeenCalledWith = function() {
  var expectedArgs = jasmine.util.argsToArray(arguments);
  if (!jasmine.isSpy(this.actual)) {
    throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
  }
  this.message = function() {
    if (this.actual.callCount === 0) {
      // todo: what should the failure message for .not.toHaveBeenCalledWith() be? is this right? test better. [xw]
      return [
        "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but it was never called.",
        "Expected spy " + this.actual.identity + " not to have been called with " + jasmine.pp(expectedArgs) + " but it was."
      ];
    } else {
      return [
        "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but was called with " + jasmine.pp(this.actual.argsForCall),
        "Expected spy " + this.actual.identity + " not to have been called with " + jasmine.pp(expectedArgs) + " but was called with " + jasmine.pp(this.actual.argsForCall)
      ];
    }
 ***REMOVED*****REMOVED***

  return this.env.contains_(this.actual.argsForCall, expectedArgs);
***REMOVED***

***REMOVED*** @deprecated Use expect(xxx).toHaveBeenCalledWith() instead***REMOVED***
jasmine.Matchers.prototype.wasCalledWith = jasmine.Matchers.prototype.toHaveBeenCalledWith;

***REMOVED*** @deprecated Use expect(xxx).not.toHaveBeenCalledWith() instead***REMOVED***
jasmine.Matchers.prototype.wasNotCalledWith = function() {
  var expectedArgs = jasmine.util.argsToArray(arguments);
  if (!jasmine.isSpy(this.actual)) {
    throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
  }

  this.message = function() {
    return [
      "Expected spy not to have been called with " + jasmine.pp(expectedArgs) + " but it was",
      "Expected spy to have been called with " + jasmine.pp(expectedArgs) + " but it was"
    ];
 ***REMOVED*****REMOVED***

  return !this.env.contains_(this.actual.argsForCall, expectedArgs);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks that the expected item is an element in the actual Array.
***REMOVED***
***REMOVED*** @param {Object} expected
***REMOVED***
jasmine.Matchers.prototype.toContain = function(expected) {
  return this.env.contains_(this.actual, expected);
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks that the expected item is NOT an element in the actual Array.
***REMOVED***
***REMOVED*** @param {Object} expected
***REMOVED*** @deprecated as of 1.0. Use not.toContain() instead.
***REMOVED***
jasmine.Matchers.prototype.toNotContain = function(expected) {
  return !this.env.contains_(this.actual, expected);
***REMOVED***

jasmine.Matchers.prototype.toBeLessThan = function(expected) {
  return this.actual < expected;
***REMOVED***

jasmine.Matchers.prototype.toBeGreaterThan = function(expected) {
  return this.actual > expected;
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks that the expected item is equal to the actual item
***REMOVED*** up to a given level of decimal precision (default 2).
***REMOVED***
***REMOVED*** @param {Number} expected
***REMOVED*** @param {Number} precision
***REMOVED***
jasmine.Matchers.prototype.toBeCloseTo = function(expected, precision) {
  if (!(precision === 0)) {
    precision = precision || 2;
  }
  var multiplier = Math.pow(10, precision);
  var actual = Math.round(this.actual***REMOVED*** multiplier);
  expected = Math.round(expected***REMOVED*** multiplier);
  return expected == actual;
***REMOVED***

***REMOVED***
***REMOVED*** Matcher that checks that the expected exception was thrown by the actual.
***REMOVED***
***REMOVED*** @param {String} expected
***REMOVED***
jasmine.Matchers.prototype.toThrow = function(expected) {
  var result = false;
  var exception;
  if (typeof this.actual != 'function') {
    throw new Error('Actual is not a function');
  }
  try {
    this.actual();
  } catch (e) {
    exception = e;
  }
  if (exception) {
    result = (expected === jasmine.undefined || this.env.equals_(exception.message || exception, expected.message || expected));
  }

  var not = this.isNot ? "not " : "";

  this.message = function() {
    if (exception && (expected === jasmine.undefined || !this.env.equals_(exception.message || exception, expected.message || expected))) {
      return ["Expected function " + not + "to throw", expected ? expected.message || expected : "an exception", ", but it threw", exception.message || exception].join(' ');
    } else {
      return "Expected function to throw an exception.";
    }
 ***REMOVED*****REMOVED***

  return result;
***REMOVED***

jasmine.Matchers.Any = function(expectedClass) {
  this.expectedClass = expectedClass;
***REMOVED***

jasmine.Matchers.Any.prototype.jasmineMatches = function(other) {
  if (this.expectedClass == String) {
    return typeof other == 'string' || other instanceof String;
  }

  if (this.expectedClass == Number) {
    return typeof other == 'number' || other instanceof Number;
  }

  if (this.expectedClass == Function) {
    return typeof other == 'function' || other instanceof Function;
  }

  if (this.expectedClass == Object) {
    return typeof other == 'object';
  }

  return other instanceof this.expectedClass;
***REMOVED***

jasmine.Matchers.Any.prototype.jasmineToString = function() {
  return '<jasmine.any(' + this.expectedClass + ')>';
***REMOVED***

jasmine.Matchers.ObjectContaining = function (sample) {
  this.sample = sample;
***REMOVED***

jasmine.Matchers.ObjectContaining.prototype.jasmineMatches = function(other, mismatchKeys, mismatchValues) {
  mismatchKeys = mismatchKeys || [];
  mismatchValues = mismatchValues || [];

  var env = jasmine.getEnv();

  var hasKey = function(obj, keyName) {
    return obj != null && obj[keyName] !== jasmine.undefined;
 ***REMOVED*****REMOVED***

  for (var property in this.sample) {
    if (!hasKey(other, property) && hasKey(this.sample, property)) {
      mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
    }
    else if (!env.equals_(this.sample[property], other[property], mismatchKeys, mismatchValues)) {
      mismatchValues.push("'" + property + "' was '" + (other[property] ? jasmine.util.htmlEscape(other[property].toString()) : other[property]) + "' in expected, but was '" + (this.sample[property] ? jasmine.util.htmlEscape(this.sample[property].toString()) : this.sample[property]) + "' in actual.");
    }
  }

  return (mismatchKeys.length === 0 && mismatchValues.length === 0);
***REMOVED***

jasmine.Matchers.ObjectContaining.prototype.jasmineToString = function () {
  return "<jasmine.objectContaining(" + jasmine.pp(this.sample) + ")>";
***REMOVED***
// Mock setTimeout, clearTimeout
// Contributed by Pivotal Computer Systems, www.pivotalsf.com

jasmine.FakeTimer = function() {
  this.reset();

***REMOVED***
  self.setTimeout = function(funcToCall, millis) {
    self.timeoutsMade++;
    self.scheduleFunction(self.timeoutsMade, funcToCall, millis, false);
    return self.timeoutsMade;
 ***REMOVED*****REMOVED***

  self.setInterval = function(funcToCall, millis) {
    self.timeoutsMade++;
    self.scheduleFunction(self.timeoutsMade, funcToCall, millis, true);
    return self.timeoutsMade;
 ***REMOVED*****REMOVED***

  self.clearTimeout = function(timeoutKey) {
    self.scheduledFunctions[timeoutKey] = jasmine.undefined;
 ***REMOVED*****REMOVED***

  self.clearInterval = function(timeoutKey) {
    self.scheduledFunctions[timeoutKey] = jasmine.undefined;
 ***REMOVED*****REMOVED***

***REMOVED***

jasmine.FakeTimer.prototype.reset = function() {
  this.timeoutsMade = 0;
  this.scheduledFunctions = {***REMOVED***
  this.nowMillis = 0;
***REMOVED***

jasmine.FakeTimer.prototype.tick = function(millis) {
  var oldMillis = this.nowMillis;
  var newMillis = oldMillis + millis;
  this.runFunctionsWithinRange(oldMillis, newMillis);
  this.nowMillis = newMillis;
***REMOVED***

jasmine.FakeTimer.prototype.runFunctionsWithinRange = function(oldMillis, nowMillis) {
  var scheduledFunc;
  var funcsToRun = [];
  for (var timeoutKey in this.scheduledFunctions) {
    scheduledFunc = this.scheduledFunctions[timeoutKey];
    if (scheduledFunc != jasmine.undefined &&
        scheduledFunc.runAtMillis >= oldMillis &&
        scheduledFunc.runAtMillis <= nowMillis) {
      funcsToRun.push(scheduledFunc);
      this.scheduledFunctions[timeoutKey] = jasmine.undefined;
    }
  }

  if (funcsToRun.length > 0) {
    funcsToRun.sort(function(a, b) {
      return a.runAtMillis - b.runAtMillis;
    });
    for (var i = 0; i < funcsToRun.length; ++i) {
      try {
        var funcToRun = funcsToRun[i];
        this.nowMillis = funcToRun.runAtMillis;
        funcToRun.funcToCall();
        if (funcToRun.recurring) {
          this.scheduleFunction(funcToRun.timeoutKey,
              funcToRun.funcToCall,
              funcToRun.millis,
              true);
        }
      } catch(e) {
      }
    }
    this.runFunctionsWithinRange(oldMillis, nowMillis);
  }
***REMOVED***

jasmine.FakeTimer.prototype.scheduleFunction = function(timeoutKey, funcToCall, millis, recurring) {
  this.scheduledFunctions[timeoutKey] = {
    runAtMillis: this.nowMillis + millis,
    funcToCall: funcToCall,
    recurring: recurring,
    timeoutKey: timeoutKey,
    millis: millis
 ***REMOVED*****REMOVED***
***REMOVED***

***REMOVED***
***REMOVED*** @namespace
***REMOVED***
jasmine.Clock = {
  defaultFakeTimer: new jasmine.FakeTimer(),

  reset: function() {
    jasmine.Clock.assertInstalled();
    jasmine.Clock.defaultFakeTimer.reset();
  },

  tick: function(millis) {
    jasmine.Clock.assertInstalled();
    jasmine.Clock.defaultFakeTimer.tick(millis);
  },

  runFunctionsWithinRange: function(oldMillis, nowMillis) {
    jasmine.Clock.defaultFakeTimer.runFunctionsWithinRange(oldMillis, nowMillis);
  },

  scheduleFunction: function(timeoutKey, funcToCall, millis, recurring) {
    jasmine.Clock.defaultFakeTimer.scheduleFunction(timeoutKey, funcToCall, millis, recurring);
  },

  useMock: function() {
    if (!jasmine.Clock.isInstalled()) {
      var spec = jasmine.getEnv().currentSpec;
      spec.after(jasmine.Clock.uninstallMock);

      jasmine.Clock.installMock();
    }
  },

  installMock: function() {
    jasmine.Clock.installed = jasmine.Clock.defaultFakeTimer;
  },

  uninstallMock: function() {
    jasmine.Clock.assertInstalled();
    jasmine.Clock.installed = jasmine.Clock.real;
  },

  real: {
    setTimeout: jasmine.getGlobal().setTimeout,
    clearTimeout: jasmine.getGlobal().clearTimeout,
    setInterval: jasmine.getGlobal().setInterval,
    clearInterval: jasmine.getGlobal().clearInterval
  },

  assertInstalled: function() {
    if (!jasmine.Clock.isInstalled()) {
      throw new Error("Mock clock is not installed, use jasmine.Clock.useMock()");
    }
  },

  isInstalled: function() {
    return jasmine.Clock.installed == jasmine.Clock.defaultFakeTimer;
  },

  installed: null
***REMOVED***
jasmine.Clock.installed = jasmine.Clock.real;

//else for IE support
jasmine.getGlobal().setTimeout = function(funcToCall, millis) {
  if (jasmine.Clock.installed.setTimeout.apply) {
    return jasmine.Clock.installed.setTimeout.apply(this, arguments);
  } else {
    return jasmine.Clock.installed.setTimeout(funcToCall, millis);
  }
***REMOVED***

jasmine.getGlobal().setInterval = function(funcToCall, millis) {
  if (jasmine.Clock.installed.setInterval.apply) {
    return jasmine.Clock.installed.setInterval.apply(this, arguments);
  } else {
    return jasmine.Clock.installed.setInterval(funcToCall, millis);
  }
***REMOVED***

jasmine.getGlobal().clearTimeout = function(timeoutKey) {
  if (jasmine.Clock.installed.clearTimeout.apply) {
    return jasmine.Clock.installed.clearTimeout.apply(this, arguments);
  } else {
    return jasmine.Clock.installed.clearTimeout(timeoutKey);
  }
***REMOVED***

jasmine.getGlobal().clearInterval = function(timeoutKey) {
  if (jasmine.Clock.installed.clearTimeout.apply) {
    return jasmine.Clock.installed.clearInterval.apply(this, arguments);
  } else {
    return jasmine.Clock.installed.clearInterval(timeoutKey);
  }
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
jasmine.MultiReporter = function() {
  this.subReporters_ = [];
***REMOVED***
jasmine.util.inherit(jasmine.MultiReporter, jasmine.Reporter);

jasmine.MultiReporter.prototype.addReporter = function(reporter) {
  this.subReporters_.push(reporter);
***REMOVED***

(function() {
  var functionNames = [
    "reportRunnerStarting",
    "reportRunnerResults",
    "reportSuiteResults",
    "reportSpecStarting",
    "reportSpecResults",
    "log"
  ];
  for (var i = 0; i < functionNames.length; i++) {
    var functionName = functionNames[i];
    jasmine.MultiReporter.prototype[functionName] = (function(functionName) {
      return function() {
        for (var j = 0; j < this.subReporters_.length; j++) {
          var subReporter = this.subReporters_[j];
          if (subReporter[functionName]) {
            subReporter[functionName].apply(subReporter, arguments);
          }
        }
     ***REMOVED*****REMOVED***
    })(functionName);
  }
})();
***REMOVED***
***REMOVED*** Holds results for a set of Jasmine spec. Allows for the results array to hold another jasmine.NestedResults
***REMOVED***
***REMOVED***
***REMOVED***
jasmine.NestedResults = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The total count of results
 ***REMOVED*****REMOVED***
  this.totalCount = 0;
 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of passed results
 ***REMOVED*****REMOVED***
  this.passedCount = 0;
 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of failed results
 ***REMOVED*****REMOVED***
  this.failedCount = 0;
 ***REMOVED*****REMOVED***
  ***REMOVED*** Was this suite/spec skipped?
 ***REMOVED*****REMOVED***
  this.skipped = false;
 ***REMOVED*****REMOVED***
  ***REMOVED*** @ignore
 ***REMOVED*****REMOVED***
  this.items_ = [];
***REMOVED***

***REMOVED***
***REMOVED*** Roll up the result counts.
***REMOVED***
***REMOVED*** @param result
***REMOVED***
jasmine.NestedResults.prototype.rollupCounts = function(result) {
  this.totalCount += result.totalCount;
  this.passedCount += result.passedCount;
  this.failedCount += result.failedCount;
***REMOVED***

***REMOVED***
***REMOVED*** Adds a log message.
***REMOVED*** @param values Array of message parts which will be concatenated later.
***REMOVED***
jasmine.NestedResults.prototype.log = function(values) {
  this.items_.push(new jasmine.MessageResult(values));
***REMOVED***

***REMOVED***
***REMOVED*** Getter for the results: message & results.
***REMOVED***
jasmine.NestedResults.prototype.getItems = function() {
  return this.items_;
***REMOVED***

***REMOVED***
***REMOVED*** Adds a result, tracking counts (total, passed, & failed)
***REMOVED*** @param {jasmine.ExpectationResult|jasmine.NestedResults} result
***REMOVED***
jasmine.NestedResults.prototype.addResult = function(result) {
  if (result.type != 'log') {
    if (result.items_) {
      this.rollupCounts(result);
    } else {
      this.totalCount++;
      if (result.passed()) {
        this.passedCount++;
      } else {
        this.failedCount++;
      }
    }
  }
  this.items_.push(result);
***REMOVED***

***REMOVED***
***REMOVED*** @returns {Boolean} True if <b>everything</b> below passed
***REMOVED***
jasmine.NestedResults.prototype.passed = function() {
  return this.passedCount === this.totalCount;
***REMOVED***
***REMOVED***
***REMOVED*** Base class for pretty printing for expectation results.
***REMOVED***
jasmine.PrettyPrinter = function() {
  this.ppNestLevel_ = 0;
***REMOVED***

***REMOVED***
***REMOVED*** Formats a value in a nice, human-readable string.
***REMOVED***
***REMOVED*** @param value
***REMOVED***
jasmine.PrettyPrinter.prototype.format = function(value) {
  if (this.ppNestLevel_ > 40) {
    throw new Error('jasmine.PrettyPrinter: format() nested too deeply!');
  }

  this.ppNestLevel_++;
  try {
    if (value === jasmine.undefined) {
      this.emitScalar('undefined');
    } else if (value === null) {
      this.emitScalar('null');
    } else if (value === jasmine.getGlobal()) {
      this.emitScalar('<global>');
    } else if (value.jasmineToString) {
      this.emitScalar(value.jasmineToString());
    } else if (typeof value === 'string') {
      this.emitString(value);
    } else if (jasmine.isSpy(value)) {
      this.emitScalar("spy on " + value.identity);
    } else if (value instanceof RegExp) {
      this.emitScalar(value.toString());
    } else if (typeof value === 'function') {
      this.emitScalar('Function');
    } else if (typeof value.nodeType === 'number') {
      this.emitScalar('HTMLNode');
    } else if (value instanceof Date) {
      this.emitScalar('Date(' + value + ')');
    } else if (value.__Jasmine_been_here_before__) {
      this.emitScalar('<circular reference: ' + (jasmine.isArray_(value) ? 'Array' : 'Object') + '>');
    } else if (jasmine.isArray_(value) || typeof value == 'object') {
      value.__Jasmine_been_here_before__ = true;
      if (jasmine.isArray_(value)) {
        this.emitArray(value);
      } else {
        this.emitObject(value);
      }
      delete value.__Jasmine_been_here_before__;
    } else {
      this.emitScalar(value.toString());
    }
  } finally {
    this.ppNestLevel_--;
  }
***REMOVED***

jasmine.PrettyPrinter.prototype.iterateObject = function(obj, fn) {
  for (var property in obj) {
    if (property == '__Jasmine_been_here_before__') {
        continue;
    }
    fn(property, obj.__lookupGetter__ ? (obj.__lookupGetter__(property) !== jasmine.undefined &&
                                         obj.__lookupGetter__(property) !== null) : false);
  }
***REMOVED***

jasmine.PrettyPrinter.prototype.emitArray = jasmine.unimplementedMethod_;
jasmine.PrettyPrinter.prototype.emitObject = jasmine.unimplementedMethod_;
jasmine.PrettyPrinter.prototype.emitScalar = jasmine.unimplementedMethod_;
jasmine.PrettyPrinter.prototype.emitString = jasmine.unimplementedMethod_;

jasmine.StringPrettyPrinter = function() {
  jasmine.PrettyPrinter.call(this);

  this.string = '';
***REMOVED***
jasmine.util.inherit(jasmine.StringPrettyPrinter, jasmine.PrettyPrinter);

jasmine.StringPrettyPrinter.prototype.emitScalar = function(value) {
  this.append(value);
***REMOVED***

jasmine.StringPrettyPrinter.prototype.emitString = function(value) {
  this.append("'" + value + "'");
***REMOVED***

jasmine.StringPrettyPrinter.prototype.emitArray = function(array) {
  this.append('[ ');
  for (var i = 0; i < array.length; i++) {
    if (i > 0) {
      this.append(', ');
    }
    this.format(array[i]);
  }
  this.append(' ]');
***REMOVED***

jasmine.StringPrettyPrinter.prototype.emitObject = function(obj) {
***REMOVED***
  this.append('{ ');
  var first = true;

  this.iterateObject(obj, function(property, isGetter) {
    if (first) {
      first = false;
    } else {
      self.append(', ');
    }

    self.append(property);
    self.append(' : ');
    if (isGetter) {
      self.append('<getter>');
    } else {
      self.format(obj[property]);
    }
  });

  this.append(' }');
***REMOVED***

jasmine.StringPrettyPrinter.prototype.append = function(value) {
  this.string += value;
***REMOVED***
jasmine.Queue = function(env) {
  this.env = env;
  this.blocks = [];
  this.running = false;
  this.index = 0;
  this.offset = 0;
  this.abort = false;
***REMOVED***

jasmine.Queue.prototype.addBefore = function(block) {
  this.blocks.unshift(block);
***REMOVED***

jasmine.Queue.prototype.add = function(block) {
  this.blocks.push(block);
***REMOVED***

jasmine.Queue.prototype.insertNext = function(block) {
  this.blocks.splice((this.index + this.offset + 1), 0, block);
  this.offset++;
***REMOVED***

jasmine.Queue.prototype.start = function(onComplete) {
  this.running = true;
  this.onComplete = onComplete;
  this.next_();
***REMOVED***

jasmine.Queue.prototype.isRunning = function() {
  return this.running;
***REMOVED***

jasmine.Queue.LOOP_DONT_RECURSE = true;

jasmine.Queue.prototype.next_ = function() {
***REMOVED***
  var goAgain = true;

  while (goAgain) {
    goAgain = false;
    if (self.index < self.blocks.length && !this.abort) {
      var calledSynchronously = true;
      var completedSynchronously = false;

      var onComplete = function () {
        if (jasmine.Queue.LOOP_DONT_RECURSE && calledSynchronously) {
          completedSynchronously = true;
          return;
        }

        if (self.blocks[self.index].abort) {
          self.abort = true;
        }

        self.offset = 0;
        self.index++;

        var now = new Date().getTime();
        if (self.env.updateInterval && now - self.env.lastUpdate > self.env.updateInterval) {
          self.env.lastUpdate = now;
          self.env.setTimeout(function() {
            self.next_();
          }, 0);
        } else {
          if (jasmine.Queue.LOOP_DONT_RECURSE && completedSynchronously) {
            goAgain = true;
          } else {
            self.next_();
          }
        }
     ***REMOVED*****REMOVED***
      self.blocks[self.index].execute(onComplete);

      calledSynchronously = false;
      if (completedSynchronously) {
        onComplete();
      }

    } else {
      self.running = false;
      if (self.onComplete) {
        self.onComplete();
      }
    }
  }
***REMOVED***

jasmine.Queue.prototype.results = function() {
  var results = new jasmine.NestedResults();
  for (var i = 0; i < this.blocks.length; i++) {
    if (this.blocks[i].results) {
      results.addResult(this.blocks[i].results());
    }
  }
  return results;
***REMOVED***

***REMOVED***
***REMOVED*** Runner
***REMOVED***
***REMOVED***
***REMOVED*** @param {jasmine.Env} env
***REMOVED***
jasmine.Runner = function(env) {
***REMOVED***
  self.env = env;
  self.queue = new jasmine.Queue(env);
  self.before_ = [];
  self.after_ = [];
  self.suites_ = [];
***REMOVED***

jasmine.Runner.prototype.execute = function() {
***REMOVED***
  if (self.env.reporter.reportRunnerStarting) {
    self.env.reporter.reportRunnerStarting(this);
  }
  self.queue.start(function () {
    self.finishCallback();
  });
***REMOVED***

jasmine.Runner.prototype.beforeEach = function(beforeEachFunction) {
  beforeEachFunction.typeName = 'beforeEach';
  this.before_.splice(0,0,beforeEachFunction);
***REMOVED***

jasmine.Runner.prototype.afterEach = function(afterEachFunction) {
  afterEachFunction.typeName = 'afterEach';
  this.after_.splice(0,0,afterEachFunction);
***REMOVED***

jasmine.Runner.prototype.finishCallback = function() {
  this.env.reporter.reportRunnerResults(this);
***REMOVED***

jasmine.Runner.prototype.addSuite = function(suite) {
  this.suites_.push(suite);
***REMOVED***

jasmine.Runner.prototype.add = function(block) {
  if (block instanceof jasmine.Suite) {
    this.addSuite(block);
  }
  this.queue.add(block);
***REMOVED***

jasmine.Runner.prototype.specs = function () {
  var suites = this.suites();
  var specs = [];
  for (var i = 0; i < suites.length; i++) {
    specs = specs.concat(suites[i].specs());
  }
  return specs;
***REMOVED***

jasmine.Runner.prototype.suites = function() {
  return this.suites_;
***REMOVED***

jasmine.Runner.prototype.topLevelSuites = function() {
  var topLevelSuites = [];
  for (var i = 0; i < this.suites_.length; i++) {
    if (!this.suites_[i].parentSuite) {
      topLevelSuites.push(this.suites_[i]);
    }
  }
  return topLevelSuites;
***REMOVED***

jasmine.Runner.prototype.results = function() {
  return this.queue.results();
***REMOVED***
***REMOVED***
***REMOVED*** Internal representation of a Jasmine specification, or test.
***REMOVED***
***REMOVED***
***REMOVED*** @param {jasmine.Env} env
***REMOVED*** @param {jasmine.Suite} suite
***REMOVED*** @param {String} description
***REMOVED***
jasmine.Spec = function(env, suite, description) {
  if (!env) {
    throw new Error('jasmine.Env() required');
  }
  if (!suite) {
    throw new Error('jasmine.Suite() required');
  }
  var spec = this;
  spec.id = env.nextSpecId ? env.nextSpecId() : null;
  spec.env = env;
  spec.suite = suite;
  spec.description = description;
  spec.queue = new jasmine.Queue(env);

  spec.afterCallbacks = [];
  spec.spies_ = [];

  spec.results_ = new jasmine.NestedResults();
  spec.results_.description = description;
  spec.matchersClass = null;
***REMOVED***

jasmine.Spec.prototype.getFullName = function() {
  return this.suite.getFullName() + ' ' + this.description + '.';
***REMOVED***

jasmine.Spec.prototype.results = function() {
  return this.results_;
***REMOVED***

***REMOVED***
***REMOVED*** All parameters are pretty-printed and concatenated together, then written to the spec's output.
***REMOVED***
***REMOVED*** Be careful not to leave calls to <code>jasmine.log</code> in production code.
***REMOVED***
jasmine.Spec.prototype.log = function() {
  return this.results_.log(arguments);
***REMOVED***

jasmine.Spec.prototype.runs = function (func) {
  var block = new jasmine.Block(this.env, func, this);
  this.addToQueue(block);
  return this;
***REMOVED***

jasmine.Spec.prototype.addToQueue = function (block) {
  if (this.queue.isRunning()) {
    this.queue.insertNext(block);
  } else {
    this.queue.add(block);
  }
***REMOVED***

***REMOVED***
***REMOVED*** @param {jasmine.ExpectationResult} result
***REMOVED***
jasmine.Spec.prototype.addMatcherResult = function(result) {
  this.results_.addResult(result);
***REMOVED***

jasmine.Spec.prototype.expect = function(actual) {
  var positive = new (this.getMatchersClass_())(this.env, actual, this);
  positive.not = new (this.getMatchersClass_())(this.env, actual, this, true);
  return positive;
***REMOVED***

***REMOVED***
***REMOVED*** Waits a fixed time period before moving to the next block.
***REMOVED***
***REMOVED*** @deprecated Use waitsFor() instead
***REMOVED*** @param {Number} timeout milliseconds to wait
***REMOVED***
jasmine.Spec.prototype.waits = function(timeout) {
  var waitsFunc = new jasmine.WaitsBlock(this.env, timeout, this);
  this.addToQueue(waitsFunc);
  return this;
***REMOVED***

***REMOVED***
***REMOVED*** Waits for the latchFunction to return true before proceeding to the next block.
***REMOVED***
***REMOVED*** @param {Function} latchFunction
***REMOVED*** @param {String} optional_timeoutMessage
***REMOVED*** @param {Number} optional_timeout
***REMOVED***
jasmine.Spec.prototype.waitsFor = function(latchFunction, optional_timeoutMessage, optional_timeout) {
  var latchFunction_ = null;
  var optional_timeoutMessage_ = null;
  var optional_timeout_ = null;

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    switch (typeof arg) {
      case 'function':
        latchFunction_ = arg;
        break;
      case 'string':
        optional_timeoutMessage_ = arg;
        break;
      case 'number':
        optional_timeout_ = arg;
        break;
    }
  }

  var waitsForFunc = new jasmine.WaitsForBlock(this.env, optional_timeout_, latchFunction_, optional_timeoutMessage_, this);
  this.addToQueue(waitsForFunc);
  return this;
***REMOVED***

jasmine.Spec.prototype.fail = function (e) {
  var expectationResult = new jasmine.ExpectationResult({
    passed: false,
    message: e ? jasmine.util.formatException(e) : 'Exception',
    trace: { stack: e.stack }
  });
  this.results_.addResult(expectationResult);
***REMOVED***

jasmine.Spec.prototype.getMatchersClass_ = function() {
  return this.matchersClass || this.env.matchersClass;
***REMOVED***

jasmine.Spec.prototype.addMatchers = function(matchersPrototype) {
  var parent = this.getMatchersClass_();
  var newMatchersClass = function() {
    parent.apply(this, arguments);
 ***REMOVED*****REMOVED***
  jasmine.util.inherit(newMatchersClass, parent);
  jasmine.Matchers.wrapInto_(matchersPrototype, newMatchersClass);
  this.matchersClass = newMatchersClass;
***REMOVED***

jasmine.Spec.prototype.finishCallback = function() {
  this.env.reporter.reportSpecResults(this);
***REMOVED***

jasmine.Spec.prototype.finish = function(onComplete) {
  this.removeAllSpies();
  this.finishCallback();
  if (onComplete) {
    onComplete();
  }
***REMOVED***

jasmine.Spec.prototype.after = function(doAfter) {
  if (this.queue.isRunning()) {
    this.queue.add(new jasmine.Block(this.env, doAfter, this));
  } else {
    this.afterCallbacks.unshift(doAfter);
  }
***REMOVED***

jasmine.Spec.prototype.execute = function(onComplete) {
  var spec = this;
  if (!spec.env.specFilter(spec)) {
    spec.results_.skipped = true;
    spec.finish(onComplete);
    return;
  }

  this.env.reporter.reportSpecStarting(this);

  spec.env.currentSpec = spec;

  spec.addBeforesAndAftersToQueue();

  spec.queue.start(function () {
    spec.finish(onComplete);
  });
***REMOVED***

jasmine.Spec.prototype.addBeforesAndAftersToQueue = function() {
  var runner = this.env.currentRunner();
  var i;

  for (var suite = this.suite; suite; suite = suite.parentSuite) {
    for (i = 0; i < suite.before_.length; i++) {
      this.queue.addBefore(new jasmine.Block(this.env, suite.before_[i], this));
    }
  }
  for (i = 0; i < runner.before_.length; i++) {
    this.queue.addBefore(new jasmine.Block(this.env, runner.before_[i], this));
  }
  for (i = 0; i < this.afterCallbacks.length; i++) {
    this.queue.add(new jasmine.Block(this.env, this.afterCallbacks[i], this));
  }
  for (suite = this.suite; suite; suite = suite.parentSuite) {
    for (i = 0; i < suite.after_.length; i++) {
      this.queue.add(new jasmine.Block(this.env, suite.after_[i], this));
    }
  }
  for (i = 0; i < runner.after_.length; i++) {
    this.queue.add(new jasmine.Block(this.env, runner.after_[i], this));
  }
***REMOVED***

jasmine.Spec.prototype.explodes = function() {
  throw 'explodes function should not have been called';
***REMOVED***

jasmine.Spec.prototype.spyOn = function(obj, methodName, ignoreMethodDoesntExist) {
  if (obj == jasmine.undefined) {
    throw "spyOn could not find an object to spy upon for " + methodName + "()";
  }

  if (!ignoreMethodDoesntExist && obj[methodName] === jasmine.undefined) {
    throw methodName + '() method does not exist';
  }

  if (!ignoreMethodDoesntExist && obj[methodName] && obj[methodName].isSpy) {
    throw new Error(methodName + ' has already been spied upon');
  }

  var spyObj = jasmine.createSpy(methodName);

  this.spies_.push(spyObj);
  spyObj.baseObj = obj;
  spyObj.methodName = methodName;
  spyObj.originalValue = obj[methodName];

  obj[methodName] = spyObj;

  return spyObj;
***REMOVED***

jasmine.Spec.prototype.removeAllSpies = function() {
  for (var i = 0; i < this.spies_.length; i++) {
    var spy = this.spies_[i];
    spy.baseObj[spy.methodName] = spy.originalValue;
  }
  this.spies_ = [];
***REMOVED***

***REMOVED***
***REMOVED*** Internal representation of a Jasmine suite.
***REMOVED***
***REMOVED***
***REMOVED*** @param {jasmine.Env} env
***REMOVED*** @param {String} description
***REMOVED*** @param {Function} specDefinitions
***REMOVED*** @param {jasmine.Suite} parentSuite
***REMOVED***
jasmine.Suite = function(env, description, specDefinitions, parentSuite) {
***REMOVED***
  self.id = env.nextSuiteId ? env.nextSuiteId() : null;
  self.description = description;
  self.queue = new jasmine.Queue(env);
  self.parentSuite = parentSuite;
  self.env = env;
  self.before_ = [];
  self.after_ = [];
  self.children_ = [];
  self.suites_ = [];
  self.specs_ = [];
***REMOVED***

jasmine.Suite.prototype.getFullName = function() {
  var fullName = this.description;
  for (var parentSuite = this.parentSuite; parentSuite; parentSuite = parentSuite.parentSuite) {
    fullName = parentSuite.description + ' ' + fullName;
  }
  return fullName;
***REMOVED***

jasmine.Suite.prototype.finish = function(onComplete) {
  this.env.reporter.reportSuiteResults(this);
  this.finished = true;
  if (typeof(onComplete) == 'function') {
    onComplete();
  }
***REMOVED***

jasmine.Suite.prototype.beforeEach = function(beforeEachFunction) {
  beforeEachFunction.typeName = 'beforeEach';
  this.before_.unshift(beforeEachFunction);
***REMOVED***

jasmine.Suite.prototype.afterEach = function(afterEachFunction) {
  afterEachFunction.typeName = 'afterEach';
  this.after_.unshift(afterEachFunction);
***REMOVED***

jasmine.Suite.prototype.results = function() {
  return this.queue.results();
***REMOVED***

jasmine.Suite.prototype.add = function(suiteOrSpec) {
  this.children_.push(suiteOrSpec);
  if (suiteOrSpec instanceof jasmine.Suite) {
    this.suites_.push(suiteOrSpec);
    this.env.currentRunner().addSuite(suiteOrSpec);
  } else {
    this.specs_.push(suiteOrSpec);
  }
  this.queue.add(suiteOrSpec);
***REMOVED***

jasmine.Suite.prototype.specs = function() {
  return this.specs_;
***REMOVED***

jasmine.Suite.prototype.suites = function() {
  return this.suites_;
***REMOVED***

jasmine.Suite.prototype.children = function() {
  return this.children_;
***REMOVED***

jasmine.Suite.prototype.execute = function(onComplete) {
***REMOVED***
  this.queue.start(function () {
    self.finish(onComplete);
  });
***REMOVED***
jasmine.WaitsBlock = function(env, timeout, spec) {
  this.timeout = timeout;
  jasmine.Block.call(this, env, null, spec);
***REMOVED***

jasmine.util.inherit(jasmine.WaitsBlock, jasmine.Block);

jasmine.WaitsBlock.prototype.execute = function (onComplete) {
  if (jasmine.VERBOSE) {
    this.env.reporter.log('>> Jasmine waiting for ' + this.timeout + ' ms...');
  }
  this.env.setTimeout(function () {
    onComplete();
  }, this.timeout);
***REMOVED***
***REMOVED***
***REMOVED*** A block which waits for some condition to become true, with timeout.
***REMOVED***
***REMOVED***
***REMOVED*** @extends jasmine.Block
***REMOVED*** @param {jasmine.Env} env The Jasmine environment.
***REMOVED*** @param {Number} timeout The maximum time in milliseconds to wait for the condition to become true.
***REMOVED*** @param {Function} latchFunction A function which returns true when the desired condition has been met.
***REMOVED*** @param {String} message The message to display if the desired condition hasn't been met within the given time period.
***REMOVED*** @param {jasmine.Spec} spec The Jasmine spec.
***REMOVED***
jasmine.WaitsForBlock = function(env, timeout, latchFunction, message, spec) {
  this.timeout = timeout || env.defaultTimeoutInterval;
  this.latchFunction = latchFunction;
  this.message = message;
  this.totalTimeSpentWaitingForLatch = 0;
  jasmine.Block.call(this, env, null, spec);
***REMOVED***
jasmine.util.inherit(jasmine.WaitsForBlock, jasmine.Block);

jasmine.WaitsForBlock.TIMEOUT_INCREMENT = 10;

jasmine.WaitsForBlock.prototype.execute = function(onComplete) {
  if (jasmine.VERBOSE) {
    this.env.reporter.log('>> Jasmine waiting for ' + (this.message || 'something to happen'));
  }
  var latchFunctionResult;
  try {
    latchFunctionResult = this.latchFunction.apply(this.spec);
  } catch (e) {
    this.spec.fail(e);
    onComplete();
    return;
  }

  if (latchFunctionResult) {
    onComplete();
  } else if (this.totalTimeSpentWaitingForLatch >= this.timeout) {
    var message = 'timed out after ' + this.timeout + ' msec waiting for ' + (this.message || 'something to happen');
    this.spec.fail({
      name: 'timeout',
      message: message
    });

    this.abort = true;
    onComplete();
  } else {
    this.totalTimeSpentWaitingForLatch += jasmine.WaitsForBlock.TIMEOUT_INCREMENT;
  ***REMOVED***
    this.env.setTimeout(function() {
      self.execute(onComplete);
    }, jasmine.WaitsForBlock.TIMEOUT_INCREMENT);
  }
***REMOVED***

jasmine.version_= {
  "major": 1,
  "minor": 2,
  "build": 0,
  "revision": 1333557965,
  "release_candidate": 3
***REMOVED***
