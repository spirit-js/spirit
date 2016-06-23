# compose
##### (spirit.compose)

Composes `middlewares` and `handler` together as a single function, which is the returned function.

[Source: src/core/core.js (compose)](../../src/core/core.js#L39)

#### Arguments
* handler {function} A handler function
* middlewares {array} Array of spirit middlewares

#### Return
{function} Takes a single argument (input) and passes it through the `middlewares` and finally `handler` and returns a Promise of the result
