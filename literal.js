"use strict";

var commonTools = require("./modules/common");

var findType = commonTools.findType;

var objectTools = require("./modules/object");
var stringTools = require("./modules/string");

var originalLiteral = null;
var originalLiteralType = null;


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

  var literalInterface = toolbox[literalType](originalLiteral, originalLiteralType);

  literalInterface.type = literalType;

  return literalInterface;
};