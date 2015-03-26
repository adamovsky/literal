"use strict";

var originalLiteral;
var originalLiteralType;

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

function objectTools() {
  function check(paths) {

    if (!paths) return true;

    var pathsType = findType(paths);

    if (pathsType === "array") {
      var all = 1;
      var any = 0;
      var path;
      var count = paths.length;
      var counter = 0;
      var results = {};

      for (; counter < count; counter++) {

        path = paths[counter];

        if (!results[path]) {
          results[path] = loopUntilDoesntExist(path);
          all *= results[path];
          any += results[path] * 1;
        }

      }

      results.all = !!all;
      results.any = !!any;

      return results;
    } else if (pathType === "string") {
      return loopUntilDoesntExist(path);
    }

  }

  function loopUntilDoesntExist(path) {

    if (path.indexOf(".") < 0)
      return originalLiteral.hasOwnProperty(path);

    var item;
    var nodes = path.split(".");
    var count = nodes.length;
    var counter = 0;

    for (; counter < count; counter++) {
      if (!originalLiteral.hasOwnProperty(nodes[item]))
        return false;
    }

    return true;
  }

  return {
    check: check
  };
}

function stringTools() {
  return {
    check: function(text) {
      if (!text) return true;

      return this.same(text);
    },
    same: function(text) {
      return originalLiteral === text;
    }
  };
}

function undefinedTools() {
  return {
    check: function() {
      return false;
    }
  };
}

var toolbox = {
  "object": objectTools,
  "string": stringTools,
  "undefined": undefinedTools
};

module.exports = function(literal) {
  var literalType = originalLiteralType;

  if (literal !== originalLiteral) {
    literalType = findType(literal);

    originalLiteral = literal;
    originalLiteralType = literalType;
  }

  return toolbox[literalType]();

};