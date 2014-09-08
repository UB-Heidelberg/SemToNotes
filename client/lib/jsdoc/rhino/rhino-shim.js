/*global env: true, Packages: true***REMOVED***
***REMOVED***
***REMOVED*** @overview A minimal emulation of the standard features of Node.js necessary
***REMOVED*** to get JSDoc to run.
***REMOVED***

// Set the JS version that the Rhino interpreter will use.
version(180);

***REMOVED***
***REMOVED*** Emulate DOM timeout/interval functions.
***REMOVED*** @see https://developer.mozilla.org/en-US/docs/DOM/window#Methods
***REMOVED***
(function() {
    'use strict';

    var timerPool = new java.util.concurrent.ScheduledThreadPoolExecutor(1);
    var timers = {***REMOVED***
    var timerCount = 1;
    var timerUnits = java.util.concurrent.TimeUnit.MILLISECONDS;
    var queue = {***REMOVED***
    var queueActive = false;

    function getCallback(fn) {
        return new java.lang.Runnable({
            run: Packages.org.mozilla.javascript.Context.call(fn)
        });
    }

    global.setTimeout = function setTimeout(fn, delay) {
        var timerId = timerCount++;
        var callback = getCallback(fn);
        timers[timerId] = timerPool.schedule(callback, delay, timerUnits);
        return timerId;
   ***REMOVED*****REMOVED***

    global.clearTimeout = function clearTimeout(timerId) {
        if (timers[timerId]) {
            timerPool.remove(timers[timerId]);
            delete timers[timerId];
        }
   ***REMOVED*****REMOVED***

    global.setInterval = function setInterval(fn, delay) {
        var timerId = timerCount++;
        var callback = getCallback(fn);
        timers[timerId] = timerPool.scheduleAtFixedRate(callback, delay, delay, timerUnits);
        return timerId;
   ***REMOVED*****REMOVED***

    global.clearInterval = global.clearTimeout;

    // adapted from https://github.com/alexgorbatchev/node-browser-builtins
    // MIT license
    global.setImmediate = (function() {
        function drain() {
            var key;

            var keys = Object.keys(queue);

            queueActive = false;

            for (var i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                var fn = queue[key];
                delete queue[key];
                fn();
            }
        }

        return function setImmediate(fn) {
            var timerId = timerCount++;
            queue[timerId] = fn;

            if (!queueActive) {
                queueActive = true;
                global.setTimeout(drain, 0);
            }

            return timerId;
       ***REMOVED*****REMOVED***
    })();

    global.clearImmediate = function clearImmediate(id) {
        delete queue[id];
   ***REMOVED*****REMOVED***
})();

***REMOVED***
***REMOVED*** Emulate Node.js console functions.
***REMOVED*** @see http://nodejs.org/api/stdio.html
***REMOVED***
global.console = (function() {
    function println(stream, args) {
        java.lang.System[stream].println( require('util').format.apply(this, args) );
    }

    return {
        error: function error() {
            println('err', arguments);
        },
        info: function info() {
            println('out', arguments);
        },
        log: function log() {
            println('out', arguments);
        },
        trace: function trace(label) {
            // this puts some extra junk at the top of the stack trace, but it's close enough
            var e = new java.lang.Exception(label || 'Trace');
            e.printStackTrace();
        },
        warn: function warn() {
            println('err', arguments);
        }
   ***REMOVED*****REMOVED***
})();

***REMOVED***
***REMOVED*** Emulate Node.js process functions.
***REMOVED*** @see http://nodejs.org/api/process.html
***REMOVED***
global.process = {
    // not quite right, but close enough
    argv: ['java', env.dirname + '/jsdoc.js']
        .concat( Array.prototype.slice.call(arguments, 0) ),
    // this depends on a hack in our version of Rhino
    cwd: function cwd() {
        var f = new java.io.File( java.lang.System.getProperty('user.dir') );
        return String( f.getAbsolutePath() );
    },
    env: (function() {
        var result = {***REMOVED***

        var env = java.lang.System.getenv();
        var keys = env.keySet().toArray();
        var key;
        for (var i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            result[key + ''] = env.get(key) + '';
        }

        return result;
    })(),
    exit: function exit(n) {
        n = n || 0;
        java.lang.System.exit(n);
    },
    nextTick: function nextTick(callback) {
        setTimeout(callback, 0);
    },
    stderr: {
        // Java can't reliably find the terminal width across platforms, so we hard-code a
        // reasonable value
        columns: 80,
        write: function write(str) {
            java.lang.System.err.print(str);
        }
    },
    stdout: {
        // Java can't reliably find the terminal width across platforms, so we hard-code a
        // reasonable value
        columns: 80,
        write: function write(str) {
            java.lang.System.out.print(str);
        }
    }
***REMOVED***

***REMOVED***
***REMOVED*** Emulate other Node.js globals.
***REMOVED*** @see http://nodejs.org/docs/latest/api/globals.html
***REMOVED***
Object.defineProperties(global, {
    '__dirname': {
        get: function() {
            return global.process.cwd();
        },
        enumerable: true
    }
});
