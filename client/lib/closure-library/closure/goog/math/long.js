// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Defines a Long class for representing a 64-bit two's-complement
***REMOVED*** integer value, which faithfully simulates the behavior of a Java "long". This
***REMOVED*** implementation is derived from LongLib in GWT.
***REMOVED***
***REMOVED***

goog.provide('goog.math.Long');



***REMOVED***
***REMOVED*** Constructs a 64-bit two's-complement integer, given its low and high 32-bit
***REMOVED*** values as***REMOVED***signed* integers.  See the from* functions below for more
***REMOVED*** convenient ways of constructing Longs.
***REMOVED***
***REMOVED*** The internal representation of a long is the two given signed, 32-bit values.
***REMOVED*** We use 32-bit pieces because these are the size of integers on which
***REMOVED*** Javascript performs bit-operations.  For operations like addition and
***REMOVED*** multiplication, we split each number into 16-bit pieces, which can easily be
***REMOVED*** multiplied within Javascript's floating-point representation without overflow
***REMOVED*** or change in sign.
***REMOVED***
***REMOVED*** In the algorithms below, we frequently reduce the negative case to the
***REMOVED*** positive case by negating the input(s) and then post-processing the result.
***REMOVED*** Note that we must ALWAYS check specially whether those values are MIN_VALUE
***REMOVED*** (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
***REMOVED*** a positive number, it overflows back into a negative).  Not handling this
***REMOVED*** case would often result in infinite recursion.
***REMOVED***
***REMOVED*** @param {number} low  The low (signed) 32 bits of the long.
***REMOVED*** @param {number} high  The high (signed) 32 bits of the long.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.math.Long = function(low, high) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.low_ = low | 0;  // force into 32 signed bits.

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.high_ = high | 0;  // force into 32 signed bits.
***REMOVED***


// NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
// from* methods on which they depend.


***REMOVED***
***REMOVED*** A cache of the Long representations of small integer values.
***REMOVED*** @type {!Object}
***REMOVED*** @private
***REMOVED***
goog.math.Long.IntCache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Returns a Long representing the given (32-bit) integer value.
***REMOVED*** @param {number} value The 32-bit integer in question.
***REMOVED*** @return {!goog.math.Long} The corresponding Long value.
***REMOVED***
goog.math.Long.fromInt = function(value) {
  if (-128 <= value && value < 128) {
    var cachedObj = goog.math.Long.IntCache_[value];
    if (cachedObj) {
      return cachedObj;
    }
  }

  var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
  if (-128 <= value && value < 128) {
    goog.math.Long.IntCache_[value] = obj;
  }
  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Long representing the given value, provided that it is a finite
***REMOVED*** number.  Otherwise, zero is returned.
***REMOVED*** @param {number} value The number in question.
***REMOVED*** @return {!goog.math.Long} The corresponding Long value.
***REMOVED***
goog.math.Long.fromNumber = function(value) {
  if (isNaN(value) || !isFinite(value)) {
    return goog.math.Long.ZERO;
  } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MIN_VALUE;
  } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MAX_VALUE;
  } else if (value < 0) {
    return goog.math.Long.fromNumber(-value).negate();
  } else {
    return new goog.math.Long(
        (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
        (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Long representing the 64-bit integer that comes by concatenating
***REMOVED*** the given high and low bits.  Each is assumed to use 32 bits.
***REMOVED*** @param {number} lowBits The low 32-bits.
***REMOVED*** @param {number} highBits The high 32-bits.
***REMOVED*** @return {!goog.math.Long} The corresponding Long value.
***REMOVED***
goog.math.Long.fromBits = function(lowBits, highBits) {
  return new goog.math.Long(lowBits, highBits);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a Long representation of the given string, written using the given
***REMOVED*** radix.
***REMOVED*** @param {string} str The textual representation of the Long.
***REMOVED*** @param {number=} opt_radix The radix in which the text is written.
***REMOVED*** @return {!goog.math.Long} The corresponding Long value.
***REMOVED***
goog.math.Long.fromString = function(str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }

  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (str.charAt(0) == '-') {
    return goog.math.Long.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }

  // Do several (8) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));

  var result = goog.math.Long.ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = goog.math.Long.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(goog.math.Long.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(goog.math.Long.fromNumber(value));
    }
  }
  return result;
***REMOVED***


// NOTE: the compiler should inline these constant values below and then remove
// these variables, so there should be no runtime penalty for these.


***REMOVED***
***REMOVED*** Number used repeated below in calculations.  This must appear before the
***REMOVED*** first call to any from* function below.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_32_DBL_ =
    goog.math.Long.TWO_PWR_16_DBL_***REMOVED*** goog.math.Long.TWO_PWR_16_DBL_;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_31_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ / 2;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_48_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_***REMOVED*** goog.math.Long.TWO_PWR_16_DBL_;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_64_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_***REMOVED*** goog.math.Long.TWO_PWR_32_DBL_;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_63_DBL_ =
    goog.math.Long.TWO_PWR_64_DBL_ / 2;


***REMOVED*** @type {!goog.math.Long}***REMOVED***
goog.math.Long.ZERO = goog.math.Long.fromInt(0);


***REMOVED*** @type {!goog.math.Long}***REMOVED***
goog.math.Long.ONE = goog.math.Long.fromInt(1);


***REMOVED*** @type {!goog.math.Long}***REMOVED***
goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);


***REMOVED*** @type {!goog.math.Long}***REMOVED***
goog.math.Long.MAX_VALUE =
    goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);


***REMOVED*** @type {!goog.math.Long}***REMOVED***
goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);


***REMOVED***
***REMOVED*** @type {!goog.math.Long}
***REMOVED*** @private
***REMOVED***
goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);


***REMOVED*** @return {number} The value, assuming it is a 32-bit integer.***REMOVED***
goog.math.Long.prototype.toInt = function() {
  return this.low_;
***REMOVED***


***REMOVED*** @return {number} The closest floating-point representation to this value.***REMOVED***
goog.math.Long.prototype.toNumber = function() {
  return this.high_***REMOVED*** goog.math.Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
***REMOVED***


***REMOVED***
***REMOVED*** @param {number=} opt_radix The radix in which the text should be written.
***REMOVED*** @return {string} The textual representation of this value.
***REMOVED*** @override
***REMOVED***
goog.math.Long.prototype.toString = function(opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }

  if (this.isZero()) {
    return '0';
  }

  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      // We need to change the Long value before it can be negated, so we remove
      // the bottom-most digit in this base and then recurse to do the rest.
      var radixLong = goog.math.Long.fromNumber(radix);
      var div = this.div(radixLong);
      var rem = div.multiply(radixLong).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }

  // Do several (6) digits each time through the loop, so as to
  // minimize the calls to the very expensive emulated div.
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));

  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
    var digits = intval.toString(radix);

    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
***REMOVED***


***REMOVED*** @return {number} The high 32-bits as a signed value.***REMOVED***
goog.math.Long.prototype.getHighBits = function() {
  return this.high_;
***REMOVED***


***REMOVED*** @return {number} The low 32-bits as a signed value.***REMOVED***
goog.math.Long.prototype.getLowBits = function() {
  return this.low_;
***REMOVED***


***REMOVED*** @return {number} The low 32-bits as an unsigned value.***REMOVED***
goog.math.Long.prototype.getLowBitsUnsigned = function() {
  return (this.low_ >= 0) ?
      this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Returns the number of bits needed to represent the absolute
***REMOVED***     value of this Long.
***REMOVED***
goog.math.Long.prototype.getNumBitsAbs = function() {
  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & (1 << bit)) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
***REMOVED***


***REMOVED*** @return {boolean} Whether this value is zero.***REMOVED***
goog.math.Long.prototype.isZero = function() {
  return this.high_ == 0 && this.low_ == 0;
***REMOVED***


***REMOVED*** @return {boolean} Whether this value is negative.***REMOVED***
goog.math.Long.prototype.isNegative = function() {
  return this.high_ < 0;
***REMOVED***


***REMOVED*** @return {boolean} Whether this value is odd.***REMOVED***
goog.math.Long.prototype.isOdd = function() {
  return (this.low_ & 1) == 1;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long equals the other.
***REMOVED***
goog.math.Long.prototype.equals = function(other) {
  return (this.high_ == other.high_) && (this.low_ == other.low_);
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long does not equal the other.
***REMOVED***
goog.math.Long.prototype.notEquals = function(other) {
  return (this.high_ != other.high_) || (this.low_ != other.low_);
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long is less than the other.
***REMOVED***
goog.math.Long.prototype.lessThan = function(other) {
  return this.compare(other) < 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long is less than or equal to the other.
***REMOVED***
goog.math.Long.prototype.lessThanOrEqual = function(other) {
  return this.compare(other) <= 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long is greater than the other.
***REMOVED***
goog.math.Long.prototype.greaterThan = function(other) {
  return this.compare(other) > 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {boolean} Whether this Long is greater than or equal to the other.
***REMOVED***
goog.math.Long.prototype.greaterThanOrEqual = function(other) {
  return this.compare(other) >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** Compares this Long with the given one.
***REMOVED*** @param {goog.math.Long} other Long to compare against.
***REMOVED*** @return {number} 0 if they are the same, 1 if the this is greater, and -1
***REMOVED***     if the given one is greater.
***REMOVED***
goog.math.Long.prototype.compare = function(other) {
  if (this.equals(other)) {
    return 0;
  }

  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }

  // at this point, the signs are the same, so subtraction will not overflow
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
***REMOVED***


***REMOVED*** @return {!goog.math.Long} The negation of this value.***REMOVED***
goog.math.Long.prototype.negate = function() {
  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.MIN_VALUE;
  } else {
    return this.not().add(goog.math.Long.ONE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the sum of this and the given Long.
***REMOVED*** @param {goog.math.Long} other Long to add to this one.
***REMOVED*** @return {!goog.math.Long} The sum of this and the given Long.
***REMOVED***
goog.math.Long.prototype.add = function(other) {
  // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the difference of this and the given Long.
***REMOVED*** @param {goog.math.Long} other Long to subtract from this.
***REMOVED*** @return {!goog.math.Long} The difference of this and the given Long.
***REMOVED***
goog.math.Long.prototype.subtract = function(other) {
  return this.add(other.negate());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the product of this and the given long.
***REMOVED*** @param {goog.math.Long} other Long to multiply with this.
***REMOVED*** @return {!goog.math.Long} The product of this and the other.
***REMOVED***
goog.math.Long.prototype.multiply = function(other) {
  if (this.isZero()) {
    return goog.math.Long.ZERO;
  } else if (other.isZero()) {
    return goog.math.Long.ZERO;
  }

  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }

  // If both longs are small, use float multiplication
  if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
      other.lessThan(goog.math.Long.TWO_PWR_24_)) {
    return goog.math.Long.fromNumber(this.toNumber()***REMOVED*** other.toNumber());
  }

  // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;

  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;

  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00***REMOVED*** b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16***REMOVED*** b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00***REMOVED*** b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32***REMOVED*** b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16***REMOVED*** b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00***REMOVED*** b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48***REMOVED*** b00 + a32***REMOVED*** b16 + a16***REMOVED*** b32 + a00***REMOVED*** b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
***REMOVED***


***REMOVED***
***REMOVED*** Returns this Long divided by the given one.
***REMOVED*** @param {goog.math.Long} other Long by which to divide.
***REMOVED*** @return {!goog.math.Long} This Long divided by the given one.
***REMOVED***
goog.math.Long.prototype.div = function(other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return goog.math.Long.ZERO;
  }

  if (this.equals(goog.math.Long.MIN_VALUE)) {
    if (other.equals(goog.math.Long.ONE) ||
        other.equals(goog.math.Long.NEG_ONE)) {
      return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ONE;
    } else {
      // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(goog.math.Long.ZERO)) {
        return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.ZERO;
  }

  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }

  // Repeat the following until the remainder is less than other:  find a
  // floating-point that approximates remainder / other***REMOVED***from below*, add this
  // into the result, and subtract it from the remainder.  It is critical that
  // the approximate value is less than or equal to the real value so that the
  // remainder never becomes negative.
  var res = goog.math.Long.ZERO;
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    // Approximate the result of division. This may be a little greater or
    // smaller than the actual value.
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

    // We will tweak the approximate result by changing it in the 48-th digit or
    // the smallest non-fractional digit, whichever is larger.
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

    // Decrease the approximation until it is smaller than the remainder.  Note
    // that if it is too large, the product overflows and is negative.
    var approxRes = goog.math.Long.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = goog.math.Long.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }

    // We know the answer can't be zero... and actually, zero would cause
    // infinite recursion since we would make no progress.
    if (approxRes.isZero()) {
      approxRes = goog.math.Long.ONE;
    }

    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
***REMOVED***


***REMOVED***
***REMOVED*** Returns this Long modulo the given one.
***REMOVED*** @param {goog.math.Long} other Long by which to mod.
***REMOVED*** @return {!goog.math.Long} This Long modulo the given one.
***REMOVED***
goog.math.Long.prototype.modulo = function(other) {
  return this.subtract(this.div(other).multiply(other));
***REMOVED***


***REMOVED*** @return {!goog.math.Long} The bitwise-NOT of this value.***REMOVED***
goog.math.Long.prototype.not = function() {
  return goog.math.Long.fromBits(~this.low_, ~this.high_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the bitwise-AND of this Long and the given one.
***REMOVED*** @param {goog.math.Long} other The Long with which to AND.
***REMOVED*** @return {!goog.math.Long} The bitwise-AND of this and the other.
***REMOVED***
goog.math.Long.prototype.and = function(other) {
  return goog.math.Long.fromBits(this.low_ & other.low_,
                                 this.high_ & other.high_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the bitwise-OR of this Long and the given one.
***REMOVED*** @param {goog.math.Long} other The Long with which to OR.
***REMOVED*** @return {!goog.math.Long} The bitwise-OR of this and the other.
***REMOVED***
goog.math.Long.prototype.or = function(other) {
  return goog.math.Long.fromBits(this.low_ | other.low_,
                                 this.high_ | other.high_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the bitwise-XOR of this Long and the given one.
***REMOVED*** @param {goog.math.Long} other The Long with which to XOR.
***REMOVED*** @return {!goog.math.Long} The bitwise-XOR of this and the other.
***REMOVED***
goog.math.Long.prototype.xor = function(other) {
  return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                 this.high_ ^ other.high_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns this Long with bits shifted to the left by the given amount.
***REMOVED*** @param {number} numBits The number of bits by which to shift.
***REMOVED*** @return {!goog.math.Long} This shifted to the left by the given amount.
***REMOVED***
goog.math.Long.prototype.shiftLeft = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return goog.math.Long.fromBits(
          low << numBits,
          (high << numBits) | (low >>> (32 - numBits)));
    } else {
      return goog.math.Long.fromBits(0, low << (numBits - 32));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns this Long with bits shifted to the right by the given amount.
***REMOVED*** @param {number} numBits The number of bits by which to shift.
***REMOVED*** @return {!goog.math.Long} This shifted to the right by the given amount.
***REMOVED***
goog.math.Long.prototype.shiftRight = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >> numBits);
    } else {
      return goog.math.Long.fromBits(
          high >> (numBits - 32),
          high >= 0 ? 0 : -1);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns this Long with bits shifted to the right by the given amount, with
***REMOVED*** zeros placed into the new leading bits.
***REMOVED*** @param {number} numBits The number of bits by which to shift.
***REMOVED*** @return {!goog.math.Long} This shifted to the right by the given amount, with
***REMOVED***     zeros placed into the new leading bits.
***REMOVED***
goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >>> numBits);
    } else if (numBits == 32) {
      return goog.math.Long.fromBits(high, 0);
    } else {
      return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
    }
  }
***REMOVED***
