const spirit = require("../../index")
const define = spirit.define
const routes = spirit.routes

const http = require("http")

const app = define([
  routes.get("/", [], () => { return "Hello World" })
])

const site = define([
  routes.route(app)
])

http.createServer(spirit.spirit(site)).listen(3009)
