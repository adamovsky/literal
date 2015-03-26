"use strict";

var literal = require("../literal");

describe('literal.js', function() {

    describe('when literal is not passed in', function() {

        var undefinedLiteral;

        beforeEach(function() {
            undefinedLiteral = literal();
        });

        it("returns the interface for undefined", function() {
            expect(undefinedLiteral.type).toBe("undefined");
        });

    });

    describe('when literal is passed in', function() {

        describe('as an object', function() {

            var objectLiteral;

            beforeEach(function() {
                objectLiteral = literal({});
            });

            it("loads the object literal interface", function() {
                expect(objectLiteral.type).toBe("object");
            });

        });

        describe('as undefined', function() {

            var objectLiteral;

            beforeEach(function() {
                objectLiteral = literal(undefined);
            });

            it("loads the undefined literal interface", function() {
                expect(objectLiteral.type).toBe("undefined");
            });

        });

    });

});