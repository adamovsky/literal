"use strict";

module.exports = function stringTools(originalLiteral, originalLiteralType) {
    return {
        check: function(text) {
            if (!text) return true;

            return this.same(text);
        },
        same: function(text) {
            return originalLiteral === text;
        }
    };
};