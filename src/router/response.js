const response_middlewares = []

/**
 * register a middleware function for handling responses
 *
 * the order of the execution of the middlewares is
 * last in, first out
 *
 * so whatever is registered last is called first
 *
 * @public
 * @param {function} mw - a middleware function
 */
const register = (mw) => {
  if (typeof mw !== "function") {
    throw new TypeError("register was called with a non-function")
  }
  response_middlewares.unshift(mw)
}

/**
 * detects type of a unknown value against all possibles `types`
 * returns a string representing the type that matches
 *
 * or undefined if no known match
 *
 * @param {object} types - types to check against
 * @param {number|undefined} status - a http status code
 * @param {object} headers - http headers
 * @param {*} body - a value of unknown type to be checked
* @return {string|undefined}
 */
const __type__ = (types, status, headers, body) => {
  let r
  Object.keys(types).some((typ) => {
    if (types[typ].check(status, headers, body)) {
      r = typ
      return true
    }
  })
  return r
}

/**
 * Takes a value of a route's body function
 * and returns a full http response map
 *
 * @param {*} body - a http response map or a value as passed in by a middleware or route function
 * @return {http-response-map}
 */
const render = (body) => {
  
}

/**
 * a intermediate function that tries to convert `body` into
 * a http response map first before calling `send()`
 *
 * @param {http.Response} res - node http Response object
 * @param {*} body - the result of a route's body function or from a middleware
 */
const response = (res, body) => {
  if (typeof body === "undefined" || body === null) {
    throw new TypeError("called response with a undefined or null value")
  }

  send(res, render(body))
}

// init, register default response middleware
const response_types = require("./response_types")
register(response_types.type_string)
register(response_types.type_number)
register(response_types.type_file)

module.exports = {
  response,
  render,
  register,
  response_middlewares,
  __type__
}
