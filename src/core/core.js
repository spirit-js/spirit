/*
 * main spirit file
 */

const p_utils = require("./promise_utils")


/**
 * Returns a function that wraps `reduce_mw`
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - an array of middleware function
 * @return {function} returns a function that takes a input and returns a output as a (promise)
 */
const compose = (handler, middleware) => {
  // wrap `fn` to always returns a promise
  const wrap = function(fn) {
    return function(input) {
      return p_utils.callp(fn, [input])
    }
  }

  let prev = wrap(handler)

  for (let i = middleware.length - 1; i >= 0; i--) {
    prev = wrap(middleware[i](prev))
  }

  return prev
}

module.exports = {
  compose
}
