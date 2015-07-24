# Literal

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
if (literal(school).check("student.name") 
    && literal(school.student.name).check(["first", "last"])) {
    // welcome first + last
}
```

Eventually it will maintain a cache of traversed paths, but for the time-being you can use the above to check a common path, and then go through leaf nodes.  This will save you a full path traversal each time.

## Internals

### Paths

A path is a string representation of any valid JavaScript traversable path within the context of the given object literal.

Some valid path syntaxes:

`"a.b.c"`

`"[0][1][2]"`

`"a[0].b[1].c[2]"`

`"a.b[0].c[1][2]"`

As we can see, it can get complex quickly.

Remember that a path is relative to the given object literal and is always a string.

##### Example

```js
literal(obj).method("a.b.c");
```

The above suggests we want to work with `obj.a.b.c` not just `a.b.c`.

If you _do_ want to work with `a.b.c` you would do this:

```js
literal(a).method("b.c");
```

As we can see, the _path_ (`"b.c."`) is relative to the given object (`literal("a")`).

#### Multiple paths

Some methods also accept multiple paths to operate on.

To specify multiple paths simply define them in the form of an array of path strings (see above for syntax).

Taking the above example of the four individual paths, we can group them into an array as such:

```
[
  "a.b.c",
  "[0][1][2]",
  "a[0].b[1].c[2]",
  "a.b[0].c[1][2]"
]
```

Whenever paths are passed in as an array, the return value will be an object literal rather than a boolean.

##### Return Object

The return object will have the following structure:

```
{
  all: [Boolean],
  any: [Boolean]
  nodes: [Object]
}
```

It will go through all paths, run the given operation against each path, and store the results in three properties:

##### all

If the given operation (e.g. `check()`) returned true for each path, the `all` would be set to `true` - and the inverse.

##### any

If the given operation (e.g. `check()`) returned true for some (at least one of the) paths, the `any` would be set to `true`.

If none of the given paths return true, then this is set to `false`.

##### nodes

This property is a key / value object that stores each path as a key, and if the operation returned true then the value would be true as well.

An simple illustration:

```js
{
  all : false,
  any : true,
  nodes : {
    "a.b.c" : false,
    "a[0]" : true,
    "some.path[2][3]": false
  }
}
```

### Node Object

Internally paths are parsed into a `node object` that has the following structure:

```
{
  "ok": [Boolean],
  "path": [Object],
  "leaf": [String]
}
```

#### ok

This is a boolean that simply says whether or not the method that returned this `node object` executed successfully or not.

#### path

This is the path object excluding the end point to the literal of the full path. 

If we have a full path such as _my.little.test_, the `path` would only contain `my.little`. 

This is a JavaScript object, so it can be access programmatically _without_ the need of parsing it.

#### leaf

This is a string representation of the last node of the full path literal.

If we have a full path such as _my.little.test_, the `leaf` would only contain `test`. 

## Object Literal

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
  },
  months : new Array(12)
};
```

Given the above complex data structure we run the following commands with their corresponding outputs. 

Before we begin, let's first alias our identifiers so it becomes less to type.

```js
var literal = require("literal");
var o = literal(funTime);
```

Now instead of writing `literal(funTime).check("some.path")` we can simply write `o.check("some.path")`.

Going forward we will use a cached literal in all our examples.

### Methods

#### check(paths, value)

Checks if path or paths exist or match the given value.

##### paths - [optional]

  * **undefined**

  If no `paths` is passed in, it will simply check if the object literal exists.

  ```js
  o.check(); // true
  ```

  * **string**

  If `paths` is defined, it will be parsed into a `node object`.

  If `value` is not passed in, then it will check if the given `path` exists in the context of the given object literal.

  ```js
  o.check("some.path.that.does.not.exist"); // false
  ```

  * **array**

  If `paths` is an array of multiple paths and no value is passed in, it will simply check all paths to see if they exist.

  ```js
  o.check(["map", "periods", "cycle[0]"]); // return object
  ```  

##### value - [optional]

  * **string**

  If `value` is passed in, then it will _check_ if the given `path`'s value is the same when it's a string.

  ```js
  o.check("cycle[0]", "dawn"); // true
  ```

#### extract(paths, value)

Collects values at the given `paths` and assigns them to an object literal where the key is the path and the value is the corresponding value at the given path.

If a given value does not exist, it will default to undefined, unless a `value` is given.

##### paths - [required]

  * **undefined**

  If no `paths` is passed in, it will return `false` since it doesn't know what you want to extract.

  ```js
  o.extract(); // false
  ```

  * **string**

  If `paths` is a single string, it will check if the given path exists in the context of the given object literal and return the value in object literal form.

  ```js
  o.extract("cycle[1]"); // { "cycle[1]" : "twilight" }
  ```

  * **array**

  If `paths` is an array, it will check if the given paths exists in the context of the given object literal and return the value in object literal form.

  ```js
  o.extract(["cycle[1]", "d.d.d"); // { "cycle[1]" : "twilight", "d.d.d": undefined }
  ```

#### fill(paths, values)

Fills an existing path or paths with a given value or values if the given path or paths are falsy (but not `0` or `false`).

##### paths - [required]

 * **array**

  If `paths` is an array of multiple paths, it will check each path for a falsy value and only fill with the `value` if it is.

  ```js
  o.fill(["map", "periods"], "lorem"); // return object
  ```  

##### value - [required]

The value to fill any falsy values with.  This includes any newly created paths.

 * **array**

  If `value` is an array of multiple paths, and the `paths` is an array as well, then the `paths` will be filled incrementally with the values of `value`.

  ```js
  o.fill("months", ["January", "February"]); // return key value pair
  ```  

#### get(paths)

Gets a given value of a given path or paths if they exists.

##### paths - [required]

  * **undefined**

  If no `paths` is passed in, it will return the original root literal.

  ```js
  o.get(); // funTime
  ```
  * **string**

  If `paths` is a single string, it will check if the given path exists in the context of the given object literal and return the value.

  ```js
  o.get("cycle[1]"); // value
  ```

  * **array**

  If `paths` is an array of multiple paths the value at those paths will be retrieved.

  ```js
  o.get(["map", "periods", "cycle[0]"]); // return object
  ```  

#### plant(paths, value)

Plants a value on a given path or paths only if it doesn't exist.

#### probe(path)

Alias to `get()`.

#### set(paths, value)

Sets a given value on a given path or paths only if it exists.

##### paths - [required]

  * **undefined**

  If no `paths` is passed in, it will return false since no values were set.

  ```js
  o.set(); // false
  ```

  * **string**

  If `value` is not passed in, then it will check if the given `path` exists in the context of the given object literal.

  ```js
  o.set("cycle[1]", "hello"); // node object
  ```

  * **array**

  If `paths` is an array of multiple paths the given value will be assigned only to the paths that exist.

  ```js
  o.set(["map", "periods", "cycle[0]"], "hello"); // return object
  ```  

##### value - [required]

  * **anything**

  This is the value to set a given path to.  This can be any valid JavaScript value (e.g. object, array, function, ...)

#### snip(path)

Remove the last path node (leaf) from the given path.  Returns a boolean to indicate if the removal was successful.

  ```js
  o.snip("periods.morning"); // returns true
  ```  

#### swap(path, path)

##### path - [required]

  * **string**

  Either of the `path` can be a string to a path that you want to swap with the other.

  The `path` can be mix and matched with object literals, arrays, and strings. 

  ```js
  o.swap("periods", "cycle[2]"); // true
  ```

  The above example will move an entire key value pair data structure and swap places with a simple array item.  This is a powerful feature on its own if you manipulate a lot of data.

#### tap(path, value)

Returns the value of the given `path` if it has a truthy value, otherwise return given `value`.

##### path - [required]

  * **string**

  The `path` is a string to a path that you want to retrieve its value if it exists.

##### value - [optional]

  * anything

  The `value` can be any value to be returned if the given `path` does not exist or returns a falsy value.

#### truthy(paths)

Checks given `paths` if they exist and if their values are truthy.

##### paths - [required]

  * **string**

  The `paths` is a string to a path that you want to see if it exists and if its value is truthy.

  * **array**

  If `paths` is an array of multiple paths they will all be checked for existence and truthy values.

  ```js
  o.truthy(["map", "periods", "cycle[0]"]); // return object
  ```  

### Simple Examples

Here are a few examples based on the above data structure.

| Method          | Output    | Reason      |
| --------------- | --------- | ------------| 
| `o.check();`    | true      | `funTime` exists  |
| `o.check("map");` | true      | `funTime.map` exists  |
| `o.check("cycle[2]", "dusk");`    | false      | `funTime.cycle[2]` value is not "dusk"  |
| `o.check("meridiem.am[1]");` | true | `funTime.meridiem.am[1]` exists |
| `o.check(["map", "cycle"]);` | true | `funTime.map` and `funTime.cycle` exist |
| `o.check(["map[3]", "meridiem.am"], "two").all` | false | both values are not `two` |
| `o.check(["map[3]", "meridiem.am"], "two").any` | true | at least one value is `two` |
| `o.swap("periods.afternoon", "cycle[2]")` | true | values swapped successfully |
| `o.fill("months")` | false | No fill value |
| `o.fill("months", "Same")` | true | All months were filled with "Same"
| `o.fill("months", ["Jan", "Feb"])` | true | First two Months were filled with given array |
| `o.fill("periods.morning.hours", "hello")` | false | No items were filled |
| `o.set("periods.noon.hours[0]", "12:00")` | true | Given path exists so value set |
| `o.plant("a.b.c", "hello")` | true | Path is created and value set |
| `o.plant("months", "hello")` | true | Existing path has value changed |