const http = require("http")
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
const mapl = function(list, pred) {
  return {
    _catch: list._catch,
    _then: list._then,
    list: list.list.map(pred),
    name: list.name
  }
}

/**
 * calls a user function with `args` (array of arguments)
 *
 * wraps the result of `fn` as a Promise
 *
 * @param {function} fn - the function as defined by the user
 * @param {*[]} args - an array of arguments to `fn`
 * @return {Promsie}
 */
const _call = (fn, args) => {
  return Promise.resolve(fn.apply(undefined, args))
}

/**
 * an error handler for _handler
 *
 * @param {*} err - a error as passed by a middleware
 * @param {http.Response} res - node http Response object
 */
const _err_handler = (err, res) => {
  res.writeHead(500)

  if (err) {
    // TODO
    res.write(err.toString())
    res.write(err.stack)
  }

  res.end()
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
      // middlewares completed, that means nothing handled the response
      // if it returns something, its the result of next(err)
      throw(err)
    }).catch((err) => {
      // if a middleware throws

      if (list._catch) {
        try {
          list._catch(err, req, res)
        } catch(e) { // would be a different error
          _err_handler(e, res)
        }
      } else {
        _err_handler(err, res)
      }
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
 * Creates a node http server with leaf attached
 * If a port is provided it'll automatically start the server
 *
 * @public
 * @param {List} middlewares - a list as returned by define()
 * @param {number} port - optional port
 * @return {http.Server}
 */
const server = (middlewares, port) => {
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

  const serv = http.createServer((req, res) => {
    _handler(middlewares, req, res)
  })

  if (port) {
    serv.listen(port)
  }
  return serv
}

module.exports = {
  server,
  define,
  reducel,
  adapter,
  _call,
  mapl,
  _handler
}
