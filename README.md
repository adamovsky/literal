# literal
JavaScript utility library for manipulating literals.

# string

```js
literal("some string").check() // true because it exists
literal("some string").check("hello") // false because they are not the same
literal("some string").same("hello") // same as above
literal("hello").same("hello") // true because they are the same
```

# object

```js
var x = {
    one : "a",
    two : "b"
};

literal(x).check() // true because x exists
literal(x).check("one") // true because x.one exists
literal(x).check("three") // false because x.three does not exist
literal(x).check(["one", "three"]); // { one : true, three: false }
literal(x).check(["one", "three"]).any // true because at least x.one exists
literal(x).check(["one", "three"]).all // false because x.theee does not exist
```

# undefined

```js
var x;

literal(x).check() // false because x is undefined
```