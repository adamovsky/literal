"use strict";

module.exports = function(originalLiteral) {

  function buildPath(path) {
    var temporaryLiteral = originalLiteral;
    var nodes = path.split(".");
    var count = nodes.length;
    var counter = 0;
    var node;
    var ok = true;
    var path;

    for (; counter < count; counter++) {
      node = nodes[counter];
      path = temporaryLiteral;

      if (!temporaryLiteral.hasOwnProperty(node))
        temporaryLiteral[node] = {};
      else if (counter < count - 1 && findType(temporaryLiteral[node]) !== "object") {
        ok = false;
        break;
      }

      temporaryLiteral = temporaryLiteral[node];
    }

    return {
      ok: ok,
      path: path,
      leaf: node
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
      leaf: null
    };

    if (path.indexOf("[") > -1) {
      path = path.replace(/\[([^\]]*)\]/g, ".$1");
    }

    if (path.indexOf(".") < 0) {
      if (!originalLiteral.hasOwnProperty(path))
        return false;

      node = {
        path: originalLiteral,
        leaf: path
      };
    } else {
      node = traversePath(path);

      if (!node.ok)
        return false;
    }

    return node;
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
      leaf: node
    };
  }

  return {

    buildPath: buildPath,
    findType: findType,
    getNode: getNode,
    traversePath: traversePath

  }
};