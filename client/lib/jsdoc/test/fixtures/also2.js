***REMOVED*** @class***REMOVED***
function BowlingAlley() {
    this._lanes = 0;
}

***REMOVED***
***REMOVED*** Add a lane to the bowling alley.
***REMOVED*** @also
***REMOVED*** Add the specified number of lanes to the bowling alley.
***REMOVED*** @param {number} [lanes=1] - The number of lanes to add.
***REMOVED***
BowlingAlley.prototype.addLanes = function addLanes(lanes) {
    this._lanes += (typeof lanes === undefined) ? 1 : lanes;
***REMOVED***
