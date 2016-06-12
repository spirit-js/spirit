const response = require("./response.js")
const router_response = require("../router/response")
const Promise = require("bluebird")
Promise.onPossiblyUnhandledRejection(function(e, promise) {
  throw e;
});

/**
 * Reduces over a List (array of functions)
 * when calling the functions they must
 * return a value or a promise
 * Each function is called sequentially
 *
 * `reducel` acts like a some function when observed
 * meaning it _returns_ (resolves the promise it returns)
 * the first value or fullfilled promise from the functions
 * that wasn't undefined
 *
 * _Technically_ it doesn't exit then, it keeps iterating
 * but does not call the remaining functions
 * and becomes almost like a no-op
 *
 * If an error occurs in one of the functions being iterated
 * it will halt and exit early and return a rejected promise
 *
 * @param {function[]} promises - an array of functions that either return a value or return a promise
 * @param {*[]} args - an array of arguments to each function in `promises`
 * @param {string} id - a name to associate this iteration (optional) TODO: this was added for future plans, might be removed if unneeded
 * @param {number} start_idx - the index of array `list.list` to start iterating on (optional) TODO: this might never be needed as well
 * @return {Promise}
 */
const reducel = (list, args, id, start_idx) => {
  let promises = list.list
  if (start_idx) {
    promises = list.list.slice(start_idx)
  }

  const p = Promise.resolve()

  return promises.reduce((accum, fn, idx) => {
    return accum.then((v) => {
      if (typeof v !== "undefined") {
        return v // if there is a value, stop iterating
      }
      return fn.apply(undefined, args)
    })
  }, p)
}

/**
 * checks if `p` is a promise, returning true or false
 *
 * @param {*} p - argument to check if promise
 * @return {Boolean}
 */
const is_promise = (p) => {
  if (p && p.then && typeof p.then === "function") {
    return true
  }
  return false
}

/**
 * map over List
 *
 * basically map's over a List.list with `pred`
 * returning a new List
 *
 * mainly used for setting up a List to be
 * passed into `reducel`
 *
 * @param {List} list - a List as returned by `define`
 * @param {function} pred - predicate function for map
 * @return {List}
 */
const mapl = (list, pred) => {
  return {
    _catch: list._catch,
    _then: list._then,
    list: list.list.map(pred),
    name: list.name
  }
}

/**
 * calls a (user) function with `args` (array of arguments)
 * wraps the result of `fn` as a Promise
 *
 * if it's not a function, it returns the value wrapped
 * as a Promise
 *
 * @param {function} fn - the function as defined by the user
 * @param {*[]} args - an array of arguments to `fn`
 * @return {Promise}
 */
const _call = (fn, args) => {
  if (typeof fn === "function") {
    return new Promise((resolve, reject) => {
      resolve(fn.apply(undefined, args))
    })
  }

  return Promise.resolve(fn)
}

/**
 * Resolve a Promise of a Promise (as it pertains to a response
 * map)
 *
 * For adding an extra step to resolve Promises that are
 * a response map, where the body itself is a promise
 *
 * This avoids the promise of a promise issue when dealing
 * with response maps
 *
 * @param {Promise} p - a promise
 * @return {Promise}
 */
const _resolvep_rmap = (p) => {
  return p.then((result) => {
    // if it is a response map, resolve the body
    if (response.is_response(result)
        && is_promise(result.body)) {
      return new Promise((resolve, reject) => {
        result.body.then((body) => {
          result.body = body
          resolve(result)
        })
      })
    }
    // otherwise just return
    return result
  })
}

/**
 * an express adapter that takes a express middleware as `fn`
 * and an array of arguments [req, res]
 *
 * it returns back a function that returns a Promise
 *
 * @param {function} fn - a express middleware
 * @param {array} args - arguments to `fn`, most likely [req, res]
 * @return {function}
 */
const adapter = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("core.adapter was called on a non-function; most likely you are trying to load a route without calling routes.route()")
  }

  return function(req, res) {
    return new Promise((resolve, reject) => {
      function next(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
      fn.call(undefined, req, res, next)
    })
  }
}

/**
 * returns a nice error message
 *
 * @param {*} err - an error
 * @return {string}
 */
const _err_handler = (err) => {
  // TODO
  let msg
  if (err && err.toString) {
    msg = err.toString()
  } else {
    msg = err
  }
  return response.internal_err(msg)
}

/**
 * http incoming request handler
 *
 * @param {List} list - a result of calling define()
 * @param {http.Request} req - http.Request object
 * @param {http.Response} res - http.Response object
*/
const _handler = (list, req, res) => {
  return reducel(list, [req, res], "core")
    .then((err) => {
      // this is always an error
      // there is no successful result for express middleware
      // it never returns anything
      // except in the case of next(err)
      // or...
      // middlewares completed, that means nothing handled the response, err would be undefined
      throw(err)
    }).catch((err) => {
      if (!list._catch) {
        return response.send(res, _err_handler(err))
      }

      // call user's catch
      _resolvep_rmap(_call(list._catch, [err, req]))
        .then((result) => {
          if (typeof result === "undefined") {
            return response.send(res, _err_handler(err))
          }

          // FIXME
          // ideally shouldn't use router code in core
          // need clearer separation
          // (define may need to be reworked)
          router_response.response(req, res, result)
        })
        .catch((new_err) => {
          response.send(res, _err_handler(new_err))
        })
    })
}

/**
 * returns a promise-like list
 * for use with `reducel` `mapl`
 *
 * @public
 * @param {string} name - optional, name of this List
 * @param {function[]} list - an array of functions
 * @return {List}
 */
const define = (name, list) => {
  if (!list) {
    list = name
    name = ""
  }

  // guards
  if (typeof name !== "string" || !Array.isArray(list)) {
    throw new TypeError("Wrong argument types to `define`, expecting (string, array)")
  }
  if (list.length === 0) {
    throw new Error("`define` with an empty array does nothing")
  }

  function setter(prop) {
    return function(fn) {
      if (typeof fn !== "function") {
        throw new TypeError("Expected a function")
      }
      this[prop] = fn
      return this
    }
  }

  return {
    name,
    list: list.slice(),
    then: setter.call(this, "_then"),
    catch: setter.call(this, "_catch")
  }
}

/**
 * Creates a http handler
 *
 * @public
 * @param {List} middlewares - a list as returned by define()
 * @return {function}
 */
const handler = (middlewares) => {
  if (Array.isArray(middlewares)) {
    middlewares = { list: middlewares }
  }
  // guard
  if (!middlewares.list || !Array.isArray(middlewares.list)) {
    throw(new Error("Expected an Array or a `define` List as an argument"))
  }

  middlewares = mapl(middlewares, (middleware) => {
    return adapter(middleware)
  })

  return (req, res) => {
    _handler(middlewares, req, res)
  }
}

module.exports = {
  handler,
  define,
  reducel,
  adapter,
  _call,
  mapl,
  _handler,
  _err_handler,
  _resolvep_rmap,
  is_promise
}
