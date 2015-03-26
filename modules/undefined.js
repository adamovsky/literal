"use strict";

module.exports = function undefinedTools(originalLiteral, originalLiteralType) {
    return {
        check: function() {
            return false;
        }
    };
};