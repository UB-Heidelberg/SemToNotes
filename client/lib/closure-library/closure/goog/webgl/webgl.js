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
***REMOVED*** @fileoverview Constants used by the WebGL rendering, including all of the
***REMOVED*** constants used from the WebGL context.  For example, instead of using
***REMOVED*** context.ARRAY_BUFFER, your code can use
***REMOVED*** goog.webgl.ARRAY_BUFFER. The benefits for doing this include allowing
***REMOVED*** the compiler to optimize your code so that the compiled code does not have to
***REMOVED*** contain large strings to reference these properties, and reducing runtime
***REMOVED*** property access.
***REMOVED***
***REMOVED*** Values are taken from the WebGL Spec:
***REMOVED*** https://www.khronos.org/registry/webgl/specs/1.0/#WEBGLRENDERINGCONTEXT
***REMOVED***

goog.provide('goog.webgl');


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_BUFFER_BIT = 0x00000100;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BUFFER_BIT = 0x00000400;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COLOR_BUFFER_BIT = 0x00004000;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.POINTS = 0x0000;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINES = 0x0001;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINE_LOOP = 0x0002;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINE_STRIP = 0x0003;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TRIANGLES = 0x0004;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TRIANGLE_STRIP = 0x0005;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TRIANGLE_FAN = 0x0006;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ZERO = 0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE = 1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SRC_COLOR = 0x0300;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_SRC_COLOR = 0x0301;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SRC_ALPHA = 0x0302;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_SRC_ALPHA = 0x0303;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DST_ALPHA = 0x0304;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_DST_ALPHA = 0x0305;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DST_COLOR = 0x0306;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_DST_COLOR = 0x0307;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SRC_ALPHA_SATURATE = 0x0308;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FUNC_ADD = 0x8006;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_EQUATION = 0x8009;


***REMOVED***
***REMOVED*** Same as BLEND_EQUATION
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_EQUATION_RGB = 0x8009;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_EQUATION_ALPHA = 0x883D;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FUNC_SUBTRACT = 0x800A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FUNC_REVERSE_SUBTRACT = 0x800B;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_DST_RGB = 0x80C8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_SRC_RGB = 0x80C9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_DST_ALPHA = 0x80CA;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_SRC_ALPHA = 0x80CB;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CONSTANT_COLOR = 0x8001;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_CONSTANT_COLOR = 0x8002;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CONSTANT_ALPHA = 0x8003;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ONE_MINUS_CONSTANT_ALPHA = 0x8004;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND_COLOR = 0x8005;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ARRAY_BUFFER = 0x8892;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ELEMENT_ARRAY_BUFFER = 0x8893;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ARRAY_BUFFER_BINDING = 0x8894;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STREAM_DRAW = 0x88E0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STATIC_DRAW = 0x88E4;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DYNAMIC_DRAW = 0x88E8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BUFFER_SIZE = 0x8764;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BUFFER_USAGE = 0x8765;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CURRENT_VERTEX_ATTRIB = 0x8626;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRONT = 0x0404;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BACK = 0x0405;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRONT_AND_BACK = 0x0408;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CULL_FACE = 0x0B44;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLEND = 0x0BE2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DITHER = 0x0BD0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_TEST = 0x0B90;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_TEST = 0x0B71;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SCISSOR_TEST = 0x0C11;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.POLYGON_OFFSET_FILL = 0x8037;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLE_ALPHA_TO_COVERAGE = 0x809E;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLE_COVERAGE = 0x80A0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NO_ERROR = 0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INVALID_ENUM = 0x0500;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INVALID_VALUE = 0x0501;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INVALID_OPERATION = 0x0502;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.OUT_OF_MEMORY = 0x0505;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CW = 0x0900;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CCW = 0x0901;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINE_WIDTH = 0x0B21;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ALIASED_POINT_SIZE_RANGE = 0x846D;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ALIASED_LINE_WIDTH_RANGE = 0x846E;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CULL_FACE_MODE = 0x0B45;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRONT_FACE = 0x0B46;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_RANGE = 0x0B70;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_WRITEMASK = 0x0B72;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_CLEAR_VALUE = 0x0B73;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_FUNC = 0x0B74;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_CLEAR_VALUE = 0x0B91;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_FUNC = 0x0B92;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_FAIL = 0x0B94;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_PASS_DEPTH_FAIL = 0x0B95;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_PASS_DEPTH_PASS = 0x0B96;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_REF = 0x0B97;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_VALUE_MASK = 0x0B93;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_WRITEMASK = 0x0B98;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_FUNC = 0x8800;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_FAIL = 0x8801;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_REF = 0x8CA3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_VALUE_MASK = 0x8CA4;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BACK_WRITEMASK = 0x8CA5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VIEWPORT = 0x0BA2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SCISSOR_BOX = 0x0C10;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COLOR_CLEAR_VALUE = 0x0C22;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COLOR_WRITEMASK = 0x0C23;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNPACK_ALIGNMENT = 0x0CF5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.PACK_ALIGNMENT = 0x0D05;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_TEXTURE_SIZE = 0x0D33;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_VIEWPORT_DIMS = 0x0D3A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SUBPIXEL_BITS = 0x0D50;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RED_BITS = 0x0D52;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.GREEN_BITS = 0x0D53;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BLUE_BITS = 0x0D54;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ALPHA_BITS = 0x0D55;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_BITS = 0x0D56;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_BITS = 0x0D57;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.POLYGON_OFFSET_UNITS = 0x2A00;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.POLYGON_OFFSET_FACTOR = 0x8038;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_BINDING_2D = 0x8069;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLE_BUFFERS = 0x80A8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLES = 0x80A9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLE_COVERAGE_VALUE = 0x80AA;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLE_COVERAGE_INVERT = 0x80AB;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPRESSED_TEXTURE_FORMATS = 0x86A3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DONT_CARE = 0x1100;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FASTEST = 0x1101;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NICEST = 0x1102;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.GENERATE_MIPMAP_HINT = 0x8192;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BYTE = 0x1400;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_BYTE = 0x1401;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SHORT = 0x1402;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_SHORT = 0x1403;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INT = 0x1404;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_INT = 0x1405;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT = 0x1406;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_COMPONENT = 0x1902;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ALPHA = 0x1906;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RGB = 0x1907;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RGBA = 0x1908;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LUMINANCE = 0x1909;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LUMINANCE_ALPHA = 0x190A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_SHORT_4_4_4_4 = 0x8033;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_SHORT_5_5_5_1 = 0x8034;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNSIGNED_SHORT_5_6_5 = 0x8363;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAGMENT_SHADER = 0x8B30;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_SHADER = 0x8B31;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_VERTEX_ATTRIBS = 0x8869;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_VARYING_VECTORS = 0x8DFC;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_TEXTURE_IMAGE_UNITS = 0x8872;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SHADER_TYPE = 0x8B4F;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DELETE_STATUS = 0x8B80;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINK_STATUS = 0x8B82;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VALIDATE_STATUS = 0x8B83;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ATTACHED_SHADERS = 0x8B85;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ACTIVE_UNIFORMS = 0x8B86;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ACTIVE_ATTRIBUTES = 0x8B89;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SHADING_LANGUAGE_VERSION = 0x8B8C;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CURRENT_PROGRAM = 0x8B8D;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NEVER = 0x0200;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LESS = 0x0201;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.EQUAL = 0x0202;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LEQUAL = 0x0203;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.GREATER = 0x0204;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NOTEQUAL = 0x0205;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.GEQUAL = 0x0206;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ALWAYS = 0x0207;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.KEEP = 0x1E00;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.REPLACE = 0x1E01;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INCR = 0x1E02;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DECR = 0x1E03;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INVERT = 0x150A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INCR_WRAP = 0x8507;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DECR_WRAP = 0x8508;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VENDOR = 0x1F00;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERER = 0x1F01;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERSION = 0x1F02;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NEAREST = 0x2600;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINEAR = 0x2601;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NEAREST_MIPMAP_NEAREST = 0x2700;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINEAR_MIPMAP_NEAREST = 0x2701;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NEAREST_MIPMAP_LINEAR = 0x2702;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LINEAR_MIPMAP_LINEAR = 0x2703;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_MAG_FILTER = 0x2800;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_MIN_FILTER = 0x2801;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_WRAP_S = 0x2802;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_WRAP_T = 0x2803;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_2D = 0x0DE1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE = 0x1702;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP = 0x8513;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_BINDING_CUBE_MAP = 0x8514;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE0 = 0x84C0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE1 = 0x84C1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE2 = 0x84C2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE3 = 0x84C3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE4 = 0x84C4;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE5 = 0x84C5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE6 = 0x84C6;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE7 = 0x84C7;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE8 = 0x84C8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE9 = 0x84C9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE10 = 0x84CA;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE11 = 0x84CB;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE12 = 0x84CC;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE13 = 0x84CD;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE14 = 0x84CE;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE15 = 0x84CF;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE16 = 0x84D0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE17 = 0x84D1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE18 = 0x84D2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE19 = 0x84D3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE20 = 0x84D4;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE21 = 0x84D5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE22 = 0x84D6;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE23 = 0x84D7;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE24 = 0x84D8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE25 = 0x84D9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE26 = 0x84DA;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE27 = 0x84DB;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE28 = 0x84DC;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE29 = 0x84DD;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE30 = 0x84DE;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE31 = 0x84DF;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.ACTIVE_TEXTURE = 0x84E0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.REPEAT = 0x2901;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CLAMP_TO_EDGE = 0x812F;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MIRRORED_REPEAT = 0x8370;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_VEC2 = 0x8B50;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_VEC3 = 0x8B51;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_VEC4 = 0x8B52;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INT_VEC2 = 0x8B53;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INT_VEC3 = 0x8B54;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INT_VEC4 = 0x8B55;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BOOL = 0x8B56;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BOOL_VEC2 = 0x8B57;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BOOL_VEC3 = 0x8B58;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BOOL_VEC4 = 0x8B59;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_MAT2 = 0x8B5A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_MAT3 = 0x8B5B;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FLOAT_MAT4 = 0x8B5C;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLER_2D = 0x8B5E;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.SAMPLER_CUBE = 0x8B60;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPILE_STATUS = 0x8B81;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LOW_FLOAT = 0x8DF0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MEDIUM_FLOAT = 0x8DF1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.HIGH_FLOAT = 0x8DF2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.LOW_INT = 0x8DF3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MEDIUM_INT = 0x8DF4;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.HIGH_INT = 0x8DF5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER = 0x8D40;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER = 0x8D41;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RGBA4 = 0x8056;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RGB5_A1 = 0x8057;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RGB565 = 0x8D62;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_COMPONENT16 = 0x81A5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_INDEX = 0x1901;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_INDEX8 = 0x8D48;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_STENCIL = 0x84F9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_WIDTH = 0x8D42;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_HEIGHT = 0x8D43;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_INTERNAL_FORMAT = 0x8D44;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_RED_SIZE = 0x8D50;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_GREEN_SIZE = 0x8D51;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_BLUE_SIZE = 0x8D52;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_ALPHA_SIZE = 0x8D53;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_DEPTH_SIZE = 0x8D54;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_STENCIL_SIZE = 0x8D55;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8CD0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8CD1;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8CD2;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COLOR_ATTACHMENT0 = 0x8CE0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_ATTACHMENT = 0x8D00;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.STENCIL_ATTACHMENT = 0x8D20;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.DEPTH_STENCIL_ATTACHMENT = 0x821A;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.NONE = 0;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_COMPLETE = 0x8CD5;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_UNSUPPORTED = 0x8CDD;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAMEBUFFER_BINDING = 0x8CA6;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.RENDERBUFFER_BINDING = 0x8CA7;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_RENDERBUFFER_SIZE = 0x84E8;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.INVALID_FRAMEBUFFER_OPERATION = 0x0506;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNPACK_FLIP_Y_WEBGL = 0x9240;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.CONTEXT_LOST_WEBGL = 0x9242;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;


***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.BROWSER_DEFAULT_WEBGL = 0x9244;


***REMOVED***
***REMOVED*** From the OES_texture_half_float extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/OES_texture_half_float/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.HALF_FLOAT_OES = 0x8D61;


***REMOVED***
***REMOVED*** From the OES_standard_derivatives extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/OES_standard_derivatives/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8B8B;


***REMOVED***
***REMOVED*** From the OES_vertex_array_object extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/OES_vertex_array_object/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.VERTEX_ARRAY_BINDING_OES = 0x85B5;


***REMOVED***
***REMOVED*** From the WEBGL_debug_renderer_info extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_debug_renderer_info/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNMASKED_VENDOR_WEBGL = 0x9245;


***REMOVED***
***REMOVED*** From the WEBGL_debug_renderer_info extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_debug_renderer_info/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.UNMASKED_RENDERER_WEBGL = 0x9246;


***REMOVED***
***REMOVED*** From the WEBGL_compressed_texture_s3tc extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;


***REMOVED***
***REMOVED*** From the WEBGL_compressed_texture_s3tc extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;


***REMOVED***
***REMOVED*** From the WEBGL_compressed_texture_s3tc extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;


***REMOVED***
***REMOVED*** From the WEBGL_compressed_texture_s3tc extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;


***REMOVED***
***REMOVED*** From the EXT_texture_filter_anisotropic extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;


***REMOVED***
***REMOVED*** From the EXT_texture_filter_anisotropic extension.
***REMOVED*** http://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic/
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.webgl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;
