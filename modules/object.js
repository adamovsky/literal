"use strict";

var commonLibrary = require("./common");

module.exports = function objectTools(init) {

  var originalLiteral = init.literal;
  var originalType = init.type;

  var commonTools = init.commonTools || commonLibrary(originalLiteral);

  var findType = commonTools.findType;
  var buildPath = commonTools.buildPath;
  var getNode = commonTools.getNode;
  var traversePath = commonTools.traversePath;

  function check(paths, value) {

    if (!paths) return true;

    var pathsType = findType(paths);
    var checkValue = arguments.length === 2;

    if (pathsType === "array") {
      var all = 1;
      var any = 0;
      var count = paths.length;
      var counter = 0;
      var exists;
      var node;
      var path;
      var results = {
        nodes: {}
      };
      var nodes = results.nodes;

      for (; counter < count; counter++) {

        path = paths[counter];

        if (!nodes[path]) {
          node = getNode(path);
          exists = !!node;

          exists = nodes[path] = exists && checkValue ? node.path[node.leaf] === value : exists;

          all *= exists;
          any += exists * 1;
        }

      }

      results.all = !!all;
      results.any = !!any;

      return results;
    }

    if (pathsType === "string") {
      node = getNode(paths);
      exists = !!node;
      if (value === undefined)
        return exists;
      return exists && checkValue && node.path[node.leaf] === value;
    }

    return false;
  }

  function fill(paths, value) {

    var exists, node;

    if (!paths) return false;

    var pathsType = findType(paths);

    if (pathsType === "string") {
      node = getNode(paths);
      exists = !!node;

      if (!exists) {
        node.ok = false;
        return node;
      }

      node.path[node.leaf] = value;
    }

    return node;
  }

  function plant(paths, value) {
    var node = fill(paths, value);

    if (!node.ok) {
      node = buildPath(paths);
    }

    node.path[node.leaf] = value;

    return node;
  }

  function swap(from, to) {

    var build, fromValue, toValue;

    if (!from || !to)
      return;

    var fromType = findType(from);
    var toType = findType(to);

    if (fromType === "string") {
      var source = getNode(from);

      if (!source)
        return false;

      if (toType === "string") {
        var destination = getNode(to);

        if (!destination)
          return false;

        fromValue = source.path[source.leaf];
        toValue = destination.path[destination.leaf];
        source.path[source.leaf] = toValue;
        destination.path[destination.leaf] = fromValue;
      }

      return true;
    }

  }

  return {
    check: check,
    fill: fill,
    plant: plant,
    swap: swap
  };
}