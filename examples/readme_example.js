const {spirit, define, routes} = require("../index")
const http = require("http")

const index = () => {
  return "Hello World"
}

const param_example = (str) => {
  return "Hi, " + str
}

const app = define([
  routes.get("/", [], index),
  routes.resources("/blah")
])

const site = define([
  routes.route(app),
  routes.resources("/new_public")
])

const server = http.createServer(spirit(site))
server.listen(3000)
