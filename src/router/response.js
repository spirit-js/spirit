/*
 * Higher level abstraction over core.response
 * mostly centered around rendering response maps based on
 * what was returned by the user
 *
 * Has a middleware system in place, mostly meant for developers
 * NOTE could use the same abstraction with define/reducep/mapl
 * for iterating over middlewares, but I don't expect response
 * middlewares to need to handle async/Promise to generate
 * a appropriate response map
 *
 */

const core = require("../core/core")
const core_response = require("../core/response")
const response_map = require("./response-map")

// response middlewares
const middlewares = {
  _middlewares: [],

  /**
   * register a middleware function for handling responses
   *
   * the order of the execution of the middlewares is
   * last in, first out
   *
   * so what is registered last is called first
   *
   * when called with an array (of response middlewares),
   * it will replace the entire
   * middlewares with array as it's new middlewares
   *
   * @public
   * @param {function} mw - a middleware function
   * @return {array} list of response middlewares
   */
  register(mw) {
    if (typeof mw === "function") {
      this._middlewares.unshift(mw)
      return this.list()
    }

    if (Array.isArray(mw)) {
      this._middlewares = mw.slice()
      return this.list()
    }

    throw new TypeError("register expects function/array as argument")
  },

  /**
   * returns the array of response middlewares
   *
   * @return {array} response middlewares
   */
  list() {
    return this._middlewares.slice()
  }
}

/**
 * runs `resp` through response middlewares
 *
 * @param {request-map} req - in the future a request-map, but as of right now it's a http Request object
 * @param {response-map} resp - a leaf response map
 * @param {array} middlewares - an array of response middlewares
 * @return {response-map}
 */
const render = (req, resp, middlewares) => {
  let result
  middlewares.some((fn) => {
    result = fn(req, resp)
    if (typeof result !== "undefined") {
      return true
    }
  })

  if (!response_map.is_response_map(result)) {
    throw new Error("unable to render a response (no response middleware knew how to handle it): " + resp)
  }

  return result
}

/**
 * a intermediate function that tries to convert `body` into
 * a appropriate response map first before calling `send()`
 *
 * @param {http.Response} res - node http Response object
 * @param {*} body - the result of a route's body function or from a middleware
 */
const response = (req, body) => {
  let rmap = body
  if (!response_map.is_response_map(body)) {
    rmap = response_map.create(body)
  }

  return render(req, rmap, middlewares.list())
}

// response middleware; sets a default html & utf-8 charset
// when no content type headers are set for a response with
// a string body
const render_string = (req, resp) => {
  const {body} = resp
  if (typeof body === "string") {
    return resp._type("html")
  }
}

// response middleware; converts all numbers to be a string
// then sets the content type to be html & utf-8 if there
// is no content-type set
const render_number = (req, resp) => {
  const {body} = resp
  if (typeof body === "number") {
    resp.body = resp.body.toString()
    return render_string(req, resp)
  }
}

// TODO
const render_buffer = (req, resp) => {
  const {body} = resp
  if (Buffer.isBuffer(body)) {
    return resp._type("html")
  }
}

// init, register default response middleware
middlewares.register(render_string)
middlewares.register(render_number)
middlewares.register(render_buffer)

module.exports = {
  response,
  render,
  renderables: {
    buffer: render_buffer,
    string: render_string,
    number: render_number
  },
  middlewares
}
