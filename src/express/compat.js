/*
 * General Express compatibility functions
 *
 */
const Promise = require("bluebird")
Promise.onPossiblyUnhandledRejection(function(e, promise) {
  throw e;
});

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
 * for express `res` api compatibility
 * attaches all exported functions from src/express/res.js
 * to node HTTP response object
 *
 * as well as attaching a ref to the node HTTP request object
 * on `res.req`
 *
 * NOTE: this function makes me sad :(
 *
 * @param {http.Request} req - node http Request object
 * @param {http.Response} res - node http Response object
 */
const express_res = require("./res")
const res = (req, res) => {
  res.req = req
  res.redirect = express_res.redirect
  res.sendFile = express_res.sendFile
}

module.exports = {
  adapter,
  res
}
