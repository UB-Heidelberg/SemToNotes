***REMOVED***
***REMOVED*** The Overload Helper plugin automatically adds a signature-like string to the longnames of
***REMOVED*** overloaded functions and methods. In JSDoc, this string is known as a _variation_. (The longnames
***REMOVED*** of overloaded constructor functions are _not_ updated, so that JSDoc can identify the class'
***REMOVED*** members correctly.)
***REMOVED***
***REMOVED*** Using this plugin allows you to link to overloaded functions without manually adding `@variation`
***REMOVED*** tags to your documentation.
***REMOVED***
***REMOVED*** For example, suppose your code includes a function named `foo` that you can call in the
***REMOVED*** following ways:
***REMOVED***
***REMOVED*** + `foo()`
***REMOVED*** + `foo(bar)`
***REMOVED*** + `foo(bar, baz)` (where `baz` is repeatable)
***REMOVED***
***REMOVED*** This plugin assigns the following variations and longnames to each version of `foo`:
***REMOVED***
***REMOVED*** + `foo()` gets the variation `()` and the longname `foo()`.
***REMOVED*** + `foo(bar)` gets the variation `(bar)` and the longname `foo(bar)`.
***REMOVED*** + `foo(bar, baz)` (where `baz` is repeatable) gets the variation `(bar, ...baz)` and the longname
***REMOVED*** `foo(bar, ...baz)`.
***REMOVED***
***REMOVED*** You can then link to these functions with `{@link foo()}`, `{@link foo(bar)}`, and
***REMOVED*** `{@link foo(bar, ...baz)`. Note that the variation is based on the names of the function
***REMOVED*** parameters, _not_ their types.
***REMOVED***
***REMOVED*** If you prefer to manually assign variations to certain functions, you can still do so with the
***REMOVED*** `@variation` tag. This plugin will not change these variations or add more variations for that
***REMOVED*** function, as long as the variations you've defined result in unique longnames.
***REMOVED***
***REMOVED*** If an overloaded function includes multiple signatures with the same parameter names, the plugin
***REMOVED*** will assign numeric variations instead, starting at `(1)` and counting upwards.
***REMOVED***
***REMOVED*** @module plugins/overloadHelper
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED*** @license Apache License 2.0
***REMOVED***
'use strict';

// lookup table of function doclets by longname
var functionDoclets;

function hasUniqueValues(obj) {
    var isUnique = true;
    var seen = [];
    Object.keys(obj).forEach(function(key) {
        if (seen.indexOf(obj[key]) !== -1) {
            isUnique = false;
        }

        seen.push(obj[key]);
    });

    return isUnique;
}

function getParamNames(params) {
    var names = [];

    params.forEach(function(param) {
        var name = param.name || '';
        if (param.variable) {
            name = '...' + name;
        }
        if (name !== '') {
            names.push(name);
        }
    });

    return names.length ? names.join(', ') : '';
}

function getParamVariation(doclet) {
    return getParamNames(doclet.params || []);
}

function getUniqueVariations(doclets) {
    var counter = 0;
    var variations = {***REMOVED***
    var docletKeys = Object.keys(doclets);

    function getUniqueNumbers() {
        var format = require('util').format;

        docletKeys.forEach(function(doclet) {
            var newLongname;

            while (true) {
                counter++;
                variations[doclet] = String(counter);

                // is this longname + variation unique?
                newLongname = format('%s(%s)', doclets[doclet].longname, variations[doclet]);
                if ( !functionDoclets[newLongname] ) {
                    break;
                }
            }
        });
    }

    function getUniqueNames() {
        // start by trying to preserve existing variations
        docletKeys.forEach(function(doclet) {
            variations[doclet] = doclets[doclet].variation || getParamVariation(doclets[doclet]);
        });

        // if they're identical, try again, without preserving existing variations
        if ( !hasUniqueValues(variations) ) {
            docletKeys.forEach(function(doclet) {
                variations[doclet] = getParamVariation(doclets[doclet]);
            });

            // if they're STILL identical, switch to numeric variations
            if ( !hasUniqueValues(variations) ) {
                getUniqueNumbers();
            }
        }
    }

    // are we already using numeric variations? if so, keep doing that
    if (functionDoclets[doclets.newDoclet.longname + '(1)']) {
        getUniqueNumbers();
    }
    else {
        getUniqueNames();
    }

    return variations;
}

function ensureUniqueLongname(newDoclet) {
    var doclets = {
        oldDoclet: functionDoclets[newDoclet.longname],
        newDoclet: newDoclet
   ***REMOVED*****REMOVED***
    var docletKeys = Object.keys(doclets);
    var oldDocletLongname;
    var variations = {***REMOVED***

    if (doclets.oldDoclet) {
        oldDocletLongname = doclets.oldDoclet.longname;
        // if the shared longname has a variation, like MyClass#myLongname(variation),
        // remove the variation
        if (doclets.oldDoclet.variation || doclets.oldDoclet.variation === '') {
            docletKeys.forEach(function(doclet) {
                doclets[doclet].longname = doclets[doclet].longname.replace(/\([\s\S]*\)$/, '');
                doclets[doclet].variation = null;
            });
        }

        variations = getUniqueVariations(doclets);

        // update the longnames/variations
        docletKeys.forEach(function(doclet) {
            doclets[doclet].longname += '(' + variations[doclet] + ')';
            doclets[doclet].variation = variations[doclet];
        });

        // update the old doclet in the lookup table
        functionDoclets[oldDocletLongname] = null;
        functionDoclets[doclets.oldDoclet.longname] = doclets.oldDoclet;
    }

    // always store the new doclet in the lookup table
    functionDoclets[doclets.newDoclet.longname] = doclets.newDoclet;

    return doclets.newDoclet;
}

exports.handlers = {
    parseBegin: function() {
        functionDoclets = {***REMOVED***
    },

    newDoclet: function(e) {
        if (e.doclet.kind === 'function') {
            e.doclet = ensureUniqueLongname(e.doclet);
        }
    },

    parseComplete: function() {
        functionDoclets = null;
    }
***REMOVED***
