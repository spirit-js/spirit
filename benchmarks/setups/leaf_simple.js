const {leaf, define, routes} = require("../../index")
const http = require("http")

const app = define([
  routes.get("/", [], () => { return "Hello World" })
])

const site = define([
  routes.route(app)
])

http.createServer(leaf(site)).listen(3009)
