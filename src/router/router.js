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
 * Takes a List and compiles every element into a Route
 * Which returns back a List of Routes
 *
 * When define is called for route.get, route.post, etc.
 * .get and .post are just sugar functions that
 * return an array of information about a route
 *
 * But it then needs to be compiled into a Route to be used
 * when routing
 *
 * @param {List} list - a List as returned by `core.define`
 * @return {List}
 */
const list_to_routes = (list) => {
  // compile list into Routes
  const r = list.list.map((route) => {
    // if it's not an array, don't do anything
    if (!Array.isArray(route)) {
      return route
    }

    // append the list's name as a prefix to the route's path
    route[1] = list.name + route[1]
    return routes.compile.apply(undefined, route)
  })
  list.list = r
  return list
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

const express_compat = require("../express/compat")
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

/**
 * the router
 * returns a express middleware function
 *
 * @param {List} list - a List as returned by `core.define`
 * @return {function}
 */
const route = (list) => {
  list = list_to_routes(list)
  list = core.mapl(list, _route_handler)

  return function(req, res, next) {
    // this router middleware exits early if the list's name
    // does not match the base of the url
    if (list.name && req.url.indexOf(list.name) !== 0) {
      return next()
    }
    // sets a variable on req (for use in `resources`)
    // remove when `resources` and middlewares in general
    // get re-written / re-designed
    req._named_route = list.name

    let _next = false

    core.reducel(list, [req, res], "router")
      .then((result) => {
        // unset var from earlier when done
        req._named_route = ""
        // if results is empty, no route handled it
        if (typeof result === "undefined") {
          _next = true
          return result
        }
        if (!list._then) {
          return result
        }
        return core._resolvep_rmap(core._call(list._then, [result, req]))
      }).then((result) => {
        if (typeof result !== "undefined") {
          response.response(req, res, result)
        } else {
          if (_next) {
            next()
          } else {
            next("Expected `then` to return a valid response")
          }
        }
      }).catch((err) => {
        if (!list._catch) {
          return next(err)
        }

        // call user's catch
        core._resolvep_rmap(core._call(list._catch, [err, req]))
          .then((result) => {
            if (typeof result === "undefined") {
              return next(err)
            }
            response.response(req, res, result)
          })
          .catch((new_err) => {
            next(new_err)
          })
      })
  }
}

/////////////////////////////////////////// re-work

// function could be a a iterate over routes
// or a route_handler
const wrap_route_handler = (url, fn) => {
  return (request) => {
    if (url === true || lookup(url, request)) {
      return fn
    }
    return undefined
  }
}

const route_handler = (args, body) => {
  return (request) => {
    // destructure request
    // call body with args
    // return response (promise)
  }
}

const reduce_r = () => {
  
}

/**
 * "compiles" routes if it isn't already compiled
 * returning back a route handler function
 *
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

  const compiled_routes = routes.map((_route) => {
    url = url + named
    return wrap_route_handler(url, router_handler())
  })

  if (!named) {
    const url = true
  }
  return wrap_route_handler(url, reduce_route)
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
  route,
  _route_handler,
  list_to_routes,
  _destructure,
  _lookup,
  not_found
}
