const routes = require("./routes")
const response = require("./response")
const core = require("../core/core")
core.response = require("../core/response")

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
  if (route.method.toLowerCase() === req_method.toLowerCase()) {
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

/**
 * returns a express middleware that always 404's with body
 *
 * The express middleware is unimportant, it's wrapped as one
 * since the router only understands express middleware or Routes
 * The main handler only understands express middleware
 * So this makes it compatible for use for all cases
 *
 * NOTE: this is mostly done for express compat
 * (ideally this should be a route)
 *
 * @param {*} body - anything that response knows how to render
 * @return {function} Express middleware
 */
const not_found = (body) => {
  return (req, res, next) => {
    core._resolvep_rmap(core._call(body, [req]))
      .then((r) => {
        if (core.response.is_response(r)) {
          r.status = 404
        } else {
          r = core.response.not_found(r)
        }
        response.response(req, res, r)
      })
  }
}

/**
 * a handler for each a route
 *
 * this function is a predicate fn to be passed to `core.mapl`
 *
 * which then basically maps over a List by wrapping each item
 * with this function
 *
 * @param {*} compiled_route - a Route or Express middleware
 * @return {function}
 */
const _route_handler = (compiled_route) => {
  return function(req, res) {
    // this is probably a Express middleware
    if (typeof compiled_route === "function") {
      return express_compat.adapter(compiled_route)(req, res)
    }

    const params = _lookup(compiled_route, req.method, req.url)
    // not a matching route, move on
    if (!params) {
      return undefined
    }

    req.params = routes.decompile(compiled_route, params)
    return core._resolvep_rmap(core._call(compiled_route.body, _destructure(compiled_route.args, req)))
  }
}

/////////////////////////////////////////// re-work

// function could be a a iterate over routes
// or a route_handler
const wrap_route_handler = (url, fn) => {
  return (request) => {
    // matches def?
    if (url === true) {
      return fn()
    }

    // matches route?
    const params = _lookup(url, request.method, request.url)
    if (params) {
      request.params = routes.decompile(url, params)
      return fn(args, body)
    }

    return undefined
  }
}

const call_route = (route) => {
  return (request) => {
    const de_args = _destructure(route.args, request)
    const ret = core.utils.callp(route.body, de_args)
    return core.utils.resolve_response(ret)
  }
}

const reduce_r = (arr, args, start_idx) => {
  if (start_idx) {
    arr = arr.slice(start_idx)
  }

  return arr.reduce((p, fn) => {
    return p.then((v) => {
      if (typeof v !== "undefined") {
        return v // if there is a value, stop iterating
      }

      // url match
      const route = fn.apply(undefined, args)
      if (typeof route === "function") {
        return route.apply(undefined, args)
      }
    })
  }, Promise.resolve())
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
const def = (named, routes) => {
  if (typeof named !== "string") {
    if (!routes) {
      routes = named
    } else {
      named = ""
    }
  }

  if (!Array.isArray(routes)) {
    routes = [routes]
  }

  const compile_and_wrap = routes.map((_route) => {
    if (typeof _route === "function") {
      // already been wrapped & compiled
      return _route
    }

    const cr = compile(_route)
    return (request) => {
      // check url TODO
      if (url_ok) {
        return (request) => {
          call_route(cr)
        }
      }
      return undefined
    }
  })

  if (!named) {
    const url = true
  }

  return (request) => {
    // check url  (named prefix only) TODO
    return reduce_r(compiled_routes, request)
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
  _route_handler,
  _destructure,
  _lookup,
  not_found
}
