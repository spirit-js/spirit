/*
 * General Express compatibility functions
 *
 */

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
 * for express response compatibility
 * attaches all exported functions from src/express/res.js
 * to node HTTP response object
 *
 * as well as attaching a ref to the node HTTP request object
 * on `res.req`
 *
 * @param {http.Request} req - node http Request object
 * @param {http.Response} res - node http Response object
 */
const express_res = require("./res")
const res = (req, res) => {
  res.req = req
  Object.keys(express_res).forEach((key) => {
    res[key] = express_res[key]
  })
}

module.exports = {
  adapter,
  res
}
