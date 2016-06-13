/*
 * This benchmark adds sees how well spirit handles a
 * multitude of routes it has to try before reaching the right
 * one
 *
 * So 11 routes are tried in `app` before the correct "/" one
 * As well as 1 additional router middleware in `other`
 * And 1 Express middleware (that doesn't do anything)
 *
 */
const spirit = require("../../index")
const define = spirit.define
const routes = spirit.routes

const http = require("http")

// will exit early on this one, but just tossing it in there
const other = define("/other", [
  routes.get("/a", [], () => { return "nope" }),
  routes.get("/b", [], () => { return "nope" })
])

const app = define([
  routes.get("/a", [], () => { return "nope" }),
  routes.get("/b", [], () => { return "nope" }),
  routes.get("/c", [], () => { return "nope" }),
  routes.get("/c", [], () => { return "nope" }),
  routes.get("/d", [], () => { return "nope" }),
  routes.get("/e", [], () => { return "nope" }),
  routes.get("/f", [], () => { return "nope" }),
  routes.get("/g", [], () => { return "nope" }),
  routes.get("/h", [], () => { return "nope" }),
  routes.get("/i", [], () => { return "nope" }),
  routes.get("/j", [], () => { return "nope" }),
  routes.get("/", [], () => { return "Hello World" })
])

const site = define([
  (req, res, next) => {
    next() // dummy express middleware
  },
  routes.route(other),
  routes.route(app)
])

http.createServer(spirit.spirit(site)).listen(3009)
