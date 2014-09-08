***REMOVED***
***REMOVED*** @module jsdoc/tag/type
***REMOVED***
***REMOVED*** @author Michael Mathews <micmath@gmail.com>
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED*** @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

var catharsis = require('catharsis');
var jsdoc = {
    name: require('jsdoc/name'),
    tag: {
        inline: require('jsdoc/tag/inline')
    }
***REMOVED***
var util = require('util');

***REMOVED***
***REMOVED*** Information about a type expression extracted from tag text.
***REMOVED***
***REMOVED*** @typedef TypeExpressionInfo
***REMOVED*** @memberof module:jsdoc/tag/type
***REMOVED*** @property {string} expression - The type expression.
***REMOVED*** @property {string} text - The updated tag text.
***REMOVED***

***REMOVED*** @private***REMOVED***
function unescapeBraces(text) {
    return text.replace(/\\\{/g, '{')
        .replace(/\\\}/g, '}');
}

***REMOVED***
***REMOVED*** Extract a type expression from the tag text.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} string - The tag text.
***REMOVED*** @return {module:jsdoc/tag/type.TypeExpressionInfo} The type expression and updated tag text.
***REMOVED***
 function extractTypeExpression(string) {
    var completeExpression;
    var count = 0;
    var position = 0;
    var expression = '';
    var startIndex = string.search(/\{[^@]/);
    var textStartIndex;

    if (startIndex !== -1) {
        // advance to the first character in the type expression
        position = textStartIndex = startIndex + 1;
        count++;

        while (position < string.length) {
            switch (string[position]) {
                case '\\':
                    // backslash is an escape character, so skip the next character
                    position++;
                    break;
                case '{':
                    count++;
                    break;
                case '}':
                    count--;
                    break;
                default:
                    // do nothing
            }

            if (count === 0) {
                completeExpression = string.slice(startIndex, position + 1);
                expression = string.slice(textStartIndex, position).trim();
                break;
            }

            position++;
        }
    }

    string = completeExpression ? string.replace(completeExpression, '') : string;

    return {
        expression: unescapeBraces(expression),
        newString: string.trim()
   ***REMOVED*****REMOVED***
}

***REMOVED*** @private***REMOVED***
function getTagInfo(tagValue, canHaveName, canHaveType) {
    var name = '';
    var typeExpression = '';
    var text = tagValue;
    var expressionAndText;
    var nameAndDescription;
    var typeOverride;

    if (canHaveType) {
        expressionAndText = extractTypeExpression(text);
        typeExpression = expressionAndText.expression;
        text = expressionAndText.newString;
    }

    if (canHaveName) {
        nameAndDescription = jsdoc.name.splitName(text);
        name = nameAndDescription.name;
        text = nameAndDescription.description;
    }

    // an inline @type tag, like {@type Foo}, overrides the type expression
    if (canHaveType) {
        typeOverride = jsdoc.tag.inline.extractInlineTag(text, 'type');
        if (typeOverride.tags && typeOverride.tags[0]) {
            typeExpression = typeOverride.tags[0].text;
        }
        text = typeOverride.newString;
    }

    return {
        name: name,
        typeExpression: typeExpression,
        text: text
   ***REMOVED*****REMOVED***
}

***REMOVED***
***REMOVED*** Information provided in a JSDoc tag.
***REMOVED***
***REMOVED*** @typedef {Object} TagInfo
***REMOVED*** @memberof module:jsdoc/tag/type
***REMOVED*** @property {string} TagInfo.defaultvalue - The default value of the member.
***REMOVED*** @property {string} TagInfo.name - The name of the member (for example, `myParamName`).
***REMOVED*** @property {boolean} TagInfo.nullable - Indicates whether the member can be set to `null` or
***REMOVED*** `undefined`.
***REMOVED*** @property {boolean} TagInfo.optional - Indicates whether the member is optional.
***REMOVED*** @property {string} TagInfo.text - Descriptive text for the member (for example, `The user's email
***REMOVED*** address.`).
***REMOVED*** @property {Array.<string>} TagInfo.type - The type or types that the member can contain (for
***REMOVED*** example, `string` or `MyNamespace.MyClass`).
***REMOVED*** @property {string} TagInfo.typeExpression - The type expression that was parsed to identify the
***REMOVED*** types.
***REMOVED*** @property {boolean} TagInfo.variable - Indicates whether the number of members that are provided
***REMOVED*** can vary (for example, in a function that accepts any number of parameters).
***REMOVED***

// TODO: move to module:jsdoc/name?
***REMOVED***
***REMOVED*** Extract JSDoc-style type information from the name specified in the tag info, including the
***REMOVED*** member name; whether the member is optional; and the default value of the member.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {module:jsdoc/tag/type.TagInfo} tagInfo - Information contained in the tag.
***REMOVED*** @return {module:jsdoc/tag/type.TagInfo} Updated information from the tag.
***REMOVED***
function parseName(tagInfo) {
    // like '[foo]' or '[ foo ]' or '[foo=bar]' or '[ foo=bar ]' or '[ foo = bar ]'
    if ( /^\[\s*(.+?)\s*\]$/.test(tagInfo.name) ) {
        tagInfo.name = RegExp.$1;
        tagInfo.optional = true;

        // like 'foo=bar' or 'foo = bar'
        if ( /^(.+?)\s*=\s*(.+)$/.test(tagInfo.name) ) {
            tagInfo.name = RegExp.$1;
            tagInfo.defaultvalue = RegExp.$2;
        }
    }

    return tagInfo;
}

***REMOVED*** @private***REMOVED***
function getTypeStrings(parsedType, isOutermostType) {
    var applications;
    var typeString;

    var types = [];

    var TYPES = catharsis.Types;

    switch(parsedType.type) {
        case TYPES.AllLiteral:
            types.push('*');
            break;
        case TYPES.FunctionType:
            types.push('function');
            break;
        case TYPES.NameExpression:
            types.push(parsedType.name);
            break;
        case TYPES.NullLiteral:
            types.push('null');
            break;
        case TYPES.RecordType:
            types.push('Object');
            break;
        case TYPES.TypeApplication:
            // if this is the outermost type, we strip the modifiers; otherwise, we keep them
            if (isOutermostType) {
                applications = parsedType.applications.map(function(application) {
                    return getTypeStrings(application);
                }).join(', ');
                typeString = util.format( '%s.<%s>', getTypeStrings(parsedType.expression),
                    applications );

                types.push(typeString);
            }
            else {
                types.push( catharsis.stringify(parsedType) );
            }
            break;
        case TYPES.TypeUnion:
            parsedType.elements.forEach(function(element) {
                types = types.concat( getTypeStrings(element) );
            });
            break;
        case TYPES.UndefinedLiteral:
            types.push('undefined');
            break;
        case TYPES.UnknownLiteral:
            types.push('?');
            break;
        default:
            // this shouldn't happen
            throw new Error( util.format('unrecognized type %s in parsed type: %j', parsedType.type,
                parsedType) );
    }

    return types;
}

***REMOVED***
***REMOVED*** Extract JSDoc-style and Closure Compiler-style type information from the type expression
***REMOVED*** specified in the tag info.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {module:jsdoc/tag/type.TagInfo} tagInfo - Information contained in the tag.
***REMOVED*** @return {module:jsdoc/tag/type.TagInfo} Updated information from the tag.
***REMOVED***
function parseTypeExpression(tagInfo) {
    var errorMessage;
    var parsedType;

    // don't try to parse empty type expressions
    if (!tagInfo.typeExpression) {
        return tagInfo;
    }

    try {
        parsedType = catharsis.parse(tagInfo.typeExpression, {jsdoc: true});
    }
    catch (e) {
        // always re-throw so the caller has a chance to report which file was bad
        throw new Error( util.format('Invalid type expression "%s": %s', tagInfo.typeExpression,
            e.message) );
    }

    tagInfo.type = tagInfo.type.concat( getTypeStrings(parsedType, true) );

    // Catharsis and JSDoc use the same names for 'optional' and 'nullable'...
    ['optional', 'nullable'].forEach(function(key) {
        if (parsedType[key] !== null && parsedType[key] !== undefined) {
            tagInfo[key] = parsedType[key];
        }
    });

    // ...but not 'variable'.
    if (parsedType.repeatable !== null && parsedType.repeatable !== undefined) {
        tagInfo.variable = parsedType.repeatable;
    }

    return tagInfo;
}

// TODO: allow users to add/remove type parsers (perhaps via plugins)
var typeParsers = [parseName, parseTypeExpression];

***REMOVED***
***REMOVED*** Parse the value of a JSDoc tag.
***REMOVED***
***REMOVED*** @param {string} tagValue - The value of the tag. For example, the tag `@param {string} name` has
***REMOVED*** a value of `{string} name`.
***REMOVED*** @param {boolean} canHaveName - Indicates whether the value can include a symbol name.
***REMOVED*** @param {boolean} canHaveType - Indicates whether the value can include a type expression that
***REMOVED*** describes the symbol.
***REMOVED*** @return {module:jsdoc/tag/type.TagInfo} Information obtained from the tag.
***REMOVED*** @throws {Error} Thrown if a type expression cannot be parsed.
***REMOVED***
exports.parse = function(tagValue, canHaveName, canHaveType) {
    if (typeof tagValue !== 'string') { tagValue = ''; }

    var tagInfo = getTagInfo(tagValue, canHaveName, canHaveType);
    tagInfo.type = tagInfo.type || [];

    typeParsers.forEach(function(parser) {
        tagInfo = parser.call(this, tagInfo);
    });

    // if we wanted a type, but the parsers didn't add any type names, use the type expression
    if (canHaveType && !tagInfo.type.length && tagInfo.typeExpression) {
        tagInfo.type = [tagInfo.typeExpression];
    }

    return tagInfo;
***REMOVED***
