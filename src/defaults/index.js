/*
 * Middleware for setting up some default middleware everyone will probably
 * need
 */

const parseurl = require("parseurl")


module.exports = function() {
  return function(req, res, next) {
    const p = parseurl(req, true)
    console.log(req.url)
    next()
  }
}
