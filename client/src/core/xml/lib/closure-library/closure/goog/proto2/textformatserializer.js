// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Protocol Buffer 2 Serializer which serializes messages
***REMOVED***  into a user-friendly text format. Note that this code can run a bit
***REMOVED***  slowly (especially for parsing) and should therefore not be used for
***REMOVED***  time or space-critical applications.
***REMOVED***
***REMOVED*** @see http://goo.gl/QDmDr
***REMOVED***

goog.provide('goog.proto2.TextFormatSerializer');
goog.provide('goog.proto2.TextFormatSerializer.Parser');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.json');
goog.require('goog.proto2.Serializer');
goog.require('goog.proto2.Util');
goog.require('goog.string');



***REMOVED***
***REMOVED*** TextFormatSerializer, a serializer which turns Messages into the human
***REMOVED*** readable text format.
***REMOVED*** @param {boolean=} opt_ignoreMissingFields If true, then fields that cannot be
***REMOVED***     found on the proto when parsing the text format will be ignored.
***REMOVED***
***REMOVED*** @extends {goog.proto2.Serializer}
***REMOVED***
goog.proto2.TextFormatSerializer = function(opt_ignoreMissingFields) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to ignore fields not defined on the proto when parsing the text
  ***REMOVED*** format.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ignoreMissingFields_ = !!opt_ignoreMissingFields;
***REMOVED***
goog.inherits(goog.proto2.TextFormatSerializer, goog.proto2.Serializer);


***REMOVED***
***REMOVED*** Deserializes a message from text format and places the data in the message.
***REMOVED*** @param {goog.proto2.Message} message The message in which to
***REMOVED***     place the information.
***REMOVED*** @param {*} data The text format data.
***REMOVED*** @return {?string} The parse error or null on success.
***REMOVED*** @override
***REMOVED***
goog.proto2.TextFormatSerializer.prototype.deserializeTo =
    function(message, data) {
  var descriptor = message.getDescriptor();
  var textData = data.toString();
  var parser = new goog.proto2.TextFormatSerializer.Parser();
  if (!parser.parse(message, textData, this.ignoreMissingFields_)) {
    return parser.getError();
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Serializes a message to a string.
***REMOVED*** @param {goog.proto2.Message} message The message to be serialized.
***REMOVED*** @return {string} The serialized form of the message.
***REMOVED*** @override
***REMOVED***
goog.proto2.TextFormatSerializer.prototype.serialize = function(message) {
  var printer = new goog.proto2.TextFormatSerializer.Printer_();
  this.serializeMessage_(message, printer);
  return printer.toString();
***REMOVED***


***REMOVED***
***REMOVED*** Serializes the message and prints the text form into the given printer.
***REMOVED*** @param {goog.proto2.Message} message The message to serialize.
***REMOVED*** @param {goog.proto2.TextFormatSerializer.Printer_} printer The printer to
***REMOVED***    which the text format will be printed.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.prototype.serializeMessage_ =
    function(message, printer) {
  var descriptor = message.getDescriptor();
  var fields = descriptor.getFields();

  // Add the defined fields, recursively.
  goog.array.forEach(fields, function(field) {
    this.printField_(message, field, printer);
  }, this);

  // Add the unknown fields, if any.
  message.forEachUnknown(function(tag, value) {
    if (!value) { return; }

    printer.append(tag);
    if (goog.typeOf(value) == 'object') {
      printer.append(' {');
      printer.appendLine();
      printer.indent();
    } else {
      printer.append(': ');
    }

    switch (goog.typeOf(value)) {
      case 'string':
        value = goog.string.quote(***REMOVED*** @type {string}***REMOVED*** (value));
        printer.append(value);
        break;

      case 'object':
        this.serializeMessage_(value, printer);
        break;

      default:
        printer.append(value.toString());
        break;
    }

    if (goog.typeOf(value) == 'object') {
      printer.dedent();
      printer.append('}');
    } else {
      printer.appendLine();
    }
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Prints the serialized value for the given field to the printer.
***REMOVED*** @param {*} value The field's value.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field whose value is being
***REMOVED***    printed.
***REMOVED*** @param {goog.proto2.TextFormatSerializer.Printer_} printer The printer to
***REMOVED***    which the value will be printed.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.prototype.printFieldValue_ =
    function(value, field, printer) {
  switch (field.getFieldType()) {
    case goog.proto2.FieldDescriptor.FieldType.DOUBLE:
    case goog.proto2.FieldDescriptor.FieldType.FLOAT:
    case goog.proto2.FieldDescriptor.FieldType.INT64:
    case goog.proto2.FieldDescriptor.FieldType.UINT64:
    case goog.proto2.FieldDescriptor.FieldType.INT32:
    case goog.proto2.FieldDescriptor.FieldType.UINT32:
    case goog.proto2.FieldDescriptor.FieldType.FIXED64:
    case goog.proto2.FieldDescriptor.FieldType.FIXED32:
    case goog.proto2.FieldDescriptor.FieldType.BOOL:
    case goog.proto2.FieldDescriptor.FieldType.SFIXED32:
    case goog.proto2.FieldDescriptor.FieldType.SFIXED64:
    case goog.proto2.FieldDescriptor.FieldType.SINT32:
    case goog.proto2.FieldDescriptor.FieldType.SINT64:
      printer.append(value);
      break;

    case goog.proto2.FieldDescriptor.FieldType.BYTES:
    case goog.proto2.FieldDescriptor.FieldType.STRING:
      value = goog.string.quote(value.toString());
      printer.append(value);
      break;

    case goog.proto2.FieldDescriptor.FieldType.ENUM:
      // Search the enum type for a matching key.
      var found = false;
      goog.object.forEach(field.getNativeType(), function(eValue, key) {
        if (eValue == value) {
          printer.append(key);
          found = true;
        }
      });

      if (!found) {
        // Otherwise, just print the numeric value.
        printer.append(value.toString());
      }
      break;

    case goog.proto2.FieldDescriptor.FieldType.GROUP:
    case goog.proto2.FieldDescriptor.FieldType.MESSAGE:
      this.serializeMessage_(
         ***REMOVED*****REMOVED*** @type {goog.proto2.Message}***REMOVED*** (value), printer);
      break;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Prints the serialized field to the printer.
***REMOVED*** @param {goog.proto2.Message} message The parent message.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field to print.
***REMOVED*** @param {goog.proto2.TextFormatSerializer.Printer_} printer The printer to
***REMOVED***    which the field will be printed.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.prototype.printField_ =
    function(message, field, printer) {
  // Skip fields not present.
  if (!message.has(field)) {
    return;
  }

  var count = message.countOf(field);
  for (var i = 0; i < count; ++i) {
    // Field name.
    printer.append(field.getName());

    // Field delimiter.
    if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.MESSAGE ||
        field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.GROUP) {
      printer.append(' {');
      printer.appendLine();
      printer.indent();
    } else {
      printer.append(': ');
    }

    // Write the field value.
    this.printFieldValue_(message.get(field, i), field, printer);

    // Close the field.
    if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.MESSAGE ||
        field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.GROUP) {
      printer.dedent();
      printer.append('}');
      printer.appendLine();
    } else {
      printer.appendLine();
    }
  }
***REMOVED***


////////////////////////////////////////////////////////////////////////////////



***REMOVED***
***REMOVED*** Helper class used by the text format serializer for pretty-printing text.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The current indentation count.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.indentation_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The buffer of string pieces.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.buffer_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether indentation is required before the next append of characters.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.requiresIndentation_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The contents of the printer.
***REMOVED*** @override
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_.prototype.toString = function() {
  return this.buffer_.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Increases the indentation in the printer.
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_.prototype.indent = function() {
  this.indentation_ += 2;
***REMOVED***


***REMOVED***
***REMOVED*** Decreases the indentation in the printer.
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_.prototype.dedent = function() {
  this.indentation_ -= 2;
  goog.asserts.assert(this.indentation_ >= 0);
***REMOVED***


***REMOVED***
***REMOVED*** Appends the given value to the printer.
***REMOVED*** @param {*} value The value to append.
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_.prototype.append = function(value) {
  if (this.requiresIndentation_) {
    for (var i = 0; i < this.indentation_; ++i) {
      this.buffer_.push(' ');
    }
    this.requiresIndentation_ = false;
  }

  this.buffer_.push(value.toString());
***REMOVED***


***REMOVED***
***REMOVED*** Appends a newline to the printer.
***REMOVED***
goog.proto2.TextFormatSerializer.Printer_.prototype.appendLine = function() {
  this.buffer_.push('\n');
  this.requiresIndentation_ = true;
***REMOVED***


////////////////////////////////////////////////////////////////////////////////



***REMOVED***
***REMOVED*** Helper class for tokenizing the text format.
***REMOVED*** @param {string} data The string data to tokenize.
***REMOVED*** @param {boolean=} opt_ignoreWhitespace If true, whitespace tokens will not
***REMOVED***    be reported by the tokenizer.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_ =
    function(data, opt_ignoreWhitespace) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to skip whitespace tokens on output.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ignoreWhitespace_ = !!opt_ignoreWhitespace;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The data being tokenized.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.data_ = data;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current index in the data.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.index_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The data string starting at the current index.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.currentData_ = data;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current token type.
  ***REMOVED*** @type {goog.proto2.TextFormatSerializer.Tokenizer_.Token}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.current_ = {
    type: goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes.END,
    value: null
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @typedef {{type: goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes,
***REMOVED***            value: ?string}}
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_.Token;


***REMOVED***
***REMOVED*** @return {goog.proto2.TextFormatSerializer.Tokenizer_.Token} The current
***REMOVED***     token.
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_.prototype.getCurrent = function() {
  return this.current_;
***REMOVED***


***REMOVED***
***REMOVED*** An enumeration of all the token types.
***REMOVED*** @enum {*}
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes = {
  END: /---end---/,
  // Leading "-" to identify "-infinity"."
  IDENTIFIER: /^-?[a-zA-Z][a-zA-Z0-9_]*/,
  NUMBER: /^(0x[0-9a-f]+)|(([-])?[0-9][0-9]*(\.?[0-9]+)?([f])?)/,
  COMMENT: /^#.*/,
  OPEN_BRACE: /^{/,
  CLOSE_BRACE: /^}/,
  OPEN_TAG: /^</,
  CLOSE_TAG: /^>/,
  OPEN_LIST: /^\[/,
  CLOSE_LIST: /^\]/,
  STRING: new RegExp('^"([^"\\\\]|\\\\.)*"'),
  COLON: /^:/,
  COMMA: /^,/,
  SEMI: /^;/,
  WHITESPACE: /^\s/
***REMOVED***


***REMOVED***
***REMOVED*** Advances to the next token.
***REMOVED*** @return {boolean} True if a valid token was found, false if the end was
***REMOVED***    reached or no valid token was found.
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_.prototype.next = function() {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;

  // Skip any whitespace if requested.
  while (this.nextInternal_()) {
    if (this.getCurrent().type != types.WHITESPACE || !this.ignoreWhitespace_) {
      return true;
    }
  }

  // If we reach this point, set the current token to END.
  this.current_ = {
    type: goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes.END,
    value: null
 ***REMOVED*****REMOVED***

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Internal method for determining the next token.
***REMOVED*** @return {boolean} True if a next token was found, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Tokenizer_.prototype.nextInternal_ =
    function() {
  if (this.index_ >= this.data_.length) {
    return false;
  }

  var data = this.currentData_;
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  var next = null;

  // Loop through each token type and try to match the beginning of the string
  // with the token's regular expression.
  goog.object.forEach(types, function(type, id) {
    if (next || type == types.END) {
      return;
    }

    // Note: This regular expression check is at, minimum, O(n).
    var info = type.exec(data);
    if (info && info.index == 0) {
      next = {
        type: type,
        value: info[0]
     ***REMOVED*****REMOVED***
    }
  });

  // Advance the index by the length of the token.
  if (next) {
    this.current_ =
       ***REMOVED*****REMOVED*** @type {goog.proto2.TextFormatSerializer.Tokenizer_.Token}***REMOVED*** (next);
    this.index_ += next.value.length;
    this.currentData_ = this.currentData_.substring(next.value.length);
  }

  return !!next;
***REMOVED***


////////////////////////////////////////////////////////////////////////////////



***REMOVED***
***REMOVED*** Helper class for parsing the text format.
***REMOVED***
***REMOVED***
goog.proto2.TextFormatSerializer.Parser = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The error during parsing, if any.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.error_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current tokenizer.
  ***REMOVED*** @type {goog.proto2.TextFormatSerializer.Tokenizer_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tokenizer_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to ignore missing fields in the proto when parsing.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ignoreMissingFields_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Parses the given data, filling the message as it goes.
***REMOVED*** @param {goog.proto2.Message} message The message to fill.
***REMOVED*** @param {string} data The text format data.
***REMOVED*** @param {boolean=} opt_ignoreMissingFields If true, fields missing in the
***REMOVED***     proto will be ignored.
***REMOVED*** @return {boolean} True on success, false on failure. On failure, the
***REMOVED***     getError method can be called to get the reason for failure.
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.parse =
    function(message, data, opt_ignoreMissingFields) {
  this.error_ = null;
  this.ignoreMissingFields_ = !!opt_ignoreMissingFields;
  this.tokenizer_ = new goog.proto2.TextFormatSerializer.Tokenizer_(data, true);
  this.tokenizer_.next();
  return this.consumeMessage_(message, '');
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The parse error, if any.
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.getError = function() {
  return this.error_;
***REMOVED***


***REMOVED***
***REMOVED*** Reports a parse error.
***REMOVED*** @param {string} msg The error message.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.reportError_ =
    function(msg) {
  this.error_ = msg;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume the given message.
***REMOVED*** @param {goog.proto2.Message} message The message to consume and fill. If
***REMOVED***    null, then the message contents will be consumed without ever being set
***REMOVED***    to anything.
***REMOVED*** @param {string} delimiter The delimiter expected at the end of the message.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeMessage_ =
    function(message, delimiter) {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  while (!this.lookingAt_('>') && !this.lookingAt_('}') &&
         !this.lookingAtType_(types.END)) {
    if (!this.consumeField_(message)) { return false; }
  }

  if (delimiter) {
    if (!this.consume_(delimiter)) { return false; }
  } else {
    if (!this.lookingAtType_(types.END)) {
      this.reportError_('Expected END token');
    }
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume the value of the given field.
***REMOVED*** @param {goog.proto2.Message} message The parent message.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeFieldValue_ =
    function(message, field) {
  var value = this.getFieldValue_(field);
  if (goog.isNull(value)) { return false; }

  if (field.isRepeated()) {
    message.add(field, value);
  } else {
    message.set(field, value);
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to convert a string to a number.
***REMOVED*** @param {string} num in hexadecimal or float format.
***REMOVED*** @return {?number} The converted number or null on error.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.getNumberFromString_ =
    function(num) {

  var returnValue = goog.string.contains(num, '.') ?
      parseFloat(num) : // num is a float.
      goog.string.parseInt(num); // num is an int.

  goog.asserts.assert(!isNaN(returnValue));
  goog.asserts.assert(isFinite(returnValue));

  return returnValue;
***REMOVED***


***REMOVED***
***REMOVED*** Parse NaN, positive infinity, or negative infinity from a string.
***REMOVED*** @param {string} identifier An identifier string to check.
***REMOVED*** @return {?number} Infinity, negative infinity, NaN, or null if none
***REMOVED***     of the constants could be parsed.
***REMOVED*** @private.
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.parseNumericalConstant_ =
    function(identifier) {
  if (/^-?inf(?:inity)?f?$/i.test(identifier)) {
    return Infinity***REMOVED*** (goog.string.startsWith(identifier, '-') ? -1 : 1);
  }

  if (/^nanf?$/i.test(identifier)) {
    return NaN;
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the given field's value from the stream.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field.
***REMOVED*** @return {*} The field's value or null if none.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.getFieldValue_ =
    function(field) {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  switch (field.getFieldType()) {
    case goog.proto2.FieldDescriptor.FieldType.DOUBLE:
    case goog.proto2.FieldDescriptor.FieldType.FLOAT:

      var identifier = this.consumeIdentifier_();
      if (identifier) {
        var numericalIdentifier =
            goog.proto2.TextFormatSerializer.Parser.parseNumericalConstant_(
                identifier);
        // Use isDefAndNotNull since !!NaN is false.
        if (goog.isDefAndNotNull(numericalIdentifier)) {
          return numericalIdentifier;
        }
      }

    case goog.proto2.FieldDescriptor.FieldType.INT32:
    case goog.proto2.FieldDescriptor.FieldType.UINT32:
    case goog.proto2.FieldDescriptor.FieldType.FIXED32:
    case goog.proto2.FieldDescriptor.FieldType.SFIXED32:
    case goog.proto2.FieldDescriptor.FieldType.SINT32:
      var num = this.consumeNumber_();
      if (!num) { return null; }

      return goog.proto2.TextFormatSerializer.Parser.getNumberFromString_(num);

    case goog.proto2.FieldDescriptor.FieldType.INT64:
    case goog.proto2.FieldDescriptor.FieldType.UINT64:
    case goog.proto2.FieldDescriptor.FieldType.FIXED64:
    case goog.proto2.FieldDescriptor.FieldType.SFIXED64:
    case goog.proto2.FieldDescriptor.FieldType.SINT64:
      var num = this.consumeNumber_();
      if (!num) { return null; }

      if (field.getNativeType() == Number) {
        // 64-bit number stored as a number.
        return goog.proto2.TextFormatSerializer.Parser.getNumberFromString_(
            num);
      }

      return num; // 64-bit numbers are by default stored as strings.

    case goog.proto2.FieldDescriptor.FieldType.BOOL:
      var ident = this.consumeIdentifier_();
      if (!ident) { return null; }

      switch (ident) {
        case 'true': return true;
        case 'false': return false;
        default:
          this.reportError_('Unknown type for bool: ' + ident);
          return null;
      }

    case goog.proto2.FieldDescriptor.FieldType.ENUM:
      if (this.lookingAtType_(types.NUMBER)) {
        return this.consumeNumber_();
      } else {
        // Search the enum type for a matching key.
        var name = this.consumeIdentifier_();
        if (!name) {
          return null;
        }

        var enumValue = field.getNativeType()[name];
        if (enumValue == null) {
          this.reportError_('Unknown enum value: ' + name);
          return null;
        }

        return enumValue;
      }

    case goog.proto2.FieldDescriptor.FieldType.BYTES:
    case goog.proto2.FieldDescriptor.FieldType.STRING:
      return this.consumeString_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume a nested message.
***REMOVED*** @param {goog.proto2.Message} message The parent message.
***REMOVED*** @param {goog.proto2.FieldDescriptor} field The field.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeNestedMessage_ =
    function(message, field) {
  var delimiter = '';

  // Messages support both < > and { } as delimiters for legacy reasons.
  if (this.tryConsume_('<')) {
    delimiter = '>';
  } else {
    if (!this.consume_('{')) { return false; }
    delimiter = '}';
  }

  var msg = field.getFieldMessageType().createMessageInstance();
  var result = this.consumeMessage_(msg, delimiter);
  if (!result) { return false; }

  // Add the message to the parent message.
  if (field.isRepeated()) {
    message.add(field, msg);
  } else {
    message.set(field, msg);
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume the value of an unknown field. This method uses
***REMOVED*** heuristics to try to consume just the right tokens.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeUnknownFieldValue_ =
    function() {
  // : is optional.
  this.tryConsume_(':');

  // Handle form: [.. , ... , ..]
  if (this.tryConsume_('[')) {
    while (true) {
      this.tokenizer_.next();
      if (this.tryConsume_(']')) {
        break;
      }
      if (!this.consume_(',')) { return false; }
    }

    return true;
  }

  // Handle nested messages/groups.
  if (this.tryConsume_('<')) {
    return this.consumeMessage_(null /* unknown***REMOVED***, '>');
  } else if (this.tryConsume_('{')) {
    return this.consumeMessage_(null /* unknown***REMOVED***, '}');
  } else {
    // Otherwise, consume a single token for the field value.
    this.tokenizer_.next();
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume a field under a message.
***REMOVED*** @param {goog.proto2.Message} message The parent message. If null, then the
***REMOVED***     field value will be consumed without being assigned to anything.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeField_ =
    function(message) {
  var fieldName = this.consumeIdentifier_();
  if (!fieldName) {
    this.reportError_('Missing field name');
    return false;
  }

  var field = null;
  if (message) {
    field = message.getDescriptor().findFieldByName(fieldName.toString());
  }

  if (field == null) {
    if (this.ignoreMissingFields_) {
      return this.consumeUnknownFieldValue_();
    } else {
      this.reportError_('Unknown field: ' + fieldName);
      return false;
    }
  }

  if (field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.MESSAGE ||
      field.getFieldType() == goog.proto2.FieldDescriptor.FieldType.GROUP) {
    // : is optional here.
    this.tryConsume_(':');
    if (!this.consumeNestedMessage_(message, field)) { return false; }
  } else {
    // Long Format: "someField: 123"
    // Short Format: "someField: [123, 456, 789]"
    if (!this.consume_(':')) { return false; }

    if (field.isRepeated() && this.tryConsume_('[')) {
      // Short repeated format, e.g.  "foo: [1, 2, 3]"
      while (true) {
        if (!this.consumeFieldValue_(message, field)) { return false; }
        if (this.tryConsume_(']')) {
          break;
        }
        if (!this.consume_(',')) { return false; }
      }
    } else {
      // Normal field format.
      if (!this.consumeFieldValue_(message, field)) { return false; }
    }
  }

  // For historical reasons, fields may optionally be separated by commas or
  // semicolons.
  this.tryConsume_(',') || this.tryConsume_(';');
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to consume a token with the given string value.
***REMOVED*** @param {string} value The string value for the token.
***REMOVED*** @return {boolean} True if the token matches and was consumed, false
***REMOVED***    otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.tryConsume_ =
    function(value) {
  if (this.lookingAt_(value)) {
    this.tokenizer_.next();
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Consumes a token of the given type.
***REMOVED*** @param {goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes} type The type
***REMOVED***     of the token to consume.
***REMOVED*** @return {?string} The string value of the token or null on error.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeToken_ =
    function(type) {
  if (!this.lookingAtType_(type)) {
    this.reportError_('Expected token type: ' + type);
    return null;
  }

  var value = this.tokenizer_.getCurrent().value;
  this.tokenizer_.next();
  return value;
***REMOVED***


***REMOVED***
***REMOVED*** Consumes an IDENTIFIER token.
***REMOVED*** @return {?string} The string value or null on error.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeIdentifier_ =
    function() {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  return this.consumeToken_(types.IDENTIFIER);
***REMOVED***


***REMOVED***
***REMOVED*** Consumes a NUMBER token.
***REMOVED*** @return {?string} The string value or null on error.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeNumber_ =
    function() {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  return this.consumeToken_(types.NUMBER);
***REMOVED***


***REMOVED***
***REMOVED*** Consumes a STRING token.
***REMOVED*** @return {?string} The***REMOVED***deescaped* string value or null on error.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consumeString_ =
    function() {
  var types = goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes;
  var value = this.consumeToken_(types.STRING);
  if (!value) {
    return null;
  }

  return goog.json.parse(value).toString();
***REMOVED***


***REMOVED***
***REMOVED*** Consumes a token with the given value. If not found, reports an error.
***REMOVED*** @param {string} value The string value expected for the token.
***REMOVED*** @return {boolean} True on success, false otherwise.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.consume_ = function(value) {
  if (!this.tryConsume_(value)) {
    this.reportError_('Expected token "' + value + '"');
    return false;
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} value The value to check against.
***REMOVED*** @return {boolean} True if the current token has the given string value.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.lookingAt_ =
    function(value) {
  return this.tokenizer_.getCurrent().value == value;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.proto2.TextFormatSerializer.Tokenizer_.TokenTypes} type The
***REMOVED***     token type.
***REMOVED*** @return {boolean} True if the current token has the given type.
***REMOVED*** @private
***REMOVED***
goog.proto2.TextFormatSerializer.Parser.prototype.lookingAtType_ =
    function(type) {
  return this.tokenizer_.getCurrent().type == type;
***REMOVED***
