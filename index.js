var core = require("./lib/core/core")
var defaults = require("./lib/defaults/index")

var router = require("./lib/router/router")
var routes = require("./lib/router/routes")
var resources = require("./lib/router/resource")

var response_map = require("./lib/router/response-map")

module.exports = {
  // core
  spirit: core.handler,
  define: core.define,
  site_defaults: defaults,

  // router & route
  routes: Object.assign({
    define: router.define,
    route: router.route,
    not_found: router.not_found,
    resources: resources
  }, routes.verbs),

  // response helpers
  response: response_map.create,
  redirect: response_map.redirect
}
