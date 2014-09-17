/*global env: true***REMOVED***

***REMOVED***
***REMOVED*** Provides access to Markdown-related functions.
***REMOVED*** @module jsdoc/util/markdown
***REMOVED*** @author Michael Mathews <micmath@gmail.com>
***REMOVED*** @author Ben Blank <ben.blank@gmail.com>
***REMOVED***
'use strict';

***REMOVED***
***REMOVED*** Enumeration of Markdown parsers that are available.
***REMOVED*** @enum {String}
***REMOVED***
var parserNames = {
   ***REMOVED*****REMOVED***
    ***REMOVED*** The "[markdown-js](https://github.com/evilstreak/markdown-js)" (aka "evilstreak") parser.
    ***REMOVED***
    ***REMOVED*** @deprecated Replaced by "marked," as markdown-js does not support inline HTML.
   ***REMOVED*****REMOVED***
    evilstreak: 'marked',
   ***REMOVED*****REMOVED***
    ***REMOVED*** The "GitHub-flavored Markdown" parser.
    ***REMOVED*** @deprecated Replaced by "marked."
   ***REMOVED*****REMOVED***
    gfm: 'marked',
   ***REMOVED*****REMOVED***
    ***REMOVED*** The "[Marked](https://github.com/chjj/marked)" parser.
   ***REMOVED*****REMOVED***
    marked: 'marked'
***REMOVED***

***REMOVED***
***REMOVED*** Escape underscores that occur within {@ ... } in order to protect them
***REMOVED*** from the markdown parser(s).
***REMOVED*** @param {String} source the source text to sanitize.
***REMOVED*** @returns {String} `source` where underscores within {@ ... } have been
***REMOVED*** protected with a preceding backslash (i.e. \_) -- the markdown parsers
***REMOVED*** will strip the backslash and protect the underscore.
***REMOVED***
function escapeUnderscores(source) {
    return source.replace(/\{@[^}\r\n]+\}/g, function (wholeMatch) {
        return wholeMatch.replace(/(^|[^\\])_/g, '$1\\_');
    });
}

***REMOVED***
***REMOVED*** Escape HTTP/HTTPS URLs so that they are not automatically converted to HTML links.
***REMOVED***
***REMOVED*** @param {string} source - The source text to escape.
***REMOVED*** @return {string} The source text with escape characters added to HTTP/HTTPS URLs.
***REMOVED***
function escapeUrls(source) {
    return source.replace(/(https?)\:\/\//g, '$1:\\/\\/');
}

***REMOVED***
***REMOVED*** Unescape HTTP/HTTPS URLs after Markdown parsing is complete.
***REMOVED***
***REMOVED*** @param {string} source - The source text to unescape.
***REMOVED*** @return {string} The source text with escape characters removed from HTTP/HTTPS URLs.
***REMOVED***
function unescapeUrls(source) {
    return source.replace(/(https?)\:\\\/\\\//g, '$1://');
}

***REMOVED***
***REMOVED*** Retrieve a function that accepts a single parameter containing Markdown source. The function uses
***REMOVED*** the specified parser to transform the Markdown source to HTML, then returns the HTML as a string.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {String} parserName The name of the selected parser.
***REMOVED*** @param {Object} [conf] Configuration for the selected parser, if any.
***REMOVED*** @returns {Function} A function that accepts Markdown source, feeds it to the selected parser, and
***REMOVED*** returns the resulting HTML.
***REMOVED***
function getParseFunction(parserName, conf) {
    var logger = require('jsdoc/util/logger');
    var marked = require('marked');

    var markedRenderer;
    var parserFunction;

    conf = conf || {***REMOVED***

    if (parserName === parserNames.marked) {
        // Marked generates an "id" attribute for headers; this custom renderer suppresses it
        markedRenderer = new marked.Renderer();
        markedRenderer.heading = function(text, level) {
            var util = require('util');

            return util.format('<h%s>%s</h%s>', level, text, level);
       ***REMOVED*****REMOVED***
        // Allow prettyprint to work on inline code samples
        markedRenderer.code = function(code, language) {
          return '<pre class="prettyprint source"><code>' + code + '</code></pre>';
       ***REMOVED*****REMOVED***

        parserFunction = function(source) {
            var result;

            source = escapeUnderscores(source);
            source = escapeUrls(source);

            result = marked(source, { renderer: markedRenderer })
                .replace(/\s+$/, '')
                .replace(/&#39;/g, "'");
            result = unescapeUrls(result);

            return result;
       ***REMOVED*****REMOVED***
        parserFunction._parser = parserNames.marked;
        return parserFunction;
    }
    else {
        logger.error('Unrecognized Markdown parser "%s". Markdown support is disabled.',
            parserName);
    }
}

***REMOVED***
***REMOVED*** Retrieve a Markdown parsing function based on the value of the `conf.json` file's
***REMOVED*** `env.conf.markdown` property. The parsing function accepts a single parameter containing Markdown
***REMOVED*** source. The function uses the parser specified in `conf.json` to transform the Markdown source to
***REMOVED*** HTML, then returns the HTML as a string.
***REMOVED***
***REMOVED*** @returns {function} A function that accepts Markdown source, feeds it to the selected parser, and
***REMOVED*** returns the resulting HTML.
***REMOVED***
exports.getParser = function() {
    var conf = env.conf.markdown;
    if (conf && conf.parser) {
        return getParseFunction(parserNames[conf.parser], conf);
    }
    else {
        // marked is the default parser
        return getParseFunction(parserNames.marked, conf);
    }
***REMOVED***
