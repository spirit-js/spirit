var core = require("./lib/core/core")

var defaults = require("./lib/defaults/index")

var router = require("./lib/router/router")
var routes = require("./lib/router/routes")

var resources = require("./lib/router/resource")

module.exports = {
  server: core.server,
  define: core.define,

  site_defaults: defaults,

  routes: Object.assign({
    define: router.define,
    route: router.route,
    resources: resources
  }, routes.verbs)
}
