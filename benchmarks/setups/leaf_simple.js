const leaf = require("../../lib/core/core")
const router = require("../../lib/router/router")
const routes = require("../../lib/router/routes").verbs

const app = leaf.define([
  routes.get("/", [], () => { return "Hello World" })
])

const site = leaf.define([
  router.route(app)
])

leaf.server(site, 3009)
