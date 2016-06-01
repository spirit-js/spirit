/*
 * For Routes, HTTP method shortcuts and converting to a structure for router.lookup
 */

const path_regexp = require("path-to-regexp")

/**
 * converts a route definition to something more friendly for
 * router.lookup
 *
 * returns a Route, which is just a map
 *
 * @param {string} method - http verb
 * @param {string} path - URL path of route
 * @param {string[]} args - arguments used to destructure the request, and to be passed into `body`
 * @param {function} body - a function that accepts args
 * @return {Route}
 */
const compile = (method, path, args, body) => {
  const keys = []
  const re = path_regexp(path, keys)

  // guard
  if (typeof method !== "string"
      || typeof path !== "string"
      || !Array.isArray(args)
      || typeof body !== "function") {
    throw new TypeError("Cannot compile route, invalid argument type to compile: " + method + ", " + path + ", " + args + ", " + body + ", Expecting type: (string, string, array, function)")
  }
  // guard
  if (!method || !path) {
    throw("Cannot compile route, empty string passed to compile (verb); Got: " + method + " " + path)
  }

  return {
    method,
    path: { re, keys, path },
    args,
    body
  }
}

/**
 * converts a Route to a map of it's keys and values as matched
 * by Route.path.re to it's Route.path.keys
 *
 * @param {Route} route - a Route
 * @param {RegExp} regexp_params - result of Route's matched regexp
 * @return {object|undefined}
 */
const decompile = (route, regex_params) => {
  // regex_params is probably null because
  // Route.path.re.exec didn't match anything
  if (!regex_params) {
    return undefined
  }

  const params = {}
  regex_params.forEach((param, idx) => {
    if (idx) { // ignore 0 index
      const key = route.path.keys[idx - 1]
      params[key.name] = param
    }
  })

  // if params is 'empty' return undefined instead of an empty object
  if (Object.keys(params).length) {
    return params
  }
  return undefined
}

/*
 * The following are just "helper" functions to convert
 * a set of arguments into a array that can then be used
 * for compiling
 */
const verb = (method, path, args, body) => {
  return [method, path, args, body]
}

// used for exporting some common http verbs
const verbs = {}

const http_methods = [
  "get", "put", "post", "delete", "head"
]

http_methods.forEach((method) => {
  verbs[method] = verb.bind(null, method)
})

module.exports = {
  verb,
  verbs,
  compile,
  decompile
}
