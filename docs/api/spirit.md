# compose
##### (spirit.compose)

Composes `middlewares` and `handler` together as a single function, which is the returned function.

[Source: src/core/core.js (compose)](../../src/core/core.js#L39)

#### Arguments
* handler {function} A handler function
* middlewares {array} Array of spirit middlewares

#### Return
{function} Takes a single argument (input) and passes it through the `middlewares` and finally `handler` and returns a Promise of the result



-----------------------------------------------------
# callp
##### (spirit.callp)

Calls a function `fn` with `args` returning the value as a Promise if it's not already a Promise.

Additionally if `fn` is _not_ a function, it will ignore `args` and return `fn` as a value wrapped as a Promise.

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)
#### Arguments
* fn {*} a function to call or a value of any type
* args {array} an array of arguments to `fn`
#### Return
{Promise} The value of `fn(args)` wrapped as a Promise if it's not a Promise already



--------------------------------------------------
# is_promise
##### (spirit.is_promise)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx
