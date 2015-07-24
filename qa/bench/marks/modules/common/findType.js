var root = require('packpath').self();

var utils = require(root + "/qa/bench/utils/tools.js");

var writeResults = utils.writeResults;

var path = require('path');
//var scriptName = path.basename(__filename);

var scriptName = __filename;

var Benchmark = require('benchmark');

var file = root + "/qa/bench/baselines/modules/common/findType.json";
var commonLibrary = require(root + "/modules/common");
var baseline = require(file);

var commonTools, findType, o;
var name = scriptName;

module.exports = function(literal) {

  o = literal;

  commonTools = commonLibrary(o.get());

  var method = commonTools.findType;

  var bench = Benchmark(baseline);
  var current = Benchmark({
      "fn": method
    })
    .run();

  if (current.hz > bench.hz)
    writeResults(current);

  console.log("Name: ", name);
  console.log(current.compare(bench));

  console.log(current.hz);
  console.log(bench.hz);
};

function writeResults(json) {
  fs.writeFile("./baselines/modules/common/findType.json", JSON.stringify(json, "", 2), function(err) {
    if (err) return console.log(err);
    console.log('Saved json for ' + name);
  });
}