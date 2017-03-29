/**
 * utility functions for working with Promises
 */

const Promise = require("bluebird")

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

const {is_response} = require("../http/response")
/**
 * Similar to `callp` with handling specific
 * to spirit http response maps that have a Promise as a body
 *
 * Special handling needs to be done to resolve the body first
 * and avoid passing along a Promise of a response map
 * which holds a Promise as it's body
 *
 * Additionally a empty catch is added to surpress
 * Promise warnings in node v7.x regarding async error handling
 *
 * @param {function} fn - function to call
 * @param {*[]} args - array of arguments to `fn`
 * @returns {Promise}
 */
const callp_response = (fn, args) => {
  if (typeof fn === "function") {
    return new Promise((resolve, reject) => {
      const v = fn.apply(undefined, args)
      if (is_response(v)
          && is_promise(v.body)) {
        return v.body.then((bd) => {
          v.body = bd
          resolve(v)
        }).catch((err) => reject(err))
      }
      resolve(v)
    })
  }

  return Promise.resolve(fn)
}

module.exports = {
  callp,
  is_promise,
  callp_response
}
