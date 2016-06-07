const core = require("../core/core")
core.response = require("../core/response")


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
 * runs `resp` through response middlewares
 *
 * @param {response-map} resp - a leaf response map
 * @return {response-map}
 */
const render = (resp) => {
  let result
  response_middlewares.some((fn) => {
    if (fn(resp)) {
      result = resp
      return true
    }
  })

  if (!core.response.is_response(result)) {
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
const response = (res, body) => {
  let resp = body
  if (!core.response.is_response(body)) {
    resp = core.response.response(body)
  }

  core.send(res, render(resp))
}

const render_string = (resp) => {
  const {status, headers, body} = resp
  if (typeof body === "string") {
    return {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body
    }
  }
}

const render_number = (resp) => {
  const {status, headers, body} = resp
  if (typeof body === "number") {
    return render_string(status, headers, body.toString())
  }
}

const render_file = (resp) => {
  
}

// init, register default response middleware
register(render_string)
register(render_number)
register(render_file)

module.exports = {
  response,
  render,
  middlewares: {
    render_file, render_string, render_number
  },
  register,
  response_middlewares
}
