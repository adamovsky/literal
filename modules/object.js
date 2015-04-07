"use strict";

var commonTools = require("./common");

var findType = commonTools.findType;

module.exports = function objectTools(originalLiteral, originalLiteralType) {
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

    return undefined;
  }

  function fill(paths, value, overwrite, build) {

    if (!paths) return false;

    build = typeof build === "undefined" ? true : build;

    var pathsType = findType(paths);

    if (pathsType === "string") {

      if (paths.indexOf(".") < 0) {
        if (!originalLiteral.hasOwnProperty(paths) || overwrite)
          originalLiteral[paths] = value;

        return originalLiteral[paths];
      }

      return exists(paths, build, value);
    }

    if (pathsType === "object") {
      console.log("TBD");
    }

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

    if (fromType === "string" && toType === "string") {
      if (!originalLiteral.hasOwnProperty(from))
        return false;

      if (originalLiteral.hasOwnProperty(to)) {
        var toValue = originalLiteral[to];

        originalLiteral[to] = originalLiteral[from];
        originalLiteral[from] = toValue;
      } else
        delete originalLiteral[from];

      return true;
    }

  }

  function a_exists(path, value, overwrite, build) {

    if (path.indexOf(".") < 0) {
      if (originalLiteral.hasOwnProperty(path)) {
        if (overwrite)
          originalLiteral[path] = value;
        else
          return true;
      } else {
        if (build)
          originalLiteral[path] = value;
        else
          return false
      }

      return originalLiteral[path];
    }

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

    return originalLiteral;
  }



  function x_exists(path, build, overwrite, value) {

    if (path.indexOf(".") < 0) {
      if (originalLiteral.hasOwnProperty(path)) {
        if (overwrite)
          originalLiteral[path] = value;
      } else {
        if (build)
          originalLiteral[path] = value;
      }

      return originalLiteral[path];
    }

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

    return originalLiteral;
  }

  return {
    check: check,
    fill: fill,
    swap: swap
  };
}