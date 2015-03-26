"use strict";

var literal = require("../../literal");

describe('object literal', function() {

    describe('check()', function() {

        var objectLiteral;

        beforeEach(function() {
            objectLiteral = literal({
                test: {
                    deep : {
                        object : {
                            literal : "value"
                        }
                    }
                },
                x: "hi",
                y: [
                    "hello", "world"
                ],
                z: {
                    "good": "day",
                    "same": "hi"
                }
            });
        });

        describe('with no parameter', function() {

            it("checks if given literal is an object", function() {
                expect(objectLiteral.check()).toBe(true);
            });

        });

        describe('with first parameter', function() {

            describe('as a string', function() {

                describe('single alphanumeric node path', function() {

                    it("checks the given path exists", function() {
                        expect(objectLiteral.check("x")).toBe(true);
                        expect(objectLiteral.check("abc")).toBe(false);
                        expect(objectLiteral.check("z")).toBe(true);
                    });

                    describe('and second parameter as a string', function() {

                        it("compares the node value at the path to the given value", function() {
                            expect(objectLiteral.check("x", "hi")).toBe(true);
                            expect(objectLiteral.check("abc", "hi")).toBe(false);
                        });

                    });

                });

                describe('two node alphanumeric path', function() {

                    it("checks the given path exists", function() {
                        expect(objectLiteral.check("z.good")).toBe(true);
                        expect(objectLiteral.check("z.bad")).toBe(false);
                    });

                    describe('and second parameter as a string', function() {

                        it("compares the node value at the path to the given value", function() {
                            expect(objectLiteral.check("z.good", "day")).toBe(true);
                            expect(objectLiteral.check("z.bad", "day")).toBe(false);
                        });

                    });
                });

                describe('arbitrary number of nodes alphanumeric path', function() {


                    it("checks the given path exists", function() {
                        expect(objectLiteral.check("test.deep.object.literal")).toBe(true);
                        expect(objectLiteral.check("z.bad.it.does.not.exist")).toBe(false);
                    });

                    describe('and second parameter as a string', function() {

                        it("compares the node value at the path to the given value", function() {
                            expect(objectLiteral.check("test.deep.object.literal", "value")).toBe(true);
                            expect(objectLiteral.check("z.bad.it.does.not.exist", "hi")).toBe(false);
                        });

                    });

                });

            });

            describe('as an array', function() {

                it("checks if any of the given paths exists", function() {
                    expect(objectLiteral.check(["z.good", "a.b.c"]).any).toBe(true);
                    expect(objectLiteral.check(["some.random.path", "a.b.c"]).any).toBe(false);
                    expect(objectLiteral.check(["x", "z.good"]).any).toBe(true);
                });

                it("checks if all of the given paths exists", function() {
                    expect(objectLiteral.check(["x", "y", "z"]).all).toBe(true);
                    expect(objectLiteral.check(["a", "b", "c"]).all).toBe(false);
                    expect(objectLiteral.check(["z.good", "a.b.c"]).all).toBe(false);
                    expect(objectLiteral.check(["x", "y", "z", "z.good"]).all).toBe(true);
                    expect(objectLiteral.check(["z.good"]).all).toBe(true);
                });

                describe('and second parameter as a string', function() {

                    it("checks if the values of all paths match a given value", function() {
                        var comparePathValues = objectLiteral.check(["z.same", "x"], "hi");
                        expect(comparePathValues.all).toBe(true);
                        expect(comparePathValues.any).toBe(true);
                    });

                    it("checks if the values of any paths match a given value", function() {
                        var comparePathValues = objectLiteral.check(["z.same", "y"], "hi");
                        expect(comparePathValues.all).toBe(false);
                        expect(comparePathValues.any).toBe(true);
                    });

                });

            });

        });

    });

});