/*
 * main spirit file
 */

const p_utils = require("./promise_utils")


/**
 * A reducer function, for reducing over a handler
 * and middlewares
 *
 * All functions are expected to return a Promise
 * It is wrapped to ensure a Promise is returned
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

  let accum = wrap(handler)

  for (let i = middleware.length - 1; i >= 0; i--) {
    accum = wrap(middleware[i](accum))
  }

  return accum
}

module.exports = {
  compose
}
