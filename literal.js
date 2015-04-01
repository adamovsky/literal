"use strict";

var originalLiteral = null;
var originalLiteralType = null;

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
  function check(paths, value) {

    if (!paths) return true;

    var pathsType = findType(paths);

    if (pathsType === "array") {
      var all = 1;
      var any = 0;
      var path;
      var count = paths.length;
      var counter = 0;
      var nodeExists;
      var results = {
        nodes: {}
      };
      var nodes = results.nodes;
      var nodeValue;

      for (; counter < count; counter++) {

        path = paths[counter];

        if (!nodes[path]) {
          nodeValue = nodes[path] = exists(path);

          nodeExists = (typeof value !== "undefined") ? nodeValue === value : !!nodeValue;

          all *= nodeExists;
          any += nodeExists * 1;
        }

      }

      results.all = !!all;
      results.any = !!any;

      return results;
    }

    if (pathsType === "string") {
      if (value === undefined)
        return exists(paths);
      return exists(paths) && originalLiteral[paths] === value;
    }

    return false;
  }

  function fill(paths, value) {

    if (!paths) return false;

    var pathsType = findType(paths);

    if (pathsType === "string") {

      if (paths.indexOf(".") < 0) {
        if (!originalLiteral.hasOwnProperty(paths))
          originalLiteral[path] = value;

        return originalLiteral[paths];
      }

      return exists(paths, true, value);
    }

    if (pathsType === "object") {}

    if (pathsType === "array") {
      var path;
      var count = paths.length;
      var counter = 0;
      var results = {
        nodes: {}
      };
      var nodes = results.nodes;

      for (; counter < count; counter++) {

        path = paths[counter];

        if (!nodes[path]) {
          nodes[path] = exists(path, true, value);
        }

      }

      return results;
    }

  }

  function swap(from, to) {

    if (!from || !to)
      return;

    var fromType = findType(from);
    var toType = findType(to);



  }

  function exists(path, build, value) {

    if (path.indexOf(".") < 0)
      return originalLiteral.hasOwnProperty(path) ? originalLiteral[path] : false;

    var temporaryLiteral = originalLiteral;
    var nodes = path.split(".");
    var count = nodes.length;
    var counter = 0;
    var node;

    for (; counter < count; counter++) {
      node = nodes[counter];

      if (!temporaryLiteral.hasOwnProperty(node))
        if (build)
          temporaryLiteral[node] = counter === count - 1 ? value : {};
        else
          return false;

      temporaryLiteral = temporaryLiteral[node];
    }

    return temporaryLiteral;
  }

  return {
    check: check,
    fill: fill,
    swap: swap
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

  var literalInterface = toolbox[literalType]();

  literalInterface.type = literalType;

  return literalInterface;
};