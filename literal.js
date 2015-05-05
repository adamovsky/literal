"use strict";

var commonLibrary = require("./modules/common");

var originalLiteral = null;
var originalLiteralType = null;

var toolbox = {
  "object": require("./modules/object"),
  "string": require("./modules/string"),
  "undefined": require("./modules/undefined"),
};

module.exports = function(literal) {
  var commonTools;
  var findType;
  var literalInterface;
  var literalType = originalLiteralType;
  var init = {};

  if (literal !== originalLiteral) {

    commonTools = commonLibrary(literal);
    findType = commonTools.findType;

    literalType = findType(literal);

    originalLiteral = literal;
    originalLiteralType = literalType;
  }

  init.commonTools = commonTools;
  init.literal = literal;
  init.type = literalType;

  literalInterface = toolbox[literalType](init);

  literalInterface.type = init.type;

  return literalInterface;
};