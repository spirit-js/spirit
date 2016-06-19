var core = require("./lib/core/core")
var node_adapter = require("./lib/core/node_adapter")

var router = require("./lib/router/router")
var routes = require("./lib/router/routes")
var resources = require("./lib/router/resource")

var response_map = require("./lib/router/response-map")

module.exports = {
  // core
  core: core.main,

  node: node_adapter.adapter,

  // router & route
  routes: Object.assign({
    route: router.route,
    not_found: router.not_found,
    resources: resources
  }, routes.verbs),

  // response helpers
  response: response_map.create,
  redirect: response_map.redirect
}
