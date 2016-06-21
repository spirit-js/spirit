var core = require("./lib/core/core")

var node_adapter = require("./lib/core/node_adapter")

var router = require("./lib/router/router")
var routes = require("./lib/router/routes")
//var resources = require("./lib/router/resource")
//var response_map = require("./lib/router/response-map")

module.exports = {
  // spirit-core
  core: core.main,

  // spirit-nodejs-adapter  (adapter)
  node: node_adapter.adapter,

  // spirit-router  (handler)
  route: {
    define: router.define,
    get: routes.verbs.get
  }
}
