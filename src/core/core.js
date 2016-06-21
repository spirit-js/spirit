/*
 * main spirit file
 */

const p_utils = require("./promise_utils")

/**
 * reduces over `middleware` with `handler`, composing them
 * together to return a single function that returns a Promise
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - array of spirit middleware
 * @return {function} takes a 'request' and returns a Promise
 */
const reduce_mw = (handler, middleware) => {
  // ensure that the handler always returns a promise
  const wrap_handler = (request) => {
    return p_utils.callp(handler, [request])
  }

  return middleware.reduce((prev, curr) => {
    const r = curr(prev)
    if (typeof r !== "function") {
      throw new TypeError("Expected middleware to return a function that takes a request")
    }
    return r
  }, wrap_handler)
}

/**
 * Returns a function that when called will run
 * through all middlewares and a handler function
 * with the `request` (request map) input
 * and returns an output (promise -> response map)
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - an array of middleware function
 * @return {function} returns a function that takes a request and returns a response (promise)
 */
const main = (handler, middleware) => {
  return (request) => {
    const route = reduce_mw(handler, middleware)
    const response = route(request)

    response.then((resp_map) => {
      // can do clean up here for the response
      return resp_map
    }).catch((err) => {
      // unhandled error in middleware or handler
    })
    return response
  }
}

module.exports = {
  main,
  reduce_mw
}

