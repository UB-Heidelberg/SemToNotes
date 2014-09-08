***REMOVED***
***REMOVED*** @module jsdoc/tag/inline
***REMOVED***
***REMOVED*** @author Jeff Williams <jeffrey.l.williams@gmail.com>
***REMOVED*** @license Apache License 2.0 - See file 'LICENSE.md' in this project.
***REMOVED***
'use strict';

***REMOVED***
***REMOVED*** Information about an inline tag that was found within a string.
***REMOVED***
***REMOVED*** @typedef {Object} InlineTagInfo
***REMOVED*** @memberof module:jsdoc/tag/inline
***REMOVED*** @property {?string} completeTag - The entire inline tag, including its enclosing braces.
***REMOVED*** @property {?string} tag - The tag whose text was found.
***REMOVED*** @property {?string} text - The tag text that was found.
***REMOVED***

***REMOVED***
***REMOVED*** Information about the results of replacing inline tags within a string.
***REMOVED***
***REMOVED*** @typedef {Object} InlineTagResult
***REMOVED*** @memberof module:jsdoc/tag/inline
***REMOVED*** @property {Array.<module:jsdoc/tag/inline.InlineTagInfo>} tags - The inline tags that were found.
***REMOVED*** @property {string} newString - The updated text string after extracting or replacing the inline
***REMOVED*** tags.
***REMOVED***

***REMOVED***
***REMOVED*** Text-replacing function for strings that contain an inline tag.
***REMOVED***
***REMOVED*** @callback InlineTagReplacer
***REMOVED*** @memberof module:jsdoc/tag/inline
***REMOVED*** @param {string} string - The complete string containing the inline tag.
***REMOVED*** @param {module:jsdoc/tag/inline.InlineTagInfo} tagInfo - Information about the inline tag.
***REMOVED*** @return {string} An updated version of the complete string.
***REMOVED***

***REMOVED***
***REMOVED*** Create a regexp that matches a specific inline tag, or all inline tags.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @memberof module:jsdoc/tag/inline
***REMOVED*** @param {?string} tagName - The inline tag that the regexp will match. May contain regexp
***REMOVED*** characters. If omitted, matches any string.
***REMOVED*** @param {?string} prefix - A prefix for the regexp. Defaults to an empty string.
***REMOVED*** @param {?string} suffix - A suffix for the regexp. Defaults to an empty string.
***REMOVED*** @returns {RegExp} A regular expression that matches the requested inline tag.
***REMOVED***
function regExpFactory(tagName, prefix, suffix) {
    tagName = tagName || '\\S+';
    prefix = prefix || '';
    suffix = suffix || '';

    return new RegExp(prefix + '\\{@' + tagName + '\\s+((?:.|\n)+?)\\}' + suffix, 'gi');
}

***REMOVED***
***REMOVED*** Check whether a string is an inline tag. You can check for a specific inline tag or for any valid
***REMOVED*** inline tag.
***REMOVED***
***REMOVED*** @param {string} string - The string to check.
***REMOVED*** @param {?string} tagName - The inline tag to match. May contain regexp characters. If this
***REMOVED*** parameter is omitted, this method returns `true` for any valid inline tag.
***REMOVED*** @returns {boolean} Set to `true` if the string is a valid inline tag or `false` in all other
***REMOVED*** cases.
***REMOVED***
exports.isInlineTag = function(string, tagName) {
    return regExpFactory(tagName, '^', '$').test(string);
***REMOVED***

***REMOVED***
***REMOVED*** Replace all instances of multiple inline tags with other text.
***REMOVED***
***REMOVED*** @param {string} string - The string in which to replace the inline tags.
***REMOVED*** @param {Object} replacers - The functions that are used to replace text in the string. The keys
***REMOVED*** must contain tag names (for example, `link`), and the values must contain functions with the
***REMOVED*** type {@link module:jsdoc/tag/inline.InlineTagReplacer}.
***REMOVED*** @return {module:jsdoc/tag/inline.InlineTagResult} The updated string, as well as information
***REMOVED*** about the inline tags that were found.
***REMOVED***
exports.replaceInlineTags = function(string, replacers) {
    var tagInfo = [];

    function replaceMatch(replacer, tag, match, text) {
        var matchedTag = {
            completeTag: match,
            tag: tag,
            text: text
       ***REMOVED*****REMOVED***
        tagInfo.push(matchedTag);

        return replacer(string, matchedTag);
    }

    string = string || '';
    Object.keys(replacers).forEach(function(replacer) {
        var tagRegExp = regExpFactory(replacer);
        var matches;
        // call the replacer once for each match
        while ( (matches = tagRegExp.exec(string)) !== null ) {
            string = replaceMatch(replacers[replacer], replacer, matches[0], matches[1]);
        }
    });

    return {
        tags: tagInfo,
        newString: string.trim()
   ***REMOVED*****REMOVED***
***REMOVED***

***REMOVED***
***REMOVED*** Replace all instances of an inline tag with other text.
***REMOVED***
***REMOVED*** @param {string} string - The string in which to replace the inline tag.
***REMOVED*** @param {string} tag - The name of the inline tag to replace.
***REMOVED*** @param {module:jsdoc/tag/inline.InlineTagReplacer} replacer - The function that is used to
***REMOVED*** replace text in the string.
***REMOVED*** @return {module:jsdoc/tag/inline.InlineTagResult} The updated string, as well as information
***REMOVED*** about the inline tags that were found.
***REMOVED***
exports.replaceInlineTag = function(string, tag, replacer) {
    var replacers = {***REMOVED***
    replacers[tag] = replacer;

    return exports.replaceInlineTags(string, replacers);
***REMOVED***

***REMOVED***
***REMOVED*** Extract inline tags from a string, replacing them with an empty string.
***REMOVED***
***REMOVED*** @param {string} string - The string from which to extract text.
***REMOVED*** @param {?string} tag - The inline tag to extract.
***REMOVED*** @return {module:jsdoc/tag/inline.InlineTagResult} The updated string, as well as information
***REMOVED*** about the inline tags that were found.
***REMOVED***
exports.extractInlineTag = function(string, tag) {
    return exports.replaceInlineTag(string, tag, function(str, tagInfo) {
        return str.replace(tagInfo.completeTag, '');
    });
***REMOVED***
