const leaf = require("../../index")
const define = leaf.define
const routes = leaf.routes

const http = require("http")

const app = define([
  routes.get("/", [], () => { return "Hello World" })
])

const site = define([
  routes.route(app)
])

http.createServer(leaf.leaf(site)).listen(3009)
