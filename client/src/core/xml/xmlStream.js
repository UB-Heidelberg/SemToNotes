***REMOVED***
***REMOVED*** @fileoverview A class to stream over the tokens of
***REMOVED*** a XML instance.
***REMOVED***

goog.provide('xrx.xml.Stream');



goog.require('goog.object');
goog.require('goog.string');
goog.require('xrx.xml.Location');
goog.require('xrx.xml.Reader');
goog.require('xrx.token');



***REMOVED***
***REMOVED*** A class to stream over the tokens of a XML instance.
***REMOVED***   
***REMOVED*** @param {!string} xml A well-formed, normalized XML document or
***REMOVED*** XML fragment. Make sure that the input is parsed with
***REMOVED***
***REMOVED***
xrx.xml.Stream = function(xml) {



 ***REMOVED*****REMOVED***
  ***REMOVED*** @type
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.reader_ = new xrx.xml.Reader(xml);
  
  

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the stream is stopped.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.stopped_ = false;



 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.features_ = {
    TAG_NAME: false,
    ATTRIBUTE: false,
    ATTR_NAME: false,
    ATTR_VALUE: false,
    NAMESPACE: false,
    NS_PREFIX: false,
    NS_URI: false
  }


 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether at least one feature is on.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.oneFeatureOn_ = false;
***REMOVED***



***REMOVED***
***REMOVED*** Event, thrown whenever a start-tag row is found.
***REMOVED***
xrx.xml.Stream.prototype.rowStartTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a end-tag row is found.
***REMOVED***
xrx.xml.Stream.prototype.rowEndTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a empty-tag row is found.
***REMOVED***
xrx.xml.Stream.prototype.rowEmptyTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a tag-name is found.
***REMOVED***
xrx.xml.Stream.prototype.eventTagName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute token is found.
***REMOVED***
xrx.xml.Stream.prototype.eventAttribute = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute name is found.
***REMOVED***
xrx.xml.Stream.prototype.eventAttrName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute value is found.
***REMOVED***
xrx.xml.Stream.prototype.eventAttrValue = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace token is found.
***REMOVED***
xrx.xml.Stream.prototype.eventNamespace = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace prefix is found.
***REMOVED***
xrx.xml.Stream.prototype.eventNsPrefix = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace URI is found.
***REMOVED***
xrx.xml.Stream.prototype.eventNsUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** Function to turn events on and off.
***REMOVED*** 
***REMOVED*** @param {!string} feature The name of the feature.
***REMOVED*** @param {!boolean} flag On or off.
***REMOVED***
xrx.xml.Stream.prototype.setFeature = function(feature, flag) {
  if (this.features_[feature] === undefined) throw Error('Unknown feature.');
  var on = false;

  this.features_[feature] = flag || true;

  for(var f in this.features_) {
    if (this.features_[f] === true) on = true;
 ***REMOVED*****REMOVED***
  this.oneFeatureOn_ = on;
***REMOVED***



***REMOVED***
***REMOVED*** Convenience function to turn all events on or off.
***REMOVED*** 
***REMOVED*** @param {!boolean} flag On or off.
***REMOVED***
xrx.xml.Stream.prototype.setFeatures = function(flag) {
  
  for(var f in this.features_) {
    this.features_[f] = flag;
  }
  flag === true ? this.oneFeatureOn_ = true :
    this.oneFeatureOn_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Whether a specific feature is turned on or off.
***REMOVED*** 
***REMOVED*** @param {!string} feature The feature to test.
***REMOVED*** @return {!boolean} True when on otherwise false.
***REMOVED***
xrx.xml.Stream.prototype.hasFeature = function(feature) {
  return this.features_[feature] === true;
***REMOVED***



***REMOVED***
***REMOVED*** Returns or sets the content of the current stream reader.
***REMOVED*** 
***REMOVED*** @param opt_xml Well-formed, normalized UTF-8 XML string.
***REMOVED*** @return The content of the stream reader.
***REMOVED***
xrx.xml.Stream.prototype.xml = function(opt_xml) {
  
  return !opt_xml ? this.reader_.input() : this.reader_.input(opt_xml);
***REMOVED***



***REMOVED***
***REMOVED*** Updates the XML stream at a given location.
***REMOVED*** 
***REMOVED*** @param {!number} offset The offset.
***REMOVED*** @param {!number} length Number of characters to replace.
***REMOVED*** @param {!string} xml The new string.
***REMOVED***
xrx.xml.Stream.prototype.update = function(offset, length, xml) {
  
  this.reader_.input(this.xml().substr(0, offset) + xml + 
      this.xml().substr(offset + length));
***REMOVED***



***REMOVED***
***REMOVED*** Can be called to stop streaming.
***REMOVED***
xrx.xml.Stream.prototype.stop = function() {

  this.stopped_ = true;
***REMOVED***



***REMOVED***
***REMOVED*** Returns or sets the position of the stream reader.
***REMOVED*** 
***REMOVED*** @param opt_pos The position.
***REMOVED*** @return {!number} The position or the new position.
***REMOVED***
xrx.xml.Stream.prototype.pos = function(opt_pos) {
  if (opt_pos) this.reader_.set(opt_pos);
  return this.reader_.pos();
***REMOVED***



***REMOVED***
***REMOVED*** Throws events for the secondary tokens of a tag for the features
***REMOVED*** is turned on.
***REMOVED*** TODO(jochen): can we avoid reparsing of tokens?
***REMOVED***
***REMOVED*** @param token The current token.
***REMOVED*** @param {!number} offset The current offset.
***REMOVED*** @param {!number} length The current length.
***REMOVED***
xrx.xml.Stream.prototype.features = function(token, offset, length) {
  var stream = this;

  if (stream.oneFeatureOn_ === true) {
    var tag = stream.xml().substr(offset, length);

    // tag name feature on?
    if (stream.hasFeature('TAG_NAME')) {
      var name = stream.tagName(tag);
      stream.eventTagName(name.offset + offset, name.length);
    }

    // attribute or namespace feature on?
    if (stream.hasFeature('NAMESPACE') || stream.hasFeature('ATTRIBUTE') ||
        stream.hasFeature('ATTR_NAME') || stream.hasFeature('ATTR_VALUE') ||
        stream.hasFeature('NS_PREFIX') || stream.hasFeature('NS_URI')) {

      if ((token === xrx.token.START_TAG || token === xrx.token.EMPTY_TAG)) {
        var atts = stream.secondaries(tag);
        goog.object.forEach(atts, function(att, pos, atts) {

          if (goog.string.startsWith(att.xml(tag), 'xmlns:') ||
              goog.string.startsWith(att.xml(tag), 'xmlns=')) {

            if (stream.hasFeature('NAMESPACE')) {
              stream.eventNamespace(att.offset + offset, att.length);
            }

            // namespace prefix feature on?
            if (stream.hasFeature('NS_PREFIX')) {
              var nsPrefix = stream.attr_(tag, 1, xrx.token.ATTR_NAME, att.offset);
              stream.eventNsPrefix(nsPrefix.offset + offset, nsPrefix.length);
            }

            // namespace uri feature on?
            if (stream.hasFeature('NS_URI')) {
              var nsUri = stream.attr_(tag, 1, xrx.token.ATTR_VALUE, att.offset);
              stream.eventNsUri(nsUri.offset + offset, nsUri.length);
            }

          } else {

            if (stream.hasFeature('ATTRIBUTE')) {
              stream.eventAttribute(att.offset + offset, att.length);
            }

            // attribute name feature on?
            if (stream.hasFeature('ATTR_NAME')) {
              var attrName = stream.attr_(tag, 1, xrx.token.ATTR_NAME, att.offset);
              stream.eventAttrName(attrName.offset + offset, attrName.length);
            }

            // attribute value feature on?
            if (stream.hasFeature('ATTR_VALUE')) {
              var attrValue = stream.attr_(tag, 1, xrx.token.ATTR_VALUE, att.offset);
              stream.eventAttrValue(attrValue.offset + offset, attrValue.length);
            }
          }
        });
      }
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Enumeration of internal states used by the streamer.
***REMOVED*** @enum
***REMOVED*** @private
***REMOVED***
xrx.xml.Stream.State_ = {
  XML_START: 'XML_START',
  XML_END: 'XML_END',
  START_TAG: 'START_TAG',
  END_TAG: 'END_TAG',
  EMPTY_TAG: 'EMPTY_TAG',
  NOT_TAG: 'NOT_TAG',
  LT_SEEN: 'LT_SEEN',
  GT_SEEN: 'GT_SEEN',
  WS_SEEN: 'WS_SEEN',
  TAG_START: 'TAG_START',
  TAG_NAME: 'TAG_NAME',
  TOK_END: 'TOK_END',
  ATTR_NAME: 'ATTR_NAME',
  ATTR_VAL: 'ATTR_VAL'
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a XML document or XML fragment in forward direction
***REMOVED*** and fires start-row, end-row, empty row and namespace events. 
***REMOVED*** The streaming starts at the beginning of the XML document / 
***REMOVED*** fragment by default or optionally at an offset.
***REMOVED*** 
***REMOVED*** @param {?number} opt_offset The offset.
***REMOVED***
xrx.xml.Stream.prototype.forward = function(opt_offset) {
  var state = xrx.xml.Stream.State_.XML_START;
  var token;
  var offset;
  var length;
  var reader = this.reader_;

  !opt_offset ? reader.first() : reader.set(opt_offset);
  this.stopped_ = false;

  var process = {
    'XML_START': function() {
      reader.get() === '<' ? state = xrx.xml.Stream.State_.LT_SEEN :
        state = xrx.xml.Stream.State_.NOT_TAG;
    },
    'XML_END': function() {},
    'START_TAG': function() {
      offset = reader.pos();
      reader.forwardInclusive('>');
      state = xrx.xml.Stream.State_.NOT_TAG;
      reader.peek(-2) === '/' ? token = xrx.token.EMPTY_TAG : 
          token = xrx.token.START_TAG;
      length = reader.pos() - offset;
    },
    'END_TAG': function() {
      offset = reader.pos();
      reader.forwardInclusive('>');
      state = xrx.xml.Stream.State_.NOT_TAG;
      token = xrx.token.END_TAG;
      length = reader.pos() - offset;
    },
    'EMPTY_TAG': function() {},
    'NOT_TAG': function(stream) {
      if (!reader.get()) {
        state = xrx.xml.Stream.State_.XML_END;
      } else if (reader.peek() === '<') {
        state = xrx.xml.Stream.State_.LT_SEEN;
      } else {
        reader.forwardExclusive('<');
        state = xrx.xml.Stream.State_.LT_SEEN;
      }
      // if we have parsed the not-tag, the row is complete.
      if (token === xrx.token.START_TAG) {
        stream.rowStartTag(offset, length, reader.pos() - offset);
      } else if (token === xrx.token.END_TAG) {
        stream.rowEndTag(offset, length, reader.pos() - offset);
      } else if (token === xrx.token.EMPTY_TAG) {
        stream.rowEmptyTag(offset, length, reader.pos() - offset);
      } else {}

      stream.features(token, offset, length);
    },
    'LT_SEEN': function() {
      if (reader.peek(1) === '/') {
        state = xrx.xml.Stream.State_.END_TAG;
      } else {
        state = xrx.xml.Stream.State_.START_TAG;
      }
    }
 ***REMOVED*****REMOVED***

  for (;;) {

    if (process[state]) { 
      process[state](this);
    } else {
      throw Error('Invalid parser state.');
    }

    if (state === xrx.xml.Stream.State_.XML_END || this.stopped_) {
      this.stopped_ = false;
      break;
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a XML document or XML fragment in backward direction
***REMOVED*** and fires start-row, end-row, empty row and namespace events. The 
***REMOVED*** streaming starts at the end of the XML document / fragment by 
***REMOVED*** default or optionally at an offset.
***REMOVED*** 
***REMOVED*** @param {?number} opt_offset The offset.
***REMOVED***
xrx.xml.Stream.prototype.backward = function(opt_offset) {
  var state = xrx.xml.Stream.State_.XML_START;
  var reader = this.reader_;
  var token;
  var offset;
  var length;
  var pos = !opt_offset ? reader.length() : opt_offset;

  !opt_offset ? reader.last() : reader.set(opt_offset);
  this.stopped_ = false;

  var process = {
    'XML_START': function() {
      if (reader.get() === '<') reader.previous();
      reader.get() === '>' ? state = xrx.xml.Stream.State_.GT_SEEN : 
          state = xrx.xml.Stream.State_.NOT_TAG;
    },
    'XML_END': function() {},
    'START_TAG': function() {},
    'END_TAG': function(stream) {
      offset = reader.pos();
      reader.backwardInclusive('<');
      state = xrx.xml.Stream.State_.NOT_TAG;
      if (reader.peek(1) !== '/') {
        var off = reader.pos();
        var len1 = offset - reader.pos() + 1;
        stream.rowStartTag(off, len1, pos - reader.pos());
        pos = reader.pos();
        stream.features(xrx.token.START_TAG, off, len1);
      } else {
        stream.rowEndTag(reader.pos(), offset - reader.pos() + 1, pos - reader.pos());
        pos = reader.pos();
        stream.features(xrx.token.END_TAG, reader.pos(), offset - reader.pos() + 1);
      }
      reader.previous();
      if (reader.finished()) state = xrx.xml.Stream.State_.XML_END;
    },
    'EMPTY_TAG': function(stream) {
      offset = reader.pos();
      reader.backwardInclusive('<');
      state = xrx.xml.Stream.State_.NOT_TAG;
      var off = reader.pos();
      var len1 = offset - reader.pos() + 1;
      stream.rowEmptyTag(off, len1, pos - reader.pos());
      pos = reader.pos();
      stream.features(xrx.token.EMPTY_TAG, off, len1);
      reader.previous();
      if (reader.finished()) state = xrx.xml.Stream.State_.XML_END;
    },
    'NOT_TAG': function(stream) {
      if (reader.get() === '>') {
        state = xrx.xml.Stream.State_.GT_SEEN;
      } else {
        offset = reader.pos();
        reader.backwardExclusive('>');
        reader.previous();
        state = xrx.xml.Stream.State_.GT_SEEN;
      }
      if (reader.finished()) state = xrx.xml.Stream.State_.XML_END;
    },
    'GT_SEEN': function() {
      if (reader.peek(-1) === '/') {
        state = xrx.xml.Stream.State_.EMPTY_TAG;
      } else {
        state = xrx.xml.Stream.State_.END_TAG;
      }
    }
 ***REMOVED*****REMOVED***

  for (;;) {

    if (process[state]) { 
      process[state](this);
    } else {
      throw Error('Invalid parser state.');
    }

    if (state === xrx.xml.Stream.State_.XML_END || this.stopped_) {
      this.stopped_ = false;
      break;
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag, a empty tag or an end-tag and
***REMOVED*** returns the location of the name of the tag.
***REMOVED*** 
***REMOVED*** @param {!string} xml The tag.
***REMOVED*** @param {?xrx.xml.Reader} opt_reader Optional reader object.
***REMOVED*** @return {!xrx.xml.Location} The tag-name.
***REMOVED***
xrx.xml.Stream.prototype.tagName = function(xml, opt_reader) {
  var state = xrx.xml.Stream.State_.TAG_START;
  var offset;
  var length;
  var reader = opt_reader || new xrx.xml.Reader(xml);

  this.stopped_ = false;

  var process = {
    'TAG_START': function() {
      if (reader.next() === '<') {
        state = xrx.xml.Stream.State_.TAG_NAME;
        reader.get() === '/' ? reader.next() : null;
        offset = reader.pos();
      } else {
        throw Error('< is expected.');
      }
    },
    'TAG_NAME': function() {
      var next = reader.next();
      if (next === ' ' || next === '/' || next === '>') {
        state = xrx.xml.Stream.State_.TOK_END;
        reader.backward();
        length = reader.pos() - offset - 1;
      }
    }
 ***REMOVED*****REMOVED***
  
  for (;;) {

    if (process[state]) { 
      process[state](this);
    } else {
      throw Error('Invalid parser state.');
    }

    if (state === xrx.xml.Stream.State_.TOK_END) break; 
  }

  return new xrx.xml.Location(offset, length);
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or a empty tag and returns the location
***REMOVED*** of the n'th attribute, or null if the attribute does not exist.
***REMOVED*** 
***REMOVED*** @param {!string} xml The start-tag or empty tag.
***REMOVED*** @param {!number} pos The attribute position.
***REMOVED*** @return {string|null} The attribute at position n or null.
***REMOVED***
xrx.xml.Stream.prototype.attribute = function(xml, pos, opt_offset) {
  return this.attr_(xml, pos, xrx.token.ATTRIBUTE, opt_offset);
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or a empty tag and returns an array of 
***REMOVED*** locations of all attributes found in the tag.
***REMOVED*** 
***REMOVED*** @param {!string} xml The start-tag or empty tag.
***REMOVED*** @return {Array.<xrx.xml.Location>} The location array.
***REMOVED***
xrx.xml.Stream.prototype.attributes = function(xml) {
  var locs = {***REMOVED***
  var location = new xrx.xml.Location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    if(newLocation.xml(xml).match(/^xmlns(:|=)/) === null) locs[i] = newLocation;
  }

  return locs;
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or a empty tag and returns an array of 
***REMOVED*** locations of all namespaces found in the tag.
***REMOVED*** 
***REMOVED*** @param {!string} xml The start-tag or empty tag.
***REMOVED*** @return {Array.<xrx.xml.Location>} The location array.
***REMOVED***
xrx.xml.Stream.prototype.namespaces = function(xml) {
  var locs = {***REMOVED***
  var location = new xrx.xml.Location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    if(newLocation.xml(xml).match(/^xmlns(:|=)/) !== null) locs[i] = newLocation;
  }

  return locs;
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or a empty tag and returns an array of 
***REMOVED*** locations of all attributes and namespaces found in the tag.
***REMOVED*** 
***REMOVED*** @param {!string} xml The start-tag or empty tag.
***REMOVED*** @return {Array.<xrx.xml.Location>} The location array.
***REMOVED***
xrx.xml.Stream.prototype.secondaries = function(xml) {
  var locs = {***REMOVED***
  var location = new xrx.xml.Location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    locs[i] = newLocation;
  }

  return locs;
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or empty tag and returns the location
***REMOVED*** of the name of the n'th attribute.
***REMOVED*** 
***REMOVED*** @param {!string} xml The tag.
***REMOVED*** @param {!number} pos The attribute position.
***REMOVED*** @return {!xrx.xml.Location} The attribute name location.
***REMOVED***
xrx.xml.Stream.prototype.attrName = function(xml, pos) {
  return this.attr_(xml, pos, xrx.token.ATTR_NAME);
***REMOVED***



***REMOVED***
***REMOVED*** Streams over a start-tag or empty tag and returns the location 
***REMOVED*** of the value of the n'th attribute.
***REMOVED*** 
***REMOVED*** @param {!string} xml The attribute.
***REMOVED*** @param {!number} pos The attribute position.
***REMOVED*** @return {!xrx.xml.Location} The attribute value location.
***REMOVED***
xrx.xml.Stream.prototype.attrValue = function(xml, pos, opt_offset) {
  return this.attr_(xml, pos, xrx.token.ATTR_VALUE, opt_offset);
***REMOVED***


***REMOVED***
***REMOVED*** Shared utility function for attributes.
***REMOVED*** 
***REMOVED*** @private
***REMOVED***
xrx.xml.Stream.prototype.attr_ = function(xml, pos, tokenType, opt_offset, opt_reader) {
  var reader = opt_reader || new xrx.xml.Reader(xml);
  if (opt_offset) reader.set(opt_offset);
  this.stopped_ = false;
  
  var location = !opt_offset ? this.tagName(xml, reader) : new xrx.xml.Location();
  // tag does not contain any attributes ? => return null
  if (reader.peek(-1).match(/(\/|>)/g)) return null; 

  var state = xrx.xml.Stream.State_.ATTR_NAME;
  var offset = reader.pos();
  var length;
  var found = 0;
  var quote;

  var process = {
    'ATTR_NAME': function() {
      found += 1;
      tokenType === xrx.token.ATTRIBUTE || tokenType === xrx.token.ATTR_NAME ? 
          offset = reader.pos() : null;
      reader.forwardInclusive('=');
      if (tokenType === xrx.token.ATTR_NAME && found === pos) {
        location.offset = offset;
        location.length = reader.pos() - offset - 1;
        state = xrx.xml.Stream.State_.TOK_END;
      } else {
        quote = reader.next();
        tokenType === xrx.token.ATTR_VALUE ? offset = reader.pos() : null;
        state = xrx.xml.Stream.State_.ATTR_VAL;
      }
    },
    'ATTR_VAL': function() {
      reader.forwardInclusive(quote);
      if(found === pos) {
        location.offset = offset;
        if (tokenType === xrx.token.ATTRIBUTE) {
          location.length = reader.pos() - offset;
        } else if (tokenType === xrx.token.ATTR_VALUE) {
          location.length = reader.pos() - offset - 1;
        } else {}
        state = xrx.xml.Stream.State_.TOK_END;
      } else {
        reader.next();
        var lst = reader.peek(-1);
        if(lst === '/' || lst === '>') {
          state = xrx.xml.Stream.State_.TOK_END;
          location = null;
        } else {
          state = xrx.xml.Stream.State_.ATTR_NAME;
        }
      }
    }
 ***REMOVED*****REMOVED***

  for (;;) {

    if (process[state]) { 
      process[state](this);
    } else {
      throw Error('Invalid parser state.');
    }
    
    if (state === xrx.xml.Stream.State_.TOK_END) break;
  }
  return location;
***REMOVED***



***REMOVED***
***REMOVED*** Streams over some XML content and returns the location of 
***REMOVED*** one or more comments.
***REMOVED***
xrx.xml.Stream.prototype.comment = function(xml) {
  // TODO(jochen)
***REMOVED***



***REMOVED***
***REMOVED*** Streams over some XML content and returns the location of 
***REMOVED*** one or more processing instructions (PI).
***REMOVED*** 
***REMOVED*** @param xml XML string.
***REMOVED***
xrx.xml.Stream.prototype.pi = function(xml) {
  // TODO(jochen)
***REMOVED***



***REMOVED***
***REMOVED*** Streams over some XML content and returns the location of
***REMOVED*** one or more character data (CDATA) sections.
***REMOVED*** 
***REMOVED*** @param xml XML string.
***REMOVED***
xrx.xml.Stream.prototype.cdata = function(xml) {
  // TODO(jochen)
***REMOVED***



***REMOVED***
***REMOVED*** Streams over some XML content and returns the location of
***REMOVED*** one or more document type declarations.
***REMOVED*** 
***REMOVED*** @param xml XML string.
***REMOVED***
xrx.xml.Stream.prototype.doctypedecl = function(xml) {
  // TODO(jochen)
***REMOVED***
