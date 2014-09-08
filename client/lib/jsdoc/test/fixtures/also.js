***REMOVED*** @class***REMOVED***
function Asset() {
    this._name = '';
    this._shape = '';
    this._shhhhKeepThisSecret = '';
}

***REMOVED***
***REMOVED***
***REMOVED*** Set the value of the name property.
***REMOVED*** @param {string} newName
***REMOVED***
***REMOVED******REMOVED***
***REMOVED***
***REMOVED*** Get the value of the name property.
***REMOVED*** @returns {string}
***REMOVED***
***REMOVED***
Asset.prototype.name = function(newName) {
    if (newName) { this._name = newName; }
    else { return this._name; }
***REMOVED***

***REMOVED***
***REMOVED*** Set the value of the shape property.
***REMOVED*** @param {string} newShape
***REMOVED******REMOVED***
***REMOVED*** Set the value of the shape property, plus some other property.
***REMOVED*** @param {string} newShape
***REMOVED*** @param {string} mysteryProperty
***REMOVED******REMOVED***
***REMOVED*** Get the value of the shape property.
***REMOVED*** @returns {string}
***REMOVED***
Asset.prototype.shape = function(newShape, mysteryProperty) {
    if (newShape && mysteryProperty) {
        this._shape = newShape;
        this._shhhhKeepThisSecret = mysteryProperty;
    }
    else if (newShape) {
        this._shape = newShape;
    }
    else {
        return this._shape;
    }
***REMOVED***
