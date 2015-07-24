var root = require('packpath').self();
var fs = require('fs');

var literal = require("../../literal.js");

var data = {
  string: "test"
};

var o = literal(data);

var benchmark = new Metric({
  test: "/modules/common/findType"
});

benchmark.module.method(o);

function Metric(options) {
  var testPath = options.test.split("/");
  var moduleFileName = root + "/qa/bench/marks/" + options.test;
  var self = this;

  this.module = {
    method: function(json) {
      console.log("Testing " + self.name);
      return require(moduleFileName)(json);
    },
    filename: moduleFileName
  };

  this.name = testPath[testPath.length - 1];

  this.baseline = {
    filename: root + "/qa/bench/baselines/" + options.test + ".json"
  };
}

Metric.prototype.writeResults = function writeResults(json) {
  var self = this;
  fs.writeFile(this.baseline.filename, JSON.stringify(json, "", 2), function(err) {
    if (err) return console.log(err);
    console.log('Saved json for ' + self.name);
  });
}