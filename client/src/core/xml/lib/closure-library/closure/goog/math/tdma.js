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
***REMOVED*** @fileoverview The Tridiagonal matrix algorithm solver solves a special
***REMOVED*** version of a sparse linear system Ax = b where A is tridiagonal.
***REMOVED***
***REMOVED*** See http://en.wikipedia.org/wiki/Tridiagonal_matrix_algorithm
***REMOVED***
***REMOVED***

goog.provide('goog.math.tdma');


***REMOVED***
***REMOVED*** Solves a linear system where the matrix is square tri-diagonal. That is,
***REMOVED*** given a system of equations:
***REMOVED***
***REMOVED*** A***REMOVED*** result = vecRight,
***REMOVED***
***REMOVED*** this class computes result = inv(A)***REMOVED*** vecRight, where A has the special form
***REMOVED*** of a tri-diagonal matrix:
***REMOVED***
***REMOVED***    |dia(0) sup(0)   0    0     ...   0|
***REMOVED***    |sub(0) dia(1) sup(1) 0     ...   0|
***REMOVED*** A =|                ...               |
***REMOVED***    |0 ... 0 sub(n-2) dia(n-1) sup(n-1)|
***REMOVED***    |0 ... 0    0     sub(n-1)   dia(n)|
***REMOVED***
***REMOVED*** @param {!Array.<number>} subDiag The sub diagonal of the matrix.
***REMOVED*** @param {!Array.<number>} mainDiag The main diagonal of the matrix.
***REMOVED*** @param {!Array.<number>} supDiag The super diagonal of the matrix.
***REMOVED*** @param {!Array.<number>} vecRight The right vector of the system
***REMOVED***     of equations.
***REMOVED*** @param {Array.<number>=} opt_result The optional array to store the result.
***REMOVED*** @return {!Array.<number>} The vector that is the solution to the system.
***REMOVED***
goog.math.tdma.solve = function(
    subDiag, mainDiag, supDiag, vecRight, opt_result) {
  // Make a local copy of the main diagonal and the right vector.
  mainDiag = mainDiag.slice();
  vecRight = vecRight.slice();

  // The dimension of the matrix.
  var nDim = mainDiag.length;

  // Construct a modified linear system of equations with the same solution
  // as the input one.
  for (var i = 1; i < nDim; ++i) {
    var m = subDiag[i - 1] / mainDiag[i - 1];
    mainDiag[i] = mainDiag[i] - m***REMOVED*** supDiag[i - 1];
    vecRight[i] = vecRight[i] - m***REMOVED*** vecRight[i - 1];
  }

  // Solve the new system of equations by simple back-substitution.
  var result = opt_result || new Array(vecRight.length);
  result[nDim - 1] = vecRight[nDim - 1] / mainDiag[nDim - 1];
  for (i = nDim - 2; i >= 0; --i) {
    result[i] = (vecRight[i] - supDiag[i]***REMOVED*** result[i + 1]) / mainDiag[i];
  }
  return result;
***REMOVED***
