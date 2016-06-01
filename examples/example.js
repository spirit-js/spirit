const leaf = require("../index")
const define = leaf.define
const routes = leaf.routes

const index = () => {
  return "Hello World"
}

const param_example = (str) => {
  return "Hi, " + str
}

//const async_route = async (user_id) => {
//  const user = await get_user(user_id)
//  return "Hi, " + user.name
//}

// order matters, first match wins
// differs from express, no flow to next()
// a response is expected
//
// so multiple route matches is pointless
// and is a development error
const app = define([
  routes.get("/", [], index),
  //routes.get("/:param", ["param"], param_example),
  routes.resources("/blah")
//  router.get("/user/:user_id", ["user_id"], async_route)
])
//const authed_app = router.define([
//  router.get("/api/new", ["user"], some_function)
//])

// order matters, can flow to the next() since they
// are mostly compatible with express
//
// can wrap middlewares to do common things like named routes
// or grouped routes
const site = define([
//  leaf.site_defaults(),
  routes.route(app),
  //  auth(router.route(authed_app))
  routes.resources("/new_public")
  // TODO define("/public", routes.resources("public"))
])

const server = leaf.server(site, 3000)

/*
// no official auth pkg in mind, but it's basically a func
// that returns a compat middleware
// can wrap others etc to compose into a new middleware
// example auth:
function auth(middleware) { // middleware being absorbed, routes in this case

  // return a new middleware, 
  return function(req, res, next) {
    // do auth stuff here

    // then just continue as normal with the original
    middleware(req, res, next)
  }
}
*/
