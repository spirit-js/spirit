const routes = require("./routes")
const response = require("./response")
const p_utils = require("../core/promise_utils")

const Promise = require("bluebird")

/**
 * sees if there's a match with route `compiled_route` based on
 * the incoming requests method and path
 *
 * @param {Route} route - a Route (from routes.compile)
 * @param {string} req_method - the incoming request method
 * @param {string} req_path - the incoming request's url
 * @return {array}
 */
const _lookup = (route, req_method, req_path) => {
  // lower case route.method here instead of in routes.compile()
  if (route.method.toLowerCase() === req_method.toLowerCase() || route.method === "*") {
    const params = route.path.re.exec(req_path)
    if (params) {
      return params
    }
  }
}

/**
 * Destructures against `obj` the keys of `args`
 * Prioritizes `obj`.params then `obj` when look up
 *
 * Returns an array of values ordered the same way as `args`
 *
 * @param {string[]} args - a string of keys to destructure in `obj`
 * @param {object} obj - a map
 * @return {*[]}
 */
const _destructure = (args, obj) => {
  function lookup(k, o) {
    if (typeof o === "undefined") {
      return undefined
    }
    return o[k]
  }

  return args.map((arg) => {
    let v

    // if arg is an array, do not assume lookup
    // return it directly
    if (Array.isArray(arg)) {
      v = lookup(arg[0], obj)
      if (arg.length === 1) {
        return v
      }
      return v[arg[1]]
    }

    // otherwise make assumptions of where to look
    // prioritizing certain keys
    const priority = ["params", ""] // "" means root of obj
    // return the first thing that's not undefined
    priority.some((p, i) => {
      let o = obj[p]
      if (p === "") {
        o = obj
      }
      v = lookup(arg, o)
      return (typeof v !== "undefined")
    })
    return v
  })
}

/////////////////////////////////////////// re-work

const wrap_router = (Route) => {
  return (request) => {
    const params = _lookup(Route, request.method, request.url)
    if (params) {
      request.params = routes.decompile(Route, params)
      return call_route(Route.body, Route.args, request)
    }
  }
}

const call_route = (fn, args, request) => {
  let de_args = _destructure(args, request)
  const ret = p_utils.callp(fn, de_args)
  return p_utils.resolve_response(ret)
}

const reduce_r = (arr, request) => {
  return arr.reduce((p, fn) => {
    return p.then((v) => {
      if (typeof v !== "undefined") {
        return v // if there is a value, stop iterating
      }
      // wrap_router()(request)
      return fn(request)
    })
  }, Promise.resolve())
}

const _handler = (compiled_routes, request) => {
    return reduce_r(compiled_routes, request).then((resp) => {
      if (typeof resp !== "undefined") {
        return response.response(request, resp)
      }
      return resp
    })
}

/**
 * "compiles" routes if it isn't already compiled
 * returning back a route handler function
 *
 * @public
 * @param {string} named - optional prefix to match
 * @param {*} routes - a route, or array of routes or compiled route(s)
 * @return {function} wrapped_route_handler
 */
const define = (named, arr_routes) => {
  if (typeof arr_routes === "undefined") {
    arr_routes = named
    named = ""
  }

  const compile_and_wrap = arr_routes.map((_route) => {
    if (typeof _route === "function") {
      // already been wrapped & compiled
      return _route
    }
    _route[1] = named + _route[1]
    return wrap_router(routes.compile.apply(undefined, _route))
  })

  return function(request) {
    if (request.url.indexOf(named) === 0) {
      return _handler(compile_and_wrap, request)
    }
  }
}

const wrap = (route, middleware) => {
  // check if compiled already, if not compile

  return (request) => {
    const r = route(request)
    if (r) {
      // wrap r
      // run middleware
      // return promise
    }
    return r
  }
}

module.exports = {
  _destructure,
  _lookup,

  define, // public
  reduce_r,
  call_route,
  wrap,   // public
  wrap_router
}
