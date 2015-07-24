var Benchmark = require('benchmark');

var commonLibrary = require("../../../../../modules/common");

var commonTools, findType, getNode, o;

module.exports = function(literal) {

  o = literal;

  commonTools = commonLibrary(o.get());

  findType = commonTools.findType;
  getNode = commonTools.getNode;

  suite = new Benchmark.Suite();

  suite
    .on('start', function() {
      console.log("+ getNode(path)");
    })
    .add('old', function() {
      o.getNode();
    })
    .add('new', function() {
      getNode();
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