# literal
JavaScript utility library for manipulating literals.

This library helps running complex and long operations on literals using a more concise syntax.

Instead of writing:

```js

if (school 
    && school.student 
    && school.student.name 
    && school.student.name.first) {
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
if (literal(school).check("student.name.first") 
    && literal(school).check("student.name.last")) {
    // welcome
}
```

You can use the built-in shorthand:

```js
if (literal(school).check(["student.name.first", "student.name.last"])) {
    // welcome first + last
}
```

You could get creative and optimize:

```js
if (literal(school).check("student.name") && literal(school.student.name).check(["first", "last"])) {
    // welcome first + last
}
```

Eventually it will maintain a cache of traversed paths, but for the time-being you can use the above to check a common path, and then go through leaf nodes.  This will save you a full path traversal each time.

# string

```js
literal("some string").check()        // true 
                                      //  - because it exists
literal("some string").check("hello") // false 
                                      //  - because they are not the same
literal("some string").same("hello")  // false
                                      //  - alias to above
literal("hello").same("hello")        // true 
                                      //  - because they are the same
literal(x).type                       // "string"
                                      //  - cached lookup type
```

# Object Operations

```js
var funTime = {
    map : ["zero", "one", "two", "three", "four", "five", "six", 
           "seven", "eight", "nine", "ten", "eleven", "twelve"],
    periods : {
        morning : {
            hours : [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
        noon : {
            hours : [12]
        },
        afternoon : {
            hours : [1, 2, 3, 4, 5]
        },
        evening : {
            hours : [6, 7]
        },
        night : {
            hours : [8, 9, 10, 11]
        },
        midnight : {
            hours : [12]
        }
    },
    cycle : [
        "dawn", "twilight", "sunrise", "dusk", "twilight"
    ],
    meridiem : {
        am : [ "midnight", "morning"],
        pm : [ "noon", "afternoon", "evening", "night"]
    }
};
```

Given the above complex data structure we run the following commands with their corresponding outputs. 

Before we begin, let's first alias our identifiers so it becomes less to type.

```js
var l = require("literal");
var o = funTime;
```

Let the fun begin !

| Method          | Output    | Reason      |
| --------------- | --------- | ------------| 
| `l(o).check();` | true      | `o` exists  |

# undefined

```js
var x;

literal(x).check() // false because x is undefined
literal(x).type // "undefined"
```