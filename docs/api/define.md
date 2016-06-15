# define

Takes an array and returns a "List" (which is _basically_ an array), that you can store a `then` and `catch` to.

Optionally, you can pass a name (string) as it's first argument. 

It is a psuedo Promise, it looks like one, but is not one. That is `then` and `catch` are not chainable.

The primary use case for `define` is to make array that can carry with it a `then` and `catch` and a "name".

[Source: src/core/core.js (define)](../../src/core/core.js#L223)

#### Arguments
* name {string} Optional
* arr {array} an array of middlewares or routes

#### Return
{object} List

A "List" is returned which is basically an object that holds the following information:

`{ name: name, list: [...arr], then: <Function>, catch: <Function> }`

Which you can call `then` and `catch` on, which then will store itself onto the List object as `_then` and `_catch`.

