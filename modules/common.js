"use strict";

module.exports = function(originalLiteral) {

  function buildPath(path) {
    var temporaryLiteral = originalLiteral;
    var nodes = path.split(".");
    var count = nodes.length;
    var counter = 0;
    var node;
    var ok = true;
    var type = "object";

    for (; counter < count; counter++) {
      node = nodes[counter];
      path = temporaryLiteral;

      if (!temporaryLiteral.hasOwnProperty(node))
        temporaryLiteral[node] = {};
      else if (counter < count - 1 && (type = findType(temporaryLiteral[node])) !== "object") {
        ok = false;
        break;
      }

      temporaryLiteral = temporaryLiteral[node];
    }

    return {
      ok: ok,
      path: path,
      leaf: node,
      type: type,
      value: temporaryLiteral
    };
  }

  function findType(literal) {
    var literalType = typeof literal;

    if (literalType === "object") {
      if (literal === null) {
        literalType = "null";
      } else if (typeof literal.push === "function") {
        literalType = "array";
      }
    }

    return literalType;
  }

  function getNode(path) {
    var type = findType(path);

    var node = {
      path: null,
      leaf: null,
      type: null,
      value: null
    };

    if (path.indexOf("[") > -1) {
      path = path.replace(/\[([^\]]*)\]/g, ".$1");
    }

    if (path.indexOf(".") < 0) {
      if (!originalLiteral.hasOwnProperty(path))
        return false;

      node = {
        path: originalLiteral,
        leaf: path,
        type: findType(originalLiteral[path]),
        value: originalLiteral[path]
      };
    } else {
      node = traversePath(path);

      if (!node.ok)
        return false;
    }

    return node;
  }

  function snipPath(path) {
    var end;
    var leaf;
    var matches;
    var nodes = path.split(".");
    var nodeCount = nodes.length;
    var ok;
    var temporaryLiteral = originalLiteral;
    var tree;

    if (nodeCount > 1) {
      leaf = nodes.pop();
      if (leaf.indexOf("[") > -1) {
        matches = leaf.match(/\[([^\]]*)\]$/);
        if (matches) {
          leaf = matches[0];
          end = nodes.join(".").length + 1 + matches.index;
        }
      } else {
        end = path.lastIndexOf(".");
      }
      tree = path.substr(0, end);
      ok = true;
    } else {
      if (path.indexOf("[") > -1) {
        ok = false;
        matches = path.match(/\[([^\]]*)\]$/);
        if (matches) {
          leaf = matches[1];
          end = matches.index;
          ok = true;
          tree = path.substr(0, end);
        }
      } else {
        ok = false;
        tree = path;
      }
    }

    return {
      ok: ok,
      tree: tree,
      leaf: leaf
    };

  }

  function traversePath(path) {
    var temporaryLiteral = originalLiteral;
    var nodes = path.split(".");
    var count = nodes.length;
    var counter = 0;
    var node;
    var ok = true;
    var type;

    for (; counter < count; counter++) {
      node = nodes[counter];
      path = temporaryLiteral;

      if (isNaN(Number(node)) === false) {
        if (temporaryLiteral.length <= node) {
          ok = false;
          break;
        } else {
          type = findType(temporaryLiteral);

          if (type !== "array") {
            ok = false;
            break;
          }
        }
      } else if (temporaryLiteral.hasOwnProperty(node)) {
        type = findType(temporaryLiteral[node]);
        if (counter < count - 1 && type !== "object" && type !== "array") {
          ok = false;
          break;
        }
      } else {
        ok = false;
        break;
      }

      temporaryLiteral = temporaryLiteral[node];
    }

    return {
      ok: ok,
      path: path,
      leaf: node,
      type: type,
      value: temporaryLiteral
    };
  }

  return {
    buildPath: buildPath,
    findType: findType,
    getNode: getNode,
    snipPath: snipPath,
    traversePath: traversePath
  };
};