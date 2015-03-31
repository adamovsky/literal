var literal = require("../literal");

describe('literal.js', function() {

    describe('when literal is not passed in', function() {

        var undefinedLiteral = literal();

        it("returns the interface for undefined", function() {
            expect(undefinedLiteral.type).toBe("undefined");
        });


        describe('check()', function() {

            it("checks if given literal is defined", function() {
                expect(undefinedLiteral.check()).toBe(false);
            });

        });

    });

    describe('when literal is passed in', function() {

        describe('as an object', function() {

            describe('check()', function() {

                var objectLiteral;

                beforeEach(function() {
                    objectLiteral = literal({
                        x: "hi",
                        y: [
                            "hello", "world"
                        ],
                        z: {
                            "good": "day"
                        }
                    });
                });

                describe('with no parameter', function() {

                    it("checks if given literal is an object", function() {
                        expect(objectLiteral.check()).toBe(true);
                    });

                });

                describe('with parameter', function() {

                    describe('as a string', function() {

                        it("checks the given path exists and returns its value", function() {
                            expect(objectLiteral.check("z.good")).toBe("day");
                        });

                        it("checks the given path doesn't exist", function() {
                            expect(objectLiteral.check("z.bad.it.does.not.exist")).toBe(false);
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
                            expect(objectLiteral.check(["x", "y", "z", "z.good"]).all).toBe(true)
                            expect(objectLiteral.check(["z.good"]).all).toBe(true);
                        });

                        it("retrieves the values of paths that exist", function() {
                            var check = objectLiteral.check(["z.good", "a.b.c"]);
                            expect(check.nodes["z.good"]).toBe("day");
                            expect(check.nodes["a.b.c"]).toBe(false);
                        });
                    });

                });

            });

        });

    });

});