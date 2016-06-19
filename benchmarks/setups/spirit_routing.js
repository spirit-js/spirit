const spirit = require("../../index")
const routes = spirit.routes

const admin_index = () => {
  return "admin index"
}

const admin = routes.def("/admin", [
  routes.get("/", [], admin_index)
])

const app = routes.def([
  routes.get("/", [], "Hello World"),
  admin,
  routes.wrap(admin, [])
])

const site = spirit.node(app, [])

const http = require("http")
http.createServer(site).listen(3009)
