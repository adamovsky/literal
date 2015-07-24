var Benchmark = require('benchmark');

var commonLibrary = require("../../../../../modules/common");

var commonTools, findType, getNode, o;

module.exports = function(literal) {

  o = literal;

  commonTools = commonLibrary(o.get());

  findType = commonTools.findType;
  getNode = commonTools.getNode;

  // suite = new Benchmark.Suite();

  // suite
  //   .on('start', function() {
  //     console.log("+ check()");
  //   })
  //   .add('old', function() {
  //     o.check();
  //   })
  //   .add('new', function() {
  //     check();
  //   })
  //   .on('cycle', function(event) {
  //     console.log(String(event.target));
  //   })
  //   .on('complete', function() {
  //     console.log('    ' + this.filter('fastest').pluck('name') + " wins");
  //   })
  //   .run({
  //     'async': false
  //   });

  suite = new Benchmark.Suite();

  suite
    .on('start', function() {
      console.log("+ check(\"string\")");
    })
    .add('old', function() {
      o.check("string");
    })
    .add('new', function() {
      check("string");
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('    ' + this.filter('fastest').pluck('name') + " wins");
    })
    .run({
      'async': false
    });

};

function check(paths, value) {
  if (!paths) return true;

  return doNewCheck(paths, value);

}

var x = {};

function stringCheck(paths, value, checkValue) {
  var node;

  if (!x[paths]) {
    node = getNode(paths);
    x[paths] = node;
  } else {
    node = x[paths];
  }

  return !!node && checkValue && node.path[node.leaf] === value;
}

function doNewCheck(paths, value) {

  var checkValue = arguments.length === 2;

  var type = findType(paths);

  if (type === "string") {
    return stringCheck(paths, value, checkValue);
  }

}

function doCheck(paths, value) {

  var exists;
  var node;
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