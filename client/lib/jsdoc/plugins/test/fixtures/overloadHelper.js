***REMOVED***
***REMOVED*** A bowl of non-spicy soup.
***REMOVED*** @class
***REMOVED******REMOVED***
***REMOVED*** A bowl of spicy soup.
***REMOVED*** @class
***REMOVED*** @param {number} spiciness - The spiciness of the soup, in Scoville heat units (SHU).
***REMOVED***
function Soup(spiciness) {}

***REMOVED***
***REMOVED*** Slurp the soup.
***REMOVED******REMOVED***
***REMOVED*** Slurp the soup loudly.
***REMOVED*** @param {number} dBA - The slurping volume, in A-weighted decibels.
***REMOVED***
Soup.prototype.slurp = function(dBA) {***REMOVED***

***REMOVED***
***REMOVED*** Salt the soup as needed, using a highly optimized soup-salting heuristic.
***REMOVED******REMOVED***
***REMOVED*** Salt the soup, specifying the amount of salt to add.
***REMOVED*** @variation mg
***REMOVED*** @param {number} amount - The amount of salt to add, in milligrams.
***REMOVED***
Soup.prototype.salt = function(amount) {***REMOVED***

***REMOVED***
***REMOVED*** Heat the soup by the specified number of degrees.
***REMOVED*** @param {number} degrees - The number of degrees, in Fahrenheit, by which to heat the soup.
***REMOVED******REMOVED***
***REMOVED*** Heat the soup by the specified number of degrees.
***REMOVED*** @variation 1
***REMOVED*** @param {string} degrees - The number of degrees, in Fahrenheit, by which to heat the soup, but
***REMOVED*** as a string for some reason.
***REMOVED******REMOVED***
***REMOVED*** Heat the soup by the specified number of degrees.
***REMOVED*** @param {boolean} degrees - The number of degrees, as a boolean. Wait, what?
***REMOVED***
Soup.prototype.heat = function(degrees) {***REMOVED***

***REMOVED***
***REMOVED*** Discard the soup.
***REMOVED*** @variation discardSoup
***REMOVED******REMOVED***
***REMOVED*** Discard the soup by pouring it into the specified container.
***REMOVED*** @variation discardSoup
***REMOVED*** @param {Object} container - The container in which to discard the soup.
***REMOVED***
Soup.prototype.discard = function(container) {***REMOVED***
