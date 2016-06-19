/*
 * main spirit file
 */

const p_utils = require("./promise_utils")

const reducep = (arr, args, start_idx) => {
  let promises = arr
  if (start_idx) {
    promises = arr.slice(start_idx)
  }

  return promises.reduce((p, fn, idx) => {
    return p.then((v) => {
      if (typeof v !== "undefined") {
        return v // if there is a value, stop iterating
      }
      return fn.apply(undefined, args)
    })
  }, Promise.resolve())
}

/**
 *
 *
 */
const middleware_run = (handler, middleware) => {
  return middleware.reduce((wrapper, mw_fn) => {
    const mw = mw_fn(wrapper)

    if (typeof mw !== "function") {
      throw new TypeError("Expected middleware to return a function that takes a request")
    }

    return (request) => {
      return p_utils.callp(mw, [request]).then((v) => {
        return v
      })
    }
  }, (request) => {
    return Promise.resolve(handler).then((v) => {
      return v
    })
  })
}

/**
 * runs the `handler` with `request` and
 * pipes the output through the middleware response attachments
 * finally returning a Promise of the final response
 *
 * @param {function} handler - the handler, as passed in through `adapter`
 * @param {request-map} request - a request map
 * @param {promise} middleware - middleware returns composed together
 * @return {promise} final response
 */
const handler_run = (handler, request, middleware) => {
  const result = handler(request)
  result.then((response) => {
    return middleware.resolve(response)
  })
  return result
}

/**
 * Returns a function that when called will run
 * through all middlewares and a handler function
 * with the `request` (request map) input
 * and returns an output (promise, response map)
 *
 * @param {function} handler - a handler function
 * @param {array} middleware - an array of middleware function
 * @return {function} returns a function that takes a request and returns a response (promise)
 */
const main = (handler, middleware) => {
  return (request) => {
    const route = middleware_run(handler, middleware)
    const response = route(request)

    response.then((result) => {
      // can do clean up here for the response
    }).catch((err) => {
      // something went wrong in:
      // handler
      // middleware
    })
    return response
  }
}

module.exports = {
  reducep,
  main,
  middleware_run,
  handler_run
}

