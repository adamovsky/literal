"use strict";

var commonLibrary = require("./common");

module.exports = function objectTools(init) {

  var originalLiteral = init.literal;
  var originalType = init.type;

  var commonTools = init.commonTools || commonLibrary(originalLiteral);

  var findType = commonTools.findType;
  var buildPath = commonTools.buildPath;
  var getNode = commonTools.getNode;
  var snipPath = commonTools.snipPath;
  var traversePath = commonTools.traversePath;

  function check(paths, value) {

    var exists,
      node;

    if (!paths) return true;

    var pathsType = findType(paths);
    var checkValue = arguments.length === 2;

    if (pathsType === "array") {
      var all = 1;
      var any = 0;
      var count = paths.length;
      var counter = 0;
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

  function extract(paths, value) {

    var count,
      counter,
      filledNodes,
      nodes,
      path,
      pathsType = findType(paths),
      values;

    if (pathsType === "string") {
      paths = [paths];
    }

    if (arguments.length < 2) {
      return get(paths).nodes;
    }

    filledNodes = fill(paths, value);

    nodes = {};

    for (counter = 0, count = paths.length; counter < count; counter++) {
      path = paths[counter];
      nodes[path] = filledNodes.nodes[path].value;
    }

    return nodes;
  }

  function fill(paths, value) {

    var all = 1,
      any = 0,
      buildPaths,
      counter,
      count,
      exists,
      filled,
      fillValue,
      item,
      node,
      nodes,
      nodeValue,
      path,
      pathCount,
      pathCounter,
      valueCount;

    if (!paths || arguments.length < 2) return false;

    var pathsType = findType(paths);
    var fillType = findType(value);
    var originalType = pathsType;

    if (fillType === "array")
      valueCount = value.length;

    if (pathsType === "string") {
      paths = [paths];
      pathsType = "array";
    }

    if (pathsType === "array") {
      buildPaths = [];
      nodes = {};

      for (pathCounter = 0, pathCount = paths.length; pathCounter < pathCount; pathCounter++) {
        node = {};
        path = paths[pathCounter];
        node = getNode(path);
        exists = !!node;
        filled = false;
        if (!exists) {
          node = buildPath(path);
          node.path[node.leaf] = value;
          filled = true;
        } else {
          if (node.type === "array") {
            nodeValue = node.value;
            count = nodeValue.length;
            for (counter = 0; counter < count; counter++) {
              fillValue = value;
              item = nodeValue[counter];
              if (!item && item !== 0 && item !== false) {
                if (fillType === "array") {
                  if (counter < valueCount) {
                    fillValue = value[counter];
                  } else {
                    fillValue = item;
                  }
                }
                nodeValue[counter] = fillValue;
                filled = true;
              }
            }
          }

          item = node.path[node.leaf];

          if (!item && item !== 0 && item !== false) {
            node.path[node.leaf] = value;
            filled = true;
          }
        }

        node.ok = filled;
        node.value = node.path[node.leaf];
        nodes[path] = node;

        all *= filled;
        any += filled * 1;
      }
    }

    if (originalType === "string") {
      return filled;
    }

    return {
      nodes: nodes,
      all: !!all,
      any: !!any
    };
  }

  function get(paths) {

    var exists,
      node;

    if (arguments.length < 1) {
      return originalLiteral;
    }

    var pathsType = findType(paths);

    if (pathsType === "string") {
      node = getNode(paths);
      exists = !!node;

      if (!exists) {
        return undefined;
      }

      return node.path[node.leaf];
    } else if (pathsType === "array") {
      var all = 1,
        any = 0,
        count = paths.length,
        counter,
        nodes = {},
        path;

      for (counter = 0; counter < count; counter++) {

        path = paths[counter];

        if (!nodes[path]) {
          node = getNode(path);
          exists = !!node;

          nodes[path] = exists && typeof node.type !== "undefined" ? node.path[node.leaf] : undefined;

          all *= exists;
          any += exists * 1;
        }

      }

      return {
        nodes: nodes,
        all: !!all,
        any: !!any
      };
    }

  }

  function plant(paths, value) {

    var all = 1,
      any = 0,
      count,
      counter,
      node,
      nodes = {},
      path,
      setResult;

    if (arguments.length < 2) {
      return false;
    }

    var output = true;
    var pathsType = findType(paths);

    if (pathsType === "string") {
      paths = [paths];
    }

    for (counter = 0, count = paths.length; counter < count; counter++) {
      path = paths[counter];

      setResult = set(path, value);

      if (setResult === false) {
        node = buildPath(path);

        node.path[node.leaf] = value;

        setResult = node.path[node.leaf] === value;
      }

      nodes[path] = setResult ? value : undefined;

      all *= setResult;
      any += setResult * 1;
    }

    if (pathsType === "array") {
      return {
        all: !!all,
        any: !!any,
        nodes: nodes
      };
    }

    return output;
  }

  function purge(paths) {

    var all,
      any,
      arrayCounter = 0,
      arrays = [],
      cache = {},
      cachedPath,
      count,
      counter,
      deadTree,
      exists,
      index,
      isIndex,
      key,
      keyCounter,
      node,
      nodePath,
      nodes,
      nodeType,
      path,
      pathsType,
      remember,
      removed,
      snipped,
      tree;

    if (arguments.length < 1) {
      return false;
    }

    pathsType = findType(paths);

    nodes = {};
    all = 1;
    any = 0;

    if (pathsType === "string") {
      paths = [paths];
      pathsType = "array";
    }

    if (pathsType === "array") {
      for (counter = 0; counter < paths.length; counter++) {
        path = paths[counter];
        node = getNode(path);
        removed = false;
        exists = !!node;

        if (exists) {
          nodeType = node.type;
          nodePath = node.path;
          isIndex = node.leaf.indexOf("[") > -1 || !isNaN(node.leaf);
          if (!isIndex || nodeType === "object") {
            delete nodePath[node.leaf];
            removed = !nodePath.hasOwnProperty(node.leaf);
            if (Object.keys(nodePath).length === 0) {
              tree = snipPath(path).tree;
              if (tree.indexOf(".") < 0 && tree.indexOf("[") < 0) {
                delete originalLiteral[tree];
                removed = !originalLiteral.hasOwnProperty(tree);
                nodes[tree] = removed;
              }

              paths.push(tree);
            }
          } else if (isIndex && nodeType === "array") {
            index = parseInt(node.leaf, 10);
            nodePath[index] = undefined;
            tree = snipPath(path).tree;
            cachedPath = cache[tree] || [
              []
            ];
            cachedPath[0].push(index);
            cachedPath[1] = node.path;
            if (cachedPath[0].length === cachedPath[1].length) {
              deadTree = getNode(tree);
              // TODO: not sure if we need to check type of path
              // if (findType(deadTree.path) === "object") {
              delete deadTree.path[deadTree.leaf];
              // }
              //cache[tree] = null;
              removed = !deadTree.path.hasOwnProperty(deadTree.leaf);
              nodes[tree] = removed;

              snipped = snipPath(tree);
              if (snipped.tree && snipped.leaf) {
                paths.push(snipPath(tree).tree);
              }
            } else if (cache[tree] !== null) {
              cache[tree] = cachedPath;
            }
            removed = true;
          }
        }

        if (!nodes[path]) {
          nodes[path] = removed;
        }

        all *= removed;
        any += removed * 1;
      }
    }

    for (key in cache) {
      if (cache.hasOwnProperty(key)) {
        arrays.push(cache[key]);
      }
    }

    compact(arrays);

    return {
      all: !!all,
      any: !!any,
      nodes: nodes
    };
  }

  function compact(arrays) {
    var array,
      counter,
      count,
      index,
      innerCounter;

    for (counter = 0, count = arrays.length; counter < count; counter++) {
      array = arrays[counter];
      innerCounter = array[0].length;
      while (innerCounter--) {
        index = array[0][innerCounter];
        if (array[1][index] === undefined) {
          array[1].splice(index, 1);
        }
      }
    }
  }

  function set(paths, value) {

    var all, any, count, counter, exists, node, nodes, path;

    if (arguments.length < 2) {
      return false;
    }

    var pathsType = findType(paths);

    if (pathsType === "string") {
      node = getNode(paths);
      exists = !!node;

      if (!exists) {
        return false;
      }

      node.path[node.leaf] = value;

      return true;
    } else if (pathsType === "array") {
      nodes = {};
      all = 1;
      any = 0;

      paths = paths.sort();

      for (counter = 0, count = paths.length; counter < count; counter++) {
        path = paths[counter];
        node = getNode(path);

        exists = !!node;

        nodes[path] = exists ? value : undefined;

        if (exists)
          node.path[node.leaf] = value;

        all *= exists;
        any += exists * 1;
      }

      return {
        all: !!all,
        any: !!any,
        nodes: nodes
      };
    }

    return node;
  }

  function snip(path) {
    var node = getNode(path);

    delete node.path[node.leaf];

    return !node.path.hasOwnProperty(node.leaf);
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

  function tap(path, value) {
    return get(path) || value;
  }

  function truthy(paths) {
    var all,
      any,
      count,
      counter,
      exists,
      node,
      nodes,
      path,
      pathsType = findType(paths);

    if (pathsType === "string") {
      node = getNode(paths);
      exists = !!node;

      if (!exists) {
        return false;
      }

      return !!node.path[node.leaf];
    } else if (pathsType === "array") {
      nodes = {};
      all = 1;
      any = 0;

      paths = paths.sort();

      for (counter = 0, count = paths.length; counter < count; counter++) {
        path = paths[counter];
        node = getNode(path);

        exists = !!node;

        nodes[path] = exists ? !!node.path[node.leaf] : false;

        all *= exists;
        any += exists * 1;
      }

      return {
        all: !!all,
        any: !!any,
        nodes: nodes
      };

    }
  }

  return {
    check: check,
    extract: extract,
    fill: fill,
    get: get,
    plant: plant,
    probe: check,
    purge: purge,
    set: set,
    snip: snip,
    swap: swap,
    tap: tap,
    truthy: truthy
  };
};