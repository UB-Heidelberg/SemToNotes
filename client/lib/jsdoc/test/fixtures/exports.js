***REMOVED***
***REMOVED*** An example of a server-side JavaScript module.
***REMOVED*** @module hello/world
***REMOVED*** @example
***REMOVED***    var g = require('hello/world').sayHello('Gracie');
***REMOVED***

***REMOVED***
***REMOVED*** Generate a greeting.
***REMOVED*** @param {string} [subject="world"] To whom we say hello.
***REMOVED*** @returns {string}
***REMOVED***
exports.sayHello = function(subject) {
    return 'Hello ' + (subject || 'World');
***REMOVED***

***REMOVED***
***REMOVED*** Generate a morose farewell.
***REMOVED*** @param {string} [subject="world"] To whom we say goodbye.
***REMOVED*** @returns {string}
***REMOVED***
module.exports.sayGoodbye = function(subject) {
    return 'Goodbye Cruel ' + (subject || 'World');
***REMOVED***
