/*
 * main spirit file
 */

const p_utils = require("./promise_utils")

/**
 * reduces over `middleware` with `handler`, composing them
 * together to return a single reducer function
 * that returns a Promise
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - array of spirit middleware
 * @return {function} takes a 'request' and returns a Promise
 */
const reduce_mw = (handler, middleware) => {
  // wrap `fn` to always returns a promise
  const wrap = function(fn) {
    return function(request) {
      return p_utils.callp(fn, [request])
    }
  }

  return middleware.reduce((prev, curr) => {
    const r = curr(prev)
    if (typeof r !== "function") {
      throw new TypeError("Expected middleware to return a function that takes a request")
    }
    return wrap(r)
  }, wrap(handler))
}

/**
 * returns a reducer function that runs through `handler`
 * and `middleware` passing the argument that was used to call
 * the returned reducer function
 *
 * the reducer function returns a Promise of the results of
 * `middleware` and `handler`
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - an array of middleware function
 * @return {function} returns a function that takes a request and returns a response (promise)
 */
const main = (handler, middleware) => {
  return (request) => {
    const reducer = reduce_mw(handler, middleware)
    return reducer(request)
  }
}

module.exports = {
  main,
  reduce_mw
}

