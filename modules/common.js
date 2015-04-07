"use strict";

exports.findType = function(literal) {
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