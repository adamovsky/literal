# literal
JavaScript utility library for manipulating literals.

This library helps running complex and long operations using a more concise syntax.

Instead of writing:

```js

if (school && school.student && school.student.name && school.student.name.first) {
    // welcome first
}

```

You can now write:

```js
if (literal(school).check("student.name.first")) {
    // welcome first
}
```

This removes a lot of clutter code.

Let's consider another example.

Instead of writing:

```js
if (literal(school).check("student.name.first") && literal(school).check("student.name.last")) {
    // welcome
}
```

You can use the built-in shorthand:

```js
if (literal(school).check(["student.name.first", "student.name.last"])) {
    // welcome first + last
}
```


# string

```js
literal("some string").check() // true because it exists
literal("some string").check("hello") // false because they are not the same
literal("some string").same("hello") // same as above
literal("hello").same("hello") // true because they are the same
literal(x).type // "string"
```

# object

```js
var x = {
    one : "a",
    two : [ "b" ],
    three : {
        "states" : [ "nj", "ny", "fl" ],
        "things" : "string",
        "same" : "a"
    }
};

literal(x).check() // true because x exists
literal(x).check("one") // true because x.one exists
literal(x).check("three") // false because x.three does not exist
literal(x).check("one", "a") // true because x.one === "a"
literal(x).check(["one", "three"]); // { one : true, three: false }
literal(x).check(["one", "three"]).any // true because at least x.one exists
literal(x).check(["one", "three"]).all // false because x.theee does not exist
literal(x).check(["three.states", "one"]).nodes; // { "three.states" : [ "nj", "ny", "fl" ], "one" : "a" }
literal(x).check(["two", "three.same"], "a").any // true because at least one node equals to "a"
literal(x).check(["one", "three.same"], "a").all // true because both "one" and "three.same" equal "a"
literal(x).fill("one", "hello"); // sets "hello" to x.one if it exists, and creates it if doesn't
literal(x).fill(["one", "two"], "hello"); // sets "hello" to x.one and x.two if they exist, and creates it they don't
literal(x).swap("one", "two"); // x.one and x.two swap values
literal(x).swap("one", "six", false); // won't swap values because x.six doesn't exist
literal(x).type // "object"
```

# undefined

```js
var x;

literal(x).check() // false because x is undefined
literal(x).type // "undefined"
```