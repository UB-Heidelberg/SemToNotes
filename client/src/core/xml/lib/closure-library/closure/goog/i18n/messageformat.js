// Copyright 2010 The Closure Library Authors. All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Message/plural format library with locale support.
***REMOVED***
***REMOVED*** Message format grammar:
***REMOVED***
***REMOVED*** messageFormatPattern := string ( "{" messageFormatElement "}" string )*
***REMOVED*** messageFormatElement := argumentIndex [ "," elementFormat ]
***REMOVED*** elementFormat := "plural" "," pluralStyle
***REMOVED***                  | "selectordinal" "," ordinalStyle
***REMOVED***                  | "select" "," selectStyle
***REMOVED*** pluralStyle :=  pluralFormatPattern
***REMOVED*** ordinalStyle :=  selectFormatPattern
***REMOVED*** selectStyle :=  selectFormatPattern
***REMOVED*** pluralFormatPattern := [ "offset" ":" offsetIndex ] pluralForms*
***REMOVED*** selectFormatPattern := pluralForms*
***REMOVED*** pluralForms := stringKey "{" ( "{" messageFormatElement "}"|string )* "}"
***REMOVED***
***REMOVED*** This is a subset of the ICU MessageFormatSyntax:
***REMOVED***   http://userguide.icu-project.org/formatparse/messages
***REMOVED*** See also http://go/plurals and http://go/ordinals for internal details.
***REMOVED***
***REMOVED***
***REMOVED*** Message example:
***REMOVED***
***REMOVED*** I see {NUM_PEOPLE, plural, offset:1
***REMOVED***         =0 {no one at all}
***REMOVED***         =1 {{WHO}}
***REMOVED***         one {{WHO} and one other person}
***REMOVED***         other {{WHO} and # other people}}
***REMOVED*** in {PLACE}.
***REMOVED***
***REMOVED*** Calling format({'NUM_PEOPLE': 2, 'WHO': 'Mark', 'PLACE': 'Athens'}) would
***REMOVED*** produce "I see Mark and one other person in Athens." as output.
***REMOVED***
***REMOVED*** OR:
***REMOVED***
***REMOVED*** {NUM_FLOOR, selectordinal,
***REMOVED***   one {Take the elevator to the #st floor.}
***REMOVED***   two {Take the elevator to the #nd floor.}
***REMOVED***   few {Take the elevator to the #rd floor.}
***REMOVED***   other {Take the elevator to the #th floor.}}
***REMOVED***
***REMOVED*** Calling format({'NUM_FLOOR': 22}) would produce
***REMOVED*** "Take the elevator to the 22nd floor".
***REMOVED***
***REMOVED*** See messageformat_test.html for more examples.
***REMOVED***

goog.provide('goog.i18n.MessageFormat');

goog.require('goog.asserts');
goog.require('goog.i18n.NumberFormat');
goog.require('goog.i18n.ordinalRules');
goog.require('goog.i18n.pluralRules');



***REMOVED***
***REMOVED*** Constructor of MessageFormat.
***REMOVED*** @param {string} pattern The pattern we parse and apply positional parameters
***REMOVED***     to.
***REMOVED***
***REMOVED***
goog.i18n.MessageFormat = function(pattern) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** All encountered literals during parse stage. Indices tell us the order of
  ***REMOVED*** replacement.
  ***REMOVED*** @type {!Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.literals_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Input pattern gets parsed into objects for faster formatting.
  ***REMOVED*** @type {!Array.<!Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parsedPattern_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Locale aware number formatter.
  ***REMOVED*** @type {goog.i18n.NumberFormat}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.numberFormatter_ = new goog.i18n.NumberFormat(
      goog.i18n.NumberFormat.Format.DECIMAL);

  this.parsePattern_(pattern);
***REMOVED***


***REMOVED***
***REMOVED*** Literal strings, including '', are replaced with \uFDDF_x_ for
***REMOVED*** parsing purposes, and recovered during format phase.
***REMOVED*** \uFDDF is a Unicode nonprinting character, not expected to be found in the
***REMOVED*** typical message.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.LITERAL_PLACEHOLDER_ = '\uFDDF_';


***REMOVED***
***REMOVED*** Marks a string and block during parsing.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.Element_ = {
  STRING: 0,
  BLOCK: 1
***REMOVED***


***REMOVED***
***REMOVED*** Block type.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.BlockType_ = {
  PLURAL: 0,
  ORDINAL: 1,
  SELECT: 2,
  SIMPLE: 3,
  STRING: 4,
  UNKNOWN: 5
***REMOVED***


***REMOVED***
***REMOVED*** Mandatory option in both select and plural form.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.OTHER_ = 'other';


***REMOVED***
***REMOVED*** Regular expression for looking for string literals.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.REGEX_LITERAL_ = new RegExp("'([{}#].*?)'", 'g');


***REMOVED***
***REMOVED*** Regular expression for looking for '' in the message.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.REGEX_DOUBLE_APOSTROPHE_ = new RegExp("''", 'g');


***REMOVED***
***REMOVED*** Formats a message, treating '#' with special meaning representing
***REMOVED*** the number (plural_variable - offset).
***REMOVED*** @param {!Object} namedParameters Parameters that either
***REMOVED***     influence the formatting or are used as actual data.
***REMOVED***     I.e. in call to fmt.format({'NUM_PEOPLE': 5, 'NAME': 'Angela'}),
***REMOVED***     object {'NUM_PEOPLE': 5, 'NAME': 'Angela'} holds positional parameters.
***REMOVED***     1st parameter could mean 5 people, which could influence plural format,
***REMOVED***     and 2nd parameter is just a data to be printed out in proper position.
***REMOVED*** @return {string} Formatted message.
***REMOVED***
goog.i18n.MessageFormat.prototype.format = function(namedParameters) {
  return this.format_(namedParameters, false);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a message, treating '#' as literary character.
***REMOVED*** @param {!Object} namedParameters Parameters that either
***REMOVED***     influence the formatting or are used as actual data.
***REMOVED***     I.e. in call to fmt.format({'NUM_PEOPLE': 5, 'NAME': 'Angela'}),
***REMOVED***     object {'NUM_PEOPLE': 5, 'NAME': 'Angela'} holds positional parameters.
***REMOVED***     1st parameter could mean 5 people, which could influence plural format,
***REMOVED***     and 2nd parameter is just a data to be printed out in proper position.
***REMOVED*** @return {string} Formatted message.
***REMOVED***
goog.i18n.MessageFormat.prototype.formatIgnoringPound =
    function(namedParameters) {
  return this.format_(namedParameters, true);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a message.
***REMOVED*** @param {!Object} namedParameters Parameters that either
***REMOVED***     influence the formatting or are used as actual data.
***REMOVED***     I.e. in call to fmt.format({'NUM_PEOPLE': 5, 'NAME': 'Angela'}),
***REMOVED***     object {'NUM_PEOPLE': 5, 'NAME': 'Angela'} holds positional parameters.
***REMOVED***     1st parameter could mean 5 people, which could influence plural format,
***REMOVED***     and 2nd parameter is just a data to be printed out in proper position.
***REMOVED*** @param {boolean} ignorePound If true, treat '#' in plural messages as a
***REMOVED***     literary character, else treat it as an ICU syntax character, resolving
***REMOVED***     to the number (plural_variable - offset).
***REMOVED*** @return {string} Formatted message.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.format_ =
    function(namedParameters, ignorePound) {
  if (this.parsedPattern_.length == 0) {
    return '';
  }

  var result = [];
  this.formatBlock_(this.parsedPattern_, namedParameters, ignorePound, result);
  var message = result.join('');

  if (!ignorePound) {
    goog.asserts.assert(message.search('#') == -1, 'Not all # were replaced.');
  }

  while (this.literals_.length > 0) {
    message = message.replace(this.buildPlaceholder_(this.literals_),
                              this.literals_.pop());
  }

  return message;
***REMOVED***


***REMOVED***
***REMOVED*** Parses generic block and returns a formatted string.
***REMOVED*** @param {!Array.<!Object>} parsedPattern Holds parsed tree.
***REMOVED*** @param {!Object} namedParameters Parameters that either influence
***REMOVED***     the formatting or are used as actual data.
***REMOVED*** @param {boolean} ignorePound If true, treat '#' in plural messages as a
***REMOVED***     literary character, else treat it as an ICU syntax character, resolving
***REMOVED***     to the number (plural_variable - offset).
***REMOVED*** @param {!Array.<!string>} result Each formatting stage appends its product
***REMOVED***     to the result.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.formatBlock_ = function(
    parsedPattern, namedParameters, ignorePound, result) {
  for (var i = 0; i < parsedPattern.length; i++) {
    switch (parsedPattern[i].type) {
      case goog.i18n.MessageFormat.BlockType_.STRING:
        result.push(parsedPattern[i].value);
        break;
      case goog.i18n.MessageFormat.BlockType_.SIMPLE:
        var pattern = parsedPattern[i].value;
        this.formatSimplePlaceholder_(pattern, namedParameters, result);
        break;
      case goog.i18n.MessageFormat.BlockType_.SELECT:
        var pattern = parsedPattern[i].value;
        this.formatSelectBlock_(pattern, namedParameters, ignorePound, result);
        break;
      case goog.i18n.MessageFormat.BlockType_.PLURAL:
        var pattern = parsedPattern[i].value;
        this.formatPluralOrdinalBlock_(pattern,
                                       namedParameters,
                                       goog.i18n.pluralRules.select,
                                       ignorePound,
                                       result);
        break;
      case goog.i18n.MessageFormat.BlockType_.ORDINAL:
        var pattern = parsedPattern[i].value;
        this.formatPluralOrdinalBlock_(pattern,
                                       namedParameters,
                                       goog.i18n.ordinalRules.select,
                                       ignorePound,
                                       result);
        break;
      default:
        goog.asserts.fail('Unrecognized block type.');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Formats simple placeholder.
***REMOVED*** @param {!Object} parsedPattern JSON object containing placeholder info.
***REMOVED*** @param {!Object} namedParameters Parameters that are used as actual data.
***REMOVED*** @param {!Array.<!string>} result Each formatting stage appends its product
***REMOVED***     to the result.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.formatSimplePlaceholder_ = function(
    parsedPattern, namedParameters, result) {
  var value = namedParameters[parsedPattern];
  if (!goog.isDef(value)) {
    result.push('Undefined parameter - ' + parsedPattern);
    return;
  }

  // Don't push the value yet, it may contain any of # { } in it which
  // will break formatter. Insert a placeholder and replace at the end.
  this.literals_.push(value);
  result.push(this.buildPlaceholder_(this.literals_));
***REMOVED***


***REMOVED***
***REMOVED*** Formats select block. Only one option is selected.
***REMOVED*** @param {!Object} parsedPattern JSON object containing select block info.
***REMOVED*** @param {!Object} namedParameters Parameters that either influence
***REMOVED***     the formatting or are used as actual data.
***REMOVED*** @param {boolean} ignorePound If true, treat '#' in plural messages as a
***REMOVED***     literary character, else treat it as an ICU syntax character, resolving
***REMOVED***     to the number (plural_variable - offset).
***REMOVED*** @param {!Array.<!string>} result Each formatting stage appends its product
***REMOVED***     to the result.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.formatSelectBlock_ = function(
    parsedPattern, namedParameters, ignorePound, result) {
  var argumentIndex = parsedPattern.argumentIndex;
  if (!goog.isDef(namedParameters[argumentIndex])) {
    result.push('Undefined parameter - ' + argumentIndex);
    return;
  }

  var option = parsedPattern[namedParameters[argumentIndex]];
  if (!goog.isDef(option)) {
    option = parsedPattern[goog.i18n.MessageFormat.OTHER_];
    goog.asserts.assertArray(
        option, 'Invalid option or missing other option for select block.');
  }

  this.formatBlock_(option, namedParameters, ignorePound, result);
***REMOVED***


***REMOVED***
***REMOVED*** Formats plural or selectordinal block. Only one option is selected and all #
***REMOVED*** are replaced.
***REMOVED*** @param {!Object} parsedPattern JSON object containing plural block info.
***REMOVED*** @param {!Object} namedParameters Parameters that either influence
***REMOVED***     the formatting or are used as actual data.
***REMOVED*** @param {!function(number):string} pluralSelector  A select function from
***REMOVED***     goog.i18n.pluralRules or goog.i18n.ordinalRules which determines which
***REMOVED***     plural/ordinal form to use based on the input number's cardinality.
***REMOVED*** @param {boolean} ignorePound If true, treat '#' in plural messages as a
***REMOVED***     literary character, else treat it as an ICU syntax character, resolving
***REMOVED***     to the number (plural_variable - offset).
***REMOVED*** @param {!Array.<!string>} result Each formatting stage appends its product
***REMOVED***     to the result.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.formatPluralOrdinalBlock_ = function(
    parsedPattern, namedParameters, pluralSelector, ignorePound, result) {
  var argumentIndex = parsedPattern.argumentIndex;
  var argumentOffset = parsedPattern.argumentOffset;
  var pluralValue = +namedParameters[argumentIndex];
  if (isNaN(pluralValue)) {
    // TODO(user): Distinguish between undefined and invalid parameters.
    result.push('Undefined or invalid parameter - ' + argumentIndex);
    return;
  }
  var diff = pluralValue - argumentOffset;

  // Check if there is an exact match.
  var option = parsedPattern[namedParameters[argumentIndex]];
  if (!goog.isDef(option)) {
    goog.asserts.assert(diff >= 0, 'Argument index smaller than offset.');

    var item = pluralSelector(diff);
    goog.asserts.assertString(item, 'Invalid plural key.');

    option = parsedPattern[item];

    // If option is not provided fall back to "other".
    if (!goog.isDef(option)) {
      option = parsedPattern[goog.i18n.MessageFormat.OTHER_];
    }

    goog.asserts.assertArray(
        option, 'Invalid option or missing other option for plural block.');
  }

  var pluralResult = [];
  this.formatBlock_(option, namedParameters, ignorePound, pluralResult);
  var plural = pluralResult.join('');
  goog.asserts.assertString(plural, 'Empty block in plural.');
  if (ignorePound) {
    result.push(plural);
  } else {
    var localeAwareDiff = this.numberFormatter_.format(diff);
    result.push(plural.replace(/#/g, localeAwareDiff));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses input pattern into an array, for faster reformatting with
***REMOVED*** different input parameters.
***REMOVED*** Parsing is locale independent.
***REMOVED*** @param {string} pattern MessageFormat pattern to parse.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parsePattern_ = function(pattern) {
  if (pattern) {
    pattern = this.insertPlaceholders_(pattern);

    this.parsedPattern_ = this.parseBlock_(pattern);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Replaces string literals with literal placeholders.
***REMOVED*** Literals are string of the form '}...', '{...' and '#...' where ... is
***REMOVED*** set of characters not containing '
***REMOVED*** Builds a dictionary so we can recover literals during format phase.
***REMOVED*** @param {string} pattern Pattern to clean up.
***REMOVED*** @return {string} Pattern with literals replaced with placeholders.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.insertPlaceholders_ = function(pattern) {
  var literals = this.literals_;
  var buildPlaceholder = goog.bind(this.buildPlaceholder_, this);

  // First replace '' with single quote placeholder since they can be found
  // inside other literals.
  pattern = pattern.replace(
      goog.i18n.MessageFormat.REGEX_DOUBLE_APOSTROPHE_,
      function() {
        literals.push("'");
        return buildPlaceholder(literals);
      });

  pattern = pattern.replace(
      goog.i18n.MessageFormat.REGEX_LITERAL_,
      function(match, text) {
        literals.push(text);
        return buildPlaceholder(literals);
      });

  return pattern;
***REMOVED***


***REMOVED***
***REMOVED*** Breaks pattern into strings and top level {...} blocks.
***REMOVED*** @param {string} pattern (sub)Pattern to be broken.
***REMOVED*** @return {Array.<Object>} Each item is {type, value}.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.extractParts_ = function(pattern) {
  var prevPos = 0;
  var inBlock = false;
  var braceStack = [];
  var results = [];

  var braces = /[{}]/g;
  braces.lastIndex = 0;  // lastIndex doesn't get set to 0 so we have to.
  var match;

  while (match = braces.exec(pattern)) {
    var pos = match.index;
    if (match[0] == '}') {
      var brace = braceStack.pop();
      goog.asserts.assert(goog.isDef(brace) && brace == '{',
                          'No matching { for }.');

      if (braceStack.length == 0) {
        // End of the block.
        var part = {***REMOVED***
        part.type = goog.i18n.MessageFormat.Element_.BLOCK;
        part.value = pattern.substring(prevPos, pos);
        results.push(part);
        prevPos = pos + 1;
        inBlock = false;
      }
    } else {
      if (braceStack.length == 0) {
        inBlock = true;
        var substring = pattern.substring(prevPos, pos);
        if (substring != '') {
          results.push({
            type: goog.i18n.MessageFormat.Element_.STRING,
            value: substring
          });
        }
        prevPos = pos + 1;
      }
      braceStack.push('{');
    }
  }

  // Take care of the final string, and check if the braceStack is empty.
  goog.asserts.assert(braceStack.length == 0,
                      'There are mismatched { or } in the pattern.');

  var substring = pattern.substring(prevPos);
  if (substring != '') {
    results.push({
      type: goog.i18n.MessageFormat.Element_.STRING,
      value: substring
    });
  }

  return results;
***REMOVED***


***REMOVED***
***REMOVED*** A regular expression to parse the plural block, extracting the argument
***REMOVED*** index and offset (if any).
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.PLURAL_BLOCK_RE_ =
    /^\s*(\w+)\s*,\s*plural\s*,(?:\s*offset:(\d+))?/;


***REMOVED***
***REMOVED*** A regular expression to parse the ordinal block, extracting the argument
***REMOVED*** index.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_ = /^\s*(\w+)\s*,\s*selectordinal\s*,/;


***REMOVED***
***REMOVED*** A regular expression to parse the select block, extracting the argument
***REMOVED*** index.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.SELECT_BLOCK_RE_ = /^\s*(\w+)\s*,\s*select\s*,/;


***REMOVED***
***REMOVED*** Detects which type of a block is the pattern.
***REMOVED*** @param {string} pattern Content of the block.
***REMOVED*** @return {goog.i18n.MessageFormat.BlockType_} One of the block types.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parseBlockType_ = function(pattern) {
  if (goog.i18n.MessageFormat.PLURAL_BLOCK_RE_.test(pattern)) {
    return goog.i18n.MessageFormat.BlockType_.PLURAL;
  }

  if (goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_.test(pattern)) {
    return goog.i18n.MessageFormat.BlockType_.ORDINAL;
  }

  if (goog.i18n.MessageFormat.SELECT_BLOCK_RE_.test(pattern)) {
    return goog.i18n.MessageFormat.BlockType_.SELECT;
  }

  if (/^\s*\w+\s*/.test(pattern)) {
    return goog.i18n.MessageFormat.BlockType_.SIMPLE;
  }

  return goog.i18n.MessageFormat.BlockType_.UNKNOWN;
***REMOVED***


***REMOVED***
***REMOVED*** Parses generic block.
***REMOVED*** @param {string} pattern Content of the block to parse.
***REMOVED*** @return {!Array.<!Object>} Subblocks marked as strings, select...
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parseBlock_ = function(pattern) {
  var result = [];
  var parts = this.extractParts_(pattern);
  for (var i = 0; i < parts.length; i++) {
    var block = {***REMOVED***
    if (goog.i18n.MessageFormat.Element_.STRING == parts[i].type) {
      block.type = goog.i18n.MessageFormat.BlockType_.STRING;
      block.value = parts[i].value;
    } else if (goog.i18n.MessageFormat.Element_.BLOCK == parts[i].type) {
      var blockType = this.parseBlockType_(parts[i].value);

      switch (blockType) {
        case goog.i18n.MessageFormat.BlockType_.SELECT:
          block.type = goog.i18n.MessageFormat.BlockType_.SELECT;
          block.value = this.parseSelectBlock_(parts[i].value);
          break;
        case goog.i18n.MessageFormat.BlockType_.PLURAL:
          block.type = goog.i18n.MessageFormat.BlockType_.PLURAL;
          block.value = this.parsePluralBlock_(parts[i].value);
          break;
        case goog.i18n.MessageFormat.BlockType_.ORDINAL:
          block.type = goog.i18n.MessageFormat.BlockType_.ORDINAL;
          block.value = this.parseOrdinalBlock_(parts[i].value);
          break;
        case goog.i18n.MessageFormat.BlockType_.SIMPLE:
          block.type = goog.i18n.MessageFormat.BlockType_.SIMPLE;
          block.value = parts[i].value;
          break;
        default:
          goog.asserts.fail('Unknown block type.');
      }
    } else {
      goog.asserts.fail('Unknown part of the pattern.');
    }
    result.push(block);
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a select type of a block and produces JSON object for it.
***REMOVED*** @param {string} pattern Subpattern that needs to be parsed as select pattern.
***REMOVED*** @return {Object} Object with select block info.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parseSelectBlock_ = function(pattern) {
  var argumentIndex = '';
  var replaceRegex = goog.i18n.MessageFormat.SELECT_BLOCK_RE_;
  pattern = pattern.replace(replaceRegex, function(string, name) {
    argumentIndex = name;
    return '';
  });
  var result = {***REMOVED***
  result.argumentIndex = argumentIndex;

  var parts = this.extractParts_(pattern);
  // Looking for (key block)+ sequence. One of the keys has to be "other".
  var pos = 0;
  while (pos < parts.length) {
    var key = parts[pos].value;
    goog.asserts.assertString(key, 'Missing select key element.');

    pos++;
    goog.asserts.assert(pos < parts.length,
                        'Missing or invalid select value element.');

    if (goog.i18n.MessageFormat.Element_.BLOCK == parts[pos].type) {
      var value = this.parseBlock_(parts[pos].value);
    } else {
      goog.asserts.fail('Expected block type.');
    }
    result[key.replace(/\s/g, '')] = value;
    pos++;
  }

  goog.asserts.assertArray(result[goog.i18n.MessageFormat.OTHER_],
                           'Missing other key in select statement.');
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a plural type of a block and produces JSON object for it.
***REMOVED*** @param {string} pattern Subpattern that needs to be parsed as plural pattern.
***REMOVED*** @return {Object} Object with select block info.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parsePluralBlock_ = function(pattern) {
  var argumentIndex = '';
  var argumentOffset = 0;
  var replaceRegex = goog.i18n.MessageFormat.PLURAL_BLOCK_RE_;
  pattern = pattern.replace(replaceRegex, function(string, name, offset) {
    argumentIndex = name;
    if (offset) {
      argumentOffset = parseInt(offset, 10);
    }
    return '';
  });

  var result = {***REMOVED***
  result.argumentIndex = argumentIndex;
  result.argumentOffset = argumentOffset;

  var parts = this.extractParts_(pattern);
  // Looking for (key block)+ sequence.
  var pos = 0;
  while (pos < parts.length) {
    var key = parts[pos].value;
    goog.asserts.assertString(key, 'Missing plural key element.');

    pos++;
    goog.asserts.assert(pos < parts.length,
                        'Missing or invalid plural value element.');

    if (goog.i18n.MessageFormat.Element_.BLOCK == parts[pos].type) {
      var value = this.parseBlock_(parts[pos].value);
    } else {
      goog.asserts.fail('Expected block type.');
    }
    result[key.replace(/\s*(?:=)?(\w+)\s*/, '$1')] = value;
    pos++;
  }

  goog.asserts.assertArray(result[goog.i18n.MessageFormat.OTHER_],
                           'Missing other key in plural statement.');

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Parses an ordinal type of a block and produces JSON object for it.
***REMOVED*** For example the input string:
***REMOVED***  '{FOO, selectordinal, one {Message A}other {Message B}}'
***REMOVED*** Should result in the output object:
***REMOVED*** {
***REMOVED***   argumentIndex: 'FOO',
***REMOVED***   argumentOffest: 0,
***REMOVED***   one: [ { type: 4, value: 'Message A' } ],
***REMOVED***   other: [ { type: 4, value: 'Message B' } ]
***REMOVED*** }
***REMOVED*** @param {string} pattern Subpattern that needs to be parsed as plural pattern.
***REMOVED*** @return {Object} Object with select block info.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.parseOrdinalBlock_ = function(pattern) {
  var argumentIndex = '';
  var replaceRegex = goog.i18n.MessageFormat.ORDINAL_BLOCK_RE_;
  pattern = pattern.replace(replaceRegex, function(string, name) {
    argumentIndex = name;
    return '';
  });

  var result = {***REMOVED***
  result.argumentIndex = argumentIndex;
  result.argumentOffset = 0;

  var parts = this.extractParts_(pattern);
  // Looking for (key block)+ sequence.
  var pos = 0;
  while (pos < parts.length) {
    var key = parts[pos].value;
    goog.asserts.assertString(key, 'Missing ordinal key element.');

    pos++;
    goog.asserts.assert(pos < parts.length,
                        'Missing or invalid ordinal value element.');

    if (goog.i18n.MessageFormat.Element_.BLOCK == parts[pos].type) {
      var value = this.parseBlock_(parts[pos].value);
    } else {
      goog.asserts.fail('Expected block type.');
    }
    result[key.replace(/\s*(?:=)?(\w+)\s*/, '$1')] = value;
    pos++;
  }

  goog.asserts.assertArray(result[goog.i18n.MessageFormat.OTHER_],
                           'Missing other key in selectordinal statement.');

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Builds a placeholder from the last index of the array.
***REMOVED*** @param {!Array} literals All literals encountered during parse.
***REMOVED*** @return {string} \uFDDF_ + last index + _.
***REMOVED*** @private
***REMOVED***
goog.i18n.MessageFormat.prototype.buildPlaceholder_ = function(literals) {
  goog.asserts.assert(literals.length > 0, 'Literal array is empty.');

  var index = (literals.length - 1).toString(10);
  return goog.i18n.MessageFormat.LITERAL_PLACEHOLDER_ + index + '_';
***REMOVED***
