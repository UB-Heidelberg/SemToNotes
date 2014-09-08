// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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


////////////////////////// NOTE ABOUT EDITING THIS FILE ///////////////////////
//                                                                           //
// Any edits to this file must be applied to mat3d.js by running:            //
//   swap_type.sh mat3f.js > mat3d.js                                        //
//                                                                           //
////////////////////////// NOTE ABOUT EDITING THIS FILE ///////////////////////


***REMOVED***
***REMOVED*** @fileoverview Provides functions for operating on 3x3 float (32bit)
***REMOVED*** matrices.  The matrices are stored in column-major order.
***REMOVED***
***REMOVED*** The last parameter will typically be the output object and an object
***REMOVED*** can be both an input and output parameter to all methods except where
***REMOVED*** noted.
***REMOVED***
***REMOVED*** See the README for notes about the design and structure of the API
***REMOVED*** (especially related to performance).
***REMOVED***
***REMOVED***
goog.provide('goog.vec.mat3f');
goog.provide('goog.vec.mat3f.Type');

goog.require('goog.vec');


***REMOVED*** @typedef {goog.vec.Float32}***REMOVED*** goog.vec.mat3f.Type;


***REMOVED***
***REMOVED*** Creates a mat3f with all elements initialized to zero.
***REMOVED***
***REMOVED*** @return {!goog.vec.mat3f.Type} The new mat3f.
***REMOVED***
goog.vec.mat3f.create = function() {
  return new Float32Array(9);
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the matrix from the set of values. Note the values supplied are
***REMOVED*** in column major order.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the
***REMOVED***     values.
***REMOVED*** @param {number} v00 The values at (0, 0).
***REMOVED*** @param {number} v10 The values at (1, 0).
***REMOVED*** @param {number} v20 The values at (2, 0).
***REMOVED*** @param {number} v01 The values at (0, 1).
***REMOVED*** @param {number} v11 The values at (1, 1).
***REMOVED*** @param {number} v21 The values at (2, 1).
***REMOVED*** @param {number} v02 The values at (0, 2).
***REMOVED*** @param {number} v12 The values at (1, 2).
***REMOVED*** @param {number} v22 The values at (2, 2).
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setFromValues = function(
    mat, v00, v10, v20, v01, v11, v21, v02, v12, v22) {
  mat[0] = v00;
  mat[1] = v10;
  mat[2] = v20;
  mat[3] = v01;
  mat[4] = v11;
  mat[5] = v21;
  mat[6] = v02;
  mat[7] = v12;
  mat[8] = v22;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes mat3f mat from mat3f src.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The destination matrix.
***REMOVED*** @param {goog.vec.mat3f.Type} src The source matrix.
***REMOVED*** @return {!goog.vec.mat3f.Type} Return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setFromMat3f = function(mat, src) {
  mat[0] = src[0];
  mat[1] = src[1];
  mat[2] = src[2];
  mat[3] = src[3];
  mat[4] = src[4];
  mat[5] = src[5];
  mat[6] = src[6];
  mat[7] = src[7];
  mat[8] = src[8];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes mat3f mat from mat3d src (typed as a Float64Array to
***REMOVED*** avoid circular goog.requires).
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The destination matrix.
***REMOVED*** @param {Float64Array} src The source matrix.
***REMOVED*** @return {!goog.vec.mat3f.Type} Return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setFromMat3d = function(mat, src) {
  mat[0] = src[0];
  mat[1] = src[1];
  mat[2] = src[2];
  mat[3] = src[3];
  mat[4] = src[4];
  mat[5] = src[5];
  mat[6] = src[6];
  mat[7] = src[7];
  mat[8] = src[8];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes mat3f mat from Array src.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The destination matrix.
***REMOVED*** @param {Array.<number>} src The source matrix.
***REMOVED*** @return {!goog.vec.mat3f.Type} Return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setFromArray = function(mat, src) {
  mat[0] = src[0];
  mat[1] = src[1];
  mat[2] = src[2];
  mat[3] = src[3];
  mat[4] = src[4];
  mat[5] = src[5];
  mat[6] = src[6];
  mat[7] = src[7];
  mat[8] = src[8];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the element at the requested row and column.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix containing the value to
***REMOVED***     retrieve.
***REMOVED*** @param {number} row The row index.
***REMOVED*** @param {number} column The column index.
***REMOVED*** @return {number} The element value at the requested row, column indices.
***REMOVED***
goog.vec.mat3f.getElement = function(mat, row, column) {
  return mat[row + column***REMOVED*** 3];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the element at the requested row and column.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix containing the value to
***REMOVED***     retrieve.
***REMOVED*** @param {number} row The row index.
***REMOVED*** @param {number} column The column index.
***REMOVED*** @param {number} value The value to set at the requested row, column.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setElement = function(mat, row, column, value) {
  mat[row + column***REMOVED*** 3] = value;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the diagonal values of the matrix from the given values.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {number} v00 The values for (0, 0).
***REMOVED*** @param {number} v11 The values for (1, 1).
***REMOVED*** @param {number} v22 The values for (2, 2).
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setDiagonalValues = function(mat, v00, v11, v22) {
  mat[0] = v00;
  mat[4] = v11;
  mat[8] = v22;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the diagonal values of the matrix from the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector containing the values.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setDiagonal = function(mat, vec) {
  mat[0] = vec[0];
  mat[4] = vec[1];
  mat[8] = vec[2];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the specified column with the supplied values.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to recieve the values.
***REMOVED*** @param {number} column The column index to set the values on.
***REMOVED*** @param {number} v0 The value for row 0.
***REMOVED*** @param {number} v1 The value for row 1.
***REMOVED*** @param {number} v2 The value for row 2.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setColumnValues = function(mat, column, v0, v1, v2) {
  var i = column***REMOVED*** 3;
  mat[i] = v0;
  mat[i + 1] = v1;
  mat[i + 2] = v2;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the specified column with the value from the supplied array.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {number} column The column index to set the values on.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector elements for the column.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setColumn = function(mat, column, vec) {
  var i = column***REMOVED*** 3;
  mat[i] = vec[0];
  mat[i + 1] = vec[1];
  mat[i + 2] = vec[2];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the specified column from the matrix into the given vector
***REMOVED*** array.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix supplying the values.
***REMOVED*** @param {number} column The column to get the values from.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector elements to receive the
***REMOVED***     column.
***REMOVED*** @return {!goog.vec.vec3f.Type} return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.getColumn = function(mat, column, vec) {
  var i = column***REMOVED*** 3;
  vec[0] = mat[i];
  vec[1] = mat[i + 1];
  vec[2] = mat[i + 2];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the columns of the matrix from the set of vector elements.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {goog.vec.vec3f.Type} vec0 The values for column 0.
***REMOVED*** @param {goog.vec.vec3f.Type} vec1 The values for column 1.
***REMOVED*** @param {goog.vec.vec3f.Type} vec2 The values for column 2.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setColumns = function(mat, vec0, vec1, vec2) {
  goog.vec.mat3f.setColumn(mat, 0, vec0);
  goog.vec.mat3f.setColumn(mat, 1, vec1);
  goog.vec.mat3f.setColumn(mat, 2, vec2);
  return***REMOVED*****REMOVED*** @type {!goog.vec.mat3f.Type}***REMOVED***(mat);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the column values from the given matrix into the given vector
***REMOVED*** elements.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix supplying the columns.
***REMOVED*** @param {goog.vec.vec3f.Type} vec0 The vector to receive column 0.
***REMOVED*** @param {goog.vec.vec3f.Type} vec1 The vector to receive column 1.
***REMOVED*** @param {goog.vec.vec3f.Type} vec2 The vector to receive column 2.
***REMOVED***
goog.vec.mat3f.getColumns = function(mat, vec0, vec1, vec2) {
  goog.vec.mat3f.getColumn(mat, 0, vec0);
  goog.vec.mat3f.getColumn(mat, 1, vec1);
  goog.vec.mat3f.getColumn(mat, 2, vec2);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the row values from the supplied values.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {number} row The index of the row to receive the values.
***REMOVED*** @param {number} v0 The value for column 0.
***REMOVED*** @param {number} v1 The value for column 1.
***REMOVED*** @param {number} v2 The value for column 2.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setRowValues = function(mat, row, v0, v1, v2) {
  mat[row] = v0;
  mat[row + 3] = v1;
  mat[row + 6] = v2;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the row values from the supplied vector.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the row values.
***REMOVED*** @param {number} row The index of the row.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector containing the values.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setRow = function(mat, row, vec) {
  mat[row] = vec[0];
  mat[row + 3] = vec[1];
  mat[row + 6] = vec[2];
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the row values into the given vector.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix supplying the values.
***REMOVED*** @param {number} row The index of the row supplying the values.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector to receive the row.
***REMOVED*** @return {!goog.vec.vec3f.Type} return vec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.getRow = function(mat, row, vec) {
  vec[0] = mat[row];
  vec[1] = mat[row + 3];
  vec[2] = mat[row + 6];
  return vec;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the rows of the matrix from the supplied vectors.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to receive the values.
***REMOVED*** @param {goog.vec.vec3f.Type} vec0 The values for row 0.
***REMOVED*** @param {goog.vec.vec3f.Type} vec1 The values for row 1.
***REMOVED*** @param {goog.vec.vec3f.Type} vec2 The values for row 2.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.setRows = function(mat, vec0, vec1, vec2) {
  goog.vec.mat3f.setRow(mat, 0, vec0);
  goog.vec.mat3f.setRow(mat, 1, vec1);
  goog.vec.mat3f.setRow(mat, 2, vec2);
  return***REMOVED*****REMOVED*** @type {!goog.vec.mat3f.Type}***REMOVED***(mat);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the rows of the matrix into the supplied vectors.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to supplying the values.
***REMOVED*** @param {goog.vec.vec3f.Type} vec0 The vector to receive row 0.
***REMOVED*** @param {goog.vec.vec3f.Type} vec1 The vector to receive row 1.
***REMOVED*** @param {goog.vec.vec3f.Type} vec2 The vector to receive row 2.
***REMOVED***
goog.vec.mat3f.getRows = function(mat, vec0, vec1, vec2) {
  goog.vec.mat3f.getRow(mat, 0, vec0);
  goog.vec.mat3f.getRow(mat, 1, vec1);
  goog.vec.mat3f.getRow(mat, 2, vec2);
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix the zero matrix.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so operations can be chained.
***REMOVED***
goog.vec.mat3f.makeZero = function(mat) {
  mat[0] = 0;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = 0;
  mat[5] = 0;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = 0;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix the identity matrix.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so operations can be chained.
***REMOVED***
goog.vec.mat3f.makeIdentity = function(mat) {
  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = 1;
  mat[5] = 0;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = 1;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a per-component addition of the matrices mat0 and mat1, storing
***REMOVED*** the result into resultMat.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat0 The first addend.
***REMOVED*** @param {goog.vec.mat3f.Type} mat1 The second addend.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to
***REMOVED***     receive the results (may be either mat0 or mat1).
***REMOVED*** @return {!goog.vec.mat3f.Type} return resultMat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.addMat = function(mat0, mat1, resultMat) {
  resultMat[0] = mat0[0] + mat1[0];
  resultMat[1] = mat0[1] + mat1[1];
  resultMat[2] = mat0[2] + mat1[2];
  resultMat[3] = mat0[3] + mat1[3];
  resultMat[4] = mat0[4] + mat1[4];
  resultMat[5] = mat0[5] + mat1[5];
  resultMat[6] = mat0[6] + mat1[6];
  resultMat[7] = mat0[7] + mat1[7];
  resultMat[8] = mat0[8] + mat1[8];
  return resultMat;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a per-component subtraction of the matrices mat0 and mat1,
***REMOVED*** storing the result into resultMat.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat0 The minuend.
***REMOVED*** @param {goog.vec.mat3f.Type} mat1 The subtrahend.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to receive
***REMOVED***     the results (may be either mat0 or mat1).
***REMOVED*** @return {!goog.vec.mat3f.Type} return resultMat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.subMat = function(mat0, mat1, resultMat) {
  resultMat[0] = mat0[0] - mat1[0];
  resultMat[1] = mat0[1] - mat1[1];
  resultMat[2] = mat0[2] - mat1[2];
  resultMat[3] = mat0[3] - mat1[3];
  resultMat[4] = mat0[4] - mat1[4];
  resultMat[5] = mat0[5] - mat1[5];
  resultMat[6] = mat0[6] - mat1[6];
  resultMat[7] = mat0[7] - mat1[7];
  resultMat[8] = mat0[8] - mat1[8];
  return resultMat;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies matrix mat0 with the given scalar, storing the result
***REMOVED*** into resultMat.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} scalar The scalar value to multiple to each element of mat.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to receive
***REMOVED***     the results (may be mat).
***REMOVED*** @return {!goog.vec.mat3f.Type} return resultMat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.multScalar = function(mat, scalar, resultMat) {
  resultMat[0] = mat[0]***REMOVED*** scalar;
  resultMat[1] = mat[1]***REMOVED*** scalar;
  resultMat[2] = mat[2]***REMOVED*** scalar;
  resultMat[3] = mat[3]***REMOVED*** scalar;
  resultMat[4] = mat[4]***REMOVED*** scalar;
  resultMat[5] = mat[5]***REMOVED*** scalar;
  resultMat[6] = mat[6]***REMOVED*** scalar;
  resultMat[7] = mat[7]***REMOVED*** scalar;
  resultMat[8] = mat[8]***REMOVED*** scalar;
  return resultMat;
***REMOVED***


***REMOVED***
***REMOVED*** Multiplies the two matrices mat0 and mat1 using matrix multiplication,
***REMOVED*** storing the result into resultMat.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat0 The first (left hand) matrix.
***REMOVED*** @param {goog.vec.mat3f.Type} mat1 The second (right hand) matrix.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to receive
***REMOVED***     the results (may be either mat0 or mat1).
***REMOVED*** @return {!goog.vec.mat3f.Type} return resultMat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.multMat = function(mat0, mat1, resultMat) {
  var a00 = mat0[0], a10 = mat0[1], a20 = mat0[2];
  var a01 = mat0[3], a11 = mat0[4], a21 = mat0[5];
  var a02 = mat0[6], a12 = mat0[7], a22 = mat0[8];

  var b00 = mat1[0], b10 = mat1[1], b20 = mat1[2];
  var b01 = mat1[3], b11 = mat1[4], b21 = mat1[5];
  var b02 = mat1[6], b12 = mat1[7], b22 = mat1[8];

  resultMat[0] = a00***REMOVED*** b00 + a01***REMOVED*** b10 + a02***REMOVED*** b20;
  resultMat[1] = a10***REMOVED*** b00 + a11***REMOVED*** b10 + a12***REMOVED*** b20;
  resultMat[2] = a20***REMOVED*** b00 + a21***REMOVED*** b10 + a22***REMOVED*** b20;
  resultMat[3] = a00***REMOVED*** b01 + a01***REMOVED*** b11 + a02***REMOVED*** b21;
  resultMat[4] = a10***REMOVED*** b01 + a11***REMOVED*** b11 + a12***REMOVED*** b21;
  resultMat[5] = a20***REMOVED*** b01 + a21***REMOVED*** b11 + a22***REMOVED*** b21;
  resultMat[6] = a00***REMOVED*** b02 + a01***REMOVED*** b12 + a02***REMOVED*** b22;
  resultMat[7] = a10***REMOVED*** b02 + a11***REMOVED*** b12 + a12***REMOVED*** b22;
  resultMat[8] = a20***REMOVED*** b02 + a21***REMOVED*** b12 + a22***REMOVED*** b22;
  return resultMat;
***REMOVED***


***REMOVED***
***REMOVED*** Transposes the given matrix mat storing the result into resultMat.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix to transpose.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to receive
***REMOVED***     the results (may be mat).
***REMOVED*** @return {!goog.vec.mat3f.Type} return resultMat so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.transpose = function(mat, resultMat) {
  if (resultMat == mat) {
    var a10 = mat[1], a20 = mat[2], a21 = mat[5];
    resultMat[1] = mat[3];
    resultMat[2] = mat[6];
    resultMat[3] = a10;
    resultMat[5] = mat[7];
    resultMat[6] = a20;
    resultMat[7] = a21;
  } else {
    resultMat[0] = mat[0];
    resultMat[1] = mat[3];
    resultMat[2] = mat[6];
    resultMat[3] = mat[1];
    resultMat[4] = mat[4];
    resultMat[5] = mat[7];
    resultMat[6] = mat[2];
    resultMat[7] = mat[5];
    resultMat[8] = mat[8];
  }
  return resultMat;
***REMOVED***


***REMOVED***
***REMOVED*** Computes the inverse of mat0 storing the result into resultMat. If the
***REMOVED*** inverse is defined, this function returns true, false otherwise.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat0 The matrix to invert.
***REMOVED*** @param {goog.vec.mat3f.Type} resultMat The matrix to receive
***REMOVED***     the result (may be mat0).
***REMOVED*** @return {boolean} True if the inverse is defined. If false is returned,
***REMOVED***     resultMat is not modified.
***REMOVED***
goog.vec.mat3f.invert = function(mat0, resultMat) {
  var a00 = mat0[0], a10 = mat0[1], a20 = mat0[2];
  var a01 = mat0[3], a11 = mat0[4], a21 = mat0[5];
  var a02 = mat0[6], a12 = mat0[7], a22 = mat0[8];

  var t00 = a11***REMOVED*** a22 - a12***REMOVED*** a21;
  var t10 = a12***REMOVED*** a20 - a10***REMOVED*** a22;
  var t20 = a10***REMOVED*** a21 - a11***REMOVED*** a20;
  var det = a00***REMOVED*** t00 + a01***REMOVED*** t10 + a02***REMOVED*** t20;
  if (det == 0) {
    return false;
  }

  var idet = 1 / det;
  resultMat[0] = t00***REMOVED*** idet;
  resultMat[3] = (a02***REMOVED*** a21 - a01***REMOVED*** a22)***REMOVED*** idet;
  resultMat[6] = (a01***REMOVED*** a12 - a02***REMOVED*** a11)***REMOVED*** idet;

  resultMat[1] = t10***REMOVED*** idet;
  resultMat[4] = (a00***REMOVED*** a22 - a02***REMOVED*** a20)***REMOVED*** idet;
  resultMat[7] = (a02***REMOVED*** a10 - a00***REMOVED*** a12)***REMOVED*** idet;

  resultMat[2] = t20***REMOVED*** idet;
  resultMat[5] = (a01***REMOVED*** a20 - a00***REMOVED*** a21)***REMOVED*** idet;
  resultMat[8] = (a00***REMOVED*** a11 - a01***REMOVED*** a10)***REMOVED*** idet;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the components of mat0 are equal to the components of mat1.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat0 The first matrix.
***REMOVED*** @param {goog.vec.mat3f.Type} mat1 The second matrix.
***REMOVED*** @return {boolean} True if the the two matrices are equivalent.
***REMOVED***
goog.vec.mat3f.equals = function(mat0, mat1) {
  return mat0.length == mat1.length &&
      mat0[0] == mat1[0] && mat0[1] == mat1[1] && mat0[2] == mat1[2] &&
      mat0[3] == mat1[3] && mat0[4] == mat1[4] && mat0[5] == mat1[5] &&
      mat0[6] == mat1[6] && mat0[7] == mat1[7] && mat0[8] == mat1[8];
***REMOVED***


***REMOVED***
***REMOVED*** Transforms the given vector with the given matrix storing the resulting,
***REMOVED*** transformed matrix into resultVec.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix supplying the transformation.
***REMOVED*** @param {goog.vec.vec3f.Type} vec The vector to transform.
***REMOVED*** @param {goog.vec.vec3f.Type} resultVec The vector to
***REMOVED***     receive the results (may be vec).
***REMOVED*** @return {!goog.vec.vec3f.Type} return resultVec so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.multVec3 = function(mat, vec, resultVec) {
  var x = vec[0], y = vec[1], z = vec[2];
  resultVec[0] = x***REMOVED*** mat[0] + y***REMOVED*** mat[3] + z***REMOVED*** mat[6];
  resultVec[1] = x***REMOVED*** mat[1] + y***REMOVED*** mat[4] + z***REMOVED*** mat[7];
  resultVec[2] = x***REMOVED*** mat[2] + y***REMOVED*** mat[5] + z***REMOVED*** mat[8];
  return resultVec;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a translation matrix with x and y
***REMOVED*** translation values.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} x The translation along the x axis.
***REMOVED*** @param {number} y The translation along the y axis.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeTranslate = function(mat, x, y) {
  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = 1;
  mat[5] = 0;
  mat[6] = x;
  mat[7] = y;
  mat[8] = 1;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a scale matrix with x, y, and z scale factors.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The 3x3 (9-element) matrix
***REMOVED***     array to receive the new scale matrix.
***REMOVED*** @param {number} x The scale along the x axis.
***REMOVED*** @param {number} y The scale along the y axis.
***REMOVED*** @param {number} z The scale along the z axis.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeScale = function(mat, x, y, z) {
  mat[0] = x;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = y;
  mat[5] = 0;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = z;
  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a rotation matrix with the given rotation
***REMOVED*** angle about the axis defined by the vector (ax, ay, az).
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The rotation angle in radians.
***REMOVED*** @param {number} ax The x component of the rotation axis.
***REMOVED*** @param {number} ay The y component of the rotation axis.
***REMOVED*** @param {number} az The z component of the rotation axis.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeRotate = function(mat, angle, ax, ay, az) {
  var c = Math.cos(angle);
  var d = 1 - c;
  var s = Math.sin(angle);

  mat[0] = ax***REMOVED*** ax***REMOVED*** d + c;
  mat[1] = ax***REMOVED*** ay***REMOVED*** d + az***REMOVED*** s;
  mat[2] = ax***REMOVED*** az***REMOVED*** d - ay***REMOVED*** s;
  mat[3] = ax***REMOVED*** ay***REMOVED*** d - az***REMOVED*** s;
  mat[4] = ay***REMOVED*** ay***REMOVED*** d + c;
  mat[5] = ay***REMOVED*** az***REMOVED*** d + ax***REMOVED*** s;
  mat[6] = ax***REMOVED*** az***REMOVED*** d + ay***REMOVED*** s;
  mat[7] = ay***REMOVED*** az***REMOVED*** d - ax***REMOVED*** s;
  mat[8] = az***REMOVED*** az***REMOVED*** d + c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a rotation matrix with the given rotation
***REMOVED*** angle about the X axis.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The rotation angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeRotateX = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = c;
  mat[5] = s;
  mat[6] = 0;
  mat[7] = -s;
  mat[8] = c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a rotation matrix with the given rotation
***REMOVED*** angle about the Y axis.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The rotation angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeRotateY = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = c;
  mat[1] = 0;
  mat[2] = -s;
  mat[3] = 0;
  mat[4] = 1;
  mat[5] = 0;
  mat[6] = s;
  mat[7] = 0;
  mat[8] = c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a rotation matrix with the given rotation
***REMOVED*** angle about the Z axis.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The rotation angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeRotateZ = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = c;
  mat[1] = s;
  mat[2] = 0;
  mat[3] = -s;
  mat[4] = c;
  mat[5] = 0;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = 1;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Rotate the given matrix by angle about the x,y,z axis.  Equivalent to:
***REMOVED*** goog.vec.mat3f.multMat(
***REMOVED***     mat,
***REMOVED***     goog.vec.mat3f.makeRotate(goog.vec.mat3f.create(), angle, x, y, z),
***REMOVED***     mat);
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The angle in radians.
***REMOVED*** @param {number} x The x component of the rotation axis.
***REMOVED*** @param {number} y The y component of the rotation axis.
***REMOVED*** @param {number} z The z component of the rotation axis.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.rotate = function(mat, angle, x, y, z) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2];
  var m01 = mat[3], m11 = mat[4], m21 = mat[5];
  var m02 = mat[6], m12 = mat[7], m22 = mat[8];

  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var diffCosAngle = 1 - cosAngle;
  var r00 = x***REMOVED*** x***REMOVED*** diffCosAngle + cosAngle;
  var r10 = x***REMOVED*** y***REMOVED*** diffCosAngle + z***REMOVED*** sinAngle;
  var r20 = x***REMOVED*** z***REMOVED*** diffCosAngle - y***REMOVED*** sinAngle;

  var r01 = x***REMOVED*** y***REMOVED*** diffCosAngle - z***REMOVED*** sinAngle;
  var r11 = y***REMOVED*** y***REMOVED*** diffCosAngle + cosAngle;
  var r21 = y***REMOVED*** z***REMOVED*** diffCosAngle + x***REMOVED*** sinAngle;

  var r02 = x***REMOVED*** z***REMOVED*** diffCosAngle + y***REMOVED*** sinAngle;
  var r12 = y***REMOVED*** z***REMOVED*** diffCosAngle - x***REMOVED*** sinAngle;
  var r22 = z***REMOVED*** z***REMOVED*** diffCosAngle + cosAngle;

  mat[0] = m00***REMOVED*** r00 + m01***REMOVED*** r10 + m02***REMOVED*** r20;
  mat[1] = m10***REMOVED*** r00 + m11***REMOVED*** r10 + m12***REMOVED*** r20;
  mat[2] = m20***REMOVED*** r00 + m21***REMOVED*** r10 + m22***REMOVED*** r20;
  mat[3] = m00***REMOVED*** r01 + m01***REMOVED*** r11 + m02***REMOVED*** r21;
  mat[4] = m10***REMOVED*** r01 + m11***REMOVED*** r11 + m12***REMOVED*** r21;
  mat[5] = m20***REMOVED*** r01 + m21***REMOVED*** r11 + m22***REMOVED*** r21;
  mat[6] = m00***REMOVED*** r02 + m01***REMOVED*** r12 + m02***REMOVED*** r22;
  mat[7] = m10***REMOVED*** r02 + m11***REMOVED*** r12 + m12***REMOVED*** r22;
  mat[8] = m20***REMOVED*** r02 + m21***REMOVED*** r12 + m22***REMOVED*** r22;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Rotate the given matrix by angle about the x axis.  Equivalent to:
***REMOVED*** goog.vec.mat3f.multMat(
***REMOVED***     mat,
***REMOVED***     goog.vec.mat3f.makeRotateX(goog.vec.mat3f.create(), angle),
***REMOVED***     mat);
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.rotateX = function(mat, angle) {
  var m01 = mat[3], m11 = mat[4], m21 = mat[5];
  var m02 = mat[6], m12 = mat[7], m22 = mat[8];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[3] = m01***REMOVED*** c + m02***REMOVED*** s;
  mat[4] = m11***REMOVED*** c + m12***REMOVED*** s;
  mat[5] = m21***REMOVED*** c + m22***REMOVED*** s;
  mat[6] = m01***REMOVED*** -s + m02***REMOVED*** c;
  mat[7] = m11***REMOVED*** -s + m12***REMOVED*** c;
  mat[8] = m21***REMOVED*** -s + m22***REMOVED*** c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Rotate the given matrix by angle about the y axis.  Equivalent to:
***REMOVED*** goog.vec.mat3f.multMat(
***REMOVED***     mat,
***REMOVED***     goog.vec.mat3f.makeRotateY(goog.vec.mat3f.create(), angle),
***REMOVED***     mat);
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.rotateY = function(mat, angle) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2];
  var m02 = mat[6], m12 = mat[7], m22 = mat[8];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = m00***REMOVED*** c + m02***REMOVED*** -s;
  mat[1] = m10***REMOVED*** c + m12***REMOVED*** -s;
  mat[2] = m20***REMOVED*** c + m22***REMOVED*** -s;
  mat[6] = m00***REMOVED*** s + m02***REMOVED*** c;
  mat[7] = m10***REMOVED*** s + m12***REMOVED*** c;
  mat[8] = m20***REMOVED*** s + m22***REMOVED*** c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Rotate the given matrix by angle about the z axis.  Equivalent to:
***REMOVED*** goog.vec.mat3f.multMat(
***REMOVED***     mat,
***REMOVED***     goog.vec.mat3f.makeRotateZ(goog.vec.mat3f.create(), angle),
***REMOVED***     mat);
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} angle The angle in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.rotateZ = function(mat, angle) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2];
  var m01 = mat[3], m11 = mat[4], m21 = mat[5];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = m00***REMOVED*** c + m01***REMOVED*** s;
  mat[1] = m10***REMOVED*** c + m11***REMOVED*** s;
  mat[2] = m20***REMOVED*** c + m21***REMOVED*** s;
  mat[3] = m00***REMOVED*** -s + m01***REMOVED*** c;
  mat[4] = m10***REMOVED*** -s + m11***REMOVED*** c;
  mat[5] = m20***REMOVED*** -s + m21***REMOVED*** c;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Makes the given 3x3 matrix a rotation matrix given Euler angles using
***REMOVED*** the ZXZ convention.
***REMOVED*** Given the euler angles [theta1, theta2, theta3], the rotation is defined as
***REMOVED*** rotation = rotation_z(theta1)***REMOVED*** rotation_x(theta2)***REMOVED*** rotation_z(theta3),
***REMOVED*** with theta1 in [0, 2***REMOVED*** pi], theta2 in [0, pi] and theta3 in [0, 2***REMOVED*** pi].
***REMOVED*** rotation_x(theta) means rotation around the X axis of theta radians.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {number} theta1 The angle of rotation around the Z axis in radians.
***REMOVED*** @param {number} theta2 The angle of rotation around the X axis in radians.
***REMOVED*** @param {number} theta3 The angle of rotation around the Z axis in radians.
***REMOVED*** @return {!goog.vec.mat3f.Type} return mat so that operations can be
***REMOVED***     chained.
***REMOVED***
goog.vec.mat3f.makeEulerZXZ = function(mat, theta1, theta2, theta3) {
  var c1 = Math.cos(theta1);
  var s1 = Math.sin(theta1);

  var c2 = Math.cos(theta2);
  var s2 = Math.sin(theta2);

  var c3 = Math.cos(theta3);
  var s3 = Math.sin(theta3);

  mat[0] = c1***REMOVED*** c3 - c2***REMOVED*** s1***REMOVED*** s3;
  mat[1] = c2***REMOVED*** c1***REMOVED*** s3 + c3***REMOVED*** s1;
  mat[2] = s3***REMOVED*** s2;

  mat[3] = -c1***REMOVED*** s3 - c3***REMOVED*** c2***REMOVED*** s1;
  mat[4] = c1***REMOVED*** c2***REMOVED*** c3 - s1***REMOVED*** s3;
  mat[5] = c3***REMOVED*** s2;

  mat[6] = s2***REMOVED*** s1;
  mat[7] = -c1***REMOVED*** s2;
  mat[8] = c2;

  return mat;
***REMOVED***


***REMOVED***
***REMOVED*** Decomposes a rotation matrix into Euler angles using the ZXZ convention so
***REMOVED*** that rotation = rotation_z(theta1)***REMOVED*** rotation_x(theta2)***REMOVED*** rotation_z(theta3),
***REMOVED*** with theta1 in [0, 2***REMOVED*** pi], theta2 in [0, pi] and theta3 in [0, 2***REMOVED*** pi].
***REMOVED*** rotation_x(theta) means rotation around the X axis of theta radians.
***REMOVED***
***REMOVED*** @param {goog.vec.mat3f.Type} mat The matrix.
***REMOVED*** @param {goog.vec.vec3f.Type} euler The ZXZ Euler angles in
***REMOVED***     radians as [theta1, theta2, theta3].
***REMOVED*** @param {boolean=} opt_theta2IsNegative Whether theta2 is in [-pi, 0] instead
***REMOVED***     of the default [0, pi].
***REMOVED*** @return {!goog.vec.vec3f.Type} return euler so that operations can be
***REMOVED***     chained together.
***REMOVED***
goog.vec.mat3f.toEulerZXZ = function(mat, euler, opt_theta2IsNegative) {
  // There is an ambiguity in the sign of sinTheta2 because of the sqrt.
  var sinTheta2 = Math.sqrt(mat[2]***REMOVED*** mat[2] + mat[5]***REMOVED*** mat[5]);

  // By default we explicitely constrain theta2 to be in [0, pi],
  // so sinTheta2 is always positive. We can change the behavior and specify
  // theta2 to be negative in [-pi, 0] with opt_Theta2IsNegative.
  var signTheta2 = opt_theta2IsNegative ? -1 : 1;

  if (sinTheta2 > goog.vec.EPSILON) {
    euler[2] = Math.atan2(mat[2]***REMOVED*** signTheta2, mat[5]***REMOVED*** signTheta2);
    euler[1] = Math.atan2(sinTheta2***REMOVED*** signTheta2, mat[8]);
    euler[0] = Math.atan2(mat[6]***REMOVED*** signTheta2, -mat[7]***REMOVED*** signTheta2);
  } else {
    // There is also an arbitrary choice for theta1 = 0 or theta2 = 0 here.
    // We assume theta1 = 0 as some applications do not allow the camera to roll
    // (i.e. have theta1 != 0).
    euler[0] = 0;
    euler[1] = Math.atan2(sinTheta2***REMOVED*** signTheta2, mat[8]);
    euler[2] = Math.atan2(mat[1], mat[0]);
  }

  // Atan2 outputs angles in [-pi, pi] so we bring them back to [0, 2***REMOVED*** pi].
  euler[0] = (euler[0] + Math.PI***REMOVED*** 2) % (Math.PI***REMOVED*** 2);
  euler[2] = (euler[2] + Math.PI***REMOVED*** 2) % (Math.PI***REMOVED*** 2);
  // For theta2 we want the angle to be in [0, pi] or [-pi, 0] depending on
  // signTheta2.
  euler[1] = ((euler[1]***REMOVED*** signTheta2 + Math.PI***REMOVED*** 2) % (Math.PI***REMOVED*** 2))***REMOVED***
      signTheta2;

  return euler;
***REMOVED***
