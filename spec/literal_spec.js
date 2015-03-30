var literal = require("../literal");

describe('literal.js', function() {

    describe('when literal is not passed in', function() {

        it("returns the interface for undefined", function() {
            expect(literal().type).toBe("undefined");
        });

    });

});