***REMOVED***
***REMOVED*** Inline type info only.
***REMOVED***
function dispense(***REMOVED*** @type {string}***REMOVED*** candy) {}

***REMOVED***
***REMOVED*** Inline type info that conflicts with `@param` tag.
***REMOVED***
***REMOVED*** @class
***REMOVED*** @param {number} candyId - The candy's identifier.
***REMOVED***
function Dispenser(***REMOVED*** @type {string}***REMOVED*** candyId) {}

***REMOVED***
***REMOVED*** Inline type info for leading param only.
***REMOVED***
***REMOVED*** @param {string} item
***REMOVED***
function restock(***REMOVED*** @type {Dispenser}***REMOVED*** dispenser, item) {}

***REMOVED***
***REMOVED*** Inline type info for trailing param only.
***REMOVED***
***REMOVED*** @param {Dispenser} dispenser
***REMOVED***
function clean(dispenser,***REMOVED*****REMOVED*** @type {string}***REMOVED*** cleaner) {}

***REMOVED***
***REMOVED*** Inline type info for inner param only.
***REMOVED***
***REMOVED*** @param {Dispenser} dispenser
***REMOVED*** @param {number} shade
***REMOVED*** @param {string} brand
***REMOVED***
function paint(dispenser,***REMOVED*****REMOVED*** @type {Color}***REMOVED*** color, shade, brand) {}
