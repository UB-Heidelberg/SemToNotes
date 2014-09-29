// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Datastructure: AvlTree.
***REMOVED***
***REMOVED***
***REMOVED*** This file provides the implementation of an AVL-Tree datastructure. The tree
***REMOVED*** maintains a set of unique values in a sorted order. The values can be
***REMOVED*** accessed efficiently in their sorted order since the tree enforces an O(logn)
***REMOVED*** maximum height. See http://en.wikipedia.org/wiki/Avl_tree for more detail.
***REMOVED***
***REMOVED*** The big-O notation for all operations are below:
***REMOVED*** <pre>
***REMOVED***   Method                 big-O
***REMOVED*** ----------------------------------------------------------------------------
***REMOVED*** - add                    O(logn)
***REMOVED*** - remove                 O(logn)
***REMOVED*** - clear                  O(1)
***REMOVED*** - contains               O(logn)
***REMOVED*** - getCount               O(1)
***REMOVED*** - getMinimum             O(1), or O(logn) when optional root is specified
***REMOVED*** - getMaximum             O(1), or O(logn) when optional root is specified
***REMOVED*** - getHeight              O(1)
***REMOVED*** - getValues              O(n)
***REMOVED*** - inOrderTraverse        O(logn + k), where k is number of traversed nodes
***REMOVED*** - reverseOrderTraverse   O(logn + k), where k is number of traversed nodes
***REMOVED*** </pre>
***REMOVED***


goog.provide('goog.structs.AvlTree');
goog.provide('goog.structs.AvlTree.Node');

goog.require('goog.structs');
goog.require('goog.structs.Collection');



***REMOVED***
***REMOVED*** Constructs an AVL-Tree, which uses the specified comparator to order its
***REMOVED*** values. The values can be accessed efficiently in their sorted order since
***REMOVED*** the tree enforces a O(logn) maximum height.
***REMOVED***
***REMOVED*** @param {Function=} opt_comparator Function used to order the tree's nodes.
***REMOVED***
***REMOVED*** @implements {goog.structs.Collection}
***REMOVED***
goog.structs.AvlTree = function(opt_comparator) {
  this.comparator_ = opt_comparator ||
                     goog.structs.AvlTree.DEFAULT_COMPARATOR_;
***REMOVED***


***REMOVED***
***REMOVED*** String comparison function used to compare values in the tree. This function
***REMOVED*** is used by default if no comparator is specified in the tree's constructor.
***REMOVED***
***REMOVED*** @param {string} a The first string.
***REMOVED*** @param {string} b The second string.
***REMOVED*** @return {number} -1 if a < b, 1 if a > b, 0 if a = b.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.DEFAULT_COMPARATOR_ = function(a, b) {
  if (String(a) < String(b)) {
    return -1;
  } else if (String(a) > String(b)) {
    return 1;
  }
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Pointer to the root node of the tree.
***REMOVED***
***REMOVED*** @type {goog.structs.AvlTree.Node}
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.root_ = null;


***REMOVED***
***REMOVED*** Comparison function used to compare values in the tree. This function should
***REMOVED*** take two values, a and b, and return x where:
***REMOVED*** <pre>
***REMOVED***  x < 0 if a < b,
***REMOVED***  x > 0 if a > b,
***REMOVED***  x = 0 otherwise
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.comparator_ = null;


***REMOVED***
***REMOVED*** Pointer to the node with the smallest value in the tree.
***REMOVED***
***REMOVED*** @type {goog.structs.AvlTree.Node}
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.minNode_ = null;


***REMOVED***
***REMOVED*** Pointer to the node with the largest value in the tree.
***REMOVED***
***REMOVED*** @type {goog.structs.AvlTree.Node}
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.maxNode_ = null;


***REMOVED***
***REMOVED*** Inserts a node into the tree with the specified value if the tree does
***REMOVED*** not already contain a node with the specified value. If the value is
***REMOVED*** inserted, the tree is balanced to enforce the AVL-Tree height property.
***REMOVED***
***REMOVED*** @param {*} value Value to insert into the tree.
***REMOVED*** @return {boolean} Whether value was inserted into the tree.
***REMOVED*** @override
***REMOVED***
goog.structs.AvlTree.prototype.add = function(value) {
  // If the tree is empty, create a root node with the specified value
  if (this.root_ == null) {
    this.root_ = new goog.structs.AvlTree.Node(value);
    this.minNode_ = this.root_;
    this.maxNode_ = this.root_;
    return true;
  }

  // This will be set to the new node if a new node is added.
  var newNode = null;

  // Depth traverse the tree and insert the value if we reach a null node
  this.traverse_(function(node) {
    var retNode = null;
    if (this.comparator_(node.value, value) > 0) {
      retNode = node.left;
      if (node.left == null) {
        newNode = new goog.structs.AvlTree.Node(value, node);
        node.left = newNode;
        if (node == this.minNode_) {
          this.minNode_ = newNode;
        }
      }
    } else if (this.comparator_(node.value, value) < 0) {
      retNode = node.right;
      if (node.right == null) {
        newNode = new goog.structs.AvlTree.Node(value, node);
        node.right = newNode;
        if (node == this.maxNode_) {
          this.maxNode_ = newNode;
        }
      }
    }
    return retNode; // If null, we'll stop traversing the tree
  });

  // If a node was added, increment counts and balance tree.
  if (newNode) {
    this.traverse_(
        function(node) {
          node.count++;
          return node.parent;
        },
        newNode.parent);
    this.balance_(newNode.parent); // Maintain the AVL-tree balance
  }

  // Return true if a node was added, false otherwise
  return !!newNode;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a node from the tree with the specified value if the tree contains a
***REMOVED*** node with this value. If a node is removed the tree is balanced to enforce
***REMOVED*** the AVL-Tree height property. The value of the removed node is returned.
***REMOVED***
***REMOVED*** @param {*} value Value to find and remove from the tree.
***REMOVED*** @return {*} The value of the removed node or null if the value was not in
***REMOVED***     the tree.
***REMOVED*** @override
***REMOVED***
goog.structs.AvlTree.prototype.remove = function(value) {
  // Assume the value is not removed and set the value when it is removed
  var retValue = null;

  // Depth traverse the tree and remove the value if we find it
  this.traverse_(function(node) {
    var retNode = null;
    if (this.comparator_(node.value, value) > 0) {
      retNode = node.left;
    } else if (this.comparator_(node.value, value) < 0) {
      retNode = node.right;
    } else {
      retValue = node.value;
      this.removeNode_(node);
    }
    return retNode; // If null, we'll stop traversing the tree
  });

  // Return the value that was removed, null if the value was not in the tree
  return retValue;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all nodes from the tree.
***REMOVED***
goog.structs.AvlTree.prototype.clear = function() {
  this.root_ = null;
  this.minNode_ = null;
  this.maxNode_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the tree contains a node with the specified value, false
***REMOVED*** otherwise.
***REMOVED***
***REMOVED*** @param {*} value Value to find in the tree.
***REMOVED*** @return {boolean} Whether the tree contains a node with the specified value.
***REMOVED*** @override
***REMOVED***
goog.structs.AvlTree.prototype.contains = function(value) {
  // Assume the value is not in the tree and set this value if it is found
  var isContained = false;

  // Depth traverse the tree and set isContained if we find the node
  this.traverse_(function(node) {
    var retNode = null;
    if (this.comparator_(node.value, value) > 0) {
      retNode = node.left;
    } else if (this.comparator_(node.value, value) < 0) {
      retNode = node.right;
    } else {
      isContained = true;
    }
    return retNode; // If null, we'll stop traversing the tree
  });

  // Return true if the value is contained in the tree, false otherwise
  return isContained;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of values stored in the tree.
***REMOVED***
***REMOVED*** @return {number} The number of values stored in the tree.
***REMOVED*** @override
***REMOVED***
goog.structs.AvlTree.prototype.getCount = function() {
  return this.root_ ? this.root_.count : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a k-th smallest value, based on the comparator, where 0 <= k <
***REMOVED*** this.getCount().
***REMOVED*** @param {number} k The number k.
***REMOVED*** @return {*} The k-th smallest value.
***REMOVED***
goog.structs.AvlTree.prototype.getKthValue = function(k) {
  if (k < 0 || k >= this.getCount()) {
    return null;
  }
  return this.getKthNode_(k).value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value u, such that u is contained in the tree and u < v, for all
***REMOVED*** values v in the tree where v != u.
***REMOVED***
***REMOVED*** @return {*} The minimum value contained in the tree.
***REMOVED***
goog.structs.AvlTree.prototype.getMinimum = function() {
  return this.getMinNode_().value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value u, such that u is contained in the tree and u > v, for all
***REMOVED*** values v in the tree where v != u.
***REMOVED***
***REMOVED*** @return {*} The maximum value contained in the tree.
***REMOVED***
goog.structs.AvlTree.prototype.getMaximum = function() {
  return this.getMaxNode_().value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the height of the tree (the maximum depth). This height should
***REMOVED*** always be <= 1.4405*(Math.log(n+2)/Math.log(2))-1.3277, where n is the
***REMOVED*** number of nodes in the tree.
***REMOVED***
***REMOVED*** @return {number} The height of the tree.
***REMOVED***
goog.structs.AvlTree.prototype.getHeight = function() {
  return this.root_ ? this.root_.height : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts the values stored in the tree into a new Array and returns the Array.
***REMOVED***
***REMOVED*** @return {Array} An array containing all of the trees values in sorted order.
***REMOVED***
goog.structs.AvlTree.prototype.getValues = function() {
  var ret = [];
  this.inOrderTraverse(function(value) {
    ret.push(value);
  });
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Performs an in-order traversal of the tree and calls {@code func} with each
***REMOVED*** traversed node, optionally starting from the smallest node with a value >= to
***REMOVED*** the specified start value. The traversal ends after traversing the tree's
***REMOVED*** maximum node or when {@code func} returns a value that evaluates to true.
***REMOVED***
***REMOVED*** @param {Function} func Function to call on each traversed node.
***REMOVED*** @param {Object=} opt_startValue If specified, traversal will begin on the
***REMOVED***    node with the smallest value >= opt_startValue.
***REMOVED***
goog.structs.AvlTree.prototype.inOrderTraverse =
    function(func, opt_startValue) {
  // If our tree is empty, return immediately
  if (!this.root_) {
    return;
  }

  // Depth traverse the tree to find node to begin in-order traversal from
  var startNode;
  if (opt_startValue) {
    this.traverse_(function(node) {
      var retNode = null;
      if (this.comparator_(node.value, opt_startValue) > 0) {
        retNode = node.left;
        startNode = node;
      } else if (this.comparator_(node.value, opt_startValue) < 0) {
        retNode = node.right;
      } else {
        startNode = node;
      }
      return retNode; // If null, we'll stop traversing the tree
    });
  } else {
    startNode = this.getMinNode_();
  }

  // Traverse the tree and call func on each traversed node's value
  var node = startNode, prev = startNode.left ? startNode.left : startNode;
  while (node != null) {
    if (node.left != null && node.left != prev && node.right != prev) {
      node = node.left;
    } else {
      if (node.right != prev) {
        if (func(node.value)) {
          return;
        }
      }
      var temp = node;
      node = node.right != null && node.right != prev ?
             node.right :
             node.parent;
      prev = temp;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs a reverse-order traversal of the tree and calls {@code func} with
***REMOVED*** each traversed node, optionally starting from the largest node with a value
***REMOVED*** <= to the specified start value. The traversal ends after traversing the
***REMOVED*** tree's minimum node or when func returns a value that evaluates to true.
***REMOVED***
***REMOVED*** @param {Function} func Function to call on each traversed node.
***REMOVED*** @param {Object=} opt_startValue If specified, traversal will begin on the
***REMOVED***    node with the largest value <= opt_startValue.
***REMOVED***
goog.structs.AvlTree.prototype.reverseOrderTraverse =
    function(func, opt_startValue) {
  // If our tree is empty, return immediately
  if (!this.root_) {
    return;
  }

  // Depth traverse the tree to find node to begin reverse-order traversal from
  var startNode;
  if (opt_startValue) {
    this.traverse_(goog.bind(function(node) {
      var retNode = null;
      if (this.comparator_(node.value, opt_startValue) > 0) {
        retNode = node.left;
      } else if (this.comparator_(node.value, opt_startValue) < 0) {
        retNode = node.right;
        startNode = node;
      } else {
        startNode = node;
      }
      return retNode; // If null, we'll stop traversing the tree
    }, this));
  } else {
    startNode = this.getMaxNode_();
  }

  // Traverse the tree and call func on each traversed node's value
  var node = startNode, prev = startNode.right ? startNode.right : startNode;
  while (node != null) {
    if (node.right != null && node.right != prev && node.left != prev) {
      node = node.right;
    } else {
      if (node.left != prev) {
        if (func(node.value)) {
          return;
        }
      }
      var temp = node;
      node = node.left != null && node.left != prev ?
             node.left :
             node.parent;
      prev = temp;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs a traversal defined by the supplied {@code traversalFunc}. The first
***REMOVED*** call to {@code traversalFunc} is passed the root or the optionally specified
***REMOVED*** startNode. After that, calls {@code traversalFunc} with the node returned
***REMOVED*** by the previous call to {@code traversalFunc} until {@code traversalFunc}
***REMOVED*** returns null or the optionally specified endNode. The first call to
***REMOVED*** traversalFunc is passed the root or the optionally specified startNode.
***REMOVED***
***REMOVED*** @param {Function} traversalFunc Function used to traverse the tree. Takes a
***REMOVED***     node as a parameter and returns a node.
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_startNode The node at which the
***REMOVED***     traversal begins.
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_endNode The node at which the
***REMOVED***     traversal ends.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.traverse_ =
    function(traversalFunc, opt_startNode, opt_endNode) {
  var node = opt_startNode ? opt_startNode : this.root_;
  var endNode = opt_endNode ? opt_endNode : null;
  while (node && node != endNode) {
    node = traversalFunc.call(this, node);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that the specified node and all its ancestors are balanced. If they
***REMOVED*** are not, performs left and right tree rotations to achieve a balanced
***REMOVED*** tree. This method assumes that at most 2 rotations are necessary to balance
***REMOVED*** the tree (which is true for AVL-trees that are balanced after each node is
***REMOVED*** added or removed).
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node} node Node to begin balance from.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.balance_ = function(node) {

  this.traverse_(function(node) {
    // Calculate the left and right node's heights
    var lh = node.left ? node.left.height : 0;
    var rh = node.right ? node.right.height : 0;

    // Rotate tree rooted at this node if it is not AVL-tree balanced
    if (lh - rh > 1) {
      if (node.left.right && (!node.left.left ||
          node.left.left.height < node.left.right.height)) {
        this.leftRotate_(node.left);
      }
      this.rightRotate_(node);
    } else if (rh - lh > 1) {
      if (node.right.left && (!node.right.right ||
          node.right.right.height < node.right.left.height)) {
        this.rightRotate_(node.right);
      }
      this.leftRotate_(node);
    }

    // Recalculate the left and right node's heights
    lh = node.left ? node.left.height : 0;
    rh = node.right ? node.right.height : 0;

    // Set this node's height
    node.height = Math.max(lh, rh) + 1;

    // Traverse up tree and balance parent
    return node.parent;
  }, node);

***REMOVED***


***REMOVED***
***REMOVED*** Performs a left tree rotation on the specified node.
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node} node Pivot node to rotate from.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.leftRotate_ = function(node) {
  // Re-assign parent-child references for the parent of the node being removed
  if (node.isLeftChild()) {
    node.parent.left = node.right;
    node.right.parent = node.parent;
  } else if (node.isRightChild()) {
    node.parent.right = node.right;
    node.right.parent = node.parent;
  } else {
    this.root_ = node.right;
    this.root_.parent = null;
  }

  // Re-assign parent-child references for the child of the node being removed
  var temp = node.right;
  node.right = node.right.left;
  if (node.right != null) node.right.parent = node;
  temp.left = node;
  node.parent = temp;

  // Update counts.
  temp.count = node.count;
  node.count -= (temp.right ? temp.right.count : 0) + 1;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a right tree rotation on the specified node.
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node} node Pivot node to rotate from.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.rightRotate_ = function(node) {
  // Re-assign parent-child references for the parent of the node being removed
  if (node.isLeftChild()) {
    node.parent.left = node.left;
    node.left.parent = node.parent;
  } else if (node.isRightChild()) {
    node.parent.right = node.left;
    node.left.parent = node.parent;
  } else {
    this.root_ = node.left;
    this.root_.parent = null;
  }

  // Re-assign parent-child references for the child of the node being removed
  var temp = node.left;
  node.left = node.left.right;
  if (node.left != null) node.left.parent = node;
  temp.right = node;
  node.parent = temp;

  // Update counts.
  temp.count = node.count;
  node.count -= (temp.left ? temp.left.count : 0) + 1;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the specified node from the tree and ensures the tree still
***REMOVED*** maintains the AVL-tree balance.
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node} node The node to be removed.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.removeNode_ = function(node) {
  // Perform normal binary tree node removal, but balance the tree, starting
  // from where we removed the node
  if (node.left != null || node.right != null) {
    var b = null; // Node to begin balance from
    var r;        // Node to replace the node being removed
    if (node.left != null) {
      r = this.getMaxNode_(node.left);

      // Update counts.
      this.traverse_(function(node) {
        node.count--;
        return node.parent;
      }, r);

      if (r != node.left) {
        r.parent.right = r.left;
        if (r.left) r.left.parent = r.parent;
        r.left = node.left;
        r.left.parent = r;
        b = r.parent;
      }
      r.parent = node.parent;
      r.right = node.right;
      if (r.right) r.right.parent = r;
      if (node == this.maxNode_) this.maxNode_ = r;
      r.count = node.count;
    } else {
      r = this.getMinNode_(node.right);

      // Update counts.
      this.traverse_(function(node) {
        node.count--;
        return node.parent;
      }, r);

      if (r != node.right) {
        r.parent.left = r.right;
        if (r.right) r.right.parent = r.parent;
        r.right = node.right;
        r.right.parent = r;
        b = r.parent;
      }
      r.parent = node.parent;
      r.left = node.left;
      if (r.left) r.left.parent = r;
      if (node == this.minNode_) this.minNode_ = r;
      r.count = node.count;
    }

    // Update the parent of the node being removed to point to its replace
    if (node.isLeftChild()) {
      node.parent.left = r;
    } else if (node.isRightChild()) {
      node.parent.right = r;
    } else {
      this.root_ = r;
    }

    // Balance the tree
    this.balance_(b ? b : r);
  } else {
    // Update counts.
    this.traverse_(function(node) {
      node.count--;
      return node.parent;
    }, node.parent);

    // If the node is a leaf, remove it and balance starting from its parent
    if (node.isLeftChild()) {
      this.special = 1;
      node.parent.left = null;
      if (node == this.minNode_) this.minNode_ = node.parent;
      this.balance_(node.parent);
    } else if (node.isRightChild()) {
      node.parent.right = null;
      if (node == this.maxNode_) this.maxNode_ = node.parent;
      this.balance_(node.parent);
    } else {
      this.clear();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node in the tree that has k nodes before it in an in-order
***REMOVED*** traversal, optionally rooted at {@code opt_rootNode}.
***REMOVED***
***REMOVED*** @param {number} k The number of nodes before the node to be returned in an
***REMOVED***     in-order traversal, where 0 <= k < root.count.
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_rootNode Optional root node.
***REMOVED*** @return {goog.structs.AvlTree.Node} The node at the specified index.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.getKthNode_ = function(k, opt_rootNode) {
  var root = opt_rootNode || this.root_;
  var numNodesInLeftSubtree = root.left ? root.left.count : 0;

  if (k < numNodesInLeftSubtree) {
    return this.getKthNode_(k, root.left);
  } else if (k == numNodesInLeftSubtree) {
    return root;
  } else {
    return this.getKthNode_(k - numNodesInLeftSubtree - 1, root.right);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node with the smallest value in tree, optionally rooted at
***REMOVED*** {@code opt_rootNode}.
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_rootNode Optional root node.
***REMOVED*** @return {goog.structs.AvlTree.Node} The node with the smallest value in
***REMOVED***     the tree.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.getMinNode_ = function(opt_rootNode) {
  if (!opt_rootNode) {
    return this.minNode_;
  }

  var minNode = opt_rootNode;
  this.traverse_(function(node) {
    var retNode = null;
    if (node.left) {
      minNode = node.left;
      retNode = node.left;
    }
    return retNode; // If null, we'll stop traversing the tree
  }, opt_rootNode);

  return minNode;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node with the largest value in tree, optionally rooted at
***REMOVED*** opt_rootNode.
***REMOVED***
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_rootNode Optional root node.
***REMOVED*** @return {goog.structs.AvlTree.Node} The node with the largest value in
***REMOVED***     the tree.
***REMOVED*** @private
***REMOVED***
goog.structs.AvlTree.prototype.getMaxNode_ = function(opt_rootNode) {
  if (!opt_rootNode) {
    return this.maxNode_;
  }

  var maxNode = opt_rootNode;
  this.traverse_(function(node) {
    var retNode = null;
    if (node.right) {
      maxNode = node.right;
      retNode = node.right;
    }
    return retNode; // If null, we'll stop traversing the tree
  }, opt_rootNode);

  return maxNode;
***REMOVED***



***REMOVED***
***REMOVED*** Constructs an AVL-Tree node with the specified value. If no parent is
***REMOVED*** specified, the node's parent is assumed to be null. The node's height
***REMOVED*** defaults to 1 and its children default to null.
***REMOVED***
***REMOVED*** @param {*} value Value to store in the node.
***REMOVED*** @param {goog.structs.AvlTree.Node=} opt_parent Optional parent node.
***REMOVED***
***REMOVED***
goog.structs.AvlTree.Node = function(value, opt_parent) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The value stored by the node.
  ***REMOVED***
  ***REMOVED*** @type {*}
 ***REMOVED*****REMOVED***
  this.value = value;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The node's parent. Null if the node is the root.
  ***REMOVED***
  ***REMOVED*** @type {goog.structs.AvlTree.Node}
 ***REMOVED*****REMOVED***
  this.parent = opt_parent ? opt_parent : null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of nodes in the subtree rooted at this node.
  ***REMOVED***
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.count = 1;
***REMOVED***


***REMOVED***
***REMOVED*** The node's left child. Null if the node does not have a left child.
***REMOVED***
***REMOVED*** @type {goog.structs.AvlTree.Node?}
***REMOVED***
goog.structs.AvlTree.Node.prototype.left = null;


***REMOVED***
***REMOVED*** The node's right child. Null if the node does not have a right child.
***REMOVED***
***REMOVED*** @type {goog.structs.AvlTree.Node?}
***REMOVED***
goog.structs.AvlTree.Node.prototype.right = null;


***REMOVED***
***REMOVED*** The height of the tree rooted at this node.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.structs.AvlTree.Node.prototype.height = 1;


***REMOVED***
***REMOVED*** Returns true iff the specified node has a parent and is the right child of
***REMOVED*** its parent.
***REMOVED***
***REMOVED*** @return {boolean} Whether the specified node has a parent and is the right
***REMOVED***    child of its parent.
***REMOVED***
goog.structs.AvlTree.Node.prototype.isRightChild = function() {
  return !!this.parent && this.parent.right == this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true iff the specified node has a parent and is the left child of
***REMOVED*** its parent.
***REMOVED***
***REMOVED*** @return {boolean} Whether the specified node has a parent and is the left
***REMOVED***    child of its parent.
***REMOVED***
goog.structs.AvlTree.Node.prototype.isLeftChild = function() {
  return !!this.parent && this.parent.left == this;
***REMOVED***
