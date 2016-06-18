/**
 * utility functions for working with Promises
 */

const Promise = require("bluebird")
Promise.onPossiblyUnhandledRejection(function(e, promise) {
  throw e;
});

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
 * calls a function with `args` (array of arguments)
 * wraps the result of `fn` as a Promise
 *
 * if it's not a function, it returns the value wrapped
 * as a Promise
 *
 * @param {function} fn - the function as defined by the user
 * @param {*[]} args - an array of arguments to `fn`
 * @return {Promise}
 */
const callp = (fn, args) => {
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
const resolve_response = (p) => {
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

module.exports = {
  callp,
  resolve_response,
  is_promise
}

